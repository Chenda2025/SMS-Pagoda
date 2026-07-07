// Ports pages/PublicApply.jsx -- the multi-step public student-registration
// wizard. Uses a single mutable `state` object + full step re-render on any
// change (React's re-render-on-setState, done by hand).

import { createSearchSelect } from '../components/searchSelect.js';
import { createImageCropper } from '../components/imageCrop.js';
import { openModal } from '../components/modal.js';
import { withFocusPreserved, onLiveInput } from '../utils/dom.js';

const HOST = window.location.hostname;
const API_URL = `http://${HOST}:8000/api/students/public-apply/`;
const CORE = `http://${HOST}:8000/api/core`;

async function getJSON(url) {
  const r = await fetch(url);
  const data = await r.json().catch(() => null);
  if (!r.ok) throw { response: { data } };
  return { data };
}
async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => null);
  if (!r.ok) throw { response: { data } };
  return { data };
}
async function postForm(url, formData) {
  const r = await fetch(url, { method: 'POST', body: formData });
  const data = await r.json().catch(() => null);
  if (!r.ok) throw { response: { data } };
  return { data };
}

function getInitialState(key, defaultValue) {
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    try { return JSON.parse(saved); } catch { return saved; }
  }
  return defaultValue;
}

const DEFAULT_FORM = {
  tracking_code: '', first_name: '', last_name: '', latin_name: '', gender: 'ប្រុស',
  phone: '', date_of_birth: '', nationality: '', education_level: '', monk_status: '',
  monk_document_type: 'ឆាយា', sanghatika_no: '', chaya_name: '', chaya_no: '',
  ordination_date: '', preceptor_name: '', current_pagoda: '', birth_pagoda: '',
  kuti: '', address: '', note: ''
};

let root = null;
let cropper = null;
let cropModalHandle = null;

let state = {
  activeStep: getInitialState('apply_activeStep', 0),
  loading: false,
  error: null,
  successMsg: null,
  mode: getInitialState('apply_mode', 'select'),
  sessionActive: null,
  trackingCode: getInitialState('apply_trackingCode', ''),
  phoneLogin: getInitialState('apply_phoneLogin', ''),
  pagodas: [], kutis: [], nationalities: [], provinces: [], districts: [], communes: [], villages: [],
  formData: getInitialState('apply_formData', { ...DEFAULT_FORM }),
  duplicateWarning: null,
  imageSrc: null,
  croppedImageFile: null,
  croppedImageUrl: null,
  showCropModal: false,
};

function persist() {
  localStorage.setItem('apply_activeStep', JSON.stringify(state.activeStep));
  localStorage.setItem('apply_mode', JSON.stringify(state.mode));
  localStorage.setItem('apply_trackingCode', JSON.stringify(state.trackingCode));
  localStorage.setItem('apply_phoneLogin', JSON.stringify(state.phoneLogin));
  localStorage.setItem('apply_formData', JSON.stringify(state.formData));
}

function clearSession() {
  ['apply_activeStep', 'apply_mode', 'apply_trackingCode', 'apply_phoneLogin', 'apply_formData'].forEach(k => localStorage.removeItem(k));
}

// A previously-approved/submitted application's tracking_code can linger in
// localStorage (e.g. a shared kiosk browser used for the next applicant).
// Resuming mid-wizard with that dead tracking_code makes every save/submit
// fail against the backend's "already reviewed" guard with no way out, so
// reset to a clean session and let the user know why.
function resetStaleSession(message) {
  clearSession();
  state = {
    ...state,
    activeStep: 0,
    mode: 'select',
    formData: { ...DEFAULT_FORM },
    trackingCode: '',
    phoneLogin: '',
    error: message,
  };
}

async function validateResumedSession() {
  if (state.activeStep > 0 && state.formData.tracking_code && state.formData.phone) {
    try {
      const res = await getJSON(`${API_URL}?tracking_code=${state.formData.tracking_code}&phone=${state.formData.phone}`);
      if (res.data.status === 'approved' || res.data.status === 'submitted') {
        resetStaleSession('ពាក្យស្នើសុំចាស់របស់អ្នកត្រូវបានបញ្ជូន ឬអនុម័តរួចហើយ។ សូមចាប់ផ្តើមការចុះឈ្មោះថ្មីម្តងទៀត។');
      }
    } catch (err) {
      // tracking_code/phone no longer resolves to a record -- reset quietly
      resetStaleSession(null);
    }
  }
}

function setState(patch) {
  state = { ...state, ...patch };
  persist();
  if (root) withFocusPreserved(root, update); else update();
}

function setFormData(patch) {
  state = { ...state, formData: typeof patch === 'function' ? patch(state.formData) : { ...state.formData, ...patch } };
  persist();
  if (root) withFocusPreserved(root, update); else update();
}

let duplicateTimer = null;
function scheduleDuplicateCheck() {
  clearTimeout(duplicateTimer);
  duplicateTimer = setTimeout(async () => {
    const { first_name, last_name, latin_name, phone, date_of_birth, gender, monk_status } = state.formData;
    if (first_name && last_name && phone && date_of_birth && gender && monk_status) {
      try {
        const res = await postJSON(`http://${HOST}:8000/api/students/list/check_duplicate/`, { first_name, last_name, latin_name, phone, date_of_birth, gender, monk_status });
        setState({ duplicateWarning: res.data.duplicate ? res.data.message : null });
      } catch (err) { console.error('Duplicate check error:', err); }
    } else if (state.duplicateWarning) {
      setState({ duplicateWarning: null });
    }
  }, 500);
}

async function loadGeoHierarchy(villageCode) {
  try {
    const villageRes = await getJSON(`${CORE}/villages/${villageCode}/`);
    const communeCode = villageRes.data.commune;
    const communeRes = await getJSON(`${CORE}/communes/${communeCode}/`);
    const districtCode = communeRes.data.district;
    const districtRes = await getJSON(`${CORE}/districts/${districtCode}/`);
    const provinceCode = districtRes.data.province;

    const [distList, commList, villList] = await Promise.all([
      getJSON(`${CORE}/districts/?province_code=${provinceCode}`),
      getJSON(`${CORE}/communes/?district_code=${districtCode}`),
      getJSON(`${CORE}/villages/?commune_code=${communeCode}`),
    ]);

    state = {
      ...state,
      formData: { ...state.formData, birth_province_code: provinceCode, birth_district_code: districtCode, birth_commune_code: communeCode, birth_village_code: villageCode },
      districts: distList.data, communes: commList.data, villages: villList.data,
    };
  } catch (geoErr) {
    console.error('Error loading geo hierarchy', geoErr);
  }
}

