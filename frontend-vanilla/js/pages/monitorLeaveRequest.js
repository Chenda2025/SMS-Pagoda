// Ports pages/MonitorLeaveRequest.jsx.

import { getUser } from '../auth.js';
import { api } from '../api.js';
import { onLiveInput } from '../utils/dom.js';
import { showToast } from '../components/toast.js';
import { getTgConfig, sendTelegramPhoto, sendTelegramMessage, withSendingSpinner } from '../utils/telegram.js';

let root = null;
let state = {
  students: [], permissions: [], atRiskStudents: [], loading: true, submitting: false, error: null, success: '',
  selectedStudent: '', reason: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0],
  studentSearch: '', showStudentDropdown: false, viewingStudentId: null, editingId: null,
};

function todayStr() { return new Date().toISOString().split('T')[0]; }

const KHMER_DAYS = ['ថ្ងៃអាទិត្យ', 'ថ្ងៃចន្ទ', 'ថ្ងៃអង្គារ', 'ថ្ងៃពុធ', 'ថ្ងៃព្រហស្បតិ៍', 'ថ្ងៃសុក្រ', 'ថ្ងៃសៅរ៍'];
function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
function toKh(num) {
  return String(num).replace(/[0-9]/g, (d) => KHMER_DIGITS[d]);
}

// Hover states can't be expressed as inline styles (markup is fully replaced
// on every render), so they're injected once as a stylesheet keyed off the
// same data-action/data-select-student attributes already used for event
// binding -- no extra classes needed.
function injectPageStyles() {
  if (document.getElementById('monitor-leave-styles')) return;
  const style = document.createElement('style');
  style.id = 'monitor-leave-styles';
  style.textContent = `
    [data-role="leave-form"] button[type="submit"]:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,70,229,0.35); }
    [data-action="cancel-edit"]:hover { background: #e5e7eb !important; }
    [data-select-student]:hover { background: var(--primary-light) !important; }
    [data-action="view-perm"]:hover { background: var(--primary-light); color: var(--primary); }
    [data-action="edit-perm"]:hover { background: rgba(245,158,11,0.12); color: var(--warning); }
    [data-action="delete-perm"]:hover { background: rgba(239,68,68,0.12); color: var(--danger); }
    [data-role="leave-history-item"]:hover { box-shadow: 0 4px 14px rgba(15,23,42,0.08); }
  `;
  document.head.appendChild(style);
}

// Maps the raw /api/students/multiple-permissions/ rows (student is an FK id,
// no image) onto the shape the rest of this page expects (student_id, image_url),
// using the already-loaded classroom roster for the name/image lookup, and
// drops any permission that belongs to a student outside this classroom
// (the endpoint returns every permission in the school, not just this class).
function attachPermissionDisplayFields(rows, students) {
  const studentIds = new Set(students.map(s => s.id));
  const imageById = {};
  students.forEach(s => { imageById[s.id] = s.image; });
  return rows
    .filter(p => studentIds.has(p.student))
    .map(p => ({ ...p, student_id: p.student, image_url: imageById[p.student] || null }))
    .sort((a, b) => b.start_date.localeCompare(a.start_date));
}

function daysInRange(startDate, endDate) {
  return Math.round((new Date(endDate + 'T00:00:00') - new Date(startDate + 'T00:00:00')) / 86400000) + 1;
}

// One row per student instead of one row per leave request -- a student with
// several leave requests used to show up as several duplicate-looking rows.
// `permissions` is already sorted newest-first (attachPermissionDisplayFields),
// so each group's `records` stay newest-first too, and re-sorting the groups
// by their newest record keeps the overall list in the same recency order.
function groupPermissionsByStudent(permissions) {
  const byStudent = new Map();
  permissions.forEach(p => {
    if (!byStudent.has(p.student_id)) {
      byStudent.set(p.student_id, { student_id: p.student_id, student_name: p.student_name, image_url: p.image_url, records: [] });
    }
    byStudent.get(p.student_id).records.push(p);
  });
  const today = new Date();
  return Array.from(byStudent.values())
    .map(g => ({
      ...g,
      totalCount: g.records.length,
      totalDays: g.records.reduce((sum, r) => sum + daysInRange(r.start_date, r.end_date), 0),
      isActive: g.records.some(r => new Date(r.start_date) <= today && new Date(r.end_date) >= today),
    }))
    .sort((a, b) => b.records[0].start_date.localeCompare(a.records[0].start_date));
}

async function loadData() {
  const monitorInfo = getUser()?.monitorInfo || {};
  if (!monitorInfo.classroom_id) { state = { ...state, loading: false }; update(); return; }
  state = { ...state, loading: true };
  update();
  try {
    const [enRes, stuRes, permRes] = await Promise.all([
      api.get(`/api/students/enrollments/students/?classroom=${monitorInfo.classroom_id}&academic_year=${monitorInfo.academic_year_id}`),
      api.get('/api/students/list/'),
      api.get('/api/students/multiple-permissions/'),
    ]);
    if (!enRes.ok || !stuRes.ok) throw new Error('Failed to fetch students');

    const imageByStudent = {};
    (stuRes.data || []).forEach(s => { imageByStudent[s.id] = s.image; });
    const students = (enRes.data || [])
      .map(e => ({ id: e.student_id, name: e.student_name, image: imageByStudent[e.student_id] || null }))
      .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'km'));

    const permissions = permRes.ok ? attachPermissionDisplayFields(permRes.data || [], students) : [];
    state = { ...state, students, permissions, loading: false };
  } catch (err) {
    state = { ...state, error: err.message, loading: false };
  }
  update();
  loadAtRiskStudents();
}

