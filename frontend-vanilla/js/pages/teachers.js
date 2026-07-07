import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { api } from '../api.js';
import { buildStandardReportElement } from '../components/reportTemplate.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { onLiveInput } from '../utils/dom.js';

let root = null;
let state = {
  showTgMenu: false,
  showFilterMenu: false,
  selectedTeachers: new Set(),
  currentYearName: '',
  teachers: [],
  loading: true,
  error: null,
  searchQuery: '',
  monkStatusFilter: 'All',
  statusFilter: 'All',
  sortOrder: 'newest',
  currentPage: 1,
  itemsPerPage: 10
};

// --- Filtering ---

function getFilteredTeachers() {
  const { teachers, searchQuery, monkStatusFilter, statusFilter, sortOrder } = state;
  const filtered = teachers.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!String(t.first_name || '').toLowerCase().includes(q) &&
        !String(t.last_name || '').toLowerCase().includes(q) &&
        !String(t.phone || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    if (monkStatusFilter && monkStatusFilter !== 'All' && t.monk_status !== monkStatusFilter) return false;
    if (statusFilter && statusFilter !== 'All' && t.status !== statusFilter) return false;
    return true;
  });

  const getTime = (t) => {
    const v = t.created_at || t.start_date;
    const ms = v ? new Date(v).getTime() : NaN;
    return Number.isNaN(ms) ? (t.id || 0) : ms;
  };
  filtered.sort((a, b) => sortOrder === 'oldest' ? getTime(a) - getTime(b) : getTime(b) - getTime(a));

  return filtered;
}

// --- API Calls ---

async function fetchTeachers() {
  state.loading = true;
  update();
  try {
    const [res, yearsRes] = await Promise.all([
      api.get('/api/users/teachers/'),
      api.get('/api/academic-years/')
    ]);
    if (!res.ok) throw new Error('បរាជ័យក្នុងការទាញយកបញ្ជីគ្រូបង្រៀន');

    let currentYearName = '';
    if (yearsRes.ok && Array.isArray(yearsRes.data)) {
      const currentYear = yearsRes.data.find(y => y.is_current);
      if (currentYear) currentYearName = currentYear.year_name;
    }

    state.teachers = res.data || [];
    state.currentYearName = currentYearName;
    state.error = null;
  } catch (err) {
    state.error = err.message;
    showToast(err.message, 'error');
  } finally {
    state.loading = false;
    update();
  }
}

// --- Modals ---

