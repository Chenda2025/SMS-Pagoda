// Attendance Page JavaScript - Original version before premium UI refactor
import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { openModal } from '../components/modal.js';
import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';

let root = null;
let sessionTimer = null;
let state = {
  classrooms: [],
  academicYears: [],
  enrollments: [],
  attendanceRecords: [],
  timeSlots: [],
  subjects: [],
  timetableEntries: [],
  classSubjects: [],
  teachers: [],
  pagodas: [],
  kutis: [],

  selectedClassroom: '',
  selectedAcademicYear: '',
  selectedDate: new Date().toISOString().split('T')[0],
  searchQuery: '',
  selectedTimeSlot: null, // time_slot id (string) from timetable
  selectedSession: new Date().getHours() < 12 ? 'morning' : 'afternoon',
  yearUnlocked: false,
  classUnlocked: false,
  viewMode: 'desk', // 'desk' | 'list'
  selectedStudents: new Set(),
  openMenuFor: null,
  substitutions: [],
  substitutionModal: null,
  permissionModal: null,
  lateModal: null,
  loading: true,
  error: null,
  saving: false
};

const DESKS_PER_ROW_OPTIONS = [4, 5];

let draggedSeat = null; // { enrollmentId, deskNumber } set on dragstart, consumed on drop

function getSelectedClassroomObj() {
  return state.classrooms.find(c => String(c.id) === String(state.selectedClassroom));
}

function getSessionVal(slotId) {
  const slot = state.timeSlots.find(ts => String(ts.id) === String(slotId));
  if (slot && slot.session) {
    if (['morning', 'ព្រឹក'].includes(slot.session)) return 'morning';
    if (['afternoon', 'រសៀល'].includes(slot.session)) return 'afternoon';
  }
  if (slot && slot.start_time) {
    const hr = parseInt(slot.start_time.split(':')[0], 10);
    return hr >= 12 ? 'afternoon' : 'morning';
  }
  return 'morning';
}

function getSessionKhmer(slotId) {
  const val = getSessionVal(slotId);
  return val === 'morning' ? 'ព្រឹក' : 'រសៀល';
}

// Hover/transition/drag-feedback rules for the desk grid. Injected once
// since the markup is re-created on every render (CSS :hover keeps working
// across re-renders; JS-driven inline styles wouldn't).
function injectDeskStyles() {
  if (document.getElementById('attendance-desk-styles')) return;
  const style = document.createElement('style');
  style.id = 'attendance-desk-styles';
  style.textContent = `
    .desk-card { transition: box-shadow .2s ease, transform .2s ease; }
    .desk-card:hover { box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
    .seat-card { transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease; }
    .seat-card:hover { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1); }
    .seat-card.is-dragging { opacity: 0.4; }
    .seat-card.drag-over, .seat-empty.drag-over { border-color: var(--primary) !important; background: #eef2ff !important; }
    .status-dot { transition: background-color .25s ease, transform .15s ease; }
    .seat-card:active .status-dot { transform: scale(1.3); }
    .status-menu { animation: attendanceMenuIn .15s ease; }
    .name-btn { transition: color .15s ease; }
    .name-btn:hover { color: var(--primary); }
    @keyframes attendanceMenuIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .animate-spin { animation: spin 1s linear infinite; }
    [data-action="select-slot"]:hover { filter: brightness(0.97); transform: translateY(-1px); transition: filter .15s,transform .15s; }
    [data-action="select-slot"]:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
  `;
  document.head.appendChild(style);
}

const SESSION_LABELS = { morning: 'ព្រឹក', afternoon: 'រសៀល' };

// True when the stored session value (English or Khmer) matches a target English session key.
function sessMatches(stored, target) {
  return String(stored) === String(target) ||
         String(stored) === (SESSION_LABELS[target] || '');
}

function getCurrentSession() {
  return new Date().getHours() < 12 ? 'morning' : 'afternoon';
}

function fmtTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12}:00` : `${h12}:${String(m).padStart(2, '0')}`;
}
const STORAGE_KEY = 'attendance_filters';

function saveFilters() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    selectedClassroom: state.selectedClassroom,
    selectedAcademicYear: state.selectedAcademicYear,
    selectedTimeSlot: state.selectedTimeSlot,
  }));
}

function loadFilters() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

// Returns the Khmer lunar day number (1–14) for a given date string (YYYY-MM-DD).
// day_no in the timetable matches lunar moonDay, where day 8 is the Buddhist holiday (សីល).
function getLunarDayNo(dateStr) {
  try {
    const lunar = toKhmerLunarDate(new Date(dateStr));
    const day = lunar.moonDay;
    return Math.min(Math.max(day, 1), 14);
  } catch {
    return 1;
  }
}

// Checks if the date is a Buddhist holy day (ថ្ងៃសីល).
function isHolyDay(dateStr) {
  try {
    const lunar = toKhmerLunarDate(new Date(dateStr));
    return lunar.isSilDay === true;
  } catch {
    return false;
  }
}

// Returns timetable entries for the selected date filtered by selected class/year,
// enriched with slot, subject, and teacher objects, sorted by start time.
function getSubjectsForDateSession(date, session) {
  if (date === state.selectedDate) {
    // Use computeTodaySchedule so substitutions are included
    const entries = computeTodaySchedule().filter(e => e.slot?.session === session);
    const subjectIdSet = new Set(entries.map(e => e.subjectId || null));
    return subjectIdSet.size > 0 ? [...subjectIdSet] : [null];
  }
  // For other dates in a range, use the base timetable (substitutions aren't loaded for other dates)
  const dayNo = getLunarDayNo(date);
  const slotMap = Object.fromEntries(state.timeSlots.map(ts => [ts.id, ts]));
  const entries = state.timetableEntries
    .filter(tt =>
      String(tt.classroom) === String(state.selectedClassroom) &&
      String(tt.academic_year) === String(state.selectedAcademicYear) &&
      tt.day_no === dayNo
    )
    .map(tt => ({ subjectId: tt.subject || null, slot: slotMap[tt.time_slot] || null }))
    .filter(e => e.slot && e.slot.session === session);
  const subjectIdSet = new Set(entries.map(e => e.subjectId));
  return subjectIdSet.size > 0 ? [...subjectIdSet] : [null];
}

function computeTodaySchedule() {
  const dayNo = getLunarDayNo(state.selectedDate);

  const subjectMap = Object.fromEntries(state.subjects.map(s => [s.id, s]));
  const slotMap = Object.fromEntries(state.timeSlots.map(ts => [ts.id, ts]));
  const teacherMap = Object.fromEntries(state.teachers.map(t => [t.id, t]));

  return state.timetableEntries
    .filter(tt =>
      String(tt.classroom) === String(state.selectedClassroom) &&
      String(tt.academic_year) === String(state.selectedAcademicYear) &&
      tt.day_no === dayNo
    )
    .map(tt => {
      const sub = (state.substitutions || []).find(s =>
        String(s.classroom) === String(state.selectedClassroom) &&
        s.change_date === state.selectedDate &&
        String(s.time_slot) === String(tt.time_slot) &&
        String(s.original_subject) === String(tt.subject)
      );
      const effectiveSubjectId = sub ? sub.new_subject : tt.subject;
      const cs = state.classSubjects.find(
        x => String(x.classroom) === String(state.selectedClassroom) && String(x.subject) === String(effectiveSubjectId)
      );
      const teacher = sub?.new_teacher
        ? (teacherMap[sub.new_teacher] || null)
        : (cs ? (teacherMap[cs.teacher] || null) : null);
      return {
        timetableId: tt.id,
        timeSlotId: String(tt.time_slot),
        subjectId: effectiveSubjectId,
        originalSubjectId: tt.subject,
        subject: subjectMap[effectiveSubjectId] || null,
        slot: slotMap[tt.time_slot] || null,
        teacher,
        isSubstituted: !!sub,
      };
    })
    .filter(e => e.slot)
    .sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time));
}

// Returns the time_slot id (string) best matching the current time:
//   1. slot whose start–end window contains now  (active)
//   2. next upcoming slot (not yet started)
//   3. last slot of the day (all slots already passed)
function getCurrentTimeSlotId(schedule) {
  if (!schedule.length) return null;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

  const active = schedule.find(e => e.slot.start_time <= hhmm && hhmm < e.slot.end_time);
  if (active) return active.timeSlotId;

  const upcoming = schedule.find(e => e.slot.start_time > hhmm);
  if (upcoming) return upcoming.timeSlotId;

  return schedule[schedule.length - 1].timeSlotId;
}

const STATUS_OPTIONS = [
  { value: 'absent',     label: 'អវត្តមាន(ឥតច្បាប់)', color: '#dc2626', icon: 'circle-x' },
  { value: 'permission', label: 'ឈប់មានច្បាប់',      color: '#ea580c', icon: 'file-check' },
  { value: 'late',       label: 'យឺត',               color: '#f59e0b', icon: 'clock' },
  { value: 'dropout',    label: 'សិស្សឈប់រៀន',        color: '#7c3aed', icon: 'user-minus' }
];

async function fetchData() {
  state.loading = true;
  update();
  try {
    const [cls, ay, tsRes, subRes, ttRes, csRes, tchRes, pagRes, kutRes] = await Promise.all([
      api.get('/api/core/classrooms/'),
      api.get('/api/core/academic-years/'),
      api.get('/api/core/time-slots/'),
      api.get('/api/core/subjects/'),
      api.get('/api/core/timetable/'),
      api.get('/api/core/class-subjects/'),
      api.get('/api/users/teachers/'),
      api.get('/api/core/pagodas/'),
      api.get('/api/core/kutis/'),
    ]);
    const saved = loadFilters();

    if (cls.ok) state.classrooms = (cls.data || []).slice().sort((a, b) => a.id - b.id);
    if (tsRes.ok) state.timeSlots = tsRes.data || [];
    if (subRes.ok) state.subjects = subRes.data || [];
    if (ttRes.ok) state.timetableEntries = ttRes.data || [];
    if (csRes.ok) state.classSubjects = csRes.data || [];
    if (tchRes.ok) state.teachers = tchRes.data || [];
    if (pagRes.ok) state.pagodas = pagRes.data || [];
    if (kutRes.ok) state.kutis   = kutRes.data || [];

    if (ay.ok) {
      state.academicYears = ay.data || [];
      const savedYear = saved.selectedAcademicYear && state.academicYears.find(y => String(y.id) === String(saved.selectedAcademicYear));
      if (savedYear) state.selectedAcademicYear = saved.selectedAcademicYear;
      else {
        const current = state.academicYears.find(y => y.is_current);
        if (current) state.selectedAcademicYear = current.id;
        else if (state.academicYears.length > 0) state.selectedAcademicYear = state.academicYears[0].id;
      }
    }

    if (state.classrooms.length > 0) {
      const savedClass = saved.selectedClassroom && state.classrooms.find(c => String(c.id) === String(saved.selectedClassroom));
      state.selectedClassroom = savedClass ? saved.selectedClassroom : state.classrooms[0].id;
    }

    // Session always follows current time: before noon = morning, noon or after = afternoon.
    const todaySchedule = computeTodaySchedule();
    state.selectedSession = getCurrentSession();

    // Restore saved time slot only if it belongs to the current session; otherwise auto-pick.
    const sessionSlots = todaySchedule.filter(e => e.slot?.session === state.selectedSession);
    const savedSlotValid = saved.selectedTimeSlot && sessionSlots.find(e => e.timeSlotId === saved.selectedTimeSlot);
    state.selectedTimeSlot = savedSlotValid
      ? saved.selectedTimeSlot
      : getCurrentTimeSlotId(sessionSlots.length > 0 ? sessionSlots : todaySchedule);

    checkPermissionReminders();
    checkAttendanceWarnings();
    if (state.selectedClassroom && state.selectedAcademicYear) {
      await fetchAttendanceData();
    } else {
      state.loading = false;
      update();
    }
  } catch (err) {
    state.error = err.message;
    state.loading = false;
    update();
  }
}

async function fetchAttendanceData() {
  if (!state.selectedClassroom || !state.selectedAcademicYear || !state.selectedDate) return;
  state.loading = true;
  update();
  try {
    // We fetch all enrollments and attendance, then filter client-side 
    // to ensure compatibility without assuming advanced DRF filters are set up.
    const [enRes, attRes, stuRes, subRes, mpRes, dpRes] = await Promise.all([
      api.get('/api/students/enrollments/'),
      api.get('/api/attendance/attendance/'),
      api.get('/api/students/list/'),
      api.get('/api/core/schedule-substitutions/'),
      api.get('/api/students/multiple-permissions/'),
      api.get('/api/students/dropouts/')
    ]);

    if (!enRes.ok || !attRes.ok || !stuRes.ok) throw new Error('បរាជ័យក្នុងការទាញយកទិន្នន័យ');
    if (subRes.ok) {
      state.substitutions = (subRes.data || []).filter(s =>
        String(s.classroom) === String(state.selectedClassroom) &&
        s.change_date === state.selectedDate
      );
    }
    
    if (mpRes.ok) {
      state.multiplePermissions = mpRes.data || [];
    } else {
      state.multiplePermissions = [];
    }

    if (dpRes.ok) {
      state.dropouts = dpRes.data || [];
    } else {
      state.dropouts = [];
    }

    const allStudents = stuRes.data || [];
    const studentMap = {};
    allStudents.forEach(s => studentMap[s.id] = s);

    // Filter enrollments by classroom and academic year
    const classEnrollments = (enRes.data || []).filter(e =>
      String(e.classroom) === String(state.selectedClassroom) &&
      String(e.academic_year) === String(state.selectedAcademicYear)
    );

    // Map students, sorted alphabetically by name
    state.enrollments = classEnrollments.map(e => ({
      ...e,
      studentData: studentMap[e.student] || null
    })).filter(e => e.studentData).sort((a, b) => {
      const nameA = ((a.studentData.last_name || '') + ' ' + (a.studentData.first_name || '')).trim();
      const nameB = ((b.studentData.last_name || '') + ' ' + (b.studentData.first_name || '')).trim();
      return nameA.localeCompare(nameB, 'km');
    });

    // Load all attendance records for this session (all subjects)
    state.attendanceRecords = (attRes.data || []).filter(a =>
      String(a.classroom) === String(state.selectedClassroom) &&
      String(a.academic_year) === String(state.selectedAcademicYear) &&
      a.attendance_date === state.selectedDate &&
      sessMatches(a.session, state.selectedSession)
    );

  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    state.loading = false;
    update();
  }
}

// Sets attendance status for one or many students at once. Used both for a
// single click on a student's name and for bulk actions when multiple
// students are checked.
async function checkAndSendWarning(studentIds, appliedStatus) {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) return;

  const selectedD = new Date(state.selectedDate);
  const yyyy = selectedD.getFullYear();
  const mm = String(selectedD.getMonth() + 1).padStart(2, '0');
  const monthStart = `${yyyy}-${mm}-01`;
  const lastDay = new Date(yyyy, selectedD.getMonth() + 1, 0).getDate();
  const monthEnd = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`;

  const res = await api.get('/api/attendance/attendance/');
  if (!res.ok) return;

  const monthRecords = (res.data || []).filter(a =>
    String(a.classroom) === String(state.selectedClassroom) &&
    String(a.academic_year) === String(state.selectedAcademicYear) &&
    a.attendance_date >= monthStart &&
    a.attendance_date <= monthEnd
  );

  const dateStr = `${state.selectedDate.split('-')[2]}/${mm}/${yyyy}`;
  const classroom = getSelectedClassroomObj();

  for (const studentId of studentIds) {
    const recs = monthRecords.filter(a => String(a.student) === String(studentId));
    // Count unique dates per status (a student may have multiple records per day for multiple subjects)
    const absentCount = new Set(recs.filter(a => a.status === 'absent').map(a => a.attendance_date)).size;
    const permCount   = new Set(recs.filter(a => a.status === 'permission').map(a => a.attendance_date)).size;
    const lateCount   = new Set(recs.filter(a => a.status === 'late').map(a => a.attendance_date)).size;

    let shouldWarn = false;
    if (appliedStatus === 'absent' && absentCount >= 2 && (absentCount - 2) % 2 === 0) shouldWarn = true;
    else if (appliedStatus === 'permission' && permCount >= 3 && (permCount - 3) % 2 === 0) shouldWarn = true;
    else if (appliedStatus === 'late' && lateCount >= 4 && (lateCount - 4) % 2 === 0) shouldWarn = true;

    if (!shouldWarn) continue;

    const en = state.enrollments.find(e => String(e.student) === String(studentId));
    const s = en?.studentData;
    if (!s) continue;

    const pagoda = state.pagodas.find(p => String(p.id) === String(s.current_pagoda));
    const kuti   = state.kutis.find(k => String(k.id) === String(s.kuti));

    const msg =
`🔔 សេចក្តីប្រគេនដំណឹង 🔔
សាលា ពុ.អ.វិ.ស.ទ.ន.រ.
----- សារព្រមាន -----
សិស្សឈ្មោះ ៖ ${(s.last_name || '') + ' ' + (s.first_name || '')}
ថ្នាក់ទី ៖ ${classroom?.class_name || '---'}
វត្ត ៖ ${pagoda?.name || '---'}
កុដិ ៖ ${kuti?.kuti_name || '---'}
អវត្តមាន ៖ ${absentCount} ដង
ច្បាប់ ៖ ${permCount} ដង
យឺត ៖ ${lateCount} ដង
កាលបរិច្ឆេទ៖ ${dateStr}
ដូចបានប្រគេនខាងលើនេះសូមសិស្សនិមន្តមករៀនឲ្យបានទៀងទាត់។`;

    try {
      await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgConfig.chatId, text: msg })
      });
    } catch { /* silent */ }
  }
}


