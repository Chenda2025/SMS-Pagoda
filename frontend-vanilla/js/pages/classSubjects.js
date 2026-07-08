import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { createSearchSelect } from '../components/searchSelect.js';
import { buildStandardReportElement } from '../components/reportTemplate.js';

const ITEMS_PER_PAGE = 10;

let root = null;
let tgMenuListenerBound = false;
let state = {
  classSubjects: [],
  classrooms: [],
  subjects: [],
  teachers: [],
  loading: true,
  error: null,
  searchQuery: '',
  currentPage: 1,
  filterClassroom: '',
  filterSubject: '',
  filterTeacher: '',
  filterYear: '',
  selectedIds: new Set(),
  viewingItem: null,
  showFilterMenu: false,
  showTgMenu: false
};

// Utils
function toKhmerNumerals(num) {
  if (num === null || num === undefined) return '';
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().replace(/\d/g, d => khmerDigits[d]);
}

async function fetchData() {
  try {
    const [csRes, classRes, subRes, tRes] = await Promise.all([
      api.get('/api/class-subjects/'),
      api.get('/api/classrooms/'),
      api.get('/api/subjects/'),
      api.get('/api/users/teachers/')
    ]);

    if (!csRes.ok) throw new Error('បរាជ័យក្នុងការទាញយកទិន្នន័យ');

    state = {
      ...state,
      classSubjects: csRes.data || [],
      classrooms: classRes.ok ? (classRes.data || []).sort((a, b) => a.id - b.id) : [],
      subjects: subRes.ok ? (subRes.data || []).sort((a, b) => a.id - b.id) : [],
      teachers: tRes.ok ? (tRes.data || []) : [],
      loading: false,
      error: null
    };
  } catch (err) {
    state = { ...state, error: err.message, loading: false };
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យ', 'error');
  }
  update();
}