async function loadDropdowns() {
  try {
    try {
      await getJSON(`http://${HOST}:8000/api/students/registration-sessions/active/`);
      state.sessionActive = true;
    } catch {
      setState({ sessionActive: false });
      return;
    }
    const [pagodaRes, kutiRes, natRes, provRes] = await Promise.all([
      getJSON(`${CORE}/pagodas/`), getJSON(`${CORE}/kutis/`), getJSON(`${CORE}/nationalities/`), getJSON(`${CORE}/provinces/`)
    ]);
    setState({ pagodas: pagodaRes.data, kutis: kutiRes.data, nationalities: natRes.data, provinces: provRes.data });
  } catch (err) {
    console.error('Error fetching dropdowns:', err);
  }
}

async function handleStartNew(e) {
  e.preventDefault();
  if (!state.formData.first_name || !state.formData.last_name || !state.formData.phone) {
    setState({ error: 'សូមបញ្ចូល នាមខ្លួន នាមត្រកូល និងលេខទូរស័ព្ទ' });
    return;
  }
  setState({ loading: true, error: null });
  try {
    const res = await postJSON(API_URL, { first_name: state.formData.first_name, last_name: state.formData.last_name, phone: state.formData.phone });
    state = { ...state, formData: res.data };
    if (res.data.birth_village_code) await loadGeoHierarchy(res.data.birth_village_code);
    setState({
      loading: false,
      successMsg: `ពាក្យស្នើសុំត្រូវបានចាប់ផ្តើម! លេខកូដតាមដានរបស់អ្នកគឺ៖ ${res.data.tracking_code}. សូមរក្សាទុកលេខកូដនេះដើម្បីចូលមកកែប្រែថ្ងៃក្រោយ!`,
      activeStep: 1,
    });
  } catch (err) {
    console.error(err.response?.data);
    setState({ loading: false, error: err.response?.data?.error || 'បរាជ័យក្នុងការចាប់ផ្តើម។ សូមព្យាយាមម្តងទៀត។' });
  }
}

async function handleResume(e) {
  e.preventDefault();
  if (!state.trackingCode || !state.phoneLogin) {
    setState({ error: 'សូមបញ្ចូល លេខកូដតាមដាន និងលេខទូរស័ព្ទ' });
    return;
  }
  setState({ loading: true, error: null });
  try {
    const res = await getJSON(`${API_URL}?tracking_code=${state.trackingCode}&phone=${state.phoneLogin}`);
    if (res.data.status === 'submitted' || res.data.status === 'approved') {
      setState({ loading: false, error: 'ពាក្យស្នើសុំនេះត្រូវបានបញ្ជូនរួចហើយ មិនអាចកែប្រែបានទេ។' });
      return;
    }
    if (res.data.status === 'rejected' && res.data.note) {
      alert(`ពាក្យស្នើសុំរបស់អ្នកត្រូវបានបដិសេធដោយសារ៖\n\n${res.data.note}\n\nសូមកែប្រែព័ត៌មាន ហើយបញ្ជូនម្តងទៀត។`);
    }
    state = { ...state, formData: res.data };
    if (res.data.birth_village_code) await loadGeoHierarchy(res.data.birth_village_code);
    setState({ loading: false, activeStep: 1, successMsg: 'ទាញយកទិន្នន័យចាស់បានជោគជ័យ។' });
  } catch (err) {
    setState({ loading: false, error: err.response?.data?.error || 'រកមិនឃើញពាក្យស្នើសុំទេ។ សូមពិនិត្យលេខកូដ និងលេខទូរស័ព្ទឡើងវិញ។' });
  }
}

function buildFormDataPayload(extra = {}) {
  const fd = new FormData();
  Object.keys(state.formData).forEach(key => {
    const v = state.formData[key];
    if (v !== null && v !== undefined && v !== '') fd.append(key, v);
  });
  Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
  if (state.croppedImageFile) fd.append('image_url', state.croppedImageFile, 'photo.jpg');
  return fd;
}

const ALREADY_APPROVED_ERROR = 'ពាក្យស្នើសុំនេះត្រូវបានសាលាពិនិត្យ និងអនុម័តរួចរាល់។';

async function handleSaveDraft() {
  setState({ loading: true, error: null, successMsg: null });
  try {
    const res = await postForm(API_URL, buildFormDataPayload());
    state = { ...state, formData: res.data };
    if (res.data.birth_village_code) await loadGeoHierarchy(res.data.birth_village_code);
    setState({ loading: false, successMsg: 'រក្សាទុកពង្រាងបានជោគជ័យ។ លោកអ្នកអាចត្រឡប់មកបំពេញបន្តនៅពេលក្រោយ។' });
  } catch (err) {
    console.error(err.response?.data);
    const msg = err.response?.data?.error;
    if (msg === ALREADY_APPROVED_ERROR) {
      resetStaleSession(`${msg} សូមចាប់ផ្តើមការចុះឈ្មោះថ្មីម្តងទៀត។`);
      update();
      return;
    }
    setState({ loading: false, error: msg || 'បរាជ័យក្នុងការរក្សាទុក។' });
  }
}

async function handleSubmit() {
  if (!window.confirm('តើអ្នកពិតជាចង់បញ្ជូនពាក្យស្នើសុំមែនទេ? បន្ទាប់ពីបញ្ជូន អ្នកមិនអាចកែប្រែបានទៀតទេ។')) return;
  setState({ loading: true, error: null, successMsg: null });
  try {
    const res = await postForm(API_URL, buildFormDataPayload({ status: 'submitted' }));
    state = { ...state, formData: res.data };
    if (res.data.birth_village_code) await loadGeoHierarchy(res.data.birth_village_code);
    setState({ loading: false, successMsg: 'ពាក្យស្នើសុំត្រូវបានបញ្ជូនទៅសាលាដោយជោគជ័យ! សូមរង់ចាំការពិនិត្យពីផ្នែករដ្ឋបាល។', activeStep: 4 });
  } catch (err) {
    console.error(err.response?.data);
    const data = err.response?.data;
    let msg = 'បរាជ័យក្នុងការបញ្ជូន។';
    if (data?.error) msg = data.error;
    else if (typeof data === 'string') msg = 'បរាជ័យក្នុងការបញ្ជូន។ មានបញ្ហាពីប្រព័ន្ធ Server។';
    else if (data) msg = `បរាជ័យក្នុងការបញ្ជូន។ ព័ត៌មានលម្អិត: ${Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')}`;
    if (msg === ALREADY_APPROVED_ERROR) {
      resetStaleSession(`${msg} សូមចាប់ផ្តើមការចុះឈ្មោះថ្មីម្តងទៀត។`);
      update();
      return;
    }
    setState({ loading: false, error: msg });
  }
}

