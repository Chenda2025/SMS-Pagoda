// Ports pages/MonitorStudentList.jsx.

import { getUser } from '../auth.js';
import { api } from '../api.js';
import { navigate } from '../router.js';
import { createMonitorBottomNav } from '../components/monitorBottomNav.js';
import { openMonitorAccountSheet } from '../components/monitorAccountSheet.js';
import { withFocusPreserved, onLiveInput } from '../utils/dom.js';
import { toKhmerNumerals } from '../utils/khmer.js';
import { getTgConfig, sendTelegramPhoto, sendTelegramMessage, withSendingSpinner } from '../utils/telegram.js';
import { showToast } from '../components/toast.js';

let root = null;
let outsideClickHandler = null;
let state = {
  students: [], classroomName: '', loading: true, selected: null, detail: [], attendanceRows: [],
  attendanceFilter: 'all', pagodaFilter: 'all', statusFilter: 'all', dropoutFilter: 'all', search: '', showFilters: false,
};

function formatDob(dob) {
  if (!dob) return null;
  try {
    const d = new Date(dob);
    if (isNaN(d)) return dob;
    return d.toLocaleDateString('km-KH', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch { return dob; }
}

function getAttRate(s) {
  const total = s.present + s.absent + s.permission + s.late;
  return total > 0 ? Math.round((s.present / total) * 100) : null;
}

function rateColor(rate) {
  if (rate === null) return '#9ca3af';
  if (rate >= 80) return '#10b981';
  if (rate >= 50) return '#f59e0b';
  return '#ef4444';
}

function isDropout(s) {
  return s.dropout === true;
}

function buildStudentInfoTelegramMessage(s, classroomName) {
  const rate = getAttRate(s);
  const total = s.present + s.absent + s.permission + s.late;
  const kh = toKhmerNumerals;
  return [
    '🔔 ព័ត៌មានសិស្ស 🔔',
    'សាលា ពុ.អ.វិ.ស.ទ.ន.រ.',
    '----- ព័ត៌មានទូទៅ -----',
    `ឈ្មោះ ៖ ${s.name}`,
    `កូដសិស្ស ៖ ${s.code || '---'}`,
    `ថ្នាក់ទី ៖ ${classroomName || '---'}`,
    formatDob(s.dob) ? `ថ្ងៃខែឆ្នាំកំណើត ៖ ${formatDob(s.dob)}` : null,
    s.pagoda ? `វត្ត ៖ ${s.pagoda}` : null,
    s.kodi ? `កុដិ ៖ ${s.kodi}` : null,
    s.dropout ? `ស្ថានភាព ៖ ឈប់រៀន${s.dropoutReason ? ` (${s.dropoutReason})` : ''}` : null,
    '',
    '----- វត្តមានសិក្សា -----',
    `មករៀន ៖ ${kh(s.present)} ថ្ងៃ`,
    `អវត្តមាន ៖ ${kh(s.absent)} ថ្ងៃ`,
    `ច្បាប់ ៖ ${kh(s.permission)} ថ្ងៃ`,
    `យឺត ៖ ${kh(s.late)} ថ្ងៃ`,
    `សរុប ៖ ${kh(total)} ថ្ងៃ${rate !== null ? ` (អត្រា ${kh(rate)}%)` : ''}`,
  ].filter(line => line !== null).join('\n');
}

async function sendStudentInfoToTelegram(s, btn) {
  const tgConfig = getTgConfig();
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('Telegram Bot មិនទាន់ត្រូវបានកំណត់ទេ សូមទាក់ទងអ្នកគ្រប់គ្រង', 'error');
    return;
  }
  const text = buildStudentInfoTelegramMessage(s, state.classroomName);
  await withSendingSpinner(btn, async () => {
    try {
      const sentWithPhoto = s.image && await sendTelegramPhoto(tgConfig, s.image, text);
      if (!sentWithPhoto) await sendTelegramMessage(tgConfig, text);
      showToast('បានផ្ញើព័ត៌មានសិស្សទៅ Telegram ដោយជោគជ័យ ✅', 'success');
    } catch (err) {
      showToast('មិនអាចផ្ញើ Telegram: ' + err.message, 'error');
    }
  });
}

// Attendance has no "present" rows -- absence of a row for a day means the
// student was present. When more than one session that day has a row for a
// student, the worse status wins (absent > permission > late).
function worstStatusForDay(records) {
  if (records.some(r => r.status === 'absent')) return 'absent';
  if (records.some(r => r.status === 'permission')) return 'permission';
  if (records.some(r => r.status === 'late')) return 'late';
  return null;
}

async function loadStudents() {
  const monitorInfo = getUser()?.monitorInfo || {};
  if (!monitorInfo.classroom_id) { state = { ...state, loading: false }; update(); return; }
  try {
    const [enRes, stuRes, attRes, pagRes, kutRes, dropRes] = await Promise.all([
      api.get(`/api/students/enrollments/students/?classroom=${monitorInfo.classroom_id}&academic_year=${monitorInfo.academic_year_id}`),
      api.get('/api/students/list/'),
      api.get('/api/attendance/attendance/'),
      api.get('/api/core/pagodas/'),
      api.get('/api/core/kutis/'),
      api.get('/api/students/dropouts/'),
    ]);

    const studentMap = {};
    (stuRes.ok ? stuRes.data || [] : []).forEach(s => { studentMap[s.id] = s; });
    const pagodas = pagRes.ok ? pagRes.data || [] : [];
    const kutis = kutRes.ok ? kutRes.data || [] : [];
    const dropouts = dropRes.ok ? dropRes.data || [] : [];

    const classroomRows = (attRes.ok ? attRes.data || [] : []).filter(r =>
      String(r.classroom) === String(monitorInfo.classroom_id) &&
      String(r.academic_year) === String(monitorInfo.academic_year_id)
    );
    const rowsByStudent = {};
    const classDates = new Set();
    classroomRows.forEach(r => {
      classDates.add(r.attendance_date);
      (rowsByStudent[r.student] = rowsByStudent[r.student] || []).push(r);
    });
    const totalDays = classDates.size;

    const enrollments = enRes.ok ? enRes.data || [] : [];
    const students = enrollments.map(e => {
      const full = studentMap[e.student_id] || {};
      const rows = rowsByStudent[e.student_id] || [];
      const byDate = {};
      rows.forEach(r => { (byDate[r.attendance_date] = byDate[r.attendance_date] || []).push(r); });

      let absent = 0, permission = 0, late = 0;
      Object.values(byDate).forEach(dayRows => {
        const worst = worstStatusForDay(dayRows);
        if (worst === 'absent') absent++;
        else if (worst === 'permission') permission++;
        else if (worst === 'late') late++;
      });
      const present = Math.max(totalDays - (absent + permission + late), 0);

      const pagoda = pagodas.find(p => String(p.id) === String(full.pagoda));
      const kuti = kutis.find(k => String(k.id) === String(full.kuti));

      const studentDropouts = dropouts.filter(d => String(d.student) === String(e.student_id));
      let isDropped = full.status === 'dropped';
      let dropoutReason = null;
      if (studentDropouts.length > 0) {
        studentDropouts.sort((a, b) => b.id - a.id);
        isDropped = studentDropouts[0].status === true;
        if (isDropped) dropoutReason = studentDropouts[0].reason;
      }

      return {
        id: e.student_id,
        name: e.student_name,
        code: e.student_code,
        dob: e.date_of_birth,
        image: full.image_url || null,
        pagoda: pagoda?.name || null,
        kodi: kuti?.name || null,
        status: full.status,
        dropout: isDropped,
        dropoutReason,
        desk_number: e.desk_number,
        present, absent, permission, late,
      };
    });

    students.sort((a, b) => a.name.localeCompare(b.name, 'km'));

    state = { ...state, students, attendanceRows: classroomRows, classroomName: monitorInfo.classroom_name || '', loading: false };
  } catch (err) {
    console.error('Failed to load students:', err);
    state = { ...state, loading: false };
  }
  update();
}

function openDetail(s) {
  const rows = (state.attendanceRows || [])
    .filter(r => String(r.student) === String(s.id))
    .sort((a, b) => b.attendance_date.localeCompare(a.attendance_date));
  state = { ...state, selected: s, detail: rows };
  update();
}

function statChip(label, value, color, bg) {
  return `<div style="background-color:${bg};border-radius:8px;padding:6px 4px;text-align:center;"><div style="font-size:14px;font-weight:bold;color:${color};">${value}</div><div style="font-size:10px;color:${color};opacity:0.8;font-weight:bold;">${label}</div></div>`;
}

function miniStat(label, value, color, bg) {
  return `<div style="background-color:${bg};border-radius:8px;padding:6px 4px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-size:15px;font-weight:bold;color:${color};line-height:1;">${value}</div><div style="font-size:9px;color:${color};opacity:0.85;font-weight:bold;margin-top:2px;">${label}</div></div>`;
}

const SESSION_LABELS = { morning: 'ព្រឹក', afternoon: 'រសៀល' };

function renderDetailSheet() {
  const { selected, detail, classroomName } = state;
  if (!selected) return '';
  const rate = getAttRate(selected);
  const total = selected.present + selected.absent + selected.permission + selected.late;
  const circumference = 2 * Math.PI * 24;

  const grouped = detail.reduce((acc, r) => {
    const d = new Date(r.attendance_date);
    const key = d.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return `
    <div data-action="close-detail" style="position:fixed;inset:0;background-color:rgba(0,0,0,0.45);z-index:50;"></div>
    <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background-color:white;border-top-left-radius:24px;border-top-right-radius:24px;z-index:51;max-height:85vh;display:flex;flex-direction:column;">
      <div style="display:flex;justify-content:center;padding-top:12px;padding-bottom:4px;flex-shrink:0;"><div style="width:40px;height:4px;border-radius:2px;background-color:#e5e7eb;"></div></div>
      <div style="padding:10px 20px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f3f4f6;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:44px;height:44px;border-radius:50%;background-color:#eef2ff;color:#4f46e5;font-size:18px;display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;overflow:hidden;">${selected.image ? `<img src="${selected.image}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : (selected.name.split(' ').pop()?.[0] || '?')}</div>
          <div>
            <div style="font-weight:bold;font-size:15px;color:#111827;">${selected.name}</div>
            <div style="font-size:11px;color:#9ca3af;margin-top:2px;">${formatDob(selected.dob) ? formatDob(selected.dob) : classroomName}${selected.pagoda ? ` · ${selected.pagoda}` : ''}${selected.kodi ? ` · ${selected.kodi}` : ''}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
          <button data-action="send-student-telegram" title="ផ្ញើទៅ Telegram" style="width:30px;height:30px;border-radius:50%;background-color:#e0f2fe;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0088cc;">
            <i data-lucide="send" style="width:15px;height:15px;pointer-events:none;"></i>
          </button>
          <button data-action="close-detail" style="width:30px;height:30px;border-radius:50%;background-color:#f3f4f6;border:none;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;">✕</button>
        </div>
      </div>
      <div style="padding:12px 20px;display:flex;gap:8px;flex-shrink:0;border-bottom:1px solid #f3f4f6;">
        <div style="position:relative;width:60px;height:60px;flex-shrink:0;">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" fill="none" stroke="#f3f4f6" stroke-width="5" />
            <circle cx="30" cy="30" r="24" fill="none" stroke="${rateColor(rate)}" stroke-width="5" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * (1 - (rate ?? 0) / 100)}" stroke-linecap="round" transform="rotate(-90 30 30)" />
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><span style="font-size:11px;font-weight:bold;color:${rateColor(rate)};">${rate ?? 0}%</span></div>
        </div>
        <div style="flex:1;display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;">
          ${miniStat('អវត្តមាន', selected.absent, '#ef4444', '#fee2e2')}
          ${miniStat('ច្បាប់', selected.permission, '#3b82f6', '#dbeafe')}
          ${miniStat('យឺត', selected.late, '#f59e0b', '#fef3c7')}
        </div>
        <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background-color:#f9fafb;border-radius:10px;padding:6px 10px;min-width:52px;">
          <div style="font-size:16px;font-weight:bold;color:#374151;">${total}</div>
          <div style="font-size:9px;color:#9ca3af;font-weight:bold;text-align:center;">ថ្ងៃ<br/>សរុប</div>
        </div>
      </div>
      <div style="overflow-y:auto;flex:1;padding:12px 20px 28px;">
        ${detail.length === 0 ? `<div style="text-align:center;padding:32px;color:#9ca3af;font-size:13px;">គ្មានកំណត់ត្រាអវត្តមាន</div>`
          : `<div style="display:flex;flex-direction:column;gap:8px;">
              ${Object.entries(grouped).map(([date, records]) => `
                <div>
                  <div style="font-size:11px;font-weight:bold;color:#9ca3af;margin-bottom:6px;margin-top:4px;">${date}</div>
                  <div style="display:flex;flex-direction:column;gap:6px;">
                    ${records.map(r => {
                      const cfg = r.status === 'absent' ? { label: 'អវត្តមាន', color: '#ef4444', bg: '#fff1f2', icon: '❌' }
                        : r.status === 'permission' ? { label: 'ច្បាប់', color: '#3b82f6', bg: '#eff6ff', icon: '📋' }
                        : { label: 'យឺត', color: '#f59e0b', bg: '#fffbeb', icon: '⏰' };
                      return `
                        <div style="background-color:${cfg.bg};border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:10px;">
                          <span style="font-size:16px;flex-shrink:0;">${cfg.icon}</span>
                          <div style="flex:1;min-width:0;">
                            <div style="font-weight:bold;font-size:13px;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">វេន${SESSION_LABELS[r.session] || r.session}</div>
                          </div>
                          <span style="display:inline-flex;align-items:center;font-size:11px;font-weight:bold;color:${cfg.color};background-color:white;border-radius:6px;padding:2px 8px;flex-shrink:0;">
                            ${cfg.label}
                            ${r.status === 'late' && r.late_time ? `<span style="margin-left:6px;color:#d97706;background:#fef3c7;padding:2px 6px;border-radius:8px;font-size:10px;">ម៉ោង ${r.late_time.slice(0,5)}</span>` : ''}
                          </span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `).join('')}
            </div>`}
      </div>
    </div>
  `;
}

function update() {
  if (!root) return;
  // Every state change fully replaces root.innerHTML, which otherwise resets
  // the page scroll to the top -- jarring when tapping a student card deep
  // in the list. Restore the scroll position after the re-render instead.
  const scrollX = window.scrollX, scrollY = window.scrollY;
  const monitorInfo = getUser()?.monitorInfo || {};
  const { students, classroomName, loading, attendanceFilter, pagodaFilter, statusFilter, dropoutFilter, search, showFilters } = state;
  const filtersActive = attendanceFilter !== 'all' || pagodaFilter !== 'all' || statusFilter !== 'all' || dropoutFilter !== 'all';

  const pagodaOptions = [...new Set(students.map(s => s.pagoda).filter(Boolean))].sort();
  const filtered = students.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (pagodaFilter !== 'all' && s.pagoda !== pagodaFilter) return false;
    if (statusFilter !== 'all' && !(s[statusFilter] > 0)) return false;
    if (dropoutFilter === 'active' && isDropout(s)) return false;
    if (dropoutFilter === 'dropped' && !isDropout(s)) return false;
    if (attendanceFilter !== 'all') {
      const total = s.present + s.absent + s.permission + s.late;
      const rate = total > 0 ? (s.present / total) * 100 : 0;
      if (attendanceFilter === 'high' && rate < 80) return false;
      if (attendanceFilter === 'medium' && (rate < 50 || rate >= 80)) return false;
      if (attendanceFilter === 'low' && rate >= 50) return false;
    }
    return true;
  }).sort((a, b) => {
    // Dropped-out students always sink to the bottom. Otherwise sort by desk_number.
    const aDrop = isDropout(a), bDrop = isDropout(b);
    if (aDrop !== bDrop) return aDrop ? 1 : -1;
    const deskA = typeof a.desk_number === 'number' && a.desk_number !== null ? a.desk_number : 9999;
    const deskB = typeof b.desk_number === 'number' && b.desk_number !== null ? b.desk_number : 9999;
    if (deskA !== deskB) return deskA - deskB;
    return (a.name || '').localeCompare(b.name || '', 'km');
  });

  root.innerHTML = `
    <div style="min-height:100vh;background-color:#f3f4f6;font-family:'Khmer OS Battambang','Battambang',sans-serif;display:flex;justify-content:center;">
      <div style="width:100%;max-width:480px;padding-bottom:80px;">
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
          <button data-action="back" style="background:white;border:1px solid #e5e7eb;color:#374151;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 1px 2px rgba(0,0,0,0.05);">←</button>
          <div style="flex:1;">
            <div style="font-size:16px;font-weight:bold;color:#111827;">បញ្ជីសិស្ស</div>
            <div style="font-size:12px;color:#6b7280;">${classroomName || monitorInfo.classroom_name || ''}</div>
          </div>
          <button data-action="schedule" style="background:white;border:1px solid #e5e7eb;color:#374151;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 1px 2px rgba(0,0,0,0.05);" title="កាលវិភាគ">📅</button>
        </div>

        <div style="padding:16px 16px 0;display:flex;gap:8px;">
          <div style="position:relative;flex:1;min-width:0;">
            <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;">🔍</span>
            <input type="text" data-role="search" value="${search}" placeholder="ស្វែងរកឈ្មោះសិស្ស..."
              style="width:100%;box-sizing:border-box;padding:12px 40px 12px 40px;border-radius:14px;border:1.5px solid #e5e7eb;font-size:14px;font-family:inherit;outline:none;background-color:white;box-shadow:0 2px 8px rgba(0,0,0,0.06);" />
            ${search ? `<button data-action="clear-search" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:#e5e7eb;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;color:#6b7280;">✕</button>` : ''}
          </div>
          <div style="position:relative;flex-shrink:0;">
            <button data-action="toggle-filters" style="position:relative;width:44px;height:44px;border-radius:14px;border:1.5px solid ${showFilters ? '#4f46e5' : '#e5e7eb'};background-color:${showFilters ? '#eef2ff' : 'white'};cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.06);color:${showFilters ? '#4f46e5' : '#6b7280'};">
              <i data-lucide="sliders-horizontal" style="width:18px;height:18px;"></i>
              ${filtersActive ? `<span style="position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background-color:#ef4444;border:1.5px solid white;"></span>` : ''}
            </button>
            ${showFilters ? `
              <div data-role="filter-panel" style="position:absolute;top:calc(100% + 8px);right:0;z-index:20;width:240px;background-color:white;border-radius:14px;padding:14px;box-shadow:0 8px 24px rgba(0,0,0,0.12);border:1px solid #f3f4f6;">
                <div style="margin-bottom:12px;">
                  <div style="font-size:11px;font-weight:bold;color:#6b7280;margin-bottom:6px;">វត្ត</div>
                  <select data-f="pagoda" style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:13px;font-family:inherit;outline:none;background-color:#f9fafb;">
                    <option value="all" ${pagodaFilter === 'all' ? 'selected' : ''}>ទាំងអស់</option>
                    ${pagodaOptions.map(p => `<option value="${p}" ${pagodaFilter === p ? 'selected' : ''}>${p}</option>`).join('')}
                    <option value="" ${pagodaFilter === '' ? 'selected' : ''}>គ្មានវត្ត</option>
                  </select>
                </div>
                <div style="margin-bottom:12px;">
                  <div style="font-size:11px;font-weight:bold;color:#6b7280;margin-bottom:6px;">វត្តមាន</div>
                  <select data-f="attendance" style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:13px;font-family:inherit;outline:none;background-color:#f9fafb;">
                    <option value="all" ${attendanceFilter === 'all' ? 'selected' : ''}>ទាំងអស់</option>
                    <option value="high" ${attendanceFilter === 'high' ? 'selected' : ''}>ល្អ (≥80%)</option>
                    <option value="medium" ${attendanceFilter === 'medium' ? 'selected' : ''}>មធ្យម (50–79%)</option>
                    <option value="low" ${attendanceFilter === 'low' ? 'selected' : ''}>ខ្សោយ (&lt;50%)</option>
                  </select>
                </div>
                <div style="margin-bottom:12px;">
                  <div style="font-size:11px;font-weight:bold;color:#6b7280;margin-bottom:6px;">ស្ថានភាព</div>
                  <select data-f="status" style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:13px;font-family:inherit;outline:none;background-color:#f9fafb;">
                    <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>ទាំងអស់</option>
                    <option value="absent" ${statusFilter === 'absent' ? 'selected' : ''}>អវត្តមាន</option>
                    <option value="permission" ${statusFilter === 'permission' ? 'selected' : ''}>ច្បាប់</option>
                    <option value="late" ${statusFilter === 'late' ? 'selected' : ''}>យឺត</option>
                  </select>
                </div>
                <div${filtersActive ? ' style="margin-bottom:12px;"' : ''}>
                  <div style="font-size:11px;font-weight:bold;color:#6b7280;margin-bottom:6px;">ស្ថានភាពសិស្ស</div>
                  <select data-f="dropout" style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:13px;font-family:inherit;outline:none;background-color:#f9fafb;">
                    <option value="all" ${dropoutFilter === 'all' ? 'selected' : ''}>ទាំងអស់</option>
                    <option value="active" ${dropoutFilter === 'active' ? 'selected' : ''}>កំពុងសិក្សា</option>
                    <option value="dropped" ${dropoutFilter === 'dropped' ? 'selected' : ''}>ឈប់រៀន</option>
                  </select>
                </div>
                ${filtersActive ? `<button data-action="clear-filters" style="width:100%;font-size:12px;color:#4f46e5;font-weight:bold;background-color:#eef2ff;border:none;cursor:pointer;padding:8px 6px;border-radius:8px;">សម្អាតតម្រង</button>` : ''}
              </div>
            ` : ''}
          </div>
        </div>

        <div style="padding:10px 16px 0;display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#6b7280;font-weight:bold;">សិស្សចំនួន ${filtered.length} នាក់</span>
        </div>

        <div style="padding:12px 16px 0;">
          ${loading ? `<div style="text-align:center;padding:48px;color:#9ca3af;font-size:14px;">កំពុងផ្ទុក...</div>`
            : filtered.length === 0 ? `<div style="text-align:center;padding:48px;color:#9ca3af;font-size:14px;">មិនមានសិស្សត្រូវបង្ហាញ</div>`
            : `<div style="display:flex;flex-direction:column;gap:10px;">
                ${filtered.map((s, i) => {
                  const rate = getAttRate(s);
                  const dropped = isDropout(s);
                  return `
                    <div data-student="${s.id}" style="background-color:white;border-radius:14px;padding:14px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);border-left:4px solid ${dropped ? '#d1d5db' : rateColor(rate)};cursor:pointer;${dropped ? 'opacity:0.6;' : ''}">
                      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;background-color:#eef2ff;color:#4f46e5;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">${s.image ? `<img src="${s.image}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : (i + 1)}</div>
                        <div style="flex:1;min-width:0;">
                          <div style="display:flex;align-items:center;gap:6px;">
                            <div style="font-weight:bold;font-size:14px;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.name}</div>
                            ${dropped ? `<span style="font-size:10px;font-weight:bold;color:#6b7280;background-color:#f3f4f6;border-radius:6px;padding:2px 6px;flex-shrink:0;">ឈប់រៀន${s.dropoutReason ? ` (${s.dropoutReason})` : ''}</span>` : ''}
                          </div>
                          <div style="font-size:11px;color:#9ca3af;margin-top:1px;">${formatDob(s.dob) ? `កំណើត: ${formatDob(s.dob)}` : 'ចុចដើម្បីមើលព័ត៌មាន'}</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                          ${rate !== null ? `<div style="font-size:14px;font-weight:bold;color:${rateColor(rate)};">${rate}%</div>` : ''}
                          <div style="color:#d1d5db;font-size:16px;">›</div>
                        </div>
                      </div>
                      ${(s.pagoda || s.kodi) ? `
                        <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
                          ${s.pagoda ? `<span style="font-size:11px;background-color:#f0fdf4;color:#16a34a;border-radius:6px;padding:3px 8px;font-weight:bold;">🏛 ${s.pagoda}</span>` : ''}
                          ${s.kodi ? `<span style="font-size:11px;background-color:#fef9ec;color:#92400e;border-radius:6px;padding:3px 8px;font-weight:bold;">🏠 ${s.kodi}</span>` : ''}
                        </div>
                      ` : ''}
                      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;">
                        ${statChip('វត្តមាន', s.present, '#10b981', '#d1fae5')}
                        ${statChip('អវត្តមាន', s.absent, '#ef4444', '#fee2e2')}
                        ${statChip('ច្បាប់', s.permission, '#3b82f6', '#dbeafe')}
                        ${statChip('យឺត', s.late, '#f59e0b', '#fef3c7')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>`}
        </div>

        <div data-role="bottom-nav-mount"></div>
      </div>
      ${renderDetailSheet()}
    </div>
  `;

  root.querySelector('[data-action="back"]').addEventListener('click', () => navigate('/monitor-dashboard'));
  const scheduleBtn = root.querySelector('[data-action="schedule"]');
  if (scheduleBtn) scheduleBtn.addEventListener('click', () => navigate('/monitor-schedule'));
  const searchInput = root.querySelector('[data-role="search"]');
  onLiveInput(searchInput, () => { state = { ...state, search: searchInput.value }; withFocusPreserved(root, update); });
  const clearSearchBtn = root.querySelector('[data-action="clear-search"]');
  if (clearSearchBtn) clearSearchBtn.addEventListener('click', () => { state = { ...state, search: '' }; update(); });
  root.querySelector('[data-action="toggle-filters"]').addEventListener('click', (e) => {
    e.stopPropagation();
    state = { ...state, showFilters: !state.showFilters };
    update();
  });
  const pagodaSelect = root.querySelector('[data-f="pagoda"]');
  if (pagodaSelect) pagodaSelect.addEventListener('change', (e) => { state = { ...state, pagodaFilter: e.target.value }; update(); });
  const attendanceSelect = root.querySelector('[data-f="attendance"]');
  if (attendanceSelect) attendanceSelect.addEventListener('change', (e) => { state = { ...state, attendanceFilter: e.target.value }; update(); });
  const statusSelect = root.querySelector('[data-f="status"]');
  if (statusSelect) statusSelect.addEventListener('change', (e) => { state = { ...state, statusFilter: e.target.value }; update(); });
  const dropoutSelect = root.querySelector('[data-f="dropout"]');
  if (dropoutSelect) dropoutSelect.addEventListener('change', (e) => { state = { ...state, dropoutFilter: e.target.value }; update(); });
  const filterPanel = root.querySelector('[data-role="filter-panel"]');
  if (filterPanel) filterPanel.addEventListener('click', (e) => e.stopPropagation());
  const clearFiltersBtn = root.querySelector('[data-action="clear-filters"]');
  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => { state = { ...state, attendanceFilter: 'all', pagodaFilter: 'all', statusFilter: 'all', dropoutFilter: 'all' }; update(); });
  if (outsideClickHandler) { document.removeEventListener('click', outsideClickHandler); outsideClickHandler = null; }
  if (state.showFilters) {
    outsideClickHandler = () => { state = { ...state, showFilters: false }; update(); };
    document.addEventListener('click', outsideClickHandler, { once: true });
  }
  root.querySelectorAll('[data-student]').forEach(card => {
    card.addEventListener('click', () => openDetail(students.find(s => String(s.id) === card.dataset.student)));
  });
  root.querySelectorAll('[data-action="close-detail"]').forEach(el => el.addEventListener('click', () => { state = { ...state, selected: null }; update(); }));
  root.querySelector('[data-action="send-student-telegram"]')?.addEventListener('click', (e) => { if (state.selected) sendStudentInfoToTelegram(state.selected, e.currentTarget); });

  const bottomNavMount = root.querySelector('[data-role="bottom-nav-mount"]');
  if (bottomNavMount) {
    const bottomNav = createMonitorBottomNav({ active: 'home', onAccountClick: () => openMonitorAccountSheet() });
    bottomNavMount.replaceWith(bottomNav.el);
  }
  if (window.lucide) window.lucide.createIcons();

  window.scrollTo(scrollX, scrollY);
}

export function render(container) {
  root = container;
  state = { students: [], classroomName: '', loading: true, selected: null, detail: [], attendanceRows: [], attendanceFilter: 'all', pagodaFilter: 'all', statusFilter: 'all', dropoutFilter: 'all', search: '', showFilters: false };
  update();
  loadStudents();
}

export function destroy() {
  root = null;
  if (outsideClickHandler) { document.removeEventListener('click', outsideClickHandler); outsideClickHandler = null; }
}