// Builds the "សិស្សលើសកំណត់" panel: one row per student (no per-record
// duplicates) whose absent/permission/late total for the current academic
// year exceeds 3 in any category -- students at or under 3 everywhere are
// left out entirely rather than shown as a "fine" row.
async function loadAtRiskStudents() {
  const monitorInfo = getUser()?.monitorInfo || {};
  if (!monitorInfo.classroom_id || !monitorInfo.academic_year_id) return;
  const counts = await computeAcademicYearCounts(monitorInfo.classroom_id, monitorInfo.academic_year_id);
  if (!counts) return;

  const atRiskStudents = state.students
    .map(s => ({ ...s, ...(counts[s.id] || { absentCount: 0, permissionCount: 0, lateCount: 0 }) }))
    .filter(s => s.absentCount > 3 || s.permissionCount > 3 || s.lateCount > 3)
    .sort((a, b) => (b.absentCount + b.permissionCount + b.lateCount) - (a.absentCount + a.permissionCount + a.lateCount));

  state = { ...state, atRiskStudents };
  update();
}

async function refreshPermissions() {
  const res = await api.get('/api/students/multiple-permissions/');
  if (res.ok) state = { ...state, permissions: attachPermissionDisplayFields(res.data || [], state.students) };
}

async function handleSubmit(e) {
  e.preventDefault();
  const { selectedStudent, reason, startDate, endDate, editingId } = state;
  if (!selectedStudent || !reason || !startDate || !endDate) {
    state = { ...state, error: 'សូមបំពេញព័ត៌មានឲ្យបានគ្រប់គ្រាន់' };
    update();
    return;
  }
  if (new Date(startDate) > new Date(endDate)) {
    state = { ...state, error: 'ថ្ងៃចាប់ផ្តើមមិនអាចធំជាងថ្ងៃបញ្ចប់ទេ' };
    update();
    return;
  }
  state = { ...state, submitting: true, error: null, success: '' };
  update();
  try {
    const body = { student: Number(selectedStudent), reason, start_date: startDate, end_date: endDate, reminder_sent: false };
    const res = editingId
      ? await api.patch(`/api/students/multiple-permissions/${editingId}/`, body)
      : await api.post('/api/students/multiple-permissions/', body);
    if (!res.ok) throw new Error('បញ្ហាក្នុងការបញ្ជូនទិន្នន័យ');
    state = { ...state, success: editingId ? 'បានកែប្រែដោយជោគជ័យ!' : 'បានសុំច្បាប់ដោយជោគជ័យ!', selectedStudent: '', studentSearch: '', reason: '', editingId: null, submitting: false };
    await refreshPermissions();
    sendLeaveToTelegram(res.data);
  } catch (err) {
    state = { ...state, error: err.message, submitting: false };
  }
  update();
}

async function handleDelete(permId) {
  if (!window.confirm('តើអ្នកពិតជាចង់លុបច្បាប់នេះមែនទេ?')) return;
  try {
    const res = await api.del(`/api/students/multiple-permissions/${permId}/`);
    if (!res.ok) throw new Error('Failed to delete permission');
    state = { ...state, permissions: state.permissions.filter(p => p.id !== permId) };
    update();
  } catch (err) {
    alert('មិនអាចលុបបានទេ: ' + err.message);
  }
}