function handleGeoSelectChange(name, value) {
  const newData = { ...state.formData, [name]: value };
  if (name === 'birth_province_code') { newData.birth_district_code = ''; newData.birth_commune_code = ''; newData.birth_village_code = ''; }
  else if (name === 'birth_district_code') { newData.birth_commune_code = ''; newData.birth_village_code = ''; }
  else if (name === 'birth_commune_code') { newData.birth_village_code = ''; }
  state = { ...state, formData: newData };

  if (name === 'birth_province_code') {
    state = { ...state, districts: [], communes: [], villages: [] };
    if (value) getJSON(`${CORE}/districts/?province_code=${value}`).then(res => setState({ districts: res.data }));
  } else if (name === 'birth_district_code') {
    state = { ...state, communes: [], villages: [] };
    if (value) getJSON(`${CORE}/communes/?district_code=${value}`).then(res => setState({ communes: res.data }));
  } else if (name === 'birth_commune_code') {
    state = { ...state, villages: [] };
    if (value) getJSON(`${CORE}/villages/?commune_code=${value}`).then(res => setState({ villages: res.data }));
  }
  persist();
  update();
}

function handleSelectChange(name, val) {
  // val is either a plain value string, or { value, isNew } from a creatable select
  if (val == null || val === '') {
    setFormData({ [name]: '' });
    return;
  }
  if (typeof val === 'object' && val.isNew) {
    const newFieldMap = { current_pagoda: 'new_current_pagoda_name', birth_pagoda: 'new_birth_pagoda_name', kuti: 'new_kuti_name', nationality: 'new_nationality_name' };
    if (newFieldMap[name]) { setFormData({ [name]: '', [newFieldMap[name]]: val.value }); return; }
    if (name === 'education_level') { setFormData({ [name]: val.value }); return; }
  }
  const value = typeof val === 'object' ? val.value : val;
  setFormData(prev => {
    const newData = { ...prev, [name]: value };
    if (name === 'monk_status') {
      newData.monk_document_type = value === 'សាមណេរ' ? 'លេខសង្ឃាដិកា' : value === 'ភិក្ខុ' ? 'ឆាយា' : '';
      newData.current_pagoda = '';
      newData.kuti = '';
    }
    return newData;
  });
}

function handleChange(e) {
  const { name, value } = e.target;
  setFormData(prev => {
    const newData = { ...prev, [name]: value };
    if (name === 'current_pagoda') newData.kuti = '';
    if (name === 'monk_status' && !value) { newData.current_pagoda = ''; newData.kuti = ''; }
    return newData;
  });
  scheduleDuplicateCheck();
}

function isWhiteCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const tl = ctx.getImageData(0, 0, 10, 10).data;
  const tr = ctx.getImageData(canvas.width - 10, 0, 10, 10).data;
  const isWhite = (data) => {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
    const count = data.length / 4;
    return r / count > 235 && g / count > 235 && b / count > 235;
  };
  return isWhite(tl) && isWhite(tr);
}

function handleFileChange(e) {
  if (!e.target.files || e.target.files.length === 0) return;
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    state = { ...state, imageSrc: reader.result };
    openCropModal();
  });
  reader.readAsDataURL(file);
}

function openCropModal() {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '16px';

  cropper = createImageCropper({ imageSrc: state.imageSrc, aspect: 4 / 6, viewportSize: 360 });
  wrap.appendChild(cropper.el);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = '10px';
  btnRow.innerHTML = `
    <button type="button" class="btn btn-outline" data-action="cancel-crop">បោះបង់</button>
    <button type="button" class="btn btn-primary" data-action="save-crop">រក្សាទុករូបថត ៤x៦</button>
  `;
  wrap.appendChild(btnRow);

  cropModalHandle = openModal(wrap, { closeOnBackdrop: false });
  wrap.querySelector('[data-action="cancel-crop"]').addEventListener('click', () => cropModalHandle.close());
  wrap.querySelector('[data-action="save-crop"]').addEventListener('click', handleCropSave);
}

function handleCropSave() {
  const canvas = cropper.getCroppedCanvas(600);
  if (!isWhiteCanvas(canvas)) {
    alert('រូបថតនេះមិនមានផ្ទៃខាងក្រោយពណ៌សទេ។ សូមជ្រើសរើសរូបថតផ្ទៃខាងក្រោយពណ៌ស (៤x៦)។\n(Photo does not have a white background)');
    return;
  }
  canvas.toBlob((blob) => {
    if (!blob) return;
    blob.name = 'photo.jpg';
    const url = URL.createObjectURL(blob);
    state = { ...state, croppedImageFile: blob, croppedImageUrl: url };
    cropModalHandle.close();
    update();
  }, 'image/jpeg');
}

// ---- Step renderers ----