function getEffectiveStatus(studentId, sData) {
  const rec = state.attendanceRecords.find(a => String(a.student) === String(studentId));
  let currentStatus = rec ? rec.status : null;
  
  if (checkIsDropout(studentId, sData)) {
    return 'dropout';
  }
  
  const activePerm = (state.multiplePermissions || []).find(p => 
    String(p.student) === String(studentId) &&
    p.start_date <= state.selectedDate && p.end_date >= state.selectedDate
  );
  
  if (activePerm) {
    return 'permission';
  }
  
  return currentStatus;
}

function checkIsDropout(studentId, sData) {
  const studentDropouts = (state.dropouts || []).filter(d => String(d.student) === String(studentId));
  if (studentDropouts.length > 0) {
    studentDropouts.sort((a, b) => b.id - a.id); // descending
    if (studentDropouts[0].status === true) return true;
    if (studentDropouts[0].status === false) return false;
  }
  return sData?.status === 'dropped';
}

async function bulkSetStatus(studentIds, status, reason = '', lateTime = null) {
  const todaySchedule = computeTodaySchedule();
  const sessionVal = state.selectedSession;
  
  if (status === 'late' && !lateTime) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    lateTime = `${h}:${m}:${s}`;
  }

  // All unique subjects scheduled for this session — one record per subject per student
  const sessionEntries = todaySchedule.filter(e => e.slot?.session === sessionVal);
  const subjectIdSet = new Set(sessionEntries.map(e => e.subjectId || null));
  const uniqueSubjectIds = subjectIdSet.size > 0 ? [...subjectIdSet] : [null];

  const requests = studentIds.map(id => {
    const existingRecords = state.attendanceRecords.filter(a => String(a.student) === String(id));
    const en = state.enrollments.find(e => String(e.student) === String(id));
    const isDropoutNow = checkIsDropout(id, en?.studentData);

    const activePerm = (state.multiplePermissions || []).find(p =>
      String(p.student) === String(id) &&
      p.start_date <= state.selectedDate && p.end_date >= state.selectedDate
    );

    const studentPatch = (status === 'dropout' && !isDropoutNow)
      ? Promise.all([
          api.patch(`/api/students/list/${id}/`, { status: 'dropped' }),
          api.post('/api/students/dropouts/', { student: id, reason, status: true })
        ]).then(() => ({ ok: true }))
      : (status === 'clear' && isDropoutNow)
        ? Promise.all([
            api.patch(`/api/students/list/${id}/`, { status: 'active' }),
            api.post('/api/students/dropouts/', { student: id, reason: 'ត្រឡប់មកវិញ', status: false })
          ]).then(() => ({ ok: true }))
        : Promise.resolve({ ok: true });

    const permPatch = (status === 'clear' && activePerm)
      ? api.del(`/api/students/multiple-permissions/${activePerm.id}/`).then(() => ({ ok: true })).catch(() => ({ ok: false }))
      : Promise.resolve({ ok: true });

    // One request per subject in the session
    const subjectRequests = uniqueSubjectIds.map(subjectId => {
      const existing = existingRecords.find(a =>
        subjectId != null ? String(a.subject) === String(subjectId) : !a.subject
      );

      if (existing && !String(existing.id).startsWith('temp-')) {
        if (status === 'clear') {
          return api.del(`/api/attendance/attendance/${existing.id}/`)
            .then(res => ({ ok: res.ok || res.status === 204 }));
        }
        if (existing.status === status) return Promise.resolve({ ok: true });
        
        const payload = { status };
        if (status === 'late') {
          payload.late_time = lateTime;
        }
        return api.patch(`/api/attendance/attendance/${existing.id}/`, payload);
      }

      if (status === 'clear') return Promise.resolve({ ok: true });

      const payload = {
        student: id,
        classroom: state.selectedClassroom,
        academic_year: state.selectedAcademicYear,
        attendance_date: state.selectedDate,
        session: sessionVal,
        subject: subjectId,
        status
      };
      if (status === 'late') {
        payload.late_time = lateTime;
      }
      return api.post('/api/attendance/attendance/', payload);
    });

    return Promise.all([...subjectRequests, studentPatch, permPatch])
      .then(results => ({ ok: results.every(r => r.ok) }));
  });

  // Optimistic UI Update for instant feedback
  studentIds.forEach(id => {
    const en = state.enrollments.find(e => String(e.student) === String(id));
    if (status === 'clear') {
      state.attendanceRecords = state.attendanceRecords.filter(a => String(a.student) !== String(id));
      if (en && en.studentData && en.studentData.status === 'dropped') en.studentData.status = 'active';
      if (!state.dropouts) state.dropouts = [];
      state.dropouts.push({ id: Date.now() + Math.random(), student: id, status: false });
      if (state.multiplePermissions) {
        state.multiplePermissions = state.multiplePermissions.filter(p =>
          !(String(p.student) === String(id) && p.start_date <= state.selectedDate && p.end_date >= state.selectedDate)
        );
      }
    } else {
      if (status === 'dropout' && en && en.studentData) {
        en.studentData.status = 'dropped';
        if (!state.dropouts) state.dropouts = [];
        state.dropouts.push({ id: Date.now() + Math.random(), student: id, status: true });
      }
      uniqueSubjectIds.forEach(subjectId => {
        const existingIdx = state.attendanceRecords.findIndex(a =>
          String(a.student) === String(id) &&
          (subjectId != null ? String(a.subject) === String(subjectId) : !a.subject)
        );
        if (existingIdx !== -1) {
          state.attendanceRecords[existingIdx] = { ...state.attendanceRecords[existingIdx], status, late_time: status === 'late' ? lateTime : null };
        } else {
          state.attendanceRecords.push({
            id: `temp-${id}-${subjectId}-${Date.now()}`,
            student: id,
            classroom: state.selectedClassroom,
            academic_year: state.selectedAcademicYear,
            attendance_date: state.selectedDate,
            session: sessionVal,
            subject: subjectId,
            status,
            late_time: status === 'late' ? lateTime : null
          });
        }
      });
    }
  });

  state.saving = true;
  update();

  try {
    const results = await Promise.all(requests);
    if (results.some(r => !r.ok)) throw new Error('បរាជ័យក្នុងការកត់ត្រា');

    const attRes = await api.get('/api/attendance/attendance/');
    if (attRes.ok) {
      state.attendanceRecords = (attRes.data || []).filter(a =>
        String(a.classroom) === String(state.selectedClassroom) &&
        String(a.academic_year) === String(state.selectedAcademicYear) &&
        a.attendance_date === state.selectedDate &&
        sessMatches(a.session, state.selectedSession)
      );
    }

    const pRes = await api.get('/api/students/multiple-permissions/');
    if (pRes.ok) state.multiplePermissions = pRes.data || [];
    if (status === 'clear') {
      showToast('បានដកចេញវិញ', 'success');
    } else {
      showToast(studentIds.length > 1 ? `បានកត់ត្រាវត្តមានសិស្ស ${studentIds.length} នាក់` : 'បានកត់ត្រាវត្តមានរួចរាល់', 'success');
      checkAndSendWarning(studentIds, status);
    }
  } catch (err) {
    showToast(err.message, 'error');
    fetchAttendanceData();
  } finally {
    state.saving = false;
    update();
  }
}

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const cur = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  while (cur <= end) {
    dates.push(`${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

async function applyPermissionRange(studentId, startDate, endDate, reason, selectedPermSession, permId) {
  const dates = getDatesInRange(startDate, endDate);
  const sessionVal = state.selectedSession;

  state.saving = true;
  update();
  try {
    const attRes = await api.get('/api/attendance/attendance/');
    const allAtt = attRes.ok ? (attRes.data || []) : [];

    await Promise.all(dates.flatMap(date => {
      let sessionsToApply = [];
      if (dates.length > 1) {
        sessionsToApply = ['morning', 'afternoon'];
      } else {
        if (selectedPermSession === 'all') {
          sessionsToApply = ['morning', 'afternoon'];
        } else {
          sessionsToApply = [selectedPermSession || sessionVal];
        }
      }

      return sessionsToApply.flatMap(sess => {
        const subjectIds = getSubjectsForDateSession(date, sess);
        return subjectIds.map(subjectId => {
          const existing = allAtt.find(a =>
            String(a.student) === String(studentId) &&
            String(a.classroom) === String(state.selectedClassroom) &&
            String(a.academic_year) === String(state.selectedAcademicYear) &&
            a.attendance_date === date &&
            sessMatches(a.session, sess) &&
            (subjectId != null ? String(a.subject) === String(subjectId) : !a.subject)
          );
          if (existing) {
            if (existing.status === 'permission') return Promise.resolve({ ok: true });
            return api.patch(`/api/attendance/attendance/${existing.id}/`, { status: 'permission' });
          }
          return api.post('/api/attendance/attendance/', {
            student: studentId,
            classroom: state.selectedClassroom,
            academic_year: state.selectedAcademicYear,
            attendance_date: date,
            session: sess,
            subject: subjectId,
            status: 'permission'
          });
        });
      });
    }));

    // Always store multiple-permission record (even for 1 day) to track reasons and for consistency
    try {
      if (permId) {
        await api.patch(`/api/students/multiple-permissions/${permId}/`, {
          reason: reason || '',
          start_date: startDate,
          end_date: endDate,
        });
      } else {
        await api.post('/api/students/multiple-permissions/', {
          student: studentId,
          reason: reason || '',
          start_date: startDate,
          end_date: endDate,
          reminder_sent: false
        });
      }
      // Re-fetch multiple permissions
      const pRes = await api.get('/api/students/multiple-permissions/');
      if (pRes.ok) state.multiplePermissions = pRes.data || [];
    } catch (err) {
      console.error('Failed to save multiple permission:', err);
    }

    showToast(`បានកត់ត្រាច្បាប់ ${dates.length} ថ្ងៃ`, 'success');
    state.permissionModal = null;
    await fetchAttendanceData();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    state.saving = false;
    update();
  }
}

const KHMER_DAYS = ['ថ្ងៃអាទិត្យ', 'ថ្ងៃចន្ទ', 'ថ្ងៃអង្គារ', 'ថ្ងៃពុធ', 'ថ្ងៃព្រហស្បតិ៍', 'ថ្ងៃសុក្រ', 'ថ្ងៃសៅរ៍'];
function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Reminder only makes sense for multi-day leave -- a same-day permission's
// "day before return" is the request day itself.
async function checkPermissionReminders() {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) return;
  const today = localDateStr(new Date());

  try {
    const res = await api.get('/api/students/multiple-permissions/');
    const permissions = res.data || [];
    for (const r of permissions) {
      if (r.reminder_sent) continue;

      const totalDays = Math.round((new Date(r.end_date + 'T00:00:00') - new Date(r.start_date + 'T00:00:00')) / 86400000) + 1;
      if (totalDays <= 1) continue;

      const endDateObj = new Date(r.end_date + 'T00:00:00');
      const reminderObj = new Date(endDateObj);
      reminderObj.setDate(reminderObj.getDate() - 1);
      const reminderDateStr = localDateStr(reminderObj);

      if (reminderDateStr !== today) continue;

      const khmerNums = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
      const toKh = num => String(num).replace(/[0-9]/g, match => khmerNums[match]);
      const fmt = d => { const [y,m,day] = d.split('-'); return toKh(`${day}/${m}/${y}`); };
      const returnDate = new Date(r.end_date + 'T00:00:00');
      returnDate.setDate(returnDate.getDate() + 1);
      const returnStr = fmt(localDateStr(returnDate));
      const returnDayName = KHMER_DAYS[returnDate.getDay()];
      const msg =
`🔔 សេចក្តីប្រគេនដំណឹង 🔔
សាលា ពុ.អ.វិ.ស.ទ.ន.រ.
----- លិខិតសូមច្បាប់ -----
សិស្សឈ្មោះ ៖ ${r.student_name}
ចំនួនច្បាប់ ៖ ${toKh(totalDays)} (ថ្ងៃ)
ចាបផ្តើមថ្ងៃ៖ ${fmt(r.start_date)} ដល់ ${fmt(r.end_date)}
ថ្នាក់ទី ៖ ${r.classroom_name}
វត្ត ៖ ${r.pagoda_name}
កុដិ ៖ ${r.kuti_name}
----- ត្រូវត្រឡប់មកសិក្សាវិញ -----
នៅថ្ងៃទី ៖ ${returnStr} ( ${returnDayName} )
កាលបរិច្ឆេទ៖ ${fmt(today)}
ដូចបានប្រគេនខាងលើនេះសូមសិស្សនិមន្តមករៀនវិញ។`;

      await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgConfig.chatId, text: msg })
      });

      await api.patch(`/api/students/multiple-permissions/${r.id}/`, { reminder_sent: true });
    }
  } catch (err) {
    console.error('Failed to check permission reminders:', err);
  }
}

// Warning levels escalate by +2 past a per-category base (absence: 2,4,6,...;
// permission: 3,5,7,...; late: 4,6,8,...) and never go back down -- this
// returns the highest level `count` currently satisfies (0 if it hasn't even
// reached the base yet).
function currentWarningLevel(count, base) {
  if (count <= base) return 0;
  return base + Math.floor((count - base - 1) / 2) * 2;
}

// Sends a "សារព្រមាន" (warning) to Telegram once a student's cumulative
// absence/permission/late count for the current academic year crosses a new
// threshold level -- backed by the attendance-warnings table (one row per
// student per year holding the highest level already warned about for each
// category) so it fires exactly once per newly-crossed level, not on every
// page load. Unlike checkPermissionReminders/checkAttendanceWarnings on the
// monitor pages (scoped to the monitor's own classroom), this page has no
// notion of a "current" classroom of its own, so it checks every enrolled
// student in the current academic year, across every classroom.
async function checkAttendanceWarnings() {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) return;

  try {
    const [yearsRes, reportRes] = await Promise.all([
      api.get('/api/academic-years/'),
      api.get('/api/attendance/attendance/report-data/'),
    ]);
    if (!yearsRes.ok || !reportRes.ok) return;
    const year = (yearsRes.data || []).find(y => y.is_current) || (yearsRes.data || [])[0];
    if (!year) return;

    const [enrRes, warnRes] = await Promise.all([
      api.get(`/api/students/enrollments/students/?academic_year=${year.id}`),
      api.get(`/api/attendance/attendance-warnings/?academic_year=${year.id}`),
    ]);
    if (!enrRes.ok) return;

    const inRange = (d) => d >= year.start_date && (!year.end_date || d <= year.end_date);
    const warnByStudent = {};
    (warnRes.data || []).forEach(w => { warnByStudent[w.student] = w; });

    const reportData = reportRes.data || {};
    const khmerNums = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    const toKh = num => String(num).replace(/[0-9]/g, match => khmerNums[match]);
    const fmt = d => { const [y, m, day] = d.split('-'); return toKh(`${day}/${m}/${y}`); };
    const today = fmt(localDateStr(new Date()));

    for (const enr of (enrRes.data || [])) {
      const sid = enr.student_id;
      const rd = reportData[sid] || {};
      const absentCount = (rd.absentDates || []).filter(inRange).length;
      const permissionCount = (rd.permissionDates || []).filter(inRange).length;
      const lateCount = (rd.lateDates || []).filter(inRange).length;

      const existing = warnByStudent[sid] || { last_absent_warned: 0, last_permission_warned: 0, last_late_warned: 0 };
      const absentLevel = currentWarningLevel(absentCount, 2);
      const permissionLevel = currentWarningLevel(permissionCount, 3);
      const lateLevel = currentWarningLevel(lateCount, 4);

      const hasNewLevel = absentLevel > existing.last_absent_warned
        || permissionLevel > existing.last_permission_warned
        || lateLevel > existing.last_late_warned;
      if (!hasNewLevel) continue;

      const upsertRes = await api.post('/api/attendance/attendance-warnings/upsert/', {
        student: sid, academic_year: year.id,
        last_absent_warned: absentLevel, last_permission_warned: permissionLevel, last_late_warned: lateLevel,
      });
      if (!upsertRes.ok) continue;
      const w = upsertRes.data;

      const msg = `🔔 សេចក្តីប្រគេនដំណឹង 🔔
សាលា ពុ.អ.វិ.ស.ទ.ន.រ.
----- សារព្រមាន -----
សិស្សឈ្មោះ ៖ ${w.student_name}
ថ្នាក់ទី ៖ ${w.classroom_name}
វត្ត ៖ ${w.pagoda_name}
កុដិ ៖ ${w.kuti_name}
អវត្តមាន ៖ ${toKh(absentCount)} ដង${absentLevel ? ` (> ${toKh(absentLevel)})` : ''}
ច្បាប់ ៖ ${toKh(permissionCount)} ដង${permissionLevel ? ` (> ${toKh(permissionLevel)})` : ''}
យឺត ៖ ${toKh(lateCount)} ដង${lateLevel ? ` (> ${toKh(lateLevel)})` : ''}
កាលបរិច្ឆេទ៖ ${today}
ដូចបានប្រគេនខាងលើនេះសូមសិស្សនិមន្តមករៀនឲ្យបានទៀងទាត់។`;

      await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgConfig.chatId, text: msg }),
      });
    }
  } catch (err) {
    console.error('Failed to check attendance warnings:', err);
  }
}

function toggleSelectStudent(studentId) {
  const key = String(studentId);
  if (state.selectedStudents.has(key)) state.selectedStudents.delete(key);
  else state.selectedStudents.add(key);
  update();
}

function clearSelection() {
  state.selectedStudents.clear();
  update();
}

function getStudentTotalPermDays(studentId) {
  const selected = state.selectedDate;
  return (state.multiplePermissions || [])
    .filter(p => String(p.student) === String(studentId) && p.start_date <= selected && p.end_date >= selected)
    .reduce((total, p) => {
      const sel = new Date(selected    + 'T00:00:00');
      const end = new Date(p.end_date  + 'T00:00:00');
      return total + Math.round((end - sel) / 86400000);
    }, 0);
}

function toggleStatusMenu(studentId) {
  const key = String(studentId);
  state.openMenuFor = state.openMenuFor === key ? null : key;
  update();
}

// Clicking a name applies status to the whole current selection when the
// clicked student is part of it, otherwise just to that one student.
function applyStatusFromName(studentId, status) {
  const key = String(studentId);
  const targets = (state.selectedStudents.size > 0 && state.selectedStudents.has(key))
    ? Array.from(state.selectedStudents)
    : [key];
  state.openMenuFor = null;
  bulkSetStatus(targets, status);
}

// Groups enrollments into desks of 2 seats. Enrollments with a saved
// desk_number are grouped/ordered by it; any without one are paired
// sequentially and appended after the highest assigned desk number.
function buildDesks(enrollments) {
  const assigned = enrollments.filter(e => e.desk_number != null);
  const unassigned = enrollments.filter(e => e.desk_number == null);

  const desksMap = new Map();
  assigned.forEach(e => {
    if (!desksMap.has(e.desk_number)) desksMap.set(e.desk_number, []);
    desksMap.get(e.desk_number).push(e);
  });

  const desks = Array.from(desksMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([number, seats]) => ({ number, seats }));

  let nextNumber = desks.length > 0 ? Math.max(...desks.map(d => d.number)) + 1 : 1;
  for (let i = 0; i < unassigned.length; i += 2) {
    desks.push({ number: nextNumber++, seats: unassigned.slice(i, i + 2) });
  }
  return desks;
}

async function autoAssignDesks() {
  state.saving = true;
  update();
  try {
    const updates = state.enrollments.map((e, i) => ({ enrollment: e, desk_number: Math.floor(i / 2) + 1 }));
    await Promise.all(updates.map(u =>
      api.patch(`/api/students/enrollments/${u.enrollment.id}/`, { desk_number: u.desk_number })
    ));
    state.enrollments = updates.map(u => ({ ...u.enrollment, desk_number: u.desk_number }));
    showToast('បានកំណត់តុរួចរាល់', 'success');
  } catch (err) {
    showToast('មានបញ្ហាក្នុងការកំណត់តុ', 'error');
  } finally {
    state.saving = false;
    update();
  }
}

// Drag-and-drop seat swap: moves the dragged enrollment into the target
// desk/seat, swapping desk_number with whoever currently sits there (if
// anyone). Persists both sides so the layout survives a reload.
async function moveStudentToSeat(enrollmentId, sourceDeskNumber, targetDeskNumber, targetSeatIdx) {
  if (String(sourceDeskNumber) === String(targetDeskNumber)) return;

  const desks = buildDesks(state.enrollments);
  const targetDesk = desks.find(d => String(d.number) === String(targetDeskNumber));
  const targetOccupant = targetDesk ? targetDesk.seats[targetSeatIdx] : null;
  if (targetOccupant && String(targetOccupant.id) === String(enrollmentId)) return;

  state.saving = true;
  update();
  try {
    const requests = [api.patch(`/api/students/enrollments/${enrollmentId}/`, { desk_number: Number(targetDeskNumber) })];
    if (targetOccupant) {
      requests.push(api.patch(`/api/students/enrollments/${targetOccupant.id}/`, { desk_number: Number(sourceDeskNumber) }));
    }
    const results = await Promise.all(requests);
    if (results.some(r => !r.ok)) throw new Error('move failed');

    state.enrollments = state.enrollments.map(e => {
      if (String(e.id) === String(enrollmentId)) return { ...e, desk_number: Number(targetDeskNumber) };
      if (targetOccupant && String(e.id) === String(targetOccupant.id)) return { ...e, desk_number: Number(sourceDeskNumber) };
      return e;
    });
    showToast('បានផ្លាស់ប្តូរកៅអីដោយជោគជ័យ', 'success');
  } catch (err) {
    showToast('មិនអាចផ្លាស់ប្តូរកៅអីបានទេ', 'error');
  } finally {
    state.saving = false;
    update();
  }
}

async function updateDesksPerRow(value) {
  const classroom = getSelectedClassroomObj();
  if (!classroom) return;
  const desksPerRow = Number(value);
  const res = await api.patch(`/api/core/classrooms/${classroom.id}/`, { desks_per_row: desksPerRow });
  if (res.ok) {
    classroom.desks_per_row = desksPerRow;
    update();
  } else {
    showToast('មិនអាចកំណត់ចំនួនតុក្នុងមួយជួរបានទេ', 'error');
  }
}

async function markAll(status) {
  if (!window.confirm('តើអ្នកពិតជាចង់កំណត់វត្តមានសិស្សទាំងអស់មែនទេ?')) return;
  const ids = state.enrollments.map(e => e.studentData?.id).filter(id => {
    const en = state.enrollments.find(e => String(e.student) === String(id));
    const isDropout = checkIsDropout(id, en?.studentData);
    if (isDropout) return false;

    const activePerm = (state.multiplePermissions || []).find(p => 
      String(p.student) === String(id) &&
      p.start_date <= state.selectedDate && p.end_date >= state.selectedDate
    );
    if (activePerm) return false;

    const existing = state.attendanceRecords.find(a => String(a.student) === String(id));
    return !existing;
  });
  if (!ids.length) return;
  await bulkSetStatus(ids, status);
}

// --- Rendering ---

function update() {
  if (!root) return;
  const { classrooms, academicYears, enrollments, attendanceRecords, loading, saving, error, selectedClassroom, selectedAcademicYear, selectedDate, selectedTimeSlot, selectedSession, yearUnlocked, classUnlocked, viewMode, selectedStudents, openMenuFor } = state;
  const todaySchedule = computeTodaySchedule();
  const classroomObj = getSelectedClassroomObj();
  const desksPerRow = classroomObj?.desks_per_row || 5;
  let filteredEnrollments = enrollments;
  if (state.searchQuery && state.searchQuery.trim() !== '') {
    const q = state.searchQuery.trim().toLowerCase();
    filteredEnrollments = enrollments.filter(e => {
      const name = ((e.studentData?.last_name || '') + ' ' + (e.studentData?.first_name || '')).toLowerCase();
      const nameEn = ((e.studentData?.first_name_en || '') + ' ' + (e.studentData?.last_name_en || '')).toLowerCase();
      const stId = (e.studentData?.student_id || '').toLowerCase();
      return name.includes(q) || nameEn.includes(q) || stId.includes(q);
    });
  }

  const desks = viewMode === 'desk' ? buildDesks(filteredEnrollments) : [];
  
  const activeFocus = document.activeElement ? document.activeElement.getAttribute('data-f') : null;
  const cursorPosition = (document.activeElement && document.activeElement.tagName === 'INPUT') ? document.activeElement.selectionStart : null;

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:20px;">

      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="calendar-check-2" style="width:24px;height:24px;color:var(--primary);"></i>
        </div>
        <div>
          <h1 class="page-title" style="margin-bottom:2px;">វត្តមានសិស្ស</h1>
          <p style="color:var(--text-secondary);font-size:0.9rem;margin:0;">កត់ត្រាវត្តមានប្រចាំថ្ងៃ និងតាមដានអវត្តមាន</p>
        </div>
      </div>

      <div class="glass-panel" style="padding:22px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:16px;">
          <div style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:#f8fafc;">
            <div style="margin-bottom:8px;">
              <span style="display:flex;align-items:center;gap:6px;font-weight:500;font-size:0.82rem;color:var(--text-secondary);">
                <i data-lucide="search" style="width:14px;height:14px;"></i> ស្វែងរកសិស្ស
              </span>
            </div>
            <input type="text" data-f="filter-search" value="${state.searchQuery || ''}" class="form-input" placeholder="ឈ្មោះ ឬ អត្តលេខ..." />
          </div>

          <div style="border:1px solid ${yearUnlocked ? 'var(--primary)' : 'var(--border)'};border-radius:10px;padding:10px 12px;background:${yearUnlocked ? 'var(--primary-light)' : '#f8fafc'};transition:all .2s;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <span style="display:flex;align-items:center;gap:6px;font-weight:500;font-size:0.82rem;color:var(--text-secondary);">
                <i data-lucide="calendar-range" style="width:14px;height:14px;"></i> ឆ្នាំសិក្សា
              </span>
              <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;font-size:0.75rem;font-weight:700;color:${yearUnlocked ? 'var(--primary)' : 'var(--text-muted)'};">
                <input type="checkbox" data-action="toggle-year-lock" ${yearUnlocked ? 'checked' : ''}
                  style="width:14px;height:14px;cursor:pointer;accent-color:var(--primary);" />
                ផ្លាស់ប្ដូរ
              </label>
            </div>
            <select data-f="filter-year" class="form-input" ${!yearUnlocked ? 'disabled' : ''}
              style="${!yearUnlocked ? 'opacity:0.45;cursor:not-allowed;pointer-events:none;' : ''}">
              ${academicYears.map(y => `<option value="${y.id}" ${String(y.id) === String(selectedAcademicYear) ? 'selected' : ''}>${y.year_name}</option>`).join('')}
            </select>
          </div>

          <div style="border:1px solid ${classUnlocked ? 'var(--primary)' : 'var(--border)'};border-radius:10px;padding:10px 12px;background:${classUnlocked ? 'var(--primary-light)' : '#f8fafc'};transition:all .2s;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <span style="display:flex;align-items:center;gap:6px;font-weight:500;font-size:0.82rem;color:var(--text-secondary);">
                <i data-lucide="school" style="width:14px;height:14px;"></i> ថ្នាក់រៀន
              </span>
              <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;font-size:0.75rem;font-weight:700;color:${classUnlocked ? 'var(--primary)' : 'var(--text-muted)'};">
                <input type="checkbox" data-action="toggle-class-lock" ${classUnlocked ? 'checked' : ''}
                  style="width:14px;height:14px;cursor:pointer;accent-color:var(--primary);" />
                ផ្លាស់ប្ដូរ
              </label>
            </div>
            <select data-f="filter-class" class="form-input" ${!classUnlocked ? 'disabled' : ''}
              style="${!classUnlocked ? 'opacity:0.45;cursor:not-allowed;pointer-events:none;' : ''}">
              ${classrooms.map(c => `<option value="${c.id}" ${String(c.id) === String(selectedClassroom) ? 'selected' : ''}>${c.class_name}</option>`).join('')}
            </select>
          </div>

          <div style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:#f8fafc;">
            <div style="margin-bottom:8px;">
              <span style="display:flex;align-items:center;gap:6px;font-weight:500;font-size:0.82rem;color:var(--text-secondary);">
                <i data-lucide="calendar" style="width:14px;height:14px;"></i> កាលបរិច្ឆេទ
              </span>
            </div>
            <input type="date" data-f="filter-date" value="${selectedDate}" class="form-input" />
          </div>

          <div style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:#f8fafc;">
            <div style="margin-bottom:8px;">
              <span style="display:flex;align-items:center;gap:6px;font-weight:500;font-size:0.82rem;color:var(--text-secondary);">
                <i data-lucide="sun" style="width:14px;height:14px;"></i> វេន
              </span>
            </div>
            <select data-f="filter-session" class="form-input" style="background:#fff;cursor:pointer;font-weight:600;color:var(--text-primary);">
              <option value="morning" ${selectedSession === 'morning' ? 'selected' : ''}>☀️ ព្រឹក</option>
              <option value="afternoon" ${selectedSession === 'afternoon' ? 'selected' : ''}>🌤 រសៀល</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Schedule cards grouped by session -->
      ${isHolyDay(state.selectedDate) ? `
        <div style="background:var(--primary-light);border:2px dashed var(--primary);border-radius:16px;padding:32px 20px;text-align:center;">
          <i data-lucide="calendar-off" style="width:48px;height:48px;color:var(--primary);margin-bottom:12px;opacity:0.8;"></i>
          <h3 style="color:var(--primary);font-size:1.3rem;font-weight:700;margin:0 0 8px 0;">ថ្ងៃនេះជាថ្ងៃសីល (អត់រៀនទេ) 🙏</h3>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">សាលាពុទ្ធិកមិនមានការសិក្សានៅថ្ងៃសីលឡើយ។ លោកអ្នកមិនចាំបាច់កត់វត្តមានទេ។</p>
        </div>
      ` : `
      ${todaySchedule.length > 0 ? (() => {
        const PALETTE = [
          { bg: '#eff6ff', activeBg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8', badgeBg: '#bfdbfe', gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
          { bg: '#f0fdf4', activeBg: '#dcfce7', border: '#22c55e', text: '#15803d', badgeBg: '#bbf7d0', gradient: 'linear-gradient(135deg,#22c55e,#10b981)' },
          { bg: '#fdf4ff', activeBg: '#f3e8ff', border: '#a855f7', text: '#7e22ce', badgeBg: '#e9d5ff', gradient: 'linear-gradient(135deg,#a855f7,#ec4899)' },
          { bg: '#fff7ed', activeBg: '#ffedd5', border: '#f97316', text: '#c2410c', badgeBg: '#fed7aa', gradient: 'linear-gradient(135deg,#f97316,#eab308)' },
          { bg: '#fff1f2', activeBg: '#ffe4e6', border: '#f43f5e', text: '#be123c', badgeBg: '#fecdd3', gradient: 'linear-gradient(135deg,#f43f5e,#f97316)' },
        ];

        function renderCard(e, globalIdx) {
          const c = PALETTE[globalIdx % PALETTE.length];
          const isActive = e.timeSlotId === String(selectedTimeSlot);
          const teacherName = e.teacher ? `${e.teacher.last_name || ''} ${e.teacher.first_name || ''}`.trim() : null;
          return `
            <div data-action="select-slot" data-slot="${e.timeSlotId}" role="button" tabindex="0"
              style="display:flex;flex-direction:column;border-radius:16px;border:2px solid ${isActive ? c.border : '#e5e7eb'};
                overflow:hidden;background:${isActive ? c.activeBg : '#fff'};cursor:pointer;
                width:200px;min-width:170px;max-width:220px;
                box-shadow:${isActive ? `0 6px 22px ${c.border}44` : '0 2px 8px rgba(0,0,0,0.07)'};
                transition:all .18s;">
              <div style="height:5px;background:${c.gradient};"></div>
              <div style="padding:10px 14px 0;display:flex;align-items:center;justify-content:space-between;gap:6px;">
                <span style="display:inline-flex;align-items:center;gap:4px;
                  background:${isActive ? c.border : c.badgeBg};color:${isActive ? '#fff' : c.text};
                  font-size:0.68rem;font-weight:700;padding:3px 9px;border-radius:9999px;white-space:nowrap;">
                  <i data-lucide="clock" style="width:10px;height:10px;flex-shrink:0;"></i>
                  ${fmtTime(e.slot.start_time.slice(0,5))}–${fmtTime(e.slot.end_time.slice(0,5))}
                </span>
                ${e.isSubstituted ? `
                  <span style="display:inline-flex;align-items:center;gap:2px;
                    background:#fef3c7;color:#d97706;font-size:0.6rem;font-weight:700;
                    padding:3px 6px;border-radius:9999px;white-space:nowrap;">
                    <i data-lucide="repeat-2" style="width:9px;height:9px;"></i>ប្ដូរ
                  </span>` : ''}
              </div>
              <div style="padding:8px 14px 6px;font-size:0.93rem;font-weight:800;color:${c.text};
                line-height:1.35;min-height:48px;
                display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                ${e.subject?.subject_name || '---'}
              </div>
              <div style="padding:0 14px 10px;display:flex;align-items:center;gap:6px;
                font-size:0.72rem;color:${c.text};font-weight:600;opacity:0.85;">
                <span style="flex-shrink:0;width:20px;height:20px;border-radius:50%;
                  background:${c.badgeBg};display:inline-flex;align-items:center;justify-content:center;">
                  <i data-lucide="user" style="width:11px;height:11px;color:${c.text};"></i>
                </span>
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  ${teacherName || `<span style="opacity:0.5;font-style:italic;">គ្មានគ្រូ</span>`}
                </span>
              </div>
              <div style="margin:0 12px 10px;padding-top:8px;border-top:1px solid ${c.border}28;display:flex;gap:6px;">
                <button data-action="open-sub-modal" data-slot="${e.timeSlotId}" data-subject="${e.originalSubjectId}"
                  onclick="event.stopPropagation()"
                  style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;
                    font-size:0.72rem;padding:5px 0;border-radius:7px;
                    border:1px solid ${c.border}55;color:${c.text};background:transparent;
                    cursor:pointer;font-weight:600;font-family:inherit;">
                  <i data-lucide="arrow-left-right" style="width:11px;height:11px;"></i>${e.isSubstituted ? 'ប្ដូរ' : 'ប្ដូរមុខវិជ្ជា'}
                </button>
                ${e.isSubstituted ? `
                <button data-action="reset-sub" data-slot="${e.timeSlotId}" data-subject="${e.originalSubjectId}"
                  onclick="event.stopPropagation()"
                  style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;
                    font-size:0.72rem;padding:5px 0;border-radius:7px;
                    border:1px solid #ef444455;color:#ef4444;background:transparent;
                    cursor:pointer;font-weight:600;font-family:inherit;">
                  <i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>សង្គ្រោះ
                </button>` : ''}
              </div>
            </div>`;
        }

        const activeSession = selectedSession;
        const activeSessionLabel = SESSION_LABELS[activeSession] || activeSession;
        const activeSessionIcon  = activeSession === 'morning' ? '☀️' : '🌤';
        const activeEntries = todaySchedule.filter(e => e.slot.session === activeSession);

        return `<div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:1.1rem;">${activeSessionIcon}</span>
            <span style="font-size:0.88rem;font-weight:700;color:var(--text-primary);letter-spacing:0.2px;">វេន${activeSessionLabel}</span>
            <span style="font-size:0.72rem;color:var(--text-muted);background:#f1f5f9;
              padding:2px 10px;border-radius:9999px;font-weight:600;">${activeEntries.length} ម៉ោង</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;">
            ${activeEntries.map(e => renderCard(e, todaySchedule.indexOf(e))).join('')}
          </div>
        </div>`;
      })() : ''}

      ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;display:flex;align-items:center;gap:8px;"><i data-lucide="alert-circle" style="width:18px;height:18px;flex-shrink:0;"></i>${error}</div>` : ''}

      ${loading ? `<div style="text-align:center;padding:60px;color:var(--text-secondary);"><i data-lucide="loader-circle" class="animate-spin" style="width:28px;height:28px;display:block;margin:0 auto 12px;color:var(--primary);"></i>កំពុងទាញយកទិន្នន័យ...</div>` : `
        <div class="glass-panel" style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="grid-3x3" style="width:15px;height:15px;color:var(--text-secondary);flex-shrink:0;"></i>
              <input type="number" data-f="desks-per-row" class="form-input"
                style="width:64px;padding:7px 10px;text-align:center;"
                min="1" max="15" value="${desksPerRow}" ${!classroomObj ? 'disabled' : ''} />
            </div>
            <button data-action="auto-assign-desks" class="btn" style="border:1px solid var(--border);color:var(--text-primary);gap:5px;" ${saving || filteredEnrollments.length === 0 ? 'disabled' : ''}>
              <i data-lucide="wand-2" style="width:14px;height:14px;"></i> កំណត់
            </button>
          </div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <button data-action="send-telegram" title="ផ្ញើទៅ Telegram"
              style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:none;background:#0088cc;color:#fff;cursor:pointer;font-size:0.85rem;font-weight:600;font-family:inherit;"
              ${filteredEnrollments.length === 0 ? 'disabled' : ''}>
              <i data-lucide="send" style="width:15px;height:15px;"></i>Telegram
            </button>
            <button data-action="config-telegram" title="ការកំណត់ Telegram"
              style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid var(--border);background:white;color:#0088cc;cursor:pointer;">
              <i data-lucide="settings-2" style="width:15px;height:15px;"></i>
            </button>
          </div>
        </div>
        <div class="glass-panel" style="padding:20px;position:relative;">
          ${saving ? `<div style="position:absolute;inset:0;background:rgba(255,255,255,0.75);z-index:10;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:600;color:var(--primary);border-radius:16px;"><i data-lucide="loader-circle" class="animate-spin" style="width:18px;height:18px;"></i>កំពុងរក្សាទុក...</div>` : ''}
          ${filteredEnrollments.length === 0 ? `
            <div style="text-align:center;padding:50px 20px;color:var(--text-muted);">
              <i data-lucide="user-x" style="width:36px;height:36px;margin:0 auto 10px;display:block;opacity:0.5;"></i>
              មិនមានសិស្សក្នុងថ្នាក់នេះទេ
            </div>` :
            viewMode === 'desk' ? renderDeskView(desks, desksPerRow) : renderTableView(filteredEnrollments)}
        </div>
      `}
      `}
    </div>
    ${state.permissionModal ? (() => {
      const m = state.permissionModal;
      return `<div data-action="close-perm-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div onclick="event.stopPropagation()" style="background:white;border-radius:16px;padding:24px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border);">
            <div>
              <h2 style="font-size:1.05rem;font-weight:700;margin:0 0 3px;display:flex;align-items:center;gap:7px;">
                <i data-lucide="file-check" style="width:17px;height:17px;color:#ea580c;"></i>${m.permId ? 'កែប្រែច្បាប់' : 'ច្បាប់អវត្តមាន'}
              </h2>
              <p style="font-size:0.85rem;font-weight:600;color:var(--text-primary);margin:0;">${m.studentName}</p>
            </div>
            <button data-action="close-perm-modal" style="background:none;border:none;cursor:pointer;padding:4px;color:var(--text-secondary);">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>
          <div style="display:flex;gap:12px;margin-bottom:14px;">
            <div style="flex:1;">
              <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">ចាប់ពីថ្ងៃ <span style="color:#dc2626;">*</span></label>
              <input id="perm-start-date" type="date" class="form-input" value="${m.startDate}" />
            </div>
            <div style="flex:1;">
              <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">ដល់ថ្ងៃ <span style="color:#dc2626;">*</span></label>
              <input id="perm-end-date" type="date" class="form-input" value="${m.endDate}" min="${m.startDate}" />
            </div>
          </div>
          <div id="perm-session-container" style="margin-bottom:14px; display:${m.startDate === m.endDate ? 'block' : 'none'};">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">វេន <span style="color:#dc2626;">*</span></label>
            <select id="perm-session" class="form-input">
              <option value="morning" ${state.selectedSession === 'morning' ? 'selected' : ''}>☀️ ព្រឹក</option>
              <option value="afternoon" ${state.selectedSession === 'afternoon' ? 'selected' : ''}>🌤 រសៀល</option>
              <option value="all">ពេញមួយថ្ងៃ</option>
            </select>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">មូលហេតុ <span style="font-weight:400;color:var(--text-muted);">(ស្រេចចិត្ត)</span></label>
            <input id="perm-reason" class="form-input" type="text" placeholder="ឧ. ឈឺ, ការងារ, ចូលរួមពិធី..." value="${m.reason || ''}" />
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            ${m.permId ? `<button data-action="delete-perm" class="btn" style="border:1px solid #dc2626;color:#dc2626;margin-right:auto;gap:5px;"><i data-lucide="trash-2" style="width:14px;height:14px;"></i> លុបច្បាប់</button>` : ''}
            <button data-action="close-perm-modal" class="btn" style="border:1px solid var(--border);">បោះបង់</button>
            <button data-action="confirm-perm" class="btn btn-primary" style="background:#ea580c;border-color:#ea580c;gap:5px;">
              <i data-lucide="file-check" style="width:14px;height:14px;"></i> ${m.permId ? 'រក្សាការផ្លាស់ប្តូរ' : 'រក្សាទុក'}
            </button>
          </div>
        </div>
      </div>`;
    })() : ''}
    ${state.lateModal ? (() => {
      const m = state.lateModal;
      return `<div data-action="close-late-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div onclick="event.stopPropagation()" style="background:white;border-radius:16px;padding:24px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border);">
            <div>
              <h2 style="font-size:1.05rem;font-weight:700;margin:0 0 3px;display:flex;align-items:center;gap:7px;">
                <i data-lucide="clock" style="width:17px;height:17px;color:#eab308;"></i>សិស្សមកយឺត
              </h2>
              <p style="font-size:0.85rem;font-weight:600;color:var(--text-primary);margin:0;">${m.studentName}</p>
            </div>
            <button data-action="close-late-modal" style="background:none;border:none;cursor:pointer;padding:4px;color:var(--text-secondary);">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">រយៈពេលយឺត <span style="font-weight:400;color:var(--text-muted);">(ស្រេចចិត្ត)</span></label>
            <input id="late-time-input" class="form-input" type="text" placeholder="ឧ. ១៥ នាទី" value="${m.lateTime || ''}" />
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button data-action="close-late-modal" class="btn" style="border:1px solid var(--border);">បោះបង់</button>
            <button data-action="confirm-late" class="btn btn-primary" style="background:#eab308;border-color:#eab308;color:#fff;gap:5px;">
              <i data-lucide="clock" style="width:14px;height:14px;"></i> រក្សាទុក
            </button>
          </div>
        </div>
      </div>`;
    })() : ''}
    ${state.dropoutModal ? (() => {
      const m = state.dropoutModal;
      return `<div data-action="close-drop-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div onclick="event.stopPropagation()" style="background:white;border-radius:16px;padding:24px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border);">
            <div>
              <h2 style="font-size:1.05rem;font-weight:700;margin:0 0 3px;display:flex;align-items:center;gap:7px;">
                <i data-lucide="user-minus" style="width:17px;height:17px;color:#7c3aed;"></i>សិស្សឈប់រៀន
              </h2>
              <p style="font-size:0.85rem;font-weight:600;color:var(--text-primary);margin:0;">${m.studentName}</p>
            </div>
            <button data-action="close-drop-modal" style="background:none;border:none;cursor:pointer;padding:4px;color:var(--text-secondary);">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">មូលហេតុដែលឈប់រៀន <span style="font-weight:400;color:var(--text-muted);">(ស្រេចចិត្ត)</span></label>
            <input id="drop-reason" class="form-input" type="text" placeholder="ឧ. បញ្ហាសុខភាព, ប្តូរសាលា..." value="${m.reason || ''}" />
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button data-action="close-drop-modal" class="btn" style="border:1px solid var(--border);">បោះបង់</button>
            <button data-action="confirm-drop" class="btn btn-primary" style="background:#7c3aed;border-color:#7c3aed;gap:5px;">
              <i data-lucide="user-minus" style="width:14px;height:14px;"></i> រក្សាទុក
            </button>
          </div>
        </div>
      </div>`;
    })() : ''}
    ${state.substitutionModal ? (() => {
      const modal = state.substitutionModal;
      const origSubj = state.subjects.find(s => String(s.id) === String(modal.originalSubjectId));
      const slotEntry = todaySchedule.find(e => e.timeSlotId === modal.timeSlotId);
      const timeLabel = slotEntry ? `${slotEntry.slot.start_time.slice(0,5)}–${slotEntry.slot.end_time.slice(0,5)}` : '';
      return `<div data-action="close-sub-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div onclick="event.stopPropagation()" style="background:white;border-radius:16px;padding:24px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border);">
            <div>
              <h2 style="font-size:1.05rem;font-weight:700;margin:0 0 3px;">ផ្លាស់ប្ដូរមុខវិជ្ជា</h2>
              ${timeLabel ? `<p style="font-size:0.8rem;color:var(--text-secondary);margin:0;">ម៉ោង ${timeLabel}</p>` : ''}
            </div>
            <button data-action="close-sub-modal" style="background:none;border:none;cursor:pointer;padding:4px;color:var(--text-secondary);">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">មុខវិជ្ជាដើម</label>
            <div style="padding:10px 14px;background:#f1f5f9;border-radius:8px;font-weight:600;">${origSubj?.subject_name || '---'}</div>
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">មុខវិជ្ជាថ្មី <span style="color:#dc2626;">*</span></label>
            <select id="sub-new-subject" class="form-input">
              <option value="">-- ជ្រើសរើស --</option>
              ${state.subjects
                .filter(s => String(s.id) !== String(modal.originalSubjectId))
                .map(s => `<option value="${s.id}">${s.subject_name}</option>`)
                .join('') || '<option value="" disabled>គ្មានមុខវិជ្ជាទេ</option>'}
            </select>
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">គ្រូបង្រៀន</label>
            <input type="hidden" id="sub-new-teacher" value="" />
            <div id="sub-teacher-display" style="padding:10px 14px;background:#f1f5f9;border-radius:8px;font-weight:600;color:var(--text-primary);min-height:40px;">
              <span style="color:var(--text-muted);font-style:italic;">សូមជ្រើសរើសមុខវិជ្ជាជាមុន</span>
            </div>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">មូលហេតុ <span style="font-weight:400;color:var(--text-muted);">(ស្រេចចិត្ត)</span></label>
            <input id="sub-reason" class="form-input" type="text" placeholder="ឧ. គ្រូឈឺ, ការងារ..." />
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button data-action="close-sub-modal" class="btn" style="border:1px solid var(--border);">បោះបង់</button>
            <button data-action="confirm-sub" class="btn btn-primary">រក្សាទុក</button>
          </div>
        </div>
      </div>`;
    })() : ''}`;

  if (activeFocus) {
    const el = root.querySelector(`[data-f="${activeFocus}"]`);
    if (el) {
      el.focus();
      if (cursorPosition !== null && el.tagName === 'INPUT') {
        try { el.setSelectionRange(cursorPosition, cursorPosition); } catch(e){}
      }
    }
  }

  if (window.lucide) window.lucide.createIcons();

  // Bind Events
  const filterYear = root.querySelector('[data-f="filter-year"]');
  if (filterYear) {
    filterYear.addEventListener('change', (e) => {
      state.selectedAcademicYear = e.target.value;
      saveFilters();
      fetchAttendanceData();
    });
  }

  const filterClass = root.querySelector('[data-f="filter-class"]');
  if (filterClass) {
    filterClass.addEventListener('change', (e) => {
      state.selectedClassroom = e.target.value;
      const schedule = computeTodaySchedule();
      state.selectedTimeSlot = getCurrentTimeSlotId(schedule);
      saveFilters();
      fetchAttendanceData();
    });
  }

  const filterDate = root.querySelector('[data-f="filter-date"]');
  if (filterDate) {
    filterDate.addEventListener('change', (e) => {
      state.selectedDate = e.target.value;
      // Lunar day changes with date — recompute schedule and session from current time.
      state.selectedSession = getCurrentSession();
      const schedule = computeTodaySchedule();
      const sessionSlots = schedule.filter(en => en.slot?.session === state.selectedSession);
      state.selectedTimeSlot = getCurrentTimeSlotId(sessionSlots.length > 0 ? sessionSlots : schedule);
      fetchAttendanceData();
    });
  }

  const filterSearch = root.querySelector('[data-f="filter-search"]');
  if (filterSearch) {
    filterSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      update();
    });
  }

  const filterSession = root.querySelector('[data-f="filter-session"]');
  if (filterSession) {
    filterSession.addEventListener('change', (e) => {
      state.selectedSession = e.target.value;
      const schedule = computeTodaySchedule();
      const first = schedule.find(en => en.slot?.session === e.target.value);
      if (first) state.selectedTimeSlot = first.timeSlotId;
      saveFilters();
      fetchAttendanceData();
    });
  }

  root.querySelector('[data-action="toggle-year-lock"]')?.addEventListener('change', (e) => {
    state.yearUnlocked = e.target.checked;
    update();
  });

  root.querySelector('[data-action="toggle-class-lock"]')?.addEventListener('change', (e) => {
    state.classUnlocked = e.target.checked;
    update();
  });


  root.querySelectorAll('[data-action="select-slot"]').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedTimeSlot = el.dataset.slot;
      const clickedEntry = computeTodaySchedule().find(e => e.timeSlotId === el.dataset.slot);
      if (clickedEntry?.slot?.session) state.selectedSession = clickedEntry.slot.session;
      saveFilters();
      fetchAttendanceData();
    });
    el.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); } });
  });

  root.querySelectorAll('[data-action="open-sub-modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.substitutionModal = { timeSlotId: btn.dataset.slot, originalSubjectId: btn.dataset.subject };
      update();
    });
  });
  root.querySelectorAll('[data-action="reset-sub"]').forEach(btn => {
    btn.addEventListener('click', () => resetSubstitution(btn.dataset.slot, btn.dataset.subject));
  });
  root.querySelectorAll('[data-action="close-perm-modal"]').forEach(el => {
    el.addEventListener('click', () => { state.permissionModal = null; update(); });
  });
  root.querySelector('[data-action="confirm-perm"]')?.addEventListener('click', () => {
    const startDate = document.getElementById('perm-start-date')?.value;
    const endDate = document.getElementById('perm-end-date')?.value;
    const reason = document.getElementById('perm-reason')?.value || '';
    const permSession = document.getElementById('perm-session')?.value || 'all';
    if (!startDate || !endDate) { showToast('សូមជ្រើសរើសកាលបរិច្ឆេទ', 'error'); return; }
    if (endDate < startDate) { showToast('ថ្ងៃចប់ត្រូវតែក្រោយថ្ងៃចាប់ផ្ដើម', 'error'); return; }
    applyPermissionRange(state.permissionModal.studentId, startDate, endDate, reason, permSession, state.permissionModal.permId);
  });
  root.querySelector('[data-action="delete-perm"]')?.addEventListener('click', async () => {
    const m = state.permissionModal;
    if (!m?.permId) return;
    state.permissionModal = null;
    await bulkSetStatus([m.studentId], 'clear');
  });

  root.querySelectorAll('[data-action="close-sub-modal"]').forEach(el => {
    el.addEventListener('click', () => { state.substitutionModal = null; update(); });
  });
  root.querySelector('[data-action="confirm-sub"]')?.addEventListener('click', () => saveSubstitution());

  root.querySelectorAll('[data-action="close-drop-modal"]').forEach(el => {
    el.addEventListener('click', () => { state.dropoutModal = null; update(); });
  });
  root.querySelector('[data-action="confirm-drop"]')?.addEventListener('click', () => {
    const reason = document.getElementById('drop-reason')?.value || '';
    const studentId = state.dropoutModal.studentId;
    state.dropoutModal = null;
    bulkSetStatus([studentId], 'dropout', reason);
  });

  root.querySelectorAll('[data-action="close-late-modal"]').forEach(el => {
    el.addEventListener('click', () => { state.lateModal = null; update(); });
  });
  root.querySelector('[data-action="confirm-late"]')?.addEventListener('click', () => {
    const lateTime = document.getElementById('late-time-input')?.value || '';
    const studentId = state.lateModal.studentId;
    state.lateModal = null;
    bulkSetStatus([studentId], 'late', lateTime);
  });

  const subNewSubject = document.getElementById('sub-new-subject');
  const subNewTeacher = document.getElementById('sub-new-teacher');
  const subTeacherDisplay = document.getElementById('sub-teacher-display');
  if (subNewSubject && subNewTeacher && subTeacherDisplay) {
    subNewSubject.addEventListener('change', () => {
      const cs = state.classSubjects.find(
        x => String(x.classroom) === String(state.selectedClassroom) && String(x.subject) === String(subNewSubject.value)
      );
      if (cs?.teacher) {
        const t = state.teachers.find(t => String(t.id) === String(cs.teacher));
        subNewTeacher.value = String(cs.teacher);
        subTeacherDisplay.textContent = t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : '---';
      } else {
        subNewTeacher.value = '';
        subTeacherDisplay.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">គ្មានគ្រូ</span>';
      }
    });
  }

  root.querySelectorAll('[data-role="desk-seat"]').forEach(seatEl => {
    if (seatEl.dataset.enrollmentId) {
      seatEl.draggable = true;
      seatEl.addEventListener('dragstart', () => {
        draggedSeat = { enrollmentId: seatEl.dataset.enrollmentId, deskNumber: seatEl.dataset.deskNumber };
        seatEl.classList.add('is-dragging');
      });
      seatEl.addEventListener('dragend', () => seatEl.classList.remove('is-dragging'));
    }
  });

  root.querySelectorAll('[data-action="toggle-menu"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = String(btn.dataset.student);
      state.openMenuFor = state.openMenuFor === key ? null : key;
      update();
    });
  });

  root.addEventListener('change', e => {
    if (e.target.id === 'perm-start-date' || e.target.id === 'perm-end-date') {
      const startInput = document.getElementById('perm-start-date');
      const endInput = document.getElementById('perm-end-date');
      const sessionContainer = document.getElementById('perm-session-container');
      if (startInput && endInput && sessionContainer) {
        if (startInput.value && endInput.value && startInput.value === endInput.value) {
          sessionContainer.style.display = 'block';
        } else {
          sessionContainer.style.display = 'none';
        }
      }
    }
  });

  root.querySelectorAll('[data-action="apply-status"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = btn.dataset.student;
      let status = btn.dataset.status;
      const s = state.enrollments.find(e => String(e.student) === String(studentId))?.studentData;
      const existing = state.attendanceRecords.find(a => String(a.student) === String(studentId));
      let currentStatus = existing ? existing.status : null;
      
      currentStatus = getEffectiveStatus(studentId, s);
      const activePerm = (state.multiplePermissions || []).find(p => 
        String(p.student) === String(studentId) &&
        p.start_date <= state.selectedDate && p.end_date >= state.selectedDate
      );

      if (status === 'permission') {
        state.openMenuFor = null;
        const studentName = s ? `${s.last_name || ''} ${s.first_name || ''}`.trim() : '---';
        if (activePerm) {
          state.permissionModal = { studentId: String(studentId), studentName, startDate: activePerm.start_date, endDate: activePerm.end_date, reason: activePerm.reason || '', permId: activePerm.id };
        } else {
          state.permissionModal = { studentId: String(studentId), studentName, startDate: state.selectedDate, endDate: state.selectedDate, reason: '' };
        }
        update();
        return;
      }

      if (currentStatus === status) {
        status = 'clear';
      }



      if (status === 'dropout') {
        state.openMenuFor = null;
        const studentName = s ? `${s.last_name || ''} ${s.first_name || ''}`.trim() : '---';
        state.dropoutModal = { studentId: String(studentId), studentName, reason: '' };
        update();
        return;
      }

      state.openMenuFor = null;
      bulkSetStatus([studentId], status);
    });
  });

  root.querySelector('[data-action="mark-all-present"]')?.addEventListener('click', () => {
    markAll('present');
  });

  root.querySelector('[data-action="send-telegram"]')?.addEventListener('click', () => sendToTelegram());
  root.querySelector('[data-action="config-telegram"]')?.addEventListener('click', () => openTelegramConfigModal());

  root.querySelector('[data-action="view-desk"]')?.addEventListener('click', () => {
    state.viewMode = 'desk';
    update();
  });

  root.querySelector('[data-action="view-list"]')?.addEventListener('click', () => {
    state.viewMode = 'list';
    update();
  });

  root.querySelector('[data-action="auto-assign-desks"]')?.addEventListener('click', () => {
    autoAssignDesks();
  });

  const desksPerRowInput = root.querySelector('[data-f="desks-per-row"]');
  if (desksPerRowInput) {
    desksPerRowInput.addEventListener('change', (e) => {
      const v = parseInt(e.target.value, 10);
      if (v >= 1 && v <= 15) updateDesksPerRow(v);
    });
  }

  root.querySelectorAll('[data-role="desk-seat"]').forEach(seatEl => {
    seatEl.addEventListener('dragover', (e) => e.preventDefault());
    seatEl.addEventListener('dragenter', () => seatEl.classList.add('drag-over'));
    seatEl.addEventListener('dragleave', () => seatEl.classList.remove('drag-over'));
    seatEl.addEventListener('drop', (e) => {
      e.preventDefault();
      seatEl.classList.remove('drag-over');
      if (!draggedSeat) return;
      moveStudentToSeat(draggedSeat.enrollmentId, draggedSeat.deskNumber, seatEl.dataset.deskNumber, seatEl.dataset.seatIdx);
      draggedSeat = null;
    });
  });

  if (activeFocus) {
    const el = root.querySelector(`[data-f="${activeFocus}"]`);
    if (el) {
      el.focus();
      if (cursorPosition !== null && typeof el.setSelectionRange === 'function') {
        el.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  }
}

function renderDeskView(desks, desksPerRow) {
  const { attendanceRecords, selectedStudents, openMenuFor } = state;

  function renderSeatCol(en, desk, idx) {
    if (!en) return `
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;">
        <div style="font-size:0.78rem;font-weight:800;text-align:center;letter-spacing:1px;
          padding:3px 0 6px;border-bottom:2px solid #e5e7eb;color:#94a3b8;margin-bottom:8px;">
          ${idx === 0 ? 'A' : 'B'}
        </div>
        <div class="seat-empty" data-role="desk-seat" data-desk-number="${desk.number}" data-seat-idx="${idx}"
          style="flex:1;min-height:60px;border:1.5px dashed #cbd5e1;border-radius:12px;background:#f8fafc;"></div>
      </div>`;

    const s = en.studentData;
    let currentStatus = getEffectiveStatus(s.id, s);
    
    const statusOpt = STATUS_OPTIONS.find(o => o.value === currentStatus);
    const stripe = statusOpt?.color || '#16a34a';
    const nameColor = statusOpt ? stripe : '#1e293b';
    const nameShadow = statusOpt ? `0 0 8px ${stripe}55` : 'none';
    const bg = currentStatus === 'absent'     ? 'linear-gradient(135deg,#fff1f2,#ffe4e6)'
             : currentStatus === 'permission' ? 'linear-gradient(135deg,#fff7ed,#ffedd5)'
             : currentStatus === 'late'       ? 'linear-gradient(135deg,#fffbeb,#fef3c7)'
             : currentStatus === 'dropout'    ? 'linear-gradient(135deg,#f5f3ff,#ede9fe)'
             : 'linear-gradient(135deg,#f0fdf4,#dcfce7)';

    const isOpen = openMenuFor === String(s.id);
    const activeShadow = isOpen ? '0 0 0 3px var(--primary), 0 8px 20px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.05)';
    const activeTransform = isOpen ? 'scale(1.05)' : 'none';
    const activeZIndex = isOpen ? '10' : '1';

    return `<div style="flex:1;min-width:0;display:flex;flex-direction:column;">
        <div style="font-size:0.78rem;font-weight:800;text-align:center;letter-spacing:1px;
          padding:3px 0 6px;border-bottom:2px solid ${statusOpt ? stripe : '#e5e7eb'};color:${statusOpt ? stripe : '#94a3b8'};margin-bottom:8px;">
          ${statusOpt ? statusOpt.label : (idx === 0 ? 'A' : 'B')}
        </div>
        <div class="seat-card ${isOpen ? 'menu-open' : ''}" data-role="desk-seat" data-desk-number="${desk.number}" data-enrollment-id="${en.id}" data-seat-idx="${idx}"
              style="background:${bg};border-left:4px solid ${stripe};border-radius:0 10px 10px 0;padding:7px 8px 7px 10px;text-align:center;position:relative;
                box-shadow:${activeShadow};transform:${activeTransform};z-index:${activeZIndex};
                transition:all 0.2s ease;height:100%;cursor:grab;display:flex;flex-direction:column;justify-content:center;">
              <button draggable="false" data-action="toggle-menu" data-student="${s.id}"
                style="background:none;border:none;padding:0;cursor:pointer;font-family:inherit;width:100%;display:flex;flex-direction:column;align-items:center;">
                <span style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;">${s.student_code || '---'}</span>
                <span style="font-weight:700;font-size:0.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:1.4;
                  color:${isOpen ? 'var(--primary)' : nameColor};text-shadow:${nameShadow};${isOpen ? 'text-decoration:underline;text-underline-offset:4px;' : ''}">
                  ${statusOpt ? `<i data-lucide="${statusOpt.icon}" style="width:12px;height:12px;stroke-width:2.5px;vertical-align:middle;margin-right:3px;"></i>` : ''}${s.last_name || ''} ${s.first_name || ''}
                </span>
                <span style="font-size:0.7rem;background:rgba(0,0,0,0.05);color:var(--text-secondary);padding:2px 8px;border-radius:12px;margin-top:6px;">
                  ${s.gender || '-'} | ${s.monk_status || '-'}
                </span>
                <div style="display:flex;align-items:center;gap:4px;margin-top:3px;flex-wrap:wrap;justify-content:center;">
                  ${currentStatus === 'late' && rec?.late_time ? `<span style="font-size:0.67rem;background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:12px;font-weight:700;display:inline-flex;align-items:center;">ម៉ោង ${rec.late_time.slice(0,5)}</span>` : ''}
                  ${(() => { const d = getStudentTotalPermDays(s.id); return d > 0 ? `<span style="font-size:0.67rem;background:#fff7ed;color:#ea580c;padding:2px 8px;border-radius:12px;font-weight:700;display:inline-flex;align-items:center;gap:3px;"><i data-lucide="file-check" style="width:10px;height:10px;"></i>ច្បាប់ ${d}ថ្ងៃ</span>` : ''; })()}
                </div>
              </button>
          ${isOpen ? `
            <div class="status-menu" style="position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);
              display:flex;gap:5px;z-index:100;background:#fff;border-radius:999px;
              padding:5px 8px;box-shadow:0 4px 16px rgba(0,0,0,0.15);white-space:nowrap;">
              ${STATUS_OPTIONS.map(opt => `
                <button draggable="false" data-action="apply-status" data-student="${s.id}" data-status="${opt.value}"
                  title="${opt.label}"
                  style="width:28px;height:28px;border-radius:50%;border:2px solid ${opt.color};
                    background:white;color:${opt.color};cursor:pointer;padding:0;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i data-lucide="${opt.icon}" style="width:13px;height:13px;pointer-events:none;"></i>
                </button>`).join('')}
            </div>` : ''}
        </div>
      </div>`;
  }

  return `<div style="display:grid;grid-template-columns:repeat(${desksPerRow},1fr);gap:16px;">
    ${desks.map(desk => `
      <div class="desk-card" style="border:1px solid #e2e8f0;border-radius:14px;padding:12px;
        background:linear-gradient(160deg,#ffffff,#f8fafc);
        box-shadow:0 2px 8px rgba(15,23,42,0.06);">
        <div style="display:flex;justify-content:center;margin-bottom:12px;">
          <span style="font-size:0.75rem;color:var(--primary);background:var(--primary-light);
            border-radius:9999px;padding:3px 14px;font-weight:800;letter-spacing:0.5px;">តុ ${desk.number}</span>
        </div>
        <div style="display:flex;gap:10px;">
          ${renderSeatCol(desk.seats[0], desk, 0)}
          ${renderSeatCol(desk.seats[1], desk, 1)}
        </div>
      </div>`).join('')}
  </div>`;
}

function renderTableView(enrollments) {
  const { attendanceRecords, selectedStudents } = state;
  return `<div class="table-container" style="overflow-x:auto;">
    <table>
      <thead><tr>
        <th>ល.រ</th><th>កូដ</th><th>ឈ្មោះ</th><th>ភេទ</th><th>ឋានៈ</th><th style="width:200px;">វត្តមាន</th>
      </tr></thead>
      <tbody>
        ${enrollments.map((en, i) => {
          const s = en.studentData;
          let currentStatus = getEffectiveStatus(s.id, s);
          const rec = state.attendanceRecords.find(a => String(a.student) === String(s.id));
          
          const opt = STATUS_OPTIONS.find(o => o.value === currentStatus);
          const statusColor = opt?.color || '#94a3b8';
          const isSel = selectedStudents.has(String(s.id));
          return `<tr style="${isSel ? 'background:var(--primary-light);' : ''}">
            <td>${i + 1}</td>
            <td><span style="font-family:monospace;font-size:0.85rem;color:var(--text-secondary);">${s.student_code || '---'}</span></td>
            <td>
              <button data-action="toggle-select" data-student="${s.id}"
                style="background:none;border:none;padding:0;cursor:pointer;font-family:inherit;text-align:left;">
                <span style="display:flex;align-items:center;gap:6px;font-weight:600;color:${isSel ? 'var(--primary)' : 'var(--text-primary)'};">
                  <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${statusColor};"></span>
                  ${s.last_name || ''} ${s.first_name || ''}
                  ${(() => { const d = getStudentTotalPermDays(s.id); return d > 0 ? `<span style="font-size:0.67rem;background:#fff7ed;color:#ea580c;padding:1px 7px;border-radius:12px;font-weight:700;">ច្បាប់ ${d}ថ្ងៃ</span>` : ''; })()}
                </span>
              </button>
            </td>
            <td>${s.gender || '---'}</td>
            <td><span style="background:var(--primary-light);color:var(--primary);padding:4px 10px;border-radius:9999px;font-size:0.8rem;font-weight:600;">${s.monk_status || '---'}</span></td>
            <td><span style="display:inline-flex;align-items:center;gap:5px;font-size:0.8rem;font-weight:600;color:${statusColor};">
              ${opt ? `<i data-lucide="${opt.icon}" style="width:14px;height:14px;"></i>` : ''}
              ${opt?.label || 'មិនទាន់កត់ត្រា'}
              ${currentStatus === 'late' && rec?.late_time ? `<span style="font-size:0.67rem;background:#fef3c7;color:#d97706;padding:1px 6px;border-radius:12px;font-weight:700;">ម៉ោង ${rec.late_time.slice(0,5)}</span>` : ''}
            </span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function _tgHelpers() {
  const fullSchedule = computeTodaySchedule();
  const classObj = getSelectedClassroomObj();
  const className = classObj?.class_name || '';
  const ayObj = state.academicYears.find(y => String(y.id) === String(state.selectedAcademicYear));
  const yearName = ayObj?.year_name || '';

  const d = new Date(state.selectedDate);
  const dateStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

  // Active session = strictly follow the selected session from state to keep UI in sync
  const activeSession = state.selectedSession || 'morning';
  const sessionLabel  = activeSession === 'morning' ? 'ព្រឹក' : 'រសៀល';
  const sessionIcon   = activeSession === 'morning' ? '☀️' : '🌤';

  // Only this session's entries
  const schedule = fullSchedule.filter(e => e.slot.session === activeSession);

  // Time range for the session
  const timeStr = schedule.length
    ? `${fmtTime(schedule[0].slot.start_time.slice(0,5))} - ${fmtTime(schedule[schedule.length - 1].slot.end_time.slice(0,5))}`
    : '';

  // Subjects for the session (flat)
  const sessionSubjects = schedule.map(e => e.subject?.subject_name || '---');

  // Teachers for the session (deduplicated)
  const seenT = new Set();
  const sessionTeachers = [];
  schedule.forEach(e => {
    if (e.teacher) {
      const name = `${e.teacher.last_name||''} ${e.teacher.first_name||''}`.trim();
      if (!seenT.has(name)) { seenT.add(name); sessionTeachers.push(name); }
    }
  });

  // Subjects for the selected slot only (for absent detail message)
  const slotSubjects = schedule
    .filter(e => e.timeSlotId === String(state.selectedTimeSlot))
    .map(e => e.subject?.subject_name || '---');

  const activeEnrollments = state.enrollments.filter(e => !checkIsDropout(e.student, e.studentData));
  const dropoutList = state.enrollments.filter(e => checkIsDropout(e.student, e.studentData)).map(e => e.studentData);
  
  const total = activeEnrollments.length;
  
  const permList = [];
  const absentList = [];
  const presentList = [];

  activeEnrollments.forEach(e => {
    const status = getEffectiveStatus(e.student, e.studentData);
    if (status === 'permission') {
      permList.push({ student: e.student });
    } else if (status === 'absent') {
      absentList.push({ student: e.student });
    } else {
      presentList.push({ student: e.student });
    }
  });

  function nameOf(record) {
    // If it's already a student object (e.g. from dropoutList)
    if (record.last_name !== undefined) {
      return `${record.last_name||''} ${record.first_name||''}`.trim();
    }
    const en = state.enrollments.find(e => String(e.student) === String(record.student));
    return en?.studentData ? `${en.studentData.last_name||''} ${en.studentData.first_name||''}`.trim() : '---';
  }

  function nameAndReasonOf(record) {
    const en = state.enrollments.find(e => String(e.student) === String(record.student));
    const s = en?.studentData;
    if (!s) return '---';
    const name = `${s.last_name||''} ${s.first_name||''}`.trim();
    
    const p = (state.multiplePermissions || []).find(p => 
       String(p.student) === String(record.student) && 
       p.start_date <= state.selectedDate && p.end_date >= state.selectedDate
    );
    const reason = p?.reason ? p.reason : '';

    let location = '';
    if (s.kuti) {
      const kutiObj = state.kutis.find(k => String(k.id) === String(s.kuti));
      if (kutiObj) location = `កុដិ ${kutiObj.kuti_name}`;
    } else if (s.current_pagoda) {
      const pagodaObj = state.pagodas.find(pg => String(pg.id) === String(s.current_pagoda));
      if (pagodaObj) location = pagodaObj.name;
    }
    
    let res = name;
    if (reason) res += ` , (${reason})`;
    if (location) res += ` , (${location})`;
    return res;
  }

  return { schedule, className, yearName, dateStr, timeStr,
           activeSession, sessionLabel, sessionIcon,
           sessionSubjects, sessionTeachers, slotSubjects,
           total, presentList, permList, absentList, dropoutList, nameOf, nameAndReasonOf };
}

function buildTelegramMessage() {
  const { className, yearName, dateStr, timeStr,
          sessionSubjects, sessionTeachers,
          total, presentList, permList, absentList, dropoutList, nameOf, nameAndReasonOf } = _tgHelpers();

  function formatDashes(list, minDashes, indent) {
    let lines = list.map(item => `${indent}- ${item}`);
    while (lines.length < minDashes) {
      lines.push(`${indent}- `);
    }
    return lines.join('\n');
  }

  const classLabel = className.replace(/^ថ្នាក់ទី\s*/u, '');
  
  // Calculate Generation (e.g. 2026-2027 => 2026 - 2003 = 23)
  const startYearMatch = (yearName || '').match(/^(\d{4})/);
  const generation = startYearMatch ? (parseInt(startYearMatch[1], 10) - 2003) : yearName;

  const toKh = (num) => {
    const khmerNums = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(num).replace(/[0-9]/g, match => khmerNums[match]);
  };

  return `🙏សូមក្រាបថ្វាយបង្គំព្រះអង្គគ្រូនាយក 🙏
= >   សូមទូលប្រគេនមានដូចខាងក្រោម <= 
📅 កាលបរិច្ឆេទៈ ${toKh(dateStr)}
🔔 ម៉ោងៈ ${toKh(timeStr)}
📙 មុខវិជ្ជា:
${formatDashes(sessionSubjects, 3, '    ')}
🧑 បង្រៀនដោយលោកគ្រូ-អ្នកគ្រូ
${formatDashes(sessionTeachers, 3, '    ')}

ℹ️ ជំនាន់ទី ${toKh(generation)} ថ្នាក់ទី ${toKh(classLabel)}
👉 សមណសិស្សសរុប ${toKh(total)} អង្គ
✅ សមណសិស្សមករៀនសរុប ${toKh(presentList.length)} អង្គ
✅ សមណសិស្សសូមច្បាប់ ${toKh(permList.length)} អង្គ
${formatDashes(permList.map(nameAndReasonOf), 3, '     ')}
🅰️ អវត្តមាន ${toKh(absentList.length)} អង្គ
${formatDashes(absentList.map(nameOf), 3, '     ')}
🩸 សមណបោះបង់ការសិក្សាចំនួន ${toKh(dropoutList.length)} អង្គ
${formatDashes(dropoutList.map(nameOf), 3, '     ')}

     សេចក្ដីដូចទូលប្រគេនដូចខាងលើសូមព្រះអង្គគ្រូនាយកជ្រាប សូមអរព្រះគុណ ។`;
}

function buildAbsentDetailMessage() {
  const { className, dateStr, timeStr, slotSubjects, absentList, nameOf } = _tgHelpers();
  if (!absentList.length) return null;

  function formatDashes(list, minDashes, indent) {
    let lines = list.map(item => `${indent}- ${item}`);
    while (lines.length < minDashes) {
      lines.push(`${indent}- `);
    }
    return lines.join('\n');
  }

  const classLabel = className.replace(/^ថ្នាក់ទី\s*/u, '');
  
  const toKh = (num) => {
    const khmerNums = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(num).replace(/[0-9]/g, match => khmerNums[match]);
  };

  return `📅 កាលបរិច្ឆេទៈ ${toKh(dateStr)}

ថ្នាក់ទី៖ ${toKh(classLabel)}
🔔 ម៉ោងៈ ${toKh(timeStr)}
📙 មុខវិជ្ជា:
${formatDashes(slotSubjects, 3, '    ')}
🅰️ អវត្តមាន ${toKh(absentList.length)} អង្គ
${formatDashes(absentList.map(nameOf), 6, '     ')}`;
}

async function sendToTelegram() {
  let btn = root.querySelector('[data-action="send-telegram"]');
  try {
    let tgConfig = {};
    try {
      tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
    } catch(e) {
      tgConfig = {};
    }
    
    if (!tgConfig.token || !tgConfig.chatId) {
      showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
      openTelegramConfigModal();
      return;
    }
    
    if (btn) { btn.disabled = true; btn.innerHTML = '<i data-lucide="loader-circle" style="width:15px;height:15px;animation:spin 1s linear infinite;"></i>'; if (window.lucide) window.lucide.createIcons(); }

    async function postMsg(text) {
      const res = await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgConfig.chatId, text })
      });
      if (!res.ok) throw new Error('Telegram error ' + res.status);
    }

    await postMsg(buildTelegramMessage());
    const absentMsg = buildAbsentDetailMessage();
    if (absentMsg) await postMsg(absentMsg);
    showToast('បានផ្ញើទៅ Telegram ដោយជោគជ័យ ✅', 'success');
  } catch (err) {
    console.error(err);
    showToast('មិនអាចផ្ញើ Telegram: ' + err.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="send" style="width:15px;height:15px;"></i>'; if (window.lucide) window.lucide.createIcons(); }
  }
}