function openTeacherModal(editingTeacher = null) {
  const formData = editingTeacher ? { ...editingTeacher } : {
    first_name: '', last_name: '', latin_name: '',
    gender: 'ប្រុស', monk_status: '', phone: '',
    start_date: '', status: 'active',
    image_url: null
  };

  const wrap = document.createElement('div');
  wrap.style.width = '100%';

  function renderForm() {
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;">
        <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">${editingTeacher ? 'កែប្រែព័ត៌មានគ្រូ' : 'បន្ថែមគ្រូបង្រៀនថ្មី'}</h2>
        <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
      </div>
      <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>

      <form style="display:flex;flex-direction:column;gap:20px;">

        <div style="display:flex;justify-content:center;">
          <div style="position:relative;width:110px;height:110px;border-radius:50%;overflow:hidden;border:2px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;background:#f8fafc;cursor:pointer;" id="photo-upload-container">
            ${formData.image_url ? `<img src="${formData.image_url}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="text-align:center;color:#94a3b8;"><i data-lucide="camera" style="width:28px;height:28px;"></i><div style="font-size:0.7rem;margin-top:4px;">រូបថត</div></div>`}
            <input type="file" id="photo-input" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;" />
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:16px;padding:20px;">
          <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">
            <i data-lucide="user" style="width:16px;height:16px;color:var(--primary);"></i> ព័ត៌មានផ្ទាល់ខ្លួន
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">នាមត្រកូល <span style="color:red">*</span></label>
                <input type="text" data-f="last_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.last_name || ''}" required />
              </div>
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">នាមខ្លួន <span style="color:red">*</span></label>
                <input type="text" data-f="first_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.first_name || ''}" required />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះឡាតាំង</label>
                <input type="text" data-f="latin_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.latin_name || ''}" />
              </div>
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ភេទ <span style="color:red">*</span></label>
                <select data-f="gender" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;">
                  <option value="ប្រុស" ${formData.gender === 'ប្រុស' ? 'selected' : ''}>ប្រុស</option>
                  <option value="ស្រី" ${formData.gender === 'ស្រី' ? 'selected' : ''}>ស្រី</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:16px;padding:20px;">
          <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">
            <i data-lucide="briefcase" style="width:16px;height:16px;color:var(--primary);"></i> ព័ត៌មានទំនាក់ទំនង &amp; ការងារ
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">កូដគ្រូ (Teacher Code)</label>
                <input type="text" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;background:#f3f4f6;color:#6b7280;cursor:not-allowed;" value="${formData.teacher_code || 'បង្កើតដោយស្វ័យប្រវត្តិ'}" readonly disabled />
              </div>
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">លេខទូរស័ព្ទ <span style="color:red">*</span></label>
                <input type="text" data-f="phone" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.phone || ''}" required />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឋានៈ <span style="color:red">*</span></label>
                <select data-f="monk_status" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required>
                  <option value="">-- ជ្រើសរើស --</option>
                  <option value="គ្រហស្ថ" ${formData.monk_status === 'គ្រហស្ថ' ? 'selected' : ''}>គ្រហស្ថ</option>
                  <option value="សាមណេរ" ${formData.monk_status === 'សាមណេរ' ? 'selected' : ''}>សាមណេរ</option>
                  <option value="ភិក្ខុ" ${formData.monk_status === 'ភិក្ខុ' ? 'selected' : ''}>ភិក្ខុ</option>
                  <option value="ដូនជី" ${formData.monk_status === 'ដូនជី' ? 'selected' : ''}>ដូនជី</option>
                </select>
              </div>
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃចូលបម្រើការ</label>
                <input type="date" data-f="start_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.start_date || ''}" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:16px;">
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ស្ថានភាព</label>
                <select data-f="status" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;">
                  <option value="active" ${formData.status === 'active' ? 'selected' : ''}>កំពុងបង្រៀន</option>
                  <option value="inactive" ${formData.status === 'inactive' ? 'selected' : ''}>ឈប់បង្រៀន</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:4px;border-top:1px solid #e5e7eb;padding-top:20px;">
          <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
          <button type="submit" data-role="submit" style="padding:10px 24px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">${editingTeacher ? 'កែប្រែ' : 'រក្សាទុក'}</button>
        </div>
      </form>
    `;

    if (window.lucide) window.lucide.createIcons({ root: wrap });

    wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
    wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());

    // Handle Image Upload using FormData for multipart/form-data
    let selectedFile = null;
    wrap.querySelector('#photo-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          const container = wrap.querySelector('#photo-upload-container');
          container.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;" /><input type="file" id="photo-input" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;" />`;
          // Re-attach listener
          container.querySelector('#photo-input').addEventListener('change', arguments.callee);
        };
        reader.readAsDataURL(file);
      }
    });

    wrap.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const updateFormFromDOM = () => {
        ['first_name', 'last_name', 'latin_name', 'gender', 'monk_status', 'phone', 'start_date', 'status'].forEach(k => {
          const el = wrap.querySelector(`[data-f="${k}"]`);
          if (el) formData[k] = el.value;
        });
      };
      updateFormFromDOM();

      const errorBox = wrap.querySelector('[data-role="form-error"]');
      errorBox.style.display = 'none';

      // Duplicate check: name, sex, phone
      const isDuplicate = state.teachers.some(t =>
        t.first_name.trim().toLowerCase() === formData.first_name.trim().toLowerCase() &&
        t.last_name.trim().toLowerCase() === formData.last_name.trim().toLowerCase() &&
        t.gender === formData.gender &&
        (t.phone || '').trim() === (formData.phone || '').trim() &&
        (!editingTeacher || String(t.id) !== String(editingTeacher.id))
      );

      if (isDuplicate) {
        errorBox.textContent = 'ទិន្នន័យគ្រូបង្រៀននេះ (ឈ្មោះ ភេទ និងលេខទូរស័ព្ទ) មានរួចហើយ! សូមពិនិត្យឡើងវិញ។';
        errorBox.style.display = 'block';
        return;
      }

      const submitBtn = wrap.querySelector('[data-role="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'កំពុងរក្សាទុក...';

      try {
        const payload = new FormData();
        payload.append('first_name', formData.first_name);
        payload.append('last_name', formData.last_name);
        payload.append('latin_name', formData.latin_name || '');
        payload.append('gender', formData.gender);
        payload.append('monk_status', formData.monk_status);
        payload.append('phone', formData.phone);
        if (formData.start_date) payload.append('start_date', formData.start_date);
        payload.append('status', formData.status);

        if (selectedFile) {
          payload.append('image_url', selectedFile); // Assuming the field name for image is image_url
        }

        const url = editingTeacher ? `/api/users/teachers/${editingTeacher.id}/` : '/api/users/teachers/';
        const method = editingTeacher ? 'PATCH' : 'POST';

        // We use fetch directly to handle FormData, as our api.post uses JSON by default
        const token = localStorage.getItem('access_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(url, {
          method,
          headers,
          body: payload
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || JSON.stringify(data) || 'បរាជ័យក្នុងការរក្សាទុក');
        }

        showToast(`បាន${editingTeacher ? 'កែប្រែ' : 'បន្ថែម'}គ្រូដោយជោគជ័យ`, 'success');
        handle.close();
        fetchTeachers();
      } catch (err) {
        errorBox.textContent = err.message;
        errorBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = `${editingTeacher ? 'កែប្រែ' : 'រក្សាទុក'}`;
      }
    });
  }

  renderForm();
  const handle = openModal(wrap);
}


