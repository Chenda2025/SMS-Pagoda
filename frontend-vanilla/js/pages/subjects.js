import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { buildStandardReportElement } from '../components/reportTemplate.js';
import { onLiveInput } from '../utils/dom.js';

const ITEMS_PER_PAGE = 10;

let root = null;
let state = {
  currentYearName: '',
  subjects: [],
  loading: true,
  error: null,
  searchQuery: '',
  showTgMenu: false,
  currentPage: 1
};
let tgMenuListenerBound = false;

// Utils
function toKhmerNumerals(num) {
  if (num === null || num === undefined) return '';
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().replace(/\d/g, d => khmerDigits[d]);
}

async function fetchSubjects() {
  try {
    const [res, yearsRes] = await Promise.all([
      api.get('/api/subjects/'),
      api.get('/api/academic-years/')
    ]);
    if (!res.ok) throw new Error('បរាជ័យក្នុងការទាញយកទិន្នន័យមុខវិជ្ជា');

    let currentYearName = '';
    if (yearsRes.ok && Array.isArray(yearsRes.data)) {
      const currentYear = yearsRes.data.find(y => y.is_current);
      if (currentYear) currentYearName = currentYear.year_name;
    }

    state = { ...state, subjects: res.data || [], currentYearName, loading: false, error: null };
  } catch (err) {
    state = { ...state, error: err.message, loading: false };
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យ', 'error');
  }
  update();
}