function openClassSubjectModal(editingItem = null) {
  const formData = editingItem ? {
    id: editingItem.id,
    classroom: editingItem.classroom ? [String(editingItem.classroom)] : [],
    subject: editingItem.subject ? [String(editingItem.subject)] : [],
    teacher: editingItem.teacher || ''
  } : {
    classroom: [],
    subject: [],
    teacher: ''
  };

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;font-family:'Battambang',sans-serif;">${editingItem ? 'កែប្រែមុខវិជ្ជាថ្នាក់' : 'ចាត់តាំងមុខវិជ្ជាថ្នាក់'}</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;font-family:'Battambang',sans-serif;"></div>
    
    <form style="display:flex;flex-direction:column;gap:16px;font-family:'Battambang',sans-serif;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្នាក់រៀន <span style="color:red">*</span></label>
        <div data-role="classroom-select"></div>
      </div>
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">មុខវិជ្ជា <span style="color:red">*</span></label>
        <div data-role="subject-select"></div>
      </div>
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">គ្រូបង្រៀន <span style="color:red">*</span></label>
        <div data-role="teacher-select"></div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">រក្សាទុក</button>
      </div>
    </form>
  `;

  const formValue = { ...formData };

  const classroomSelect = createSearchSelect({
    options: state.classrooms.map(c => ({ value: String(c.id), label: c.class_name })),
    multiple: true,
    value: formValue.classroom,
    placeholder: 'ជ្រើសរើសថ្នាក់រៀន...',
    onChange: (v) => { formValue.classroom = v; if (typeof updateDropdowns === 'function') updateDropdowns(); }
  });
  wrap.querySelector('[data-role="classroom-select"]').appendChild(classroomSelect.el);

  const subjectSelect = createSearchSelect({
    options: state.subjects.map(s => ({ value: String(s.id), label: s.subject_name })),
    multiple: true,
    value: formValue.subject,
    placeholder: 'ជ្រើសរើសមុខវិជ្ជា...',
    onChange: (v) => { formValue.subject = v; }
  });
  wrap.querySelector('[data-role="subject-select"]').appendChild(subjectSelect.el);

  const teacherSelect = createSearchSelect({
    options: state.teachers.map(t => ({ value: String(t.id), label: `${t.last_name || ''} ${t.first_name || ''}`.trim() })),
    value: String(formValue.teacher || ''),
    placeholder: 'ជ្រើសរើសគ្រូបង្រៀន...',
    onChange: (v) => { formValue.teacher = v; }
  });
  wrap.querySelector('[data-role="teacher-select"]').appendChild(teacherSelect.el);

  function updateDropdowns() {
    const selectedClassrooms = Array.isArray(formValue.classroom) ? formValue.classroom : (formValue.classroom ? [formValue.classroom] : []);
    
    if (selectedClassrooms.length === 0) {
      subjectSelect.setOptions(state.subjects.map(s => ({ value: String(s.id), label: s.subject_name })));
      teacherSelect.setOptions(state.teachers.map(t => ({ value: String(t.id), label: `${t.last_name || ''} ${t.first_name || ''}`.trim() })));
      return;
    }

    const usedSubjects = new Set();
    const usedTeachers = new Set();

    selectedClassrooms.forEach(cId => {
      state.classSubjects.forEach(cs => {
        if (String(cs.classroom) === String(cId)) {
          if (!editingItem || String(cs.id) !== String(editingItem.id)) {
            usedSubjects.add(String(cs.subject));
            usedTeachers.add(String(cs.teacher));
          }
        }
      });
    });

    subjectSelect.setOptions(state.subjects.filter(s => !usedSubjects.has(String(s.id))).map(s => ({ value: String(s.id), label: s.subject_name })));
    teacherSelect.setOptions(state.teachers.filter(t => !usedTeachers.has(String(t.id))).map(t => ({ value: String(t.id), label: `${t.last_name || ''} ${t.first_name || ''}`.trim() })));
  }

  updateDropdowns();

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());

  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
    errorBox.style.display = 'none';

    if (formValue.classroom.length === 0 || formValue.subject.length === 0 || !formValue.teacher) {
      errorBox.textContent = 'សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់';
      errorBox.style.display = 'block';
      return;
    }

    const isTaken = (classroomId, subjectId) => state.classSubjects.some(item => {
      if (editingItem && item.id === editingItem.id) return false;
      return String(item.classroom) === String(classroomId) && String(item.subject) === String(subjectId);
    });

    // Build the (classroom, subject) combinations requested.
    const combos = [];
    for (const classroomId of formValue.classroom) {
      for (const subjectId of formValue.subject) {
        combos.push({ classroom: classroomId, subject: subjectId });
      }
    }

    if (editingItem) {
      // Editing always targets a single existing record.
      const { classroom, subject } = combos[0];
      if (isTaken(classroom, subject)) {
        errorBox.textContent = 'ទិន្នន័យនេះមានរួចហើយ! មុខវិជ្ជានេះត្រូវបានចាត់តាំងសម្រាប់ថ្នាក់នេះរួចហើយ។';
        errorBox.style.display = 'block';
        return;
      }
    } else if (combos.every(c => isTaken(c.classroom, c.subject))) {
      errorBox.textContent = 'ទិន្នន័យនេះមានរួចហើយ! មុខវិជ្ជានេះត្រូវបានចាត់តាំងសម្រាប់ថ្នាក់នេះរួចហើយ។';
      errorBox.style.display = 'block';
      return;
    }

    const submitBtn = wrap.querySelector('[data-role="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite;"></i> កំពុងរក្សាទុក...';
    if (window.lucide) window.lucide.createIcons();

    try {
      if (editingItem) {
        const { classroom, subject } = combos[0];
        const res = await api.put(`/api/class-subjects/${editingItem.id}/`, { classroom, subject, teacher: formValue.teacher });
        if (!res.ok) throw new Error(res.error || 'មានបញ្ហាក្នុងការរក្សាទុក');
      } else {
        const toCreate = combos.filter(c => !isTaken(c.classroom, c.subject));
        const results = await Promise.all(toCreate.map(c => api.post('/api/class-subjects/', { ...c, teacher: formValue.teacher })));
        const failed = results.find(r => !r.ok);
        if (failed) throw new Error(failed.error || 'មានបញ្ហាក្នុងការរក្សាទុក');
      }

      showToast(editingItem ? 'បានកែប្រែដោយជោគជ័យ' : 'បានបន្ថែមដោយជោគជ័យ', 'success');
      handle.close();
      fetchData();
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'រក្សាទុក';
    }
  });

  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
}

async function handleDeleteSelected() {
  if (state.selectedIds.size === 0) return;
  if (!confirm(`តើអ្នកពិតជាចង់លុបទាំង ${state.selectedIds.size} មុខវិជ្ជាមែនទេ?`)) return;
  try {
    const ids = [...state.selectedIds];
    await Promise.all(ids.map(id => api.del(`/api/class-subjects/${id}/`)));
    showToast('បានលុបដោយជោគជ័យ', 'success');
    state.selectedIds = new Set();
    fetchData();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openViewModal(item) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;font-family:'Battambang',sans-serif;">ព័ត៌មានលម្អិត</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div style="display:grid;gap:16px;font-family:'Battambang',sans-serif;">
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #e2e8f0;">
        <div style="font-size:0.85rem;color:#64748b;margin-bottom:4px;">ថ្នាក់រៀន</div>
        <div style="font-size:1.1rem;font-weight:600;color:#1e293b;">${state.classrooms.find(c => c.id === item.classroom)?.class_name || 'មិនស្គាល់'}</div>
      </div>
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #e2e8f0;">
        <div style="font-size:0.85rem;color:#64748b;margin-bottom:4px;">មុខវិជ្ជា</div>
        <div style="font-size:1.1rem;font-weight:600;color:#1e293b;">${state.subjects.find(s => s.id === item.subject)?.subject_name || 'មិនស្គាល់'}</div>
      </div>
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #e2e8f0;">
        <div style="font-size:0.85rem;color:#64748b;margin-bottom:4px;">គ្រូបង្រៀន</div>
        <div style="font-size:1.1rem;font-weight:600;color:#1e293b;">${(() => { const t = state.teachers.find(t => t.id === item.teacher); return t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : 'មិនស្គាល់'; })()}</div>
      </div>
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #e2e8f0;">
        <div style="font-size:0.85rem;color:#64748b;margin-bottom:4px;">កាលបរិច្ឆេទបង្កើត</div>
        <div style="font-size:1.1rem;font-weight:600;color:#1e293b;">${item.created_at ? new Date(item.created_at).toLocaleDateString('km-KH') : '—'}</div>
      </div>
    </div>
  `;
  const handle = openModal(wrap);
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  if (window.lucide) window.lucide.createIcons();
}

