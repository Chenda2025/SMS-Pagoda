// Public teacher-application form, modeled on publicApply.js (student version)
// but simplified to a single info step since teacher records carry far fewer fields.

import { createSearchSelect } from '../components/searchSelect.js';
import { createImageCropper } from '../components/imageCrop.js';
import { openModal } from '../components/modal.js';
import { withFocusPreserved, onLiveInput } from '../utils/dom.js';

const HOST = window.location.hostname;
const API_URL = `http://${HOST}:8000/api/users/public-apply-teacher/`;

async function getJSON(url) {
  const r = await fetch(url);
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
  monk_status: '', phone: '', start_date: ''
};

let root = null;
let cropper = null;
let cropModalHandle = null;

let state = {
  activeStep: getInitialState('apply_teacher_activeStep', 0),
  loading: false,
  error: null,
  successMsg: null,
  mode: getInitialState('apply_teacher_mode', 'select'),
  sessionActive: null,
  trackingCode: getInitialState('apply_teacher_trackingCode', ''),
  phoneLogin: getInitialState('apply_teacher_phoneLogin', ''),
  formData: getInitialState('apply_teacher_formData', { ...DEFAULT_FORM }),
  imageSrc: null,
  croppedImageFile: null,
  croppedImageUrl: null,
};

async function checkActiveSession() {
  try {
    await getJSON(`http://${HOST}:8000/api/users/teacher-registration-sessions/active/`);
    setState({ sessionActive: true });
  } catch {
    setState({ sessionActive: false });
  }
}

function persist() {
  localStorage.setItem('apply_teacher_activeStep', JSON.stringify(state.activeStep));
  localStorage.setItem('apply_teacher_mode', JSON.stringify(state.mode));
  localStorage.setItem('apply_teacher_trackingCode', JSON.stringify(state.trackingCode));
  localStorage.setItem('apply_teacher_phoneLogin', JSON.stringify(state.phoneLogin));
  localStorage.setItem('apply_teacher_formData', JSON.stringify(state.formData));
}