function openSubjectModal(editingSubject = null) {
  const formData = editingSubject ? {
    subject_code: editingSubject.subject_code || '',
    subject_name: editingSubject.subject_name || '',
    coefficient: editingSubject.coefficient || 1,
    total_hours: editingSubject.total_hours || 1,
    total_score: editingSubject.total_score || 100,
    total_homework: editingSubject.total_homework || 0,
    total_time_exam: editingSubject.total_time_exam || 60
  } : {
    subject_code: '',
    subject_name: '',
    coefficient: 1,
    total_hours: 1,
    total_score: 100,
    total_homework: 0,
    total_time_exam: 60
  };

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">${editingSubject ? 'កែប្រែមុខវិជ្ជា' : 'បន្ថែមមុខវិជ្ជាថ្មី'}</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>
    
    <form style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 2fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">កូដមុខវិជ្ជា</label>
          <input type="text" data-f="subject_code" class="form-input" disabled style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;background:#f1f5f9;color:var(--text-secondary);cursor:not-allowed;" placeholder="${editingSubject ? '' : 'បង្កើតដោយស្វ័យប្រវត្តិ'}" />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះមុខវិជ្ជា <span style="color:red">*</span></label>
          <input type="text" data-f="subject_name" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" placeholder="ឧ. ភាសាខ្មែរ" required />
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">មេគុណ</label>
          <input type="number" data-f="coefficient" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" min="1" required />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ចំនួនម៉ោងសរុប</label>
          <input type="number" data-f="total_hours" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" min="1" required />
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ពិន្ទុសរុប</label>
          <input type="number" data-f="total_score" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" min="1" required />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ការងារផ្ទះសរុប</label>
          <input type="number" data-f="total_homework" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" min="0" />
        </div>
      </div>

      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">រយៈពេលប្រឡងសរុប (នាទី)</label>
        <input type="number" data-f="total_time_exam" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" min="0" />
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">${editingSubject ? 'កែប្រែ' : 'រក្សាទុក'}មុខវិជ្ជា</button>
      </div>
    </form>
  `;

  // Bind values
  Object.keys(formData).forEach(key => {
    const el = wrap.querySelector(`[data-f="${key}"]`);
    if (el) el.value = formData[key];
  });

  function checkDuplicateName(name) {
    const nameToCheck = (name || '').trim().toLowerCase();
    if (!nameToCheck) return false;
    return state.subjects.some(s =>
      (s.subject_name || '').trim().toLowerCase() === nameToCheck &&
      (!editingSubject || String(s.id) !== String(editingSubject.id))
    );
  }



  async function handleSubmit(e) {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
    errorBox.style.display = 'none';

    // Collect data
    const payload = {};
    Object.keys(formData).forEach(key => {
      if (key === 'subject_code' && !editingSubject) return; // auto-generated by the backend on create
      const el = wrap.querySelector(`[data-f="${key}"]`);
      payload[key] = el.type === 'number' ? (Number(el.value) || 0) : el.value;
    });

    if (checkDuplicateName(payload.subject_name)) {
      errorBox.textContent = 'មុខវិជ្ជានេះមានរួចហើយ! សូមប្រើឈ្មោះផ្សេង';
      errorBox.style.display = 'block';
      return;
    }

    const submitBtn = wrap.querySelector('[data-role="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'កំពុងរក្សាទុក...';

    try {
      let res;
      if (editingSubject) {
        res = await api.put(`/api/subjects/${editingSubject.id}/`, payload);
      } else {
        res = await api.post('/api/subjects/', payload);
      }

      if (!res.ok) throw new Error(res.data?.detail || res.data?.error || 'បរាជ័យក្នុងការរក្សាទុក');

      showToast(`បាន${editingSubject ? 'កែប្រែ' : 'បន្ថែម'}មុខវិជ្ជាដោយជោគជ័យ`, 'success');
      handle.close();
      fetchSubjects();
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = `${editingSubject ? 'កែប្រែ' : 'រក្សាទុក'}មុខវិជ្ជា`;
    }
  }

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', handleSubmit);

  const handle = openModal(wrap);
}

async function handleDeleteSubject(id) {
  if (!window.confirm('តើបងពិតជាចង់លុបមុខវិជ្ជានេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។')) return;

  try {
    const res = await api.del(`/api/subjects/${id}/`);
    if (!res.ok) throw new Error('បរាជ័យក្នុងការលុប');
    showToast('មុខវិជ្ជាត្រូវបានលុបដោយជោគជ័យ', 'success');

    // Close top drawer if it's the view drawer that initiated the delete
    const dr = document.querySelector('.vmodal-drawer');
    if (dr && dr.contains(document.activeElement) || window._currentDrawerId === id) {
      import('../components/modal.js').then(m => m.closeTopModal());
    }

    fetchSubjects();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openViewDrawer(subject) {
  window._currentDrawerId = subject.id; // Hack for delete handling
  const wrap = document.createElement('div');
  wrap.style.margin = '-28px -32px';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';

  wrap.innerHTML = `
    <div style="padding:24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;border-top-left-radius:20px;border-top-right-radius:20px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:48px;height:48px;border-radius:14px;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;">
          <i data-lucide="book-open" style="width:24px;height:24px;color:var(--primary)"></i>
        </div>
        <div>
          <h2 style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin:0;">${subject.subject_name}</h2>
          <span style="font-size:0.9rem;color:var(--text-secondary);font-weight:600;">កូដ: ${subject.subject_code}</span>
        </div>
      </div>
      <button data-action="close" style="width:40px;height:40px;border-radius:50%;background:#f1f5f9;border:none;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <i data-lucide="x" style="width:20px;height:20px;"></i>
      </button>
    </div>

    <div style="padding:32px;display:flex;flex-direction:column;gap:24px;flex-grow:1;overflow-y:auto;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">មេគុណមុខវិជ្ជា</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.1rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="award" style="color:var(--primary);width:20px;height:20px;"></i>
            ${toKhmerNumerals(subject.coefficient)}
          </div>
        </div>
        
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ម៉ោងសរុប</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.1rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="clock" style="color:var(--success);width:20px;height:20px;"></i>
            ${toKhmerNumerals(subject.total_hours)} ម៉ោង
          </div>
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ពិន្ទុអតិបរមា</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.1rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="file-text" style="color:#f59e0b;width:20px;height:20px;"></i>
            ${toKhmerNumerals(subject.total_score)} ពិន្ទុ
          </div>
        </div>
        
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">រយៈពេលប្រឡង</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.1rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="clock" style="color:#8b5cf6;width:20px;height:20px;"></i>
            ${toKhmerNumerals(subject.total_time_exam)} នាទី
          </div>
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ការងារផ្ទះសរុប</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.1rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="file-text" style="color:#0ea5e9;width:20px;height:20px;"></i>
            ${toKhmerNumerals(subject.total_homework)} កិច្ចការ
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
    openSubjectModal(subject);
  });
  wrap.querySelector('[data-action="delete"]').addEventListener('click', () => {
    handleDeleteSubject(subject.id);
  });

  const handle = openModal(wrap);
}

