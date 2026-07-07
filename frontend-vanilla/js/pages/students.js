import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { createSearchSelect } from '../components/searchSelect.js';
import { onLiveInput } from '../utils/dom.js';
import { toKhmerNumerals } from '../utils/khmer.js';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { buildStandardReportElement } from '../components/reportTemplate.js';

let root = null;
let state = {
  students: [],
  loading: true,
  error: null,

  // Lookups
  nationalities: [],
  pagodas: [],
  kutis: [],
  educationLevels: [],
  provinces: [],

  // Filters
  searchQuery: '',
  classFilter: 'All',
  statusFilter: 'All',
  pagodaFilter: 'All',
  kutiFilter: 'All',
  provinceFilter: 'All',
  yearFilter: 'All',
  sortOrder: 'newest',

  // Pagination
  currentPage: 1,
  itemsPerPage: 10,

  selectedStudents: new Set(),
};

// --- API Calls ---

async function fetchLookups() {
  try {
    const [natRes, pagRes, kutRes, eduRes, provRes] = await Promise.all([
      api.get('/api/core/nationalities/'),
      api.get('/api/core/pagodas/'),
      api.get('/api/core/kutis/'),
      api.get('/api/core/education-levels/'),
      api.get('/api/core/provinces/')
    ]);
    if (natRes.ok) state.nationalities = natRes.data || [];
    if (pagRes.ok) state.pagodas = pagRes.data || [];
    if (kutRes.ok) state.kutis = kutRes.data || [];
    if (eduRes.ok) state.educationLevels = eduRes.data || [];
    if (provRes.ok) state.provinces = provRes.data || [];
  } catch (err) {
    console.error('Error fetching lookups:', err);
  }
}

// --- Filtering ---

