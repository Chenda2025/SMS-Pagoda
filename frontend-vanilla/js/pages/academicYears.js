import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import * as docx from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

let root = null;
const ITEMS_PER_PAGE = 10;
let state = {
  years: [],
  periods: [],
  selectedYear: null,
  activeTab: localStorage.getItem('ay_activeTab') || 'years', // 'years' or 'periods'
  selectedPeriodIds: new Set(),
  yearsPage: 1,
  periodsPage: 1,
  showExportMenu: false,
  loading: true,
  error: null
};

const DEFAULT_PERIOD_TYPES = ['ឆមាស', 'ត្រីមាស', 'ប្រចាំខែ'];

function getPeriodTypeOptions() {
  const custom = JSON.parse(localStorage.getItem('ay_customPeriodTypes') || '[]');
  return [...new Set([...DEFAULT_PERIOD_TYPES, ...custom])];
}

function addCustomPeriodType(name) {
  const custom = JSON.parse(localStorage.getItem('ay_customPeriodTypes') || '[]');
  if (!custom.includes(name)) {
    custom.push(name);
    localStorage.setItem('ay_customPeriodTypes', JSON.stringify(custom));
  }
}

// DRF validation errors come back keyed by field name (e.g. {"period_type": ["..."]})
// rather than under `detail`/`error`, so the generic fallback was swallowing the
// real reason for every save failure (too-long custom type, bad year id, etc.).
function extractApiError(data) {
  if (!data) return null;
  if (data.detail) return data.detail;
  if (data.error) return data.error;
  if (typeof data === 'object') {
    const messages = Object.entries(data)
      .map(([field, val]) => Array.isArray(val) ? val.join(' ') : String(val))
      .filter(Boolean);
    if (messages.length > 0) return messages.join(' / ');
  }
  return null;
}

// Years sorted chronologically after the currently selected year (closest first).
function getCandidateNextYears() {
  if (!state.selectedYear) return [];
  return state.years
    .filter(y => new Date(y.start_date) > new Date(state.selectedYear.start_date))
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
}

// --- API Calls ---

async function fetchYears() {
  try {
    const res = await api.get('/api/academic-years/');
    if (!res.ok) throw new Error('បរាជ័យក្នុងការទាញយកឆ្នាំសិក្សា');
    // Sort: is_current first, then by start_date descending
    const sorted = (res.data || []).sort((a, b) => {
      if (a.is_current && !b.is_current) return -1;
      if (!a.is_current && b.is_current) return 1;
      return new Date(b.start_date) - new Date(a.start_date);
    });
    state = { ...state, years: sorted, loading: false, error: null };

    if (!state.selectedYear && sorted.length > 0) {
      state.selectedYear = sorted[0];
      await fetchPeriods(sorted[0].id);
    }
  } catch (err) {
    state = { ...state, error: err.message, loading: false };
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យ', 'error');
  }
  update();
}

async function fetchPeriods(yearId) {
  try {
    const res = await api.get(`/api/academic-periods/?academic_year=${yearId}`);
    if (res.ok) {
      state.periods = (res.data || []).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      update();
    }
  } catch (err) {
    console.error(err);
  }
}

// --- Modals ---

