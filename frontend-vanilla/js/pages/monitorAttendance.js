// Class-monitor daily attendance page. Adapted from the admin desk-grid
// attendance UI (pages/attendance.js), locked to the logged-in monitor's own
// classroom via getUser().monitorInfo instead of an admin class/year picker.
// Desk-grid layout was dropped in favor of a single phone-friendly list view.
import { api } from '../api.js';
import { getUser } from '../auth.js';
import { navigate } from '../router.js';
import { showToast } from '../components/toast.js';
import { createMonitorBottomNav } from '../components/monitorBottomNav.js';
import { openMonitorAccountSheet } from '../components/monitorAccountSheet.js';
import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';

let root = null;
let sessionTimer = null;
let state = {
  classrooms: [], academicYears: [], subjects: [], classSubjects: [], teachers: [],
  enrollments: [], kutis: [], pagodas: [], attendanceRecords: [], substitutions: [],
  dropouts: [], scheduleData: [], multiplePermissions: [],
  selectedAcademicYear: null, selectedClassroom: null, selectedDate: new Date().toISOString().split('T')[0],
  selectedSession: 'morning', selectedTimeSlot: null, searchQuery: '',
  statusFilter: 'all', pagodaFilter: 'all', showFilters: false,
  isLoading: true, activeTab: 'list', permissionModal: null, dropoutModal: null, lateModal: null,
};

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
function injectPageStyles() {
  if (document.getElementById('monitor-attendance-styles')) return;
  const style = document.createElement('style');
  style.id = 'monitor-attendance-styles';
  style.textContent = `
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .animate-spin { animation: spin 1s linear infinite; }
    [data-action="select-slot"]:hover { filter: brightness(0.97); transform: translateY(-1px); transition: filter .15s,transform .15s; }
    [data-action="select-slot"]:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    [data-action="apply-status"] { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
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


function getMonitorInfo() {
  return getUser()?.monitorInfo;
}

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

// Session always follows current time (before noon = morning, noon or after =
// afternoon) regardless of which date is selected. Used both on initial load
// and whenever the date picker changes, since switching dates can change
// which schedule entries exist for that day.
function pickDefaultSessionAndTimeSlot(preferredTimeSlot) {
  const schedule = computeTodaySchedule();
  state.selectedSession = getCurrentSession();
  const sessionSlots = schedule.filter(e => e.slot?.session === state.selectedSession);
  const preferredValid = preferredTimeSlot && sessionSlots.find(e => e.timeSlotId === preferredTimeSlot);
  state.selectedTimeSlot = preferredValid
    ? preferredTimeSlot
    : getCurrentTimeSlotId(sessionSlots.length > 0 ? sessionSlots : schedule);
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

    pickDefaultSessionAndTimeSlot(saved.selectedTimeSlot);

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
  const monitorInfo = getMonitorInfo();
  if (!monitorInfo) {
    state.loading = false;
    update();
    return;
  }

  // A monitor only ever sees their own classroom -- not admin-selectable.
  state.selectedClassroom = monitorInfo.classroom_id;
  
  if (!state.selectedAcademicYear && state.academicYears.length > 0) {
    // Select active year or first year
    const active = state.academicYears.find(y => y.is_current);
    state.selectedAcademicYear = active ? active.id : state.academicYears[0].id;
  }

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

// The attendance table has a DB-level unique constraint on
// (student_id, attendance_date, session) -- it does NOT include subject, so
// there can only ever be one attendance row per student per session per day.
// (An earlier per-subject-loop version of this function -- inherited as-is
// from the admin desk-grid page -- violated that constraint and crashed with
// a 500 IntegrityError for any session with more than one subject scheduled.)
async function bulkSetStatus(studentIds, status, reason = '', lateTime = null) {
  if (status === 'late' && !lateTime) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    lateTime = `${h}:${m}:${s}`;
  }
  const sessionVal = state.selectedSession;

  const requests = studentIds.map(id => {
    const existing = state.attendanceRecords.find(a => String(a.student) === String(id));
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

    let attendanceRequest;
    if (existing && !String(existing.id).startsWith('temp-')) {
      if (status === 'clear') {
        attendanceRequest = api.del(`/api/attendance/attendance/${existing.id}/`)
          .then(res => ({ ok: res.ok || res.status === 204 }));
      } else if (existing.status === status && status !== 'late') {
        attendanceRequest = Promise.resolve({ ok: true });
      } else {
        const payload = { status };
        if (status === 'late') payload.late_time = lateTime;
        attendanceRequest = api.patch(`/api/attendance/attendance/${existing.id}/`, payload);
      }
    } else if (status === 'clear') {
      attendanceRequest = Promise.resolve({ ok: true });
    } else {
      const payload = {
        student: id,
        classroom: state.selectedClassroom,
        academic_year: state.selectedAcademicYear,
        attendance_date: state.selectedDate,
        session: sessionVal,
        subject: null,
        status,
        recorded_by_monitor: getMonitorInfo()?.student_id ?? null
      };
      if (status === 'late') payload.late_time = lateTime;
      attendanceRequest = api.post('/api/attendance/attendance/', payload);
    }

    return Promise.all([attendanceRequest, studentPatch, permPatch])
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
      const existingIdx = state.attendanceRecords.findIndex(a => String(a.student) === String(id));
      if (existingIdx !== -1) {
        state.attendanceRecords[existingIdx] = { ...state.attendanceRecords[existingIdx], status, late_time: lateTime };
      } else {
        state.attendanceRecords.push({
          id: `temp-${id}-${Date.now()}`,
          student: id,
          classroom: state.selectedClassroom,
          academic_year: state.selectedAcademicYear,
          attendance_date: state.selectedDate,
          session: sessionVal,
          subject: null,
          status,
          late_time: status === 'late' ? lateTime : null
        });
      }
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

      // One attendance row per (student, date, session) -- matches the DB's
      // unique constraint, which has no subject column.
      return sessionsToApply.map(sess => {
        const existing = allAtt.find(a =>
          String(a.student) === String(studentId) &&
          String(a.classroom) === String(state.selectedClassroom) &&
          String(a.academic_year) === String(state.selectedAcademicYear) &&
          a.attendance_date === date &&
          sessMatches(a.session, sess)
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
          subject: null,
          status: 'permission',
          recorded_by_monitor: getMonitorInfo()?.student_id ?? null
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
// page load.
async function checkAttendanceWarnings() {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) return;
  const monitorInfo = getMonitorInfo();
  if (!monitorInfo?.classroom_id || !monitorInfo?.academic_year_id) return;

  try {
    const [enrRes, yearsRes, reportRes, warnRes] = await Promise.all([
      api.get(`/api/students/enrollments/students/?classroom=${monitorInfo.classroom_id}&academic_year=${monitorInfo.academic_year_id}`),
      api.get('/api/academic-years/'),
      api.get('/api/attendance/attendance/report-data/'),
      api.get(`/api/attendance/attendance-warnings/?academic_year=${monitorInfo.academic_year_id}`),
    ]);
    if (!enrRes.ok || !yearsRes.ok || !reportRes.ok) return;

    const year = (yearsRes.data || []).find(y => String(y.id) === String(monitorInfo.academic_year_id));
    if (!year) return;
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
        student: sid, academic_year: monitorInfo.academic_year_id,
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

// --- Rendering ---

function update() {
  if (!root) return;
  const monitorInfo = getMonitorInfo();
  if (!monitorInfo) { root.innerHTML = `<div style="padding:20px;">សូមចូលគណនីជាប្រធានថ្នាក់</div>`; return; }
  // Every state change fully replaces root.innerHTML, which otherwise resets
  // the page scroll to the top -- jarring when tapping a status button deep
  // in the list. Restore the scroll position after the re-render instead.
  const scrollX = window.scrollX, scrollY = window.scrollY;
  const { classrooms, academicYears, enrollments, attendanceRecords, loading, saving, error, selectedClassroom, selectedAcademicYear, selectedDate, selectedTimeSlot, selectedSession } = state;
  const todaySchedule = computeTodaySchedule();

  const activeFocus = document.activeElement ? document.activeElement.getAttribute('data-f') : null;
  const cursorPosition = (document.activeElement && document.activeElement.tagName === 'INPUT') ? document.activeElement.selectionStart : null;

  root.innerHTML = `
    <div style="min-height:100vh;background:var(--bg-main);display:flex;justify-content:center;">
    <div class="animate-fade-in monitor-attendance-page" style="width:100%;max-width:900px;display:flex;flex-direction:column;">

        <div style="background-color:#4f46e5;background-image:linear-gradient(135deg, #4f46e5, #6366f1);color:white;padding:16px 20px;display:flex;align-items:center;gap:12px;border-bottom-left-radius:24px;border-bottom-right-radius:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="width:40px;height:40px;flex-shrink:0;background-color:white;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;">
            <img src="/logo.jpg" alt="School Logo" style="width:100%;height:100%;object-fit:contain;" />
          </div>
          <div style="display:flex;flex-direction:column;min-width:0;flex:1;">
            <div style="font-family:'Moul', cursive;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:20px;">ពុទ្ធិកមធ្យមសិក្សាបឋមភូមិ</div>
            <div style="font-family:'Khmer OS Battambang', 'Battambang', sans-serif;font-size:14px;opacity:0.9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:80px;">សម្តេចព្រះសង្ឃរាជ ទេព វង្ស និរោធរង្សី</div>
          </div>
          <div style="width:40px;height:40px;flex-shrink:0;background-color:white;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;">
            <img src="/logo_1.png" alt="Second Logo" style="width:100%;height:100%;object-fit:contain;" />
          </div>
        </div>

        <div style="padding:16px 16px 0;display:flex;align-items:center;gap:12px;">
          <button data-action="back-to-dashboard" style="background:white;border:1px solid #e5e7eb;color:#374151;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 1px 2px rgba(0,0,0,0.05);">←</button>
          <div>
            <div style="font-size:16px;font-weight:bold;color:#111827;">វត្តមានសិស្ស</div>
            <div style="font-size:12px;color:#6b7280;">ថ្នាក់ ${getSelectedClassroomObj()?.class_name || monitorInfo.classroom_name} &middot; ${academicYears.find(y => String(y.id) === String(selectedAcademicYear))?.year_name || ''}</div>
          </div>
        </div>

      <div class="monitor-attendance-body" style="display:flex;flex-direction:column;gap:16px;padding:16px;padding-bottom:calc(88px + env(safe-area-inset-bottom));">

      <!-- Always visible so a holiday date can be navigated away from --  the
      rest of this view (schedule cards, student list) is gated on whether
      the selected date is a holiday, but the picker itself must not be. -->
      <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;font-weight:600;color:var(--text-secondary);background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:5px 12px;cursor:pointer;align-self:flex-start;">
        <i data-lucide="calendar" style="width:14px;height:14px;flex-shrink:0;"></i>
        <input type="date" data-f="selected-date" value="${selectedDate}" style="border:none;background:transparent;font-size:0.85rem;font-weight:600;color:var(--text-secondary);font-family:inherit;padding:2px 0;cursor:pointer;" />
      </label>

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
              style="display:flex;flex-direction:column;border-radius:10px;border:2px solid ${isActive ? c.border : '#e5e7eb'};
                overflow:hidden;background:${isActive ? c.activeBg : '#fff'};cursor:pointer;
                width:104px;min-width:92px;max-width:120px;
                box-shadow:${isActive ? `0 4px 14px ${c.border}44` : '0 1px 5px rgba(0,0,0,0.06)'};
                transition:all .18s;">
              <div style="height:3px;background:${c.gradient};"></div>
              <div style="padding:5px 7px 0;display:flex;align-items:center;justify-content:space-between;gap:3px;">
                <span style="display:inline-flex;align-items:center;gap:2px;
                  background:${isActive ? c.border : c.badgeBg};color:${isActive ? '#fff' : c.text};
                  font-size:0.56rem;font-weight:700;padding:1px 6px;border-radius:9999px;white-space:nowrap;">
                  <i data-lucide="clock" style="width:8px;height:8px;flex-shrink:0;"></i>
                  ${fmtTime(e.slot.start_time.slice(0,5))}
                </span>
                ${e.isSubstituted ? `
                  <span style="display:inline-flex;align-items:center;
                    background:#fef3c7;color:#d97706;font-size:0.52rem;font-weight:700;
                    padding:1px 4px;border-radius:9999px;white-space:nowrap;">
                    <i data-lucide="repeat-2" style="width:7px;height:7px;"></i>
                  </span>` : ''}
              </div>
              <div style="padding:5px 7px 3px;font-size:0.7rem;font-weight:800;color:${c.text};
                line-height:1.2;min-height:30px;
                display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                ${e.subject?.subject_name || '---'}
              </div>
              <div style="padding:0 7px 5px;display:flex;align-items:center;gap:3px;
                font-size:0.58rem;color:${c.text};font-weight:600;opacity:0.85;">
                <span style="flex-shrink:0;width:14px;height:14px;border-radius:50%;
                  background:${c.badgeBg};display:inline-flex;align-items:center;justify-content:center;">
                  <i data-lucide="user" style="width:8px;height:8px;color:${c.text};"></i>
                </span>
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  ${teacherName || `<span style="opacity:0.5;font-style:italic;">គ្មានគ្រូ</span>`}
                </span>
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
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${activeEntries.map(e => renderCard(e, todaySchedule.indexOf(e))).join('')}
          </div>
        </div>`;
      })() : ''}

      ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;display:flex;align-items:center;gap:8px;"><i data-lucide="alert-circle" style="width:18px;height:18px;flex-shrink:0;"></i>${error}</div>` : ''}

      ${loading ? `<div style="text-align:center;padding:60px;color:var(--text-secondary);"><i data-lucide="loader-circle" class="animate-spin" style="width:28px;height:28px;display:block;margin:0 auto 12px;color:var(--primary);"></i>កំពុងទាញយកទិន្នន័យ...</div>` : `
        <div class="glass-panel" style="padding:12px 16px;display:flex;flex-direction:column;gap:12px;position:relative;z-index:5;">
          <div style="display:flex;justify-content:flex-end;align-items:center;flex-wrap:wrap;gap:12px;">
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <button data-action="send-telegram" title="ផ្ញើទៅ Telegram"
                style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:none;background:#0088cc;color:#fff;cursor:pointer;font-size:0.85rem;font-weight:600;font-family:inherit;"
                ${enrollments.length === 0 ? 'disabled' : ''}>
                <i data-lucide="send" style="width:15px;height:15px;"></i>Telegram
              </button>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:flex-start;">
            <div style="position:relative;flex:1;min-width:0;">
              <i data-lucide="search" style="position:absolute;left:10px;top:17px;width:16px;height:16px;color:var(--text-muted);"></i>
              <input type="text" data-f="filter-search" value="${state.searchQuery || ''}" class="form-input" placeholder="ឈ្មោះ ឬ អត្តលេខ..." style="padding-left:34px;width:100%;" />
            </div>
            <div style="position:relative;flex-shrink:0;">
              <button data-action="toggle-filters" title="តម្រង"
                style="position:relative;width:38px;height:38px;border-radius:8px;border:1.5px solid ${state.showFilters ? 'var(--primary)' : 'var(--border)'};background:${state.showFilters ? 'var(--primary-light)' : 'white'};cursor:pointer;display:flex;align-items:center;justify-content:center;color:${state.showFilters ? 'var(--primary)' : '#6b7280'};">
                <i data-lucide="sliders-horizontal" style="width:16px;height:16px;"></i>
                ${(state.statusFilter !== 'all' || state.pagodaFilter !== 'all') ? `<span style="position:absolute;top:4px;right:4px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:1.5px solid white;"></span>` : ''}
              </button>
              ${state.showFilters ? `
                <div data-role="filter-panel" style="position:absolute;top:calc(100% + 8px);right:0;z-index:20;width:220px;background:white;border-radius:14px;padding:14px;box-shadow:0 8px 24px rgba(0,0,0,0.12);border:1px solid #f3f4f6;">
                  <div style="margin-bottom:12px;">
                    <div style="font-size:11px;font-weight:bold;color:#6b7280;margin-bottom:6px;">ស្ថានភាព</div>
                    <div style="display:flex;gap:6px;">
                      ${[{ value: 'all', label: 'ទាំងអស់', icon: 'list' }, ...STATUS_OPTIONS.filter(o => o.value !== 'dropout')].map(o => `
                        <button data-action="filter-status" data-status="${o.value}" title="${o.label}"
                          style="flex:1;height:34px;border-radius:9px;border:1.5px solid ${state.statusFilter === o.value ? (o.color || 'var(--primary)') : 'var(--border)'};
                            background:${state.statusFilter === o.value ? (o.color || 'var(--primary)') : '#fff'};color:${state.statusFilter === o.value ? '#fff' : (o.color || '#6b7280')};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;">
                          <i data-lucide="${o.icon}" style="width:15px;height:15px;pointer-events:none;"></i>
                        </button>
                      `).join('')}
                    </div>
                  </div>
                  <div>
                    <div style="font-size:11px;font-weight:bold;color:#6b7280;margin-bottom:6px;">វត្ត</div>
                    <select data-f="pagoda-filter" class="form-input" style="width:100%;box-sizing:border-box;">
                      <option value="all" ${state.pagodaFilter === 'all' ? 'selected' : ''}>ទាំងអស់</option>
                      ${state.pagodas.map(p => `<option value="${p.id}" ${String(state.pagodaFilter) === String(p.id) ? 'selected' : ''}>${p.name}</option>`).join('')}
                    </select>
                  </div>
                  ${(state.statusFilter !== 'all' || state.pagodaFilter !== 'all') ? `<button data-action="clear-attendance-filters" style="width:100%;margin-top:12px;font-size:12px;color:var(--primary);font-weight:bold;background:var(--primary-light);border:none;cursor:pointer;padding:8px 6px;border-radius:8px;">សម្អាតតម្រង</button>` : ''}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        <div class="glass-panel" style="padding:14px;position:relative;">
          ${saving ? `<div style="position:absolute;inset:0;background:rgba(255,255,255,0.75);z-index:10;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:600;color:var(--primary);border-radius:16px;"><i data-lucide="loader-circle" class="animate-spin" style="width:18px;height:18px;"></i>កំពុងរក្សាទុក...</div>` : ''}
          ${(() => {
            let filteredEnrollments = enrollments;
            if (state.searchQuery && state.searchQuery.trim() !== '') {
              const q = state.searchQuery.trim().toLowerCase();
              filteredEnrollments = filteredEnrollments.filter(en => {
                const s = en.studentData;
                if (!s) return false;
                const name = `${s.last_name || ''} ${s.first_name || ''}`.toLowerCase();
                const code = (s.student_code || '').toLowerCase();
                return name.includes(q) || code.includes(q);
              });
            }
            if (state.statusFilter !== 'all') {
              filteredEnrollments = filteredEnrollments.filter(en =>
                getEffectiveStatus(en.student, en.studentData) === state.statusFilter
              );
            }
            if (state.pagodaFilter !== 'all') {
              filteredEnrollments = filteredEnrollments.filter(en =>
                String(en.studentData?.current_pagoda) === String(state.pagodaFilter)
              );
            }
            const filtersActive = state.searchQuery || state.statusFilter !== 'all' || state.pagodaFilter !== 'all';
            if (filteredEnrollments.length === 0) {
              return `
                <div style="text-align:center;padding:50px 20px;color:var(--text-muted);">
                  <i data-lucide="user-x" style="width:36px;height:36px;margin:0 auto 10px;display:block;opacity:0.5;"></i>
                  មិនមានសិស្ស ${filtersActive ? 'ស្វែងរកឃើញ' : 'ក្នុងថ្នាក់នេះទេ'}
                </div>`;
            }
            return renderTableView(filteredEnrollments);
          })()}
        </div>
      `}
      `}
      </div>
      <div data-role="bottom-nav-mount"></div>
    </div>
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

    `;

  // Bind Events
  root.querySelector('[data-action="back-to-dashboard"]')?.addEventListener('click', () => navigate('/monitor-dashboard'));

  const bottomNavMount = root.querySelector('[data-role="bottom-nav-mount"]');
  if (bottomNavMount) {
    const bottomNav = createMonitorBottomNav({ active: 'attendance', onAccountClick: () => openMonitorAccountSheet() });
    bottomNavMount.replaceWith(bottomNav.el);
  }
  if (window.lucide) window.lucide.createIcons();

  const filterSearch = root.querySelector('[data-f="filter-search"]');
  if (filterSearch) {
    filterSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      update();
    });
  }

  root.querySelector('[data-f="selected-date"]')?.addEventListener('change', (e) => {
    if (!e.target.value) return;
    state.selectedDate = e.target.value;
    pickDefaultSessionAndTimeSlot();
    update();
  });

  root.querySelector('[data-action="toggle-filters"]')?.addEventListener('click', () => {
    state.showFilters = !state.showFilters;
    update();
  });
  root.querySelectorAll('[data-action="filter-status"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.statusFilter = btn.dataset.status;
      update();
    });
  });
  root.querySelector('[data-f="pagoda-filter"]')?.addEventListener('change', (e) => {
    state.pagodaFilter = e.target.value;
    update();
  });
  root.querySelector('[data-action="clear-attendance-filters"]')?.addEventListener('click', () => {
    state.statusFilter = 'all';
    state.pagodaFilter = 'all';
    update();
  });

  if (activeFocus) {
    const el = root.querySelector(`[data-f="${activeFocus}"]`);
    if (el) {
      el.focus();
      if (cursorPosition !== null && el.tagName === 'INPUT') {
        el.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  }

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

  root.querySelectorAll('[data-action="close-drop-modal"]').forEach(el => {
    el.addEventListener('click', () => { state.dropoutModal = null; update(); });
  });
  root.querySelector('[data-action="confirm-drop"]')?.addEventListener('click', () => {
    const reason = document.getElementById('drop-reason')?.value || '';
    const studentId = state.dropoutModal.studentId;
    state.dropoutModal = null;
    bulkSetStatus([studentId], 'dropout', reason);
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
        const studentName = s ? `${s.last_name || ''} ${s.first_name || ''}`.trim() : '---';
        state.dropoutModal = { studentId: String(studentId), studentName, reason: '' };
        update();
        return;
      }



      bulkSetStatus([studentId], status);
    });
  });

  root.querySelector('[data-action="send-telegram"]')?.addEventListener('click', () => sendToTelegram());

  window.scrollTo(scrollX, scrollY);
}

// Mobile-first list view: one stacked row per student with the same
// present/absent/permission/late/dropout buttons as the desk view's popup
// menu, always visible (no popup positioning needed) so it's tap-friendly
// on a phone screen at any width.
function renderTableView(enrollments) {
  return `<div style="display:flex;flex-direction:column;gap:8px;">
    ${enrollments.map((en, i) => {
      const s = en.studentData;
      const currentStatus = getEffectiveStatus(s.id, s);
      const rec = state.attendanceRecords.find(a => String(a.student) === String(s.id));
      const opt = STATUS_OPTIONS.find(o => o.value === currentStatus);
      const statusColor = opt?.color || '#16a34a';
      const permDays = getStudentTotalPermDays(s.id);

      return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:#fff;border:1px solid var(--border);border-left:4px solid ${statusColor};">
        <div style="flex-shrink:0;width:26px;height:26px;border-radius:50%;background:var(--primary-light);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;">${i + 1}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.last_name || ''} ${s.first_name || ''}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:2px;flex-wrap:wrap;">
            <span style="font-size:0.72rem;color:var(--text-secondary);">${s.student_code || '---'}</span>
            <span style="font-size:0.72rem;font-weight:600;color:${statusColor};">${opt?.label || 'មក'}</span>
            ${currentStatus === 'late' && rec?.late_time ? `<span style="font-size:0.65rem;background:#fef3c7;color:#d97706;padding:1px 6px;border-radius:12px;font-weight:700;">ម៉ោង ${rec.late_time.slice(0,5)}</span>` : ''}
            ${permDays > 0 ? `<span style="font-size:0.65rem;background:#fff7ed;color:#ea580c;padding:1px 6px;border-radius:12px;font-weight:700;">ច្បាប់ ${permDays}ថ្ងៃ</span>` : ''}
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0;">
          ${STATUS_OPTIONS.filter(o => o.value !== 'permission').map(o => `
            <button data-action="apply-status" data-student="${s.id}" data-status="${o.value}" title="${o.label}"
              style="width:36px;height:36px;border-radius:9px;border:1.5px solid ${currentStatus === o.value ? o.color : 'var(--border)'};
                background:${currentStatus === o.value ? o.color : '#fff'};color:${currentStatus === o.value ? '#fff' : o.color};
                display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
              <i data-lucide="${o.icon}" style="width:15px;height:15px;pointer-events:none;"></i>
            </button>
          `).join('')}
        </div>
      </div>`;
    }).join('')}
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
      showToast('Telegram Bot មិនទាន់ត្រូវបានកំណត់ទេ សូមទាក់ទងអ្នកគ្រប់គ្រង', 'error');
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
    permissionModal: null, dropoutModal: null, lateModal: null,
    searchQuery: '', statusFilter: 'all', pagodaFilter: 'all', showFilters: false,
    loading: true, error: null, saving: false
  };

  if (!getMonitorInfo()) {
    root.innerHTML = `<div style="padding:20px;">សូមចូលគណនីជាប្រធានថ្នាក់</div>`;
    return;
  }

  injectPageStyles();
  fetchData();

  clearInterval(sessionTimer);
  // Removed aggressive auto-refresh that overwrites user's selected session
}

export function destroy() {
  clearInterval(sessionTimer);
  sessionTimer = null;
  root = null;
}
