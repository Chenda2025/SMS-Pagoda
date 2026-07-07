import { showToast } from '../components/toast.js';
import { openModal } from '../components/modal.js';
import { api } from '../api.js';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { buildStandardReportElement } from '../components/reportTemplate.js';

// ── State ─────────────────────────────────────────────────────────────────────

let state = {
  payroll: [],
  allPayrollHistory: [],
  teachers: [],
  subjects: [],
  classrooms: [],
  classSubjects: [],
  periods: [],
  academicPeriodId: null,
  filterTeacher: '',
  search: '',
  modal: null,
  loading: true,
  
  exportMenuOpen: false,
};

let root = null;


function fmt(num, decimals = 0) {
  if (isNaN(num) || num === null || num === '') return '0';
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// ── Lookups ───────────────────────────────────────────────────────────────────

function getTeacher(id)  { return state.teachers.find(x => x.id === +id) || null; }
function getSubject(id)  { return state.subjects.find(x => x.id === +id) || null; }
function getClassroom(id){ return state.classrooms.find(x => x.id === +id) || null; }

function teacherName(id) {
  const t = getTeacher(id);
  return t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : '—';
}
function teacherInitial(id) { return teacherName(id).charAt(0).toUpperCase() || '?'; }
function subjectName(id)    { return getSubject(id)?.subject_name ?? '—'; }

function currentPeriodName() {
  return state.periods.find(x => x.id === state.academicPeriodId)?.name ?? '';
}

// Find the period that covers today; fall back to first period
function defaultPeriodId(periods) {
  const today = new Date().toISOString().slice(0, 10);
  const match = periods.find(p => p.start_date <= today && today <= p.end_date);
  return match ? match.id : (periods[0]?.id ?? null);
}

// ── Filtering ─────────────────────────────────────────────────────────────────


function filteredRows() {
  if (!state.classroomFilter) return [];
  let cs = state.classSubjects?.filter(c => c.classroom === state.classroomFilter) || [];
  
  // Sort: Teachers with multiple subjects first, then alphabetically
  const counts = {};
  cs.forEach(c => { counts[c.teacher] = (counts[c.teacher] || 0) + 1; });
  return [...cs].sort((a, b) => {
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
}
function renderTable(rows) {
  if (!state.classroomFilter) {
    return `
      <div style="background:#fff;border-radius:16px;padding:60px 20px;text-align:center;border:1px dashed var(--border);">
        <div style="width:64px;height:64px;background:rgba(79,70,229,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <i data-lucide="filter" style="width:32px;height:32px;color:var(--primary);"></i>
        </div>
        <h3 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px;">សូមជ្រើសរើសថ្នាក់រៀន</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;max-width:300px;margin:0 auto;">សូមជ្រើសរើសថ្នាក់រៀនខាងលើ ដើម្បីបង្ហាញទិន្នន័យ និងបញ្ចូលប្រាក់បៀវត្ស។</p>
      </div>
    `;
  }

  if (!rows.length) {
    return `
      <div style="background:#fff;border-radius:16px;padding:60px 20px;text-align:center;border:1px dashed var(--border);">
        <div style="width:64px;height:64px;background:rgba(79,70,229,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <i data-lucide="inbox" style="width:32px;height:32px;color:var(--primary);"></i>
        </div>
        <h3 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px;">មិនមានទិន្នន័យ</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;max-width:300px;margin:0 auto;">មិនទាន់មានការចាត់តាំងគ្រូ និងមុខវិជ្ជាសម្រាប់ថ្នាក់រៀននេះទេ។</p>
      </div>
    `;
  }

  let overallTotal = 0;
  const trs = rows.map((cs, index) => {
    const existing = state.payroll.find(r => r.class_subject === cs.id) || {};
    
    let rate = existing.rate_per_hour || '';
    if (!rate) {
      const past = state.allPayrollHistory.find(r => r.class_subject === cs.id && r.rate_per_hour);
      if (past) rate = past.rate_per_hour;
    }
    const teaching = existing.total_teaching || '';

    const amount = existing.total_amount || 0;
    overallTotal += parseFloat(amount) || 0;
    
    return `
    <tr style="border-bottom:1px solid var(--border);transition:background 0.2s;" class="payroll-row" data-cs-id="${cs.id}" data-payroll-id="${existing.id || ''}">
      <td style="padding:12px 24px;text-align:center;font-weight:500;color:var(--text-secondary);">
        ${index + 1}
      </td>
      <td style="padding:12px 24px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--primary),#818cf8);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;box-shadow:0 4px 10px rgba(79,70,229,0.2);">
            ${teacherInitial(cs.teacher)}
          </div>
          <div>
            <div style="font-weight:600;font-size:0.9rem;">${teacherName(cs.teacher)}</div>
            <div style="font-size:0.72rem;color:var(--text-muted);">${getTeacher(cs.teacher)?.teacher_code || ''}</div>
          </div>
        </div>
      </td>
      <td style="padding:12px 24px;">
        <span class="badge success" style="font-size:0.75rem;padding:4px 10px;border-radius:20px;background:rgba(16,185,129,0.1);color:var(--success);border:1px solid rgba(16,185,129,0.2);">${subjectName(cs.subject)}</span>
      </td>
      <td style="text-align:center;font-weight:600;color:var(--text-primary);padding:12px 24px;font-size:0.95rem;">
        ${getSubject(cs.subject)?.total_hours || '—'}
      </td>
      <td style="text-align:center;padding:12px 24px;width:140px;">
        <input type="number" class="form-input bulk-teaching" min="0" step="1" placeholder="0" value="${teaching}" style="padding:8px;height:36px;text-align:center;font-weight:600;" />
      </td>
      <td style="text-align:center;padding:12px 24px;width:150px;font-weight:600;color:var(--text-secondary);">
        <input type="hidden" class="bulk-rate" value="${rate}" />
        <span class="rate-label">${rate ? '៛' + fmt(rate) : '—'}</span>
      </td>
      <td style="text-align:center;padding:12px 24px;">
        <span class="bulk-amount" style="font-weight:800;color:var(--success);font-size:1.05rem;">៛${fmt(amount)}</span>
      </td>
      <td style="padding:12px 24px;max-width:200px;">
        ${existing.note ? `<span style="font-size:0.8rem;color:var(--text-secondary);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${existing.note.replace(/"/g,'&quot;')}">${existing.note}</span>` : '<span style="color:var(--text-muted,#cbd5e1);">—</span>'}
      </td>
      <td style="padding:12px 16px;text-align:center;white-space:nowrap;">
        <button data-edit-cs="${cs.id}" style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:#fff;cursor:pointer;margin-right:4px;" title="កែប្រែ">
          <i data-lucide="pencil" style="width:13px;height:13px;color:var(--primary);"></i>
        </button>
        ${existing.id ? `
        <button data-delete-id="${existing.id}" style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:7px;border:1px solid #fee2e2;background:#fff;cursor:pointer;" title="លុប">
          <i data-lucide="trash-2" style="width:13px;height:13px;color:#ef4444;"></i>
        </button>` : ''}
      </td>
    </tr>
  `});

  return `
    <div class="table-container glass-panel" style="background:rgba(255,255,255,0.7);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.5);box-shadow:0 12px 40px rgba(0,0,0,0.05);border-radius:16px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;white-space:nowrap;">
        <thead>
          <tr style="background:rgba(248,250,252,0.8);border-bottom:1px solid var(--border);">
            <th style="padding:16px 24px;text-align:center;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;width:60px;">ល.រ</th>
            <th style="padding:16px 24px;text-align:left;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;">គ្រូបង្រៀន</th>
            <th style="padding:16px 24px;text-align:left;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;">មុខវិជ្ជា</th>
            <th style="padding:16px 24px;text-align:center;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;">ម៉ោងសរុប</th>
            <th style="padding:16px 24px;text-align:center;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;">បង្រៀនជាក់ស្តែង</th>
            <th style="padding:16px 24px;text-align:center;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;">អត្រា/ម៉ោង (៛)</th>
            <th style="padding:16px 24px;text-align:center;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;">ប្រាក់សរុប (៛)</th>
            <th style="padding:16px 24px;text-align:left;font-weight:600;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;">ផ្សេងៗ</th>
            <th style="padding:16px 24px;width:80px;"></th>
          </tr>
        </thead>
        <tbody>
          ${trs.join('')}
        </tbody>
        <tfoot>
          <tr style="background:#f8fafc;">
            <td colspan="6" style="padding:14px 24px;font-weight:700;font-size:0.85rem;color:var(--text-secondary);text-align:right;">
              ប្រាក់សរុបទាំងអស់
            </td>
            <td style="padding:14px 24px;text-align:right;">
              <span id="overall-total" style="font-size:1.1rem;font-weight:800;color:var(--primary);">៛${fmt(overallTotal)}</span>
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      
      <div style="padding:20px 24px;background:#f8fafc;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:12px;">
         <button class="btn btn-primary" id="btn-save-payroll" style="font-size:0.95rem;padding:10px 24px;">
            <i data-lucide="save" style="width:16px;height:16px;"></i> រក្សាទុកទិន្នន័យ
         </button>
      </div>
    </div>
  `;
}
function update() {
  if (!root) return;

  if (state.loading) {
    root.innerHTML = `
      <style>@keyframes sk{0%{background-position:200% 0}to{background-position:-200% 0}}</style>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
        ${[0,1,2,3].map(() => `<div style="height:104px;border-radius:16px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200%;animation:sk 1.4s ease infinite;"></div>`).join('')}
      </div>
      <div style="height:400px;border-radius:16px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200%;animation:sk 1.4s ease infinite;"></div>`;
    return;
  }

  const rows = filteredRows();

  root.innerHTML = `
    <div class="animate-fade-in">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">ការគ្រប់គ្រងប្រាក់បៀវត្ស</h1>
          <p style="font-size:0.85rem;color:var(--text-secondary);">គ្រប់គ្រងប្រាក់ខែ ម៉ោងបង្រៀន និងបៀវត្សគ្រូដោយគិតជាលុយរៀលប៉ុណ្ណោះ</p>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">

          <!-- Academic Period Filter -->
          <div class="glass-panel" style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;">
            <i data-lucide="calendar" style="width:15px;height:15px;color:var(--primary);flex-shrink:0;"></i>
            <select id="period-filter" style="border:none;background:transparent;outline:none;font-family:inherit;font-size:0.875rem;font-weight:600;color:var(--text-primary);cursor:pointer;max-width:180px;">
              <option value="">-- វគ្គសិក្សា --</option>
              ${state.periods.map(p => `<option value="${p.id}" ${state.academicPeriodId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
          </div>

          <!-- Classroom Filter -->
          <div class="glass-panel" style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;">
            <i data-lucide="layers" style="width:15px;height:15px;color:var(--primary);flex-shrink:0;"></i>
            <select id="classroom-filter" style="border:none;background:transparent;outline:none;font-family:inherit;font-size:0.875rem;font-weight:600;color:var(--text-primary);cursor:pointer;max-width:220px;">
              <option value="">-- ជ្រើសរើសថ្នាក់រៀន --</option>
              ${[...(state.classrooms || [])].sort((a, b) => a.grade_level - b.grade_level || a.class_name.localeCompare(b.class_name)).map(c => `<option value="${c.id}" ${state.classroomFilter === c.id ? 'selected' : ''}>${c.class_name}</option>`).join('')}
            </select>
          </div>

          

          
          
          <button class="btn" data-action="open-bulk-rate" style="background:#fff;border:1px solid var(--border);color:var(--text-primary);" title="កំណត់អត្រាប្រាក់ម៉ោងរួម">
            <i data-lucide="layers" style="width:16px;height:16px;color:var(--primary);"></i> កំណត់អត្រារួម
          </button>
        </div>
      </div>

      ${renderTable(rows)}
    </div>
  `;

  // Filter by Academic Period
  const periodFilter = root.querySelector('#period-filter');
  if (periodFilter) {
    periodFilter.addEventListener('change', async (e) => {
      state.academicPeriodId = parseInt(e.target.value) || null;
      sessionStorage.setItem('payroll_academicPeriodId', e.target.value);
      await loadPayroll();
    });
  }

  // Filter by Classroom
  const clsFilter = root.querySelector('#classroom-filter');
  if (clsFilter) {
    clsFilter.addEventListener('change', (e) => {
      state.classroomFilter = parseInt(e.target.value) || null;
      sessionStorage.setItem('payroll_classroomFilter', e.target.value);
      update();
    });
  }

  // Handle auto-calculation in table rows
  root.querySelectorAll('.payroll-row').forEach(row => {
      const rateEl = row.querySelector('.bulk-rate');
      const teachingEl = row.querySelector('.bulk-teaching');
      const amountEl = row.querySelector('.bulk-amount');
      
      const calc = () => {
          const r = parseFloat(rateEl.value) || 0;
          const t = parseFloat(teachingEl.value) || 0;
          amountEl.innerHTML = `៛${fmt(r * t)}`;
          
          let sum = 0;
          root.querySelectorAll('.payroll-row').forEach(tr => {
              const r2 = parseFloat(tr.querySelector('.bulk-rate').value) || 0;
              const t2 = parseFloat(tr.querySelector('.bulk-teaching').value) || 0;
              sum += (r2 * t2);
          });
          const ov = root.querySelector('#overall-total');
          if (ov) ov.innerHTML = `៛${fmt(sum)}`;
      };
      
      rateEl.addEventListener('input', calc);
      teachingEl.addEventListener('input', calc);
  });

  // Save changes
  const saveBtn = root.querySelector('#btn-save-payroll');
  if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
          const rows = Array.from(root.querySelectorAll('.payroll-row'));
          const records = [];
          
          rows.forEach(r => {
              const csId = parseInt(r.getAttribute('data-cs-id'));
              const payrollId = parseInt(r.getAttribute('data-payroll-id'));
              const rate = parseFloat(r.querySelector('.bulk-rate').value) || 0;
              const teaching = parseFloat(r.querySelector('.bulk-teaching').value) || 0;
              
              if (csId && rate > 0) {
                  records.push({
                      id: payrollId || null,
                      class_subject: csId,
                      academic_period: state.academicPeriodId,
                      rate_per_hour: rate,
                      total_teaching: teaching
                  });
              }
          });

          if (records.length === 0) {
              showToast('សូមបញ្ចូល អត្រា/ម៉ោង យ៉ាងហោចណាស់ ១ ជួរ', 'warning');
              return;
          }

          showToast('កំពុងរក្សាទុក...', 'info');
          saveBtn.disabled = true;
          try {
              for (const rec of records) {
                  if (rec.id) {
                      await api.patch(`/api/core/payroll-rates/${rec.id}/`, { class_subject: rec.class_subject, academic_period: rec.academic_period, rate_per_hour: rec.rate_per_hour, total_teaching: rec.total_teaching });
                  } else {
                      await api.post('/api/core/payroll-rates/', { class_subject: rec.class_subject, academic_period: rec.academic_period, rate_per_hour: rec.rate_per_hour, total_teaching: rec.total_teaching });
                  }
              }
              showToast('បានរក្សាទុកជោគជ័យ', 'success');
              await loadPayroll();
          } catch (e) {
              console.error(e);
              showToast('បរាជ័យក្នុងការរក្សាទុក', 'danger');
              saveBtn.disabled = false;
          }
      });
  }

  
  

  
  root.querySelector('[data-action="open-bulk-rate"]')?.addEventListener('click', () => {
    if (!state.academicPeriodId) {
        showToast('សូមជ្រើសរើសវគ្គសិក្សាជាមុនសិន', 'warning');
        return;
    }

    // Class subjects scoped to the current classroom (or all if none selected)
    const csInScope = state.classroomFilter
        ? state.classSubjects.filter(cs => cs.classroom === state.classroomFilter)
        : state.classSubjects;

    // Subject IDs that already have a rate in scope
    const subjectIdsWithRate = new Set(
        csInScope
            .filter(cs => { const p = state.payroll.find(r => r.class_subject === cs.id); return p && p.rate_per_hour; })
            .map(cs => cs.subject)
    );

    // Only subjects that are assigned in scope but have no rate yet
    const subjectIdsInScope = new Set(csInScope.map(cs => cs.subject));
    const subjectsWithoutRate = state.subjects.filter(s => subjectIdsInScope.has(s.id) && !subjectIdsWithRate.has(s.id));

    const modal = document.createElement('div');
    modal.className = 'vmodal-backdrop';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '1000';

    modal.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:28px;width:100%;max-width:420px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);animation:slideUp 0.3s ease;">
        <h3 style="margin-top:0;margin-bottom:20px;font-family:'Moul',serif;color:var(--text-primary);font-size:1.1rem;display:flex;align-items:center;gap:10px;">
          <i data-lucide="layers" style="color:var(--primary);"></i> កំណត់អត្រាប្រាក់ម៉ោងរួម
        </h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:20px;">
          អត្រាប្រាក់នេះនឹងត្រូវអនុវត្តទៅលើមុខវិជ្ជាដែលបានជ្រើសរើស សម្រាប់គ្រប់ថ្នាក់រៀនទាំងអស់ក្នុងវគ្គសិក្សាបច្ចុប្បន្ន។
        </p>

        <div style="margin-bottom:16px;">
           <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.9rem;color:var(--text-primary);">១. ជ្រើសរើសមុខវិជ្ជា (ជ្រើសរើសច្រើន)</label>
           <div style="height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:6px;background:var(--bg-muted);">
             ${subjectsWithoutRate.length > 0 ? subjectsWithoutRate.map(s => `
               <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#fff;border-radius:6px;cursor:pointer;border:1px solid var(--border);box-shadow:0 1px 2px rgba(0,0,0,0.05);transition:border 0.2s;">
                 <input type="checkbox" class="bulk-subject-checkbox" value="${s.id}" style="width:18px;height:18px;cursor:pointer;accent-color:var(--primary);">
                 <span style="font-weight:500;color:var(--text-primary);">${s.subject_name}</span>
               </label>
             `).join('') : `<div style="padding:24px;text-align:center;color:var(--text-secondary);font-size:0.875rem;">មុខវិជ្ជាទាំងអស់មានអត្រាប្រាក់ម៉ោងរួចហើយ</div>`}
           </div>
        </div>
        
        <div style="margin-bottom:24px;">
           <label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.9rem;color:var(--text-primary);">២. អត្រា/ម៉ោង (៛)</label>
           <div style="position:relative;">
             <input type="number" id="bulk-rate-input" class="input" placeholder="ឧ. 15000" style="width:100%;padding-left:36px;font-weight:bold;font-size:1.05rem;color:var(--primary);">
             <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-weight:bold;color:var(--text-secondary);">៛</span>
           </div>
        </div>
        
        <div style="display:flex;justify-content:flex-end;gap:12px;border-top:1px solid var(--border);padding-top:20px;">
           <button class="btn" id="btn-close-bulk" style="background:#f1f5f9;color:var(--text-secondary);font-weight:600;">បោះបង់</button>
           <button class="btn btn-primary" id="btn-apply-bulk" style="font-weight:600;">
             <i data-lucide="save" style="width:16px;height:16px;"></i> រក្សាទុក
           </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
    
    document.getElementById('btn-close-bulk').addEventListener('click', () => modal.remove());
    document.getElementById('btn-apply-bulk').addEventListener('click', async () => {
        const selectedOptions = Array.from(document.querySelectorAll('.bulk-subject-checkbox:checked')).map(cb => parseInt(cb.value));
        const rateVal = parseFloat(document.getElementById('bulk-rate-input').value);
        
        if (selectedOptions.length === 0) {
            showToast('សូមជ្រើសរើសមុខវិជ្ជាយ៉ាងហោចណាស់មួយ', 'warning');
            return;
        }
        if (isNaN(rateVal) || rateVal <= 0) {
            showToast('សូមបញ្ចូលអត្រាប្រាក់ម៉ោងឲ្យបានត្រឹមត្រូវ', 'warning');
            return;
        }
        
        const btnApply = document.getElementById('btn-apply-bulk');
        btnApply.disabled = true;
        btnApply.innerHTML = '<i data-lucide="loader-2" class="spin"></i> កំពុងរក្សាទុក...';
        
        try {
            // Find all class_subjects that match the selected subjects
            const targetClassSubjects = state.classSubjects.filter(cs => selectedOptions.includes(cs.subject));
            
            if (targetClassSubjects.length === 0) {
                showToast('មុខវិជ្ជាដែលបានជ្រើសរើសមិនទាន់មានថ្នាក់រៀនប្រើប្រាស់ទេ', 'info');
                modal.remove();
                return;
            }
            
            // Prepare promises
            const promises = targetClassSubjects.map(cs => {
                const existing = state.payroll.find(r => r.class_subject === cs.id);
                if (existing) {
                    return api.patch(`/api/core/payroll-rates/${existing.id}/`, { rate_per_hour: rateVal });
                } else {
                    return api.post('/api/core/payroll-rates/', {
                        class_subject: cs.id,
                        academic_period: state.academicPeriodId,
                        rate_per_hour: rateVal,
                        total_teaching: 0
                    });
                }
            });
            
            // Execute in batches to avoid overwhelming the server
            const batchSize = 10;
            for (let i = 0; i < promises.length; i += batchSize) {
                await Promise.all(promises.slice(i, i + batchSize));
            }
            
            showToast(`បានអនុវត្តអត្រាប្រាក់ថ្មីទៅលើ ${targetClassSubjects.length} កំណត់ត្រាដោយជោគជ័យ!`, 'success');
            modal.remove();
            await loadPayroll();
        } catch (err) {
            console.error(err);
            showToast('មានបញ្ហាក្នុងការរក្សាទុក', 'danger');
            btnApply.disabled = false;
            btnApply.innerHTML = 'សាកល្បងម្ដងទៀត';
        }
    });
  });

  

  


  // Per-row edit
  root.querySelectorAll('[data-edit-cs]').forEach(btn => {
    btn.addEventListener('click', () => {
      const csId = parseInt(btn.dataset.editCs);
      const cs = state.classSubjects.find(x => x.id === csId);
      if (cs) openPayrollEditModal(cs);
    });
  });

  // Per-row delete
  root.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', () => deletePayrollRecord(parseInt(btn.dataset.deleteId)));
  });

  if (window.lucide) window.lucide.createIcons();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function buildPrintEl(rows) {
  const table = document.createElement('table');
  table.innerHTML = `
      <thead>
        <tr>
          <th>ល.រ</th>
          <th>គ្រូបង្រៀន</th>
          <th>មុខវិជ្ជា</th>
          <th>ម៉ោងសរុប</th>
          <th>ចំនួនបង្រៀន</th>
          <th>អត្រា/ម៉ោង (៛)</th>
          <th>ប្រាក់សរុប (៛)</th><th>ផ្សេងៗ</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((cs, i) => {
          const existing = state.payroll.find(r => r.class_subject === cs.id) || {};
          let rate = existing.rate_per_hour || '';
          if (!rate) {
            const past = state.allPayrollHistory?.find(r => r.class_subject === cs.id && r.rate_per_hour);
            if (past) rate = past.rate_per_hour;
          }
          const teaching = existing.total_teaching || 0;
          const amount = parseFloat(existing.total_amount) || (parseFloat(rate) * parseFloat(teaching) || 0);

          return `
          <tr style="background:${i % 2 ? '#f8fafc' : '#fff'};">
            <td>${i + 1}</td>
            <td style="font-weight:600;text-align:left;">${teacherName(cs.teacher)}</td>
            <td style="text-align:left;">${subjectName(cs.subject)}</td>
            <td>${getSubject(cs.subject)?.total_hours || '—'}</td>
            <td>${fmt(teaching, 0)}</td>
            <td>៛${fmt(rate)}</td>
            <td style="font-weight:700;color:#10b981;text-align:center;">៛${fmt(amount)}</td>
            <td></td>
          </tr>`}).join('')}
      </tbody>
      <tfoot>
        <tr style="background:#ecfdf5;font-weight:800;">
          <td colspan="7" style="text-align:right;color:#374151;">ប្រាក់សរុបទាំងអស់</td>
          <td style="color:#10b981;font-size:1rem;">៛${fmt(totalPayout(rows))}</td>
        </tr>
      </tfoot>
  `;

  const reportEl = buildStandardReportElement(
    `<div style="font-size: 16px; margin-bottom: 6px;">តារាងតាមដានម៉ោងបង្រៀន ${state.classroomFilter ? getClassroomName(state.classroomFilter) : 'ថ្នាក់ទាំងអស់'}</div>` +
    `<div style="font-size: 14px; margin-bottom: 6px;">របស់សាស្ត្រាចារ្យនៅសាលាពុទ្ធិកអនុវិទ្យាល័យសម្តេចព្រះសង្ឃរាជ ទេព វង្ស និរោធរង្សី</div>` +
    `<div style="font-size: 14px;">ប្រាក់ម៉ោងបង្រៀនប្រចាំ ${currentPeriodName()}</div>`,
    table,
    ''
  );

  // We must position it offscreen
  reportEl.style.position = 'absolute';
  reportEl.style.left = '-9999px';
  reportEl.style.top = '0';
  
  document.body.appendChild(reportEl);
  return reportEl;
}

async function getPdfBlob(rows) {
  const el = await buildPrintEl(rows);
  try {
    return await html2pdf().set({
      margin: 8, filename: 'payroll.pdf',
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(el).output('blob');
  } finally { el.remove(); }
}

async function getImageBlob(rows) {
  const el = await buildPrintEl(rows);
  try {
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fff' });
    return await new Promise(res => canvas.toBlob(res, 'image/png'));
  } finally { el.remove(); }
}

function getExcelBlob(rows) {
  const data = rows.map((cs, i) => {
    const existing = state.payroll.find(r => r.class_subject === cs.id) || {};
    let rate = existing.rate_per_hour || '';
    if (!rate) {
      const past = state.allPayrollHistory?.find(r => r.class_subject === cs.id && r.rate_per_hour);
      if (past) rate = past.rate_per_hour;
    }
    const teaching = existing.total_teaching || 0;
    const amount = parseFloat(existing.total_amount) || (parseFloat(rate) * parseFloat(teaching) || 0);

    return {
      'ល.រ': i + 1,
      'គ្រូបង្រៀន': teacherName(cs.teacher),
      'មុខវិជ្ជា': subjectName(cs.subject),
      'ម៉ោងសរុប': +(getSubject(cs.subject)?.total_hours || 0),
      'ចំនួនបង្រៀន': +teaching,
      'អត្រា/ម៉ោង (៛)': +rate,
      'ប្រាក់សរុប (៛)': +amount,
      'ផ្សេងៗ': '',
    };
  });
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [{ wch: 5 }, { wch: 22 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Payroll');
  return new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}




function openTgConfig() {
  const existing = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">ការកំណត់ Telegram Bot</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>
    <form style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Bot Token <span style="color:red">*</span></label>
        <input type="text" data-f="token" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${existing.token || ''}" required />
      </div>
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">Chat ID <span style="color:red">*</span></label>
        <input type="text" data-f="chatId" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" value="${existing.chatId || ''}" required />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" style="padding:10px 16px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">រក្សាទុក</button>
      </div>
    </form>
  `;
  const handle = openModal(wrap);
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
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
  if (window.lucide) window.lucide.createIcons();
}

async function tgSendFile({ blob, filename, isPhoto, caption, cfg }) {
  const fd = new FormData();
  fd.append('chat_id', cfg.chatId);
  fd.append(isPhoto ? 'photo' : 'document', blob, filename);
  if (caption) fd.append('caption', caption);
  const endpoint = isPhoto ? 'sendPhoto' : 'sendDocument';
  const res = await fetch(`https://api.telegram.org/bot${cfg.token}/${endpoint}`, { method: 'POST', body: fd });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.description || `telegram-send-failed (HTTP ${res.status})`);
  }
}



// ── Per-row edit / delete ─────────────────────────────────────────────────────

function openPayrollEditModal(cs) {
  const existing = state.payroll.find(r => r.class_subject === cs.id) || {};
  let initRate = parseFloat(existing.rate_per_hour) || 0;
  if (!initRate) {
    const past = state.allPayrollHistory?.find(r => r.class_subject === cs.id && r.rate_per_hour);
    if (past) initRate = parseFloat(past.rate_per_hour) || 0;
  }
  const initTeaching = parseFloat(existing.total_teaching) || 0;
  const initNote     = existing.note || '';

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:1.1rem;font-weight:700;margin:0;color:var(--text-primary);">កែប្រែប្រាក់បៀវត្ស</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;border-radius:6px;">
        <i data-lucide="x" style="width:18px;height:18px;color:var(--text-secondary);"></i>
      </button>
    </div>
    <div style="background:var(--bg-muted,#f8fafc);border-radius:10px;padding:14px;margin-bottom:18px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
      <div>
        <div style="font-size:0.68rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;">គ្រូបង្រៀន</div>
        <div style="font-weight:600;font-size:0.875rem;color:var(--text-primary);">${teacherName(cs.teacher)}</div>
      </div>
      <div>
        <div style="font-size:0.68rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;">មុខវិជ្ជា</div>
        <div style="font-weight:600;font-size:0.875rem;color:var(--success,#059669);">${subjectName(cs.subject)}</div>
      </div>
      <div>
        <div style="font-size:0.68rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;">ម៉ោងសរុប</div>
        <div style="font-weight:600;font-size:0.875rem;color:var(--text-primary);">${getSubject(cs.subject)?.total_hours || '—'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;">
      <div>
        <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-primary);margin-bottom:7px;">ម៉ោងបង្រៀន <span style="color:#ef4444;">*</span></label>
        <input id="em-teaching" type="number" min="0" step="1" value="${existing.id != null ? initTeaching : ''}" placeholder="0"
          class="form-input" style="width:100%;padding:9px 12px;box-sizing:border-box;" />
      </div>
      <div>
        <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-primary);margin-bottom:7px;">អត្រា/ម៉ោង (៛) <span style="color:#ef4444;">*</span></label>
        <input id="em-rate" type="number" min="0" step="500" value="${existing.id != null ? initRate : ''}" placeholder="0"
          class="form-input" style="width:100%;padding:9px 12px;box-sizing:border-box;" />
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:10px;padding:12px 16px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:0.8rem;color:#065f46;font-weight:700;">ប្រាក់សរុប (គណនា)</span>
      <span id="em-computed" style="font-size:1.15rem;font-weight:800;color:#059669;">៛${fmt(initTeaching * initRate)}</span>
    </div>
    <div style="margin-bottom:22px;">
      <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-primary);margin-bottom:7px;">កំណត់សម្គាល់</label>
      <textarea id="em-note" rows="3" placeholder="បញ្ចូលកំណត់សម្គាល់..."
        class="form-input" style="width:100%;padding:9px 12px;box-sizing:border-box;resize:vertical;">${initNote}</textarea>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border);padding-top:18px;">
      <button data-action="cancel" class="btn" style="background:#fff;border:1px solid var(--border);color:var(--text-primary);">បោះបង់</button>
      <button id="em-save" class="btn btn-primary">រក្សាទុក</button>
    </div>
  `;

  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons({ nodes: wrap.querySelectorAll('[data-lucide]') });

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());

  const inpT = wrap.querySelector('#em-teaching');
  const inpR = wrap.querySelector('#em-rate');
  const comp  = wrap.querySelector('#em-computed');
  const recalc = () => { comp.textContent = '៛' + fmt((parseFloat(inpT.value) || 0) * (parseFloat(inpR.value) || 0)); };
  inpT.addEventListener('input', recalc);
  inpR.addEventListener('input', recalc);

  wrap.querySelector('#em-save').addEventListener('click', async () => {
    const teaching = parseFloat(inpT.value);
    const rate     = parseFloat(inpR.value);
    if (isNaN(teaching) || teaching < 0) { showToast('ម៉ោងបង្រៀនមិនត្រឹមត្រូវ', 'warning'); return; }
    if (isNaN(rate)     || rate < 0)     { showToast('អត្រា/ម៉ោងមិនត្រឹមត្រូវ', 'warning'); return; }
    const note = wrap.querySelector('#em-note').value.trim();
    const btn  = wrap.querySelector('#em-save');
    btn.disabled = true; btn.textContent = 'កំពុងរក្សាទុក...';
    try {
      if (existing.id) {
        await api.patch(`/api/core/payroll-rates/${existing.id}/`, { total_teaching: teaching, rate_per_hour: rate, note });
      } else {
        await api.post('/api/core/payroll-rates/', {
          class_subject: cs.id,
          academic_period: state.academicPeriodId,
          total_teaching: teaching,
          rate_per_hour: rate,
          note,
        });
      }
      showToast('បានរក្សាទុករួចរាល់', 'success');
      handle.close();
      await loadPayroll();
    } catch (err) {
      console.error(err);
      showToast('បរាជ័យក្នុងការរក្សាទុក', 'danger');
      btn.disabled = false; btn.textContent = 'រក្សាទុក';
    }
  });
}

async function deletePayrollRecord(id) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h2 style="font-size:1.05rem;font-weight:700;margin:0;color:#b91c1c;">បញ្ជាក់ការលុប</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;">
        <i data-lucide="x" style="width:18px;height:18px;color:var(--text-secondary);"></i>
      </button>
    </div>
    <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:24px;">
      <div style="width:44px;height:44px;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i data-lucide="trash-2" style="width:20px;height:20px;color:#ef4444;"></i>
      </div>
      <div>
        <p style="margin:0 0 6px;font-weight:600;color:var(--text-primary);">តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?</p>
        <p style="margin:0;font-size:0.85rem;color:var(--text-secondary);">ទិន្នន័យប្រាក់ម៉ោងនេះនឹងត្រូវលុបចេញជាអចិន្ត្រៃយ៍ ហើយមិនអាចប្រឈមមុខបានទៀតទេ។</p>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border);padding-top:16px;">
      <button data-action="cancel" class="btn" style="background:#fff;border:1px solid var(--border);color:var(--text-primary);">បោះបង់</button>
      <button id="del-confirm" class="btn" style="background:#ef4444;color:#fff;border:none;">លុប</button>
    </div>
  `;
  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons({ nodes: wrap.querySelectorAll('[data-lucide]') });
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('#del-confirm').addEventListener('click', async () => {
    const btn = wrap.querySelector('#del-confirm');
    btn.disabled = true; btn.textContent = 'កំពុងលុប...';
    try {
      await api.del(`/api/core/payroll-rates/${id}/`);
      showToast('បានលុបរួចរាល់', 'success');
      handle.close();
      await loadPayroll();
    } catch (err) {
      console.error(err);
      showToast('បរាជ័យក្នុងការលុប', 'danger');
      btn.disabled = false; btn.textContent = 'លុប';
    }
  });
}

// ── Render ────────────────────────────────────────────────────────────────────


function getClassroomName(id) {
  const c = state.classrooms?.find(x => x.id === parseInt(id));
  return c ? c.class_name : '—';
}



// ── Lifecycle ─────────────────────────────────────────────────────────────────


async function loadPayroll() {
  const params = state.academicPeriodId ? `?academic_period_id=${state.academicPeriodId}&limit=1000` : '?limit=1000';
  const res = await api.get(`/api/core/payroll-rates/${params}`);
  state.payroll = res.data || [];
  update();
}

async function loadData() {
  state.loading = true; update();
  try {
    const [tRes, sRes, cRes, csRes, perRes] = await Promise.all([
      api.get('/api/users/teachers/?limit=1000'),
      api.get('/api/core/subjects/?limit=1000'),
      api.get('/api/core/classrooms/?limit=1000'),
      api.get('/api/core/class-subjects/?limit=1000'),
      api.get('/api/core/academic-periods/'),
    ]);
    state.teachers = tRes.data || [];
    state.subjects = sRes.data || [];
    state.classrooms = cRes.data || [];
    state.classSubjects = csRes.data || [];
    state.periods = perRes.data || [];
    if (!state.academicPeriodId) state.academicPeriodId = defaultPeriodId(state.periods);
    await loadPayroll();
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យ', 'danger');
  } finally {
    state.loading = false; update();
  }
}

export function render(container) {
  root = container;
  const savedPeriod = sessionStorage.getItem('payroll_academicPeriodId');
  if (savedPeriod) state.academicPeriodId = parseInt(savedPeriod) || null;
  const savedClassroom = sessionStorage.getItem('payroll_classroomFilter');
  if (savedClassroom) state.classroomFilter = parseInt(savedClassroom) || null;
  loadData();
}
export function destroy() { root = null; }
function totalPayout(rows) {
  return rows.reduce((sum, cs) => {
    const existing = state.payroll.find(r => r.class_subject === cs.id) || {};
    let rate = existing.rate_per_hour || '';
    if (!rate) {
      const past = state.allPayrollHistory?.find(r => r.class_subject === cs.id && r.rate_per_hour);
      if (past) rate = past.rate_per_hour;
    }
    const teaching = existing.total_teaching || 0;
    const amount = parseFloat(existing.total_amount) || (parseFloat(rate) * parseFloat(teaching) || 0);
    return sum + amount;
  }, 0);
}