function getFilteredStudents() {
  const { students, pagodas, searchQuery, pagodaFilter, kutiFilter, provinceFilter, yearFilter, sortOrder } = state;
  const pagodaProvince = (pagodaId) => {
    const p = pagodas.find(x => String(x.id) === String(pagodaId));
    return p ? p.province : null;
  };
  const filtered = students.filter(s => {
    if (s.is_deleted) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!String(s.first_name || '').toLowerCase().includes(q) &&
        !String(s.last_name || '').toLowerCase().includes(q) &&
        !String(s.phone || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    if (pagodaFilter && pagodaFilter !== 'All' && String(s.current_pagoda) !== String(pagodaFilter)) return false;
    if (kutiFilter && kutiFilter !== 'All' && String(s.kuti) !== String(kutiFilter)) return false;
    if (provinceFilter && provinceFilter !== 'All' && String(pagodaProvince(s.current_pagoda)) !== String(provinceFilter)) return false;
    if (yearFilter && yearFilter !== 'All' && (!s.created_at || String(new Date(s.created_at).getFullYear()) !== String(yearFilter))) return false;
    return true;
  });

  const getTime = (s) => {
    const ms = s.created_at ? new Date(s.created_at).getTime() : NaN;
    return Number.isNaN(ms) ? (s.id || 0) : ms;
  };
  filtered.sort((a, b) => sortOrder === 'oldest' ? getTime(a) - getTime(b) : getTime(b) - getTime(a));

  return filtered;
}

async function fetchStudents() {
  state.loading = true;
  update();
  try {
    const res = await api.get('/api/students/list/');
    if (!res.ok) throw new Error('បរាជ័យក្នុងការទាញយកបញ្ជីសិស្ស');
    state.students = res.data || [];
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

async function openStudentModal(editingStudent = null) {
  let provinces = [];
  let districts = [];
  let communes = [];
  let villages = [];

  try {
    const pRes = await api.get('/api/core/provinces/');
    if (pRes.ok) provinces = pRes.data || [];

    if (editingStudent && editingStudent.birth_province_code) {
      const dRes = await api.get(`/api/core/districts/?province_code=${editingStudent.birth_province_code}`);
      if (dRes.ok) districts = dRes.data || [];
    }
    if (editingStudent && editingStudent.birth_district_code) {
      const cRes = await api.get(`/api/core/communes/?district_code=${editingStudent.birth_district_code}`);
      if (cRes.ok) communes = cRes.data || [];
    }
    if (editingStudent && editingStudent.birth_commune_code) {
      const vRes = await api.get(`/api/core/villages/?commune_code=${editingStudent.birth_commune_code}`);
      if (vRes.ok) villages = vRes.data || [];
    }
  } catch (e) {
    console.error(e);
  }

  const formData = editingStudent ? { ...editingStudent } : {
    first_name: '', last_name: '', latin_name: '',
    nationality: '', gender: 'ប្រុស', date_of_birth: '', phone: '',
    monk_status: '', current_pagoda: '', kuti: '',
    education_level: '', birth_pagoda: '',
    birth_province_code: '', birth_district_code: '', birth_commune_code: '', birth_village_code: '',
    image_url: null,
    sanghatika_no: '', chaya_name: '', chaya_no: '', ordination_date: '', preceptor_name: ''
  };

  const wrap = document.createElement('div');
  wrap.style.width = '100%';

  function renderForm() {
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;">
        <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">${editingStudent ? 'កែប្រែព័ត៌មានសិស្ស' : 'បន្ថែមសិស្សថ្មី'}</h2>
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

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះឡាតាំង</label>
            <input type="text" data-f="latin_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.latin_name || ''}" />
          </div>
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ភេទ <span style="color:red">*</span></label>
            <div id="select-gender"></div>
          </div>
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃខែឆ្នាំកំណើត</label>
            <input type="date" data-f="date_of_birth" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.date_of_birth || ''}" />
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">លេខទូរស័ព្ទ <span style="color:red">*</span></label>
            <input type="text" data-f="phone" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.phone || ''}" required />
          </div>
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឋានៈព្រះសង្ឃ <span style="color:red">*</span></label>
            <div id="select-monk_status"></div>
          </div>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#f8fafc;">
          <h3 style="margin:0 0 16px 0;font-size:1rem;font-weight:600;">ទីកន្លែងកំណើត</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div>
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ខេត្ត</label>
              <div id="select-birth_province_code"></div>
            </div>
            <div>
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ស្រុក</label>
              <div id="select-birth_district_code"></div>
            </div>
            <div>
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឃុំ</label>
              <div id="select-birth_commune_code"></div>
            </div>
            <div>
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ភូមិ</label>
              <div id="select-birth_village_code"></div>
            </div>
          </div>
        </div>

        <!-- Monk fields container -->
        <div id="monk-fields" style="display:${formData.monk_status && formData.monk_status !== 'គ្រហស្ថ' ? 'block' : 'none'};">
          <div style="font-weight:bold;margin-bottom:12px;color:var(--primary);padding-top:16px;border-top:1px solid #e5e7eb;">ព័ត៌មានសម្រាប់ព្រះសង្ឃ</div>
                              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div id="field-sanghatika_no" style="display:${formData.monk_status === 'សាមណេរ' ? 'block' : 'none'};">
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">លេខសង្ឃាដិក</label>
              <input type="text" data-f="sanghatika_no" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.sanghatika_no || ''}" />
            </div>
            
            <div id="field-chaya_name" style="display:${formData.monk_status === 'ភិក្ខុ' ? 'block' : 'none'};">
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះឆាយា</label>
              <input type="text" data-f="chaya_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.chaya_name || ''}" />
            </div>
            <div id="field-chaya_no" style="display:${formData.monk_status === 'ភិក្ខុ' ? 'block' : 'none'};">
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">លេខឆាយា</label>
              <input type="text" data-f="chaya_no" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.chaya_no || ''}" />
            </div>
            
            <div id="field-ordination_date" style="display:block;">
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃបួស</label>
              <input type="date" data-f="ordination_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.ordination_date || ''}" />
            </div>
            <div id="field-preceptor_name" style="grid-column: span 2; display:block;">
              <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះព្រះឧបជ្ឈាយ៍</label>
              <input type="text" data-f="preceptor_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${formData.preceptor_name || ''}" />
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">វត្តបច្ចុប្បន្ន</label>
            <div id="select-current_pagoda"></div>
          </div>
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">កុដិ</label>
            <div id="select-kuti"></div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">កម្រិតវប្បធម៌</label>
            <div id="select-education_level"></div>
          </div>
        </div>

        <div style="display:flex; gap:12px; margin-top:24px; padding-top:20px; border-top:1px solid #e5e7eb;">
          <button type="button" data-action="cancel" style="flex:1; padding:12px; background-color:white; border:1px solid #d1d5db; border-radius:8px; cursor:pointer; font-weight:600; color:var(--text-secondary);">បោះបង់</button>
          ${!editingStudent ? `<button type="submit" data-action="save-continue" data-role="submit-continue" style="flex:1; padding:12px; background-color:#10b981; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">រក្សាទុក និងបន្ត</button>` : ''}
          <button type="submit" data-role="submit" style="flex:1; padding:12px; background-color:var(--primary); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">${editingStudent ? 'កែប្រែ' : 'រក្សាទុក'}</button>
        </div>
      </form>
    `;

    // Initialize Search Selects
    const getOptions = (arr, valKey, labelKey) => arr.map(i => ({ value: String(i[valKey]), label: i[labelKey] }));

    const genderSelect = createSearchSelect({
      options: [{ value: 'ប្រុស', label: 'ប្រុស' }, { value: 'ស្រី', label: 'ស្រី' }],
      value: formData.gender || 'ប្រុស',
      onChange: (v) => { formData.gender = v; updateFormFromDOM(); }
    });
    wrap.querySelector('#select-gender').appendChild(genderSelect.el);

    const monkStatusSelect = createSearchSelect({
      options: [{ value: 'គ្រហស្ថ', label: 'គ្រហស្ថ' }, { value: 'សាមណេរ', label: 'សាមណេរ' }, { value: 'ភិក្ខុ', label: 'ភិក្ខុ' }],
      value: formData.monk_status || '',
      placeholder: '-- ជ្រើសរើស --',
      onChange: (v) => { formData.monk_status = v; wrap.querySelector('[data-f="monk_status_virtual"]').value = v; wrap.querySelector('[data-f="monk_status_virtual"]').dispatchEvent(new Event('change')); updateFormFromDOM(); }
    });
    wrap.querySelector('#select-monk_status').appendChild(monkStatusSelect.el);
    const currentPagodaSelect = createSearchSelect({
      options: getOptions(state.pagodas, 'id', 'name'),
      value: formData.current_pagoda ? String(formData.current_pagoda) : '',
      placeholder: '-- ជ្រើសរើស --',
      onChange: (v) => { formData.current_pagoda = v; wrap.querySelector('[data-f="current_pagoda_virtual"]').value = v; wrap.querySelector('[data-f="current_pagoda_virtual"]').dispatchEvent(new Event('change')); updateFormFromDOM(); }
    });
    wrap.querySelector('#select-current_pagoda').appendChild(currentPagodaSelect.el);
    const eduSelect = createSearchSelect({
      options: getOptions(state.educationLevels, 'id', 'name'),
      value: formData.education_level ? String(formData.education_level) : '',
      placeholder: '-- ជ្រើសរើស --',
      onChange: (v) => { formData.education_level = v; updateFormFromDOM(); }
    });
    wrap.querySelector('#select-education_level').appendChild(eduSelect.el);

    const provSelect = createSearchSelect({
      options: getOptions(state.provinces, 'province_code', 'name_kh'),
      value: formData.birth_province_code || '',
      placeholder: '-- ជ្រើសរើស --',
      onChange: (v) => { formData.birth_province_code = v; wrap.querySelector('[data-f="birth_province_code_virtual"]').value = v; wrap.querySelector('[data-f="birth_province_code_virtual"]').dispatchEvent(new Event('change')); updateFormFromDOM(); }
    });
    wrap.querySelector('#select-birth_province_code').appendChild(provSelect.el);

    const distSelect = createSearchSelect({
      options: getOptions(districts, 'district_code', 'name_kh'),
      value: formData.birth_district_code || '',
      placeholder: '-- ជ្រើសរើស --',
      onChange: (v) => { formData.birth_district_code = v; wrap.querySelector('[data-f="birth_district_code_virtual"]').value = v; wrap.querySelector('[data-f="birth_district_code_virtual"]').dispatchEvent(new Event('change')); updateFormFromDOM(); }
    });
    wrap.querySelector('#select-birth_district_code').appendChild(distSelect.el);

    const commSelect = createSearchSelect({
      options: getOptions(communes, 'commune_code', 'name_kh'),
      value: formData.birth_commune_code || '',
      placeholder: '-- ជ្រើសរើស --',
      onChange: (v) => { formData.birth_commune_code = v; wrap.querySelector('[data-f="birth_commune_code_virtual"]').value = v; wrap.querySelector('[data-f="birth_commune_code_virtual"]').dispatchEvent(new Event('change')); updateFormFromDOM(); }
    });
    wrap.querySelector('#select-birth_commune_code').appendChild(commSelect.el);

    const vilSelect = createSearchSelect({
      options: getOptions(villages, 'village_code', 'name_kh'),
      value: formData.birth_village_code || '',
      placeholder: '-- ជ្រើសរើស --',
      onChange: (v) => { formData.birth_village_code = v; updateFormFromDOM(); }
    });
    wrap.querySelector('#select-birth_village_code').appendChild(vilSelect.el);

    // Hidden inputs to trigger events
    const hiddenInputs = `
      <input type="hidden" data-f="monk_status_virtual" value="${formData.monk_status || ''}" />
      <input type="hidden" data-f="current_pagoda_virtual" value="${formData.current_pagoda || ''}" />
      <input type="hidden" data-f="birth_province_code_virtual" value="${formData.birth_province_code || ''}" />
      <input type="hidden" data-f="birth_district_code_virtual" value="${formData.birth_district_code || ''}" />
      <input type="hidden" data-f="birth_commune_code_virtual" value="${formData.birth_commune_code || ''}" />
    `;
    const hiddenDiv = document.createElement('div');
    hiddenDiv.innerHTML = hiddenInputs;
    wrap.appendChild(hiddenDiv);


    // Re-bind Lucide icons
    if (window.lucide) window.lucide.createIcons({ root: wrap });

    // Events
    wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
    wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());

    let selectedFile = null;
    wrap.querySelector('#photo-input').addEventListener('change', function handlePhotoChange(e) {
      const file = e.target.files[0];
      if (file) {
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const container = wrap.querySelector('#photo-upload-container');
          container.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;" /><input type="file" id="photo-input" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;" />`;
          container.querySelector('#photo-input').addEventListener('change', handlePhotoChange);
        };
        reader.readAsDataURL(file);
      }
    });

    const updateFormFromDOM = () => {
      ['first_name', 'last_name', 'latin_name', 'date_of_birth', 'phone',
        'sanghatika_no', 'chaya_name', 'chaya_no', 'ordination_date', 'preceptor_name'].forEach(k => {
          const el = wrap.querySelector(`[data-f="${k}"]`);
          if (el) formData[k] = el.value;
        });
    };

    // Toggle monk fields
    wrap.querySelector('[data-f="monk_status_virtual"]').addEventListener('change', (e) => {
      const mf = wrap.querySelector('#monk-fields');
      const v = e.target.value;
      if (mf) {
        if (v && v !== 'គ្រហស្ថ') {
          mf.style.display = 'block';
          const fSanghatika = wrap.querySelector('#field-sanghatika_no');
          const fChayaName = wrap.querySelector('#field-chaya_name');
          const fChayaNo = wrap.querySelector('#field-chaya_no');

          if (fSanghatika) fSanghatika.style.display = v === 'សាមណេរ' ? 'block' : 'none';
          if (fChayaName) fChayaName.style.display = v === 'ភិក្ខុ' ? 'block' : 'none';
          if (fChayaNo) fChayaNo.style.display = v === 'ភិក្ខុ' ? 'block' : 'none';
        } else {
          mf.style.display = 'none';
          ['sanghatika_no', 'chaya_name', 'chaya_no', 'ordination_date', 'preceptor_name'].forEach(k => formData[k] = '');
        }
      }
    });

    // Location Cascading
    wrap.querySelector('[data-f="birth_province_code_virtual"]').addEventListener('change', async (e) => {
      formData.birth_province_code = e.target.value;
      formData.birth_district_code = ''; formData.birth_commune_code = ''; formData.birth_village_code = '';
      districts = []; communes = []; villages = [];
      if (formData.birth_province_code) {
        try {
          const res = await api.get(`/api/core/districts/?province_code=${formData.birth_province_code}`);
          if (res.ok) districts = res.data || [];
        } catch (err) { console.error(err); }
      }
      updateFormFromDOM(); renderForm();
    });

    wrap.querySelector('[data-f="birth_district_code_virtual"]').addEventListener('change', async (e) => {
      formData.birth_district_code = e.target.value;
      formData.birth_commune_code = ''; formData.birth_village_code = '';
      communes = []; villages = [];
      if (formData.birth_district_code) {
        try {
          const res = await api.get(`/api/core/communes/?district_code=${formData.birth_district_code}`);
          if (res.ok) communes = res.data || [];
        } catch (err) { console.error(err); }
      }
      updateFormFromDOM(); renderForm();
    });

    wrap.querySelector('[data-f="birth_commune_code_virtual"]').addEventListener('change', async (e) => {
      formData.birth_commune_code = e.target.value;
      formData.birth_village_code = '';
      villages = [];
      if (formData.birth_commune_code) {
        try {
          const res = await api.get(`/api/core/villages/?commune_code=${formData.birth_commune_code}`);
          if (res.ok) villages = res.data || [];
        } catch (err) { console.error(err); }
      }
      updateFormFromDOM(); renderForm();
    });


    const handleSubmit = async (isContinue) => {
      updateFormFromDOM();

      const errorBox = wrap.querySelector('[data-role="form-error"]');
      errorBox.style.display = 'none';

      // Duplicate check: name, sex, phone
      const isDuplicate = state.students.some(s =>
        s.first_name.trim().toLowerCase() === formData.first_name.trim().toLowerCase() &&
        s.last_name.trim().toLowerCase() === formData.last_name.trim().toLowerCase() &&
        s.gender === formData.gender &&
        (s.phone || '').trim() === (formData.phone || '').trim() &&
        (!editingStudent || String(s.id) !== String(editingStudent.id))
      );

      if (isDuplicate) {
        errorBox.textContent = 'ទិន្នន័យសិស្សនេះ (ឈ្មោះ ភេទ និងលេខទូរស័ព្ទ) មានរួចហើយ! សូមពិនិត្យឡើងវិញ។';
        errorBox.style.display = 'block';
        return;
      }

      const submitBtn = wrap.querySelector('[data-role="submit"]');
      const submitContBtn = wrap.querySelector('[data-role="submit-continue"]');
      submitBtn.disabled = true;
      if (submitContBtn) submitContBtn.disabled = true;

      try {
        const payload = new FormData();

        // Exclude helper location fields and image_url which is handled separately
        const excludeKeys = ['birth_province_code', 'birth_district_code', 'birth_commune_code', 'image_url'];

        if (!formData.status) formData.status = 'active';

        for (const [k, v] of Object.entries(formData)) {
          if (excludeKeys.includes(k)) continue;
          if (v !== '' && v !== null && v !== undefined) {
            payload.append(k, v);
          }
        }

        if (selectedFile) {
          payload.append('image_url', selectedFile);
        }

        const url = editingStudent ? `/api/students/list/${editingStudent.id}/` : '/api/students/list/';
        const method = editingStudent ? 'PATCH' : 'POST';
        const token = localStorage.getItem('access_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(url, {
          method,
          headers,
          body: payload
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || data.error || JSON.stringify(data) || 'បរាជ័យក្នុងការរក្សាទុក');
        }

        showToast(`បាន${editingStudent ? 'កែប្រែ' : 'បន្ថែម'}សិស្សដោយជោគជ័យ`, 'success');

        if (isContinue && !editingStudent) {
          // Reset form to add another one
          Object.keys(formData).forEach(k => {
            if (k !== 'gender' && k !== 'monk_status' && k !== 'nationality') formData[k] = '';
          });
          selectedFile = null;
          renderForm();
        } else {
          handle.close();
        }
        fetchStudents(); // Refresh list
      } catch (err) {
        errorBox.textContent = err.message;
        errorBox.style.display = 'block';
        submitBtn.disabled = false;
        if (submitContBtn) submitContBtn.disabled = false;
      }
    };

    wrap.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();

      // Determine which button was clicked
      const submitter = e.submitter;
      const isContinue = submitter && submitter.getAttribute('data-action') === 'save-continue';

      handleSubmit(isContinue);
    });


  }

  renderForm();
  const handle = openModal(wrap);
}

