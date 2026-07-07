import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { createSearchSelect } from '../components/searchSelect.js';
import { openModal } from '../components/modal.js';
import { buildStandardReportElement } from '../components/reportTemplate.js';
import { paginate, renderPager } from '../components/table.js';
import { onLiveInput } from '../utils/dom.js';

let state = {
  students: [],
  classrooms: [],
  academicYears: [],
  enrollments: [],
  selectedAcademicYear: '',
  selectedClassroom: '',

  searchAvailable: '',
  searchEnrolled: '',
  genderFilter: 'All',
  monkStatusFilter: 'All',
  showFilterMenu: false,
  showExportMenu: false,
  exportingTelegram: false,

  selectedAvailableIds: new Set(),
  selectedEnrolledIds: new Set(),

  availablePage: 1,
  enrolledPage: 1,
  itemsPerPage: 10,

  isLoading: true,
  isProcessing: false
};

const root = document.createElement('div');
root.className = 'enrollments-page';

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .enroll-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .enroll-filters { display: flex; gap: 20px; align-items: flex-end; flex-wrap: wrap; }
    .enroll-filters > div { flex: 1; min-width: 220px; }
    .enroll-avatar {
      width: 32px; height: 32px; border-radius: 50%; background: var(--primary, #4f46e5);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    }
    .enroll-row { display: flex; align-items: center; gap: 10px; }
    .enroll-bulkbar {
      display: flex; align-items: center; justify-content: space-between;
      background: #eef2ff; border-bottom: 1px solid #c7d2fe; padding: 10px 16px;
      font-size: 0.85rem; color: #3730a3; flex-wrap: wrap; gap: 8px;
    }
    .enroll-iconbtn {
      background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px;
      display: inline-flex; align-items: center; justify-content: center; color: var(--text-secondary, #6b7280);
    }
    .enroll-iconbtn:hover { background: #f1f5f9; }
    @media (max-width: 900px) {
      .enroll-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .enroll-filters { flex-direction: column; align-items: stretch; }
      .enroll-filters > div { min-width: 0; }
      .enroll-table-wrap { overflow-x: auto; }
    }
  `;
  document.head.appendChild(style);
}

export function render(container) {
  injectStyles();
  container.appendChild(root);
  loadData();
}

export function destroy() {
  root.innerHTML = '';
}

function initials(s) {
  const a = (s.last_name || '').trim()[0] || '';
  const b = (s.first_name || '').trim()[0] || '';
  return (a + b).toUpperCase() || '?';
}

function classroomLabel(c) {
  if (!c) return '';
  return c.room ? `${c.class_name} (បន្ទប់ ${c.room})` : c.class_name;
}

async function loadData() {
  try {
    state.isLoading = true;
    updateUI();

    const [studentsRes, classroomsRes, yearsRes, enrollmentsRes] = await Promise.all([
      api.get('/api/students/list/'),
      api.get('/api/classrooms/'),
      api.get('/api/academic-years/'),
      api.get('/api/students/enrollments/')
    ]);

    state.students = studentsRes.ok ? (studentsRes.data || []) : [];
    state.classrooms = classroomsRes.ok ? (classroomsRes.data || []) : [];
    state.academicYears = yearsRes.ok ? (yearsRes.data || []) : [];
    state.enrollments = enrollmentsRes.ok ? (enrollmentsRes.data || []) : [];

    const activeYear = state.academicYears.find(y => y.is_current);
    if (activeYear) state.selectedAcademicYear = activeYear.id;
    else if (state.academicYears.length > 0) state.selectedAcademicYear = state.academicYears[0].id;

    if (state.classrooms.length > 0) state.selectedClassroom = state.classrooms[0].id;

  } catch (error) {
    console.error('Error loading data:', error);
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យ', 'error');
  } finally {
    state.isLoading = false;
    updateUI();
  }
}

async function refreshEnrollments() {
  const res = await api.get('/api/students/enrollments/');
  state.enrollments = res.ok ? (res.data || []) : [];
}

async function handleAdd(studentIds) {
  if (state.isProcessing) return;
  state.isProcessing = true;
  updateUI();

  const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
  const today = new Date().toISOString().split('T')[0];
  let successCount = 0;

  try {
    for (const studentId of ids) {
      try {
        const payload = {
          student: studentId,
          classroom: state.selectedClassroom,
          academic_year: state.selectedAcademicYear,
          enrollment_date: today
        };
        const result = await api.post('/api/students/enrollments/', payload);
        if (result.ok) successCount++;
      } catch (err) {
        console.error(err);
      }
    }

    if (successCount > 0) {
      showToast(
        successCount > 1 ? `បានបញ្ចូលសិស្ស ${successCount} នាក់ទៅថ្នាក់ដោយជោគជ័យ` : 'បានបញ្ចូលសិស្សទៅថ្នាក់ដោយជោគជ័យ',
        'success'
      );
      await refreshEnrollments();
      state.selectedAvailableIds.clear();
    }
    if (successCount < ids.length) {
      showToast('បរាជ័យសម្រាប់សិស្សមួយចំនួន', 'error');
    }
  } finally {
    state.isProcessing = false;
    updateUI();
  }
}

async function handleRemove(enrollmentIds) {
  if (state.isProcessing) return;

  const ids = Array.isArray(enrollmentIds) ? enrollmentIds : [enrollmentIds];
  const msg = ids.length > 1
    ? `តើអ្នកពិតជាចង់ដកសិស្ស ${ids.length} នាក់ចេញពីថ្នាក់មែនទេ?`
    : 'តើអ្នកពិតជាចង់ដកសិស្សនេះចេញពីថ្នាក់មែនទេ?';
  if (!confirm(msg)) return;

  state.isProcessing = true;
  updateUI();

  let successCount = 0;
  try {
    for (const enrollmentId of ids) {
      try {
        const result = await api.del(`/api/students/enrollments/${enrollmentId}/`);
        if (result.ok) successCount++;
      } catch (err) {
        console.error(err);
      }
    }

    if (successCount > 0) {
      showToast(
        successCount > 1 ? `បានដកសិស្ស ${successCount} នាក់ចេញពីថ្នាក់ជោគជ័យ` : 'បានដកសិស្សចេញពីថ្នាក់ជោគជ័យ',
        'success'
      );
      await refreshEnrollments();
      state.selectedEnrolledIds.clear();
    }
    if (successCount < ids.length) {
      showToast('បរាជ័យសម្រាប់សិស្សមួយចំនួន', 'error');
    }
  } finally {
    state.isProcessing = false;
    updateUI();
  }
}

async function handleUpdateEnrollment(enrollmentId, payload) {
  state.isProcessing = true;
  updateUI();
  try {
    const result = await api.patch(`/api/students/enrollments/${enrollmentId}/`, payload);
    if (result.ok) {
      showToast('បានកែប្រែការចុះឈ្មោះដោយជោគជ័យ', 'success');
      await refreshEnrollments();
      return true;
    }
    showToast('បរាជ័យក្នុងការកែប្រែ', 'error');
    return false;
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យក្នុងការកែប្រែ', 'error');
    return false;
  } finally {
    state.isProcessing = false;
    updateUI();
  }
}

function matchesSearch(text, query) {
  if (!query) return true;
  return text.toLowerCase().includes(query.toLowerCase());
}

// --- View Modal ---
function openViewModal(student, enrollment) {
  const classroom = state.classrooms.find(c => String(c.id) === String(enrollment.classroom));
  const year = state.academicYears.find(y => String(y.id) === String(enrollment.academic_year));

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">ព័ត៌មានសិស្ស</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
      <div class="enroll-avatar" style="width:52px;height:52px;font-size:1.1rem;">${initials(student)}</div>
      <div>
        <div style="font-weight:700;font-size:1.05rem;">${student.last_name || ''} ${student.first_name || ''}</div>
        <div style="color:#6b7280;font-size:0.875rem;">${student.student_code || '-'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:0.9rem;">
      <div><div style="color:#6b7280;">ភេទ</div><div style="font-weight:600;">${student.gender || '-'}</div></div>
      <div><div style="color:#6b7280;">ឋានៈ</div><div style="font-weight:600;">${student.monk_status || '-'}</div></div>
      <div><div style="color:#6b7280;">ទូរស័ព្ទ</div><div style="font-weight:600;">${student.phone || '-'}</div></div>
      <div><div style="color:#6b7280;">ថ្ងៃខែឆ្នាំកំណើត</div><div style="font-weight:600;">${student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('en-GB') : '-'}</div></div>
      <div><div style="color:#6b7280;">ថ្នាក់រៀន</div><div style="font-weight:600;">${classroomLabel(classroom) || '-'}</div></div>
      <div><div style="color:#6b7280;">ឆ្នាំសិក្សា</div><div style="font-weight:600;">${year ? year.year_name : '-'}</div></div>
      <div><div style="color:#6b7280;">ថ្ងៃបញ្ចូលថ្នាក់</div><div style="font-weight:600;">${enrollment.enrollment_date || '-'}</div></div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
      <button type="button" data-action="cancel" style="padding:10px 16px;background-color:#f1f5f9;border:none;border-radius:8px;cursor:pointer;font-weight:500;">បិទ</button>
    </div>
  `;
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
}

// --- Edit / Transfer Modal ---
function openEditModal(student, enrollment) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">កែប្រែការចុះឈ្មោះ</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div style="margin-bottom:16px;font-size:0.9rem;color:#4b5563;">${student.last_name || ''} ${student.first_name || ''} (${student.student_code || '-'})</div>
    <form style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្នាក់រៀន</label>
        <div id="edit-classroom-select"></div>
      </div>
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃបញ្ចូលថ្នាក់</label>
        <input type="date" data-f="enrollment_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${enrollment.enrollment_date || ''}" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:8px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">រក្សាទុក</button>
      </div>
    </form>
  `;

  let selectedClassroom = String(enrollment.classroom);
  const classroomSelect = createSearchSelect({
    options: state.classrooms.map(c => ({ value: String(c.id), label: classroomLabel(c) })),
    value: selectedClassroom,
    placeholder: '-- ជ្រើសរើសថ្នាក់រៀន --',
    onChange: (v) => { selectedClassroom = v; }
  });
  wrap.querySelector('#edit-classroom-select').appendChild(classroomSelect.el);

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const enrollmentDate = wrap.querySelector('[data-f="enrollment_date"]').value;
    const ok = await handleUpdateEnrollment(enrollment.id, {
      classroom: selectedClassroom,
      enrollment_date: enrollmentDate
    });
    if (ok) handle.close();
  });

  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
}

// --- Telegram Config (shared localStorage key with other pages) ---
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

// --- Export / Telegram send for the currently-filtered enrolled list ---
function getEnrollmentReportElement(list) {
  const ROWS_PER_PAGE = 15;
  const totalPages = Math.ceil(list.length / ROWS_PER_PAGE) || 1;

  // Kept in normal document flow (not position:absolute/fixed) and hidden via a
  // zero-size overflow:hidden host -- html2canvas measures a positioned element's
  // cloned layout box as zero height, which produced blank/empty exports.
  const hiddenHost = document.createElement('div');
  hiddenHost.style.position = 'fixed';
  hiddenHost.style.top = '0';
  hiddenHost.style.left = '0';
  hiddenHost.style.width = '0';
  hiddenHost.style.height = '0';
  hiddenHost.style.overflow = 'hidden';

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.gap = '20px';

  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    const startIndex = i * ROWS_PER_PAGE;
    const chunk = list.slice(startIndex, startIndex + ROWS_PER_PAGE);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>ល.រ</th>
        <th>អត្តលេខ</th>
        <th>គោត្តនាម-នាម</th>
        <th>ភេទ</th>
        <th>ថ្នាក់រៀន</th>
        <th>ឆ្នាំសិក្សា</th>
        <th>ថ្ងៃបញ្ចូលថ្នាក់</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    chunk.forEach((e, chunkIdx) => {
      const idx = startIndex + chunkIdx;
      const student = state.students.find(s => String(s.id) === String(e.student));
      const classroom = state.classrooms.find(c => String(c.id) === String(e.classroom));
      const year = state.academicYears.find(y => String(y.id) === String(e.academic_year));
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${student?.student_code || ''}</td>
        <td style="text-align:left;">${student ? `${student.last_name || ''} ${student.first_name || ''}` : ''}</td>
        <td>${student?.gender || ''}</td>
        <td style="text-align:left;">${classroomLabel(classroom)}</td>
        <td>${year ? year.year_name : ''}</td>
        <td>${e.enrollment_date || ''}</td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    const pageInfo = `${i + 1}/${totalPages}`;
    const pageContainer = buildStandardReportElement('របាយការណ៍បញ្ចូលសិស្សទៅថ្នាក់', table, null, 'landscape', pageInfo);
    if (i < totalPages - 1) pageContainer.style.pageBreakAfter = 'always';

    wrapper.appendChild(pageContainer);
    pages.push(pageContainer);
  }

  hiddenHost.appendChild(wrapper);
  document.body.appendChild(hiddenHost);
  return { container: wrapper, wrapper, hiddenHost, pages };
}

async function handleExport(type, enrolledList) {
  if (enrolledList.length === 0) {
    showToast('មិនមានទិន្នន័យសម្រាប់បញ្ជូនទេ', 'warning');
    return;
  }

  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  showToast('កំពុងរៀបចំរបាយការណ៍ និងផ្ញើ...', 'info');
  state.exportingTelegram = true;
  updateUI();

  try {
    await handleExportInner(type, enrolledList, tgConfig);
  } finally {
    state.exportingTelegram = false;
    updateUI();
  }
}

async function handleExportInner(type, enrolledList, tgConfig) {
  if (type === 'excel') {
    try {
      const data = enrolledList.map((e, idx) => {
        const student = state.students.find(s => String(s.id) === String(e.student));
        const classroom = state.classrooms.find(c => String(c.id) === String(e.classroom));
        const year = state.academicYears.find(y => String(y.id) === String(e.academic_year));
        return {
          'ល.រ': idx + 1,
          'អត្តលេខ': student?.student_code || '',
          'នាមត្រកូល': student?.last_name || '',
          'នាមខ្លួន': student?.first_name || '',
          'ភេទ': student?.gender || '',
          'ថ្នាក់រៀន': classroomLabel(classroom),
          'ឆ្នាំសិក្សា': year ? year.year_name : '',
          'ថ្ងៃបញ្ចូលថ្នាក់': e.enrollment_date || ''
        };
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Enrollments');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const formData = new FormData();
      formData.append('chat_id', tgConfig.chatId);
      formData.append('document', blob, 'Enrollment_Report.xlsx');
      formData.append('caption', 'របាយការណ៍បញ្ចូលសិស្សទៅថ្នាក់ (Excel)');

      const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('telegram-send-failed');
      showToast('បានផ្ញើ Excel ចូល Telegram ដោយជោគជ័យ', 'success');
    } catch (err) {
      console.error(err);
      showToast('បរាជ័យក្នុងការផ្ញើ Excel', 'error');
    }
    return;
  }

  const { container, wrapper, hiddenHost, pages } = getEnrollmentReportElement(enrolledList);

  try {
    if (type === 'pdf') {
      const opt = {
        margin: 10,
        filename: 'Enrollment_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
      const pdfBlob = await html2pdf().set(opt).from(container).output('blob');

      const formData = new FormData();
      formData.append('chat_id', tgConfig.chatId);
      formData.append('document', pdfBlob, 'Enrollment_Report.pdf');
      formData.append('caption', 'របាយការណ៍បញ្ចូលសិស្សទៅថ្នាក់ (PDF)');

      const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('telegram-send-failed');
      showToast('បានផ្ញើ PDF ចូល Telegram ដោយជោគជ័យ', 'success');

    } else if (type === 'image') {
      const blobs = [];
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.98));
        if (blob) blobs.push(blob);
      }

      try {
        const formData = new FormData();
        formData.append('chat_id', tgConfig.chatId);

        if (blobs.length === 1) {
          formData.append('photo', blobs[0], 'Enrollment_Report.png');
          formData.append('caption', 'របាយការណ៍បញ្ចូលសិស្សទៅថ្នាក់');
          const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendPhoto`, {
            method: 'POST',
            body: formData
          });
          if (!res.ok) throw new Error('telegram-send-failed');
        } else {
          const mediaArray = [];
          blobs.forEach((blob, i) => {
            formData.append(`photo${i}`, blob, `Enrollment_Report_Page${i + 1}.png`);
            mediaArray.push({
              type: 'photo',
              media: `attach://photo${i}`,
              caption: i === 0 ? `របាយការណ៍បញ្ចូលសិស្សទៅថ្នាក់ (សរុប ${blobs.length} ទំព័រ)` : ''
            });
          });
          formData.append('media', JSON.stringify(mediaArray));

          const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendMediaGroup`, {
            method: 'POST',
            body: formData
          });
          if (!res.ok) throw new Error('telegram-sendMediaGroup-failed');
        }

        showToast(`បានផ្ញើរូបភាព (${blobs.length} ទំព័រ) ចូល Telegram ជោគជ័យ`, 'success');
      } catch (err) {
        console.error(err);
        showToast('បរាជ័យក្នុងការផ្ញើរូបភាព', 'error');
      } finally {
        if (hiddenHost.parentNode) document.body.removeChild(hiddenHost);
      }
      return;
    }
  } catch (err) {
    console.error(err);
    showToast('មានបញ្ហាក្នុងការបង្កើត និងផ្ញើរបាយការណ៍', 'error');
  }

  if (type === 'pdf') {
    document.body.removeChild(hiddenHost);
  }
}

function updateUI() {
  if (state.isLoading) {
    root.innerHTML = `<div style="padding:40px;text-align:center;">កំពុងទាញយកទិន្នន័យ...</div>`;
    return;
  }

  let availableStudents = [];
  let enrolledList = [];

  if (state.selectedAcademicYear && state.selectedClassroom) {
    availableStudents = state.students.filter(s => {
      const isEnrolled = state.enrollments.some(e => String(e.student) === String(s.id) && String(e.academic_year) === String(state.selectedAcademicYear));
      return !isEnrolled;
    }).filter(s => {
      if (state.genderFilter !== 'All' && s.gender !== state.genderFilter) return false;
      if (state.monkStatusFilter !== 'All' && s.monk_status !== state.monkStatusFilter) return false;
      return matchesSearch(`${s.last_name || ''} ${s.first_name || ''} ${s.student_code || ''}`, state.searchAvailable);
    });

    enrolledList = state.enrollments
      .filter(e => String(e.classroom) === String(state.selectedClassroom) && String(e.academic_year) === String(state.selectedAcademicYear))
      .filter(e => {
        const student = state.students.find(s => String(s.id) === String(e.student));
        if (!student) return false;
        return matchesSearch(`${student.last_name || ''} ${student.first_name || ''} ${student.student_code || ''}`, state.searchEnrolled);
      });
  }

  const availablePaged = paginate(availableStudents, state.availablePage, state.itemsPerPage);
  const enrolledPaged = paginate(enrolledList, state.enrolledPage, state.itemsPerPage);

  const availableIdsOnScreen = availablePaged.items.map(s => String(s.id));
  const enrolledIdsOnScreen = enrolledPaged.items.map(e => String(e.id));
  const allAvailableSelected = availableIdsOnScreen.length > 0 && availableIdsOnScreen.every(id => state.selectedAvailableIds.has(id));
  const allEnrolledSelected = enrolledIdsOnScreen.length > 0 && enrolledIdsOnScreen.every(id => state.selectedEnrolledIds.has(id));

  root.innerHTML = `
    <div style="padding: 24px; max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <h1 style="font-family: 'Moul', cursive; font-size: 1.5rem; color: #1e3a8a; margin: 0;">បញ្ចូលសិស្សទៅថ្នាក់</h1>
          <p style="color:#6b7280;font-size:0.9rem;margin:4px 0 0;">ជ្រើសរើសឆ្នាំសិក្សា និងថ្នាក់រៀន រួចបញ្ចូល ឬដកសិស្សចេញ</p>
        </div>
        <div style="position:relative;">
          <button type="button" class="btn" data-action="toggle-export-menu" ${state.exportingTelegram ? 'disabled' : ''} style="background:#0088cc;color:#fff;border:none;display:flex;align-items:center;gap:7px;opacity:${state.exportingTelegram ? '0.7' : '1'};cursor:${state.exportingTelegram ? 'not-allowed' : 'pointer'};">
            <i data-lucide="${state.exportingTelegram ? 'loader-circle' : 'send'}" style="width:16px;height:16px;${state.exportingTelegram ? 'animation:spin 1s linear infinite;' : ''}"></i> ${state.exportingTelegram ? 'កំពុងផ្ញើ...' : 'ផ្ញើ Telegram'}
          </button>
          ${state.showExportMenu && !state.exportingTelegram ? `
            <div data-role="export-panel" style="position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:180px;overflow:hidden;">
              <button data-action="export-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> PDF</button>
              <button data-action="export-excel" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate"><i data-lucide="file-spreadsheet" style="width:16px;height:16px;color:#16a34a;"></i> Excel</button>
              <button data-action="export-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate"><i data-lucide="image" style="width:16px;height:16px;color:#0ea5e9;"></i> Image</button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Filters -->
      <div class="enroll-filters" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div>
          <label style="display: block; font-size: 0.875rem; color: #4b5563; margin-bottom: 8px;">ឆ្នាំសិក្សា (Academic Year)</label>
          <div id="year-select"></div>
        </div>
        <div>
          <label style="display: block; font-size: 0.875rem; color: #4b5563; margin-bottom: 8px;">ថ្នាក់រៀន (Classroom)</label>
          <div id="class-select"></div>
        </div>
        <div style="position:relative;flex:0;">
          <button type="button" class="btn btn-outline" data-action="toggle-filter-menu" style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:10px;white-space:nowrap;">
            <i data-lucide="filter" style="width:16px;height:16px;"></i> តម្រង
          </button>
          ${state.showFilterMenu ? `
            <div data-role="filter-panel" style="position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:220px;padding:16px;display:flex;flex-direction:column;gap:14px;">
              <div>
                <label style="display:block;margin-bottom:6px;font-size:0.8rem;color:#4b5563;">ភេទ</label>
                <select data-f="gender-filter" class="form-input" style="width:100%;padding:8px;border-radius:6px;border:1px solid #d1d5db;">
                  <option value="All" ${state.genderFilter === 'All' ? 'selected' : ''}>ទាំងអស់</option>
                  <option value="ប្រុស" ${state.genderFilter === 'ប្រុស' ? 'selected' : ''}>ប្រុស</option>
                  <option value="ស្រី" ${state.genderFilter === 'ស្រី' ? 'selected' : ''}>ស្រី</option>
                </select>
              </div>
              <div>
                <label style="display:block;margin-bottom:6px;font-size:0.8rem;color:#4b5563;">ឋានៈ</label>
                <select data-f="monk-filter" class="form-input" style="width:100%;padding:8px;border-radius:6px;border:1px solid #d1d5db;">
                  <option value="All" ${state.monkStatusFilter === 'All' ? 'selected' : ''}>ទាំងអស់</option>
                  <option value="គ្រហស្ថ" ${state.monkStatusFilter === 'គ្រហស្ថ' ? 'selected' : ''}>គ្រហស្ថ</option>
                  <option value="សាមណេរ" ${state.monkStatusFilter === 'សាមណេរ' ? 'selected' : ''}>សាមណេរ</option>
                  <option value="ភិក្ខុ" ${state.monkStatusFilter === 'ភិក្ខុ' ? 'selected' : ''}>ភិក្ខុ</option>
                </select>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      ${!state.selectedAcademicYear || !state.selectedClassroom ? `
        <div style="background:#fffbeb;border:1px solid #fde68a;color:#92400e;padding:16px;border-radius:10px;text-align:center;">
          សូមជ្រើសរើសទាំងឆ្នាំសិក្សា និងថ្នាក់រៀន ដើម្បីបន្ត
        </div>
      ` : `
      <!-- Dual Panels -->
      <div class="enroll-grid">

        <!-- Left Panel: Available Students -->
        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden;">
          <div style="background: #f3f4f6; padding: 16px; border-bottom: 1px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 style="font-size: 1.1rem; font-weight: 600; color: #1f2937; margin: 0; font-family: 'Battambang', sans-serif;">សិស្សមិនទាន់មានថ្នាក់ (${availableStudents.length})</h2>
            </div>
            <input type="text" id="search-available" placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..." value="${state.searchAvailable}" class="form-input" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #d1d5db;font-size:0.875rem;" />
          </div>
          ${state.selectedAvailableIds.size > 0 ? `
            <div class="enroll-bulkbar">
              <span>បានជ្រើស ${state.selectedAvailableIds.size} នាក់</span>
              <button data-action="bulk-add" ${state.isProcessing ? 'disabled' : ''} style="background:#10b981;color:white;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:0.8rem;font-weight:600;display:flex;align-items:center;gap:6px;">
                <i data-lucide="user-check" style="width:14px;height:14px;"></i> បញ្ចូលអ្នកដែលបានជ្រើស
              </button>
            </div>
          ` : ''}
          <div class="enroll-table-wrap" style="flex: 1; overflow-y: auto; max-height: 500px;">
            <table style="width: 100%; border-collapse: collapse; font-family: 'Battambang', sans-serif; font-size: 0.875rem;">
              <thead style="background: #f9fafb; position: sticky; top: 0;">
                <tr>
                  <th style="padding: 10px 12px; width:36px; border-bottom: 1px solid #e5e7eb;">
                    <input type="checkbox" data-action="select-all-available" ${allAvailableSelected ? 'checked' : ''} />
                  </th>
                  <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b5563; border-bottom: 1px solid #e5e7eb;">សិស្ស</th>
                  <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b5563; border-bottom: 1px solid #e5e7eb;">អត្តលេខ</th>
                  <th style="padding: 12px 16px; text-align: right; font-weight: 600; color: #4b5563; border-bottom: 1px solid #e5e7eb;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${availablePaged.items.map(s => `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 12px;">
                      <input type="checkbox" data-action="select-available" data-id="${s.id}" ${state.selectedAvailableIds.has(String(s.id)) ? 'checked' : ''} />
                    </td>
                    <td style="padding: 10px 16px; color: #1f2937;">
                      <div class="enroll-row">
                        <div class="enroll-avatar">${initials(s)}</div>
                        <span>${s.last_name || ''} ${s.first_name || ''}</span>
                      </div>
                    </td>
                    <td style="padding: 12px 16px; color: #6b7280;">${s.student_code || '-'}</td>
                    <td style="padding: 12px 16px; text-align: right;">
                      <button data-action="add" data-id="${s.id}" ${state.isProcessing ? 'disabled' : ''} style="background: #10b981; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 4px;">
                        <i data-lucide="plus" style="width: 14px; height: 14px;"></i> បញ្ចូល
                      </button>
                    </td>
                  </tr>
                `).join('')}
                ${availablePaged.items.length === 0 ? `<tr><td colspan="4" style="padding: 24px; text-align: center; color: #6b7280;">គ្មានទិន្នន័យ</td></tr>` : ''}
              </tbody>
            </table>
          </div>
          <div style="padding: 12px 16px;" id="available-pager"></div>
        </div>

        <!-- Right Panel: Enrolled Students -->
        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden; border: 2px solid #3b82f6;">
          <div style="background: #eff6ff; padding: 16px; border-bottom: 1px solid #bfdbfe;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 style="font-size: 1.1rem; font-weight: 600; color: #1e3a8a; margin: 0; font-family: 'Battambang', sans-serif;">សិស្សក្នុងថ្នាក់ (${enrolledList.length})</h2>
            </div>
            <input type="text" id="search-enrolled" placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..." value="${state.searchEnrolled}" class="form-input" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #bfdbfe;font-size:0.875rem;" />
          </div>
          ${state.selectedEnrolledIds.size > 0 ? `
            <div class="enroll-bulkbar" style="background:#fef2f2;border-bottom-color:#fecaca;color:#991b1b;">
              <span>បានជ្រើស ${state.selectedEnrolledIds.size} នាក់</span>
              <button data-action="bulk-remove" ${state.isProcessing ? 'disabled' : ''} style="background:#ef4444;color:white;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:0.8rem;font-weight:600;display:flex;align-items:center;gap:6px;">
                <i data-lucide="user-minus" style="width:14px;height:14px;"></i> ដកអ្នកដែលបានជ្រើស
              </button>
            </div>
          ` : ''}
          <div class="enroll-table-wrap" style="flex: 1; overflow-y: auto; max-height: 500px;">
            <table style="width: 100%; border-collapse: collapse; font-family: 'Battambang', sans-serif; font-size: 0.875rem;">
              <thead style="background: #f9fafb; position: sticky; top: 0;">
                <tr>
                  <th style="padding: 10px 12px; width:36px; border-bottom: 1px solid #e5e7eb;">
                    <input type="checkbox" data-action="select-all-enrolled" ${allEnrolledSelected ? 'checked' : ''} />
                  </th>
                  <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b5563; border-bottom: 1px solid #e5e7eb;">សិស្ស</th>
                  <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b5563; border-bottom: 1px solid #e5e7eb;">ថ្ងៃបញ្ចូល</th>
                  <th style="padding: 12px 16px; text-align: right; font-weight: 600; color: #4b5563; border-bottom: 1px solid #e5e7eb;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${enrolledPaged.items.map(e => {
                  const student = state.students.find(s => String(s.id) === String(e.student));
                  if (!student) return '';
                  return `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 12px;">
                      <input type="checkbox" data-action="select-enrolled" data-id="${e.id}" ${state.selectedEnrolledIds.has(String(e.id)) ? 'checked' : ''} />
                    </td>
                    <td style="padding: 10px 16px; color: #1f2937;">
                      <div class="enroll-row">
                        <div class="enroll-avatar" style="background:#3b82f6;">${initials(student)}</div>
                        <span>${student.last_name || ''} ${student.first_name || ''}</span>
                      </div>
                    </td>
                    <td style="padding: 12px 16px; color: #6b7280;">${e.enrollment_date || '-'}</td>
                    <td style="padding: 12px 16px; text-align: right; white-space:nowrap;">
                      <button data-action="view" data-id="${e.id}" class="enroll-iconbtn" title="មើល"><i data-lucide="eye" style="width:16px;height:16px;"></i></button>
                      <button data-action="edit" data-id="${e.id}" class="enroll-iconbtn" title="កែប្រែ"><i data-lucide="pencil" style="width:16px;height:16px;"></i></button>
                      <button data-action="remove" data-id="${e.id}" ${state.isProcessing ? 'disabled' : ''} class="enroll-iconbtn" title="ដកចេញ" style="color:#ef4444;"><i data-lucide="trash-2" style="width:16px;height:16px;"></i></button>
                    </td>
                  </tr>
                `}).join('')}
                ${enrolledPaged.items.length === 0 ? `<tr><td colspan="4" style="padding: 24px; text-align: center; color: #6b7280;">មិនទាន់មានសិស្សក្នុងថ្នាក់នេះទេ</td></tr>` : ''}
              </tbody>
            </table>
          </div>
          <div style="padding: 12px 16px;" id="enrolled-pager"></div>
        </div>

      </div>
      `}

    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root });
  }

  // Searchable selects for year/classroom
  const yearSelect = createSearchSelect({
    options: state.academicYears.map(y => ({ value: String(y.id), label: y.year_name })),
    value: state.selectedAcademicYear ? String(state.selectedAcademicYear) : '',
    placeholder: '-- ជ្រើសរើសឆ្នាំសិក្សា --',
    onChange: (v) => {
      state.selectedAcademicYear = v;
      state.selectedAvailableIds.clear();
      state.selectedEnrolledIds.clear();
      state.availablePage = 1; state.enrolledPage = 1;
      updateUI();
    }
  });
  root.querySelector('#year-select')?.appendChild(yearSelect.el);

  const classSelect = createSearchSelect({
    options: state.classrooms.map(c => ({ value: String(c.id), label: classroomLabel(c) })),
    value: state.selectedClassroom ? String(state.selectedClassroom) : '',
    placeholder: '-- ជ្រើសរើសថ្នាក់រៀន --',
    onChange: (v) => {
      state.selectedClassroom = v;
      state.selectedAvailableIds.clear();
      state.selectedEnrolledIds.clear();
      state.availablePage = 1; state.enrolledPage = 1;
      updateUI();
    }
  });
  root.querySelector('#class-select')?.appendChild(classSelect.el);

  // Pagers
  const availablePagerEl = root.querySelector('#available-pager');
  if (availablePagerEl) {
    availablePagerEl.appendChild(renderPager(availablePaged, {
      onPrev: () => { state.availablePage--; updateUI(); },
      onNext: () => { state.availablePage++; updateUI(); }
    }));
  }
  const enrolledPagerEl = root.querySelector('#enrolled-pager');
  if (enrolledPagerEl) {
    enrolledPagerEl.appendChild(renderPager(enrolledPaged, {
      onPrev: () => { state.enrolledPage--; updateUI(); },
      onNext: () => { state.enrolledPage++; updateUI(); }
    }));
  }

  // Search inputs
  const searchAvailableEl = root.querySelector('#search-available');
  if (searchAvailableEl) {
    onLiveInput(searchAvailableEl, () => {
      state.searchAvailable = searchAvailableEl.value;
      state.availablePage = 1;
      updateUI();
      // updateUI() rebuilds innerHTML and destroys the focused input -- refocus it.
      setTimeout(() => {
        const newInp = root.querySelector('#search-available');
        if (newInp) {
          newInp.focus();
          newInp.setSelectionRange(newInp.value.length, newInp.value.length);
        }
      }, 0);
    });
  }
  const searchEnrolledEl = root.querySelector('#search-enrolled');
  if (searchEnrolledEl) {
    onLiveInput(searchEnrolledEl, () => {
      state.searchEnrolled = searchEnrolledEl.value;
      state.enrolledPage = 1;
      updateUI();
      setTimeout(() => {
        const newInp = root.querySelector('#search-enrolled');
        if (newInp) {
          newInp.focus();
          newInp.setSelectionRange(newInp.value.length, newInp.value.length);
        }
      }, 0);
    });
  }

  // Filter menu
  root.querySelector('[data-action="toggle-filter-menu"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.showFilterMenu = !state.showFilterMenu;
    state.showExportMenu = false;
    updateUI();
  });
  root.querySelector('[data-f="gender-filter"]')?.addEventListener('change', (e) => {
    state.genderFilter = e.target.value;
    state.availablePage = 1;
    updateUI();
  });
  root.querySelector('[data-f="monk-filter"]')?.addEventListener('change', (e) => {
    state.monkStatusFilter = e.target.value;
    state.availablePage = 1;
    updateUI();
  });

  // Export / Telegram menu
  root.querySelector('[data-action="toggle-export-menu"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.showExportMenu = !state.showExportMenu;
    state.showFilterMenu = false;
    updateUI();
  });
  root.querySelector('[data-action="export-pdf"]')?.addEventListener('click', () => { state.showExportMenu = false; updateUI(); handleExport('pdf', enrolledList); });
  root.querySelector('[data-action="export-excel"]')?.addEventListener('click', () => { state.showExportMenu = false; updateUI(); handleExport('excel', enrolledList); });
  root.querySelector('[data-action="export-image"]')?.addEventListener('click', () => { state.showExportMenu = false; updateUI(); handleExport('image', enrolledList); });

  document.addEventListener('click', function closeMenusOnce(e) {
    if (!e.target.closest('[data-action="toggle-filter-menu"]') && !e.target.closest('[data-role="filter-panel"]')) {
      state.showFilterMenu = false;
    }
    if (!e.target.closest('[data-action="toggle-export-menu"]') && !e.target.closest('[data-role="export-panel"]')) {
      state.showExportMenu = false;
    }
  }, { once: true });

  // Single add/remove/view/edit
  root.querySelectorAll('button[data-action="add"]').forEach(btn => {
    btn.addEventListener('click', (e) => handleAdd(e.currentTarget.dataset.id));
  });
  root.querySelectorAll('button[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', (e) => handleRemove(e.currentTarget.dataset.id));
  });
  root.querySelectorAll('button[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const enrollment = state.enrollments.find(en => String(en.id) === String(e.currentTarget.dataset.id));
      const student = enrollment && state.students.find(s => String(s.id) === String(enrollment.student));
      if (enrollment && student) openViewModal(student, enrollment);
    });
  });
  root.querySelectorAll('button[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const enrollment = state.enrollments.find(en => String(en.id) === String(e.currentTarget.dataset.id));
      const student = enrollment && state.students.find(s => String(s.id) === String(enrollment.student));
      if (enrollment && student) openEditModal(student, enrollment);
    });
  });

  // Bulk selection checkboxes
  root.querySelectorAll('input[data-action="select-available"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) state.selectedAvailableIds.add(id);
      else state.selectedAvailableIds.delete(id);
      updateUI();
    });
  });
  root.querySelectorAll('input[data-action="select-enrolled"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) state.selectedEnrolledIds.add(id);
      else state.selectedEnrolledIds.delete(id);
      updateUI();
    });
  });
  root.querySelector('input[data-action="select-all-available"]')?.addEventListener('change', (e) => {
    if (e.target.checked) availableIdsOnScreen.forEach(id => state.selectedAvailableIds.add(id));
    else availableIdsOnScreen.forEach(id => state.selectedAvailableIds.delete(id));
    updateUI();
  });
  root.querySelector('input[data-action="select-all-enrolled"]')?.addEventListener('change', (e) => {
    if (e.target.checked) enrolledIdsOnScreen.forEach(id => state.selectedEnrolledIds.add(id));
    else enrolledIdsOnScreen.forEach(id => state.selectedEnrolledIds.delete(id));
    updateUI();
  });

  // Bulk actions
  root.querySelector('[data-action="bulk-add"]')?.addEventListener('click', () => {
    handleAdd(Array.from(state.selectedAvailableIds));
  });
  root.querySelector('[data-action="bulk-remove"]')?.addEventListener('click', () => {
    handleRemove(Array.from(state.selectedEnrolledIds));
  });
}