function clearSession() {
  ['apply_teacher_activeStep', 'apply_teacher_mode', 'apply_teacher_trackingCode', 'apply_teacher_phoneLogin', 'apply_teacher_formData'].forEach(k => localStorage.removeItem(k));
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
        resetStaleSession('ពាក្យស្នើសុំចាស់របស់អ្នកត្រូវបានបញ្ជូន ឬអនុម័តរួចហើយ។ សូមចាប់ផ្តើមការដាក់ពាក្យសុំថ្មីម្តងទៀត។');
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

async function handleStartNew(e) {
  e.preventDefault();
  if (!state.formData.first_name || !state.formData.last_name || !state.formData.phone) {
    setState({ error: 'សូមបញ្ចូល នាមខ្លួន នាមត្រកូល និងលេខទូរស័ព្ទ' });
    return;
  }
  setState({ loading: true, error: null });
  try {
    const res = await postForm(API_URL, (() => {
      const fd = new FormData();
      fd.append('first_name', state.formData.first_name);
      fd.append('last_name', state.formData.last_name);
      fd.append('phone', state.formData.phone);
      return fd;
    })());
    state = { ...state, formData: res.data };
    setState({
      loading: false,
      successMsg: `ពាក្យស្នើសុំត្រូវបានចាប់ផ្តើម! លេខកូដតាមដានរបស់អ្នកគឺ៖ ${res.data.tracking_code}. សូមរក្សាទុកលេខកូដនេះដើម្បីចូលមកកែប្រែថ្ងៃក្រោយ!`,
      activeStep: 1,
    });
  } catch (err) {
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
    setState({ loading: false, successMsg: 'រក្សាទុកពង្រាងបានជោគជ័យ។ លោកអ្នកអាចត្រឡប់មកបំពេញបន្តនៅពេលក្រោយ។' });
  } catch (err) {
    const msg = err.response?.data?.error;
    if (msg === ALREADY_APPROVED_ERROR) {
      resetStaleSession(`${msg} សូមចាប់ផ្តើមការដាក់ពាក្យសុំថ្មីម្តងទៀត។`);
      update();
      return;
    }
    setState({ loading: false, error: msg || 'បរាជ័យក្នុងការរក្សាទុក។' });
  }
}

async function handleSubmit() {
  if (!state.formData.monk_status) {
    setState({ error: 'សូមជ្រើសរើស "ឋានៈព្រះសង្ឃ" ជាមុនសិន' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (!window.confirm('តើអ្នកពិតជាចង់បញ្ជូនពាក្យស្នើសុំមែនទេ? បន្ទាប់ពីបញ្ជូន អ្នកមិនអាចកែប្រែបានទៀតទេ។')) return;
  setState({ loading: true, error: null, successMsg: null });
  try {
    const res = await postForm(API_URL, buildFormDataPayload({ status: 'submitted' }));
    state = { ...state, formData: res.data };
    setState({ loading: false, successMsg: 'ពាក្យស្នើសុំត្រូវបានបញ្ជូនទៅសាលាដោយជោគជ័យ! សូមរង់ចាំការពិនិត្យពីផ្នែករដ្ឋបាល។', activeStep: 2 });
  } catch (err) {
    const data = err.response?.data;
    let msg = 'បរាជ័យក្នុងការបញ្ជូន។';
    if (data?.error) msg = data.error;
    else if (data) msg = `បរាជ័យក្នុងការបញ្ជូន។ ព័ត៌មានលម្អិត: ${Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')}`;
    if (msg === ALREADY_APPROVED_ERROR) {
      resetStaleSession(`${msg} សូមចាប់ផ្តើមការដាក់ពាក្យសុំថ្មីម្តងទៀត។`);
      update();
      return;
    }
    setState({ loading: false, error: msg });
  }
}

function handleSelectChange(name, val) {
  const value = typeof val === 'object' ? val.value : val;
  setFormData({ [name]: value });
}

// Accepts a 4x6 portrait with either a white or a blue (ID-photo style) background.
function isWhiteOrBlueCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const tl = ctx.getImageData(0, 0, 10, 10).data;
  const tr = ctx.getImageData(canvas.width - 10, 0, 10, 10).data;
  const avg = (data) => {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
    const count = data.length / 4;
    return { r: r / count, g: g / count, b: b / count };
  };
  const isWhite = ({ r, g, b }) => r > 235 && g > 235 && b > 235;
  const isBlue = ({ r, g, b }) => b > 120 && b > r + 30 && b > g + 15;
  const cTl = avg(tl);
  const cTr = avg(tr);
  return (isWhite(cTl) && isWhite(cTr)) || (isBlue(cTl) && isBlue(cTr));
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
  if (!isWhiteOrBlueCanvas(canvas)) {
    alert('រូបថតនេះមិនមានផ្ទៃខាងក្រោយពណ៌ស ឬពណ៌ខៀវទេ។ សូមជ្រើសរើសរូបថតផ្ទៃខាងក្រោយពណ៌ស ឬពណ៌ខៀវ (៤x៦)។\n(Photo background must be white or blue)');
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
      <p style="color:var(--text-secondary);margin-bottom:20px;font-family:Moul;">ដាក់ពាក្យសុំធ្វើគ្រូបង្រៀន</p>
      <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
        <button class="btn btn-primary" data-action="mode-new" style="padding:12px 24px;font-size:1.1rem;">ដាក់ពាក្យសុំថ្មី</button>
        <button class="btn btn-outline" data-action="mode-resume" style="padding:12px 24px;font-size:1.1rem;">បន្តពាក្យសុំចាស់</button>
      </div>
    `;
    el.querySelector('[data-action="mode-new"]').addEventListener('click', () => setState({ mode: 'new' }));
    el.querySelector('[data-action="mode-resume"]').addEventListener('click', () => setState({ mode: 'resume' }));
    return el;
  }

  if (state.mode === 'new') {
    el.innerHTML = `
      <form data-role="form-new" style="max-width:500px;margin:0 auto;">
        <h3 style="font-family:Moul;margin-bottom:20px;text-align:center;">ចាប់ផ្តើមដាក់ពាក្យសុំថ្មី</h3>
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
        <h3 style="font-family:Moul;margin-bottom:20px;text-align:center;">បន្តពាក្យសុំចាស់</h3>
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

function renderFormStep() {
  const el = document.createElement('div');
  el.className = 'animate-fade-in';
  el.style.marginTop = '20px';

  el.innerHTML = `
    <h3 style="font-family:Moul;margin-bottom:20px;">ព័ត៌មានគ្រូបង្រៀន</h3>

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
          <div style="position:relative;width:120px;height:180px;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1);border:${state.croppedImageUrl ? '3px solid var(--primary)' : '1px solid #e2e8f0'};background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
            ${state.croppedImageUrl
              ? `<img src="${state.croppedImageUrl}" alt="Cropped" style="width:100%;height:100%;object-fit:cover;" /><div style="position:absolute;bottom:0;left:0;right:0;padding:6px;background:rgba(79,70,229,0.9);color:white;font-size:0.75rem;text-align:center;font-weight:bold;">បានជ្រើសរើស</div>`
              : `<i data-lucide="user" style="width:40px;height:40px;color:#cbd5e1;"></i>`}
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:12px;background:#fffbeb;border-radius:10px;border:1px solid #fde68a;">
        <i data-lucide="alert-triangle" style="width:20px;height:20px;color:#d97706;flex-shrink:0;margin-top:2px;"></i>
        <p style="font-size:0.85rem;color:#92400e;margin:0;line-height:1.5;">
          <strong>ចំណាំសំខាន់៖</strong> សូមថតបញ្ឈរចំពីមុខ មិនពាក់មួក មិនពាក់វ៉ែនតា និងត្រូវមាន <strong>ផ្ទៃខាងក្រោយពណ៌ស ឬពណ៌ខៀវ</strong> តែប៉ុណ្ណោះ។ ប្រព័ន្ធរបស់យើងនឹងស្កេនពណ៌ដោយស្វ័យប្រវត្តិ។ រាល់រូបថតដែលមិនបំពេញលក្ខខណ្ឌ នឹងត្រូវបានបដិសេធ។
        </p>
      </div>
    </div>

    <div class="form-row" data-role="row-name"></div>
    <div class="form-row" data-role="row-personal"></div>

    <div style="display:flex;justify-content:space-between;margin-top:30px;padding:20px 0;border-top:1px solid #e2e8f0;">
      <button type="button" class="btn btn-outline" data-action="back0">ត្រឡប់ក្រោយ</button>
      <div style="display:flex;gap:5px;">
        <button type="button" class="btn btn-outline" data-action="save-draft" ${state.loading ? 'disabled' : ''}><i data-lucide="save" style="width:18px;height:18px;margin-right:8px;"></i> រក្សាទុក</button>
        <button type="button" class="btn btn-primary" style="background:var(--success)" data-action="submit" ${state.loading ? 'disabled' : ''}><i data-lucide="send" style="width:18px;height:18px;margin-right:8px;"></i> បញ្ជូនពាក្យស្នើសុំ</button>
      </div>
    </div>
  `;

  el.querySelector('[data-role="file-input"]').addEventListener('change', handleFileChange);
  el.querySelector('[data-action="back0"]').addEventListener('click', () => setState({ activeStep: 0 }));
  el.querySelector('[data-action="save-draft"]').addEventListener('click', handleSaveDraft);
  el.querySelector('[data-action="submit"]').addEventListener('click', handleSubmit);

  // Name row
  const nameRow = el.querySelector('[data-role="row-name"]');
  nameRow.appendChild(fieldDiv('នាមត្រកូល *', `<input type="text" class="form-input" data-f="last_name" required />`));
  nameRow.appendChild(fieldDiv('នាមខ្លួន *', `<input type="text" class="form-input" data-f="first_name" required />`));
  nameRow.appendChild(fieldDiv('ឈ្មោះឡាតាំង', `<input type="text" class="form-input" data-f="latin_name" />`));
  ['last_name', 'first_name', 'latin_name'].forEach(f => {
    const input = nameRow.querySelector(`[data-f="${f}"]`);
    input.value = state.formData[f] || '';
    onLiveInput(input, () => setFormData({ [f]: input.value }));
  });

  // Personal row: gender, monk_status, phone, start_date
  const personalRow = el.querySelector('[data-role="row-personal"]');

  const genderWrap = fieldDiv('ភេទ', '');
  const genderSelect = createSearchSelect({
    options: [{ value: 'ប្រុស', label: 'ប្រុស' }, { value: 'ស្រី', label: 'ស្រី' }],
    value: state.formData.gender || 'ប្រុស',
    onChange: (v) => handleSelectChange('gender', v),
  });
  genderWrap.appendChild(genderSelect.el);
  personalRow.appendChild(genderWrap);

  const monkWrap = fieldDiv('ឋានៈព្រះសង្ឃ *', '');
  const monkSelect = createSearchSelect({
    options: [{ value: 'គ្រហស្ថ', label: 'គ្រហស្ថ' }, { value: 'សាមណេរ', label: 'សាមណេរ' }, { value: 'ភិក្ខុ', label: 'ភិក្ខុ' }, { value: 'ដូនជី', label: 'ដូនជី' }],
    value: state.formData.monk_status || '',
    placeholder: '--ជ្រើសរើស--',
    onChange: (v) => handleSelectChange('monk_status', v),
  });
  monkWrap.appendChild(monkSelect.el);
  personalRow.appendChild(monkWrap);

  personalRow.appendChild(fieldDiv('លេខទូរស័ព្ទ *', `<input type="text" class="form-input" data-f="phone" required />`));
  personalRow.appendChild(fieldDiv('ថ្ងៃអាចចូលបម្រើការ', `<input type="date" class="form-input" data-f="start_date" />`));
  ['phone', 'start_date'].forEach(f => {
    const input = personalRow.querySelector(`[data-f="${f}"]`);
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
      <h2 style="font-family:Moul;color:#b91c1c;margin-bottom:15px;">តំណដាក់ពាក្យសុំត្រូវបានបិទ</h2>
      <p style="font-size:1.1rem;color:#64748b;">សូមអភ័យទោស តំណដាក់ពាក្យសុំធ្វើគ្រូបង្រៀនត្រូវបានបិទជាបណ្តោះអាសន្ន ឬផុតកំណត់។ សូមរង់ចាំការជូនដំណឹងពីសាលានាពេលក្រោយ។</p>
    </div>
  `;
  return el;
}

function update() {
  if (!root) return;
  if (state.sessionActive === null) {
    root.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-secondary);">កំពុងផ្ទុក...</div>';
    return;
  }
  if (state.sessionActive === false) {
    root.innerHTML = '';
    root.appendChild(renderSessionClosed());
    return;
  }

  root.innerHTML = `
    <div style="min-height:100vh;background-color:#f1f5f9;padding:40px 20px;font-family:'Inter','Battambang',sans-serif;">
      <div style="max-width:900px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.05);padding:30px;">
        <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #f1f5f9;">
          <h2 style="font-family:Moul;color:var(--primary);margin-bottom:10px;font-size:1.4rem;">សាលាពុទ្ធិកអនុវិទ្យាល័យ</h2>
          <h3 style="font-family:Moul;color:var(--primary);margin-bottom:0;font-size:1rem;">ដាក់ពាក្យសុំធ្វើគ្រូបង្រៀន</h3>
        </div>
        ${state.error ? `<div style="padding:12px;background:#fee2e2;color:#b91c1c;border-radius:8px;margin-bottom:20px;border:1px solid #fecaca;">${state.error}</div>` : ''}
        ${state.successMsg ? `<div style="padding:12px;background:#dcfce3;color:#15803d;border-radius:8px;margin-bottom:20px;border:1px solid #bbf7d0;">${state.successMsg}</div>` : ''}
        <div data-role="step-content"></div>
      </div>
    </div>
  `;

  const stepContent = root.querySelector('[data-role="step-content"]');
  if (state.activeStep === 0) stepContent.appendChild(renderStartScreen());
  else if (state.activeStep === 1) stepContent.appendChild(renderFormStep());
  else if (state.activeStep === 2) stepContent.appendChild(renderFinished());

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  update();
  validateResumedSession().then(checkActiveSession);
}

export function destroy() {
  root = null;
}