// --- View Detail ---

function openStudentViewModal(s) {
  const findName = (list, id, labelKey = 'name') => {
    if (!id) return null;
    const item = list.find(x => String(x.id) === String(id));
    return item ? item[labelKey] : null;
  };
  const nationalityName = findName(state.nationalities, s.nationality);
  const pagodaName = findName(state.pagodas, s.current_pagoda);
  const kutiName = findName(state.kutis, s.kuti, 'kuti_name');
  const educationName = findName(state.educationLevels, s.education_level);

  const wrap = document.createElement('div');
  wrap.style.margin = '-28px -32px';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';

  wrap.innerHTML = `
    <div style="padding:24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;border-top-left-radius:20px;border-top-right-radius:20px;">
      <h2 style="font-size:1.1rem;font-weight:700;color:var(--text-secondary);margin:0;">ព័ត៌មានលម្អិតសិស្ស</h2>
      <button data-action="close" style="width:40px;height:40px;border-radius:50%;background:#f1f5f9;border:none;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <i data-lucide="x" style="width:20px;height:20px;"></i>
      </button>
    </div>

    <div style="padding:32px;display:flex;flex-direction:column;gap:24px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="width:130px;height:130px;border-radius:50%;overflow:hidden;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:3px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,0.1);">
          ${s.image_url ? `<img src="${s.image_url}" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user" style="width:56px;height:56px;color:#cbd5e1;"></i>`}
        </div>
        <div style="text-align:center;">
          <h2 style="font-size:1.3rem;font-weight:800;color:var(--text-primary);margin:0;">${s.last_name || ''} ${s.first_name || ''}</h2>
          <span style="font-size:0.9rem;color:var(--text-secondary);font-weight:600;">កូដ: ${s.student_code || '---'}</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ឈ្មោះឡាតាំង</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${s.latin_name || '---'}</div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ភេទ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${s.gender || '---'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ឋានៈ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${s.monk_status || '---'}</div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">លេខទូរស័ព្ទ</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="phone" style="color:var(--primary);width:18px;height:18px;"></i>${s.phone || '---'}
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ថ្ងៃខែឆ្នាំកំណើត</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="calendar" style="color:#8b5cf6;width:18px;height:18px;"></i>${s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString('en-GB') : '---'}
          </div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">សញ្ជាតិ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${nationalityName || '---'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">វត្តបច្ចុប្បន្ន</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${pagodaName || '---'}</div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">កុដិ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${kutiName || '---'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">កម្រិតវប្បធម៌</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${educationName || '---'}</div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ស្ថានភាព</div>
          <div style="font-size:1.05rem;font-weight:800;">
            ${s.status === 'active' ? `<span style="color:#16a34a;">សកម្ម</span>` : `<span style="color:#dc2626;">${s.status || '---'}</span>`}
          </div>
        </div>
      </div>

      <div style="border-top:1px dashed var(--border);padding-top:20px;display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:0.85rem;color:var(--text-secondary);">
          <i data-lucide="scroll" style="width:16px;height:16px;color:var(--primary);"></i> ឯកសារព្រះសង្ឃ
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">លេខសង្ឃាដិក</div>
            <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${s.sanghatika_no || '---'}</div>
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ឈ្មោះឆាយា</div>
            <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${s.chaya_name || '---'}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">លេខឆាយា</div>
            <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${s.chaya_no || '---'}</div>
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ថ្ងៃបួស</div>
            <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
              <i data-lucide="calendar" style="color:#8b5cf6;width:18px;height:18px;"></i>${s.ordination_date ? new Date(s.ordination_date).toLocaleDateString('en-GB') : '---'}
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ឈ្មោះព្រះឧបជ្ឈាយ៍</div>
            <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${s.preceptor_name || '---'}</div>
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">កាលបរិច្ឆេទចុះឈ្មោះ</div>
            <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
              <i data-lucide="clock" style="color:#0ea5e9;width:18px;height:18px;"></i>${s.created_at ? new Date(s.created_at).toLocaleDateString('en-GB') : '---'}
            </div>
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
    openStudentModal(s);
  });
  wrap.querySelector('[data-action="delete"]').addEventListener('click', () => {
    handle.close();
    handleDeleteStudent(s.id);
  });

  const handle = openModal(wrap);
}

