// Ports pages/monitorStudentInfo.js - For Monitor to enter student info (Pagoda, Kuti, Photo, Phone, Nationality, DOB)

import { getUser } from '../auth.js';
import { api } from '../api.js';
import { navigate } from '../router.js';
import { createMonitorBottomNav } from '../components/monitorBottomNav.js';
import { openMonitorAccountSheet } from '../components/monitorAccountSheet.js';
import { withFocusPreserved, onLiveInput } from '../utils/dom.js';
import { showToast } from '../components/toast.js';

let root = null;
let outsideClickHandler = null;
let state = {
  students: [], classroomName: '', loading: true, selected: null,
  pagodas: [], kutis: [], nationalities: [],
  search: '', showFilters: false, pagodaFilter: 'all', showCompleted: false
};

function formatDob(dob) {
  if (!dob) return null;
  try {
    const d = new Date(dob);
    if (isNaN(d)) return dob;
    return d.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dob; }
}

async function loadData() {
  const monitorInfo = getUser()?.monitorInfo || {};
  if (!monitorInfo.classroom_id) { state = { ...state, loading: false }; update(); return; }
  try {
    const [enRes, stuRes, pagRes, kutRes, natRes] = await Promise.all([
      api.get(`/api/students/enrollments/students/?classroom=${monitorInfo.classroom_id}&academic_year=${monitorInfo.academic_year_id}`),
      api.get('/api/students/list/'),
      api.get('/api/core/pagodas/'),
      api.get('/api/core/kutis/'),
      api.get('/api/core/nationalities/'),
    ]);

    const studentMap = {};
    (stuRes.ok ? stuRes.data || [] : []).forEach(s => { studentMap[s.dbId || s.id] = s; });
    const pagodas = pagRes.ok ? pagRes.data || [] : [];
    const kutis = kutRes.ok ? kutRes.data || [] : [];
    const nationalities = natRes.ok ? natRes.data || [] : [];

    const enrollments = enRes.ok ? enRes.data || [] : [];
    const students = enrollments.map(e => {
      const full = studentMap[e.student_id] || {};
      const pagoda = pagodas.find(p => String(p.id) === String(full.pagoda || full.current_pagoda));
      const kuti = kutis.find(k => String(k.id) === String(full.kuti));

      return {
        id: e.student_id,
        name: e.student_name,
        code: e.student_code,
        dob: full.dob || full.date_of_birth,
        image: full.image || full.image_url || null,
        pagodaId: full.pagoda || full.current_pagoda || null,
        kutiId: full.kuti || null,
        phone: full.phone || '',
        nationalityId: full.nationality || null,
        pagodaName: pagoda?.name || null,
        kutiName: kuti?.name || null,
        status: full.status
      };
    });

    students.sort((a, b) => a.name.localeCompare(b.name, 'km'));

    state = { ...state, students, pagodas, kutis, nationalities, classroomName: monitorInfo.classroom_name || '', loading: false };
  } catch (err) {
    console.error('Failed to load data:', err);
    state = { ...state, loading: false };
  }
  update();
}

function openDetail(s) {
  state = { ...state, selected: s };
  update();
}