function renderStartScreen() {
  const el = document.createElement('div');
  if (state.mode === 'select') {
    el.style.textAlign = 'center';
    el.style.padding = '10px 20px 40px';
    el.innerHTML = `
      <p style="font-family:Tacteing;color:blue;margin-bottom:20px;font-size:40px;">------------</p>
      <p style="color:var(--text-secondary);margin-bottom:20px;font-family:Moul;">សេចក្តីណែនាំអំពីការចុះឈ្មោះសាមណសិស្ស</p>
      <div style="color:#0B0E59;margin-bottom:50px;font-size:18px;text-align:left;font-weight:bold;font-family:Battambang;">
        ១-ចុះឈ្មោះសិស្សថ្មី៖ <br />
        <span style="display:block;margin-left:20px;font-family:Battambang;color:var(--text-secondary);font-size:15px;font-weight:normal;">សម្រាប់សិស្សឆ្នាំថ្មីដែលទើបប្រឡងចូរសាលាពុទ្ធិក។</span><br />
        ២-ចុះឈ្មោះសិស្សចាស់៖ <br />
        <span style="display:block;margin-left:20px;font-family:Battambang;color:var(--text-secondary);font-size:15px;font-weight:normal;">សម្រាប់សិស្សឆ្នាំចាស់ដែលបានចុះឈ្មោះនៅសាលា។</span>
      </div>
      <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
        <button class="btn btn-primary" data-action="mode-new" style="padding:12px 24px;font-size:1.1rem;">ចុះឈ្មោះសិស្សថ្មី</button>
        <button class="btn btn-outline" data-action="mode-resume" style="padding:12px 24px;font-size:1.1rem;">ចុះឈ្មោះសិស្សចាស់</button>
      </div>
    `;
    el.querySelector('[data-action="mode-new"]').addEventListener('click', () => setState({ mode: 'new' }));
    el.querySelector('[data-action="mode-resume"]').addEventListener('click', () => setState({ mode: 'resume' }));
    return el;
  }

  if (state.mode === 'new') {
    el.innerHTML = `
      <form data-role="form-new" style="max-width:500px;margin:0 auto;">
        <h3 style="font-family:Moul;margin-bottom:20px;text-align:center;">ចាប់ផ្តើមចុះឈ្មោះថ្មី</h3>
        <div class="form-row">
          <div><label class="input-label">នាមត្រកូល *</label><input type="text" class="form-input" name="last_name" required /></div>
          <div><label class="input-label">នាមខ្លួន *</label><input type="text" class="form-input" name="first_name" required /></div>
        </div>
        <div style="margin-bottom:20px;"><label class="input-label">លេខទូរស័ព្ទ *</label><input type="text" class="form-input" name="phone" required /></div>
        <button type="submit" class="btn btn-primary" style="width:100%;margin-bottom:10px;" ${state.loading ? 'disabled' : ''}>${state.loading ? 'កំពុងដំណើរការ...' : 'បង្កើតពាក្យស្នើសុំ'}</button>
        <button type="button" class="btn btn-outline" style="width:100%;border:none;" data-action="back">ត្រឡប់ក្រោយ</button>
      </form>
    `;
    const form = el.querySelector('[data-role="form-new"]');
    form.last_name.value = state.formData.last_name || '';
    form.first_name.value = state.formData.first_name || '';
    form.phone.value = state.formData.phone || '';
    onLiveInput(form.last_name, () => setFormData({ last_name: form.last_name.value }));
    onLiveInput(form.first_name, () => setFormData({ first_name: form.first_name.value }));
    onLiveInput(form.phone, () => setFormData({ phone: form.phone.value }));
    form.addEventListener('submit', handleStartNew);
    el.querySelector('[data-action="back"]').addEventListener('click', () => setState({ mode: 'select' }));
    return el;
  }

  if (state.mode === 'resume') {
    el.innerHTML = `
      <form data-role="form-resume" style="max-width:500px;margin:0 auto;">
        <h3 style="font-family:Moul;margin-bottom:20px;text-align:center;">បន្តការចុះឈ្មោះចាស់</h3>
        <div style="margin-bottom:15px;"><label class="input-label">លេខទូរស័ព្ទ *</label><input type="text" class="form-input" name="phone_login" required /></div>
        <div style="margin-bottom:20px;"><label class="input-label">លេខកូដតាមដាន ៦ខ្ទង់ *</label><input type="text" class="form-input" name="tracking_code" required /></div>
        <button type="submit" class="btn btn-primary" style="width:100%;margin-bottom:10px;" ${state.loading ? 'disabled' : ''}>${state.loading ? 'កំពុងដំណើរការ...' : 'ចូលទៅកាន់ពាក្យស្នើសុំ'}</button>
        <button type="button" class="btn btn-outline" style="width:100%;border:none;" data-action="back">ត្រឡប់ក្រោយ</button>
      </form>
    `;
    const form = el.querySelector('[data-role="form-resume"]');
    form.phone_login.value = state.phoneLogin;
    form.tracking_code.value = state.trackingCode;
    form.phone_login.addEventListener('input', () => { state.phoneLogin = form.phone_login.value; persist(); });
    form.tracking_code.addEventListener('input', () => { state.trackingCode = form.tracking_code.value.toUpperCase(); form.tracking_code.value = state.trackingCode; persist(); });
    form.addEventListener('submit', handleResume);
    el.querySelector('[data-action="back"]').addEventListener('click', () => setState({ mode: 'select' }));
    return el;
  }
  return el;
}

function fieldDiv(labelText, inputHtml) {
  const d = document.createElement('div');
  d.innerHTML = `<label class="input-label">${labelText}</label>${inputHtml}`;
  return d;
}

function bindTextInput(container, selector, name, extra = {}) {
  const input = container.querySelector(selector);
  input.value = state.formData[name] || '';
  onLiveInput(input, () => {
    setFormData({ [name]: input.value, ...(extra.onInputExtra ? extra.onInputExtra(input.value) : {}) });
    if (extra.alsoDuplicateCheck) scheduleDuplicateCheck();
  });
  return input;
}