// --- Soft Delete ---

async function handleDeleteStudent(id) {
  if (!window.confirm('តើបងពិតជាចង់លុបសិស្សនេះមែនទេ? (លុបបណ្តោះអាសន្ន)')) return;
  try {
    const res = await api.del(`/api/students/list/${id}/`);
    if (!res.ok) throw new Error('បរាជ័យក្នុងការលុប');
    showToast('លុបសិស្សបានជោគជ័យ', 'success');
    fetchStudents();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --- Rendering ---

function update() {
  if (!root) return;
  const { students, loading, error, searchQuery, pagodas, kutis, provinces, pagodaFilter, kutiFilter, provinceFilter, yearFilter, sortOrder, currentPage, itemsPerPage } = state;

  // Distinct years (e.g. 2026, 2027, 2028...) present among students' created_at dates.
  const availableYears = Array.from(new Set(
    students.filter(s => s.created_at).map(s => new Date(s.created_at).getFullYear())
  )).sort((a, b) => b - a);

  // Filter
  const filtered = getFilteredStudents();

  // Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:24px;">
      
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">បញ្ជីសិស្សសរុប</h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">គ្រប់គ្រងទិន្នន័យសិស្សទាំងអស់ (${filtered.length} នាក់)</p>
        </div>
        <div style="display:flex;gap:12px;">
          ${state.selectedStudents && state.selectedStudents.size > 0 ? `
            <button class="btn btn-danger" data-action="delete-multiple" style="display:flex;align-items:center;gap:8px;background:var(--danger);color:white;border:none;">
              <i data-lucide="trash-2" style="width:18px;height:18px"></i> លុប (${state.selectedStudents.size})
            </button>
          ` : ''}

          

          <div data-role="telegram-wrapper" style="position:relative;">
            <button type="button" class="btn btn-outline" style="display:flex;align-items:center;gap:7px;background:#0088cc;color:#fff;border:none;">
              <i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px;"></i>
            </button>
            <div data-role="export-panel" style="display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid var(--border);border-radius:0 0 8px 8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:220px;overflow:hidden;">
              <button data-action="export-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> ផ្ញើ PDF ចូល Telegram</button>
              <button data-action="export-excel" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate"><i data-lucide="table" style="width:16px;height:16px;color:#10b981;"></i> ផ្ញើ Excel ចូល Telegram</button>
              <button data-action="export-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate"><i data-lucide="image" style="width:16px;height:16px;color:#0ea5e9;"></i> ផ្ញើរូបភាពចូល Telegram</button>
            </div>
          </div>

          <button class="btn btn-primary" data-action="add" style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="plus" style="width:18px;height:18px"></i> បន្ថែមសិស្ស
          </button>
        </div>
      </div>

      <div class="glass-panel" style="padding:20px;">
        <div style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;position:relative;">
            <i data-lucide="search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);width:18px;height:18px;"></i>
            <input type="text" data-f="search" class="form-input" placeholder="ស្វែងរកឈ្មោះ ឬលេខទូរស័ព្ទ..." value="${searchQuery}" style="width:100%;padding:10px 10px 10px 40px;border-radius:10px;border:1px solid var(--border);" />
          </div>
          <div data-role="filter-wrapper" style="position:relative;">
            <button type="button" class="btn btn-outline" style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:10px;">
              <i data-lucide="filter" style="width:16px;height:16px;"></i> ត្រង
              ${(pagodaFilter !== 'All' || kutiFilter !== 'All' || provinceFilter !== 'All' || yearFilter !== 'All') ? `<span style="background:var(--primary);color:#fff;border-radius:999px;width:18px;height:18px;font-size:0.7rem;display:flex;align-items:center;justify-content:center;">${(pagodaFilter !== 'All' ? 1 : 0) + (kutiFilter !== 'All' ? 1 : 0) + (provinceFilter !== 'All' ? 1 : 0) + (yearFilter !== 'All' ? 1 : 0)}</span>` : ''}
            </button>
            <div data-role="filter-panel" style="display:none;position:absolute;top:100%;right:0;background:#fff;border:1px solid var(--border);border-radius:0 0 12px 12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:240px;padding:16px;flex-direction:column;gap:14px;">
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">វត្តបច្ចុប្បន្ន</label>
                <div data-role="filter-pagoda-select"></div>
              </div>
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">កុដិ</label>
                <div data-role="filter-kuti-select"></div>
              </div>
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">ខេត្ត (តាមទីតាំងវត្ត)</label>
                <div data-role="filter-province-select"></div>
              </div>
              <div>
                <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">ឆ្នាំបង្កើត</label>
                <select data-f="filter-year" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
                  <option value="All" ${yearFilter === 'All' ? 'selected' : ''}>ទាំងអស់</option>
                  ${availableYears.map(y => `<option value="${y}" ${String(yearFilter) === String(y) ? 'selected' : ''}>${y}</option>`).join('')}
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
          </div>
        </div>

        ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;margin-bottom:20px;">${error}</div>` : ''}
        
        ${loading ? `<div style="text-align:center;padding:60px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>` : `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width:40px;text-align:center;"><input type="checkbox" data-action="select-all" ${paginated.length > 0 && paginated.every(s => state.selectedStudents && state.selectedStudents.has(s.id)) ? 'checked' : ''} /></th>
                  <th>ល.រ</th>
                  <th>រូបថត</th>
                  <th>ឈ្មោះ</th>
                  <th>ភេទ</th>
                  <th>ថ្ងៃខែឆ្នាំកំណើត</th>
                  <th>លេខទូរស័ព្ទ</th>
                  <th>ឋានៈ</th>
                  <th>វត្ត / កុដិ</th>
                  <th style="text-align:right;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${paginated.length === 0 ? `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted);">មិនមានទិន្នន័យ</td></tr>` : paginated.map((s, i) => {
    const pagodaName = pagodas.find(p => String(p.id) === String(s.current_pagoda))?.name;
    const kutiName = kutis.find(k => String(k.id) === String(s.kuti))?.kuti_name;
    return `
                  <tr class="hover-row">
                    <td style="text-align:center;"><input type="checkbox" data-action="select-item" data-id="${s.id}" ${state.selectedStudents && state.selectedStudents.has(s.id) ? 'checked' : ''} /></td>
                    <td>${startIdx + i + 1}</td>
                    <td>
                      <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
                        ${s.image_url ? `<img src="${s.image_url}" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user" style="width:20px;height:20px;color:#cbd5e1;"></i>`}
                      </div>
                    </td>
                    <td style="font-weight:600;color:var(--text-primary);">${s.last_name || ''} ${s.first_name || ''}</td>
                    <td>${s.gender || '---'}</td>
                    <td>${s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString('en-GB') : '---'}</td>
                    <td>${s.phone || '---'}</td>
                    <td><span style="background:rgba(79, 70, 229, 0.1);color:var(--primary);padding:4px 10px;border-radius:20px;font-size:0.8rem;font-weight:600;">${s.monk_status || '---'}</span></td>
                    <td>${pagodaName ? `${pagodaName}${kutiName ? ` / ${kutiName}` : ''}` : '---'}</td>
                    <td style="text-align:right;">
                      <button data-action="view" data-id="${s.id}" style="color:var(--text-secondary);background:none;border:none;cursor:pointer;padding:6px;" title="មើល"><i data-lucide="eye" style="width:18px;height:18px;"></i></button>
                      <button data-action="edit" data-id="${s.id}" style="color:var(--primary);background:none;border:none;cursor:pointer;padding:6px;" title="កែប្រែ"><i data-lucide="edit-3" style="width:18px;height:18px;"></i></button>
                      <button data-action="delete" data-id="${s.id}" style="color:var(--danger);background:none;border:none;cursor:pointer;padding:6px;" title="លុប"><i data-lucide="trash-2" style="width:18px;height:18px;"></i></button>
                    </td>
                  </tr>
                `}).join('')}
              </tbody>
              ${filtered.length > 0 ? `
                <tfoot>
                  <tr style="font-weight:700;background:#f8fafc;border-top:2px solid #e2e8f0;">
                    <td colspan="7" style="text-align:right;padding:16px;">សរុបសិស្ស: </td>
                    <td style="font-size:0.85rem;text-align:center;padding:16px;">បព្វជិត: ${toKhmerNumerals(filtered.filter(s => s.monk_status === 'ភិក្ខុ' || s.monk_status === 'សាមណេរ').length)} / គ្រហស្ថ: ${toKhmerNumerals(filtered.filter(s => s.monk_status === 'គ្រហស្ថ').length)}</td>
                    <td style="text-align:center;padding:16px;color:var(--primary);font-size:1.05rem;">${toKhmerNumerals(filtered.length)} <span style="font-size:0.9rem;font-weight:500;color:#64748b;">នាក់</span></td>
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
  root.querySelector('[data-action="add"]')?.addEventListener('click', () => openStudentModal(null));

  // Telegram hover dropdown
  const telegramWrapper = root.querySelector('[data-role="telegram-wrapper"]');
  const exportPanel = root.querySelector('[data-role="export-panel"]');
  if (telegramWrapper && exportPanel) {
    telegramWrapper.addEventListener('mouseenter', () => { exportPanel.style.display = 'block'; });
    telegramWrapper.addEventListener('mouseleave', () => { exportPanel.style.display = 'none'; });
  }
  root.querySelector('[data-action="export-pdf"]')?.addEventListener('click', () => { if (exportPanel) exportPanel.style.display = 'none'; handleExport('pdf'); });
  root.querySelector('[data-action="export-excel"]')?.addEventListener('click', () => { if (exportPanel) exportPanel.style.display = 'none'; handleExport('excel'); });
  root.querySelector('[data-action="export-image"]')?.addEventListener('click', () => { if (exportPanel) exportPanel.style.display = 'none'; handleExport('image'); });

  // Filter hover dropdown
  const filterWrapper = root.querySelector('[data-role="filter-wrapper"]');
  const filterPanel = root.querySelector('[data-role="filter-panel"]');
  if (filterWrapper && filterPanel) {
    filterWrapper.addEventListener('mouseenter', () => { filterPanel.style.display = 'flex'; });
    filterWrapper.addEventListener('mouseleave', () => { filterPanel.style.display = 'none'; });
  }
  root.querySelector('[data-action="clear-filters"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.pagodaFilter = 'All';
    state.kutiFilter = 'All';
    state.provinceFilter = 'All';
    state.yearFilter = 'All';
    state.currentPage = 1;
    update();
  });

  const pagodaSelectContainer = root.querySelector('[data-role="filter-pagoda-select"]');
  if (pagodaSelectContainer) {
    // Only offer pagodas that are actually assigned to at least one student
    // (current_pagoda), instead of every pagoda in the master table.
    const usedPagodaIds = new Set(students.map(s => s.current_pagoda).filter(Boolean).map(String));
    const pagodaOptions = pagodas
      .filter(p => usedPagodaIds.has(String(p.id)))
      .map(p => ({ value: String(p.id), label: p.name }));
    const pagodaSelect = createSearchSelect({
      options: pagodaOptions,
      value: pagodaFilter !== 'All' ? String(pagodaFilter) : '',
      placeholder: 'ទាំងអស់',
      onChange: (v) => {
        state.pagodaFilter = v || 'All';
        state.currentPage = 1;
        update();
      },
    });
    pagodaSelectContainer.appendChild(pagodaSelect.el);
  }

  const kutiSelectContainer = root.querySelector('[data-role="filter-kuti-select"]');
  if (kutiSelectContainer) {
    // Only offer kutis that are actually assigned to at least one student (kuti id),
    // mirroring the same "in use" restriction as the pagoda filter above.
    const usedKutiIds = new Set(students.map(s => s.kuti).filter(Boolean).map(String));
    const kutiOptions = kutis
      .filter(k => usedKutiIds.has(String(k.id)))
      .map(k => ({ value: String(k.id), label: k.kuti_name }));
    const kutiSelect = createSearchSelect({
      options: kutiOptions,
      value: kutiFilter !== 'All' ? String(kutiFilter) : '',
      placeholder: 'ទាំងអស់',
      onChange: (v) => {
        state.kutiFilter = v || 'All';
        state.currentPage = 1;
        update();
      },
    });
    kutiSelectContainer.appendChild(kutiSelect.el);
  }

  const provinceSelectContainer = root.querySelector('[data-role="filter-province-select"]');
  if (provinceSelectContainer) {
    const provinceSelect = createSearchSelect({
      options: provinces.map(p => ({ value: String(p.province_code), label: p.name_kh })),
      value: provinceFilter !== 'All' ? String(provinceFilter) : '',
      placeholder: 'ទាំងអស់',
      onChange: (v) => {
        state.provinceFilter = v || 'All';
        state.currentPage = 1;
        update();
      },
    });
    provinceSelectContainer.appendChild(provinceSelect.el);
  }

  root.querySelector('[data-f="filter-year"]')?.addEventListener('change', (e) => {
    state.yearFilter = e.target.value;
    state.currentPage = 1;
    update();
  });

  root.querySelector('[data-f="filter-sort"]')?.addEventListener('change', (e) => {
    state.sortOrder = e.target.value;
    state.currentPage = 1;
    update();
  });


  root.querySelectorAll('button[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = students.find(x => String(x.id) === btn.dataset.id);
      if (s) openStudentViewModal(s);
    });
  });

  root.querySelectorAll('button[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = students.find(x => String(x.id) === btn.dataset.id);
      if (s) openStudentModal(s);
    });
  });

  root.querySelectorAll('button[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteStudent(btn.dataset.id));
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

  root.querySelector('[data-action="prev-page"]')?.addEventListener('click', () => {
    if (state.currentPage > 1) { state.currentPage--; update(); }
  });
  root.querySelector('[data-action="next-page"]')?.addEventListener('click', () => {
    if (state.currentPage < totalPages) { state.currentPage++; update(); }
  });

  root.querySelector('[data-action="select-all"]')?.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    if (!state.selectedStudents) state.selectedStudents = new Set();

    if (isChecked) {
      paginated.forEach(s => state.selectedStudents.add(s.id));
    } else {
      paginated.forEach(s => state.selectedStudents.delete(s.id));
    }
    update();
  });

  root.querySelectorAll('input[data-action="select-item"]').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id, 10);
      if (!state.selectedStudents) state.selectedStudents = new Set();
      if (e.target.checked) {
        state.selectedStudents.add(id);
      } else {
        state.selectedStudents.delete(id);
      }
      update();
    });
  });

  root.querySelector('[data-action="delete-multiple"]')?.addEventListener('click', async () => {
    if (!state.selectedStudents || state.selectedStudents.size === 0) return;
    if (!window.confirm(`តើបងពិតជាចង់លុបសិស្សទាំង ${state.selectedStudents.size} នាក់មែនទេ? (លុបបណ្តោះអាសន្ន)`)) return;

    try {
      const ids = Array.from(state.selectedStudents);
      await Promise.all(ids.map(id => api.del(`/api/students/list/${id}/`)));
      showToast(`បានលុបដោយជោគជ័យចំនួន ${ids.length} នាក់`, 'success');
      state.selectedStudents.clear();
      fetchStudents();
    } catch (err) {
      showToast('បរាជ័យក្នុងការលុប', 'error');
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = {
    students: [], loading: true, error: null,
    nationalities: [], pagodas: [], kutis: [], educationLevels: [], provinces: [],
    searchQuery: '', classFilter: 'All', statusFilter: 'All', pagodaFilter: 'All',
    kutiFilter: 'All', provinceFilter: 'All', yearFilter: 'All', sortOrder: 'newest',
    currentPage: 1, itemsPerPage: 15,
    selectedStudents: new Set(),
  };
  update();
  fetchLookups().then(fetchStudents);
}

export function destroy() {
  root = null;
}


// --- Telegram Send (aggregate summary only -- no student names/phone/photos) ---

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

// Builds a text-only aggregate summary -- counts by status/gender/monk_status/pagoda --
// with no individually identifying fields (no names, phone numbers, or photos).
function buildStudentsSummaryText(list) {
  const countBy = (key, resolve) => {
    const counts = {};
    list.forEach(s => {
      const label = resolve ? resolve(s[key]) : (s[key] || 'មិនបញ្ជាក់');
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  };

  const genderCounts = countBy('gender');
  const monkCounts = countBy('monk_status');
  const activeCount = list.filter(s => s.status === 'active').length;
  const inactiveCount = list.length - activeCount;
  const pagodaCounts = countBy('current_pagoda', (id) => {
    if (!id) return 'មិនទាន់កំណត់';
    return state.pagodas.find(p => String(p.id) === String(id))?.name || 'មិនទាន់កំណត់';
  });

  const lines = [];
  lines.push(`<b>📊 សង្ខេបបញ្ជីសិស្ស</b>`);
  lines.push(`សិស្សសរុប: <b>${list.length}</b> នាក់`);
  lines.push('');
  lines.push(`<b>ភេទ</b>`);
  Object.entries(genderCounts).forEach(([k, v]) => lines.push(`• ${k}: ${v}`));
  lines.push('');
  lines.push(`<b>ឋានៈ</b>`);
  Object.entries(monkCounts).forEach(([k, v]) => lines.push(`• ${k}: ${v}`));
  lines.push('');
  lines.push(`<b>ស្ថានភាព</b>`);
  lines.push(`• សកម្ម: ${activeCount}`);
  lines.push(`• អសកម្ម: ${inactiveCount}`);
  lines.push('');
  lines.push(`<b>វត្តបច្ចុប្បន្ន</b>`);
  Object.entries(pagodaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([k, v]) => lines.push(`• ${k}: ${v}`));

  return lines.join('\n');
}

async function handleSendTelegramSummary() {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  const btn = root.querySelector('[data-action="send-tg-summary"]');
  if (btn) btn.disabled = true;
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite;"></i> កំពុងផ្ញើ...';
  if (window.lucide) window.lucide.createIcons();

  try {
    const list = getFilteredStudents();
    const text = buildStudentsSummaryText(list);
    const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgConfig.chatId, text, parse_mode: 'HTML' })
    });
    if (!res.ok) throw new Error('telegram-send-failed');
    showToast('បានផ្ញើសង្ខេបបញ្ជីសិស្សចូល Telegram ដោយជោគជ័យ', 'success');
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យក្នុងការផ្ញើចូល Telegram', 'error');
  } finally {
    const refreshedBtn = root.querySelector('[data-action="send-tg-summary"]');
    if (refreshedBtn) { refreshedBtn.disabled = false; refreshedBtn.innerHTML = originalHtml; }
    if (window.lucide) window.lucide.createIcons();
  }
}