function update() {
  if (!root) return;
  const { subjects, loading, error, searchQuery } = state;

  const filteredSubjects = subjects.filter(sub => {
    const search = searchQuery.toLowerCase();
    return (sub.subject_name || '').toLowerCase().includes(search) ||
      (sub.subject_code || '').toLowerCase().includes(search);
  });

  const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE));
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const startIdx = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubjects = filteredSubjects.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const totalHours = subjects.reduce((sum, s) => sum + (Number(s.total_hours) || 0), 0);
  const totalScore = subjects.reduce((sum, s) => sum + (Number(s.total_score) || 0), 0);
  const totalHomework = subjects.reduce((sum, s) => sum + (Number(s.total_homework) || 0), 0);

  const filteredTotalHours = filteredSubjects.reduce((sum, s) => sum + (Number(s.total_hours) || 0), 0);
  const filteredTotalScore = filteredSubjects.reduce((sum, s) => sum + (Number(s.total_score) || 0), 0);
  const filteredTotalHomework = filteredSubjects.reduce((sum, s) => sum + (Number(s.total_homework) || 0), 0);

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:24px;">
      
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">គ្រប់គ្រងមុខវិជ្ជាសិក្សា</h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">គ្រប់គ្រង និងបន្ថែមមុខវិជ្ជាដែលបង្រៀននៅក្នុងសាលា</p>
        </div>
        <div style="display:flex;gap:12px;">
          <div style="position:relative;" onmouseenter="this.querySelector('#tg-menu').style.display='block'" onmouseleave="this.querySelector('#tg-menu').style.display='none'">
            <button class="btn"  style="background:#0088cc;color:#fff;display:flex;align-items:center;gap:7px;"><i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>
            <div id="tg-menu" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:180px;overflow:hidden;"
                <button data-action="tg-send-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> PDF (.pdf)</button>
                <button data-action="tg-send-excel" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="file-spreadsheet" style="width:16px;height:16px;color:#16a34a;"></i> Excel (.xlsx)</button>
                <button data-action="tg-send-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;"><i data-lucide="image" style="width:16px;height:16px;color:#a855f7;"></i> Image (.png)</button>
              </div>
          </div>
          <button class="btn btn-primary" data-action="add-subject" style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="plus" style="width:18px;height:18px"></i> បន្ថែមមុខវិជ្ជាថ្មី
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">មុខវិជ្ជាសិក្សាសរុប</span><div class="stat-icon primary"><i data-lucide="book-open" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${toKhmerNumerals(subjects.length)}</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">ម៉ោងសរុប</span><div class="stat-icon success"><i data-lucide="clock" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${toKhmerNumerals(totalHours)}</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">ពិន្ទុសរុប</span><div class="stat-icon warning"><i data-lucide="file-text" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${toKhmerNumerals(totalScore)}</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">ការងារផ្ទះសរុប</span><div class="stat-icon danger"><i data-lucide="clipboard-list" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">${toKhmerNumerals(totalHomework)}</div>
        </div>
      </div>

      <div class="glass-panel animate-slide-up" style="padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <div style="display:flex;align-items:center;background:#fff;border:1px solid var(--border);border-radius:10px;padding:8px 14px;width:300px;gap:8px;">
            <i data-lucide="search" style="width:18px;height:18px;color:var(--text-secondary)"></i>
            <input type="text" data-action="search" placeholder="ស្វែងរកមុខវិជ្ជា ឬកូដ..." value="${searchQuery}" style="border:none;outline:none;font-size:0.85rem;width:100%;font-family:inherit;color:var(--text-primary);" />
            ${searchQuery ? `<button data-action="clear-search" style="background:none;border:none;cursor:pointer;color:var(--text-secondary);display:flex;align-items:center;"><i data-lucide="x" style="width:14px;height:14px;"></i></button>` : ''}
          </div>
        </div>

        ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;margin-bottom:20px;">${error}</div>` : ''}
        
        ${loading ? `<div style="text-align:center;padding:40px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>` : `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width:13%">កូដ</th>
                  <th style="width:22%">ឈ្មោះមុខវិជ្ជា</th>
                  <th style="width:9%">មេគុណ</th>
                  <th style="width:13%">ម៉ោងសរុប</th>
                  <th style="width:9%">ពិន្ទុ</th>
                  <th style="width:12%">ការងារផ្ទះ</th>
                  <th style="width:13%">រយៈពេលប្រឡង</th>
                  <th style="width:9%">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${filteredSubjects.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:32px;">មិនមានទិន្នន័យមុខវិជ្ជា</td></tr>` : paginatedSubjects.map(sub => `
                  <tr data-id="${sub.id}" class="hover-row">
                    <td><span style="font-family:monospace;font-weight:700;color:var(--primary);background:rgba(79, 70, 229, 0.1);padding:4px 8px;border-radius:6px;">${sub.subject_code || 'N/A'}</span></td>
                    <td><span style="font-weight:700;color:var(--text-primary);">${sub.subject_name}</span></td>
                    <td>${toKhmerNumerals(sub.coefficient)}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:6px;font-size:0.85rem;font-weight:600;">
                        <i data-lucide="clock" style="width:14px;height:14px;color:var(--primary)"></i>
                        <span>${toKhmerNumerals(sub.total_hours)} ម៉ោង</span>
                      </div>
                    </td>
                    <td>${toKhmerNumerals(sub.total_score)}</td>
                    <td>${toKhmerNumerals(sub.total_homework)}</td>
                    <td>${toKhmerNumerals(sub.total_time_exam)} នាទី</td>
                    <td>
                      <div style="display:flex;gap:8px;">
                        <button data-action="view" data-id="${sub.id}" style="color:var(--text-secondary);background:none;border:none;cursor:pointer;padding:4px;" title="មើល"><i data-lucide="eye" style="width:18px;height:18px;"></i></button>
                        <button data-action="edit" data-id="${sub.id}" style="color:var(--primary);background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="edit-3" style="width:18px;height:18px;"></i></button>
                        <button data-action="delete" data-id="${sub.id}" style="color:var(--danger);background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="trash-2" style="width:18px;height:18px;"></i></button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
              ${filteredSubjects.length > 0 ? `
                <tfoot>
                  <tr style="font-weight:700;background:#f8fafc;">
                    <td colspan="3">សរុប ${toKhmerNumerals(filteredSubjects.length)} មុខវិជ្ជា</td>
                    <td>${toKhmerNumerals(filteredTotalHours)} ម៉ោង</td>
                    <td>${toKhmerNumerals(filteredTotalScore)}</td>
                    <td>${toKhmerNumerals(filteredTotalHomework)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              ` : ''}
            </table>
          </div>
          ${filteredSubjects.length > 0 ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;flex-wrap:wrap;gap:12px;">
              <div style="font-size:0.85rem;color:var(--text-secondary);">
                បង្ហាញ ${toKhmerNumerals(startIdx + 1)} ដល់ ${toKhmerNumerals(Math.min(startIdx + ITEMS_PER_PAGE, filteredSubjects.length))} នៃ ${toKhmerNumerals(filteredSubjects.length)}
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <button data-action="prev-page" class="btn btn-outline" ${state.currentPage === 1 ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">មុន</button>
                <span style="font-size:0.85rem;color:var(--text-secondary);">${toKhmerNumerals(state.currentPage)} / ${toKhmerNumerals(totalPages)}</span>
                <button data-action="next-page" class="btn btn-outline" ${state.currentPage >= totalPages ? 'disabled' : ''} style="padding:6px 12px;border-radius:8px;">បន្ទាប់</button>
              </div>
            </div>
        ` : ''}
        `}
      </div>
    </div>
  `;

  // Bind Events
  root.querySelector('[data-action="add-subject"]').addEventListener('click', () => openSubjectModal(null));

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

  const searchInput = root.querySelector('[data-action="search"]');
  onLiveInput(searchInput, () => {
    state.searchQuery = searchInput.value;
    state.currentPage = 1;
    update();
    setTimeout(() => {
      const input = root.querySelector('[data-action="search"]');
      if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
    }, 0);
  });

  const clearSearchBtn = root.querySelector('[data-action="clear-search"]');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.currentPage = 1;
      update();
    });
  }

  root.querySelector('[data-action="prev-page"]')?.addEventListener('click', () => {
    if (state.currentPage > 1) { state.currentPage--; update(); }
  });
  root.querySelector('[data-action="next-page"]')?.addEventListener('click', () => {
    state.currentPage++;
    update();
  });

  root.querySelectorAll('button[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sub = subjects.find(s => String(s.id) === btn.dataset.id);
      if (sub) openViewDrawer(sub);
    });
  });

  root.querySelectorAll('button[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sub = subjects.find(s => String(s.id) === btn.dataset.id);
      if (sub) openSubjectModal(sub);
    });
  });

  root.querySelectorAll('button[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteSubject(btn.dataset.id);
    });
  });

  if (window.lucide) window.lucide.createIcons();
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