function handleEdit(p) {
  state = {
    ...state, selectedStudent: p.student_id, reason: p.reason || '',
    startDate: new Date(p.start_date).toISOString().split('T')[0], endDate: new Date(p.end_date).toISOString().split('T')[0],
    studentSearch: '', showStudentDropdown: false, editingId: p.id, error: null, success: '', viewingStudentId: null,
  };
  update();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Shares the "tgConfig" (token/chatId) saved from the Attendance page's
// Telegram settings modal -- same localStorage key, so a bot configured
// once works from every page that sends Telegram notifications.
//
// `perm` is a serialized MultiplePermission row (student_name, classroom_name,
// pagoda_name, kuti_name, start_date, end_date come from the backend
// serializer) -- the same shape used both right after submitting a leave
// request and by the day-before reminder in checkPermissionReminders(),
// so both notices share this one template.
function buildLeaveTelegramMessage(perm) {
  const fmt = (d) => { const [y, m, day] = d.split('-'); return toKh(`${day}/${m}/${y}`); };
  const totalDays = Math.round((new Date(perm.end_date + 'T00:00:00') - new Date(perm.start_date + 'T00:00:00')) / 86400000) + 1;
  const returnDate = new Date(perm.end_date + 'T00:00:00');
  returnDate.setDate(returnDate.getDate() + 1);
  const returnStr = fmt(localDateStr(returnDate));
  const returnDayName = KHMER_DAYS[returnDate.getDay()];
  return `🔔 សេចក្តីប្រគេនដំណឹង 🔔
សាលា ពុ.អ.វិ.ស.ទ.ន.រ.
----- លិខិតសូមច្បាប់ -----
សិស្សឈ្មោះ ៖ ${perm.student_name}
ចំនួនច្បាប់ ៖ ${toKh(totalDays)} (ថ្ងៃ)
ចាបផ្តើមថ្ងៃ៖ ${fmt(perm.start_date)} ដល់ ${fmt(perm.end_date)}
ថ្នាក់ទី ៖ ${perm.classroom_name}
វត្ត ៖ ${perm.pagoda_name}
កុដិ ៖ ${perm.kuti_name}
----- ត្រូវត្រឡប់មកសិក្សាវិញ -----
នៅថ្ងៃទី ៖ ${returnStr} ( ${returnDayName} )
កាលបរិច្ឆេទ៖ ${fmt(localDateStr(new Date()))}
ដូចបានប្រគេនខាងលើនេះសូមសិស្សនិមន្តមករៀនវិញ។`;
}

async function sendLeaveToTelegram(perm, btn) {
  const tgConfig = getTgConfig();
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('Telegram Bot មិនទាន់ត្រូវបានកំណត់ទេ សូមទាក់ទងអ្នកគ្រប់គ្រង', 'error');
    return;
  }
  const text = buildLeaveTelegramMessage(perm);
  const studentImage = state.students.find(s => String(s.id) === String(perm.student))?.image;
  await withSendingSpinner(btn, async () => {
    try {
      const sentWithPhoto = studentImage && await sendTelegramPhoto(tgConfig, studentImage, text);
      if (!sentWithPhoto) await sendTelegramMessage(tgConfig, text);
      showToast('បានផ្ញើទៅ Telegram ដោយជោគជ័យ ✅', 'success');
    } catch (err) {
      showToast('មិនអាចផ្ញើ Telegram: ' + err.message, 'error');
    }
  });
}

// Combines every leave record for one student into a single notice instead
// of one Telegram message per record -- used by the "ផ្ញើប្រវត្តិទាំងអស់ទៅ
// Telegram" button in the student's full-history modal.
function buildAllLeavesTelegramMessage(group) {
  const fmt = (d) => { const [y, m, day] = d.split('-'); return toKh(`${day}/${m}/${y}`); };
  const first = group.records[0];
  const lines = [
    '🔔 សេចក្តីប្រគេនដំណឹង 🔔',
    'សាលា ពុ.អ.វិ.ស.ទ.ន.រ.',
    `----- ប្រវត្តិសុំច្បាប់ទាំងអស់ (សរុប ${toKh(group.totalCount)} ដង / ${toKh(group.totalDays)} ថ្ងៃ) -----`,
    `សិស្សឈ្មោះ ៖ ${group.student_name}`,
    `ថ្នាក់ទី ៖ ${first.classroom_name}`,
    `វត្ត ៖ ${first.pagoda_name}`,
    `កុដិ ៖ ${first.kuti_name}`,
    '',
  ];
  group.records.forEach((r, i) => {
    lines.push(`${toKh(i + 1)}. ${fmt(r.start_date)} - ${fmt(r.end_date)} (${toKh(daysInRange(r.start_date, r.end_date))} ថ្ងៃ) — ${r.reason}`);
  });
  lines.push('', `កាលបរិច្ឆេទ៖ ${fmt(localDateStr(new Date()))}`);
  return lines.join('\n');
}

async function sendAllLeavesToTelegram(group, btn) {
  const tgConfig = getTgConfig();
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('Telegram Bot មិនទាន់ត្រូវបានកំណត់ទេ សូមទាក់ទងអ្នកគ្រប់គ្រង', 'error');
    return;
  }
  const text = buildAllLeavesTelegramMessage(group);
  const studentImage = state.students.find(s => String(s.id) === String(group.student_id))?.image;
  await withSendingSpinner(btn, async () => {
    try {
      const sentWithPhoto = studentImage && await sendTelegramPhoto(tgConfig, studentImage, text);
      if (!sentWithPhoto) await sendTelegramMessage(tgConfig, text);
      showToast('បានផ្ញើប្រវត្តិច្បាប់ទាំងអស់ទៅ Telegram ដោយជោគជ័យ ✅', 'success');
    } catch (err) {
      showToast('មិនអាចផ្ញើ Telegram: ' + err.message, 'error');
    }
  });
}