function openYearModal(editingYear = null) {
  const formData = editingYear ? {
    year_name: editingYear.year_name || '',
    start_date: editingYear.start_date ? editingYear.start_date.split('T')[0] : '',
    end_date: editingYear.end_date ? editingYear.end_date.split('T')[0] : '',
    is_current: !!editingYear.is_current
  } : {
    year_name: '',
    start_date: '',
    end_date: '',
    is_current: false
  };

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">${editingYear ? 'កែប្រែឆ្នាំសិក្សា' : 'បន្ថែមឆ្នាំសិក្សាថ្មី'}</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>
    
    <form style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះឆ្នាំសិក្សា (ឧ. ២០២៣-២០២៤) <span style="color:red">*</span></label>
        <input type="text" data-f="year_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃចាប់ផ្តើម <span style="color:red">*</span></label>
          <input type="date" data-f="start_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃបញ្ចប់ <span style="color:red">*</span></label>
          <input type="date" data-f="end_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
      </div>
      
      <div style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="chk_current" data-f="is_current" style="width:18px;height:18px;cursor:pointer;" />
        <label for="chk_current" style="cursor:pointer;font-weight:500;font-size:0.875rem;">កំណត់ជាឆ្នាំបច្ចុប្បន្ន</label>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">${editingYear ? 'កែប្រែ' : 'រក្សាទុក'}</button>
      </div>
    </form>
  `;

  wrap.querySelector('[data-f="year_name"]').value = formData.year_name;
  wrap.querySelector('[data-f="start_date"]').value = formData.start_date;
  wrap.querySelector('[data-f="end_date"]').value = formData.end_date;
  wrap.querySelector('[data-f="is_current"]').checked = formData.is_current;

  async function handleSubmit(e) {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
    errorBox.style.display = 'none';
    const submitBtn = wrap.querySelector('[data-role="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'កំពុងរក្សាទុក...';

    const payload = {
      year_name: wrap.querySelector('[data-f="year_name"]').value,
      start_date: wrap.querySelector('[data-f="start_date"]').value,
      end_date: wrap.querySelector('[data-f="end_date"]').value,
      is_current: wrap.querySelector('[data-f="is_current"]').checked
    };

    try {
      let res;
      if (editingYear) {
        res = await api.put(`/api/academic-years/${editingYear.id}/`, payload);
      } else {
        res = await api.post('/api/academic-years/', payload);
      }

      if (!res.ok) throw new Error(extractApiError(res.data) || 'បរាជ័យក្នុងការរក្សាទុក');

      showToast(`បាន${editingYear ? 'កែប្រែ' : 'បន្ថែម'}ឆ្នាំសិក្សាដោយជោគជ័យ`, 'success');
      handle.close();
      fetchYears();
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = `${editingYear ? 'កែប្រែ' : 'រក្សាទុក'}`;
    }
  }

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', handleSubmit);

  const handle = openModal(wrap);
}

async function handleDeleteYear(id) {
  if (!window.confirm('តើបងពិតជាចង់លុបឆ្នាំសិក្សានេះមែនទេ?')) return;
  try {
    const res = await api.del(`/api/academic-years/${id}/`);
    if (!res.ok) throw new Error('បរាជ័យក្នុងការលុប');
    showToast('លុបឆ្នាំសិក្សាបានជោគជ័យ', 'success');
    if (state.selectedYear && String(state.selectedYear.id) === String(id)) {
      state.selectedYear = null;
      state.periods = [];
    }
    fetchYears();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openPeriodModal(editingPeriod = null) {
  if (!state.selectedYear) {
    showToast('សូមជ្រើសរើសឆ្នាំសិក្សាមុននឹងបន្ថែមឆមាស', 'error');
    return;
  }

  const formData = editingPeriod ? {
    period_type: editingPeriod.period_type || 'ឆមាស',
    period_number: editingPeriod.period_number || 1,
    name: editingPeriod.name || '',
    start_date: editingPeriod.start_date ? editingPeriod.start_date.split('T')[0] : '',
    end_date: editingPeriod.end_date ? editingPeriod.end_date.split('T')[0] : ''
  } : {
    period_type: 'ឆមាស',
    period_number: 1,
    name: '',
    start_date: '',
    end_date: ''
  };

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">${editingPeriod ? 'កែប្រែឆមាស' : 'បន្ថែមឆមាសថ្មី'}</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>
    
    <form style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ប្រភេទ <span style="color:red">*</span></label>
          <div style="display:flex;gap:8px;align-items:center;">
            <select data-f="period_type" class="form-input" style="flex:1;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required>
              ${getPeriodTypeOptions().map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
            <button type="button" data-action="add-period-type" title="បន្ថែមប្រភេទថ្មី" style="flex-shrink:0;width:38px;height:38px;display:flex;align-items:center;justify-content:center;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:var(--primary);cursor:pointer;">
              <i data-lucide="plus-circle" style="width:18px;height:18px;"></i>
            </button>
          </div>
          <div data-role="add-period-type-form" style="display:none;margin-top:10px;gap:8px;align-items:center;">
            <input type="text" data-f="new_period_type" maxlength="15" placeholder="ឈ្មោះប្រភេទថ្មី" class="form-input" style="flex:1;padding:8px;border-radius:8px;border:1px solid #d1d5db;" />
            <button type="button" data-action="confirm-period-type" style="flex-shrink:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:none;border-radius:8px;background:var(--success);color:#fff;cursor:pointer;"><i data-lucide="check" style="width:16px;height:16px;"></i></button>
            <button type="button" data-action="cancel-period-type" style="flex-shrink:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:var(--text-secondary);cursor:pointer;"><i data-lucide="x" style="width:16px;height:16px;"></i></button>
          </div>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">លេខរៀង <span style="color:red">*</span></label>
          <input type="number" min="1" data-f="period_number" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
      </div>
      <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះ (ឧ. ឆមាសទី១) <span style="color:red">*</span></label>
          <input type="text" data-f="name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃចាប់ផ្តើម <span style="color:red">*</span></label>
          <input type="date" data-f="start_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃបញ្ចប់ <span style="color:red">*</span></label>
          <input type="date" data-f="end_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">${editingPeriod ? 'កែប្រែ' : 'រក្សាទុក'}</button>
      </div>
    </form>
  `;

  wrap.querySelector('[data-f="period_type"]').value = formData.period_type;
  wrap.querySelector('[data-f="period_number"]').value = formData.period_number;
  wrap.querySelector('[data-f="name"]').value = formData.name;
  wrap.querySelector('[data-f="start_date"]').value = formData.start_date;
  wrap.querySelector('[data-f="end_date"]').value = formData.end_date;

  const addTypeForm = wrap.querySelector('[data-role="add-period-type-form"]');
  const newTypeInput = wrap.querySelector('[data-f="new_period_type"]');
  const typeSelect = wrap.querySelector('[data-f="period_type"]');

  wrap.querySelector('[data-action="add-period-type"]').addEventListener('click', () => {
    addTypeForm.style.display = 'flex';
    newTypeInput.value = '';
    newTypeInput.focus();
  });

  wrap.querySelector('[data-action="cancel-period-type"]').addEventListener('click', () => {
    addTypeForm.style.display = 'none';
  });

  wrap.querySelector('[data-action="confirm-period-type"]').addEventListener('click', () => {
    const name = newTypeInput.value.trim();
    if (!name) { showToast('សូមបញ្ចូលឈ្មោះប្រភេទ', 'error'); return; }
    if (![...typeSelect.options].some(o => o.value === name)) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      typeSelect.appendChild(opt);
    }
    addCustomPeriodType(name);
    typeSelect.value = name;
    addTypeForm.style.display = 'none';
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
    errorBox.style.display = 'none';
    const submitBtn = wrap.querySelector('[data-role="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'កំពុងរក្សាទុក...';

    const payload = {
      academic_year: state.selectedYear.id,
      period_type: wrap.querySelector('[data-f="period_type"]').value,
      period_number: parseInt(wrap.querySelector('[data-f="period_number"]').value, 10),
      name: wrap.querySelector('[data-f="name"]').value,
      start_date: wrap.querySelector('[data-f="start_date"]').value,
      end_date: wrap.querySelector('[data-f="end_date"]').value
    };

    try {
      let res;
      if (editingPeriod) {
        res = await api.put(`/api/academic-periods/${editingPeriod.id}/`, payload);
      } else {
        res = await api.post('/api/academic-periods/', payload);
      }

      if (!res.ok) throw new Error(extractApiError(res.data) || 'បរាជ័យក្នុងការរក្សាទុក');

      showToast(`បាន${editingPeriod ? 'កែប្រែ' : 'បន្ថែម'}ឆមាសដោយជោគជ័យ`, 'success');
      handle.close();
      fetchPeriods(state.selectedYear.id);
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = `${editingPeriod ? 'កែប្រែ' : 'រក្សាទុក'}`;
    }
  }

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', handleSubmit);

  const handle = openModal(wrap);
}

async function handleDeletePeriod(id) {
  if (!window.confirm('តើបងពិតជាចង់លុបឆមាសនេះមែនទេ?')) return;
  try {
    const res = await api.del(`/api/academic-periods/${id}/`);
    if (!res.ok) throw new Error('បរាជ័យក្នុងការលុប');
    showToast('លុបឆមាសបានជោគជ័យ', 'success');
    fetchPeriods(state.selectedYear.id);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Promotes one or more periods (single row action, or bulk via the selection
// checkboxes) by copying them into a target academic year -- mirrors React's
// per-period "ចម្លង" (copy) feature but supports promoting many at once.
function openPromoteModal(periodsToPromote) {
  const candidateYears = getCandidateNextYears();
  const fallbackYears = state.years.filter(y => String(y.id) !== String(state.selectedYear.id));
  const targetOptions = candidateYears.length > 0 ? candidateYears : fallbackYears;

  if (targetOptions.length === 0) {
    showToast('សូមបង្កើតឆ្នាំសិក្សាថ្មីជាមុនសិន មុននឹងប្តូរទៅឆ្នាំក្រោយ', 'error');
    return;
  }

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">ប្តូរ${periodsToPromote.length > 1 ? ` (${periodsToPromote.length})` : ''}ទៅឆ្នាំសិក្សាក្រោយ</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>

    <div style="margin-bottom:16px;padding:12px;background:#f8fafc;border-radius:8px;max-height:160px;overflow-y:auto;">
      ${periodsToPromote.map(p => `<div style="font-size:0.85rem;color:var(--text-secondary);padding:4px 0;">• ${p.name} (${p.period_type})</div>`).join('')}
    </div>

    <form style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ប្តូរទៅឆ្នាំសិក្សា <span style="color:red">*</span></label>
        <select data-f="target_year" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required>
          ${targetOptions.map(y => `<option value="${y.id}">${y.year_name}</option>`).join('')}
        </select>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:8px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--success);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">ប្តូរទៅឆ្នាំក្រោយ</button>
      </div>
    </form>
  `;

  async function handleSubmit(e) {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
    errorBox.style.display = 'none';
    const submitBtn = wrap.querySelector('[data-role="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'កំពុងប្តូរ...';

    const targetYearId = wrap.querySelector('[data-f="target_year"]').value;

    try {
      for (const p of periodsToPromote) {
        const payload = {
          academic_year: Number(targetYearId),
          period_type: p.period_type,
          period_number: p.period_number,
          name: p.name,
          start_date: p.start_date,
          end_date: p.end_date
        };
        const res = await api.post('/api/academic-periods/', payload);
        if (!res.ok) throw new Error(extractApiError(res.data) || 'បរាជ័យក្នុងការប្តូរ');
      }

      showToast(`បានប្តូរ${periodsToPromote.length > 1 ? ` ${periodsToPromote.length} កំឡុងសិក្សា` : 'កំឡុងសិក្សា'}ទៅឆ្នាំក្រោយដោយជោគជ័យ`, 'success');
      handle.close();
      state.selectedPeriodIds = new Set();
      const targetYear = state.years.find(y => String(y.id) === String(targetYearId));
      if (targetYear) {
        state.selectedYear = targetYear;
        fetchPeriods(targetYear.id);
      } else {
        fetchPeriods(state.selectedYear.id);
      }
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'ប្តូរទៅឆ្នាំក្រោយ';
    }
  }

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', handleSubmit);

  const handle = openModal(wrap);
}

// --- Render UI ---

function update() {
  if (!root) return;
  const { years, periods, selectedYear, activeTab, selectedPeriodIds, loading, error } = state;

  const yearsTotalPages = Math.ceil(years.length / ITEMS_PER_PAGE) || 1;
  state.yearsPage = Math.min(Math.max(state.yearsPage, 1), yearsTotalPages);
  const yearsStartIdx = (state.yearsPage - 1) * ITEMS_PER_PAGE;
  const paginatedYears = years.slice(yearsStartIdx, yearsStartIdx + ITEMS_PER_PAGE);

  const periodsTotalPages = Math.ceil(periods.length / ITEMS_PER_PAGE) || 1;
  state.periodsPage = Math.min(Math.max(state.periodsPage, 1), periodsTotalPages);
  const periodsStartIdx = (state.periodsPage - 1) * ITEMS_PER_PAGE;
  const paginatedPeriods = periods.slice(periodsStartIdx, periodsStartIdx + ITEMS_PER_PAGE);
  const allPaginatedSelected = paginatedPeriods.length > 0 && paginatedPeriods.every(p => selectedPeriodIds.has(String(p.id)));

  if (loading) {
    root.innerHTML = `<div style="display:flex;justify-content:center;padding:40px;"><div class="spinner"></div></div>`;
    return;
  }

  if (error) {
    root.innerHTML = `
      <div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;display:flex;align-items:center;gap:12px;">
        <i data-lucide="alert-circle"></i>
        <span>${error}</span>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  root.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:60px;">
      <style>
        .ay-page-tab { padding: 10px 20px; border-radius: 8px; border: none; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-secondary); }
        .ay-page-tab.active { background: #fff; color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .highlight-row { background-color: rgba(16, 185, 129, 0.08) !important; border-left: 4px solid #10b981; }
      </style>

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <h1 class="page-title" style="margin-bottom:0;">គ្រប់គ្រងឆ្នាំសិក្សា</h1>
        ${activeTab === 'years' ? `
          <button class="btn btn-primary" data-action="add-year" style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="plus" style="width:18px;height:18px"></i> បង្កើតឆ្នាំសិក្សាថ្មី
          </button>
        ` : `
          <button class="btn btn-primary" data-action="add-period" ${!selectedYear ? 'disabled' : ''} style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="plus" style="width:18px;height:18px"></i> បង្កើតកំឡុងសិក្សាថ្មី
          </button>
        `}
      </div>

      <div style="display:flex;gap:8px;margin-bottom:20px;background:#f1f5f9;padding:6px;border-radius:12px;width:fit-content;">
        <button type="button" data-tab="years" class="ay-page-tab ${activeTab === 'years' ? 'active' : ''}">ឆ្នាំសិក្សា</button>
        <button type="button" data-tab="periods" class="ay-page-tab ${activeTab === 'periods' ? 'active' : ''}">កំឡុងសិក្សា (ឆមាស/ខែ)</button>
      </div>

      ${activeTab === 'years' ? `
        <div class="glass-panel" style="padding:24px;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width:30%">ឆ្នាំសិក្សា</th>
                  <th style="width:25%">ថ្ងៃចាប់ផ្តើម</th>
                  <th style="width:25%">ថ្ងៃបញ្ចប់</th>
                  <th style="width:20%">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${years.length === 0 ? `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--text-muted);">មិនទាន់មានឆ្នាំសិក្សាទេ</td></tr>` : paginatedYears.map(y => `
                  <tr class="hover-row ${y.is_current ? 'highlight-row' : ''}">
                    <td>
                      <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-weight:700;color:${y.is_current ? '#059669' : 'var(--text-primary)'};">${y.year_name}</span>
                        ${y.is_current ? `<span class="badge success" style="font-size:0.75rem;">ឆ្នាំបច្ចុប្បន្ន</span>` : ''}
                      </div>
                    </td>
                    <td style="color:${y.is_current ? '#059669' : 'inherit'};">${new Date(y.start_date).toLocaleDateString('en-GB')}</td>
                    <td style="color:${y.is_current ? '#059669' : 'inherit'};">${new Date(y.end_date).toLocaleDateString('en-GB')}</td>
                    <td>
                      <div style="display:flex;gap:8px;">
                        <button data-action="edit-year" data-id="${y.id}" style="color:var(--primary);background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="edit-3" style="width:18px;height:18px;"></i></button>
                        <button data-action="delete-year" data-id="${y.id}" style="color:var(--danger);background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="trash-2" style="width:18px;height:18px;"></i></button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${years.length > 0 ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
              <div style="font-size:0.9rem;color:var(--text-secondary);">
                បង្ហាញ ${yearsStartIdx + 1} ដល់ ${Math.min(yearsStartIdx + ITEMS_PER_PAGE, years.length)} នៃ ${years.length}
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <button data-action="years-prev-page" class="btn btn-outline" ${state.yearsPage === 1 ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">មុន</button>
                <span style="font-size:0.85rem;color:var(--text-secondary);">${state.yearsPage} / ${yearsTotalPages}</span>
                <button data-action="years-next-page" class="btn btn-outline" ${state.yearsPage >= yearsTotalPages ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">បន្ទាប់</button>
              </div>
            </div>
        ` : ''}
        </div>
      ` : `
        <div class="glass-panel" style="padding:24px;">
          <div style="display:flex;gap:16px;align-items:center;justify-content:space-between;margin-bottom:20px;">
            <div style="display:flex;gap:16px;align-items:center;">
              <label style="font-weight:600;color:var(--text-secondary);">ជ្រើសរើសឆ្នាំសិក្សា៖</label>
              <select id="period-year-select" class="form-input" style="padding:8px 12px;border-radius:8px;border:1px solid var(--border);background:#fff;min-width:200px;">
                ${years.map(y => `<option value="${y.id}" ${selectedYear && String(selectedYear.id) === String(y.id) ? 'selected' : ''}>${y.year_name} ${y.is_current ? '(បច្ចុប្បន្ន)' : ''}</option>`).join('')}
              </select>
            </div>
            
            <div style="position:relative;" onmouseenter="this.querySelector('#export-menu').style.display='block'" onmouseleave="this.querySelector('#export-menu').style.display='none'">
            <button  class="btn" style="padding:8px 16px;border-radius:8px;font-weight:600;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--border);color:var(--text-primary);"><i data-lucide="download" style="width:16px;height:16px"></i> នាំចេញ <i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>
            <div id="export-menu" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:white;border:1px solid var(--border);border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:220px;overflow:hidden;"
                  <button data-action="export-word" style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text-primary);font-weight:500;">
                    <i data-lucide="file-text" style="width:18px;height:18px;color:#2563eb;"></i> នាំចេញជា Word
                  </button>
                  <button data-action="export-telegram" style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text-primary);font-weight:500;">
                    <i data-lucide="send" style="width:18px;height:18px;color:#0088cc;"></i> បញ្ជូនទៅ Telegram
                  </button>
                  <button data-action="configure-telegram" style="width:100%;padding:12px 16px;text-align:left;background:var(--bg-secondary);border:none;cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text-secondary);font-weight:500;font-size:0.875rem;">
                    <i data-lucide="settings" style="width:16px;height:16px;"></i> កំណត់ Telegram Bot
                  </button>
                </div>
            </div>
          </div>

          ${selectedYear ? `
            ${selectedPeriodIds.size > 0 ? `
              <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(16,185,129,0.08);border:1px solid var(--success);border-radius:8px;padding:10px 16px;margin-bottom:16px;">
                <span style="font-size:0.875rem;font-weight:600;color:var(--success);">បានជ្រើសរើស ${selectedPeriodIds.size} កំឡុងសិក្សា</span>
                <button data-action="promote-selected" class="btn" style="background:var(--success);color:white;display:flex;align-items:center;gap:8px;">
                  <i data-lucide="fast-forward" style="width:16px;height:16px;"></i> ប្តូរទៅឆ្នាំក្រោយ
                </button>
              </div>
            ` : ''}
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width:4%"><input type="checkbox" data-role="select-all-periods" ${allPaginatedSelected ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;" /></th>
                    <th style="width:14%">ប្រភេទ</th>
                    <th style="width:7%">លេខរៀង</th>
                    <th style="width:19%">ឈ្មោះ</th>
                    <th style="width:12%">ថ្ងៃចាប់ផ្តើម</th>
                    <th style="width:12%">ថ្ងៃបញ្ចប់</th>
                    <th style="width:13%">ស្ថានភាព</th>
                    <th style="width:19%">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody>
                  ${periods.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted);">មិនទាន់មានឆមាសនៅក្នុងឆ្នាំសិក្សានេះទេ</td></tr>` : paginatedPeriods.map(p => {
    const isComplete = new Date(p.end_date) < new Date();
    return `
                    <tr class="hover-row">
                      <td><input type="checkbox" data-role="select-period" data-id="${p.id}" ${selectedPeriodIds.has(String(p.id)) ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;" /></td>
                      <td><span style="font-weight:600;color:var(--primary);background:rgba(79,70,229,0.1);padding:4px 8px;border-radius:6px;font-size:0.85rem;">${p.period_type}</span></td>
                      <td>${p.period_number}</td>
                      <td><span style="font-weight:600;">${p.name}</span></td>
                      <td>${new Date(p.start_date).toLocaleDateString('en-GB')}</td>
                      <td>${new Date(p.end_date).toLocaleDateString('en-GB')}</td>
                      <td>
                        <span style="display:inline-flex;align-items:center;gap:6px;font-size:0.85rem;font-weight:600;color:${isComplete ? 'var(--success)' : 'var(--warning)'};">
                          <i data-lucide="${isComplete ? 'check-circle-2' : 'circle-dashed'}" style="width:16px;height:16px;"></i>
                          ${isComplete ? 'បានបញ្ចប់' : 'មិនទាន់បញ្ចប់'}
                        </span>
                      </td>
                      <td>
                        <div style="display:flex;gap:8px;">
                          <button data-action="promote-period" data-id="${p.id}" title="ប្តូរទៅឆ្នាំក្រោយ" style="color:var(--success);background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="fast-forward" style="width:18px;height:18px;"></i></button>
                          <button data-action="edit-period" data-id="${p.id}" style="color:var(--primary);background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="edit-3" style="width:18px;height:18px;"></i></button>
                          <button data-action="delete-period" data-id="${p.id}" style="color:var(--danger);background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="trash-2" style="width:18px;height:18px;"></i></button>
                        </div>
                      </td>
                    </tr>
                  `;
  }).join('')}
                </tbody>
              </table>
            </div>
            ${periods.length > 0 ? `
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
                <div style="font-size:0.9rem;color:var(--text-secondary);">
                  បង្ហាញ ${periodsStartIdx + 1} ដល់ ${Math.min(periodsStartIdx + ITEMS_PER_PAGE, periods.length)} នៃ ${periods.length}
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                  <button data-action="periods-prev-page" class="btn btn-outline" ${state.periodsPage === 1 ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">មុន</button>
                  <span style="font-size:0.85rem;color:var(--text-secondary);">${state.periodsPage} / ${periodsTotalPages}</span>
                  <button data-action="periods-next-page" class="btn btn-outline" ${state.periodsPage >= periodsTotalPages ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">បន្ទាប់</button>
                </div>
              </div>
            ` : ''}
          ` : `
            <div style="text-align:center;padding:40px;color:var(--text-muted);">សូមជ្រើសរើសឆ្នាំសិក្សា</div>
          `}
        </div>
      `}
    </div>
  `;

  // Bind Events
  root.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tab;
      localStorage.setItem('ay_activeTab', state.activeTab); // Save to local storage
      update();
    });
  });

  document.addEventListener('click', (e) => {
    if (state.showExportMenu && !e.target.closest('[data-action="toggle-export"]') && !e.target.closest('[data-action="export-word"]') && !e.target.closest('[data-action="export-telegram"]') && !e.target.closest('[data-action="configure-telegram"]')) {
      state.showExportMenu = false;
      update();
    }
  });

  const btnToggleExport = root.querySelector('[data-action="toggle-export"]');
  if (btnToggleExport) btnToggleExport.addEventListener('click', (e) => { e.stopPropagation(); state.showExportMenu = !state.showExportMenu; update(); });

  const btnExportWord = root.querySelector('[data-action="export-word"]');
  if (btnExportWord) btnExportWord.addEventListener('click', (e) => {
    e.stopPropagation();
    state.showExportMenu = false;
    update();
    if (!state.selectedYear) return;
    showExportPreviewModal('word');
  });

  const btnExportTelegram = root.querySelector('[data-action="export-telegram"]');
  if (btnExportTelegram) btnExportTelegram.addEventListener('click', (e) => { e.stopPropagation(); state.showExportMenu = false; update(); handleExportTelegram(); });

  const btnCfgTelegram = root.querySelector('[data-action="configure-telegram"]');
  if (btnCfgTelegram) btnCfgTelegram.addEventListener('click', (e) => { e.stopPropagation(); state.showExportMenu = false; update(); openTelegramConfigModal(); });

  root.querySelector('[data-action="years-prev-page"]')?.addEventListener('click', () => {
    if (state.yearsPage > 1) { state.yearsPage--; update(); }
  });
  root.querySelector('[data-action="years-next-page"]')?.addEventListener('click', () => {
    if (state.yearsPage < yearsTotalPages) { state.yearsPage++; update(); }
  });
  root.querySelector('[data-action="periods-prev-page"]')?.addEventListener('click', () => {
    if (state.periodsPage > 1) { state.periodsPage--; update(); }
  });
  root.querySelector('[data-action="periods-next-page"]')?.addEventListener('click', () => {
    if (state.periodsPage < periodsTotalPages) { state.periodsPage++; update(); }
  });

  const yearSelect = root.querySelector('#period-year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', (e) => {
      const y = years.find(y => String(y.id) === e.target.value);
      if (y) {
        state.selectedYear = y;
        state.selectedPeriodIds = new Set();
        state.periodsPage = 1;
        fetchPeriods(y.id);
      }
    });
  }

  root.querySelector('[data-action="add-year"]')?.addEventListener('click', () => openYearModal(null));

  root.querySelectorAll('button[data-action="edit-year"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const y = years.find(y => String(y.id) === btn.dataset.id);
      if (y) openYearModal(y);
    });
  });

  root.querySelectorAll('button[data-action="delete-year"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleDeleteYear(btn.dataset.id);
    });
  });

  root.querySelector('[data-action="add-period"]')?.addEventListener('click', () => openPeriodModal(null));

  root.querySelectorAll('button[data-action="edit-period"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const p = periods.find(p => String(p.id) === btn.dataset.id);
      if (p) openPeriodModal(p);
    });
  });

  root.querySelectorAll('button[data-action="delete-period"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleDeletePeriod(btn.dataset.id);
    });
  });

  root.querySelectorAll('button[data-action="promote-period"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = periods.find(p => String(p.id) === btn.dataset.id);
      if (p) openPromoteModal([p]);
    });
  });

  root.querySelector('[data-action="promote-selected"]')?.addEventListener('click', () => {
    const selected = periods.filter(p => selectedPeriodIds.has(String(p.id)));
    if (selected.length > 0) openPromoteModal(selected);
  });

  root.querySelectorAll('input[data-role="select-period"]').forEach(chk => {
    chk.addEventListener('change', () => {
      const id = String(chk.dataset.id);
      if (chk.checked) state.selectedPeriodIds.add(id);
      else state.selectedPeriodIds.delete(id);
      update();
    });
  });

  root.querySelector('input[data-role="select-all-periods"]')?.addEventListener('change', (e) => {
    if (e.target.checked) {
      paginatedPeriods.forEach(p => state.selectedPeriodIds.add(String(p.id)));
    } else {
      paginatedPeriods.forEach(p => state.selectedPeriodIds.delete(String(p.id)));
    }
    update();
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { years: [], periods: [], selectedYear: null, activeTab: localStorage.getItem('ay_activeTab') || 'years', selectedPeriodIds: new Set(), yearsPage: 1, periodsPage: 1, showExportMenu: false, loading: true, error: null };
  update();
  fetchYears();
}

export function destroy() {
  root = null;
}


// ----------------------------------------------------
// EXPORT LOGIC
// ----------------------------------------------------

function toKhmerNumerals(num) {
  if (num === null || num === undefined) return '០';
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().split('').map(d => { const p = parseInt(d, 10); return isNaN(p) ? d : khmerDigits[p]; }).join('');
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

  function handleSubmit(e) {
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
  }

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', handleSubmit);

  const handle = openModal(wrap);
}

// Builds the full report layout (header/title/table/footer) as a detached,
// visibly-styled element -- shared by the preview modal and the Telegram
// image capture so the preview always matches exactly what gets sent.
function buildReportElement() {
  const yearName = state.selectedYear ? state.selectedYear.year_name : '';

  const reportEl = document.createElement('div');
  reportEl.style.width = '794px'; // A4 width
  reportEl.style.padding = '40px';
  reportEl.style.backgroundColor = '#ffffff';
  reportEl.style.color = '#000000';
  reportEl.style.fontFamily = "'Battambang', sans-serif";

  const today = new Date();
  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const dateStr = `ថ្ងៃទី ${toKhmerNumerals(today.getDate())} ខែ ${months[today.getMonth()]} ឆ្នាំ ${toKhmerNumerals(today.getFullYear())}`;

  reportEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="text-align: center;">
        <img src="${window.location.origin}/logo.png" style="width: 50px; height: 50px; margin-bottom: 6px;" onerror="this.style.display='none'">
        <div style="font-family: 'Moul', cursive; font-size: 10px; color: #1e3a8a; line-height: 1.5;">
          មន្ទីរធម្មការ និងសាសនារាជធានី<br>
          ភ្នំពេញ<br>
          សាលា ពុ.អ.វិ.ស.ព្រ.ទ.វ.និ
        </div>
      </div>
      <div style="text-align: center;">
        <div style="font-family: 'Moul', cursive; font-size: 12px; color: #1e3a8a; margin-bottom: 4px;">
          ព្រះរាជាណាចក្រកម្ពុជា
        </div>
        <div style="font-family: 'Moul', cursive; font-size: 11px; color: #1e3a8a; margin-bottom: 8px;">
          ជាតិ សាសនា ព្រះមហាក្សត្រ
        </div>
        <div style="font-family: 'Moul', cursive; font-size: 12px; color: #1e3a8a;">
          3
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
      <div style="font-family: 'Moul', cursive; font-size: 13px; color: #1e3a8a; margin-bottom: 6px;">
        បញ្ជីសកម្មភាពសិក្សាប្រចាំឆ្នាំសិក្សា ${yearName}
      </div>
      <div style="font-family: 'Moul', cursive; font-size: 11px; color: #1e3a8a;">
        នៃសាលាពុទ្ធិកអនុវិទ្យាល័យ សម្តេចព្រះមហាសង្ឃរាជ ទេព វង្ស និរោធរង្សី
      </div>
    </div>

    <div id="tg-table-placeholder"></div>

    <div style="margin-top: 25px; display: flex; justify-content: space-between;">
      <div></div>
      <div style="text-align: center; font-size: 10px; color: #374151;">
        <div style="margin-bottom: 6px;">ថ្ងៃព្រហស្បតិ៍ ៧កើត ខែបឋមាសាឍ ឆ្នាំរោង ឆស័ក ពុទ្ធសករាជ ២៥៦៨</div>
        <div style="font-family: 'Moul', cursive; margin-bottom: 12px; font-size: 11px;">វត្តនិរោធរង្សី, ${dateStr}</div>
        <div style="font-family: 'Moul', cursive; font-size: 11px;">ព្រះប្រធានសាលា</div>
      </div>
    </div>
  `;

  // Clone the visible table, strip the checkbox/actions columns, style for export.
  const tableEl = root.querySelector('.table-container table');
  if (tableEl) {
    const tableNode = tableEl.cloneNode(true);
    tableNode.style.width = '100%';
    tableNode.style.borderCollapse = 'collapse';
    tableNode.style.marginTop = '20px';
    tableNode.style.marginBottom = '20px';
    tableNode.style.fontSize = '10px';

    tableNode.querySelectorAll('thead tr, tbody tr').forEach(tr => {
      if (tr.children.length >= 2) {
        tr.removeChild(tr.firstElementChild); // Checkbox
        tr.removeChild(tr.lastElementChild);  // Actions
      }
    });
    tableNode.querySelectorAll('th').forEach(th => {
      th.style.border = '1px solid #4b5563';
      th.style.padding = '8px';
      th.style.textAlign = 'center';
      th.style.backgroundColor = '#f9fafb';
      th.style.color = '#1e3a8a';
      th.style.fontWeight = 'bold';
    });
    tableNode.querySelectorAll('td').forEach(td => {
      td.style.border = '1px solid #4b5563';
      td.style.padding = '8px';
      td.style.textAlign = 'center';
    });

    reportEl.querySelector('#tg-table-placeholder').appendChild(tableNode);
  }

  return reportEl;
}

function buildTelegramCaption() {
  const yearName = state.selectedYear ? state.selectedYear.year_name : '';
  let msg = `📅 <b>បញ្ជីសកម្មភាពសិក្សាប្រចាំឆ្នាំសិក្សា ${yearName}</b>\n\n`;

  const sortedPeriods = [...state.periods].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  sortedPeriods.forEach((p, i) => {
    const sDate = p.start_date ? new Date(p.start_date).toLocaleDateString('en-GB') : '';
    const eDate = p.end_date ? new Date(p.end_date).toLocaleDateString('en-GB') : '';
    const isCompleted = p.end_date ? new Date(p.end_date) < new Date() : false;
    const checkMark = isCompleted ? '✅' : '⏳';

    let periodName = p.name || '';
    if (!periodName) {
      periodName = `${p.period_type}ទី${toKhmerNumerals(p.period_number)}`;
    }
    msg += `${toKhmerNumerals(i + 1)}. ${periodName}\n   ${sDate} - ${eDate} ${checkMark}\n\n`;
  });

  return msg;
}

// Captures a (possibly visible, e.g. inside the preview modal) report element
// as a PNG blob via html2canvas, without disturbing the original node.
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

async function sendTelegramImage(reportEl, tgConfig) {
  const blob = await captureReportImage(reportEl);
  const formData = new FormData();
  formData.append('chat_id', tgConfig.chatId);
  formData.append('photo', blob, 'schedule.png');
  formData.append('caption', buildTelegramCaption());
  formData.append('parse_mode', 'HTML');

  const response = await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendPhoto`, { method: 'POST', body: formData });
  if (!response.ok) {
    const errData = await response.text();
    console.error('Telegram API Error:', errData);
    throw new Error('telegram-send-failed');
  }
}

// Shows the report layout before it's actually exported/sent, for both the
// Word download and the Telegram image send.
function showExportPreviewModal(mode) {
  const reportEl = buildReportElement();
  const confirmLabel = mode === 'word' ? 'ទាញយក Word' : 'បញ្ជូនទៅ Telegram';

  const wrap = document.createElement('div');
  wrap.style.width = '850px';
  wrap.style.maxWidth = '95vw';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '16px';
  header.innerHTML = `
    <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">មើលជាមុន</h2>
    <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
  `;

  const previewArea = document.createElement('div');
  previewArea.style.maxHeight = '65vh';
  previewArea.style.overflow = 'auto';
  previewArea.style.border = '1px solid #e5e7eb';
  previewArea.style.borderRadius = '8px';
  previewArea.style.marginBottom = '20px';
  previewArea.style.background = '#f8fafc';
  previewArea.style.padding = '16px';
  previewArea.appendChild(reportEl);

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'flex-end';
  footer.style.gap = '12px';
  footer.innerHTML = `
    <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
    <button type="button" data-action="confirm" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">${confirmLabel}</button>
  `;

  wrap.appendChild(header);
  wrap.appendChild(previewArea);
  wrap.appendChild(footer);

  const handle = openModal(wrap);

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());

  wrap.querySelector('[data-action="confirm"]').addEventListener('click', async () => {
    const confirmBtn = wrap.querySelector('[data-action="confirm"]');
    if (mode === 'word') {
      handleExportWord();
      handle.close();
      return;
    }

    const tgConfig = JSON.parse(localStorage.getItem('tgConfig'));
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'កំពុងផ្ញើ...';
    try {
      await sendTelegramImage(reportEl, tgConfig);
      showToast('បានបញ្ជូនទៅ Telegram ដោយជោគជ័យ', 'success');
      handle.close();
    } catch (err) {
      console.error(err);
      showToast('បរាជ័យក្នុងការបញ្ជូនទៅ Telegram', 'error');
      confirmBtn.disabled = false;
      confirmBtn.textContent = confirmLabel;
    }
  });
}

function handleExportTelegram() {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig'));
  if (!tgConfig || !tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }
  if (!state.selectedYear) return;
  showExportPreviewModal('telegram');
}

async function handleExportWord() {
  if (!state.selectedYear) return;
  const yearName = state.selectedYear.year_name;

  const sortedPeriods = [...state.periods].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const tableRows = [
    new docx.TableRow({
      children: [
        new docx.TableCell({ children: [new docx.Paragraph({ text: "ល.រ", alignment: docx.AlignmentType.CENTER })], shading: { fill: "f3f4f6" } }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: "កំឡុងសិក្សា", alignment: docx.AlignmentType.CENTER })], shading: { fill: "f3f4f6" } }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: "កាលចាប់ផ្តើម", alignment: docx.AlignmentType.CENTER })], shading: { fill: "f3f4f6" } }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: "កាលបញ្ចប់", alignment: docx.AlignmentType.CENTER })], shading: { fill: "f3f4f6" } }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: "បានបញ្ចប់", alignment: docx.AlignmentType.CENTER })], shading: { fill: "f3f4f6" } }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: "ចំណាំ", alignment: docx.AlignmentType.CENTER })], shading: { fill: "f3f4f6" } }),
      ],
    })
  ];

  sortedPeriods.forEach((p, i) => {
    const sDate = p.start_date ? new Date(p.start_date).toLocaleDateString('en-GB') : '';
    const eDate = p.end_date ? new Date(p.end_date).toLocaleDateString('en-GB') : '';
    const isCompleted = p.end_date ? new Date(p.end_date) < new Date() : false;
    const checkMark = isCompleted ? '✓' : '';

    let periodName = p.name || '';
    if (!periodName) {
      periodName = `${p.period_type}ទី${toKhmerNumerals(p.period_number)}`;
    }

    tableRows.push(new docx.TableRow({
      children: [
        new docx.TableCell({ children: [new docx.Paragraph({ text: toKhmerNumerals(i + 1), alignment: docx.AlignmentType.CENTER })] }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: periodName, alignment: docx.AlignmentType.CENTER })] }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: sDate, alignment: docx.AlignmentType.CENTER })] }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: eDate, alignment: docx.AlignmentType.CENTER })] }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: checkMark, alignment: docx.AlignmentType.CENTER })] }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: "", alignment: docx.AlignmentType.CENTER })] }),
      ],
    }));
  });

  const table = new docx.Table({
    width: { size: 100, type: docx.WidthType.PERCENTAGE },
    rows: tableRows,
  });

  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: [
        new docx.Paragraph({
          text: `បញ្ជីសកម្មភាពសិក្សាប្រចាំឆ្នាំសិក្សា ${yearName}`,
          heading: docx.HeadingLevel.HEADING_1,
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          text: "នៃសាលាពុទ្ធិកអនុវិទ្យាល័យ សម្តេចព្រះមហាសង្ឃរាជ ទេព វង្ស និរោធរង្សី",
          heading: docx.HeadingLevel.HEADING_2,
          alignment: docx.AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        table,
        new docx.Paragraph({
          text: "ថ្ងៃព្រហស្បតិ៍ ៧កើត ខែបឋមាសាឍ ឆ្នាំរោង ឆស័ក ពុទ្ធសករាជ ២៥៦៨",
          alignment: docx.AlignmentType.RIGHT,
          spacing: { before: 800 },
        }),
        new docx.Paragraph({
          text: "វត្តនិរោធរង្សី, ថ្ងៃទី ២១ ខែ មិថុនា ឆ្នាំ ២០២៦",
          alignment: docx.AlignmentType.RIGHT,
          spacing: { after: 400 },
        }),
        new docx.Paragraph({
          text: "ព្រះប្រធានសាលា",
          alignment: docx.AlignmentType.RIGHT,
        }),
      ],
    }],
  });

  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, `academic_years_${yearName}.docx`);
  });
}
