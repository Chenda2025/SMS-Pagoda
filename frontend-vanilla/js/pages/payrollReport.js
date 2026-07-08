import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { buildStandardReportElement } from '../components/reportTemplate.js';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

let root = null;
let state = {
  loading: true,
  teachers: [],
  subjects: [],
  classrooms: [],
  classSubjects: [],
  periods: [],
  payroll: [],
  academicPeriodId: null,
  classroomFilter: null,
  filterMenuOpen: false,
  tgMenuOpen: false,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(num) {
  if (isNaN(num) || num === null || num === '') return '0';
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function teacherName(id) {
  const t = state.teachers.find(x => x.id === +id);
  return t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : '—';
}
function teacherInitial(id) { return teacherName(id).charAt(0).toUpperCase() || '?'; }
function subjectName(id)    { return state.subjects.find(x => x.id === +id)?.subject_name ?? '—'; }
function totalHours(id)     { return state.subjects.find(x => x.id === +id)?.total_hours ?? '—'; }

function currentPeriodName() {
  return state.periods.find(p => p.id === state.academicPeriodId)?.name ?? '';
}
function currentClassroomName() {
  return state.classrooms.find(c => c.id === state.classroomFilter)?.class_name ?? 'ទាំងអស់';
}

function defaultPeriodId(periods) {
  const today = new Date().toISOString().slice(0, 10);
  const match = periods.find(p => p.start_date <= today && today <= p.end_date);
  return match ? match.id : (periods[0]?.id ?? null);
}

function getRows() {
  let cs = state.classroomFilter
    ? state.classSubjects.filter(c => c.classroom === state.classroomFilter)
    : state.classSubjects;
    
  // Sort: Teachers with multiple subjects first, then alphabetically
  const counts = {};
  cs.forEach(c => { counts[c.teacher] = (counts[c.teacher] || 0) + 1; });
  cs = [...cs].sort((a, b) => {
    // 1. Pali and Sanskrit first
    const sA = subjectName(a.subject);
    const sB = subjectName(b.subject);
    const weightA = sA.includes('បាលី') ? 1 : (sA.includes('សំស្ក្រឹត') || sA.includes('សំស្រ្កឹត') ? 2 : 3);
    const weightB = sB.includes('បាលី') ? 1 : (sB.includes('សំស្ក្រឹត') || sB.includes('សំស្រ្កឹត') ? 2 : 3);
    if (weightA !== weightB) return weightA - weightB;

    // 2. Teachers with multiple subjects
    const diff = counts[b.teacher] - counts[a.teacher];
    if (diff !== 0) return diff;
    
    // 3. Alphabetically by teacher name
    return teacherName(a.teacher).localeCompare(teacherName(b.teacher));
  });

  return cs.map(c => {
    const pr = state.payroll.find(r => r.class_subject === c.id) || {};
    const rate     = parseFloat(pr.rate_per_hour) || 0;
    const teaching = parseFloat(pr.total_teaching) || 0;
    const amount   = parseFloat(pr.total_amount) || (rate * teaching);
    const note     = pr.note || '';
    return { cs: c, rate, teaching, amount, note };
  });
}

function grandTotal(rows) {
  return rows.reduce((s, r) => s + r.amount, 0);
}

// ── Data ──────────────────────────────────────────────────────────────────────

async function loadPayroll() {
  const params = state.academicPeriodId
    ? `?academic_period_id=${state.academicPeriodId}&limit=1000`
    : '?limit=1000';
  const res = await api.get(`/api/core/payroll-rates/${params}`);
  state.payroll = res.data || [];
}

async function loadData() {
  state.loading = true;
  update();
  try {
    const [tRes, sRes, cRes, csRes, perRes] = await Promise.all([
      api.get('/api/users/teachers/?limit=1000'),
      api.get('/api/core/subjects/?limit=1000'),
      api.get('/api/core/classrooms/?limit=1000'),
      api.get('/api/core/class-subjects/?limit=1000'),
      api.get('/api/core/academic-periods/'),
    ]);
    state.teachers      = tRes.data  || [];
    state.subjects      = sRes.data  || [];
    state.classrooms    = [...(cRes.data || [])].sort((a, b) => (a.grade_level - b.grade_level) || a.class_name.localeCompare(b.class_name));
    state.classSubjects = csRes.data || [];
    state.periods       = perRes.data || [];
    if (!state.academicPeriodId) state.academicPeriodId = defaultPeriodId(state.periods);
    await loadPayroll();
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យ', 'danger');
  } finally {
    state.loading = false;
    update();
  }
}

// ── Export ────────────────────────────────────────────────────────────────────

function buildReportTable(rows) {
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>ល.រ</th><th>គ្រូបង្រៀន</th><th>មុខវិជ្ជា</th>
        <th>ម៉ោងសរុប</th><th>ម៉ោងបង្រៀន</th>
        <th>អត្រា/ម៉ោង (៛)</th><th>ប្រាក់សរុប (៛)</th><th>ផ្សេងៗ</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map((r, i) => `
        <tr style="background:${i % 2 ? '#f8fafc' : '#fff'};">
          <td>${i + 1}</td>
          <td style="font-weight:600; text-align: left;">${teacherName(r.cs.teacher)}</td>
          <td style="text-align: left;">${subjectName(r.cs.subject)}</td>
          <td style="text-align: center;">${totalHours(r.cs.subject)}</td>
          <td style="text-align: center;">${fmt(r.teaching)}</td>
          <td style="text-align: center;">${fmt(r.rate)} ៛</td>
          <td style="font-weight:700;color:#10b981; text-align: center;">${fmt(r.amount)} ៛</td>
          <td style="color:#475569;font-size:0.85rem;">${r.note || ''}</td>
        </tr>`).join('')}
    </tbody>
    <tfoot>
      <tr style="background:#ecfdf5;font-weight:800;">
        <td colspan="6" style="text-align:right;color:#374151;">ប្រាក់សរុបទាំងអស់</td>
        <td style="color:#10b981;font-size:1rem;">${fmt(grandTotal(rows))} ៛</td>
        <td></td>
      </tr>
    </tfoot>
  `;
  return buildStandardReportElement(
    `<div style="font-size: 16px; margin-bottom: 6px;">តារាងតាមដានម៉ោងបង្រៀន ${state.classroomFilter ? currentClassroomName() : 'ថ្នាក់ទាំងអស់'}</div>` +
    `<div style="font-size: 14px; margin-bottom: 6px;">របស់សាស្ត្រាចារ្យនៅសាលាពុទ្ធិកអនុវិទ្យាល័យសម្តេចព្រះសង្ឃរាជ ទេព វង្ស និរោធរង្សី</div>` +
    `<div style="font-size: 14px;">ប្រាក់ម៉ោងបង្រៀនប្រចាំ ${currentPeriodName()}</div>`,
    table,
    ''
  );
}

// ── Telegram ──────────────────────────────────────────────────────────────────

import { openModal } from '../components/modal.js';

function openTgConfig() {
  const existing = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;font-family:'Battambang',sans-serif;">ការកំណត់ Telegram Bot</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:#64748b"></i></button>
    </div>
    <div data-role="err" style="display:none;background:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;font-family:'Battambang',sans-serif;"></div>
    <form style="display:flex;flex-direction:column;gap:16px;font-family:'Battambang',sans-serif;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Bot Token <span style="color:red">*</span></label>
        <input type="text" data-f="token" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;box-sizing:border-box;" value="${existing.token || ''}" />
      </div>
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Chat ID <span style="color:red">*</span></label>
        <input type="text" data-f="chatId" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;box-sizing:border-box;" value="${existing.chatId || ''}" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:8px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background:#fff;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-family:'Battambang',sans-serif;">បោះបង់</button>
        <button type="submit" style="padding:10px 16px;background:#4f46e5;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:'Battambang',sans-serif;">រក្សាទុក</button>
      </div>
    </form>`;
  const handle = openModal(wrap);
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const errBox = wrap.querySelector('[data-role="err"]');
    const token  = wrap.querySelector('[data-f="token"]').value.trim();
    const chatId = wrap.querySelector('[data-f="chatId"]').value.trim();
    if (!token || !chatId) { errBox.textContent = 'សូមបញ្ចូល Token និង Chat ID'; errBox.style.display = 'block'; return; }
    localStorage.setItem('tgConfig', JSON.stringify({ token, chatId }));
    showToast('បានរក្សាទុកការកំណត់ Telegram', 'success');
    handle.close();
  });
  if (window.lucide) window.lucide.createIcons();
}

