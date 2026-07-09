// Ports pages/MonitorSchedule.jsx.

import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';
import mockData from '../data/scheduleStructure.json';
import { getUser } from '../auth.js';
import { api } from '../api.js';
import { createMonitorBottomNav } from '../components/monitorBottomNav.js';
import { openMonitorAccountSheet } from '../components/monitorAccountSheet.js';

const SUBJECT_COLORS = {
  'ភាសាបាលី': { bg: 'rgba(99,102,241,0.08)', text: '#4f46e5', border: 'rgba(99,102,241,0.2)' },
  'ភាសាសំស្រ្កឹត': { bg: 'rgba(139,92,246,0.08)', text: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
  'ព្រះវិន័យ': { bg: 'rgba(236,72,153,0.08)', text: '#ec4899', border: 'rgba(236,72,153,0.2)' },
  'អភិធម្ម': { bg: 'rgba(244,63,94,0.08)', text: '#f43f5e', border: 'rgba(244,63,94,0.2)' },
  'ភាសាខ្មែរ': { bg: 'rgba(20,184,166,0.08)', text: '#0d9488', border: 'rgba(20,184,166,0.2)' },
  'ភាសាអង់គ្លេស': { bg: 'rgba(6,182,212,0.08)', text: '#0891b2', border: 'rgba(6,182,212,0.2)' },
  'គណិតវិទ្យា': { bg: 'rgba(59,130,246,0.08)', text: '#2563eb', border: 'rgba(59,130,246,0.2)' },
  'រូបវិទ្យា': { bg: 'rgba(79,70,229,0.08)', text: '#4338ca', border: 'rgba(79,70,229,0.2)' },
  'គីមីវិទ្យា': { bg: 'rgba(16,185,129,0.08)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  'ផែនដីវិទ្យា': { bg: 'rgba(245,158,11,0.08)', text: '#d97706', border: 'rgba(245,158,11,0.2)' },
  'ជីវវិទ្យា': { bg: 'rgba(101,163,80,0.08)', text: '#4f7a28', border: 'rgba(101,163,80,0.2)' },
  'ប្រវត្តិវិទ្យា': { bg: 'rgba(141,110,99,0.08)', text: '#6d4c41', border: 'rgba(141,110,99,0.2)' },
  'ភូមិវិទ្យា': { bg: 'rgba(120,144,156,0.08)', text: '#546e7a', border: 'rgba(120,144,156,0.2)' },
  'សីលធម៌': { bg: 'rgba(249,115,22,0.08)', text: '#ea580c', border: 'rgba(249,115,22,0.2)' },
  'សីល': { bg: 'rgba(245,158,11,0.08)', text: '#d97706', border: 'rgba(245,158,11,0.2)' },
};

function getSubjectColor(subject) {
  if (!subject || subject === '---') return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
  return SUBJECT_COLORS[subject] || { bg: 'rgba(79,70,229,0.08)', text: '#4f46e5', border: 'rgba(79,70,229,0.2)' };
}

function getTodayLunarIndex() {
  try {
    const lunar = toKhmerLunarDate(new Date());
    let idx = lunar.moonDay - 1;
    if (idx > 13) idx = 13;
    if (idx < 0) idx = 0;
    return idx;
  } catch {
    return 0;
  }
}

function getDateForSelectedDay(selectedDay) {
  const todayIdx = getTodayLunarIndex();
  const diff = selectedDay - todayIdx;
  const date = new Date();
  date.setDate(date.getDate() + diff);
  return date.toISOString().split('T')[0];
}

let root = null;
let state = {};

function getFixedClass() { return getUser()?.monitorInfo?.classroom_name || mockData.className; }

async function loadAllClassroomsAndSchedule() {
  state.allClassrooms = [];
  try {
    const res = await api.get('/api/core/classrooms/');
    state.allClassrooms = res.data || [];
  } catch (err) {
    console.error('Error fetching all classrooms', err);
  }
  await loadSchedule();
}

async function loadSubstitutions() {
  const date = getDateForSelectedDay(state.selectedDay);
  try {
    const res = await api.get(`/api/core/schedule-substitutions/substitute/?classroom_name=${encodeURIComponent(state.selectedClass)}&date=${date}`);
    state.substitutions = res.ok ? (res.data || []) : [];
  } catch (err) {
    state.substitutions = [];
    console.error('Failed to load substitutions', err);
  }
  update();
}

async function loadSchedule() {
  state.loading = true;
  update();

  let newData = {
    className: state.selectedClass,
    schoolName: mockData.schoolName,
    academicYear: "",
    homeroomTeacher: "",
    teachers: [],
    allSubjects: [],
    allClassSubjects: [],
    allTeachers: [],
    matrix: { morning: [], afternoon: [] }
  };

  try {
    // 1. Get class details
    const clsInfo = state.allClassrooms.find(c => c.class_name === state.selectedClass);

    // 2. Fetch required APIs
    const [subjectsApiRes, teachersApiRes, classSubjectsApiRes, timeSlotsApiRes, timetableApiRes, academicYearsApiRes] = await Promise.all([
      api.get('/api/core/subjects/'),
      api.get('/api/users/teachers/'),
      api.get('/api/core/class-subjects/'),
      api.get('/api/core/time-slots/'),
      api.get('/api/core/timetable/'),
      api.get('/api/core/academic-years/')
    ]);
    const subjectsRes = subjectsApiRes.data || [];
    const teachersRes = teachersApiRes.data || [];
    const classSubjectsRes = classSubjectsApiRes.data || [];
    const timeSlotsRes = timeSlotsApiRes.data || [];
    const timetableRes = timetableApiRes.data || [];
    const academicYearsRes = academicYearsApiRes.data || [];

    newData.allSubjects = subjectsRes || [];
    newData.allClassSubjects = classSubjectsRes || [];
    newData.allTeachers = teachersRes || [];

    const currentYear = (academicYearsRes || []).find(y => y.is_current);
    if (currentYear) newData.academicYear = currentYear.year_name;

    if (clsInfo && clsInfo.homeroom_teacher) {
      const homeroom = teachersRes.find(t => t.id === clsInfo.homeroom_teacher);
      if (homeroom) newData.homeroomTeacher = `${homeroom.last_name} ${homeroom.first_name}`.trim();
    }

    const clsId = clsInfo ? clsInfo.id : null;

    if (clsId) {
      // 3. Map teachers for this class
      const filteredCS = classSubjectsRes.filter(cs => cs.classroom === clsId);
      newData.teachers = filteredCS.map((cs, i) => {
        const subj = subjectsRes.find(s => s.id === cs.subject);
        const teach = teachersRes.find(t => t.id === cs.teacher);
        return {
          index: i + 1,
          subject: subj ? subj.subject_name : '',
          teacher: teach ? `${teach.last_name} ${teach.first_name}`.trim() : '',
          hours: subj ? `មួយសប្ដាហ៍ ${subj.total_hours || 0} ម៉ោង` : ''
        };
      });

      // 4. Build schedule matrix
      const filteredTimetable = timetableRes.filter(t => t.classroom === clsId);
      const sortedTS = timeSlotsRes.sort((a, b) => a.slot_no - b.slot_no);

      ['morning', 'afternoon'].forEach(session => {
        const sessionTS = sortedTS.filter(t => t.session === session);
        sessionTS.forEach(ts => {
          const timeStr = `${ts.start_time.substring(0, 5)}-${ts.end_time.substring(0, 5)}`;
          const slots = Array(14).fill('---');
          slots[7] = 'សីល'; // Day 8 is a holiday

          const tsTimetable = filteredTimetable.filter(t => t.time_slot === ts.id);
          tsTimetable.forEach(t => {
            const dIdx = t.day_no - 1;
            if (dIdx >= 0 && dIdx < 14) {
              const subj = subjectsRes.find(s => s.id === t.subject);
              if (subj) slots[dIdx] = subj.subject_name;
            }
          });

          newData.matrix[session].push({
            time: timeStr,
            slots: slots
          });
        });
      });
    }

  } catch (err) {
    console.error('Failed to fetch real schedule, falling back', err);
    // Fallback if APIs fail entirely
    newData.matrix = mockData.matrix;
    newData.teachers = mockData.teachers;
  }

  // Ensure lunarDays exists
  newData.lunarDays = mockData.lunarDays;

  state = { ...state, data: newData, loading: false };
  await loadSubstitutions();
}

function getTeacherForSubject(subject) {
  if (!subject || subject === '---') return null;
  return state.data.teachers.find(t => t.subject === subject)?.teacher || null;
}

function update() {
  if (!root) return;
  const monitorInfo = getUser()?.monitorInfo;

  if (!monitorInfo?.classroom_name) {
    root.innerHTML = `<div style="padding:20px;text-align:center;color:#64748b;">គណនីរបស់អ្នកមិនទាន់ត្រូវបានចាត់តាំងជាប្រធានថ្នាក់ ឬមិនមានថ្នាក់គ្រប់គ្រងនៅឡើយទេ។</div>`;
    return;
  }

  const { data, selectedClass, selectedDay } = state;
  const selectedDayInfo = data.lunarDays[selectedDay];
  const sections = [
    { key: 'morning', label: 'ពេលព្រឹក', icon: 'sun', color: '#f59e0b' },
    { key: 'afternoon', label: 'ពេលល្ងាច', icon: 'moon', color: '#6366f1' },
  ];

  root.innerHTML = `
    <div style="min-height:100vh;background-color:#f3f4f6;font-family:'Khmer OS Battambang','Battambang',sans-serif;display:flex;justify-content:center;">
      <div style="width:100%;max-width:480px;padding-bottom:100px;">
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
          <div>
            <div style="font-size:16px;font-weight:bold;color:#111827;">កាលវិភាគ</div>
            <div style="font-size:12px;color:#6b7280;">ថ្នាក់ ${selectedClass}</div>
          </div>
        </div>

        <div style="padding:16px;">
          <div style="background-color:white;border-radius:16px;padding:16px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:#6b7280;"><span>ឆ្នាំសិក្សា ${data.academicYear}</span></div>
            <div style="margin-top:4px;font-size:12px;color:#6b7280;">គ្រូបន្ទុកថ្នាក់ : <strong style="color:#111827;">${data.homeroomTeacher}</strong></div>
          </div>

          <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:12px;">
            ${data.lunarDays.map((day, idx) => {
    const isActive = selectedDay === idx;
    const isToday = idx === getTodayLunarIndex();
    return `
                <button data-day="${idx}" style="flex-shrink:0;padding:8px 14px;border-radius:999px;border:${isActive ? 'none' : day.isHoliday ? '1px solid #fde68a' : '1px solid #e5e7eb'};background:${isActive ? '#4f46e5' : day.isHoliday ? '#fffbeb' : 'white'};color:${isActive ? 'white' : day.isHoliday ? '#d97706' : '#374151'};font-family:inherit;font-size:13px;font-weight:bold;cursor:pointer;white-space:nowrap;position:relative;">
                  ${day.label}
                  ${isToday ? `<span style="position:absolute;top:2px;right:2px;width:6px;height:6px;border-radius:50%;background-color:${isActive ? '#a5b4fc' : '#4f46e5'};"></span>` : ''}
                </button>
              `;
  }).join('')}
          </div>

          ${selectedDayInfo?.isHoliday ? `<div style="display:flex;align-items:center;gap:8px;background-color:#fffbeb;border:1px solid #fde68a;color:#d97706;border-radius:12px;padding:10px 14px;margin-bottom:16px;font-size:13px;font-weight:bold;">🪷 ${selectedDayInfo.holidayName || 'ថ្ងៃសីល'}</div>` : ''}

          ${sections.map(section => `
            <div style="margin-bottom:20px;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;color:${section.color};font-weight:bold;font-size:14px;"><i data-lucide="${section.icon}" style="width:16px;height:16px"></i> ${section.label}</div>
              ${data.matrix[section.key].map((period, periodIndex) => {
    const subject = period.slots[selectedDay];
    const teacher = getTeacherForSubject(subject);

    const subKey = `${section.key}_${periodIndex}`;
    const sub = (state.substitutions || []).find(s => s.time_slot === subKey);

    const displaySubject = sub ? sub.new_subject : subject;
    const displayTeacher = sub ? sub.new_teacher : teacher;
    const isSub = !!sub;
    const isNoTeacher = displaySubject === 'គ្មានគ្រូបង្រៀន';

    const c = getSubjectColor(displaySubject);
    return `
                  <div style="display:flex;align-items:center;gap:12px;background-color:${isSub ? '#fef3c7' : 'white'};border-radius:12px;padding:12px 14px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid ${isSub ? '#f59e0b' : '#e2e8f0'};">
                    <div style="width:72px;flex-shrink:0;font-size:12px;font-weight:bold;color:${isSub ? '#d97706' : '#64748b'};">${period.time}</div>
                    <div style="flex:1;min-width:0;">
                      <div style="display:inline-block;padding:4px 10px;border-radius:8px;font-size:13px;font-weight:bold;background-color:${c.bg};color:${isNoTeacher ? '#ef4444' : c.text};border:1px solid ${c.border};">
                        ${displaySubject || '---'} ${isSub ? '<span style="color:#d97706;font-size:11px;margin-left:4px;">(ជំនួស)</span>' : ''}
                      </div>
                      ${displayTeacher ? `<div style="display:flex;align-items:center;gap:4px;margin-top:4px;font-size:11px;color:#94a3b8;"><i data-lucide="user" style="width:11px;height:11px"></i> ${displayTeacher}</div>` : ''}
                    </div>
                    ${subject && subject !== '---' && subject !== 'សីល' ? `
                      <button data-action="substitute" data-session="${section.key}" data-slot="${periodIndex}" data-subject="${subject}" data-issub="${isSub}" style="background:transparent;border:none;color:#6366f1;cursor:pointer;padding:8px;display:flex;align-items:center;justify-content:center;border-radius:8px;background-color:rgba(99,102,241,0.1);">
                        <i data-lucide="edit-2" style="width:16px;height:16px;"></i>
                      </button>
                    ` : ''}
                  </div>
                `;
  }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
      <div data-role="substitute-modal-mount"></div>
      <div data-role="bottom-nav-mount"></div>
    </div>
  `;

  root.querySelector('[data-action="back"]').addEventListener('click', () => window.history.back());
  root.querySelectorAll('[data-day]').forEach(btn => btn.addEventListener('click', () => {
    state = { ...state, selectedDay: Number(btn.dataset.day) };
    loadSubstitutions();
  }));

  root.querySelectorAll('[data-action="substitute"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sessionKey = btn.dataset.session;
      const slotIndex = btn.dataset.slot;
      const subject = btn.dataset.subject;
      const isSub = btn.dataset.issub === 'true';
      renderSubstituteModal(sessionKey, slotIndex, subject, isSub);
    });
  });

  const bottomNavMount = root.querySelector('[data-role="bottom-nav-mount"]');
  const bottomNav = createMonitorBottomNav({ active: 'home', onAccountClick: () => openMonitorAccountSheet() });
  bottomNavMount.replaceWith(bottomNav.el);

  if (window.lucide) window.lucide.createIcons();
}

function renderSubstituteModal(sessionKey, slotIndex, currentSubject, isSub) {
  const mount = root.querySelector('[data-role="substitute-modal-mount"]');
  const availableOptions = state.data.teachers.filter(t => t.subject !== currentSubject && t.subject !== 'គ្មានគ្រូបង្រៀន');

  mount.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
      <div style="background:white;width:90%;max-width:400px;border-radius:16px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
        <div style="padding:16px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
          <h2 style="margin:0;font-size:16px;color:#111827;">ការប្តូរគ្រូ/មុខវិជ្ជាជំនួស</h2>
          <button data-action="close-modal" style="background:none;border:none;cursor:pointer;color:#6b7280;">✕</button>
        </div>
        <div style="padding:16px;">
          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:13px;color:#374151;margin-bottom:6px;font-weight:bold;">មុខវិជ្ជាថ្មី</label>
            <select id="newSubjectSelect" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;font-family:inherit;font-size:14px;outline:none;margin-bottom:8px;">
              <option value="" data-teacher="" data-teacher-id="" disabled selected>ជ្រើសរើសមុខវិជ្ជា...</option>
              <option value="គ្មានគ្រូបង្រៀន" data-teacher="" data-teacher-id="">គ្មានគ្រូបង្រៀន</option>
              ${availableOptions.map(t => `<option value="${t.subject}" data-teacher="${t.teacher}" data-teacher-id="${t.teacher_id}">${t.subject}</option>`).join('')}
            </select>
            <div id="teacherLabel" style="font-size:13px;color:#4f46e5;font-weight:600;display:none;"></div>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:13px;color:#374151;margin-bottom:8px;font-weight:bold;">ជម្រើស</label>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
                <input type="radio" name="bulk_type" value="single" checked style="accent-color:#4f46e5;"> ប្តូរតែម៉ោងនេះ
              </label>
              <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
                <input type="radio" name="bulk_type" value="session" style="accent-color:#4f46e5;"> ប្តូរគ្រប់ម៉ោងពេល${sessionKey === 'morning' ? 'ព្រឹក' : 'ល្ងាច'}
              </label>
            </div>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            ${isSub ? `<button data-action="restore-substitute" style="flex:1;min-width:100px;padding:12px;background:#f59e0b;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">ត្រឡប់ដើម</button>` : ''}
            <button data-action="reset-substitute" style="flex:1;min-width:100px;padding:12px;background:#ef4444;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">លុបម៉ោងនេះ</button>
            <button data-action="close-modal" style="flex:1;min-width:100px;padding:12px;background:#f3f4f6;color:#374151;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">បោះបង់</button>
            <button data-action="save-substitute" style="flex:1;min-width:100px;padding:12px;background:#4f46e5;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">រក្សាទុក</button>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: mount });

  const closeModal = () => mount.innerHTML = '';
  mount.querySelectorAll('[data-action="close-modal"]').forEach(b => b.addEventListener('click', closeModal));

  const selectEl = document.getElementById('newSubjectSelect');
  const teacherLabel = document.getElementById('teacherLabel');

  if (selectEl && teacherLabel) {
    selectEl.addEventListener('change', (e) => {
      const option = e.target.options[e.target.selectedIndex];
      const teacherName = option.getAttribute('data-teacher');
      if (teacherName) {
        teacherLabel.textContent = `គ្រូបង្រៀន៖ ${teacherName}`;
        teacherLabel.style.display = 'block';
      } else {
        teacherLabel.style.display = 'none';
      }
    });
  }

  const restoreBtn = mount.querySelector('[data-action="restore-substitute"]');
  if (restoreBtn) {
    restoreBtn.addEventListener('click', async () => {
      const bulkType = document.querySelector('input[name="bulk_type"]:checked').value;
      const payload = {
        classroom: state.selectedClass,
        date: getDateForSelectedDay(state.selectedDay),
        session: sessionKey,
        slot_index: slotIndex,
        original_subject: currentSubject,
        new_subject: 'RESET', // dummy for backend validation
        bulk_session_type: bulkType,
        is_reset: true
      };

      try {
        const res = await api.post('/api/core/schedule-substitutions/substitute/', payload);
        if (res.ok) {
          closeModal();
          loadSubstitutions();
        } else {
          alert('បរាជ័យក្នុងការត្រឡប់ដើម៖ ' + (res.data?.error || ''));
        }
      } catch (err) {
        console.error(err);
        alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ');
      }
    });
  }

  const resetBtn = mount.querySelector('[data-action="reset-substitute"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      const bulkType = document.querySelector('input[name="bulk_type"]:checked').value;
      const payload = {
        classroom: state.selectedClass,
        date: getDateForSelectedDay(state.selectedDay),
        session: sessionKey,
        slot_index: slotIndex,
        original_subject: currentSubject,
        new_subject: 'គ្មានគ្រូបង្រៀន', // Change from RESET to No Teacher
        bulk_session_type: bulkType,
        is_reset: false // Change from true to false
      };

      try {
        const res = await api.post('/api/core/schedule-substitutions/substitute/', payload);
        if (res.ok) {
          closeModal();
          loadSubstitutions();
        } else {
          alert('បរាជ័យក្នុងការលុប៖ ' + (res.data?.error || ''));
        }
      } catch (err) {
        console.error(err);
        alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ');
      }
    });
  }

  mount.querySelector('[data-action="save-substitute"]').addEventListener('click', async () => {
    const selectEl = document.getElementById('newSubjectSelect');
    const newSubject = selectEl.value;
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const newTeacherId = selectedOption.getAttribute('data-teacher-id');
    const bulkType = document.querySelector('input[name="bulk_type"]:checked').value;
    if (!newSubject) {
      alert('សូមជ្រើសរើសមុខវិជ្ជាថ្មី!');
      return;
    }

    const payload = {
      classroom: state.selectedClass,
      date: getDateForSelectedDay(state.selectedDay),
      session: sessionKey,
      slot_index: slotIndex,
      original_subject: currentSubject,
      new_subject: newSubject,
      new_teacher_id: newTeacherId,
      bulk_session_type: bulkType
    };

    try {
      const res = await api.post('/api/core/schedule-substitutions/substitute/', payload);
      if (res.ok) {
        closeModal();
        loadSubstitutions();
      } else {
        alert('បរាជ័យក្នុងការរក្សាទុក៖ ' + (res.data?.error || ''));
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ');
    }
  });
}

export function render(container) {
  root = container;
  const fixedClass = getFixedClass();
  state = { data: { ...mockData, className: fixedClass }, selectedClass: fixedClass, allClassrooms: [], selectedDay: getTodayLunarIndex() };
  update();
  loadAllClassroomsAndSchedule();
}

export function destroy() { root = null; }