// Builds a detached, visibly-styled element with the title + subjects
// table for the Telegram image capture.
function buildSubjectsReportElement() {
  const list = getFilteredSubjects();
  const totalHours = list.reduce((acc, curr) => acc + (parseInt(curr.total_hours) || 0), 0);
  const totalScore = list.reduce((acc, curr) => acc + (parseInt(curr.total_score) || 0), 0);
  const totalHomework = list.reduce((acc, curr) => acc + (parseInt(curr.total_homework) || 0), 0);

  const tableNode = document.createElement('table');
  tableNode.innerHTML = `
    <thead>
      <tr style="background:#f8fafc;border-bottom:2px solid var(--border);text-align:left;">
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ល.រ</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">កូដមុខវិជ្ជា</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ឈ្មោះមុខវិជ្ជា</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">មេគុណ</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ម៉ោងសរុប</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ពិន្ទុសរុប</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">ការងារផ្ទះសរុប</th>
        <th style="padding:16px;font-weight:600;color:var(--text-secondary);font-family:'Moul',cursive;font-size:0.9rem;">រយៈពេលប្រឡង</th>
      </tr>
    </thead>
    <tbody>
      ${list.map((s, idx) => `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(idx + 1)}</td>
          <td style="padding:16px;color:var(--text-primary);"><span style="background:var(--bg-secondary);padding:4px 8px;border-radius:6px;font-family:monospace;">${s.subject_code}</span></td>
          <td style="padding:16px;color:var(--text-primary);font-weight:500;">${s.subject_name}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(s.coefficient)}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(s.total_hours)}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(s.total_score)}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(s.total_homework)}</td>
          <td style="padding:16px;color:var(--text-primary);">${toKhmerNumerals(s.total_time_exam)} នាទី</td>
        </tr>
      `).join('')}
    </tbody>
    <tfoot>
      <tr style="font-weight:700;background:#f8fafc;">
        <td colspan="3" style="text-align:right;">សរុប ${toKhmerNumerals(list.length)} មុខវិជ្ជា</td>
        <td>${toKhmerNumerals(totalHours)} ម៉ោង</td>
        <td>${toKhmerNumerals(totalScore)}</td>
        <td>${toKhmerNumerals(totalHomework)}</td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
  `;

  const title = `បញ្ជីមុខវិជ្ជាសិក្សាសរុបប្រចាំឆ្នាំសិក្សា ${state.currentYearName || '..........'}`;
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
  const wsData = state.subjects.map((s, i) => ({
    'ល.រ': i + 1, 'កូដមុខវិជ្ជា': s.subject_code, 'ឈ្មោះមុខវិជ្ជា': s.subject_name,
    'មេគុណ': s.coefficient, 'ម៉ោងសរុប': s.total_hours, 'ពិន្ទុសរុប': s.total_score,
    'ការងារផ្ទះសរុប': s.total_homework, 'រយៈពេលប្រឡង (នាទី)': s.total_time_exam
  }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Subjects');
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
    const reportEl = buildSubjectsReportElement();
    const caption = `📚 បញ្ជីមុខវិជ្ជាសិក្សា (សរុប ${state.subjects.length} មុខវិជ្ជា)`;
    let blob, filename, isPhoto = false;
    if (kind === 'image') { blob = await captureReportImage(reportEl); filename = 'subjects.png'; isPhoto = true; }
    else if (kind === 'pdf') { blob = await getPdfBlob(reportEl); filename = 'subjects.pdf'; }
    else if (kind === 'excel') { blob = getExcelBlob(); filename = 'subjects.xlsx'; }

    await sendTelegramFile({ blob, filename, isPhoto, caption, tgConfig });
    showToast('បានផ្ញើបញ្ជីមុខវិជ្ជាចូល Telegram ដោយជោគជ័យ', 'success');
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
  state = { subjects: [], loading: true, error: null, searchQuery: '', showTgMenu: false, currentPage: 1 };
  update();
  fetchSubjects();
}

export function destroy() {
  root = null;
}
