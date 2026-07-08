// Ports pages/Classrooms.jsx.

import html2canvas from 'html2canvas';
import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { createSearchSelect } from '../components/searchSelect.js';
import { showToast } from '../components/toast.js';
import { openModal } from '../components/modal.js';
import { api } from '../api.js';
import { buildStandardReportElement } from '../components/reportTemplate.js';
import { onLiveInput } from '../utils/dom.js';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('km-KH', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
function getTeacherName(id) {
  if (!id) return 'គ្មានគ្រូបន្ទុក';
  const t = state.teachers.find(t => String(t.id) === String(id));
  return t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : 'គ្មានគ្រូបន្ទុក';
}


let state = {
  currentYearName: '',
  classrooms: [],
  teachers: [],
  loading: false,
  showAddModal: false,
  searchQuery: '',
  filterTeacher: '',
  selectedIds: new Set(),
  editingClassroom: null,
  selectedClassroom: null,
  clsName: '',
  clsRoom: '',
  clsGradeLevel: '1',
  clsHomeroomTeacher: '',
  showTgMenu: false
};
let root = null;
let tgMenuListenerBound = false;


let classModalOpen = false;

function checkDuplicateClassName(name) {
  const nameToCheck = (name || '').trim().toLowerCase();
  if (!nameToCheck) return false;
  return state.classrooms.some(c =>
    (c.class_name || '').trim().toLowerCase() === nameToCheck &&
    (!state.editingClassroom || String(c.id) !== String(state.editingClassroom.id))
  );
}

function renderClassModal() {
  if (classModalOpen) return;
  classModalOpen = true;

  const wrap = document.createElement('div');
  const isEditing = !!state.editingClassroom;
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">${isEditing ? 'កែប្រែថ្នាក់រៀន' : 'បង្កើតថ្នាក់រៀនថ្មី'}</h2>
      <button data-action="close" type="button" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <form>
      <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>
      <div style="display:grid;gap:16px;margin-bottom:24px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.9rem;">ឈ្មោះថ្នាក់</label>
          <input type="text" data-f="class_name" class="form-input" required value="${state.clsName}" placeholder="ឧទាហរណ៍៖ ៧ក" style="width:100%;padding:10px 16px;border:1px solid var(--border);border-radius:8px;" />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.9rem;">កម្រិតថ្នាក់ (១-១២)</label>
          <input type="number" data-f="grade_level" class="form-input" required min="1" max="12" value="${state.clsGradeLevel}" style="width:100%;padding:10px 16px;border:1px solid var(--border);border-radius:8px;" />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.9rem;">គ្រូបន្ទុកថ្នាក់</label>
          <div data-role="homeroom-teacher-select"></div>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.9rem;">បន្ទប់</label>
          <input type="text" data-f="room" class="form-input" value="${state.clsRoom}" placeholder="ឧទាហរណ៍៖ បន្ទប់ ៣០២" style="width:100%;padding:10px 16px;border:1px solid var(--border);border-radius:8px;" />
        </div>
        ${isEditing ? `
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.9rem;">កាលបរិច្ឆេទបង្កើត</label>
          <input type="text" disabled value="${formatDate(state.editingClassroom.created_at)}" style="width:100%;padding:10px 16px;border:1px solid var(--border);border-radius:8px;background:#f1f5f9;color:var(--text-secondary);" />
        </div>
      ` : ''}
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;border-top:1px solid var(--border);padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 20px;border-radius:8px;font-weight:600;background:#f1f5f9;border:none;cursor:pointer;color:var(--text-secondary);">បោះបង់</button>
        <button type="submit" style="padding:10px 20px;border-radius:8px;font-weight:600;background:var(--primary);border:none;cursor:pointer;color:#fff;">រក្សាទុក</button>
      </div>
    </form>
  `;

  const classNameInput = wrap.querySelector('[data-f="class_name"]');
  classNameInput.addEventListener('input', e => state.clsName = e.target.value);
  classNameInput.addEventListener('blur', () => {
    if (checkDuplicateClassName(classNameInput.value)) {
      alert('ថ្នាក់រៀននេះមានរួចហើយ! សូមប្រើឈ្មោះផ្សេង');
      classNameInput.focus();
    }
  });
  wrap.querySelector('[data-f="room"]').addEventListener('input', e => state.clsRoom = e.target.value);
  wrap.querySelector('[data-f="grade_level"]').addEventListener('input', e => state.clsGradeLevel = e.target.value);

  const homeroomTeacherSelect = createSearchSelect({
    options: state.teachers.map(t => ({ value: String(t.id), label: `${t.last_name || ''} ${t.first_name || ''}`.trim() })),
    value: String(state.clsHomeroomTeacher || ''),
    placeholder: '--ជ្រើសរើសគ្រូបន្ទុក--',
    onChange: (v) => { state.clsHomeroomTeacher = v; }
  });
  wrap.querySelector('[data-role="homeroom-teacher-select"]').appendChild(homeroomTeacherSelect.el);

  const handle = openModal(wrap, { onClose: () => { classModalOpen = false; } });
  const submitBtn = wrap.querySelector('button[type="submit"]');
  wrap.querySelector('form').addEventListener('submit', (e) => handleSave(e, handle, submitBtn));
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  if (window.lucide) window.lucide.createIcons();
}

function renderDetailModal() {
  const cls = state.selectedClassroom;
  if (!cls) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">ព័ត៌មានលម្អិតថ្នាក់រៀន</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div style="display:grid;gap:16px;margin-bottom:24px;">
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid var(--border);">
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">ឈ្មោះថ្នាក់</div>
        <div style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);">${cls.class_name}</div>
      </div>
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid var(--border);">
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">កម្រិតថ្នាក់</div>
        <div style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);">${cls.grade_level || 1}</div>
      </div>
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid var(--border);">
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">គ្រូបន្ទុកថ្នាក់</div>
        <div style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);">${getTeacherName(cls.homeroom_teacher)}</div>
      </div>
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid var(--border);">
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">បន្ទប់</div>
        <div style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);">${cls.room || ''}</div>
      </div>
      <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid var(--border);">
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">កាលបរិច្ឆេទបង្កើត</div>
        <div style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);">${formatDate(cls.created_at)}</div>
      </div>
    </div>
  `;
  const handle = openModal(wrap);
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  if (window.lucide) window.lucide.createIcons();
}

function renderClassroomsTable() {
  const filtered = getFilteredClassrooms();
  const filteredTeacherIds = [...new Set(filtered.map(c => c.homeroom_teacher).filter(Boolean))];
  let rows = '';

  if (filtered.length === 0) {
    rows = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">មិនមានទិន្នន័យថ្នាក់រៀនទេ — សូមសាកល្បងស្វែងរកម្ដងទៀត ឬបង្កើតថ្នាក់រៀនថ្មី</td></tr>`;
  } else {
    rows = filtered.map(cls => `
      <tr class="hover-row" data-id="${cls.id}">
        <td><input type="checkbox" data-f="row-check" data-id="${cls.id}" ${state.selectedIds.has(String(cls.id)) ? 'checked' : ''} /></td>
        <td>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:40px;height:40px;border-radius:10px;background:var(--primary-light);color:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">
              ${(cls.class_name || '').charAt(0)}
            </div>
            <div style="font-weight:700;color:var(--text-primary);">${cls.class_name}</div>
          </div>
        </td>
        <td style="text-align:center;">${cls.grade_level || 1}</td>
        <td style="font-weight:500;">${getTeacherName(cls.homeroom_teacher)}</td>
        <td>${cls.room || ''}</td>
        <td>${formatDate(cls.created_at)}</td>
        <td style="text-align:right;">
          <button data-action="view-detail" data-id="${cls.id}" style="color:var(--text-secondary);background:none;border:none;cursor:pointer;padding:6px;" title="មើល"><i data-lucide="eye" style="width:18px;height:18px;"></i></button>
          <button data-action="edit" data-id="${cls.id}" style="color:var(--primary);background:none;border:none;cursor:pointer;padding:6px;" title="កែប្រែ"><i data-lucide="edit-2" style="width:18px;height:18px;"></i></button>
          <button data-action="delete" data-id="${cls.id}" style="color:var(--danger);background:none;border:none;cursor:pointer;padding:6px;" title="លុប"><i data-lucide="trash-2" style="width:18px;height:18px;"></i></button>
        </td>
      </tr>
    `).join('');
  }

  const allSelected = filtered.length > 0 && filtered.every(c => state.selectedIds.has(String(c.id)));

  return `
    ${state.selectedIds.size > 0 ? `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 20px;background:#fef2f2;border-bottom:1px solid var(--border);">
        <span style="font-weight:600;color:var(--danger);">បានជ្រើស ${state.selectedIds.size} ថ្នាក់</span>
        <button data-action="delete-selected" class="btn" style="background:var(--danger);color:#fff;">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i> លុបទាំងអស់
        </button>
      </div>
    ` : ''}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" data-f="select-all" ${allSelected ? 'checked' : ''} /></th>
            <th>ថ្នាក់រៀន</th>
            <th style="text-align:center;">កម្រិតថ្នាក់</th>
            <th>គ្រូបន្ទុកថ្នាក់</th>
            <th>បន្ទប់រៀន</th>
            <th>កាលបរិច្ឆេទបង្កើត</th>
            <th style="text-align:right;">សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
        ${filtered.length > 0 ? `
          <tfoot>
            <tr style="font-weight:700;background:#f8fafc;">
              <td></td>
              <td colspan="2">សរុបថ្នាក់រៀន</td>
              <td style="text-align:center;">${filteredTeacherIds.length} គ្រូ</td>
              <td></td>
              <td style="text-align:center;">${filtered.length} ថ្នាក់</td>
              <td></td>
            </tr>
          </tfoot>
        ` : ''}
      </table>
    </div>
  `;
}


async function fetchClassrooms() {
  state.loading = true;
  update();
  try {
    const [classroomsRes, teachersRes, yearsRes] = await Promise.all([
      api.get('/api/classrooms/'),
      api.get('/api/users/teachers/'),
      api.get('/api/academic-years/')
    ]);
    state.classrooms = (classroomsRes.ok && Array.isArray(classroomsRes.data)) ? classroomsRes.data : [];
    state.teachers = (teachersRes.ok && Array.isArray(teachersRes.data)) ? teachersRes.data : [];
    if (yearsRes.ok && Array.isArray(yearsRes.data)) {
      const currentYear = yearsRes.data.find(y => y.is_current);
      if (currentYear) {
        state.currentYearName = currentYear.year_name;
      }
    }
  } catch (err) {
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យថ្នាក់រៀន', 'error');
  } finally {
    state.loading = false;
    update();
  }
}

function resetForm() {
  state.clsName = '';
  state.clsRoom = '';
  state.clsGradeLevel = '1';
  state.clsHomeroomTeacher = '';
  state.editingClassroom = null;
}

function openEditModal(cls) {
  state.editingClassroom = cls;
  state.clsName = cls.class_name || '';
  state.clsRoom = cls.room || '';
  state.clsGradeLevel = String(cls.grade_level || 1);
  state.clsHomeroomTeacher = cls.homeroom_teacher || '';
  state.showAddModal = true;
  renderClassModal();
}

async function handleSave(e, handle, submitBtn) {
  e.preventDefault();
  if (submitBtn.disabled) return;
  const form = e.target;
  const errorBox = form.querySelector('[data-role="form-error"]');
  if (errorBox) errorBox.style.display = 'none';

  if (checkDuplicateClassName(state.clsName)) {
    if (errorBox) {
      errorBox.textContent = 'ថ្នាក់រៀននេះមានរួចហើយ! សូមប្រើឈ្មោះផ្សេង';
      errorBox.style.display = 'block';
    } else {
      showToast('ថ្នាក់រៀននេះមានរួចហើយ! សូមប្រើឈ្មោះផ្សេង', 'error');
    }
    return;
  }

  submitBtn.disabled = true;

  const payload = {
    class_name: state.clsName,
    room: state.clsRoom,
    grade_level: Number(state.clsGradeLevel),
    homeroom_teacher: state.clsHomeroomTeacher || null
  };

  try {
    const res = state.editingClassroom
      ? await api.put(`/api/classrooms/${state.editingClassroom.id}/`, payload)
      : await api.post('/api/classrooms/', payload);

    if (!res.ok) {
      let errorMsg = 'មានបញ្ហាក្នុងការរក្សាទុកថ្នាក់រៀន';
      if (res.data && typeof res.data === 'object') {
        const errors = Object.values(res.data).flat();
        if (errors.length > 0) errorMsg = errors[0];
      }
      if (errorBox) {
        errorBox.textContent = errorMsg;
        errorBox.style.display = 'block';
      } else {
        showToast(errorMsg, 'error');
      }
      submitBtn.disabled = false;
      return;
    }

    showToast(state.editingClassroom ? 'បានកែប្រែថ្នាក់រៀនជោគជ័យ' : 'បានបង្កើតថ្នាក់រៀនថ្មីជោគជ័យ', 'success');
    state.showAddModal = false;
    handle.close();
    fetchClassrooms();
  } catch (err) {
    if (errorBox) {
      errorBox.textContent = 'មានបញ្ហាក្នុងការរក្សាទុកថ្នាក់រៀន';
      errorBox.style.display = 'block';
    } else {
      showToast('មានបញ្ហាក្នុងការរក្សាទុកថ្នាក់រៀន', 'error');
    }
    submitBtn.disabled = false;
  }
}

async function handleSoftDelete(id, name) {
  try {
    await api.del(`/api/classrooms/${id}/`);
    showToast(`បានលុបថ្នាក់ ${name} ជោគជ័យ`, 'success');
    fetchClassrooms();
  } catch (err) {
    showToast('បរាជ័យក្នុងការលុប', 'error');
  }
}

async function handleBulkDelete() {
  const ids = [...state.selectedIds];
  try {
    await Promise.all(ids.map(id => api.del(`/api/classrooms/${id}/`)));
    showToast(`បានលុបថ្នាក់ ${ids.length} ជោគជ័យ`, 'success');
    state.selectedIds.clear();
    fetchClassrooms();
  } catch (err) {
    showToast('បរាជ័យក្នុងការលុប', 'error');
  }
}

function getFilteredClassrooms() {
  return state.classrooms.filter(c => {
    if (state.filterTeacher && String(c.homeroom_teacher || '') !== state.filterTeacher) return false;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      return (c.class_name || '').toLowerCase().includes(q) ||
             (c.room || '').toLowerCase().includes(q) ||
             getTeacherName(c.homeroom_teacher).toLowerCase().includes(q);
    }
    return true;
  });
}

