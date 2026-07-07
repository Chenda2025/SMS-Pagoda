import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';
import { onLiveInput } from '../utils/dom.js';

const DEFAULT_DOC_CONFIG = {
  headerLeftLine1: 'មន្ទីរធម្មការ និងសាសនារាជធានី',
  headerLeftLine2: 'ភ្នំពេញ',
  headerLeftLine3: 'សាលាពុទ្ធិក...',
  headerRightLine1: 'ព្រះរាជាណាចក្រកម្ពុជា',
  headerRightLine2: 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
  titleMain: 'កាលវិភាគសិក្សាមុខវិជ្ជាប្រចាំខែ',
  titleSubSuffix: 'នៃពុទ្ធិកបឋមសិក្សា',
  footerApprovalText: 'បានឃើញ និងឯកភាព',
  footerApproverRole: 'ព្រះនាយក',
  footerLocation: 'ភ្នំពេញ',
  footerPreparerRole: 'អ្នករៀបចំកាលវិភាគ',
  footerDateLunar: 'ថ្ងៃព្រហស្បតិ៍ ១១កើត ខែបឋមាសាឍ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០',
  footerDateGregorian: 'ភ្នំពេញ, ថ្ងៃទី២៥ ខែមិថុនា ឆ្នាំ២០២៦',
};

function loadDocConfig() {
  try { return { ...DEFAULT_DOC_CONFIG, ...JSON.parse(localStorage.getItem('scheduleDocConfig')) }; }
  catch { return { ...DEFAULT_DOC_CONFIG }; }
}
function persistDocConfig() { localStorage.setItem('scheduleDocConfig', JSON.stringify(state.docConfig)); }

let root = null;
let state = {
  classrooms: [],
  academicYears: [],
  subjects: [],
  timeSlots: [],
  timetables: [],
  teachers: [],
  classSubjects: [],

  selectedClassroom: '',
  selectedAcademicYear: '',
  filterEnabled: { year: true, class: true },
  docConfig: loadDocConfig(),
  showDocConfigModal: false,
  showTgMenu: false,
  lunarDateText: (() => { try { return toKhmerLunarDate(new Date()).lunarDateText || ''; } catch { return ''; } })(),

  loading: true,
  error: null,
  isProcessing: false
};
let tgMenuListenerBound = false;

const LUNAR_DAYS = Array.from({ length: 14 }, (_, i) => i + 1);


const SUBJECT_COLORS = [
  '#f0fdf4', '#fdf4ff', '#f0f9ff', '#fffbeb', '#fef2f2', '#f5f3ff', '#ecfdf5', '#fff7ed', '#eff6ff', '#fdf2f8'
];

const KHMER_NUMBERS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

function toKhmerNum(str) {
  if (!str) return str;
  return String(str).replace(/[0-9]/g, match => KHMER_NUMBERS[parseInt(match)]);
}

function sortClassrooms(classrooms) {
  return [...classrooms].sort((a, b) => {
    const name = c => String(c.class_name || '');
    const num = s => {
      const digits = name(s).replace(/[០-៩]/g, d => KHMER_NUMBERS.indexOf(d)).match(/\d+/);
      return digits ? parseInt(digits[0], 10) : Infinity;
    };
    const numDiff = num(a) - num(b);
    return numDiff !== 0 ? numDiff : name(a).localeCompare(name(b), 'km');
  });
}

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  if (h > 12) h -= 12;
  return String(h) + ':' + m;
}

const MONTHS_KH = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
function formatGregorianKhmer(date) {
  return `ថ្ងៃទី${toKhmerNum(String(date.getDate()).padStart(2, '0'))} ខែ${MONTHS_KH[date.getMonth()]} ឆ្នាំ${toKhmerNum(date.getFullYear())}`;
}



function getSubjectColor(subjectId) {
  if (!subjectId) return 'white';
  return SUBJECT_COLORS[parseInt(subjectId) % SUBJECT_COLORS.length];
}