function openTelegramConfigModal() {
  const existing = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:1.1rem;font-weight:700;margin:0;display:flex;align-items:center;gap:8px;">
        <i data-lucide="send" style="width:18px;height:18px;color:#0088cc;"></i>ការកំណត់ Telegram Bot
      </h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;">
        <i data-lucide="x" style="width:18px;height:18px;color:var(--text-secondary);"></i>
      </button>
    </div>
    <form style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.85rem;">Bot Token <span style="color:#dc2626;">*</span></label>
        <input type="text" data-f="token" class="form-input" placeholder="1234567890:ABC..." />
      </div>
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.85rem;">Chat ID <span style="color:#dc2626;">*</span></label>
        <input type="text" data-f="chatId" class="form-input" placeholder="-100123456789" />
      </div>
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.85rem;">ឈ្មោះវត្ត <span style="font-weight:400;color:var(--text-muted);">(បង្ហាញក្នុងសារ)</span></label>
        <input type="text" data-f="pagodaName" class="form-input" placeholder="ឧ. វត្តបទុមវតី..." />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:14px;border-top:1px solid var(--border);">
        <button type="button" data-action="cancel" class="btn" style="border:1px solid var(--border);">បោះបង់</button>
        <button type="submit" class="btn btn-primary">រក្សាទុក</button>
      </div>
    </form>`;
  wrap.querySelector('[data-f="token"]').value = existing.token || '';
  wrap.querySelector('[data-f="chatId"]').value = existing.chatId || '';
  wrap.querySelector('[data-f="pagodaName"]').value = existing.pagodaName || '';
  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const token      = wrap.querySelector('[data-f="token"]').value.trim();
    const chatId     = wrap.querySelector('[data-f="chatId"]').value.trim();
    const pagodaName = wrap.querySelector('[data-f="pagodaName"]').value.trim();
    if (!token || !chatId) { showToast('សូមបញ្ចូល Token និង Chat ID', 'error'); return; }
    localStorage.setItem('tgConfig', JSON.stringify({ token, chatId, pagodaName }));
    showToast('បានរក្សាទុក Telegram Config ✅', 'success');
    handle.close();
  });
}

async function resetSubstitution(timeSlotId, originalSubjectId) {
  const sub = (state.substitutions || []).find(s =>
    String(s.time_slot) === String(timeSlotId) &&
    String(s.original_subject) === String(originalSubjectId)
  );
  if (!sub) return;
  try {
    const res = await api.del(`/api/core/schedule-substitutions/${sub.id}/`);
    if (res.ok || res.status === 204) {
      state.substitutions = state.substitutions.filter(s => s.id !== sub.id);
      showToast('បានសង្គ្រោះមុខវិជ្ជាដើម', 'success');
      update();
    } else {
      throw new Error('Failed');
    }
  } catch {
    showToast('មិនអាចសង្គ្រោះបានទេ', 'error');
  }
}

async function saveSubstitution() {
  const modal = state.substitutionModal;
  const newSubjectId = document.getElementById('sub-new-subject')?.value;
  if (!newSubjectId) { showToast('សូមជ្រើសរើសមុខវិជ្ជា', 'error'); return; }
  try {
    // One substitution per (classroom, date, time_slot, original_subject) --
    // update it in place instead of creating a duplicate, otherwise two
    // records exist for the same slot and readers picking the first match
    // (e.g. monitor's computeTodaySchedule) show the older one, silently
    // ignoring whatever change was just made.
    const existing = (state.substitutions || []).find(s =>
      String(s.classroom) === String(state.selectedClassroom) &&
      s.change_date === state.selectedDate &&
      String(s.time_slot) === String(modal.timeSlotId) &&
      String(s.original_subject) === String(modal.originalSubjectId)
    );
    const payload = {
      classroom: state.selectedClassroom,
      change_date: state.selectedDate,
      time_slot: modal.timeSlotId,
      original_subject: modal.originalSubjectId,
      new_subject: newSubjectId,
      new_teacher: document.getElementById('sub-new-teacher')?.value || null,
      reason: document.getElementById('sub-reason')?.value || ''
    };
    const res = existing
      ? await api.patch(`/api/core/schedule-substitutions/${existing.id}/`, payload)
      : await api.post('/api/core/schedule-substitutions/', payload);
    if (!res.ok) throw new Error('Failed to save');
    state.substitutions = existing
      ? state.substitutions.map(s => s.id === existing.id ? res.data : s)
      : [...(state.substitutions || []), res.data];
    state.substitutionModal = null;
    showToast('ផ្លាស់ប្ដូរដោយជោគជ័យ', 'success');
    update();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

export function render(container) {
  root = container;
  state = {
    classrooms: [], academicYears: [], enrollments: [], attendanceRecords: [],
    timeSlots: [], subjects: [], timetableEntries: [], classSubjects: [], teachers: [],
    pagodas: [], kutis: [],
    substitutions: [],
    selectedClassroom: '', selectedAcademicYear: '',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTimeSlot: null,
    selectedSession: getCurrentSession(),
    yearUnlocked: false,
    classUnlocked: false,
    viewMode: 'desk', selectedStudents: new Set(), openMenuFor: null,
    substitutionModal: null, permissionModal: null, dropoutModal: null,
    loading: true, error: null, saving: false
  };
  injectDeskStyles();
  fetchData();

  clearInterval(sessionTimer);
  // Removed aggressive auto-refresh that overwrites user's selected session
}

export function destroy() {
  clearInterval(sessionTimer);
  sessionTimer = null;
  root = null;
}