function update() {
  if (!root) {
    root = document.getElementById('app');
    if (!root) return;
  }

  if (state.loading) {
    root.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>`;
    return;
  }

  const uniqueTeacherIds = [...new Set(state.classrooms.map(c => c.homeroom_teacher).filter(Boolean))];

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:24px;">

      <!-- Header Section -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">គ្រប់គ្រងថ្នាក់រៀន</h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">រៀបចំ និងគ្រប់គ្រងទិន្នន័យថ្នាក់រៀនទាំងអស់ក្នុងសាលា</p>
        </div>

        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="position:relative;" onmouseenter="this.querySelector('#tg-menu').style.display='block'" onmouseleave="this.querySelector('#tg-menu').style.display='none'">
            <button  class="btn" style="background:#0088cc;color:#fff;display:flex;align-items:center;gap:7px;"><i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>
            <div id="tg-menu" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:180px;overflow:hidden;"
                <button data-action="tg-send-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> PDF (.pdf)</button>
                <button data-action="tg-send-excel" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file-spreadsheet" style="width:16px;height:16px;color:#16a34a;"></i> Excel (.xlsx)</button>
                <button data-action="tg-send-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="image" style="width:16px;height:16px;color:#a855f7;"></i> Image (.png)</button>
              </div>
          </div>
          <button data-action="open-add" class="btn btn-primary">
            <i data-lucide="plus" style="width:16px;height:16px;"></i> បង្កើតថ្នាក់ថ្មី
          </button>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="dashboard-grid">
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">ថ្នាក់រៀនសរុប</span><div class="stat-icon primary"><i data-lucide="school" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${state.classrooms.length}</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">គ្រូបន្ទុកថ្នាក់សរុប</span><div class="stat-icon success"><i data-lucide="user-check" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${uniqueTeacherIds.length}</div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="glass-panel" style="padding:20px;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">
        <div style="flex:1;min-width:220px;position:relative;">
          <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">ស្វែងរក</label>
          <i data-lucide="search" style="position:absolute;left:12px;top:38px;color:var(--text-muted);width:18px;height:18px;"></i>
          <input type="text" data-f="search" class="form-input" placeholder="ស្វែងរកតាមឈ្មោះ កូដ ឬគ្រូបន្ទុក..." value="${state.searchQuery}" style="width:100%;padding:10px 10px 10px 40px;border-radius:10px;" />
        </div>

        <div style="width:100%;max-width:220px;">
          <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">គ្រូបន្ទុកថ្នាក់</label>
          <select data-f="filter-teacher" class="form-input" style="width:100%;cursor:pointer;">
            <option value="">គ្រូបន្ទុកទាំងអស់</option>
            ${uniqueTeacherIds.map(id => `<option value="${id}" ${state.filterTeacher === String(id) ? 'selected' : ''}>${getTeacherName(id)}</option>`).join('')}
          </select>
        </div>

        ${(state.searchQuery || state.filterTeacher) ? `
          <button data-action="clear-filters" class="btn" style="background:#fff;border:1px solid var(--border);color:var(--text-secondary);">
            <i data-lucide="x-circle" style="width:16px;height:16px;"></i> សម្អាតតម្រង
          </button>
        ` : ''}
      </div>

      <!-- Main Content -->
      <div class="glass-panel" style="padding:0;overflow:hidden;">
        ${state.loading ? `
          <div style="text-align:center;padding:60px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>
        ` : renderClassroomsTable()}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  root.querySelector('[data-action="open-add"]').addEventListener('click', () => { state.showAddModal = true; resetForm(); renderClassModal(); });

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
  const tgExcelBtn = root.querySelector('[data-action="tg-send-excel"]');
  if (tgExcelBtn) tgExcelBtn.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('excel'); });
  const tgImageBtn = root.querySelector('[data-action="tg-send-image"]');
  if (tgImageBtn) tgImageBtn.addEventListener('click', (e) => { e.stopPropagation(); state.showTgMenu = false; update(); handleSendTelegram('image'); });

  { const searchEl = root.querySelector('[data-f="search"]');
    onLiveInput(searchEl, () => { state.searchQuery = searchEl.value; update(); setTimeout(() => { const el = root.querySelector('[data-f="search"]'); el.focus(); el.setSelectionRange(el.value.length, el.value.length); }, 0); }); }
  root.querySelector('[data-f="filter-teacher"]').addEventListener('change', (e) => { state.filterTeacher = e.target.value; update(); });
  root.querySelector('[data-action="clear-filters"]')?.addEventListener('click', () => { state.searchQuery = ''; state.filterTeacher = ''; update(); });

  root.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const cls = state.classrooms.find(c => String(c.id) === String(id));
      if (cls) openEditModal(cls);
    });
  });

  root.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const cls = state.classrooms.find(c => String(c.id) === String(id));
      if (cls && confirm(`តើអ្នកពិតជាចង់លុបថ្នាក់ ${cls.class_name} មែនទេ?`)) handleSoftDelete(cls.id, cls.class_name);
    });
  });

  root.querySelectorAll('[data-action="view-detail"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const cls = state.classrooms.find(c => String(c.id) === String(id));
      if (cls) { state.selectedClassroom = cls; renderDetailModal(); }
    });
  });

  root.querySelectorAll('[data-f="row-check"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      const id = cb.dataset.id;
      if (cb.checked) state.selectedIds.add(id);
      else state.selectedIds.delete(id);
      update();
    });
  });

  const selectAllCb = root.querySelector('[data-f="select-all"]');
  if (selectAllCb) {
    selectAllCb.addEventListener('change', (e) => {
      const filtered = getFilteredClassrooms();
      if (e.target.checked) filtered.forEach(c => state.selectedIds.add(String(c.id)));
      else filtered.forEach(c => state.selectedIds.delete(String(c.id)));
      update();
    });
  }

  root.querySelector('[data-action="delete-selected"]')?.addEventListener('click', () => {
    const count = state.selectedIds.size;
    if (count > 0 && confirm(`តើអ្នកពិតជាចង់លុបថ្នាក់ដែលបានជ្រើស ${count} មែនទេ?`)) handleBulkDelete();
  });
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
    showToast('បានរក្សាទុកការកំណត់ Telegram ដោយជោគជ័យ', 'success');
    handle.close();
  });

  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
}

// Builds a detached, visibly-styled element with the title + classrooms
// table for the Telegram image capture.
function buildClassroomsReportElement() {
  const list = getFilteredClassrooms();
  const teachersCount = new Set(list.map(c => c.homeroom_teacher).filter(Boolean)).size;

  const tableNode = document.createElement('table');
  tableNode.innerHTML = `
    <thead>
      <tr style="background:#f8fafc;border-bottom:2px solid var(--border);text-align:left;">
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ឈ្មោះថ្នាក់</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">កម្រិត</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;text-align:center;">គ្រូប្រចាំថ្នាក់</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">បន្ទប់</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;text-align:right;">ចំនួនសិស្ស</th>
      </tr>
    </thead>
    <tbody>
      ${list.map(c => {
        const edu = state.educationLevels.find(e => String(e.id) === String(c.education_level));
        const hrTeacher = state.teachers.find(t => String(t.id) === String(c.homeroom_teacher));
        const tName = hrTeacher ? `${hrTeacher.last_name || ''} ${hrTeacher.first_name || ''}`.trim() : '---';
        const enrollmentCount = state.enrollments.filter(e => String(e.classroom_id) === String(c.id)).length;
        
        return `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:16px;color:var(--text-primary);font-weight:600;">${c.classroom_name}</td>
          <td style="padding:16px;color:var(--text-primary);">${edu ? edu.name : '---'}</td>
          <td style="padding:16px;color:var(--text-primary);text-align:center;">${tName}</td>
          <td style="padding:16px;color:var(--text-primary);">${c.room_number || '---'}</td>
          <td style="padding:16px;color:var(--text-primary);text-align:right;">${toKhmerNumerals(enrollmentCount)} នាក់</td>
        </tr>
        `;
      }).join('')}
    </tbody>
    <tfoot>
      <tr style="font-weight:700;background:#f8fafc;">
        <td colspan="2">សរុបថ្នាក់រៀន</td>
        <td style="text-align:center;">${toKhmerNumerals(teachersCount)} គ្រូ</td>
        <td></td>
        <td style="text-align:right;">${toKhmerNumerals(list.length)} ថ្នាក់</td>
      </tr>
    </tfoot>
  `;

  const title = `បញ្ជីថ្នាក់រៀនសរុបប្រចាំឆ្នាំសិក្សា ${state.currentYearName || '..........'}`;
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
  // Pass the element straight to html2pdf -- it clones the element itself
  // into its own offscreen container. Pre-cloning with position:absolute
  // here collapses that container's height:auto to 0 (absolutely
  // positioned children don't contribute to a parent's auto height),
  // producing a blank PDF.
  return await html2pdf().set({ margin: 5, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(reportEl).outputPdf('blob');
}

function getExcelBlob() {
  const wsData = getFilteredClassrooms().map((cls, i) => ({
    'ល.រ': i + 1, 'ថ្នាក់រៀន': cls.class_name, 'កម្រិតថ្នាក់': cls.grade_level || 1,
    'គ្រូបន្ទុកថ្នាក់': getTeacherName(cls.homeroom_teacher), 'បន្ទប់រៀន': cls.room || '',
    'កាលបរិច្ឆេទបង្កើត': formatDate(cls.created_at)
  }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Classrooms');
  const arrayBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([arrayBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

async function sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig }) {
  const fd = new FormData();
  fd.append('chat_id', tgConfig.chatId);
  fd.append(isPhoto ? 'photo' : 'document', blob, filename);
  if (caption) fd.append('caption', caption);
  const endpoint = isPhoto ? 'sendPhoto' : 'sendDocument';
  const res = await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/${endpoint}`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('telegram-send-failed');
}

async function handleSendTelegram(kind) {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  const btn = root.querySelector('[data-action="toggle-tg-menu"]');
  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite;"></i> កំពុងផ្ញើ...';
  if (window.lucide) window.lucide.createIcons();

  try {
    const reportEl = buildClassroomsReportElement();
    const caption = `🏫 បញ្ជីថ្នាក់រៀន (សរុប ${getFilteredClassrooms().length} ថ្នាក់)`;
    let blob, filename, isPhoto = false;
    if (kind === 'image') { blob = await captureReportImage(reportEl); filename = 'classrooms.png'; isPhoto = true; }
    else if (kind === 'pdf') { blob = await getPdfBlob(reportEl); filename = 'classrooms.pdf'; }
    else if (kind === 'excel') { blob = getExcelBlob(); filename = 'classrooms.xlsx'; }

    await sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig });
    showToast('បានផ្ញើបញ្ជីថ្នាក់រៀនចូល Telegram ដោយជោគជ័យ', 'success');
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យក្នុងការផ្ញើចូល Telegram', 'error');
  } finally {
    const refreshedBtn = root.querySelector('[data-action="toggle-tg-menu"]');
    if (refreshedBtn) { refreshedBtn.disabled = false; refreshedBtn.innerHTML = originalHtml; }
    if (window.lucide) window.lucide.createIcons();
  }
}

export function render(container) {
  root = container;
  state.showTgMenu = false;
  fetchClassrooms();
}

export function destroy() {
  root = null;
}