function renderDetailSheet() {
  const { selected, pagodas, kutis, nationalities } = state;
  if (!selected) return '';

  const kutiOptions = kutis.filter(k => !selected.pagodaId || String(k.pagoda) === String(selected.pagodaId));

  return `
    <div data-action="close-detail" style="position:fixed;inset:0;background-color:rgba(0,0,0,0.45);z-index:50;"></div>
    <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background-color:white;border-top-left-radius:24px;border-top-right-radius:24px;z-index:51;max-height:90vh;display:flex;flex-direction:column;">
      <div style="display:flex;justify-content:center;padding-top:12px;padding-bottom:4px;flex-shrink:0;"><div style="width:40px;height:4px;border-radius:2px;background-color:#e5e7eb;"></div></div>
      <div style="padding:10px 20px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f3f4f6;flex-shrink:0;">
        <div style="font-weight:bold;font-size:16px;color:#111827;">បំពេញព័ត៌មានបន្ថែម</div>
        <button data-action="close-detail" style="width:30px;height:30px;border-radius:50%;background-color:#f3f4f6;border:none;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;">✕</button>
      </div>
      
      <div style="overflow-y:auto;flex:1;padding:20px;">
        <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:24px;">
           <div style="position:relative;">
             <div style="width:80px;height:80px;border-radius:50%;background-color:#eef2ff;color:#4f46e5;font-size:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;overflow:hidden;border:2px solid #e5e7eb;" id="preview-image-container">
               ${selected.image ? `<img src="${selected.image}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : (selected.name.split(' ').pop()?.[0] || '?')}
             </div>
             <label for="student-image-upload" style="position:absolute;bottom:0;right:0;width:28px;height:28px;background-color:#4f46e5;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
               <i data-lucide="camera" style="width:14px;height:14px;"></i>
             </label>
             <input type="file" id="student-image-upload" accept="image/*" style="display:none;" />
           </div>
           <div style="font-weight:bold;font-size:16px;color:#111827;margin-top:12px;">${selected.name}</div>
           <div style="font-size:13px;color:#6b7280;">${selected.code}</div>
        </div>

        <form id="student-info-form" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;font-size:13px;font-weight:bold;color:#374151;margin-bottom:6px;">ថ្ងៃខែឆ្នាំកំណើត</label>
            <input type="date" id="input-dob" value="${selected.dob || ''}" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font-family:inherit;font-size:14px;outline:none;" />
          </div>
          <div>
            <label style="display:block;font-size:13px;font-weight:bold;color:#374151;margin-bottom:6px;">លេខទូរស័ព្ទ</label>
            <input type="tel" id="input-phone" placeholder="បញ្ចូលលេខទូរស័ព្ទ" value="${selected.phone || ''}" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font-family:inherit;font-size:14px;outline:none;" />
          </div>
          <div>
            <label style="display:block;font-size:13px;font-weight:bold;color:#374151;margin-bottom:6px;">សញ្ជាតិ</label>
            <select id="input-nationality" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font-family:inherit;font-size:14px;outline:none;background-color:white;">
              <option value="">-- ជ្រើសរើសសញ្ជាតិ --</option>
              ${nationalities.map(n => `<option value="${n.id}" ${String(n.id) === String(selected.nationalityId) ? 'selected' : ''}>${n.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block;font-size:13px;font-weight:bold;color:#374151;margin-bottom:6px;">វត្ត</label>
            <select id="input-pagoda" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font-family:inherit;font-size:14px;outline:none;background-color:white;">
              <option value="">-- ជ្រើសរើសវត្ត --</option>
              ${pagodas.map(p => `<option value="${p.id}" ${String(p.id) === String(selected.pagodaId) ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block;font-size:13px;font-weight:bold;color:#374151;margin-bottom:6px;">កុដិ (អាចជ្រើសរើស ឬវាយបញ្ចូលថ្មី)</label>
            <input type="text" id="input-kuti" list="kuti-options" placeholder="វាយឈ្មោះកុដិ..." value="${selected.kutiName || ''}" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font-family:inherit;font-size:14px;outline:none;" />
            <datalist id="kuti-options">
              ${kutiOptions.map(k => `<option value="${k.name}"></option>`).join('')}
            </datalist>
          </div>

          <button type="submit" id="btn-save-info" style="margin-top:12px;width:100%;padding:14px;background-color:#4f46e5;color:white;border:none;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 6px rgba(79, 70, 229, 0.2);">
            <i data-lucide="save" style="width:18px;height:18px;"></i> រក្សាទុក
          </button>
        </form>
      </div>
    </div>
  `;
}

function update() {
  if (!root) return;
  const scrollX = window.scrollX, scrollY = window.scrollY;
  const { students, classroomName, loading, pagodaFilter, search, showFilters, pagodas, showCompleted } = state;

  const filtered = students.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.phone.includes(search)) return false;
    if (pagodaFilter !== 'all' && String(s.pagodaId) !== String(pagodaFilter)) return false;
    
    const isMissingInfo = !s.pagodaId || !s.phone || !s.dob || !s.image;
    if (!showCompleted && !isMissingInfo) return false;

    return true;
  });

  root.innerHTML = `
    <div style="min-height:100vh;background-color:#f3f4f6;font-family:'Khmer OS Battambang','Battambang',sans-serif;display:flex;justify-content:center;">
      <div style="width:100%;max-width:480px;background-color:#f9fafb;padding-bottom:80px;position:relative;">
        
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
            <div style="font-size:16px;font-weight:bold;color:#111827;">បំពេញព័ត៌មានសិស្ស</div>
            <div style="font-size:12px;color:#6b7280;">${classroomName}</div>
          </div>
          <div style="width:36px;height:36px;"></div>
        </div>

        <div style="position:sticky;top:0;z-index:40;background-color:#f9fafb;">
          <div style="padding:12px 16px;display:flex;gap:10px;">
            <div style="flex:1;position:relative;">
              <i data-lucide="search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;width:18px;height:18px;"></i>
              <input type="text" data-role="search" value="${search}" placeholder="ស្វែងរកឈ្មោះ ឬលេខទូរស័ព្ទ..." style="width:100%;padding:10px 10px 10px 38px;border-radius:12px;border:1px solid #e5e7eb;font-family:inherit;font-size:14px;background-color:white;outline:none;box-shadow:0 1px 2px rgba(0,0,0,0.05);" />
              ${search ? `<button data-action="clear-search" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#9ca3af;cursor:pointer;"><i data-lucide="x-circle" style="width:16px;height:16px;"></i></button>` : ''}
            </div>
            <button data-action="toggle-filters" style="width:42px;height:42px;flex-shrink:0;border-radius:12px;border:1px solid #e5e7eb;background-color:${showFilters ? '#eff6ff' : 'white'};color:${showFilters ? '#4f46e5' : '#4b5563'};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
              <i data-lucide="filter" style="width:20px;height:20px;"></i>
            </button>
          </div>

          <div style="position:relative;">
            ${showFilters ? `
              <div data-role="filter-panel" style="position:absolute;top:0;left:16px;right:16px;background:white;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);padding:16px;z-index:50;border:1px solid #e5e7eb;">
                <div style="font-weight:bold;font-size:14px;color:#111827;margin-bottom:12px;">តម្រង</div>
                <div style="margin-bottom:12px;">
                  <label style="display:block;font-size:12px;color:#6b7280;margin-bottom:6px;">វត្ត</label>
                  <select data-f="pagoda" style="width:100%;padding:10px;border-radius:8px;border:1px solid #e5e7eb;font-family:inherit;font-size:14px;outline:none;">
                    <option value="all">ទាំងអស់</option>
                    ${pagodas.map(p => `<option value="${p.id}" ${String(pagodaFilter) === String(p.id) ? 'selected' : ''}>${p.name}</option>`).join('')}
                  </select>
                </div>
                ${pagodaFilter !== 'all' ? `<button data-action="clear-filters" style="width:100%;font-size:12px;color:#4f46e5;font-weight:bold;background-color:#eef2ff;border:none;cursor:pointer;padding:8px 6px;border-radius:8px;">សម្អាតតម្រង</button>` : ''}
              </div>
            ` : ''}
          </div>
        </div>

        <div style="padding:10px 16px 0;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="font-size:12px;color:#6b7280;font-weight:bold;">សិស្សចំនួន ${filtered.length} នាក់ក្នុងថ្នាក់ ${classroomName}</span>
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#6b7280;cursor:pointer;">
            <input type="checkbox" data-action="toggle-completed" ${showCompleted ? 'checked' : ''} style="accent-color:#4f46e5;" /> បង្ហាញសិស្សពេញលក្ខណៈ
          </label>
        </div>

        <div style="padding:12px 16px 0;">
          ${loading ? `<div style="text-align:center;padding:48px;color:#9ca3af;font-size:14px;">កំពុងផ្ទុក...</div>`
            : filtered.length === 0 ? `<div style="text-align:center;padding:48px;color:#9ca3af;font-size:14px;">មិនមានសិស្សត្រូវបង្ហាញ</div>`
            : `<div style="display:flex;flex-direction:column;gap:10px;">
                ${filtered.map((s, i) => {
                  // Check if information is missing
                  const isMissingInfo = !s.pagodaId || !s.phone || !s.dob || !s.image;
                  return `
                    <div data-student="${s.id}" style="background-color:white;border-radius:14px;padding:14px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);border-left:4px solid ${isMissingInfo ? '#f59e0b' : '#10b981'};cursor:pointer;display:flex;align-items:center;justify-content:space-between;">
                      <div style="display:flex;align-items:center;gap:12px;">
                        <div style="width:46px;height:46px;border-radius:50%;background-color:#eef2ff;color:#4f46e5;font-size:18px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border:1px solid #e5e7eb;">
                          ${s.image ? `<img src="${s.image}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : (i + 1)}
                        </div>
                        <div>
                          <div style="font-weight:bold;font-size:15px;color:#111827;margin-bottom:2px;">${s.name}</div>
                          <div style="font-size:12px;color:#6b7280;display:flex;gap:6px;flex-wrap:wrap;">
                            ${s.phone ? `<span style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">📞 ${s.phone}</span>` : `<span style="color:#ef4444;">គ្មានលេខ</span>`}
                            ${s.pagodaName ? `<span style="background:#f0fdf4;color:#16a34a;padding:2px 6px;border-radius:4px;">🏛 ${s.pagodaName}</span>` : `<span style="color:#ef4444;">គ្មានវត្ត</span>`}
                            ${s.dob ? `<span style="background:#eff6ff;color:#2563eb;padding:2px 6px;border-radius:4px;">🎂 ${formatDob(s.dob)}</span>` : `<span style="color:#ef4444;">គ្មានថ្ងៃខែឆ្នាំកំណើត</span>`}
                          </div>
                        </div>
                      </div>
                      <i data-lucide="edit-3" style="width:18px;height:18px;color:#9ca3af;flex-shrink:0;"></i>
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
  
  const filterPanel = root.querySelector('[data-role="filter-panel"]');
  if (filterPanel) filterPanel.addEventListener('click', (e) => e.stopPropagation());
  
  const clearFiltersBtn = root.querySelector('[data-action="clear-filters"]');
  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => { state = { ...state, pagodaFilter: 'all' }; update(); });
  
  if (outsideClickHandler) { document.removeEventListener('click', outsideClickHandler); outsideClickHandler = null; }
  if (state.showFilters) {
    outsideClickHandler = () => { state = { ...state, showFilters: false }; update(); };
    document.addEventListener('click', outsideClickHandler, { once: true });
  }

  const toggleCompleted = root.querySelector('[data-action="toggle-completed"]');
  if (toggleCompleted) toggleCompleted.addEventListener('change', (e) => { state = { ...state, showCompleted: e.target.checked }; update(); });
  
  root.querySelectorAll('[data-student]').forEach(card => {
    card.addEventListener('click', () => openDetail(state.students.find(s => String(s.id) === card.dataset.student)));
  });
  
  root.querySelectorAll('[data-action="close-detail"]').forEach(el => el.addEventListener('click', () => { state = { ...state, selected: null }; update(); }));

  // Handle Form Logic
  const form = root.querySelector('#student-info-form');
  if (form) {
    const pagodaInput = root.querySelector('#input-pagoda');
    const kutiInput = root.querySelector('#input-kuti');
    const imageInput = root.querySelector('#student-image-upload');
    const previewContainer = root.querySelector('#preview-image-container');
    let selectedImageFile = null;

    // Filter Kutis based on selected Pagoda
    pagodaInput.addEventListener('change', (e) => {
      const pId = e.target.value;
      const filteredKutis = state.kutis.filter(k => !pId || String(k.pagoda) === String(pId));
      const datalist = root.querySelector('#kuti-options');
      if (datalist) {
        datalist.innerHTML = filteredKutis.map(k => `<option value="${k.name}"></option>`).join('');
      }
      kutiInput.value = ''; // clear current kuti input when pagoda changes
    });

    // Handle Image Preview
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          previewContainer.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;" />`;
        };
        reader.readAsDataURL(file);
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnSave = root.querySelector('#btn-save-info');
      btnSave.disabled = true;
      btnSave.innerHTML = `<i data-lucide="loader-2" class="spin"></i> កំពុងរក្សាទុក...`;

      const fd = new FormData();
      const dobVal = root.querySelector('#input-dob').value;
      const rawPhoneVal = root.querySelector('#input-phone').value;
      const phoneVal = rawPhoneVal.replace(/[\s-]/g, '');
      const natVal = root.querySelector('#input-nationality').value;
      const pagVal = pagodaInput.value;
      let kutiVal = kutiInput.value.trim();
      let finalKutiId = '';

      if (phoneVal && !/^(0|\+855)\d{8,9}$/.test(phoneVal)) {
        showToast('លេខទូរស័ព្ទមិនត្រឹមត្រូវ (ត្រូវមាន ៩ ទៅ ១០ ខ្ទង់)', 'warning');
        btnSave.disabled = false;
        btnSave.innerHTML = `<i data-lucide="save" style="width:18px;height:18px;"></i> រក្សាទុក`;
        return;
      }

      if (kutiVal && !pagVal) {
        showToast('សូមជ្រើសរើសវត្តជាមុនសិន មុននឹងបញ្ចូលកុដិ!', 'warning');
        btnSave.disabled = false;
        btnSave.innerHTML = `<i data-lucide="save" style="width:18px;height:18px;"></i> រក្សាទុក`;
        return;
      }

      if (kutiVal && pagVal) {
        const existingKuti = state.kutis.find(k => String(k.pagoda) === String(pagVal) && k.name === kutiVal);
        if (existingKuti) {
          finalKutiId = existingKuti.id;
        } else {
          // Create new Kuti
          try {
            const createRes = await api.post('/api/core/kutis/', { pagoda: pagVal, kuti_name: kutiVal, manager_name: '-' });
            if (createRes.ok && createRes.data) {
              finalKutiId = createRes.data.id;
              // update local state
              state.kutis.push({ id: finalKutiId, name: kutiVal, pagoda: pagVal });
            } else {
              throw new Error('Failed to create kuti');
            }
          } catch (e) {
            showToast('បរាជ័យក្នុងការបង្កើតកុដិថ្មី។', 'danger');
            btnSave.disabled = false;
            btnSave.innerHTML = `<i data-lucide="save" style="width:18px;height:18px;"></i> រក្សាទុក`;
            return;
          }
        }
      }

      if (dobVal) fd.append('date_of_birth', dobVal);
      if (phoneVal) fd.append('phone', phoneVal);
      if (natVal) fd.append('nationality', natVal);
      if (pagVal) fd.append('current_pagoda', pagVal);
      if (finalKutiId) fd.append('kuti', finalKutiId);
      if (selectedImageFile) fd.append('image_url', selectedImageFile);

      try {
        const res = await api.patch(`/api/students/list/${state.selected.id}/`, fd);
        if (res.ok) {
          showToast('បានរក្សាទុកព័ត៌មានដោយជោគជ័យ!', 'success');
          state.selected = null;
          await loadData();
        } else {
          showToast('បរាជ័យក្នុងការរក្សាទុកទិន្នន័យ។', 'danger');
        }
      } catch (err) {
        showToast('មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ', 'danger');
      } finally {
        if (btnSave) {
          btnSave.disabled = false;
          btnSave.innerHTML = `<i data-lucide="save" style="width:18px;height:18px;"></i> រក្សាទុក`;
        }
      }
    });
  }

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
  state = { students: [], classroomName: '', loading: true, selected: null, pagodas: [], kutis: [], nationalities: [], search: '', showFilters: false, pagodaFilter: 'all' };
  update();
  loadData();
}

export function destroy() {
  root = null;
  if (outsideClickHandler) { document.removeEventListener('click', outsideClickHandler); outsideClickHandler = null; }
}