async function tgSendFile({ blob, filename, isPhoto, caption, cfg }) {
  const fd = new FormData();
  fd.append('chat_id', cfg.chatId);
  fd.append(isPhoto ? 'photo' : 'document', blob, filename);
  if (caption) fd.append('caption', caption);
  const endpoint = isPhoto ? 'sendPhoto' : 'sendDocument';
  const res = await fetch(`https://api.telegram.org/bot${cfg.token.replace(/^bot/i, "")}/${endpoint}`, { method: 'POST', body: fd });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.description || `HTTP ${res.status}`);
  }
}

async function handleTelegram(kind) {
  const cfg = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!cfg.token || !cfg.chatId) { showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'warning'); openTgConfig(); return; }
  const rows = getRows();
  if (!rows.length) { showToast('មិនមានទិន្នន័យដើម្បីផ្ញើ', 'warning'); return; }
  state.tgMenuOpen = false;
  state.tgSending  = true;
  update();
  const fname   = `payroll_${currentPeriodName() || 'report'}`;
  const caption = `សូមថ្វាយបង្គំព្រះអង្គគ្រូនាយក សូមប្រគេននូវរបាយការណ៍ · ${currentClassroomName()} · ${currentPeriodName()} · ៛${fmt(grandTotal(rows))}`;
  try {
    let blob, filename, isPhoto = false;
    if (kind === 'pdf')        { blob = await getPdfBlobFromRows(rows);   filename = `${fname}.pdf`; }
    else if (kind === 'excel') { blob = getExcelBlobFromRows(rows);       filename = `${fname}.xlsx`; }
    else                       { blob = await getImageBlobFromRows(rows); filename = `${fname}.png`; isPhoto = true; }
    await tgSendFile({ blob, filename, isPhoto, caption, cfg });
    showToast('បានផ្ញើទៅ Telegram ដោយជោគជ័យ', 'success');
  } catch (err) {
    console.error(err);
    showToast(`បរាជ័យ: ${err.message}`, 'danger');
  } finally {
    state.tgSending = false;
    update();
  }
}