// --- Export Logic ---
function getReportElement(list) {
  const listToExport = list || state.students;
  const ROWS_PER_PAGE = 15;
  const totalPages = Math.ceil(listToExport.length / ROWS_PER_PAGE) || 1;

  // Use a fixed zero-size host — position:absolute/-9999px makes html2canvas
  // measure layout box as zero height, producing blank exports.
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
    const chunk = listToExport.slice(startIndex, startIndex + ROWS_PER_PAGE);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>ល.រ</th>
        <th>អត្តលេខ</th>
        <th>គោត្តនាម-នាម</th>
        <th>ឡាតាំង</th>
        <th>ភេទ</th>
        <th>ថ្ងៃខែឆ្នាំកំណើត</th>
        <th>ទូរស័ព្ទ</th>
        <th>ឋានៈ</th>
        <th>វត្តបច្ចុប្បន្ន</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    chunk.forEach((s, chunkIdx) => {
      const idx = startIndex + chunkIdx;
      const tr = document.createElement('tr');
      const pagodaName = state.pagodas.find(p => String(p.id) === String(s.current_pagoda))?.name || '';
      const dob = s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString('en-GB') : '';

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${s.student_code || ''}</td>
        <td style="text-align:left;">${s.last_name || ''} ${s.first_name || ''}</td>
        <td style="text-align:left;">${s.latin_name || ''}</td>
        <td>${s.gender || ''}</td>
        <td>${dob}</td>
        <td>${s.phone || ''}</td>
        <td>${s.monk_status || ''}</td>
        <td style="text-align:left;">${pagodaName}</td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    const pageInfo = `${i + 1}/${totalPages}`;
    const pageContainer = buildStandardReportElement('របាយការណ៍បញ្ជីឈ្មោះសិស្ស', table, null, 'landscape', pageInfo);
    
    if (i < totalPages - 1) {
      pageContainer.style.pageBreakAfter = 'always';
    }

    wrapper.appendChild(pageContainer);
    pages.push(pageContainer);
  }

  hiddenHost.appendChild(wrapper);
  document.body.appendChild(hiddenHost);
  return { container: wrapper, wrapper, hiddenHost, pages };
}

export async function handleExport(type, list) {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  const listToExport = list || state.students;
  if (!listToExport.length) {
    showToast('គ្មានទិន្នន័យសម្រាប់ទាញយកទេ', 'error');
    return;
  }

  const tgBtn = root?.querySelector('[data-role="telegram-wrapper"] > button');
  let tgBtnOrigHTML = null;
  if (tgBtn) {
    tgBtnOrigHTML = tgBtn.innerHTML;
    tgBtn.disabled = true;
    if (!document.getElementById('tg-spin-style')) {
      const s = document.createElement('style');
      s.id = 'tg-spin-style';
      s.textContent = '@keyframes tg-spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }
    tgBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2.5px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:tg-spin 0.75s linear infinite;flex-shrink:0;"></span> កំពុងផ្ញើ...';
  }
  const restoreTgBtn = () => {
    if (tgBtn && tgBtnOrigHTML !== null) {
      tgBtn.disabled = false;
      tgBtn.innerHTML = tgBtnOrigHTML;
    }
  };

  if (type === 'excel') {
    try {
      const data = listToExport.map((s, idx) => {
        const pagodaName = state.pagodas.find(p => String(p.id) === String(s.current_pagoda))?.name || '';
        const kutiName = state.kutis.find(k => String(k.id) === String(s.kuti))?.kuti_name || '';
        const eduName = state.educationLevels.find(e => String(e.id) === String(s.education_level))?.name || '';
        return {
          'ល.រ': idx + 1,
          'អត្តលេខ': s.student_code || '',
          'នាមត្រកូល': s.last_name || '',
          'នាមខ្លួន': s.first_name || '',
          'ឡាតាំង': s.latin_name || '',
          'ភេទ': s.gender || '',
          'ថ្ងៃខែឆ្នាំកំណើត': s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString('en-GB') : '',
          'ទូរស័ព្ទ': s.phone || '',
          'ឋានៈ': s.monk_status || '',
          'វត្តបច្ចុប្បន្ន': pagodaName,
          'កុដិ': kutiName,
          'កម្រិតវប្បធម៌': eduName
        };
      });

      if (data.length > 0) {
        const monkCount = listToExport.filter(s => s.monk_status === 'ភិក្ខុ' || s.monk_status === 'សាមណេរ').length;
        const laypersonCount = listToExport.filter(s => s.monk_status === 'គ្រហស្ថ').length;
        data.push({
          'ល.រ': 'សរុបសិស្ស:',
          'អត្តលេខ': '',
          'នាមត្រកូល': '',
          'នាមខ្លួន': '',
          'ឡាតាំង': '',
          'ភេទ': '',
          'ថ្ងៃខែឆ្នាំកំណើត': '',
          'ទូរស័ព្ទ': '',
          'ឋានៈ': `បព្វជិត: ${monkCount} / គ្រហស្ថ: ${laypersonCount}`,
          'វត្តបច្ចុប្បន្ន': `${data.length} នាក់`,
          'កុដិ': '',
          'កម្រិតវប្បធម៌': ''
        });
      }
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const formData = new FormData();
      formData.append('chat_id', tgConfig.chatId);
      formData.append('document', blob, 'Student_Report.xlsx');
      formData.append('caption', 'របាយការណ៍បញ្ជីឈ្មោះសិស្ស (Excel)');

      const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('telegram-send-failed');
      showToast('បានផ្ញើ Excel ចូល Telegram ដោយជោគជ័យ', 'success');
    } catch (err) {
      console.error(err);
      showToast('បរាជ័យក្នុងការផ្ញើ Excel', 'error');
    } finally {
      restoreTgBtn();
    }
    return;
  }

  const { container, wrapper, hiddenHost, pages } = getReportElement(listToExport);

  try {
    if (type === 'pdf') {
      const opt = {
        margin: 10,
        filename: 'Student_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
      const pdfBlob = await html2pdf().set(opt).from(container).output('blob');

      const formData = new FormData();
      formData.append('chat_id', tgConfig.chatId);
      formData.append('document', pdfBlob, 'Student_Report.pdf');
      formData.append('caption', 'របាយការណ៍បញ្ជីឈ្មោះសិស្ស (PDF)');

      const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('telegram-send-failed');
      showToast('បានផ្ញើ PDF ចូល Telegram ដោយជោគជ័យ', 'success');

    } else if (type === 'image' || type === 'telegram') {
      const blobs = [];
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.98));
        if (blob) blobs.push(blob);
      }

      const formData = new FormData();
      formData.append('chat_id', tgConfig.chatId);
      
      if (blobs.length === 1) {
         formData.append('photo', blobs[0], 'Student_Report.png');
         formData.append('caption', 'របាយការណ៍បញ្ជីឈ្មោះសិស្ស');
         const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendPhoto`, {
           method: 'POST',
           body: formData
         });
         if (!res.ok) throw new Error('telegram-send-failed');
      } else {
         const mediaArray = [];
         blobs.forEach((blob, i) => {
           formData.append(`photo${i}`, blob, `Student_Report_Page${i+1}.png`);
           mediaArray.push({
             type: 'photo',
             media: `attach://photo${i}`,
             caption: i === 0 ? `របាយការណ៍បញ្ជីឈ្មោះសិស្ស (សរុប ${blobs.length} ទំព័រ)` : ''
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
    }
  } catch (err) {
    console.error(err);
    showToast('មានបញ្ហាក្នុងការបង្កើត និងផ្ញើរបាយការណ៍', 'error');
  } finally {
    if (hiddenHost && hiddenHost.parentNode) {
      document.body.removeChild(hiddenHost);
    }
    restoreTgBtn();
  }
}