async function handleDelete(id) {
  if (!confirm('តើអ្នកពិតជាចង់លុបមែនទេ?')) return;
  try {
    const res = await api.del(`/api/class-subjects/${id}/`);
    if (res.ok) {
      showToast('បានលុបដោយជោគជ័យ', 'success');
      fetchData();
    } else {
      throw new Error(res.error || 'មានបញ្ហាក្នុងការលុប');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function getFilteredClassSubjects() {
  let filtered = state.classSubjects;
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(item => {
      const cls = state.classrooms.find(c => c.id === item.classroom)?.class_name?.toLowerCase() || '';
      const sub = state.subjects.find(s => s.id === item.subject)?.subject_name?.toLowerCase() || '';
      const tch = state.teachers.find(t => t.id === item.teacher);
      const tchName = tch ? `${tch.last_name || ''} ${tch.first_name || ''}`.trim().toLowerCase() : '';
      return cls.includes(q) || sub.includes(q) || tchName.includes(q);
    });
  }
  if (state.filterClassroom) filtered = filtered.filter(item => String(item.classroom) === state.filterClassroom);
  if (state.filterSubject) filtered = filtered.filter(item => String(item.subject) === state.filterSubject);
  if (state.filterTeacher) filtered = filtered.filter(item => String(item.teacher) === state.filterTeacher);
  if (state.filterYear) filtered = filtered.filter(item => item.created_at && String(new Date(item.created_at).getFullYear()) === state.filterYear);
  return filtered;
}

function openTelegramConfigModal() {
  const existing = JSON.parse(localStorage.getItem('tgConfig') || '{}');

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;font-family:'Battambang',sans-serif;">ការកំណត់ Telegram Bot</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;font-family:'Battambang',sans-serif;"></div>
    <form style="display:flex;flex-direction:column;gap:16px;font-family:'Battambang',sans-serif;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Bot Token <span style="color:red">*</span></label>
        <input type="text" data-f="token" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Chat ID <span style="color:red">*</span></label>
        <input type="text" data-f="chatId" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-family:'Battambang',sans-serif;">រក្សាទុក</button>
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

function buildClassSubjectsReportElement() {
  const list = getFilteredClassSubjects();
  
  // Group by Teacher
  const grouped = {};
  list.forEach(item => {
    const key = `${item.teacher}`; // group by teacher
    if (!grouped[key]) {
      grouped[key] = {
        teacher: item.teacher,
        subjects: []
      };
    }
    const sub = state.subjects.find(x => String(x.id) === String(item.subject));
    if (sub) grouped[key].subjects.push(sub);
  });
  const groupedList = Object.values(grouped);
  
  const tableNode = document.createElement('table');
  tableNode.innerHTML = `
    <thead>
      <tr style="background:#f8fafc;border-bottom:2px solid var(--border);text-align:left;">
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ល.រ</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">គ្រូបង្រៀន</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">មុខវិជ្ជា</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ម៉ោងសរុប</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ពិន្ទុសរុប</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ការងារផ្ទះសរុប</th>
      </tr>
    </thead>
    <tbody>
      ${groupedList.map((g, i) => {
        const teacher = state.teachers.find(t => String(t.id) === String(g.teacher));
        const tName = teacher ? `${teacher.last_name || ''} ${teacher.first_name || ''}`.trim() : '---';
        const sName = g.subjects.length > 0 ? g.subjects.map(s => s.subject_name).join(' / ') : '---';
        const totalHours = g.subjects.length > 0 ? g.subjects.map(s => s.total_hours || 0).join(' / ') : '---';
        const totalScore = g.subjects.length > 0 ? g.subjects.map(s => s.total_score || 0).join(' / ') : '---';
        const totalHomework = g.subjects.length > 0 ? g.subjects.map(s => s.total_homework || 0).join(' / ') : '---';
        return `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:16px;color:var(--text-primary);font-weight:500;">${toKhmerNumerals(i + 1)}</td>
          <td style="padding:16px;color:var(--text-primary);">${tName}</td>
          <td style="padding:16px;color:var(--text-primary);font-weight:500;">${sName}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(totalHours)}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(totalScore)}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(totalHomework)}</td>
        </tr>
        `;
      }).join('')}
    </tbody>
    <tfoot>
      <tr style="background:#f8fafc;font-weight:700;border-top:2px solid #e2e8f0;">
        <td colspan="3" style="padding:16px;text-align:right;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">សរុបការចាត់តាំង: ${toKhmerNumerals(list.length)}</td>
        <td style="padding:16px;color:var(--primary);font-size:1.05rem;">${toKhmerNumerals(list.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_hours) || 0 : 0); }, 0))}</td>
        <td style="padding:16px;color:var(--primary);font-size:1.05rem;">${toKhmerNumerals(list.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_score) || 0 : 0); }, 0))}</td>
        <td style="padding:16px;color:var(--primary);font-size:1.05rem;">${toKhmerNumerals(list.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_homework) || 0 : 0); }, 0))}</td>
      </tr>
    </tfoot>
  `;

  const title = 'បញ្ជីការកំណត់មុខវិជ្ជា';
  return buildStandardReportElement(title, tableNode);
}