// Blob builders used by both download and Telegram send
async function getPdfBlobFromRows(rows) {
  const el = buildReportTable(rows);
  return await html2pdf().set({
    margin: 8,
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(el).outputPdf('blob');
}

async function getImageBlobFromRows(rows) {
  const el = buildReportTable(rows);
  el.style.position = 'absolute'; el.style.left = '-9999px'; el.style.top = '0';
  document.body.appendChild(el);
  try {
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fff' });
    return new Promise(res => canvas.toBlob(res, 'image/png'));
  } finally { el.remove(); }
}

function getExcelBlobFromRows(rows) {
  const data = rows.map((r, i) => ({
    'ល.រ': i + 1,
    'គ្រូបង្រៀន': teacherName(r.cs.teacher),
    'មុខវិជ្ជា': subjectName(r.cs.subject),
    'ម៉ោងសរុប': +(totalHours(r.cs.subject) || 0),
    'ម៉ោងបង្រៀន': +r.teaching,
    'អត្រា/ម៉ោង (៛)': +r.rate,
    'ប្រាក់សរុប (៛)': +r.amount,
    'ផ្សេងៗ': r.note || '',
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [{ wch: 5 }, { wch: 22 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 30 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PayrollReport');
  return new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// ── Edit modal ────────────────────────────────────────────────────────────────

function openEditModal(row) {
  const pr = state.payroll.find(r => r.class_subject === row.cs.id) || {};

  const wrap = document.createElement('div');
  wrap.style.cssText = 'font-family:"Battambang",sans-serif;min-width:340px;';
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:1.1rem;font-weight:700;margin:0;color:#1e293b;">ព័ត៌មានលម្អិត / កែម៉ោងបង្រៀន</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;border-radius:6px;">
        <i data-lucide="x" style="width:18px;height:18px;color:#64748b;"></i>
      </button>
    </div>
    <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
      <div>
        <div style="font-size:0.7rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;">គ្រូបង្រៀន</div>
        <div style="font-weight:600;color:#1e293b;font-size:0.875rem;">${teacherName(row.cs.teacher)}</div>
      </div>
      <div>
        <div style="font-size:0.7rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;">មុខវិជ្ជា</div>
        <div style="font-weight:600;color:#059669;font-size:0.875rem;">${subjectName(row.cs.subject)}</div>
      </div>
      <div>
        <div style="font-size:0.7rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;">ម៉ោងសរុប</div>
        <div style="font-weight:600;color:#1e293b;font-size:0.875rem;">${totalHours(row.cs.subject) || '—'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">
      <div>
        <label style="display:block;font-size:0.8rem;font-weight:700;color:#374151;margin-bottom:8px;">
          ម៉ោងបង្រៀន <span style="color:#ef4444;">*</span>
        </label>
        <input id="inp-teaching" type="number" min="0" step="0.5"
          value="${pr.id != null ? row.teaching : ''}" placeholder="0"
          style="width:100%;padding:10px 14px;border:2px solid #e2e8f0;border-radius:8px;font-family:inherit;font-size:0.95rem;box-sizing:border-box;outline:none;"
          onfocus="this.style.borderColor='#4f46e5'" onblur="this.style.borderColor='#e2e8f0'" />
      </div>
      <div>
        <label style="display:block;font-size:0.8rem;font-weight:700;color:#374151;margin-bottom:8px;">
          អត្រា/ម៉ោង (៛) <span style="color:#ef4444;">*</span>
        </label>
        <input id="inp-rate" type="number" min="0" step="100"
          value="${pr.id != null ? row.rate : ''}" placeholder="0"
          style="width:100%;padding:10px 14px;border:2px solid #e2e8f0;border-radius:8px;font-family:inherit;font-size:0.95rem;box-sizing:border-box;outline:none;"
          onfocus="this.style.borderColor='#4f46e5'" onblur="this.style.borderColor='#e2e8f0'" />
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:10px;padding:14px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:0.8rem;color:#065f46;font-weight:700;">ប្រាក់សរុប (គណនា)</span>
      <span id="computed-amount" style="font-size:1.2rem;font-weight:800;color:#059669;">៛${fmt(row.amount)}</span>
    </div>
    <div style="margin-bottom:24px;">
      <label style="display:block;font-size:0.8rem;font-weight:700;color:#374151;margin-bottom:8px;">កំណត់សម្គាល់</label>
      <textarea id="inp-note" rows="3" placeholder="បញ្ចូលកំណត់សម្គាល់..."
        style="width:100%;padding:10px 14px;border:2px solid #e2e8f0;border-radius:8px;font-family:inherit;font-size:0.875rem;box-sizing:border-box;outline:none;resize:vertical;"
        onfocus="this.style.borderColor='#4f46e5'" onblur="this.style.borderColor='#e2e8f0'">${pr.note || ''}</textarea>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button data-action="cancel" style="padding:10px 18px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.875rem;font-weight:600;color:#374151;">បោះបង់</button>
      <button id="btn-save-teaching" style="padding:10px 18px;background:#4f46e5;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.875rem;font-weight:600;">រក្សាទុក</button>
    </div>
  `;

  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons({ nodes: wrap.querySelectorAll('[data-lucide]') });

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());

  const inp = wrap.querySelector('#inp-teaching');
  const inpRate = wrap.querySelector('#inp-rate');
  const inpNote = wrap.querySelector('#inp-note');
  const computedEl = wrap.querySelector('#computed-amount');
  const recalc = () => {
    computedEl.textContent = '៛' + fmt((parseFloat(inp.value) || 0) * (parseFloat(inpRate.value) || 0));
  };
  inp.addEventListener('input', recalc);
  inpRate.addEventListener('input', recalc);

  wrap.querySelector('#btn-save-teaching').addEventListener('click', async () => {
    const teaching = parseFloat(inp.value);
    const rate     = parseFloat(inpRate.value);
    if (isNaN(teaching) || teaching < 0) {
      showToast('ម៉ោងបង្រៀនមិនត្រឹមត្រូវ', 'warning');
      return;
    }
    if (isNaN(rate) || rate < 0) {
      showToast('អត្រា/ម៉ោងមិនត្រឹមត្រូវ', 'warning');
      return;
    }
    const note = inpNote.value.trim();
    const btn = wrap.querySelector('#btn-save-teaching');
    btn.disabled = true;
    btn.textContent = 'កំពុងរក្សាទុក...';
    try {
      if (pr.id) {
        await api.patch(`/api/core/payroll-rates/${pr.id}/`, { total_teaching: teaching, rate_per_hour: rate, note });
      } else {
        await api.post('/api/core/payroll-rates/', {
          class_subject: row.cs.id,
          academic_period: state.academicPeriodId,
          total_teaching: teaching,
          rate_per_hour: rate,
          note,
        });
      }
      showToast('បានរក្សាទុករួចរាល់', 'success');
      handle.close();
      await loadPayroll();
      update();
    } catch (err) {
      console.error(err);
      showToast('បរាជ័យក្នុងការរក្សាទុក', 'danger');
      btn.disabled = false;
      btn.textContent = 'រក្សាទុក';
    }
  });
}

// ── Render ────────────────────────────────────────────────────────────────────

function update() {
  if (!root) return;

  if (state.loading) {
    root.innerHTML = `
      <style>@keyframes sk{0%{background-position:200% 0}to{background-position:-200% 0}}</style>
      <div style="max-width:1100px;margin:0 auto;">
        <div style="height:56px;border-radius:12px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200%;animation:sk 1.4s ease infinite;margin-bottom:24px;"></div>
        <div style="height:400px;border-radius:12px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200%;animation:sk 1.4s ease infinite;"></div>
      </div>`;
    return;
  }

  const rows       = getRows();
  const total      = grandTotal(rows);
  const PAGE_SIZE  = 14;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  if (state.page > totalPages) state.page = totalPages;
  const pageRows   = rows.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  root.innerHTML = `
    <style>@keyframes tg-spin{to{transform:rotate(360deg)}}</style>
    <div style="max-width:1100px;margin:0 auto;font-family:'Battambang',sans-serif;">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <div>
          <h1 style="font-size:1.5rem;font-weight:bold;margin:0 0 4px;color:#1e3a8a;font-family:'Moul',cursive;">របាយការណ៍ប្រាក់បៀវត្ស</h1>
          <p style="font-size:0.85rem;color:#64748b;margin:0;">
            ${currentPeriodName() ? `វគ្គ: <strong>${currentPeriodName()}</strong>` : 'មិនទាន់ជ្រើសរើសវគ្គ'}
            ${currentClassroomName() !== 'ទាំងអស់' ? ` · ថ្នាក់: <strong>${currentClassroomName()}</strong>` : ''}
            · ជួរ <strong>${rows.length}</strong>
          </p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">

          <!-- Filter icon button -->
          <div style="position:relative;">
            <button id="btn-filter-toggle" style="display:flex;align-items:center;gap:7px;padding:9px 14px;background:#fff;border:1px solid ${state.filterMenuOpen ? '#4f46e5' : '#e2e8f0'};border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.875rem;font-weight:600;color:#334155;transition:border-color 0.2s;">
              <i data-lucide="sliders-horizontal" style="width:16px;height:16px;color:#4f46e5;"></i>
              ត្រង
              ${(state.academicPeriodId || state.classroomFilter) ? `<span style="background:#4f46e5;color:#fff;border-radius:999px;width:18px;height:18px;font-size:0.68rem;display:flex;align-items:center;justify-content:center;">${[state.academicPeriodId, state.classroomFilter].filter(Boolean).length}</span>` : ''}
            </button>

            ${state.filterMenuOpen ? `
            <div id="rpt-filter-panel" style="position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.1);z-index:50;min-width:260px;padding:16px;display:flex;flex-direction:column;gap:14px;">
              <div>
                <label style="display:block;font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">វគ្គសិក្សា</label>
                <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
                  <i data-lucide="calendar" style="width:14px;height:14px;color:#4f46e5;flex-shrink:0;"></i>
                  <select id="rpt-period" style="border:none;background:transparent;outline:none;font-family:inherit;font-size:0.875rem;font-weight:500;color:#1e293b;cursor:pointer;width:100%;">
                    <option value="">-- ទាំងអស់ --</option>
                    ${state.periods.map(p => `<option value="${p.id}" ${state.academicPeriodId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div>
                <label style="display:block;font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">ថ្នាក់រៀន</label>
                <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
                  <i data-lucide="layers" style="width:14px;height:14px;color:#4f46e5;flex-shrink:0;"></i>
                  <select id="rpt-classroom" style="border:none;background:transparent;outline:none;font-family:inherit;font-size:0.875rem;font-weight:500;color:#1e293b;cursor:pointer;width:100%;">
                    <option value="">-- ទាំងអស់ --</option>
                    ${state.classrooms.map(c => `<option value="${c.id}" ${state.classroomFilter === c.id ? 'selected' : ''}>${c.class_name}</option>`).join('')}
                  </select>
                </div>
              </div>
              ${(state.academicPeriodId || state.classroomFilter) ? `
                <button id="btn-clear-filters" style="background:none;border:none;color:#4f46e5;font-weight:600;cursor:pointer;padding:2px 0;text-align:left;font-family:inherit;font-size:0.85rem;">សម្អាតតម្រង</button>
              ` : ''}
            </div>
            ` : ''}
          </div>

          <!-- Telegram config -->
          <button id="btn-tg-config" ${state.tgSending ? 'disabled' : ''} style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;cursor:${state.tgSending ? 'not-allowed' : 'pointer'};opacity:${state.tgSending ? '0.45' : '1'};" title="ការកំណត់ Telegram">
            <i data-lucide="settings" style="width:16px;height:16px;color:#64748b;"></i>
          </button>

          <!-- Telegram send dropdown -->
          <div style="position:relative;" onmouseenter="this.querySelector('#tg-dropdown').style.display='block'" onmouseleave="this.querySelector('#tg-dropdown').style.display='none'">
            <button id="btn-tg-toggle" ${state.tgSending ? 'disabled' : ''} style="display:flex;align-items:center;gap:7px;padding:9px 16px;background:${state.tgSending ? '#0070aa' : '#0088cc'};color:#fff;border:none;border-radius:8px;cursor:${state.tgSending ? 'not-allowed' : 'pointer'};font-family:inherit;font-size:0.875rem;font-weight:600;min-width:160px;justify-content:center;">
              ${state.tgSending
                ? `<i data-lucide="loader-2" style="width:16px;height:16px;animation:tg-spin 0.8s linear infinite;"></i> កំពុងផ្ញើ...`
                : `<i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px;margin-left:2px;"></i>`
              }
            </button>
            <div id="tg-dropdown" style="display:none;position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.1);z-index:50;min-width:190px;overflow:hidden;">
                <button data-tg="pdf" style="width:100%;text-align:left;padding:10px 14px;background:none;border:none;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:10px;cursor:pointer;font-family:inherit;font-size:0.875rem;color:#1e293b;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='none'">
                  <i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> PDF (.pdf)
                </button>
                <button data-tg="excel" style="width:100%;text-align:left;padding:10px 14px;background:none;border:none;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:10px;cursor:pointer;font-family:inherit;font-size:0.875rem;color:#1e293b;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
                  <i data-lucide="table" style="width:16px;height:16px;color:#16a34a;"></i> Excel (.xlsx)
                </button>
                <button data-tg="image" style="width:100%;text-align:left;padding:10px 14px;background:none;border:none;display:flex;align-items:center;gap:10px;cursor:pointer;font-family:inherit;font-size:0.875rem;color:#1e293b;" onmouseover="this.style.background='#faf5ff'" onmouseout="this.style.background='none'">
                  <i data-lucide="image" style="width:16px;height:16px;color:#9333ea;"></i> រូបភាព (.png)
                </button>
              </div>
          </div>
        </div>
      </div>

      <!-- Summary cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px;">
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
          <div style="font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">ចំនួនជួរ</div>
          <div style="font-size:1.8rem;font-weight:800;color:#1e293b;">${rows.length}</div>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
          <div style="font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">ចំនួនគ្រូ</div>
          <div style="font-size:1.8rem;font-weight:800;color:#1e293b;">${new Set(rows.map(r => r.cs.teacher)).size}</div>
        </div>
        <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid #a7f3d0;border-radius:12px;padding:20px;">
          <div style="font-size:0.72rem;color:#065f46;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">ប្រាក់សរុបទាំងអស់</div>
          <div style="font-size:1.6rem;font-weight:800;color:#059669;">៛${fmt(total)}</div>
        </div>
      </div>

      <!-- Table -->
      <div style="background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden;">
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;min-width:700px;">
            <thead>
              <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0;">
                <th style="padding:14px 20px;text-align:center;font-weight:700;color:#475569;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.4px;width:52px;">ល.រ</th>
                <th style="padding:14px 20px;text-align:left;font-weight:700;color:#475569;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.4px;">គ្រូបង្រៀន</th>
                <th style="padding:14px 20px;text-align:left;font-weight:700;color:#475569;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.4px;">មុខវិជ្ជា</th>
                <th style="padding:14px 20px;text-align:center;font-weight:700;color:#475569;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.4px;">ម៉ោងសរុប</th>
                <th style="padding:14px 20px;text-align:center;font-weight:700;color:#475569;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.4px;">ម៉ោងបង្រៀន</th>
                <th style="padding:14px 20px;text-align:center;font-weight:700;color:#475569;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.4px;">អត្រា/ម៉ោង</th>
                <th style="padding:14px 20px;text-align:center;font-weight:700;color:#475569;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.4px;">ប្រាក់សរុប</th>
                <th style="padding:14px 20px;width:60px;"></th>
              </tr>
            </thead>
            <tbody>
              ${rows.length > 0 ? pageRows.map((r, i) => {
                const globalIdx = (state.page - 1) * PAGE_SIZE + i;
                return `
                <tr style="border-bottom:1px solid #f1f5f9;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
                  <td style="padding:14px 20px;text-align:center;color:#94a3b8;font-weight:500;">${globalIdx + 1}</td>
                  <td style="padding:14px 20px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#818cf8);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">${teacherInitial(r.cs.teacher)}</div>
                      <span style="font-weight:600;font-size:0.9rem;">${teacherName(r.cs.teacher)}</span>
                    </div>
                  </td>
                  <td style="padding:14px 20px;">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;background:rgba(16,185,129,0.1);color:#059669;font-size:0.78rem;font-weight:600;border:1px solid rgba(16,185,129,0.2);">${subjectName(r.cs.subject)}</span>
                  </td>
                  <td style="padding:14px 20px;text-align:center;font-weight:600;color:#1e293b;">${totalHours(r.cs.subject)}</td>
                  <td style="padding:14px 20px;text-align:center;color:${r.teaching ? '#1e293b' : '#cbd5e1'};">${r.teaching ? fmt(r.teaching) : '—'}</td>
                  <td style="padding:14px 20px;text-align:center;color:${r.rate ? '#1e293b' : '#cbd5e1'};">${r.rate ? '៛' + fmt(r.rate) : '—'}</td>
                  <td style="padding:14px 20px;text-align:center;font-weight:800;color:#059669;font-size:1rem;">៛${fmt(r.amount)}</td>
                  <td style="padding:14px 12px;text-align:center;">
                    <button data-edit-idx="${globalIdx}" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;transition:background 0.15s,border-color 0.15s;" title="មើល / កែប្រែ" onmouseover="this.style.background='#f0f0ff';this.style.borderColor='#818cf8'" onmouseout="this.style.background='#fff';this.style.borderColor='#e2e8f0'">
                      <i data-lucide="pencil" style="width:14px;height:14px;color:#4f46e5;"></i>
                    </button>
                  </td>
                </tr>`;
              }).join('') : `
                <tr><td colspan="8" style="padding:48px;text-align:center;color:#94a3b8;">
                  ${!state.academicPeriodId ? 'សូមជ្រើសរើសវគ្គសិក្សា' : 'មិនមានទិន្នន័យ'}
                </td></tr>
              `}
            </tbody>
            ${rows.length > 0 ? `
              <tfoot>
                <tr style="background:#f8fafc;border-top:2px solid #e2e8f0;">
                  <td colspan="7" style="padding:14px 20px;text-align:right;font-weight:700;color:#475569;font-size:0.85rem;">ប្រាក់សរុបទាំងអស់</td>
                  <td style="padding:14px 20px;text-align:right;font-weight:800;color:#059669;font-size:1.05rem;">៛${fmt(total)}</td>
                </tr>
              </tfoot>
            ` : ''}
          </table>
        </div>
      </div>

      <!-- Pagination -->
      ${totalPages > 1 ? (() => {
        const pages = Array.from({ length: totalPages }, (_, k) => k + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - state.page) <= 1);
        const withEllipsis = pages.reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
          acc.push(p); return acc;
        }, []);
        return `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;flex-wrap:wrap;gap:10px;font-family:'Battambang',sans-serif;">
          <div style="font-size:0.8rem;color:#64748b;">
            បង្ហាញ <strong>${(state.page - 1) * PAGE_SIZE + 1}–${Math.min(state.page * PAGE_SIZE, rows.length)}</strong> នៃ <strong>${rows.length}</strong> ជួរ
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button data-pg="prev" ${state.page <= 1 ? 'disabled' : ''} style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid #e2e8f0;background:${state.page <= 1 ? '#f8fafc' : '#fff'};cursor:${state.page <= 1 ? 'default' : 'pointer'};opacity:${state.page <= 1 ? '0.4' : '1'};">
              <i data-lucide="chevron-left" style="width:16px;height:16px;color:#475569;"></i>
            </button>
            ${withEllipsis.map(p => p === '…'
              ? `<span style="padding:0 4px;color:#94a3b8;line-height:34px;">…</span>`
              : `<button data-pg="${p}" style="width:34px;height:34px;border-radius:8px;border:1px solid ${p === state.page ? '#4f46e5' : '#e2e8f0'};background:${p === state.page ? '#4f46e5' : '#fff'};color:${p === state.page ? '#fff' : '#374151'};font-weight:${p === state.page ? '700' : '500'};font-size:0.85rem;cursor:pointer;font-family:inherit;">${p}</button>`
            ).join('')}
            <button data-pg="next" ${state.page >= totalPages ? 'disabled' : ''} style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid #e2e8f0;background:${state.page >= totalPages ? '#f8fafc' : '#fff'};cursor:${state.page >= totalPages ? 'default' : 'pointer'};opacity:${state.page >= totalPages ? '0.4' : '1'};">
              <i data-lucide="chevron-right" style="width:16px;height:16px;color:#475569;"></i>
            </button>
          </div>
        </div>`;
      })() : ''}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  root.querySelector('#btn-filter-toggle')?.addEventListener('click', e => {
    e.stopPropagation();
    state.filterMenuOpen = !state.filterMenuOpen;
    update();
  });

  root.querySelector('#rpt-period')?.addEventListener('change', async e => {
    state.academicPeriodId = parseInt(e.target.value) || null;
    state.page = 1;
    await loadPayroll();
    update();
  });

  root.querySelector('#rpt-classroom')?.addEventListener('change', e => {
    state.classroomFilter = parseInt(e.target.value) || null;
    state.page = 1;
    update();
  });

  root.querySelector('#btn-clear-filters')?.addEventListener('click', async () => {
    state.academicPeriodId = null;
    state.classroomFilter  = null;
    state.filterMenuOpen   = false;
    state.page = 1;
    await loadPayroll();
    update();
  });

  if (state.filterMenuOpen) {
    setTimeout(() => {
      document.addEventListener('click', function closeFilter(e) {
        if (!e.target.closest('#btn-filter-toggle') && !e.target.closest('#rpt-filter-panel')) {
          state.filterMenuOpen = false;
          update();
          document.removeEventListener('click', closeFilter);
        }
      });
    }, 0);
  }

  root.querySelectorAll('[data-edit-idx]').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(rows[+btn.dataset.editIdx]));
  });

  root.querySelectorAll('[data-pg]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.pg;
      if (val === 'prev') state.page = Math.max(1, state.page - 1);
      else if (val === 'next') state.page = Math.min(totalPages, state.page + 1);
      else state.page = +val;
      update();
    });
  });

  root.querySelector('#btn-tg-config')?.addEventListener('click', () => openTgConfig());

  root.querySelector('#btn-tg-toggle')?.addEventListener('click', e => {
    e.stopPropagation();
    state.tgMenuOpen = !state.tgMenuOpen;
    update();
  });

  root.querySelectorAll('[data-tg]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      handleTelegram(btn.dataset.tg);
    });
  });

  if (state.tgMenuOpen) {
    setTimeout(() => {
      document.addEventListener('click', function closeTg(e) {
        if (!e.target.closest('#btn-tg-toggle') && !e.target.closest('#tg-dropdown')) {
          state.tgMenuOpen = false;
          update();
          document.removeEventListener('click', closeTg);
        }
      });
    }, 0);
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

export function render(container) {
  root = container;
  state = {
    loading: true,
    teachers: [], subjects: [], classrooms: [],
    classSubjects: [], periods: [], payroll: [],
    academicPeriodId: null, classroomFilter: null,
    filterMenuOpen: false, tgMenuOpen: false, tgSending: false,
    page: 1,
  };
  loadData();
}

export function destroy() { root = null; }