function openTeacherViewModal(teacher) {
  const wrap = document.createElement('div');
  wrap.style.margin = '-28px -32px';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';

  wrap.innerHTML = `
    <div style="padding:24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;border-top-left-radius:20px;border-top-right-radius:20px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:56px;height:56px;border-radius:50%;overflow:hidden;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${teacher.image_url ? `<img src="${teacher.image_url}" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user" style="width:26px;height:26px;color:#cbd5e1;"></i>`}
        </div>
        <div>
          <h2 style="font-size:1.3rem;font-weight:800;color:var(--text-primary);margin:0;">${teacher.last_name || ''} ${teacher.first_name || ''}</h2>
        </div>
      </div>
      <button data-action="close" style="width:40px;height:40px;border-radius:50%;background:#f1f5f9;border:none;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <i data-lucide="x" style="width:20px;height:20px;"></i>
      </button>
    </div>

    <div style="padding:32px;display:flex;flex-direction:column;gap:24px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ភេទ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${teacher.gender || '---'}</div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ឋានៈ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${teacher.monk_status || '---'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">លេខទូរស័ព្ទ</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="phone" style="color:var(--primary);width:18px;height:18px;"></i>${teacher.phone || '---'}
          </div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ស្ថានភាព</div>
          <div style="font-size:1.05rem;font-weight:800;">
            ${teacher.status === 'active' ? `<span style="color:#16a34a;">កំពុងបង្រៀន</span>` : `<span style="color:#dc2626;">ឈប់បង្រៀន</span>`}
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ថ្ងៃចូលបម្រើការ</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="calendar" style="color:#8b5cf6;width:18px;height:18px;"></i>${teacher.start_date || '---'}
          </div>
        </div>
      </div>
    </div>

    <div style="padding:24px;border-top:1px solid var(--border);background:#f8fafc;display:flex;gap:12px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;">
      <button data-action="delete" style="padding:12px;border-radius:12px;background:none;border:1px solid var(--danger);color:var(--danger);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
        <i data-lucide="trash-2" style="width:18px;height:18px;"></i>
      </button>
      <button data-action="edit" class="btn btn-primary" style="flex:1;display:flex;justify-content:center;gap:8px;padding:12px;border-radius:12px;">
        <i data-lucide="edit-3" style="width:18px;height:18px;"></i> កែប្រែព័ត៌មាន
      </button>
    </div>
  `;

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="edit"]').addEventListener('click', () => {
    handle.close();
    openTeacherModal(teacher);
  });
  wrap.querySelector('[data-action="delete"]').addEventListener('click', () => {
    handle.close();
    handleDeleteTeacher(teacher.id);
  });

  const handle = openModal(wrap);
}

async function handleDeleteTeacher(id) {
  if (!window.confirm('តើបងពិតជាចង់លុបគ្រូនេះមែនទេ?')) return;
  try {
    const res = await api.del(`/ api / users / teachers / ${id}/`);
    if (!res.ok) throw new Error('បរាជ័យក្នុងការលុប');
    showToast('លុបគ្រូបានជោគជ័យ', 'success');
    fetchTeachers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}


let tgMenuListenerBound = false;

function buildTeachersReportElement(list) {
  const monkCount = list.filter(t => t.monk_status === 'ភិក្ខុ').length;
  const laypersonCount = list.filter(t => t.monk_status === 'គ្រហស្ថ').length;

  const tableNode = document.createElement('table');
  tableNode.innerHTML = `
    <thead>
      <tr>
        <th>ល.រ</th>
        <th>កូដគ្រូ</th>
        <th>ឈ្មោះ</th>
        <th>ភេទ</th>
        <th>លេខទូរស័ព្ទ</th>
        <th>ឋានៈ</th>
        <th>ស្ថានភាព</th>
      </tr>
    </thead>
    <tbody>
      ${list.map((t, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${t.teacher_code || '---'}</td>
          <td>${t.last_name || ''} ${t.first_name || ''}</td>
          <td>${t.gender || '---'}</td>
          <td>${t.phone || '---'}</td>
          <td>${t.monk_status || '---'}</td>
          <td>${t.status === 'active' ? 'កំពុងបង្រៀន' : 'ឈប់បង្រៀន'}</td>
        </tr>
      `).join('')}
    </tbody>
    <tfoot>
      <tr style="font-weight:700;background:#f8fafc;">
        <td colspan="5" style="text-align:right;">សរុបគ្រូបង្រៀន: </td>
        <td style="font-size:0.8rem;text-align:center;">ភិក្ខុ: ${monkCount} / គ្រហស្ថ: ${laypersonCount}</td>
        <td style="text-align:center;">${list.length} នាក់</td>
      </tr>
    </tfoot>
  `;
  const title = `បញ្ជីគ្រូបង្រៀនសរុបប្រចាំឆ្នាំសិក្សា ${state.currentYearName || '..........'}`;
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
  try {
    return await html2pdf()
      .set({
        margin: 5,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(reportEl)
      .output('blob');
  } catch (err) {
    console.error('PDF generation error:', err);
    throw err;
  }
}

function getExcelBlob(list) {
  const wsData = list.map((t, i) => ({
    'ល.រ': i + 1, 'កូដគ្រូ': t.teacher_code, 'នាមត្រកូល': t.last_name, 'នាមខ្លួន': t.first_name,
    'ភេទ': t.gender, 'លេខទូរស័ព្ទ': t.phone, 'ឋានៈ': t.monk_status, 'ស្ថានភាព': t.status === 'active' ? 'កំពុងបង្រៀន' : 'ឈប់បង្រៀន'
  }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Teachers');
  const arrayBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([arrayBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

async function sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig }) {
  const fd = new FormData();
  fd.append('chat_id', tgConfig.chatId);
  fd.append(isPhoto ? 'photo' : 'document', blob, filename);
  if (caption) fd.append('caption', caption);
  const endpoint = isPhoto ? 'sendPhoto' : 'sendDocument';
  const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/${endpoint}`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('telegram-send-failed');
}

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
    import('../components/toast.js').then(m => m.showToast('បានរក្សាទុកការកំណត់ Telegram ដោយជោគជ័យ', 'success'));
    handle.close();
  });

  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
}

async function handleSendTelegram(kind) {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    import('../components/toast.js').then(m => m.showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error'));
    openTelegramConfigModal();
    return;
  }

  const btn = root.querySelector('[data-action="toggle-tg-menu"]');
  if (btn) btn.disabled = true;
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite;"></i> កំពុងផ្ញើ...';
  if (window.lucide) window.lucide.createIcons();

  try {
    const list = getFilteredTeachers();
    const isFiltered = list.length !== state.teachers.length;
    const caption = `🎓 បញ្ជីគ្រូបង្រៀន${isFiltered ? ' (បានត្រង)' : 'សរុប'} (សរុប ${list.length} នាក់)`;
    let blob, filename, isPhoto = false;
    if (kind === 'image') { blob = await captureReportImage(buildTeachersReportElement(list)); filename = 'teachers.png'; isPhoto = true; }
    else if (kind === 'pdf') { blob = await getPdfBlob(buildTeachersReportElement(list)); filename = 'teachers.pdf'; }
    else if (kind === 'excel') { blob = getExcelBlob(list); filename = 'teachers.xlsx'; }

    await sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig });
    import('../components/toast.js').then(m => m.showToast('បានផ្ញើបញ្ជីគ្រូបង្រៀនចូល Telegram ដោយជោគជ័យ', 'success'));
  } catch (err) {
    console.error(err);
    import('../components/toast.js').then(m => m.showToast('បរាជ័យក្នុងការផ្ញើចូល Telegram', 'error'));
  } finally {
    const refreshedBtn = root.querySelector('[data-action="toggle-tg-menu"]');
    if (refreshedBtn) { refreshedBtn.disabled = false; refreshedBtn.innerHTML = originalHtml; }
    if (window.lucide) window.lucide.createIcons();
  }
}

// --- Rendering ---


function update() {
  if (!root) return;
  const { teachers, loading, error, searchQuery, monkStatusFilter, statusFilter, sortOrder, currentPage, itemsPerPage } = state;

  // Filter
  const filtered = getFilteredTeachers();

  // Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  const countByStatus = (list, status) => list.filter(t => t.monk_status === status).length;
  const monkCount = countByStatus(teachers, 'ភិក្ខុ');
  const laypersonCount = countByStatus(teachers, 'គ្រហស្ថ');
  const filteredMonkCount = countByStatus(filtered, 'ភិក្ខុ');
  const filteredLaypersonCount = countByStatus(filtered, 'គ្រហស្ថ');

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:24px;">
      
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">បញ្ជីគ្រូបង្រៀន</h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">គ្រប់គ្រងទិន្នន័យគ្រូបង្រៀន (${filtered.length} នាក់)</p>
        </div>
                <div style="display:flex;gap:12px;">
          ${state.selectedTeachers && state.selectedTeachers.size > 0 ? `
            <button class="btn btn-danger" data-action="delete-multiple" style="display:flex;align-items:center;gap:8px;background:var(--danger);color:white;border:none;">
              <i data-lucide="trash-2" style="width:18px;height:18px"></i> លុប (${state.selectedTeachers.size})
            </button>
          ` : ''}
          <div style="position:relative;" onmouseenter="this.querySelector('#tg-menu').style.display='block'" onmouseleave="this.querySelector('#tg-menu').style.display='none'">
            <button class="btn"  style="background:#0088cc;color:#fff;display:flex;align-items:center;gap:7px;"><i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>
            <div id="tg-menu" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:180px;overflow:hidden;"
                <button data-action="tg-send-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> PDF (.pdf)</button>
                <button data-action="tg-send-excel" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file-spreadsheet" style="width:16px;height:16px;color:#16a34a;"></i> Excel (.xlsx)</button>
                                <button data-action="tg-send-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="image" style="width:16px;height:16px;color:#a855f7;"></i> Image (.png)</button>
              </div>
          </div>
          <button class="btn btn-primary" data-action="add" style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="plus" style="width:18px;height:18px"></i> បន្ថែមគ្រូថ្មី
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">គ្រូបង្រៀនសរុប</span><div class="stat-icon primary"><i data-lucide="users" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${teachers.length}</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">ភិក្ខុសរុប</span><div class="stat-icon warning"><i data-lucide="user-round" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${monkCount}</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">គ្រហស្ថសរុប</span><div class="stat-icon success"><i data-lucide="user-round" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${laypersonCount}</div>
        </div>
      </div>

      <div class="glass-panel" style="padding:20px;">
        <div style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;position:relative;">
            <i data-lucide="search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);width:18px;height:18px;"></i>
            <input type="text" data-f="search" class="form-input" placeholder="ស្វែងរកឈ្មោះ ឬលេខទូរស័ព្ទ..." value="${searchQuery}" style="width:100%;padding:10px 10px 10px 40px;border-radius:10px;border:1px solid var(--border);" />
          </div>
          <div style="position:relative;">
            <button type="button" class="btn btn-outline" data-action="toggle-filter-menu" style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:10px;">
              <i data-lucide="filter" style="width:16px;height:16px;"></i> ត្រង
              ${(monkStatusFilter !== 'All' || statusFilter !== 'All') ? `<span style="background:var(--primary);color:#fff;border-radius:999px;width:18px;height:18px;font-size:0.7rem;display:flex;align-items:center;justify-content:center;">${(monkStatusFilter !== 'All' ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0)}</span>` : ''}
            </button>
            ${state.showFilterMenu ? `
              <div style="position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:240px;padding:16px;display:flex;flex-direction:column;gap:14px;">
                <div>
                  <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">ឋានៈ</label>
                  <select data-f="filter-monk-status" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
                    <option value="All" ${monkStatusFilter === 'All' ? 'selected' : ''}>ទាំងអស់</option>
                    <option value="គ្រហស្ថ" ${monkStatusFilter === 'គ្រហស្ថ' ? 'selected' : ''}>គ្រហស្ថ</option>
                    <option value="សាមណេរ" ${monkStatusFilter === 'សាមណេរ' ? 'selected' : ''}>សាមណេរ</option>
                    <option value="ភិក្ខុ" ${monkStatusFilter === 'ភិក្ខុ' ? 'selected' : ''}>ភិក្ខុ</option>
                    <option value="ដូនជី" ${monkStatusFilter === 'ដូនជី' ? 'selected' : ''}>ដូនជី</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">ស្ថានភាព</label>
                  <select data-f="filter-status" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
                    <option value="All" ${statusFilter === 'All' ? 'selected' : ''}>ទាំងអស់</option>
                    <option value="active" ${statusFilter === 'active' ? 'selected' : ''}>កំពុងបង្រៀន</option>
                    <option value="inactive" ${statusFilter === 'inactive' ? 'selected' : ''}>ឈប់បង្រៀន</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">តម្រៀប</label>
                  <select data-f="filter-sort" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
                    <option value="newest" ${sortOrder === 'newest' ? 'selected' : ''}>ថ្មី → ចាស់</option>
                    <option value="oldest" ${sortOrder === 'oldest' ? 'selected' : ''}>ចាស់ → ថ្មី</option>
                  </select>
                </div>
                <button type="button" data-action="clear-filters" style="background:none;border:none;color:var(--primary);font-weight:600;font-size:0.85rem;cursor:pointer;padding:4px 0;text-align:left;">សម្អាតការត្រង</button>
              </div>
            ` : ''}
          </div>
        </div>

        ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;margin-bottom:20px;">${error}</div>` : ''}
        
        ${loading ? `<div style="text-align:center;padding:60px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>` : `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width:40px;text-align:center;"><input type="checkbox" data-action="select-all" ${paginated.length > 0 && paginated.every(t => state.selectedTeachers && state.selectedTeachers.has(t.id)) ? 'checked' : ''} /></th>
                  <th>កូដគ្រូ</th>
                  <th>រូបថត</th>
                  <th>ឈ្មោះ</th>
                  <th>ភេទ</th>
                  <th>លេខទូរស័ព្ទ</th>
                  <th>ឋានៈ</th>
                  <th>ស្ថានភាព</th>
                  <th style="text-align:right;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${paginated.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);">មិនមានទិន្នន័យ</td></tr>` : paginated.map((t) => `
                  <tr class="hover-row">
                    <td style="text-align:center;"><input type="checkbox" data-action="select-item" data-id="${t.id}" ${state.selectedTeachers && state.selectedTeachers.has(t.id) ? 'checked' : ''} /></td>
                    <td><span style="background:var(--bg-secondary);padding:4px 8px;border-radius:6px;font-family:monospace;font-size:0.85rem;">${t.teacher_code || '---'}</span></td>
                    <td>
                      <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
                        ${t.image_url ? `<img src="${t.image_url}" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user" style="width:20px;height:20px;color:#cbd5e1;"></i>`}
                      </div>
                    </td>
                    <td style="font-weight:600;color:var(--text-primary);">${t.last_name || ''} ${t.first_name || ''}</td>
                    <td>${t.gender || '---'}</td>
                    <td>${t.phone || '---'}</td>
                    <td><span style="background:rgba(79, 70, 229, 0.1);color:var(--primary);padding:4px 10px;border-radius:20px;font-size:0.8rem;font-weight:600;">${t.monk_status || '---'}</span></td>
                    <td>
                      ${t.status === 'active' ? `<span style="color:#16a34a;font-weight:500;font-size:0.85rem;display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:6px;height:6px;background:#16a34a;border-radius:50%;"></span> កំពុងបង្រៀន</span>` : `<span style="color:#dc2626;font-weight:500;font-size:0.85rem;">ឈប់បង្រៀន</span>`}
                    </td>
                    <td style="text-align:right;">
                      <button data-action="view" data-id="${t.id}" style="color:var(--text-secondary);background:none;border:none;cursor:pointer;padding:6px;" title="មើល"><i data-lucide="eye" style="width:18px;height:18px;"></i></button>
                      <button data-action="edit" data-id="${t.id}" style="color:var(--primary);background:none;border:none;cursor:pointer;padding:6px;" title="កែប្រែ"><i data-lucide="edit-3" style="width:18px;height:18px;"></i></button>
                      <button data-action="delete" data-id="${t.id}" style="color:var(--danger);background:none;border:none;cursor:pointer;padding:6px;" title="លុប"><i data-lucide="trash-2" style="width:18px;height:18px;"></i></button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
              ${filtered.length > 0 ? `
                <tfoot>
                  <tr style="font-weight:700;background:#f8fafc;">
                    <td colspan="6" style="text-align:right;">សរុបគ្រូបង្រៀន: </td>
                    <td style="font-size:0.8rem;text-align:center;">ភិក្ខុ: ${filteredMonkCount} / គ្រហស្ថ: ${filteredLaypersonCount}</td>
                    <td style="text-align:center;">${filtered.length} នាក់</td>
                    <td></td>
                  </tr>
                </tfoot>
              ` : ''}
            </table>
          </div>
          
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
            <div style="font-size:0.9rem;color:var(--text-secondary);">
              បង្ហាញ ${filtered.length > 0 ? startIdx + 1 : 0} ដល់ ${Math.min(startIdx + itemsPerPage, filtered.length)} នៃ ${filtered.length}
            </div>
            <div style="display:flex;gap:8px;">
              <button data-action="prev-page" class="btn btn-outline" ${currentPage === 1 ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">មុន</button>
              <button data-action="next-page" class="btn btn-outline" ${currentPage >= totalPages ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">បន្ទាប់</button>
            </div>
          </div>
        `}
      </div>
    </div>
  `;

  // Bind Events
  root.querySelector('[data-action="toggle-tg-menu"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = !state.showTgMenu; update(); });
  root.querySelector('[data-action="toggle-filter-menu"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showFilterMenu = !state.showFilterMenu; update(); });
  if (!tgMenuListenerBound) {
    tgMenuListenerBound = true;
    document.addEventListener('click', (e) => {
      if (state.showTgMenu && !e.target.closest('[data-action="toggle-tg-menu"]') && !e.target.closest('[data-action^="tg-send-"]')) {
        state.showTgMenu = false;
        update();
      }
      if (state.showFilterMenu && !e.target.closest('[data-action="toggle-filter-menu"]') && !e.target.closest('[data-f="filter-monk-status"]') && !e.target.closest('[data-f="filter-status"]') && !e.target.closest('[data-f="filter-sort"]') && !e.target.closest('[data-action="clear-filters"]')) {
        state.showFilterMenu = false;
        update();
      }
    });
  }
  root.querySelector('[data-action="tg-send-pdf"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('pdf'); });
  root.querySelector('[data-action="tg-send-excel"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('excel'); });
  root.querySelector('[data-action="tg-send-image"]')?.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('image'); });
  root.querySelector('[data-action="clear-filters"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.monkStatusFilter = 'All';
    state.statusFilter = 'All';
    state.currentPage = 1;
    update();
  });

  root.querySelector('[data-action="add"]')?.addEventListener('click', () => openTeacherModal(null));

  root.querySelectorAll('button[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = teachers.find(x => String(x.id) === btn.dataset.id);
      if (t) openTeacherViewModal(t);
    });
  });

  root.querySelectorAll('button[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = teachers.find(x => String(x.id) === btn.dataset.id);
      if (t) openTeacherModal(t);
    });
  });

  root.querySelectorAll('button[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteTeacher(btn.dataset.id));
  });


  const searchInput = root.querySelector('[data-f="search"]');
  if (searchInput) {
    onLiveInput(searchInput, () => {
      state.searchQuery = searchInput.value;
      state.currentPage = 1;
      update();
      // Refocus because update() re-renders the input
      setTimeout(() => {
        const newInp = root.querySelector('[data-f="search"]');
        if (newInp) {
          newInp.focus();
          newInp.setSelectionRange(newInp.value.length, newInp.value.length);
        }
      }, 0);
    });
  }

  root.querySelector('[data-f="filter-monk-status"]')?.addEventListener('change', (e) => {
    state.monkStatusFilter = e.target.value;
    state.currentPage = 1;
    update();
  });
  root.querySelector('[data-f="filter-status"]')?.addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    state.currentPage = 1;
    update();
  });
  root.querySelector('[data-f="filter-sort"]')?.addEventListener('change', (e) => {
    state.sortOrder = e.target.value;
    state.currentPage = 1;
    update();
  });

  root.querySelector('[data-action="prev-page"]')?.addEventListener('click', () => {
    if (state.currentPage > 1) { state.currentPage--; update(); }
  });
  root.querySelector('[data-action="next-page"]')?.addEventListener('click', () => {
    if (state.currentPage < totalPages) { state.currentPage++; update(); }
  });

  root.querySelector('[data-action="select-all"]')?.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    if (!state.selectedTeachers) state.selectedTeachers = new Set();

    if (isChecked) {
      paginated.forEach(t => state.selectedTeachers.add(t.id));
    } else {
      paginated.forEach(t => state.selectedTeachers.delete(t.id));
    }
    update();
  });

  root.querySelectorAll('input[data-action="select-item"]').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id, 10);
      if (!state.selectedTeachers) state.selectedTeachers = new Set();
      if (e.target.checked) {
        state.selectedTeachers.add(id);
      } else {
        state.selectedTeachers.delete(id);
      }
      update();
    });
  });

  root.querySelector('[data-action="delete-multiple"]')?.addEventListener('click', async () => {
    if (!state.selectedTeachers || state.selectedTeachers.size === 0) return;
    if (!window.confirm(`តើបងពិតជាចង់លុបគ្រូបង្រៀនទាំង ${state.selectedTeachers.size} នាក់មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`)) return;

    try {
      const ids = Array.from(state.selectedTeachers);
      await Promise.all(ids.map(id => api.del(`/api/users/teachers/${id}/`)));
      import('../components/toast.js').then(m => m.showToast(`បានលុបដោយជោគជ័យចំនួន ${ids.length} នាក់`, 'success'));
      state.selectedTeachers.clear();
      fetchTeachers();
    } catch (err) {
      import('../components/toast.js').then(m => m.showToast('បរាជ័យក្នុងការលុប', 'error'));
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = {
    teachers: [], loading: true, error: null,
    searchQuery: '', monkStatusFilter: 'All', statusFilter: 'All', sortOrder: 'newest',
    currentPage: 1, itemsPerPage: 10,
    showTgMenu: false, showFilterMenu: false,
    selectedTeachers: new Set(), currentYearName: ''
  };
  update();
  fetchTeachers();
}

export function destroy() {
  root = null;
}