function renderFormStep1() {
  const el = document.createElement('div');
  el.className = 'animate-fade-in';
  el.style.marginTop = '20px';

  el.innerHTML = `
    <h3 style="font-family:Moul;margin-bottom:20px;">ព័ត៌មានទូទៅ</h3>
    ${state.duplicateWarning ? `<div style="padding:12px;background:#fee2e2;color:#b91c1c;border-radius:8px;margin-bottom:15px;border:1px solid #fecaca;display:flex;align-items:center;gap:8px;">⚠ ${state.duplicateWarning}</div>` : ''}

    <div style="margin-bottom:24px;padding:24px;background:linear-gradient(145deg,#ffffff,#f8fafc);border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 10px 30px -10px rgba(0,0,0,0.05);">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
        <div style="padding:8px;background:#e0e7ff;border-radius:10px;color:var(--primary);">
          <i data-lucide="image" style="width:20px;height:20px"></i>
        </div>
        <h4 style="font-family:Moul;margin:0;color:#1e293b;font-size:1.1rem;">រូបថត ៤x៦</h4>
      </div>
      <div style="display:flex;align-items:stretch;gap:24px;flex-wrap:wrap;">
        <div style="flex:1 1 300px;position:relative;">
          <input type="file" id="photo-upload" accept="image/*" data-role="file-input" style="position:absolute;width:1px;height:1px;opacity:0;overflow:hidden;z-index:-1;" />
          <label for="photo-upload" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:180px;padding:20px;border:2px dashed #cbd5e1;border-radius:16px;background-color:#f8fafc;cursor:pointer;">
            <div style="width:48px;height:48px;border-radius:50%;background-color:#e2e8f0;display:flex;align-items:center;justify-content:center;margin-bottom:12px;color:#64748b;">
              <i data-lucide="upload" style="width:24px;height:24px"></i>
            </div>
            <span style="font-size:1rem;font-weight:600;color:var(--primary);margin-bottom:4px;">ចុចទីនេះដើម្បី Upload រូបថត</span>
            <span style="font-size:0.85rem;color:#64748b;text-align:center;">(ទទួលយកតែរូបថតបញ្ឈរចំពីមុខ)</span>
          </label>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:140px;">
          <div style="position:relative;width:120px;height:180px;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1);border:${state.croppedImageUrl ? '3px solid var(--primary)' : '1px solid #e2e8f0'};">
            ${state.croppedImageUrl
              ? `<img src="${state.croppedImageUrl}" alt="Cropped" style="width:100%;height:100%;object-fit:cover;" /><div style="position:absolute;bottom:0;left:0;right:0;padding:6px;background:rgba(79,70,229,0.9);color:white;font-size:0.75rem;text-align:center;font-weight:bold;">បានជ្រើសរើស</div>`
              : `<img src="/official_photo_sample.jpg" alt="គំរូ" style="width:100%;height:100%;object-fit:cover;opacity:0.8;" /><div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%);"></div><div style="position:absolute;bottom:8px;left:0;right:0;color:white;font-size:0.85rem;text-align:center;font-weight:bold;">រូបថតគំរូ</div>`}
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:12px;background:#fffbeb;border-radius:10px;border:1px solid #fde68a;">
        <i data-lucide="alert-triangle" style="width:20px;height:20px;color:#d97706;flex-shrink:0;margin-top:2px;"></i>
        <p style="font-size:0.85rem;color:#92400e;margin:0;line-height:1.5;">
          <strong>ចំណាំសំខាន់៖</strong> សូមថតបញ្ឈរចំពីមុខ មិនពាក់មួក មិនពាក់វ៉ែនតា និងត្រូវមាន <strong>ផ្ទៃខាងក្រោយពណ៌ស</strong>។ ប្រព័ន្ធរបស់យើងនឹងស្កេនពណ៌សដោយស្វ័យប្រវត្តិ។ រាល់រូបថតដែលមិនបំពេញលក្ខខណ្ឌ នឹងត្រូវបានបដិសេធ។
        </p>
      </div>
    </div>

    <div class="form-row" data-role="row-name"></div>
    <div class="form-row" data-role="row-personal"></div>
    <div class="form-row" data-role="row-monk"></div>

    <div style="display:flex;justify-content:space-between;margin-top:30px;padding:20px 0;border-top:1px solid #e2e8f0;">
      <button type="button" class="btn btn-outline" data-action="back0">ត្រឡប់ក្រោយ</button>
      <div style="display:flex;gap:5px;">
        <button type="button" class="btn btn-outline" data-action="save-draft" ${state.loading ? 'disabled' : ''}><i data-lucide="save" style="width:18px;height:18px;margin-right:8px;"></i> រក្សាទុក</button>
        <button type="button" class="btn btn-primary" data-action="next2">បន្ទាប់ <i data-lucide="arrow-right" style="width:18px;height:18px;margin-left:8px;"></i></button>
      </div>
    </div>
  `;

  el.querySelector('[data-role="file-input"]').addEventListener('change', handleFileChange);
  el.querySelector('[data-action="back0"]').addEventListener('click', () => setState({ activeStep: 0 }));
  el.querySelector('[data-action="save-draft"]').addEventListener('click', handleSaveDraft);
  el.querySelector('[data-action="next2"]').addEventListener('click', () => {
    if (!state.formData.monk_status) {
      setState({ error: 'សូមជ្រើសរើស "ឋានៈព្រះសង្ឃ" ជាមុនសិន ទើបអាចបន្តទៅមុខទៀតបាន!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setState({ error: null, activeStep: 2 });
  });

  // Name row
  const nameRow = el.querySelector('[data-role="row-name"]');
  nameRow.appendChild(fieldDiv('នាមត្រកូល *', `<input type="text" class="form-input" data-f="last_name" required />`));
  nameRow.appendChild(fieldDiv('នាមខ្លួន *', `<input type="text" class="form-input" data-f="first_name" required />`));
  nameRow.appendChild(fieldDiv('ឈ្មោះឡាតាំង', `<input type="text" class="form-input" data-f="latin_name" />`));
  ['last_name', 'first_name', 'latin_name'].forEach(f => {
    const input = nameRow.querySelector(`[data-f="${f}"]`);
    input.value = state.formData[f] || '';
    onLiveInput(input, () => { setFormData({ [f]: input.value }); scheduleDuplicateCheck(); });
  });

  // Personal row: nationality (creatable), gender (select), dob (date), phone (text)
  const personalRow = el.querySelector('[data-role="row-personal"]');
  const natWrap = fieldDiv('សញ្ជាតិ', '');
  const natSelect = createSearchSelect({
    options: state.nationalities.map(n => ({ value: String(n.id), label: n.name })),
    value: state.formData.new_nationality_name ? '' : String(state.formData.nationality || ''),
    creatable: true,
    placeholder: '--ជ្រើសរើស ឬ វាយបញ្ចូលថ្មី--',
    onChange: (v) => handleSelectChange('nationality', typeof v === 'string' && !state.nationalities.some(n => String(n.id) === v) ? { value: v, isNew: true } : v),
  });
  natWrap.appendChild(natSelect.el);
  personalRow.appendChild(natWrap);

  const genderWrap = fieldDiv('ភេទ', '');
  const genderSelect = createSearchSelect({
    options: [{ value: 'ប្រុស', label: 'ប្រុស' }, { value: 'ស្រី', label: 'ស្រី' }],
    value: state.formData.gender || 'ប្រុស',
    onChange: (v) => handleSelectChange('gender', v),
  });
  genderWrap.appendChild(genderSelect.el);
  personalRow.appendChild(genderWrap);

  personalRow.appendChild(fieldDiv('ថ្ងៃខែឆ្នាំកំណើត', `<input type="date" class="form-input" data-f="date_of_birth" />`));
  personalRow.appendChild(fieldDiv('លេខទូរស័ព្ទ *', `<input type="text" class="form-input" data-f="phone" required />`));
  ['date_of_birth', 'phone'].forEach(f => {
    const input = personalRow.querySelector(`[data-f="${f}"]`);
    input.value = state.formData[f] || '';
    onLiveInput(input, () => { setFormData({ [f]: input.value }); scheduleDuplicateCheck(); });
  });

  // Monk status row
  const monkRow = el.querySelector('[data-role="row-monk"]');
  const monkWrap = fieldDiv('ឋានៈព្រះសង្ឃ *', '');
  const monkSelect = createSearchSelect({
    options: [{ value: 'គ្រហស្ថ', label: 'គ្រហស្ថ' }, { value: 'សាមណេរ', label: 'សាមណេរ' }, { value: 'ភិក្ខុ', label: 'ភិក្ខុ' }],
    value: state.formData.monk_status || '',
    placeholder: '--ជ្រើសរើស--',
    onChange: (v) => handleSelectChange('monk_status', v),
  });
  monkWrap.appendChild(monkSelect.el);
  monkRow.appendChild(monkWrap);

  const monkStatus = (state.formData.monk_status || '').trim();
  if (monkStatus === 'សាមណេរ' || monkStatus === 'ភិក្ខុ') {
    const pagodaWrap = fieldDiv('វត្តកំពុងស្នាក់', '');
    const pagodaSelect = createSearchSelect({
      options: state.pagodas.map(p => ({ value: String(p.id), label: p.name })),
      value: state.formData.new_current_pagoda_name ? '' : String(state.formData.current_pagoda || ''),
      creatable: true,
      placeholder: '--ជ្រើសរើស ឬ វាយបញ្ចូលថ្មី--',
      onChange: (v) => handleSelectChange('current_pagoda', typeof v === 'string' && !state.pagodas.some(p => String(p.id) === v) ? { value: v, isNew: true } : v),
    });
    pagodaWrap.appendChild(pagodaSelect.el);
    monkRow.appendChild(pagodaWrap);

    const kutiWrap = fieldDiv('កុដិ', '');
    const filteredKutis = state.kutis.filter(k => k.pagoda === Number(state.formData.current_pagoda));
    const kutiSelect = createSearchSelect({
      options: filteredKutis.map(k => ({ value: String(k.id), label: k.kuti_name })),
      value: state.formData.new_kuti_name ? '' : String(state.formData.kuti || ''),
      creatable: true,
      placeholder: '--ជ្រើសរើស ឬ វាយបញ្ចូលថ្មី--',
      onChange: (v) => handleSelectChange('kuti', typeof v === 'string' && !filteredKutis.some(k => String(k.id) === v) ? { value: v, isNew: true } : v),
    });
    kutiWrap.appendChild(kutiSelect.el);
    monkRow.appendChild(kutiWrap);
  }

  if (window.lucide) window.lucide.createIcons();
  return el;
}

function renderFormStep2() {
  const isMonk = (state.formData.monk_status || '').trim() === 'សាមណេរ' || (state.formData.monk_status || '').trim() === 'ភិក្ខុ';
  const el = document.createElement('div');
  el.className = 'animate-fade-in';
  el.style.marginTop = '20px';
  el.innerHTML = `
    <h3 style="font-family:Moul;margin-bottom:20px;">ព័ត៌មានផ្សេងៗ</h3>
    <div class="form-row">
      <div>
        <label class="input-label">កម្រិតវប្បធម៌</label>
        <select class="form-input" data-f="education_level">
          <option value="">--ជ្រើសរើស--</option>
          <option value="បឋមសិក្សា">បឋមសិក្សា</option>
          <option value="អនុវិទ្យាល័យ">អនុវិទ្យាល័យ</option>
          <option value="វិទ្យាល័យ">វិទ្យាល័យ</option>
          <option value="បរិញ្ញាបត្រ">បរិញ្ញាបត្រ</option>
          <option value="បរិញ្ញាបត្រជាន់ខ្ពស់">បរិញ្ញាបត្រជាន់ខ្ពស់</option>
          <option value="បណ្ឌិត">បណ្ឌិត</option>
        </select>
      </div>
      <div data-role="birth-pagoda"></div>
    </div>
    <div style="margin-top:15px;">
      <h4 style="margin-bottom:10px;">ទីកន្លែងកំណើត</h4>
      <div class="form-row" data-role="geo-row"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:30px;padding:20px 0;border-top:1px solid #e2e8f0;">
      <button type="button" class="btn btn-outline" data-action="back1">ត្រឡប់ក្រោយ</button>
      <div style="display:flex;gap:10px;">
        <button type="button" class="btn btn-outline" data-action="save-draft" ${state.loading ? 'disabled' : ''}><i data-lucide="save" style="width:18px;height:18px;margin-right:8px;"></i> រក្សាទុក</button>
        ${isMonk
          ? `<button type="button" class="btn btn-primary" data-action="next3">បន្ទាប់ <i data-lucide="arrow-right" style="width:18px;height:18px;margin-left:8px;"></i></button>`
          : `<button type="button" class="btn btn-primary" style="background:var(--success)" data-action="submit" ${state.loading ? 'disabled' : ''}><i data-lucide="send" style="width:18px;height:18px;margin-right:8px;"></i> បញ្ជូនពាក្យស្នើសុំ</button>`}
      </div>
    </div>
  `;

  el.querySelector('[data-f="education_level"]').value = state.formData.education_level || '';
  el.querySelector('[data-f="education_level"]').addEventListener('change', (e) => setFormData({ education_level: e.target.value }));
  el.querySelector('[data-action="back1"]').addEventListener('click', () => setState({ activeStep: 1 }));
  el.querySelector('[data-action="save-draft"]').addEventListener('click', handleSaveDraft);
  const next3 = el.querySelector('[data-action="next3"]');
  if (next3) next3.addEventListener('click', () => setState({ activeStep: 3 }));
  const submitBtn = el.querySelector('[data-action="submit"]');
  if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

  const birthPagodaWrap = el.querySelector('[data-role="birth-pagoda"]');
  birthPagodaWrap.innerHTML = `<label class="input-label">វត្តកំណើត</label>`;
  const birthPagodaSelect = createSearchSelect({
    options: state.pagodas.map(p => ({ value: String(p.id), label: p.name })),
    value: state.formData.new_birth_pagoda_name ? '' : String(state.formData.birth_pagoda || ''),
    creatable: true,
    placeholder: '--ជ្រើសរើស ឬ វាយបញ្ចូលថ្មី--',
    onChange: (v) => handleSelectChange('birth_pagoda', typeof v === 'string' && !state.pagodas.some(p => String(p.id) === v) ? { value: v, isNew: true } : v),
  });
  birthPagodaWrap.appendChild(birthPagodaSelect.el);

  const geoRow = el.querySelector('[data-role="geo-row"]');
  const provinceWrap = fieldDiv('ខេត្ត/រាជធានី', '');
  const provinceSelect = createSearchSelect({
    options: state.provinces.map(p => ({ value: String(p.province_code), label: p.name_kh })),
    value: String(state.formData.birth_province_code || ''),
    placeholder: '--ជ្រើសរើស--',
    onChange: (v) => handleGeoSelectChange('birth_province_code', v),
  });
  provinceWrap.appendChild(provinceSelect.el);
  geoRow.appendChild(provinceWrap);

  const districtWrap = fieldDiv('ស្រុក/ខណ្ឌ', '');
  const filteredDistricts = state.districts.filter(d => String(d.province) === String(state.formData.birth_province_code));
  const districtSelect = createSearchSelect({
    options: filteredDistricts.map(d => ({ value: String(d.district_code), label: d.name_kh })),
    value: String(state.formData.birth_district_code || ''),
    placeholder: '--ជ្រើសរើស--',
    onChange: (v) => handleGeoSelectChange('birth_district_code', v),
  });
  if (!state.formData.birth_province_code) districtSelect.el.style.opacity = '0.6';
  districtWrap.appendChild(districtSelect.el);
  geoRow.appendChild(districtWrap);

  const communeWrap = fieldDiv('ឃុំ/សង្កាត់', '');
  const filteredCommunes = state.communes.filter(c => String(c.district) === String(state.formData.birth_district_code));
  const communeSelect = createSearchSelect({
    options: filteredCommunes.map(c => ({ value: String(c.commune_code), label: c.name_kh })),
    value: String(state.formData.birth_commune_code || ''),
    placeholder: '--ជ្រើសរើស--',
    onChange: (v) => handleGeoSelectChange('birth_commune_code', v),
  });
  communeWrap.appendChild(communeSelect.el);
  geoRow.appendChild(communeWrap);

  const villageWrap = fieldDiv('ភូមិ', '');
  const filteredVillages = state.villages.filter(v => String(v.commune) === String(state.formData.birth_commune_code));
  const villageSelect = createSearchSelect({
    options: filteredVillages.map(v => ({ value: String(v.village_code), label: v.name_kh })),
    value: String(state.formData.birth_village_code || ''),
    placeholder: '--ជ្រើសរើស--',
    onChange: (v) => handleGeoSelectChange('birth_village_code', v),
  });
  villageWrap.appendChild(villageSelect.el);
  geoRow.appendChild(villageWrap);

  if (window.lucide) window.lucide.createIcons();
  return el;
}

function renderFormStep3() {
  const monkStatus = (state.formData.monk_status || '').trim();
  const el = document.createElement('div');
  el.className = 'animate-fade-in';
  el.style.marginTop = '20px';
  el.innerHTML = `
    <h3 style="font-family:Moul;margin-bottom:20px;">ឯកសារព្រះសង្ឃ</h3>
    <div class="form-row" style="padding:20px;background:#f8fafc;border-radius:8px;border:1px dashed #cbd5e1;" data-role="doc-fields"></div>
    <div style="display:flex;justify-content:space-between;margin-top:30px;padding:20px 0;border-top:1px solid #e2e8f0;">
      <button type="button" class="btn btn-outline" data-action="back2">ត្រឡប់ក្រោយ</button>
      <button type="button" class="btn btn-primary" style="background:var(--success)" data-action="submit" ${state.loading ? 'disabled' : ''}><i data-lucide="send" style="width:18px;height:18px;margin-right:8px;"></i> បញ្ជូនពាក្យស្នើសុំ</button>
    </div>
  `;
  el.querySelector('[data-action="back2"]').addEventListener('click', () => setState({ activeStep: 2 }));
  el.querySelector('[data-action="submit"]').addEventListener('click', handleSubmit);

  const docFields = el.querySelector('[data-role="doc-fields"]');
  if (monkStatus === 'ភិក្ខុ') {
    docFields.appendChild(fieldDiv('ឈ្មោះឆាយា', `<input type="text" class="form-input" data-f="chaya_name" />`));
    docFields.appendChild(fieldDiv('លេខឆាយា', `<input type="text" class="form-input" data-f="chaya_no" />`));
  } else if (monkStatus === 'សាមណេរ') {
    docFields.appendChild(fieldDiv('លេខសង្ឃាដិក', `<input type="text" class="form-input" data-f="sanghatika_no" />`));
  }
  docFields.appendChild(fieldDiv('ថ្ងៃបួស', `<input type="date" class="form-input" data-f="ordination_date" />`));
  docFields.appendChild(fieldDiv('ឈ្មោះព្រះឧបជ្ឈាយ៍', `<input type="text" class="form-input" data-f="preceptor_name" />`));
  docFields.querySelectorAll('[data-f]').forEach(input => {
    const f = input.dataset.f;
    input.value = state.formData[f] || '';
    onLiveInput(input, () => setFormData({ [f]: input.value }));
  });

  if (window.lucide) window.lucide.createIcons();
  return el;
}

function renderFinished() {
  const el = document.createElement('div');
  el.style.textAlign = 'center';
  el.style.padding = '50px 20px';
  el.innerHTML = `
    <i data-lucide="check-circle" style="width:64px;height:64px;color:var(--success);margin-bottom:20px;"></i>
    <h2 style="font-family:Moul;color:var(--success);margin-bottom:15px;">បញ្ជូនពាក្យស្នើសុំជោគជ័យ!</h2>
    <p style="font-size:1.1rem;margin-bottom:30px;">
      សាលាបានទទួលពាក្យស្នើសុំរបស់អ្នកហើយ។ លេខកូដតាមដានរបស់អ្នកគឺ
      <strong style="color:var(--primary);font-size:1.3rem;background:#e0e7ff;padding:4px 10px;border-radius:6px;">${state.formData.tracking_code}</strong>។
    </p>
    <button class="btn btn-primary" data-action="home"><i data-lucide="home" style="width:18px;height:18px;margin-right:8px;"></i> ត្រឡប់ទៅទំព័រដើម</button>
  `;
  el.querySelector('[data-action="home"]').addEventListener('click', () => {
    clearSession();
    state = { ...state, activeStep: 0, mode: 'select', formData: { ...DEFAULT_FORM }, trackingCode: '', phoneLogin: '' };
    update();
  });
  if (window.lucide) window.lucide.createIcons();
  return el;
}

function renderSessionClosed() {
  const el = document.createElement('div');
  el.style.minHeight = '100vh';
  el.style.backgroundColor = '#f1f5f9';
  el.style.padding = '40px 20px';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.innerHTML = `
    <div style="max-width:600px;width:100%;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.05);padding:50px 30px;text-align:center;">
      <div style="width:80px;height:80px;background:#fee2e2;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <span style="font-size:40px;">🔒</span>
      </div>
      <h2 style="font-family:Moul;color:#b91c1c;margin-bottom:15px;">ការចុះឈ្មោះត្រូវបានបិទ</h2>
      <p style="font-size:1.1rem;color:#64748b;">សូមអភ័យទោស ទំព័រចុះឈ្មោះចូលរៀនត្រូវបានបិទជាបណ្តោះអាសន្ន ឬផុតកំណត់។ សូមរង់ចាំការជូនដំណឹងពីសាលានាពេលក្រោយ។</p>
    </div>
  `;
  return el;
}

function update() {
  if (!root) return;
  if (state.sessionActive === false) {
    root.innerHTML = '';
    root.appendChild(renderSessionClosed());
    return;
  }

  root.innerHTML = `
    <div style="min-height:100vh;background-color:#f1f5f9;padding:40px 20px;font-family:'Inter','Battambang',sans-serif;">
      <div style="max-width:900px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.05);padding:30px;" data-role="card">
        <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #f1f5f9;">
          <div style="display:flex;align-items:center;justify-content:center;gap:30px;margin-bottom:20px;">
            <img src="/logo.jpg" alt="Logo" style="width:90px;height:90px;object-fit:cover;display:block;border-radius:50%;border:2px solid white;box-shadow:0 4px 15px rgba(0,0,0,0.08);" />
            <img src="/logo_1.png" alt="Logo អគាធិការ" style="width:90px;height:90px;object-fit:cover;display:block;border-radius:50%;border:2px solid white;box-shadow:0 4px 15px rgba(0,0,0,0.08);" />
          </div>
          <h2 style="font-family:Moul;color:var(--primary);margin-bottom:10px;font-size:1.4rem;">សាលាពុទ្ធិកអនុវិទ្យាល័យ</h2>
          <h3 style="font-family:Moul;color:var(--primary);margin-bottom:0;font-size:1rem;">សម្តេចព្រះសង្ឃរាជ ទេព វង្ស និរោធរង្សី</h3>
        </div>
        ${state.error ? `<div style="padding:12px;background:#fee2e2;color:#b91c1c;border-radius:8px;margin-bottom:20px;border:1px solid #fecaca;">${state.error}</div>` : ''}
        ${state.successMsg ? `<div style="padding:12px;background:#dcfce3;color:#15803d;border-radius:8px;margin-bottom:20px;border:1px solid #bbf7d0;">${state.successMsg}</div>` : ''}
        ${state.activeStep < 4 && state.activeStep > 0 ? `
          <div style="display:flex;gap:15px;margin-bottom:20px;border-bottom:1px solid #e2e8f0;padding-bottom:15px;flex-wrap:wrap;">
            <div data-step-tab="1" style="cursor:pointer;font-weight:${state.activeStep === 1 ? 'bold' : 'normal'};color:${state.activeStep === 1 ? 'var(--primary)' : '#64748b'};">១. ព័ត៌មាន</div>
            <div style="color:#cbd5e1;">/</div>
            <div data-step-tab="2" style="cursor:pointer;font-weight:${state.activeStep === 2 ? 'bold' : 'normal'};color:${state.activeStep === 2 ? 'var(--primary)' : '#64748b'};">២. ជិវប្រវត្តិ</div>
            ${(['សាមណេរ', 'ភិក្ខុ'].includes((state.formData.monk_status || '').trim())) ? `
              <div style="color:#cbd5e1;">/</div>
              <div data-step-tab="3" style="cursor:pointer;font-weight:${state.activeStep === 3 ? 'bold' : 'normal'};color:${state.activeStep === 3 ? 'var(--primary)' : '#64748b'};">៣. ឯកសារព្រះសង្ឃ</div>
            ` : ''}
          </div>
        ` : ''}
        <div data-role="step-content"></div>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-step-tab]').forEach(tab => {
    tab.addEventListener('click', () => setState({ activeStep: Number(tab.dataset.stepTab) }));
  });

  const stepContent = root.querySelector('[data-role="step-content"]');
  if (state.activeStep === 0) stepContent.appendChild(renderStartScreen());
  else if (state.activeStep === 1) stepContent.appendChild(renderFormStep1());
  else if (state.activeStep === 2) stepContent.appendChild(renderFormStep2());
  else if (state.activeStep === 3) stepContent.appendChild(renderFormStep3());
  else if (state.activeStep === 4) stepContent.appendChild(renderFinished());

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  root.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-secondary);">កំពុងផ្ទុក...</div>';
  validateResumedSession().then(loadDropdowns).then(update);
}

export function destroy() {
  clearTimeout(duplicateTimer);
  root = null;
}