async function fetchData() {
  state.loading = true;
  update();
  try {
    const [clsRes, ayRes, subRes, tsRes, tcRes, csRes] = await Promise.all([
      api.get('/api/core/classrooms/'),
      api.get('/api/core/academic-years/'),
      api.get('/api/core/subjects/'),
      api.get('/api/core/time-slots/'),
      api.get('/api/users/teachers/'),
      api.get('/api/core/class-subjects/')
    ]);

    state.classrooms = sortClassrooms(clsRes?.data || []);
    state.academicYears = ayRes?.data || [];
    state.subjects = subRes?.data || [];
    state.timeSlots = tsRes?.data || [];
    state.teachers = tcRes?.data || [];
    state.classSubjects = csRes?.data || [];

    // Keep whichever classroom/year the user was last viewing across page
    // refreshes; only fall back to defaults (current year, first classroom)
    // the very first time, or if the saved selection no longer exists.
    const savedYear = localStorage.getItem('scheduleSelectedAcademicYear');
    if (savedYear && state.academicYears.some(y => String(y.id) === savedYear)) {
      state.selectedAcademicYear = savedYear;
    } else {
      const currentAy = state.academicYears.find(y => y.is_current);
      if (currentAy) state.selectedAcademicYear = currentAy.id;
      else if (state.academicYears.length > 0) state.selectedAcademicYear = state.academicYears[0].id;
    }

    const savedClassroom = localStorage.getItem('scheduleSelectedClassroom');
    if (savedClassroom && state.classrooms.some(c => String(c.id) === savedClassroom)) {
      state.selectedClassroom = savedClassroom;
    } else if (state.classrooms.length > 0) {
      state.selectedClassroom = state.classrooms[0].id;
    }

    if (state.selectedClassroom && state.selectedAcademicYear) {
      await fetchTimetable();
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

async function fetchTimetable() {
  if (!state.selectedClassroom || !state.selectedAcademicYear) return;
  state.loading = true;
  update();
  try {
    const res = await api.get('/api/core/timetable/');
    const allData = res?.data || [];

    state.timetables = allData.filter(t =>
      String(t.classroom) === String(state.selectedClassroom) &&
      String(t.academic_year) === String(state.selectedAcademicYear)
    );
  } catch (err) {
    showToast(err.message || 'បរាជ័យក្នុងការទាញយកកាលវិភាគ', 'error');
  } finally {
    state.loading = false;
    update();
  }
}

// --- Schedule Editor Modal ---
function openEditModal(dayNo, timeSlotId) {
  const existing = state.timetables.find(t => String(t.day_no) === String(dayNo) && String(t.time_slot) === String(timeSlotId));

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;font-family:'Battambang',sans-serif;">កែប្រែម៉ោងសិក្សា (ថ្ងៃទី ${toKhmerNum(dayNo)} ក.រ)</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    
    <form style="display:flex;flex-direction:column;gap:16px;font-family:'Battambang',sans-serif;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">មុខវិជ្ជា</label>
        <select data-f="subject" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;font-family:'Battambang',sans-serif;">
          <option value="">-- ទំនេរ --</option>
          ${state.subjects.map(s => `<option value="${s.id}" ${existing && String(existing.subject) === String(s.id) ? 'selected' : ''}>${s.subject_name}</option>`).join('')}
        </select>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        ${existing ? `<button type="button" data-action="clear" style="padding:10px 16px;background-color:#fee2e2;color:#dc2626;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">លុបចេញ</button>` : '<div></div>'}
        <div style="display:flex;gap:12px;">
          <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">បោះបង់</button>
          <button type="submit" data-role="submit" style="padding:10px 16px;background-color:#1e3a8a;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">រក្សាទុក</button>
        </div>
      </div>
    </form>
  `;

  if (window.lucide) window.lucide.createIcons({ root: wrap });

  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.isProcessing) return;

    const btn = wrap.querySelector('[data-role="submit"]');
    btn.disabled = true;
    btn.textContent = 'កំពុងរក្សាទុក...';
    state.isProcessing = true;

    const subjectVal = wrap.querySelector('[data-f="subject"]').value;

    try {
      if (!subjectVal) {
        if (existing) {
          await api.del(`/api/core/timetable/${existing.id}/`);
        }
      } else {
        const payload = {
          classroom: state.selectedClassroom,
          academic_year: state.selectedAcademicYear,
          day_no: dayNo,
          time_slot: timeSlotId,
          subject: subjectVal
        };
        if (existing) {
          await api.patch(`/api/core/timetable/${existing.id}/`, payload);
        } else {
          await api.post('/api/core/timetable/', payload);
        }
      }
      showToast('បានរក្សាទុកជោគជ័យ', 'success');
      handle.close();
      fetchTimetable();
    } catch (err) {
      showToast('បរាជ័យក្នុងការរក្សាទុក', 'error');
    } finally {
      state.isProcessing = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'រក្សាទុក';
      }
    }
  });

  const clearBtn = wrap.querySelector('[data-action="clear"]');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (state.isProcessing) return;
      state.isProcessing = true;
      try {
        await api.del(`/api/core/timetable/${existing.id}/`);
        showToast('បានលុបចេញជោគជ័យ', 'success');
        handle.close();
        fetchTimetable();
      } catch (err) {
        showToast('បរាជ័យក្នុងការលុបចេញ', 'error');
      } finally {
        state.isProcessing = false;
      }
    });
  }

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  const handle = openModal(wrap);
}

// --- Document Header/Title/Footer Config Modal ---
function openDocConfigModal(section) {
  const c = state.docConfig;
  const sectionTitle = { header: 'ក្បាលឯកសារ', title: 'ចំណងជើង', footer: 'បាតឯកសារ' }[section] || 'ឯកសារ';

  const fieldsBySection = {
    header: [
      ['headerLeftLine1', 'ជួរទី១ (ខាងឆ្វេង)'],
      ['headerLeftLine2', 'ជួរទី២ (ខាងឆ្វេង)'],
      ['headerLeftLine3', 'ជួរទី៣ (ខាងឆ្វេង)'],
      ['headerRightLine1', 'ជួរទី១ (ខាងស្តាំ)'],
      ['headerRightLine2', 'ជួរទី២ (ខាងស្តាំ)'],
    ],
    title: [
      ['titleMain', 'ចំណងជើងធំ'],
      ['titleSubSuffix', 'អក្សររាប់បន្ថែមក្រោយឈ្មោះថ្នាក់'],
    ],
    footer: [
      ['footerApprovalText', 'អត្ថបទឯកភាព'],
      ['footerApproverRole', 'តួនាទីអ្នកឯកភាព'],
      ['footerDateLunar', 'កាលបរិច្ឆេទ (ចន្ទគតិ)'],
      ['footerDateGregorian', 'កាលបរិច្ឆេទ (សុរិយគតិ)'],
      ['footerPreparerRole', 'តួនាទីអ្នករៀបចំ'],
    ],
  };
  const fields = fieldsBySection[section] || [];

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;font-family:'Battambang',sans-serif;">កែប្រែ${sectionTitle}</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;font-family:'Battambang',sans-serif;">
      ${fields.map(([key, label]) => `
        <div>
          <label style="display:block;margin-bottom:6px;font-weight:500;font-size:0.875rem;">${label}</label>
          <input type="text" data-cf="${key}" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;font-family:'Battambang',sans-serif;" value="${c[key] || ''}" />
        </div>
      `).join('')}
    </div>
    <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:20px;">
      <button type="button" data-action="reset" style="padding:10px 16px;background-color:#fee2e2;color:#dc2626;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">ត្រឡប់ដើម</button>
      <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">បោះបង់</button>
      <button type="button" data-action="save" style="padding:10px 16px;background-color:#1e3a8a;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">រក្សាទុក</button>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: wrap });

  fields.forEach(([key]) => {
    const input = wrap.querySelector(`[data-cf="${key}"]`);
    onLiveInput(input, () => { state.docConfig = { ...state.docConfig, [key]: input.value }; });
  });

  wrap.querySelector('[data-action="reset"]').addEventListener('click', () => {
    fields.forEach(([key]) => {
      state.docConfig = { ...state.docConfig, [key]: DEFAULT_DOC_CONFIG[key] };
      const input = wrap.querySelector(`[data-cf="${key}"]`);
      if (input) input.value = DEFAULT_DOC_CONFIG[key];
    });
  });

  wrap.querySelector('[data-action="save"]').addEventListener('click', () => {
    persistDocConfig();
    showToast('បានរក្សាទុកការកំណត់ដោយជោគជ័យ', 'success');
    handle.close();
    update();
  });

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  const handle = openModal(wrap);
}

// --- Telegram Export ---
function openTelegramConfigModal() {
  const existing = JSON.parse(localStorage.getItem('tgConfig') || '{}');

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">ការកំណត់ Telegram Bot</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>
    <form style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Bot Token <span style="color:red">*</span></label>
        <input type="text" data-f="token" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Chat ID <span style="color:red">*</span></label>
        <input type="text" data-f="chatId" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">រក្សាទុក</button>
      </div>
    </form>
  `;

  wrap.querySelector('[data-f="token"]').value = existing.token || '';
  wrap.querySelector('[data-f="chatId"]').value = existing.chatId || '';

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
    errorBox.style.display = 'none';
    const token = wrap.querySelector('[data-f="token"]').value.trim();
    const chatId = wrap.querySelector('[data-f="chatId"]').value.trim();
    if (!token || !chatId) {
      errorBox.textContent = 'សូមបញ្ចូល Token និង Chat ID';
      errorBox.style.display = 'block';
      return;
    }
    localStorage.setItem('tgConfig', JSON.stringify({ token, chatId }));
    showToast('បានរក្សាទុកការកំណត់ Telegram ដោយជោគជ័យ', 'success');
    handle.close();
  });

  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
}

async function captureScheduleImage(reportEl) {
  const fullWidth = reportEl.scrollWidth;
  const canvas = await html2canvas(reportEl, { backgroundColor: '#ffffff', scale: 2, useCORS: true, logging: false, windowWidth: fullWidth, width: fullWidth });
  return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

async function getSchedulePdfBlob(reportEl) {
  const fullWidth = reportEl.scrollWidth;
  return await html2pdf().set({ margin: 5, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true, windowWidth: fullWidth, width: fullWidth }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, pagebreak: { mode: 'avoid-all' } }).from(reportEl).outputPdf('blob');
}

async function getScheduleWordBlob(reportEl) {
  const fullWidth = reportEl.scrollWidth;
  const canvas = await html2canvas(reportEl, { backgroundColor: '#ffffff', scale: 2, useCORS: true, logging: false, windowWidth: fullWidth, width: fullWidth });
  const imgData = canvas.toDataURL('image/png');
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Schedule</title><meta charset='utf-8'></head><body>";
  const footer = "</body></html>";
  const html = `<img src="${imgData}" style="width:100%;" />`;
  return new Blob([String.fromCharCode(0xFEFF) + header + html + footer], { type: 'application/msword;charset=utf-8' });
}

async function sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig }) {
  const fd = new FormData();
  fd.append('chat_id', tgConfig.chatId);
  fd.append(isPhoto ? 'photo' : 'document', blob, filename);
  if (caption) fd.append('caption', caption);
  const endpoint = isPhoto ? 'sendPhoto' : 'sendDocument';
  const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/${endpoint}`, { method: 'POST', body: fd });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error('Telegram API Error:', errorBody);
    throw new Error('Telegram API Error: ' + errorBody);
  }
}

async function handleSendTelegram(kind) {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  const reportEl = root.querySelector('[data-role="print-target"]');
  if (!reportEl) {
    showToast('មិនអាចរកឯកសារកាលវិភាគបានទេ', 'error');
    return;
  }

  const btn = root.querySelector('[data-action="toggle-tg-menu"]');
  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite;"></i> កំពុងផ្ញើ...';
  if (window.lucide) window.lucide.createIcons();

  try {
    const classroomName = state.classrooms.find(c => String(c.id) === String(state.selectedClassroom))?.class_name || '';
    const caption = `🗓 កាលវិភាគសិក្សា ${classroomName}`;
    let blob, filename, isPhoto = false;

    // Hide edit icons for export
    const editBtns = reportEl.querySelectorAll('[data-action="edit-doc-config"]');
    editBtns.forEach(b => b.style.display = 'none');

    // We must ensure NO parent element clips the 1400px width.
    // html2canvas respects overflow:hidden and overflow:auto on all ancestors.
    const originalStyles = new Map();
    let curr = reportEl;
    while (curr && curr !== document.body) {
      originalStyles.set(curr, { overflow: curr.style.overflow, overflowX: curr.style.overflowX, overflowY: curr.style.overflowY });
      curr.style.overflow = 'visible';
      curr.style.overflowX = 'visible';
      curr.style.overflowY = 'visible';
      curr = curr.parentElement;
    }

    const tableWrapper = reportEl.querySelector('div[style*="overflow-x:auto"]') || reportEl.querySelector('div[style*="overflow-x: auto"]');
    if (tableWrapper) {
      originalStyles.set(tableWrapper, { overflowX: tableWrapper.style.overflowX });
      tableWrapper.style.overflowX = 'visible';
    }

    const oldWidth = reportEl.style.width;
    const oldMaxWidth = reportEl.style.maxWidth;
    const oldBodyWidth = document.body.style.width;

    document.body.style.width = '1400px';
    reportEl.style.width = '1400px';
    reportEl.style.maxWidth = 'none';

    // Slight delay to allow DOM to reflow before capturing
    await new Promise(r => setTimeout(r, 100));

    if (kind === 'image') { blob = await captureScheduleImage(reportEl); filename = `schedule_${classroomName}.png`; isPhoto = true; }
    else if (kind === 'pdf') { blob = await getSchedulePdfBlob(reportEl); filename = `schedule_${classroomName}.pdf`; }
    else if (kind === 'word') { blob = await getScheduleWordBlob(reportEl); filename = `schedule_${classroomName}.doc`; }

    // Restore
    editBtns.forEach(b => b.style.display = '');
    document.body.style.width = oldBodyWidth;
    reportEl.style.width = oldWidth;
    reportEl.style.maxWidth = oldMaxWidth;

    for (const [el, styles] of originalStyles.entries()) {
      if (styles.overflow !== undefined) el.style.overflow = styles.overflow;
      if (styles.overflowX !== undefined) el.style.overflowX = styles.overflowX;
      if (styles.overflowY !== undefined) el.style.overflowY = styles.overflowY;
    }

    await sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig });
    showToast('បានផ្ញើកាលវិភាគចូល Telegram ដោយជោគជ័យ', 'success');
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យ: ' + (err.message || err), 'error');
  } finally {
    const refreshedBtn = root.querySelector('[data-action="toggle-tg-menu"]');
    if (refreshedBtn) { refreshedBtn.disabled = false; refreshedBtn.innerHTML = originalHtml; }
    if (window.lucide) window.lucide.createIcons();
  }
}

async function handleDownloadFile(kind) {
  const reportEl = root.querySelector('[data-role="print-target"]');
  if (!reportEl) {
    showToast('មិនអាចរកឯកសារកាលវិភាគបានទេ', 'error');
    return;
  }

  const btn = root.querySelector('[data-action="download-pdf"]');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite;"></i> កំពុងបង្កើត...';
    if (window.lucide) window.lucide.createIcons();
  }

  try {
    const classroomName = state.classrooms.find(c => String(c.id) === String(state.selectedClassroom))?.class_name || '';
    let blob, filename;

    // Hide edit icons for export
    const editBtns = reportEl.querySelectorAll('[data-action="edit-doc-config"]');
    editBtns.forEach(b => b.style.display = 'none');

    // Fix overflow on all ancestors
    const originalStyles = new Map();
    let curr = reportEl;
    while (curr && curr !== document.body) {
      originalStyles.set(curr, { overflow: curr.style.overflow, overflowX: curr.style.overflowX, overflowY: curr.style.overflowY });
      curr.style.overflow = 'visible';
      curr.style.overflowX = 'visible';
      curr.style.overflowY = 'visible';
      curr = curr.parentElement;
    }

    const tableWrapper = reportEl.querySelector('div[style*="overflow-x:auto"]') || reportEl.querySelector('div[style*="overflow-x: auto"]');
    if (tableWrapper) {
      originalStyles.set(tableWrapper, { overflowX: tableWrapper.style.overflowX });
      tableWrapper.style.overflowX = 'visible';
    }

    const oldWidth = reportEl.style.width;
    const oldMaxWidth = reportEl.style.maxWidth;
    const oldBodyWidth = document.body.style.width;

    document.body.style.width = '1400px';
    reportEl.style.width = '1400px';
    reportEl.style.maxWidth = 'none';

    await new Promise(r => setTimeout(r, 100));

    if (kind === 'pdf') { blob = await getSchedulePdfBlob(reportEl); filename = `schedule_${classroomName}.pdf`; }
    else if (kind === 'image') { blob = await captureScheduleImage(reportEl); filename = `schedule_${classroomName}.png`; }
    else if (kind === 'word') { blob = await getScheduleWordBlob(reportEl); filename = `schedule_${classroomName}.doc`; }

    // Restore
    editBtns.forEach(b => b.style.display = '');
    document.body.style.width = oldBodyWidth;
    reportEl.style.width = oldWidth;
    reportEl.style.maxWidth = oldMaxWidth;

    for (const [el, styles] of originalStyles.entries()) {
      if (styles.overflow !== undefined) el.style.overflow = styles.overflow;
      if (styles.overflowX !== undefined) el.style.overflowX = styles.overflowX;
      if (styles.overflowY !== undefined) el.style.overflowY = styles.overflowY;
    }

    // Download
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('បានទាញយកឯកសារជោគជ័យ', 'success');
    }
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យ: ' + (err.message || err), 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="download" style="width:16px;height:16px;"></i> ទាញយក PDF';
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

// --- Rendering ---
function renderRows(slots, groupName, subjectMap) {
  if (slots.length === 0) return '';
  let html = `
    <tr>
      <td colspan="15" style="background:#e0e7ff;font-weight:bold;padding:8px;border:1px solid #1e3a8a;color:#1e3a8a;text-align:center;font-family:'Moul',cursive;font-size:1rem;letter-spacing:1px;">
        ${groupName}
      </td>
    </tr>
  `;

  slots.forEach((ts, idx) => {
    html += `<tr>`;
    html += `<td style="padding:14px 6px;border:1px solid #1e3a8a;text-align:center;font-weight:600;font-size:0.8rem;color:#1f2937;white-space:nowrap;background:white;width:100px;">
               <div style="font-family:'Moul',cursive;">${toKhmerNum(formatTime12h(ts.start_time))} - ${toKhmerNum(formatTime12h(ts.end_time))}</div>
             </td>`;

    for (let day = 1; day <= 14; day++) {
      if (day === 8) {
        if (idx === 0) {
          html += `<td rowspan="${slots.length}" style="border:1px solid #1e3a8a;background:#fef3c7;text-align:center;vertical-align:middle;padding:2px;">
                     <div style="transform: rotate(-90deg); white-space: nowrap; color:#b45309; font-family:'Moul',cursive; font-size:1.2rem; letter-spacing:4px; margin:auto;">សីល</div>
                   </td>`;
        }
      } else {
        const entry = state.timetables.find(t => String(t.day_no) === String(day) && String(t.time_slot) === String(ts.id));
        const color = entry ? getSubjectColor(entry.subject) : 'white';
        const subjName = entry ? subjectMap[entry.subject] || 'មិនស្គាល់' : '';
        html += `<td data-action="edit-cell" data-day="${day}" data-ts="${ts.id}" style="padding:12px 4px;border:1px solid #1e3a8a;text-align:center;cursor:pointer;background:${color};transition:all 0.2s;font-size:1rem;font-weight:600;line-height:1.3;word-break:break-word;color:${entry ? '#1e3a8a' : 'transparent'};font-family:'Battambang',sans-serif;">
                   ${subjName || '+'}
                 </td>`;
      }
    }
    html += `</tr>`;
  });
  return html;
}

function renderSummaryRow(item, index) {
  return `
    <div style="display:flex;align-items:center;margin-bottom:5px;padding:2px 4px;border-radius:6px;border:1px solid transparent;">
       <div data-action="swap-subject" data-cs="${item.csId}" title="ចុចដើម្បីប្ដូរទីតាំង" style="flex:1.2;font-family:'Moul',cursive;font-size:0.75rem;color:#000;cursor:pointer;position:relative;display:inline-flex;align-items:center;gap:4px;">
         <span>${toKhmerNum(index)}. ${item.name}</span>
         <i data-lucide="chevron-down" style="width:12px;height:12px;color:#9ca3af;margin-top:1px;"></i>
       </div>
       <div style="flex:1;color:#3730a3;font-size:0.85rem;">${item.teacher}</div>
       <div style="width:60px;text-align:left;color:#3730a3;font-weight:600;font-size:0.90rem;">${toKhmerNum(item.hours)} ម៉ោង</div>
    </div>
  `;
}

async function fetchClassSubjects() {
  try {
    const res = await api.get('/api/core/class-subjects/');
    state.classSubjects = res?.data || [];
  } catch (err) {
    showToast(err.message || 'បរាជ័យក្នុងការទាញយកមុខវិជ្ជា', 'error');
  }
}

function openSwapModal(sourceCsId) {
  const classSubjList = [...state.classSubjects]
    .filter(cs => String(cs.classroom) === String(state.selectedClassroom))
    .sort((a, b) => (a.order || 0) - (b.order || 0) || a.id - b.id);

  const sourceCs = classSubjList.find(cs => String(cs.id) === String(sourceCsId));
  if (!sourceCs) return;

  const sourceSubj = state.subjects.find(s => String(s.id) === String(sourceCs.subject));
  const sourceName = sourceSubj ? sourceSubj.subject_name : 'មិនស្គាល់';

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="margin-bottom:16px;border-bottom:1px solid #e5e7eb;padding-bottom:12px;">
      <h3 style="margin:0;font-family:'Battambang',sans-serif;font-weight:bold;color:#1e3a8a;">ប្ដូរទីតាំងមុខវិជ្ជា</h3>
      <p style="margin:4px 0 0 0;font-size:0.85rem;color:#64748b;">ជ្រើសរើសមុខវិជ្ជាមួយទៀតដើម្បីដូរទីតាំងជាមួយ "<strong>${sourceName}</strong>"</p>
    </div>
    <div style="max-height:300px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;padding:4px;">
      ${classSubjList.map((cs, i) => {
    const subj = state.subjects.find(s => String(s.id) === String(cs.subject));
    const name = subj ? subj.subject_name : 'មិនស្គាល់';
    const isSelf = String(cs.id) === String(sourceCsId);
    return `
          <button type="button" data-swap-target="${cs.id}" ${isSelf ? 'disabled' : ''} style="display:block;width:100%;text-align:left;padding:8px 12px;background:${isSelf ? '#f8fafc' : 'white'};border:none;border-bottom:1px solid #f1f5f9;cursor:${isSelf ? 'not-allowed' : 'pointer'};color:${isSelf ? '#94a3b8' : '#1e293b'};font-family:'Battambang',sans-serif;">
            ${toKhmerNum(i + 1)}. ${name}
          </button>
        `;
  }).join('')}
    </div>
    <div style="text-align:right;margin-top:16px;">
      <button data-action="close" style="padding:8px 16px;background:white;border:1px solid #e5e7eb;border-radius:6px;cursor:pointer;">បោះបង់</button>
    </div>
  `;

  wrap.querySelectorAll('[data-swap-target]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.swapTarget;
      if (!targetId || targetId === String(sourceCsId)) return;

      handle.close();

      const orderedIds = classSubjList.map(cs => String(cs.id));
      const idx1 = orderedIds.indexOf(String(sourceCsId));
      const idx2 = orderedIds.indexOf(targetId);
      if (idx1 > -1 && idx2 > -1) {
        const temp = orderedIds[idx1];
        orderedIds[idx1] = orderedIds[idx2];
        orderedIds[idx2] = temp;

        try {
          await api.post('/api/core/class-subjects/update_orders/', { ordered_ids: orderedIds });
          showToast('បានប្ដូរទីតាំងជោគជ័យ', 'success');
          await fetchClassSubjects();
          update();
        } catch (e) {
          showToast('បរាជ័យក្នុងការប្ដូរទីតាំង', 'error');
        }
      }
    });
  });

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  const handle = openModal(wrap);
}