async function captureReportImage(reportEl) {
  const clone = reportEl.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  document.body.appendChild(clone);
  try {
    const canvas = await html2canvas(clone, { backgroundColor: '#ffffff', scale: 2, useCORS: true, logging: false });
    return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  } finally {
    document.body.removeChild(clone);
  }
}

async function getPdfBlob(reportEl) {
  return await html2pdf().set({ margin: 5, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(reportEl).outputPdf('blob');
}

function getExcelBlob() {
  const items = getFilteredClassSubjects();
  
  const grouped = {};
  items.forEach(item => {
    const key = `${item.teacher}`;
    if (!grouped[key]) {
      grouped[key] = {
        teacher: item.teacher,
        subjects: []
      };
    }
    const sub = state.subjects.find(x => String(x.id) === String(item.subject));
    if (sub) grouped[key].subjects.push(sub);
  });
  const groupedList = Object.values(grouped);
  
  const wsData = groupedList.map((g, i) => {
    return {
      'ល.រ': i + 1,
      'គ្រូបង្រៀន': getTeacherNameById(g.teacher),
      'មុខវិជ្ជា': g.subjects.length > 0 ? g.subjects.map(s => s.subject_name).join(' / ') : '---',
      'ម៉ោងសរុប': g.subjects.length > 0 ? g.subjects.map(s => s.total_hours || 0).join(' / ') : '---',
      'ពិន្ទុសរុប': g.subjects.length > 0 ? g.subjects.map(s => s.total_score || 0).join(' / ') : '---',
      'ការងារផ្ទះសរុប': g.subjects.length > 0 ? g.subjects.map(s => s.total_homework || 0).join(' / ') : '---'
    };
  });
  
  if (items.length > 0) {
    wsData.push({
      'ល.រ': 'សរុប',
      'គ្រូបង្រៀន': `${items.length} ការចាត់តាំង`,
      'មុខវិជ្ជា': '',
      'ម៉ោងសរុប': items.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_hours) || 0 : 0); }, 0),
      'ពិន្ទុសរុប': items.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_score) || 0 : 0); }, 0),
      'ការងារផ្ទះសរុប': items.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_homework) || 0 : 0); }, 0)
    });
  }
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ClassSubjects');
  const arrayBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([arrayBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

function getClassNameById(id) {
  return state.classrooms.find(c => c.id === id)?.class_name || 'មិនស្គាល់';
}
function getSubjectNameById(id) {
  return state.subjects.find(s => s.id === id)?.subject_name || 'មិនស្គាល់';
}
function getTeacherNameById(id) {
  const t = state.teachers.find(t => t.id === id);
  return t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : 'មិនស្គាល់';
}

async function sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig }) {
  const fd = new FormData();
  fd.append('chat_id', tgConfig.chatId);
  fd.append(isPhoto ? 'photo' : 'document', blob, filename);
  if (caption) fd.append('caption', caption);
  const endpoint = isPhoto ? 'sendPhoto' : 'sendDocument';
  const res = await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/${endpoint}`, { method: 'POST', body: fd });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.description || `telegram-send-failed (HTTP ${res.status})`);
  }
}

async function handleSendTelegram(kind) {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  const btn = root.querySelector('[data-action="toggle-tg-menu"]');
  if (btn) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite;"></i> កំពុងផ្ញើ...';
    if (window.lucide) window.lucide.createIcons();
  }

  try {
    const reportEl = buildClassSubjectsReportElement();
    const caption = `📚 បញ្ជីការកំណត់មុខវិជ្ជា (សរុប ${getFilteredClassSubjects().length})`;
    let blob, filename, isPhoto = false;
    if (kind === 'image') { blob = await captureReportImage(reportEl); filename = 'class-subjects.png'; isPhoto = true; }
    else if (kind === 'pdf') { blob = await getPdfBlob(reportEl); filename = 'class-subjects.pdf'; }
    else if (kind === 'excel') { blob = getExcelBlob(); filename = 'class-subjects.xlsx'; }

    await sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig });
    showToast('បានផ្ញើទិន្នន័យចូល Telegram ដោយជោគជ័យ', 'success');
  } catch (err) {
    console.error(err);
    showToast(`បរាជ័យក្នុងការផ្ញើចូល Telegram៖ ${err.message}`, 'error');
  } finally {
    const refreshedBtn = root.querySelector('[data-action="toggle-tg-menu"]');
    if (refreshedBtn) { refreshedBtn.disabled = false; refreshedBtn.innerHTML = refreshedBtn.dataset.originalHtml || refreshedBtn.innerHTML; }
    if (window.lucide) window.lucide.createIcons();
  }
}

export function render(container) {
  root = container;
  state = { classSubjects: [], classrooms: [], subjects: [], teachers: [], loading: true, error: null, searchQuery: '', currentPage: 1, filterClassroom: '', filterSubject: '', filterTeacher: '', filterYear: '', selectedIds: new Set(), viewingItem: null, showFilterMenu: false, showTgMenu: false };
  update();
  fetchData();
}

export function destroy() {
  root = null;
}

function update() {
  if (!root) return;

  if (state.loading && state.classSubjects.length === 0) {
    root.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-secondary);font-family:'Battambang',sans-serif;">កំពុងទាញយកទិន្នន័យ...</div>`;
    return;
  }

  if (state.error) {
    root.innerHTML = `<div style="padding:40px;text-align:center;color:#ef4444;font-family:'Battambang',sans-serif;">${state.error}</div>`;
    return;
  }

  const filtered = getFilteredClassSubjects();

  const yearOptions = [...new Set(state.classSubjects.filter(i => i.created_at).map(i => new Date(i.created_at).getFullYear()))].sort((a, b) => b - a);
  const activeFilterCount = [state.filterClassroom, state.filterSubject, state.filterTeacher, state.filterYear].filter(Boolean).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getClassName = id => state.classrooms.find(c => c.id === id)?.class_name || 'មិនស្គាល់';
  const getSubjectName = id => state.subjects.find(s => s.id === id)?.subject_name || 'មិនស្គាល់';
  const getTeacherName = id => {
    const t = state.teachers.find(t => t.id === id);
    return t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : 'មិនស្គាល់';
  };

  root.innerHTML = `
    <div style="max-width:1200px;margin:0 auto;font-family:'Battambang',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:16px;">
        <h1 style="font-size:1.5rem;font-weight:bold;margin:0;color:#1e3a8a;font-family:'Moul',cursive;">ការកំណត់មុខវិជ្ជា</h1>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="position:relative;" onmouseenter="this.querySelector('#tg-menu').style.display='block'" onmouseleave="this.querySelector('#tg-menu').style.display='none'">
            <button type="button"  style="display:flex;align-items:center;gap:7px;background:#0088cc;color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:500;"><i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>
            <div id="tg-menu" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:180px;overflow:hidden;"
                <button data-action="tg-send-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:#1e293b;font-weight:500;font-size:0.875rem;font-family:'Battambang',sans-serif;"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> PDF (.pdf)</button>
                <button data-action="tg-send-excel" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:#1e293b;font-weight:500;font-size:0.875rem;font-family:'Battambang',sans-serif;"><i data-lucide="file-spreadsheet" style="width:16px;height:16px;color:#16a34a;"></i> Excel (.xlsx)</button>
                <button data-action="tg-send-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:#1e293b;font-weight:500;font-size:0.875rem;font-family:'Battambang',sans-serif;"><i data-lucide="image" style="width:16px;height:16px;color:#a855f7;"></i> Image (.png)</button>
              </div>
          </div>
          <button id="cs-add-btn" style="display:flex;align-items:center;gap:8px;background:var(--primary);color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:500;">
            <i data-lucide="plus" style="width:18px;height:18px;"></i>
            ចាត់តាំងមុខវិជ្ជាថ្មី
          </button>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px;">
        <div style="flex:1;min-width:220px;position:relative;">
          <i data-lucide="search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#9ca3af;"></i>
          <input type="text" id="cs-search" value="${state.searchQuery}" placeholder="ស្វែងរក..." style="width:100%;padding:10px 10px 10px 36px;border-radius:8px;border:1px solid #d1d5db;outline:none;" />
        </div>
        <div style="position:relative;">
          <button type="button" data-action="toggle-filter-menu" style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:8px;border:1px solid #d1d5db;background:white;cursor:pointer;font-weight:500;color:#334155;">
            <i data-lucide="filter" style="width:16px;height:16px;"></i> ត្រង
            ${activeFilterCount > 0 ? `<span style="background:var(--primary);color:#fff;border-radius:999px;width:18px;height:18px;font-size:0.7rem;display:flex;align-items:center;justify-content:center;">${toKhmerNumerals(activeFilterCount)}</span>` : ''}
          </button>
          ${state.showFilterMenu ? `
            <div id="cs-filter-panel" style="position:fixed;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:4000;min-width:240px;padding:16px;display:flex;flex-direction:column;gap:14px;">
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:#64748b;">ថ្នាក់រៀន</label>
                <div data-role="filter-classroom-select"></div>
              </div>
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:#64748b;">មុខវិជ្ជា</label>
                <div data-role="filter-subject-select"></div>
              </div>
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:#64748b;">គ្រូបង្រៀន</label>
                <div data-role="filter-teacher-select"></div>
              </div>
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:#64748b;">ឆ្នាំ</label>
                <div data-role="filter-year-select"></div>
              </div>
              ${activeFilterCount > 0 ? `<button type="button" data-action="clear-filters" style="background:none;border:none;color:var(--primary);font-weight:600;cursor:pointer;padding:4px 0;text-align:left;">សម្អាតតម្រង</button>` : ''}
            </div>
          ` : ''}
        </div>
      </div>

      ${state.selectedIds.size > 0 ? `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 20px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin-bottom:16px;">
          <span style="font-weight:600;color:#ef4444;">បានជ្រើស ${toKhmerNumerals(state.selectedIds.size)} មុខវិជ្ជា</span>
          <button id="cs-delete-selected" style="display:flex;align-items:center;gap:6px;background:#ef4444;color:white;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-weight:500;">
            <i data-lucide="trash-2" style="width:16px;height:16px;"></i> លុបទាំងអស់
          </button>
        </div>

      ` : ''}
      <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;">
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;min-width:700px;">
            <thead>
              <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0;text-align:left;">
                <th style="padding:16px;width:40px;"><input type="checkbox" id="cs-select-all" ${currentItems.length > 0 && currentItems.every(i => state.selectedIds.has(i.id)) ? 'checked' : ''} /></th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">ល.រ</th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">ថ្នាក់រៀន</th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">មុខវិជ្ជា</th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">គ្រូបង្រៀន</th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">ម៉ោងសរុប</th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">ពិន្ទុសរុប</th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">ការងារផ្ទះ</th>
                <th style="padding:16px;font-weight:600;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;text-align:right;">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              ${currentItems.length > 0 ? currentItems.map((item, idx) => {
                const sub = state.subjects.find(s => String(s.id) === String(item.subject));
                const totalHours = sub ? sub.total_hours : '---';
                const totalScore = sub ? sub.total_score : '---';
                const totalHomework = sub ? sub.total_homework : '---';
                return `
                <tr style="border-bottom:1px solid #e2e8f0;transition:background 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='white'">
                  <td style="padding:16px;"><input type="checkbox" class="cs-row-check" data-id="${item.id}" ${state.selectedIds.has(item.id) ? 'checked' : ''} /></td>
                  <td style="padding:16px;color:#1e293b;">${toKhmerNumerals(startIndex + idx + 1)}</td>
                  <td style="padding:16px;color:#1e293b;font-weight:500;">${getClassName(item.classroom)}</td>
                  <td style="padding:16px;color:#1e293b;">${getSubjectName(item.subject)}</td>
                  <td style="padding:16px;color:#1e293b;">${getTeacherName(item.teacher)}</td>
                  <td style="padding:16px;color:#1e293b;">${toKhmerNumerals(totalHours)}</td>
                  <td style="padding:16px;color:#1e293b;">${toKhmerNumerals(totalScore)}</td>
                  <td style="padding:16px;color:#1e293b;">${toKhmerNumerals(totalHomework)}</td>
                  <td style="padding:16px;text-align:right;">
                    <button class="cs-view-btn" data-id="${item.id}" style="background:none;border:none;cursor:pointer;color:#64748b;padding:4px;margin-right:8px;" title="មើល">
                      <i data-lucide="eye" style="width:18px;height:18px;"></i>
                    </button>
                    <button class="cs-edit-btn" data-id="${item.id}" style="background:none;border:none;cursor:pointer;color:#2563eb;padding:4px;margin-right:8px;" title="កែប្រែ">
                      <i data-lucide="edit" style="width:18px;height:18px;"></i>
                    </button>
                    <button class="cs-del-btn" data-id="${item.id}" style="background:none;border:none;cursor:pointer;color:#ef4444;padding:4px;" title="លុប">
                      <i data-lucide="trash-2" style="width:18px;height:18px;"></i>
                    </button>
                  </td>
                </tr>
                `;
              }).join('') : `
                <tr><td colspan="9" style="padding:40px;text-align:center;color:#64748b;">មិនមានទិន្នន័យ</td></tr>
              `}
            </tbody>
            ${filtered.length > 0 ? `
              <tfoot>
                <tr style="background:#f8fafc;font-weight:700;border-top:2px solid #e2e8f0;">
                  <td colspan="4" style="padding:16px;text-align:right;color:#475569;font-family:'Moul',cursive;font-size:0.9rem;">សរុបការចាត់តាំង: ${toKhmerNumerals(filtered.length)}</td>
                  <td style="padding:16px;color:var(--primary);font-size:1.05rem;">${toKhmerNumerals(filtered.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_hours) || 0 : 0); }, 0))}</td>
                  <td style="padding:16px;color:var(--primary);font-size:1.05rem;">${toKhmerNumerals(filtered.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_score) || 0 : 0); }, 0))}</td>
                  <td style="padding:16px;color:var(--primary);font-size:1.05rem;">${toKhmerNumerals(filtered.reduce((sum, s) => { const sub = state.subjects.find(x => String(x.id) === String(s.subject)); return sum + (sub ? Number(sub.total_homework) || 0 : 0); }, 0))}</td>
                  <td style="padding:16px;"></td>
                </tr>
              </tfoot>
            ` : ''}
          </table>
        </div>

        <!-- Pagination -->
        ${totalPages > 1 ? `
          <div style="padding:16px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
            <div style="color:#64748b;font-size:0.875rem;">
              បង្ហាញទី ${toKhmerNumerals(startIndex + 1)} ដល់ ${toKhmerNumerals(Math.min(startIndex + ITEMS_PER_PAGE, filtered.length))} នៃ ${toKhmerNumerals(filtered.length)}
            </div>
            <div style="display:flex;gap:4px;align-items:center;">
              <button id="cs-prev-page" ${state.currentPage === 1 ? 'disabled' : ''} style="padding:6px 10px;border:1px solid #e2e8f0;background:${state.currentPage === 1 ? '#f8fafc' : 'white'};color:${state.currentPage === 1 ? '#94a3b8' : '#334155'};border-radius:6px;cursor:${state.currentPage === 1 ? 'not-allowed' : 'pointer'};"><i data-lucide="chevron-left" style="width:16px;height:16px"></i></button>
              ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `<button class="cs-page-btn" data-page="${p}" style="width:32px;height:32px;border-radius:6px;border:1px solid ${state.currentPage === p ? 'var(--primary)' : '#e2e8f0'};background:${state.currentPage === p ? 'var(--primary)' : 'white'};color:${state.currentPage === p ? '#fff' : '#334155'};font-weight:600;font-size:0.85rem;cursor:pointer;">${toKhmerNumerals(p)}</button>`).join('')}
              <button id="cs-next-page" ${state.currentPage === totalPages ? 'disabled' : ''} style="padding:6px 10px;border:1px solid #e2e8f0;background:${state.currentPage === totalPages ? '#f8fafc' : 'white'};color:${state.currentPage === totalPages ? '#94a3b8' : '#334155'};border-radius:6px;cursor:${state.currentPage === totalPages ? 'not-allowed' : 'pointer'};"><i data-lucide="chevron-right" style="width:16px;height:16px"></i></button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const searchInput = root.querySelector('#cs-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      update();
      // Refocus input
      const newSearchInput = root.querySelector('#cs-search');
      if (newSearchInput) {
        newSearchInput.focus();
        newSearchInput.setSelectionRange(newSearchInput.value.length, newSearchInput.value.length);
      }
    });
  }

  const addBtn = root.querySelector('#cs-add-btn');
  if (addBtn) addBtn.addEventListener('click', () => openClassSubjectModal());

  root.querySelector('[data-action="toggle-tg-menu"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = !state.showTgMenu; update(); });
  if (!tgMenuListenerBound) {
    tgMenuListenerBound = true;
    document.addEventListener('click', (e) => {
      if (state.showTgMenu && !e.target.closest('[data-action="toggle-tg-menu"]') && !e.target.closest('[data-action^="tg-send-"]')) {
        state.showTgMenu = false;
        update();
      }
    });
  }
  root.querySelector('[data-action="tg-send-pdf"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('pdf'); });
  root.querySelector('[data-action="tg-send-excel"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('excel'); });
  root.querySelector('[data-action="tg-send-image"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('image'); });

  root.querySelector('[data-action="toggle-filter-menu"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showFilterMenu = !state.showFilterMenu; update(); });

  const filterClassroomMount = root.querySelector('[data-role="filter-classroom-select"]');
  if (filterClassroomMount) {
    const filterClassroomSelect = createSearchSelect({
      options: state.classrooms.map(c => ({ value: String(c.id), label: c.class_name })),
      value: state.filterClassroom,
      placeholder: 'ទាំងអស់',
      onChange: (v) => { state.filterClassroom = v; state.currentPage = 1; update(); }
    });
    filterClassroomMount.appendChild(filterClassroomSelect.el);
  }

  const filterSubjectMount = root.querySelector('[data-role="filter-subject-select"]');
  if (filterSubjectMount) {
    const filterSubjectSelect = createSearchSelect({
      options: state.subjects.map(s => ({ value: String(s.id), label: s.subject_name })),
      value: state.filterSubject,
      placeholder: 'ទាំងអស់',
      onChange: (v) => { state.filterSubject = v; state.currentPage = 1; update(); }
    });
    filterSubjectMount.appendChild(filterSubjectSelect.el);
  }

  const filterTeacherMount = root.querySelector('[data-role="filter-teacher-select"]');
  if (filterTeacherMount) {
    const filterTeacherSelect = createSearchSelect({
      options: state.teachers.map(t => ({ value: String(t.id), label: `${t.last_name || ''} ${t.first_name || ''}`.trim() })),
      value: state.filterTeacher,
      placeholder: 'ទាំងអស់',
      onChange: (v) => { state.filterTeacher = v; state.currentPage = 1; update(); }
    });
    filterTeacherMount.appendChild(filterTeacherSelect.el);
  }

  const filterYearMount = root.querySelector('[data-role="filter-year-select"]');
  if (filterYearMount) {
    const filterYearSelect = createSearchSelect({
      options: yearOptions.map(y => ({ value: String(y), label: toKhmerNumerals(y) })),
      value: state.filterYear,
      placeholder: 'ទាំងអស់',
      onChange: (v) => { state.filterYear = v; state.currentPage = 1; update(); }
    });
    filterYearMount.appendChild(filterYearSelect.el);
  }

  root.querySelector('[data-action="clear-filters"]')?.addEventListener('click', () => {
    state.filterClassroom = '';
    state.filterSubject = '';
    state.filterTeacher = '';
    state.filterYear = '';
    state.currentPage = 1;
    update();
  });

  // Same clipping issue as createSearchSelect's dropdown: .content-area has
  // overflow-y:auto, which would clip this absolutely-positioned panel if
  // left inside `root`. Portal it to document.body, fixed-positioned from
  // the toggle button's rect.
  //
  // Every re-render while the menu is open recreates this node fresh inside
  // `root` (root.innerHTML), then reparents it to body -- but root.innerHTML
  // on the *next* render only touches root's own children, so the node we
  // already moved out to body is never cleaned up on its own. Remove any
  // such leftover(s) first, or they silently stack up (invisible, but with
  // z-index 4000) and eventually intercept clicks meant for page content.
  document.querySelectorAll('#cs-filter-panel').forEach(el => { if (!root.contains(el)) el.remove(); });

  const filterPanel = root.querySelector('#cs-filter-panel');
  if (filterPanel) {
    const toggleBtn = root.querySelector('[data-action="toggle-filter-menu"]');
    const rect = toggleBtn.getBoundingClientRect();
    filterPanel.style.top = `${rect.bottom + 8}px`;
    filterPanel.style.right = `${window.innerWidth - rect.right}px`;
    filterPanel.style.left = 'auto';
    document.body.appendChild(filterPanel);
  }

  if (state.showFilterMenu) {
    setTimeout(() => {
      document.addEventListener('click', function closeFilterMenu(e) {
        if (!e.target.closest('[data-action="toggle-filter-menu"]') && 
            !e.target.closest('#cs-filter-panel') &&
            !e.target.closest('.search-select-dropdown')) {
          state.showFilterMenu = false;
          update();
          document.removeEventListener('click', closeFilterMenu);
        }
      });
    }, 0);
    const closeOnViewportChange = () => { state.showFilterMenu = false; update(); };
    window.addEventListener('scroll', closeOnViewportChange, { capture: true, once: true });
    window.addEventListener('resize', closeOnViewportChange, { once: true });
  }

  const selectAllCheckbox = root.querySelector('#cs-select-all');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      currentItems.forEach(item => {
        if (e.target.checked) state.selectedIds.add(item.id);
        else state.selectedIds.delete(item.id);
      });
      update();
    });
  }

  root.querySelectorAll('.cs-row-check').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = parseInt(cb.getAttribute('data-id'), 10);
      if (e.target.checked) state.selectedIds.add(id);
      else state.selectedIds.delete(id);
      update();
    });
  });

  const deleteSelectedBtn = root.querySelector('#cs-delete-selected');
  if (deleteSelectedBtn) deleteSelectedBtn.addEventListener('click', () => handleDeleteSelected());

  root.querySelectorAll('.cs-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const item = state.classSubjects.find(i => i.id === id);
      if (item) openViewModal(item);
    });
  });

  root.querySelectorAll('.cs-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const item = state.classSubjects.find(i => i.id === id);
      if (item) openClassSubjectModal(item);
    });
  });

  root.querySelectorAll('.cs-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      handleDelete(id);
    });
  });

  const prevBtn = root.querySelector('#cs-prev-page');
  if (prevBtn && !prevBtn.disabled) {
    prevBtn.addEventListener('click', () => { state.currentPage--; update(); });
  }

  const nextBtn = root.querySelector('#cs-next-page');
  if (nextBtn && !nextBtn.disabled) {
    nextBtn.addEventListener('click', () => { state.currentPage++; update(); });
  }

  root.querySelectorAll('.cs-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentPage = parseInt(btn.getAttribute('data-page'), 10);
      update();
    });
  });
}