// Same reminder check as attendance.js/monitorAttendance.js (shared
// "reminder_sent" flag on the permission, so whichever page loads first each
// day sends it): one day before a MULTI-day leave ends, ping Telegram with
// the same notice built by buildLeaveTelegramMessage(). Single-day leave has
// no "day before return" distinct from the leave day itself, so it's skipped.
async function checkPermissionReminders() {
  const tgConfig = getTgConfig();
  if (!tgConfig.token || !tgConfig.chatId) return;
  const today = localDateStr(new Date());

  try {
    const res = await api.get('/api/students/multiple-permissions/');
    const permissions = res.data || [];
    for (const r of permissions) {
      if (r.reminder_sent) continue;

      const totalDays = Math.round((new Date(r.end_date + 'T00:00:00') - new Date(r.start_date + 'T00:00:00')) / 86400000) + 1;
      if (totalDays <= 1) continue;

      const reminderObj = new Date(r.end_date + 'T00:00:00');
      reminderObj.setDate(reminderObj.getDate() - 1);
      if (localDateStr(reminderObj) !== today) continue;

      await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgConfig.chatId, text: buildLeaveTelegramMessage(r) })
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

// Shared by checkAttendanceWarnings() and loadAtRiskStudents(): per-student
// absent/permission/late counts within the given academic year's date range.
// report-data returns all-time date lists per student, so the academic-year
// window is applied client-side. Returns null if any dependent fetch fails.
async function computeAcademicYearCounts(classroomId, academicYearId) {
  const [enrRes, yearsRes, reportRes] = await Promise.all([
    api.get(`/api/students/enrollments/students/?classroom=${classroomId}&academic_year=${academicYearId}`),
    api.get('/api/academic-years/'),
    api.get('/api/attendance/attendance/report-data/'),
  ]);
  if (!enrRes.ok || !yearsRes.ok || !reportRes.ok) return null;

  const year = (yearsRes.data || []).find(y => String(y.id) === String(academicYearId));
  if (!year) return null;
  const inRange = (d) => d >= year.start_date && (!year.end_date || d <= year.end_date);
  const reportData = reportRes.data || {};

  const counts = {};
  (enrRes.data || []).forEach((enr) => {
    const rd = reportData[enr.student_id] || {};
    counts[enr.student_id] = {
      absentCount: (rd.absentDates || []).filter(inRange).length,
      permissionCount: (rd.permissionDates || []).filter(inRange).length,
      lateCount: (rd.lateDates || []).filter(inRange).length,
    };
  });
  return counts;
}

// Sends a "សារព្រមាន" (warning) to Telegram once a student's cumulative
// absence/permission/late count for the current academic year crosses a new
// threshold level -- backed by the attendance-warnings table (one row per
// student per year holding the highest level already warned about for each
// category) so it fires exactly once per newly-crossed level, not on every
// page load. Runs on the same pages as the leave reminder.
async function checkAttendanceWarnings() {
  const tgConfig = getTgConfig();
  if (!tgConfig.token || !tgConfig.chatId) return;
  const monitorInfo = getUser()?.monitorInfo || {};
  if (!monitorInfo.classroom_id || !monitorInfo.academic_year_id) return;

  try {
    const [counts, warnRes] = await Promise.all([
      computeAcademicYearCounts(monitorInfo.classroom_id, monitorInfo.academic_year_id),
      api.get(`/api/attendance/attendance-warnings/?academic_year=${monitorInfo.academic_year_id}`),
    ]);
    if (!counts) return;

    const warnByStudent = {};
    (warnRes.data || []).forEach(w => { warnByStudent[w.student] = w; });

    const fmt = (d) => { const [y, m, day] = d.split('-'); return toKh(`${day}/${m}/${y}`); };
    const today = fmt(localDateStr(new Date()));

    for (const sid of Object.keys(counts)) {
      const { absentCount, permissionCount, lateCount } = counts[sid];
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

function handleCancelEdit() {
  state = { ...state, selectedStudent: '', studentSearch: '', reason: '', startDate: todayStr(), endDate: todayStr(), editingId: null };
  update();
}

function filterStudents() {
  return state.students.filter(s => (s.name || '').toLowerCase().includes(state.studentSearch.toLowerCase()));
}

function studentDropdownListHTML(filteredStudents) {
  if (filteredStudents.length === 0) return `<div style="padding:14px;color:var(--text-muted);font-size:14px;text-align:center;">រកមិនឃើញសិស្ស</div>`;
  return filteredStudents.map(s => `
    <div data-select-student="${s.id}" style="padding:9px 12px;cursor:pointer;font-size:14px;color:#111827;display:flex;align-items:center;gap:10px;background-color:${String(s.id) === String(state.selectedStudent) ? 'var(--primary-light)' : 'transparent'};transition:background .1s;">
      <div style="width:28px;height:28px;border-radius:50%;background-color:var(--primary-light);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
        ${s.image ? `<img src="${s.image}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user-check" style="width:14px;height:14px;color:var(--primary)"></i>`}
      </div>
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.name}</span>
    </div>
  `).join('');
}

function studentDropdownWrapInnerHTML() {
  const { students, selectedStudent, studentSearch, showStudentDropdown, loading } = state;
  const selectedStudentObj = students.find(s => String(s.id) === String(selectedStudent));
  return `
    <label class="form-label">ឈ្មោះសិស្ស <span style="color:var(--danger);">*</span></label>
    <div style="position:relative;">
      <div style="position:absolute;top:50%;left:12px;transform:translateY(-50%);display:flex;align-items:center;pointer-events:none;">
        ${!showStudentDropdown && selectedStudentObj?.image
          ? `<img src="${selectedStudentObj.image}" alt="" style="width:22px;height:22px;border-radius:50%;object-fit:cover;" />`
          : `<i data-lucide="search" style="width:16px;height:16px;color:var(--text-muted);"></i>`}
      </div>
      <input type="text" data-role="student-search" class="form-input" value="${showStudentDropdown ? studentSearch : (selectedStudentObj?.name || '')}" placeholder="ស្វែងរក និងជ្រើសរើសសិស្ស..." ${loading ? 'disabled' : ''}
        style="padding-left:${!showStudentDropdown && selectedStudentObj?.image ? '42px' : '36px'};padding-right:36px;" />
      <div style="position:absolute;top:50%;right:12px;transform:translateY(-50%);pointer-events:none;">
        <i data-lucide="chevron-down" style="width:16px;height:16px;color:var(--text-muted);transition:transform .15s;${showStudentDropdown ? 'transform:rotate(180deg);' : ''}"></i>
      </div>
    </div>
    ${showStudentDropdown ? `
      <div data-role="student-dropdown-list" style="position:absolute;top:calc(100% + 4px);left:0;right:0;background-color:#ffffff;border:1px solid var(--border);border-radius:10px;max-height:220px;overflow-y:auto;z-index:30;box-shadow:0 10px 25px rgba(0,0,0,0.12);">
        ${studentDropdownListHTML(filterStudents())}
      </div>
    ` : ''}
  `;
}

function bindStudentListEvents() {
  const listEl = root.querySelector('[data-role="student-dropdown-list"]');
  if (!listEl) return;
  listEl.querySelectorAll('[data-select-student]').forEach(el => el.addEventListener('click', () => {
    state = { ...state, selectedStudent: el.dataset.selectStudent, studentSearch: '', showStudentDropdown: false };
    renderDropdownWrap();
  }));
}

function bindDropdownWrapEvents() {
  const searchInput = root.querySelector('[data-role="student-search"]');
  searchInput.addEventListener('focus', () => {
    if (state.showStudentDropdown) return;
    state = { ...state, studentSearch: '', showStudentDropdown: true };
    renderDropdownWrap();
    const freshInput = root.querySelector('[data-role="student-search"]');
    if (freshInput) freshInput.focus({ preventScroll: true });
  });
  // Filtering as you type only rewrites the results list -- the input
  // element itself is never touched, so it never loses focus/cursor and
  // there's nothing to re-scroll into view (this used to rebuild the whole
  // page on every keystroke, which visibly jumped the viewport).
  onLiveInput(searchInput, () => {
    state = { ...state, studentSearch: searchInput.value };
    const listEl = root.querySelector('[data-role="student-dropdown-list"]');
    if (listEl) {
      listEl.innerHTML = studentDropdownListHTML(filterStudents());
      bindStudentListEvents();
      if (window.lucide) window.lucide.createIcons();
    }
  });
  bindStudentListEvents();
}

// Re-renders only the student-search field + its dropdown (open/close,
// selecting a student) instead of the whole page -- those are the only bits
// that change, and a full update() here would tear down/rebuild the entire
// DOM tree (header, permission history, etc.), which is unnecessary reflow
// and was the source of a visible page jump on every open/select.
function renderDropdownWrap() {
  const wrap = root.querySelector('[data-role="student-dropdown-wrap"]');
  if (!wrap) return;
  wrap.innerHTML = studentDropdownWrapInnerHTML();
  bindDropdownWrapEvents();
  if (window.lucide) window.lucide.createIcons();
}

function handleOutsideClick(e) {
  if (!root || !state.showStudentDropdown) return;
  const wrap = root.querySelector('[data-role="student-dropdown-wrap"]');
  if (wrap && !wrap.contains(e.target)) { state = { ...state, showStudentDropdown: false }; renderDropdownWrap(); }
}

function update() {
  if (!root) return;
  const monitorInfo = getUser()?.monitorInfo || {};

  if (!monitorInfo?.classroom_name) {
    root.innerHTML = `<div style="padding:20px;text-align:center;color:#64748b;">គណនីរបស់អ្នកមិនទាន់ត្រូវបានចាត់តាំងជាប្រធានថ្នាក់ ឬមិនមានថ្នាក់គ្រប់គ្រងនៅឡើយទេ។</div>`;
    return;
  }

  // Every state change fully replaces root.innerHTML, which otherwise resets
  // the page scroll to the top -- jarring when e.g. deleting a row deep in
  // the history list. Restore the scroll position after the re-render.
  const scrollX = window.scrollX, scrollY = window.scrollY;
  const { permissions, atRiskStudents, loading, submitting, error, success, reason, startDate, endDate, viewingStudentId, editingId } = state;
  const activeCount = permissions.filter(p => new Date(p.start_date) <= new Date() && new Date(p.end_date) >= new Date()).length;
  const groupedPermissions = groupPermissionsByStudent(permissions);
  const viewingGroup = viewingStudentId ? groupedPermissions.find(g => String(g.student_id) === String(viewingStudentId)) : null;

  root.innerHTML = `
    <div style="min-height:100vh;background-color:#f3f4f6;font-family:'Khmer OS Battambang','Battambang',sans-serif;display:flex;justify-content:center;">
    <div class="animate-fade-in" style="width:100%;max-width:640px;">
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
        <button data-action="back" style="background:white;border:1px solid var(--border);color:#374151;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 1px 2px rgba(0,0,0,0.05);">←</button>
        <div style="flex:1;min-width:0;">
          <div style="font-size:16px;font-weight:bold;color:#111827;">សុំច្បាប់</div>
          <div style="font-size:12px;color:var(--text-secondary);">ថ្នាក់ ${monitorInfo.classroom_name}${activeCount > 0 ? ` &middot; ${activeCount} នាក់កំពុងសម្រាក` : ''}</div>
        </div>
      </div>

      <div style="padding:16px;padding-bottom:60px;display:flex;flex-direction:column;gap:20px;">
        <div style="background-color:white;border-radius:18px;padding:20px;box-shadow:0 2px 10px rgba(15,23,42,0.06);border:1px solid var(--border);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;">
              <div style="width:36px;height:36px;border-radius:10px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="file-text" style="width:18px;height:18px;color:var(--primary);"></i>
              </div>
              <div style="min-width:0;">
                <div style="font-size:15px;font-weight:700;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${editingId ? 'កែប្រែពាក្យសុំច្បាប់' : 'ទម្រង់សុំច្បាប់ថ្មី'}</div>
                <div style="font-size:11px;color:var(--text-muted);">បំពេញព័ត៌មានខាងក្រោមឲ្យបានគ្រប់គ្រាន់</div>
              </div>
            </div>
            ${editingId ? `<button type="button" data-action="cancel-edit" style="display:flex;align-items:center;gap:4px;background:#f3f4f6;border:none;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:600;color:var(--text-secondary);cursor:pointer;flex-shrink:0;transition:background .15s;"><i data-lucide="x" style="width:14px;height:14px"></i> បោះបង់</button>` : ''}
          </div>
          ${error ? `<div style="background-color:#fee2e2;color:var(--danger);padding:12px 14px;border-radius:10px;font-size:14px;margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i data-lucide="alert-circle" style="width:18px;height:18px;flex-shrink:0;"></i>${error}</div>` : ''}
          ${success ? `<div style="background-color:#d1fae5;color:var(--success);padding:12px 14px;border-radius:10px;font-size:14px;margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i data-lucide="check-circle-2" style="width:18px;height:18px;flex-shrink:0;"></i>${success}</div>` : ''}

          <form data-role="leave-form" style="display:flex;flex-direction:column;gap:16px;">
            <div data-role="student-dropdown-wrap" style="position:relative;">${studentDropdownWrapInnerHTML()}</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div>
                <label class="form-label">ចាប់ពី <span style="color:var(--danger);">*</span></label>
                <input type="date" data-f="start-date" class="form-input" value="${startDate}" />
              </div>
              <div>
                <label class="form-label">ដល់ <span style="color:var(--danger);">*</span></label>
                <input type="date" data-f="end-date" class="form-input" value="${endDate}" />
              </div>
            </div>

            <div>
              <label class="form-label">មូលហេតុ <span style="color:var(--danger);">*</span></label>
              <textarea data-f="reason" class="form-input" placeholder="សូមបញ្ជាក់មូលហេតុ (ឧ. ឈឺ, រវល់គ្រួសារ...)" rows="3" style="resize:vertical;">${reason}</textarea>
            </div>

            <button type="submit" ${submitting || loading ? 'disabled' : ''} style="width:100%;padding:14px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;font-family:inherit;cursor:${submitting || loading ? 'not-allowed' : 'pointer'};opacity:${submitting || loading ? 0.7 : 1};display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;box-shadow:0 4px 12px rgba(79,70,229,0.25);transition:all .15s;">
              ${submitting ? `<i data-lucide="loader-2" class="animate-spin" style="width:20px;height:20px"></i> កំពុងបញ្ជូន...` : editingId ? `<i data-lucide="save" style="width:18px;height:18px"></i> រក្សាទុកការកែប្រែ` : `<i data-lucide="send" style="width:18px;height:18px"></i> បញ្ជូនពាក្យសុំច្បាប់`}
            </button>
          </form>
        </div>

        ${atRiskStudents.length > 0 ? `
        <div style="background-color:white;border-radius:18px;padding:20px;box-shadow:0 2px 10px rgba(15,23,42,0.06);border:1px solid var(--border);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
            <div style="width:36px;height:36px;border-radius:10px;background:#fee2e2;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="alert-triangle" style="width:18px;height:18px;color:var(--danger);"></i>
            </div>
            <div style="min-width:0;">
              <div style="font-size:15px;font-weight:700;color:#111827;">សិស្សលើសកំណត់</div>
              <div style="font-size:11px;color:var(--text-muted);">លើសពី ៣ ដងក្នុងឆ្នាំសិក្សានេះ</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${atRiskStudents.map(s => `
              <div style="padding:12px 14px;border-radius:14px;border:1px solid var(--border);display:flex;align-items:center;gap:12px;">
                <div style="width:36px;height:36px;border-radius:50%;background-color:${s.image ? 'transparent' : 'var(--primary-light)'};display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                  ${s.image ? `<img src="${s.image}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user-check" style="width:18px;height:18px;color:var(--primary)"></i>`}
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:14px;font-weight:bold;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.name}</div>
                  <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
                    ${s.absentCount > 3 ? `<span style="font-size:11px;font-weight:700;color:#b91c1c;background:#fee2e2;padding:2px 8px;border-radius:999px;">អវត្តមាន ${toKh(s.absentCount)}</span>` : ''}
                    ${s.permissionCount > 3 ? `<span style="font-size:11px;font-weight:700;color:#b45309;background:#fef3c7;padding:2px 8px;border-radius:999px;">ច្បាប់ ${toKh(s.permissionCount)}</span>` : ''}
                    ${s.lateCount > 3 ? `<span style="font-size:11px;font-weight:700;color:#0369a1;background:#e0f2fe;padding:2px 8px;border-radius:999px;">យឺត ${toKh(s.lateCount)}</span>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="background-color:white;border-radius:18px;padding:20px;box-shadow:0 2px 10px rgba(15,23,42,0.06);border:1px solid var(--border);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;border-radius:10px;background:#fef3c7;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="calendar-clock" style="width:18px;height:18px;color:var(--warning);"></i>
              </div>
              <div style="font-size:15px;font-weight:700;color:#111827;">ប្រវត្តិច្បាប់ថ្មីៗ</div>
            </div>
            ${!loading && permissions.length > 0 ? `<span style="font-size:12px;font-weight:700;color:var(--text-secondary);background:#f3f4f6;padding:4px 10px;border-radius:999px;flex-shrink:0;">${permissions.length} កំណត់ត្រា</span>` : ''}
          </div>
          ${loading ? `<div style="text-align:center;padding:30px 20px;color:var(--text-secondary);"><i data-lucide="loader-2" class="animate-spin" style="display:block;margin:0 auto 8px;width:24px;height:24px;"></i>កំពុងទាញយកទិន្នន័យ...</div>`
            : groupedPermissions.length === 0 ? `<div style="text-align:center;padding:36px 20px;color:var(--text-muted);"><i data-lucide="calendar-x" style="width:32px;height:32px;margin:0 auto 10px;display:block;opacity:0.5;"></i>មិនទាន់មានទិន្នន័យសុំច្បាប់នៅឡើយទេ</div>`
            : `<div style="display:flex;flex-direction:column;gap:10px;">
                ${groupedPermissions.map(g => {
                  const isOverLimit = g.totalCount > 3;
                  return `
                    <div data-role="leave-history-item" data-action="view-perm" data-student-id="${g.student_id}" style="padding:12px 14px;border-radius:14px;border:1px solid ${isOverLimit ? 'var(--danger)' : 'var(--border)'};border-left:4px solid ${isOverLimit ? 'var(--danger)' : g.isActive ? 'var(--warning)' : 'var(--border)'};background-color:${isOverLimit ? '#fef2f2' : g.isActive ? '#fffbeb' : '#fafafa'};display:flex;align-items:center;gap:12px;transition:box-shadow .15s;cursor:pointer;">
                      <div style="width:40px;height:40px;border-radius:50%;background-color:${g.image_url ? 'transparent' : 'var(--primary-light)'};display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                        ${g.image_url ? `<img src="${g.image_url}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user-check" style="width:20px;height:20px;color:var(--primary)"></i>`}
                      </div>
                      <div style="flex:1;min-width:0;">
                        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                          <span style="font-size:15px;font-weight:bold;color:#111827;">${g.student_name}</span>
                          ${isOverLimit ? `<span style="font-size:10px;font-weight:700;color:var(--danger);background:#fee2e2;padding:2px 8px;border-radius:999px;display:flex;align-items:center;gap:3px;"><i data-lucide="alert-triangle" style="width:10px;height:10px;"></i>លើសកំណត់</span>` : ''}
                          ${g.isActive ? `<span style="font-size:10px;font-weight:700;color:var(--warning);background:#fef3c7;padding:2px 8px;border-radius:999px;">កំពុងសម្រាក</span>` : ''}
                        </div>
                        <div style="font-size:13px;margin-top:2px;color:${isOverLimit ? 'var(--danger)' : '#4b5563'};font-weight:${isOverLimit ? '700' : '400'};">សុំច្បាប់សរុប ${toKh(g.totalCount)} ដង &middot; ${toKh(g.totalDays)} ថ្ងៃ</div>
                        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;display:flex;align-items:center;gap:4px;">
                          <i data-lucide="calendar" style="width:12px;height:12px;"></i>ថ្មីបំផុត៖ ${new Date(g.records[0].start_date).toLocaleDateString('km-KH')} - ${new Date(g.records[0].end_date).toLocaleDateString('km-KH')}
                        </div>
                      </div>
                      <div style="width:34px;height:34px;color:var(--text-secondary);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;" title="មើលព័ត៌មានទាំងអស់"><i data-lucide="eye" style="width:18px;height:18px"></i></div>
                    </div>
                  `;
                }).join('')}
              </div>`}
        </div>
      </div>

      ${viewingGroup ? `
        <div data-action="close-view" style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;">
          <div data-stop style="background-color:#fff;border-radius:18px;padding:24px;max-width:400px;width:100%;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-shrink:0;">
              <h3 style="font-size:16px;font-weight:bold;color:#111827;margin:0;">ប្រវត្តិច្បាប់ទាំងអស់</h3>
              <button data-action="close-view" style="background:transparent;border:none;cursor:pointer;color:var(--text-secondary);padding:4px;"><i data-lucide="x" style="width:20px;height:20px"></i></button>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:16px;flex-shrink:0;">
              <div style="width:64px;height:64px;border-radius:50%;background-color:${viewingGroup.image_url ? 'transparent' : 'var(--primary-light)'};display:flex;align-items:center;justify-content:center;overflow:hidden;">
                ${viewingGroup.image_url ? `<img src="${viewingGroup.image_url}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user-check" style="width:28px;height:28px;color:var(--primary)"></i>`}
              </div>
              <div style="font-size:17px;font-weight:bold;color:#111827;">${viewingGroup.student_name}</div>
              <div style="font-size:13px;color:var(--text-secondary);">សុំច្បាប់សរុប ${toKh(viewingGroup.totalCount)} ដង &middot; សរុប ${toKh(viewingGroup.totalDays)} ថ្ងៃ</div>
              <button data-action="send-all-telegram" style="display:flex;align-items:center;gap:6px;background:#0088cc;color:#fff;border:none;border-radius:999px;padding:7px 16px;font-size:12px;font-weight:600;cursor:pointer;margin-top:4px;"><i data-lucide="send" style="width:13px;height:13px"></i>ផ្ញើប្រវត្តិទាំងអស់ទៅ Telegram</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;overflow-y:auto;">
              ${viewingGroup.records.map(r => {
                const isActive = new Date(r.start_date) <= new Date() && new Date(r.end_date) >= new Date();
                return `
                  <div style="padding:12px 14px;border-radius:12px;border:1px solid var(--border);background-color:${isActive ? '#fffbeb' : '#fafafa'};font-size:13px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                      <div style="color:#111827;font-weight:600;flex:1;min-width:0;">${r.reason}</div>
                      <div style="display:flex;gap:2px;flex-shrink:0;">
                        <button data-action="edit-perm" data-id="${r.id}" style="width:26px;height:26px;background:transparent;border:none;color:var(--text-secondary);cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;" title="កែប្រែ"><i data-lucide="pencil" style="width:14px;height:14px"></i></button>
                        <button data-action="delete-perm" data-id="${r.id}" style="width:26px;height:26px;background:transparent;border:none;color:var(--text-secondary);cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;" title="លុបច្បាប់"><i data-lucide="trash-2" style="width:14px;height:14px"></i></button>
                      </div>
                    </div>
                    <div style="color:var(--text-secondary);margin-top:6px;display:flex;align-items:center;gap:4px;">
                      <i data-lucide="calendar" style="width:12px;height:12px;"></i>${new Date(r.start_date).toLocaleDateString('km-KH')} - ${new Date(r.end_date).toLocaleDateString('km-KH')} (${toKh(daysInRange(r.start_date, r.end_date))} ថ្ងៃ)
                      ${isActive ? `<span style="font-size:10px;font-weight:700;color:var(--warning);background:#fef3c7;padding:1px 7px;border-radius:999px;margin-left:auto;">កំពុងសម្រាក</span>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
    </div>
  `;

  root.querySelector('[data-action="back"]').addEventListener('click', () => window.history.back());
  const cancelEditBtn = root.querySelector('[data-action="cancel-edit"]');
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', handleCancelEdit);
  root.querySelector('[data-role="leave-form"]').addEventListener('submit', handleSubmit);

  bindDropdownWrapEvents();

  root.querySelector('[data-f="start-date"]').addEventListener('input', (e) => { state.startDate = e.target.value; });
  root.querySelector('[data-f="end-date"]').addEventListener('input', (e) => { state.endDate = e.target.value; });
  root.querySelector('[data-f="reason"]').addEventListener('input', (e) => { state.reason = e.target.value; });

  root.querySelectorAll('[data-action="view-perm"]').forEach(el => el.addEventListener('click', () => { state = { ...state, viewingStudentId: el.dataset.studentId }; update(); }));
  root.querySelectorAll('[data-action="edit-perm"]').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); handleEdit(permissions.find(p => p.id === Number(btn.dataset.id))); }));
  root.querySelectorAll('[data-action="delete-perm"]').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); handleDelete(Number(btn.dataset.id)); }));
  root.querySelectorAll('[data-action="close-view"]').forEach(el => el.addEventListener('click', () => { state = { ...state, viewingStudentId: null }; update(); }));
  const sendAllBtn = root.querySelector('[data-action="send-all-telegram"]');
  if (sendAllBtn) sendAllBtn.addEventListener('click', (e) => { e.stopPropagation(); if (viewingGroup) sendAllLeavesToTelegram(viewingGroup, sendAllBtn); });

  if (window.lucide) window.lucide.createIcons();

  window.scrollTo(scrollX, scrollY);
}

export function render(container) {
  root = container;
  state = { students: [], permissions: [], atRiskStudents: [], loading: true, submitting: false, error: null, success: '', selectedStudent: '', reason: '', startDate: todayStr(), endDate: todayStr(), studentSearch: '', showStudentDropdown: false, viewingPermission: null, editingId: null };
  injectPageStyles();
  document.addEventListener('mousedown', handleOutsideClick);
  update();
  loadData();
  checkPermissionReminders();
  checkAttendanceWarnings();
}

export function destroy() {
  document.removeEventListener('mousedown', handleOutsideClick);
  root = null;
}