// --- Add/Edit Class-Subject Modal (subject + teacher together) ---
function openClassSubjectModal(item) {
  let pendingSubjectId = item ? item.subjectId : '';
  let pendingTeacherId = item ? item.teacherId : '';

  const wrap = document.createElement('div');

  function currentHoursLabel() {
    const subj = state.subjects.find(s => String(s.id) === String(pendingSubjectId));
    return subj ? `${toKhmerNum(subj.total_hours || 0)} ម៉ោង` : '---';
  }

  function renderBody() {
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;">
        <h2 style="font-size:1.25rem;font-weight:bold;margin:0;font-family:'Battambang',sans-serif;">${item ? 'ប្តូរមុខវិជ្ជា' : 'បន្ថែមមុខវិជ្ជាថ្មី'}</h2>
        <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
      </div>
      <div style="display:flex;gap:16px;font-family:'Battambang',sans-serif;">
        <div style="flex:1;min-width:0;">
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem;">មុខវិជ្ជា</label>
          <div style="border:1px solid #d1d5db;border-radius:8px;max-height:240px;overflow-y:auto;">
            ${state.subjects.map(s => `
              <button type="button" data-pick="subject" data-id="${s.id}" style="display:block;width:100%;text-align:left;padding:8px 12px;border:none;background:${String(s.id) === String(pendingSubjectId) ? '#eff6ff' : 'none'};cursor:pointer;color:#1e293b;font-size:0.9rem;font-weight:${String(s.id) === String(pendingSubjectId) ? '700' : '400'};">${s.subject_name}</button>
            `).join('')}
          </div>
        </div>
        <div style="flex:1;min-width:0;">
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem;">គ្រូបង្រៀន</label>
          <div style="border:1px solid #d1d5db;border-radius:8px;max-height:240px;overflow-y:auto;">
            ${state.teachers.map(t => `
              <button type="button" data-pick="teacher" data-id="${t.id}" style="display:block;width:100%;text-align:left;padding:8px 12px;border:none;background:${String(t.id) === String(pendingTeacherId) ? '#eff6ff' : 'none'};cursor:pointer;color:#1e293b;font-size:0.9rem;font-weight:${String(t.id) === String(pendingTeacherId) ? '700' : '400'};">${t.last_name || ''} ${t.first_name || ''}</button>
            `).join('')}
          </div>
        </div>
      </div>
      <div style="margin-top:16px;font-size:0.85rem;color:#64748b;font-family:'Battambang',sans-serif;">ចំនួនម៉ោងសរុប៖ <strong>${currentHoursLabel()}</strong> (កំណត់ដោយមុខវិជ្ជា)</div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">បោះបង់</button>
        <button type="button" data-action="save" ${!pendingSubjectId || !pendingTeacherId ? 'disabled' : ''} style="padding:10px 16px;background-color:#1e3a8a;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;opacity:${!pendingSubjectId || !pendingTeacherId ? '0.5' : '1'};">រក្សាទុក</button>
      </div>
    `;
    bindEvents();
    if (window.lucide) window.lucide.createIcons({ root: wrap });
  }

  function bindEvents() {
    wrap.querySelectorAll('[data-pick="subject"]').forEach(btn => {
      btn.addEventListener('click', () => { pendingSubjectId = btn.dataset.id; renderBody(); });
    });
    wrap.querySelectorAll('[data-pick="teacher"]').forEach(btn => {
      btn.addEventListener('click', () => { pendingTeacherId = btn.dataset.id; renderBody(); });
    });
    wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
    wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
    const saveBtn = wrap.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        if (!pendingSubjectId || !pendingTeacherId) return;
        saveBtn.disabled = true;
        saveBtn.textContent = 'កំពុងរក្សាទុក...';
        try {
          await api.post('/api/core/class-subjects/upsert/', {
            id: item ? item.csId : undefined,
            classroom: state.selectedClassroom,
            subject: pendingSubjectId,
            teacher: pendingTeacherId
          });
          showToast('បានរក្សាទុកដោយជោគជ័យ', 'success');
          await fetchClassSubjects();
          handle.close();
          update();
        } catch (err) {
          showToast('បរាជ័យក្នុងការរក្សាទុក', 'error');
          saveBtn.disabled = false;
          saveBtn.textContent = 'រក្សាទុក';
        }
      });
    }
  }

  renderBody();
  const handle = openModal(wrap);
}

function update() {
  if (!root) return;
  const { classrooms, academicYears, subjects, timeSlots, timetables, loading, error, selectedClassroom, selectedAcademicYear, teachers, classSubjects, docConfig, lunarDateText, filterEnabled } = state;

  const subjectMap = {};
  subjects.forEach(s => subjectMap[s.id] = s.subject_name);

  // Filter Morning and Afternoon slots based on session names
  const morningSlots = timeSlots.filter(ts => (ts.session || '').toLowerCase().includes('morning') || (ts.session || '').includes('ព្រឹក')).sort((a, b) => a.slot_no - b.slot_no);
  const afternoonSlots = timeSlots.filter(ts => (ts.session || '').toLowerCase().includes('afternoon') || (ts.session || '').includes('រសៀល')).sort((a, b) => a.slot_no - b.slot_no);

  const selectedClassObj = classrooms.find(c => String(c.id) === String(selectedClassroom));
  const selectedYearObj = academicYears.find(y => String(y.id) === String(selectedAcademicYear));

  let homeroomTeacherName = '.................';
  if (selectedClassObj && selectedClassObj.homeroom_teacher) {
    const t = teachers.find(t => String(t.id) === String(selectedClassObj.homeroom_teacher));
    if (t) homeroomTeacherName = `${t.last_name} ${t.first_name}`;
  }

  // Calculate footer summary
  const classSubjList = classSubjects
    .filter(cs => String(cs.classroom) === String(selectedClassroom))
    .sort((a, b) => (a.order || 0) - (b.order || 0) || a.id - b.id);
  const summaryList = classSubjList.map(cs => {
    const subj = subjects.find(s => String(s.id) === String(cs.subject));
    const hours = subj ? subj.total_hours : 0;
    const score = subj ? subj.total_score : 0;
    const homework = subj ? subj.total_homework : 0;
    let teacherName = '.................';
    if (cs.teacher) {
      const t = teachers.find(t => String(t.id) === String(cs.teacher));
      if (t) teacherName = `${t.last_name} ${t.first_name}`;
    }
    return {
      csId: String(cs.id),
      subjectId: String(cs.subject),
      teacherId: cs.teacher ? String(cs.teacher) : '',
      name: subj ? subj.subject_name : 'មិនស្គាល់',
      teacher: teacherName,
      hours: hours || 0,
      score: score || 0,
      homework: homework || 0
    };
  });

  // Ensure even split for columns if possible
  const halfLen = Math.ceil(summaryList.length / 2) || 0;
  const col1 = summaryList.slice(0, halfLen);
  const col2 = summaryList.slice(halfLen);

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:24px;padding-bottom:60px;">
      
      <!-- Control Panel -->
      <div class="glass-panel" style="padding:20px;display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;position:relative;z-index:50;">

        <div style="flex:1;min-width:200px;">
          <label style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-weight:500;font-size:0.875rem;cursor:pointer;">
            <input type="checkbox" data-f="toggle-year" ${filterEnabled.year ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;accent-color:#16a34a;">
            ឆ្នាំសិក្សា
          </label>
          <div style="position:relative;">
            <select data-f="filter-year" class="form-input" ${filterEnabled.year ? '' : 'disabled'} style="width:100%;padding:10px 36px 10px 10px;border-radius:8px;border:1px solid #d1d5db;font-family:'Battambang',sans-serif;">
              ${[...academicYears].sort((a, b) => (a.start_date || '').localeCompare(b.start_date || '')).map(y => `<option value="${y.id}" ${String(y.id) === String(selectedAcademicYear) ? 'selected' : ''}>${y.name || y.year_name}${y.is_current ? ' ✓ (បច្ចុប្បន្ន)' : ''}</option>`).join('')}
            </select>
            ${filterEnabled.year
      ? '<i data-lucide="check-circle-2" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#16a34a;pointer-events:none;"></i>'
      : '<i data-lucide="ban" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#9ca3af;pointer-events:none;"></i>'}
          </div>
        </div>
        <div style="flex:1;min-width:200px;">
          <label style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-weight:500;font-size:0.875rem;cursor:pointer;">
            <input type="checkbox" data-f="toggle-class" ${filterEnabled.class ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;accent-color:#16a34a;">
            ថ្នាក់រៀន
          </label>
          <div style="position:relative;">
            <select data-f="filter-class" class="form-input" ${filterEnabled.class ? '' : 'disabled'} style="width:100%;padding:10px 36px 10px 10px;border-radius:8px;border:1px solid #d1d5db;font-family:'Battambang',sans-serif;">
              ${classrooms.map(c => `<option value="${c.id}" ${String(c.id) === String(selectedClassroom) ? 'selected' : ''}>${c.class_name}</option>`).join('')}
            </select>
            ${filterEnabled.class
      ? '<i data-lucide="check-circle-2" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#16a34a;pointer-events:none;"></i>'
      : '<i data-lucide="ban" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#9ca3af;pointer-events:none;"></i>'}
          </div>
        </div>
        
        <div style="position:relative;margin-left:auto;" onmouseenter="this.querySelector('#tg-menu').style.display='block'" onmouseleave="this.querySelector('#tg-menu').style.display='none'">
            <button  class="btn" style="background:#0088cc;color:#fff;display:flex;align-items:center;gap:7px;"><i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>
            <div id="tg-menu" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:180px;overflow:hidden;"
              <button data-action="tg-send-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> PDF (.pdf)</button>
              <button data-action="tg-send-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="image" style="width:16px;height:16px;color:#a855f7;"></i> Image (.png)</button>
              <button data-action="tg-send-word" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file" style="width:16px;height:16px;color:#3b82f6;"></i> Word (.doc)</button>
            </div>
        </div>
      </div>

      ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;">${error}</div>` : ''}
      
      ${loading ? `<div style="text-align:center;padding:60px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>` : `
        <!-- Document Container -->
        <div data-role="print-target" style="background:white;padding:20px 20px 40px 20px;border-radius:8px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);max-width:100%;margin:0 auto;width:100%;">

          <!-- Header Layout -->
          <div style="position:relative;display:flex;justify-content:space-between;margin-bottom:0px;margin-top:20px;">
            <button data-action="edit-doc-config" data-section="header" title="កែប្រែក្បាលឯកសារ" style="position:absolute;top:-8px;right:50%;transform:translateX(50%);background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:4px;cursor:pointer;color:#6b7280;"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
            <div style="text-align:center;font-family:'Moul',cursive;color:#1e3a8a;">
              <div style="font-size:1.15rem;margin-bottom:2px;">${docConfig.headerLeftLine1}</div>
              <div style="font-size:1.05rem;margin-bottom:2px;">${docConfig.headerLeftLine2}</div>
              <div style="font-size:1.05rem;">${docConfig.headerLeftLine3}</div>
            </div>
            <div style="text-align:center;font-family:'Moul',cursive;color:#1e3a8a;">
              <div style="font-size:1.15rem;margin-bottom:2px;">${docConfig.headerRightLine1}</div>
              <div style="font-size:1.05rem;">${docConfig.headerRightLine2}</div>
              <div style="font-family:serif;font-size:1.4rem;margin-top:4px;">${docConfig.headerRightLine2 ? '* * * * *' : ''}</div>
            </div>
          </div>

          <div style="position:relative;text-align:center;font-family:'Moul',cursive;color:#1e3a8a;margin-bottom:${docConfig.titleMain ? '0px' : '0px'};height:${docConfig.titleMain ? 'auto' : '0px'};">
             <button data-action="edit-doc-config" data-section="title" title="កែប្រែចំណងជើង" style="position:absolute;top:-4px;right:0;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:4px;cursor:pointer;color:#6b7280;z-index:10;"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
             ${docConfig.titleMain ? `<h2 style="font-size:1.3rem;margin:0 0 2px 0;">${docConfig.titleMain}</h2>
             <div style="font-size:1.05rem;color:#1e40af;">${toKhmerNum(selectedClassObj?.class_name || '...')} ${docConfig.titleSubSuffix}</div>` : ''}
          </div>

          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:4px;font-family:'Battambang',sans-serif;font-weight:600;color:#1e3a8a;margin-top:2px;">
             <div>គ្រូបន្ទុកថ្នាក់៖ <span style="color:#d97706;">${homeroomTeacherName}</span></div>
             <div>ឆ្នាំសិក្សា <span>${toKhmerNum(selectedYearObj?.name || selectedYearObj?.year_name || '...')}</span></div>
          </div>

          <!-- Schedule Grid -->
          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:1180px;border-collapse:collapse;border:2px solid #1e3a8a;table-layout:fixed;">
              <thead>
                <tr>
                  <th style="padding:8px 6px;background:white;border:1px solid #1e3a8a;text-align:center;width:100px;font-family:'Moul',cursive;font-size:0.95rem;color:#1e3a8a;">ម៉ោង</th>
                  ${LUNAR_DAYS.map(d => d === 8 ? `<th style="padding:6px;width:60px;background:white;border:1px solid #1e3a8a;text-align:center;font-family:'Moul',cursive;font-size:0.85rem;color:#1e3a8a;line-height:1.2;">${toKhmerNum(d)} ក.រ</th>` : `<th style="padding:8px 4px;width:86px;background:white;border:1px solid #1e3a8a;text-align:center;font-family:'Moul',cursive;font-size:0.95rem;color:#1e3a8a;">${toKhmerNum(d)} ក.រ</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${renderRows(morningSlots, 'ពេលព្រឹក', subjectMap)}
                ${renderRows(afternoonSlots, 'ពេលរសៀល', subjectMap)}
              </tbody>
            </table>
          </div>

          <!-- Combined Summary Footer & Signatures -->
          <div style="position:relative;margin-top:16px;display:flex;align-items:flex-start;gap:20px;font-family:'Battambang',sans-serif;font-weight:600;color:#1e3a8a;font-size:0.85rem;">
            <button data-action="edit-doc-config" data-section="footer" title="កែប្រែបាតឯកសារ" style="position:absolute;top:-30px;right:50%;transform:translateX(50%);background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:4px;cursor:pointer;color:#6b7280;"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>

            <!-- Column 1 -->
            <div style="flex:1;padding-right: 15px;">
              ${col1.map((item, i) => renderSummaryRow(item, i + 1)).join('')}
            </div>

            <!-- Dotted Divider -->
            <div style="border-left:1px dashed #1e3a8a;align-self:stretch;margin:10px 0;"></div>

            <!-- Column 2 -->
            <div style="flex:1;padding-left: 15px;">
              ${col2.map((item, i) => renderSummaryRow(item, i + 1 + col1.length)).join('')}
            </div>

            <!-- Column 3: Signatures -->
            <div style="flex:1.6;display:flex;flex-direction:column;align-items:center;text-align:center;color:#1e3a8a;font-size:1rem;">
                <div style="margin-bottom:4px;">${docConfig.footerDateLunar || lunarDateText}</div>
                <div style="margin-bottom:16px;">${docConfig.footerDateGregorian || (docConfig.footerLocation + ', ' + formatGregorianKhmer(new Date()))}</div>
                <div style="font-weight:bold;font-size:1.15rem;">${docConfig.footerApproverRole}</div>
            </div>
          </div>

        </div>
      `}
    </div>
  `;

  // Bind Events
  const tgToggleBtn = root.querySelector('[data-action="toggle-tg-menu"]');
  if (tgToggleBtn) tgToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = !state.showTgMenu; update(); });
  if (!tgMenuListenerBound) {
    tgMenuListenerBound = true;
    document.addEventListener('click', (e) => {
      if (state.showTgMenu && !e.target.closest('[data-action="toggle-tg-menu"]') && !e.target.closest('[data-action^="tg-send-"]')) {
        state.showTgMenu = false;
        update();
      }
    });
  }
  const tgPdfBtn = root.querySelector('[data-action="tg-send-pdf"]');
  if (tgPdfBtn) tgPdfBtn.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('pdf'); });
  const tgImageBtn = root.querySelector('[data-action="tg-send-image"]');
  if (tgImageBtn) tgImageBtn.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('image'); });
  const tgWordBtn = root.querySelector('[data-action="tg-send-word"]');
  if (tgWordBtn) tgWordBtn.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('word'); });

  const toggleYear = root.querySelector('[data-f="toggle-year"]');
  if (toggleYear) {
    toggleYear.addEventListener('change', (e) => {
      state.filterEnabled.year = e.target.checked;
      update();
    });
  }

  const toggleClass = root.querySelector('[data-f="toggle-class"]');
  if (toggleClass) {
    toggleClass.addEventListener('change', (e) => {
      state.filterEnabled.class = e.target.checked;
      update();
    });
  }

  const filterYear = root.querySelector('[data-f="filter-year"]');
  if (filterYear) {
    filterYear.addEventListener('change', (e) => {
      state.selectedAcademicYear = e.target.value;
      localStorage.setItem('scheduleSelectedAcademicYear', e.target.value);
      fetchTimetable();
    });
  }

  const filterClass = root.querySelector('[data-f="filter-class"]');
  if (filterClass) {
    filterClass.addEventListener('change', (e) => {
      state.selectedClassroom = e.target.value;
      localStorage.setItem('scheduleSelectedClassroom', e.target.value);
      fetchTimetable();
    });
  }

  root.querySelectorAll('[data-action="edit-cell"]').forEach(cell => {
    cell.addEventListener('click', () => {
      openEditModal(cell.dataset.day, cell.dataset.ts);
    });
  });

  root.querySelectorAll('[data-action="edit-doc-config"]').forEach(btn => {
    btn.addEventListener('click', () => openDocConfigModal(btn.dataset.section));
  });

  root.querySelectorAll('[data-action="swap-subject"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSwapModal(btn.dataset.cs);
    });
  });

  // Add hover effect
  root.querySelectorAll('[data-action="edit-cell"]').forEach(cell => {
    cell.addEventListener('mouseenter', (e) => {
      if (e.target.style.color === 'transparent') {
        e.target.style.background = '#f3f4f6';
      } else {
        e.target.style.filter = 'brightness(0.95)';
      }
    });
    cell.addEventListener('mouseleave', (e) => {
      if (e.target.style.color === 'transparent') {
        e.target.style.background = 'white';
      } else {
        e.target.style.filter = 'none';
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = {
    classrooms: [], academicYears: [], subjects: [], timeSlots: [], timetables: [], teachers: [], classSubjects: [],
    selectedClassroom: '', selectedAcademicYear: '',
    filterEnabled: { year: true, class: true },
    docConfig: loadDocConfig(),
    showDocConfigModal: false,
    showTgMenu: false,
    lunarDateText: (() => { try { return toKhmerLunarDate(new Date()).lunarDateText || ''; } catch { return ''; } })(),
    loading: true, error: null, isProcessing: false
  };
  update();
  fetchData();
}

export function destroy() {
  root = null;
}
