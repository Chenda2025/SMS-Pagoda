import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

let root = null;
let state = {
  applications: [],
  loading: true,
  error: null,
  activeSession: null,
  selectedIds: new Set(),
  isProcessing: false
};

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .pending-avatar {
      width: 36px; height: 36px; border-radius: 50%; background: var(--primary, #4f46e5);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; flex-shrink: 0; overflow: hidden;
    }
    .pending-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .pending-row { display: flex; align-items: center; gap: 10px; }
    .pending-iconbtn {
      background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px;
      display: inline-flex; align-items: center; justify-content: center; color: var(--text-secondary, #6b7280);
    }
    .pending-iconbtn:hover { background: #f1f5f9; }
    @media (max-width: 900px) {
      .pending-session-card { flex-direction: column; align-items: flex-start !important; gap: 16px; }
    }
    @media (max-width: 640px) {
      .pending-table-wrap { overflow-x: auto; }
    }
  `;
  document.head.appendChild(style);
}

function initials(s) {
  const a = (s.last_name || '').trim()[0] || '';
  const b = (s.first_name || '').trim()[0] || '';
  return (a + b).toUpperCase() || '?';
}

// --- API Calls ---

async function fetchApplications() {
  state.loading = true;
  update();
  try {
    const res = await api.get('/api/students/pending/?status=submitted');
    if (!res.ok) throw new Error('បរាជ័យក្នុងការទាញយកពាក្យសុំ');
    state.applications = res.data || [];
    state.error = null;
  } catch (err) {
    state.error = err.message;
    showToast(err.message, 'error');
  } finally {
    state.loading = false;
    update();
  }
}

async function fetchActiveSession() {
  try {
    const res = await api.get('/api/students/registration-sessions/active/');
    if (res.ok) {
      state.activeSession = res.data;
    } else {
      state.activeSession = null;
    }
    update();
  } catch (err) {
    state.activeSession = null;
    update();
  }
}

// --- Registration Session ---

function openSessionModal() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">បើករដូវកាលចុះឈ្មោះថ្មី</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    
    <form style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ចំណងជើងរដូវកាល (ឧ. ឆ្នាំសិក្សា ២០២៥-២០២៦)</label>
        <input type="text" data-f="title" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃចាប់ផ្តើម</label>
          <input type="date" data-f="start_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃបញ្ចប់</label>
          <input type="date" data-f="end_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">រក្សាទុក</button>
      </div>
    </form>
  `;

  if (window.lucide) window.lucide.createIcons({ root: wrap });

  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = wrap.querySelector('[data-role="submit"]');
    btn.disabled = true;
    btn.textContent = 'កំពុងរក្សាទុក...';
    
    try {
      const res = await api.post('/api/students/registration-sessions/', {
        title: wrap.querySelector('[data-f="title"]').value,
        start_date: wrap.querySelector('[data-f="start_date"]').value,
        end_date: wrap.querySelector('[data-f="end_date"]').value,
        is_active: true
      });
      if (!res.ok) throw new Error('បរាជ័យក្នុងការបង្កើត');
      showToast('បានបើករដូវកាលចុះឈ្មោះថ្មីជោគជ័យ', 'success');
      handle.close();
      fetchActiveSession();
    } catch(err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'រក្សាទុក';
    }
  });

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  const handle = openModal(wrap);
}

async function closeActiveSession() {
  if (!state.activeSession || !window.confirm('តើអ្នកពិតជាចង់បិទការចុះឈ្មោះនេះមែនទេ?')) return;
  try {
    const res = await api.patch(`/api/students/registration-sessions/${state.activeSession.id}/`, {
      is_active: false
    });
    if (!res.ok) throw new Error('បរាជ័យ');
    showToast('បានបិទការចុះឈ្មោះជោគជ័យ!', 'success');
    fetchActiveSession();
  } catch (err) {
    showToast('មានបញ្ហាក្នុងការបិទ', 'error');
  }
}

// --- Application Actions ---

async function handleApprove(ids) {
  const idList = Array.isArray(ids) ? ids : [ids];
  const msg = idList.length > 1
    ? `តើបងពិតជាចង់អនុម័តសិស្ស ${idList.length} នាក់មែនទេ? (នឹងបញ្ចូលទៅក្នុងបញ្ជីសិស្សសកម្ម)`
    : 'តើបងពិតជាចង់អនុម័តសិស្សនេះមែនទេ? (នឹងបញ្ចូលទៅក្នុងបញ្ជីសិស្សសកម្ម)';
  if (!window.confirm(msg)) return;

  state.isProcessing = true;
  update();
  let successCount = 0;
  for (const id of idList) {
    try {
      const res = await api.post(`/api/students/pending/${id}/approve/`);
      if (res.ok) successCount++;
    } catch (err) {
      console.error(err);
    }
  }
  if (successCount > 0) {
    showToast(successCount > 1 ? `បានអនុម័ត ${successCount} នាក់រួចរាល់` : 'អនុម័តរួចរាល់', 'success');
    state.selectedIds.clear();
  }
  if (successCount < idList.length) {
    showToast('បរាជ័យសម្រាប់សិស្សមួយចំនួន', 'error');
  }
  state.isProcessing = false;
  fetchApplications();
}

async function handleReject(ids) {
  const idList = Array.isArray(ids) ? ids : [ids];
  const reason = window.prompt(
    idList.length > 1 ? `មូលហេតុនៃការបដិសេធ (សិស្ស ${idList.length} នាក់):` : 'មូលហេតុនៃការបដិសេធ:'
  );
  if (reason === null) return;

  state.isProcessing = true;
  update();
  let successCount = 0;
  for (const id of idList) {
    try {
      const res = await api.post(`/api/students/pending/${id}/reject/`, { reason });
      if (res.ok) successCount++;
    } catch (err) {
      console.error(err);
    }
  }
  if (successCount > 0) {
    showToast(successCount > 1 ? `បានបដិសេធ ${successCount} នាក់រួចរាល់` : 'បដិសេធរួចរាល់', 'success');
    state.selectedIds.clear();
  }
  if (successCount < idList.length) {
    showToast('បរាជ័យសម្រាប់សិស្សមួយចំនួន', 'error');
  }
  state.isProcessing = false;
  fetchApplications();
}

// --- View Modal ---

function openViewModal(s) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">ព័ត៌មានពាក្យសុំ</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
      <div class="pending-avatar" style="width:56px;height:56px;font-size:1.1rem;">
        ${s.image_url ? `<img src="${s.image_url}" />` : initials(s)}
      </div>
      <div>
        <div style="font-weight:700;font-size:1.05rem;">${s.last_name || ''} ${s.first_name || ''}</div>
        <div style="color:#6b7280;font-size:0.875rem;">${s.latin_name || ''}</div>
        <div style="color:#9ca3af;font-size:0.8rem;">កូដតាមដាន: ${s.tracking_code || '-'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:0.9rem;">
      <div><div style="color:#6b7280;">ភេទ</div><div style="font-weight:600;">${s.gender || '-'}</div></div>
      <div><div style="color:#6b7280;">ថ្ងៃខែឆ្នាំកំណើត</div><div style="font-weight:600;">${s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString('en-GB') : '-'}</div></div>
      <div><div style="color:#6b7280;">ទូរស័ព្ទ</div><div style="font-weight:600;">${s.phone || '-'}</div></div>
      <div><div style="color:#6b7280;">សញ្ជាតិ</div><div style="font-weight:600;">${s.nationality_name || s.new_nationality_name || '-'}</div></div>
      <div><div style="color:#6b7280;">ឋានៈ</div><div style="font-weight:600;">${s.monk_status || '-'}</div></div>
      <div><div style="color:#6b7280;">កម្រិតវប្បធម៌</div><div style="font-weight:600;">${s.education_level || '-'}</div></div>
      <div><div style="color:#6b7280;">វត្តកំពុងស្នាក់</div><div style="font-weight:600;">${s.current_pagoda_name || s.new_current_pagoda_name || '-'}</div></div>
      <div><div style="color:#6b7280;">កុដិ</div><div style="font-weight:600;">${s.kuti_name || s.new_kuti_name || '-'}</div></div>
      <div><div style="color:#6b7280;">វត្តកំណើត</div><div style="font-weight:600;">${s.birth_pagoda_name || s.new_birth_pagoda_name || '-'}</div></div>
      <div><div style="color:#6b7280;">អាសយដ្ឋាន</div><div style="font-weight:600;">${s.address || '-'}</div></div>
      ${s.monk_status && s.monk_status !== 'គ្រហស្ថ' ? `
        <div><div style="color:#6b7280;">លេខសង្ឃាដិក</div><div style="font-weight:600;">${s.sanghatika_no || '-'}</div></div>
        <div><div style="color:#6b7280;">ឈ្មោះឆាយា</div><div style="font-weight:600;">${s.chaya_name || '-'}</div></div>
        <div><div style="color:#6b7280;">លេខឆាយា</div><div style="font-weight:600;">${s.chaya_no || '-'}</div></div>
        <div><div style="color:#6b7280;">ថ្ងៃបួស</div><div style="font-weight:600;">${s.ordination_date ? new Date(s.ordination_date).toLocaleDateString('en-GB') : '-'}</div></div>
        <div style="grid-column:span 2;"><div style="color:#6b7280;">ឈ្មោះព្រះឧបជ្ឈាយ៍</div><div style="font-weight:600;">${s.preceptor_name || '-'}</div></div>
      ` : ''}
      <div style="grid-column:span 2;"><div style="color:#6b7280;">កំណត់ចំណាំ</div><div style="font-weight:600;">${s.note || '-'}</div></div>
      <div><div style="color:#6b7280;">ស្ថានភាព</div><div style="font-weight:600;">${s.status || '-'}</div></div>
      <div><div style="color:#6b7280;">ថ្ងៃដាក់ពាក្យ</div><div style="font-weight:600;">${s.created_at ? new Date(s.created_at).toLocaleString('en-GB') : '-'}</div></div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
      <button type="button" data-action="cancel" style="padding:10px 16px;background-color:#f1f5f9;border:none;border-radius:8px;cursor:pointer;font-weight:500;">បិទ</button>
    </div>
  `;
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
}

// --- Rendering ---

function update() {
  if (!root) return;
  const { applications, loading, error, activeSession } = state;

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:24px;">
      
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">ពាក្យសុំចូលរៀន</h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">ពិនិត្យ និងអនុម័តពាក្យសុំចុះឈ្មោះចូលរៀនថ្មី (${applications.length} ពាក្យសុំ)</p>
        </div>
      </div>

      <!-- Registration Session Status -->
      <div class="pending-session-card" style="background:white;padding:20px;border-radius:12px;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3 style="margin:0 0 8px 0;font-size:1.1rem;display:flex;align-items:center;gap:8px;">
            រដូវកាលចុះឈ្មោះអនឡាញ: 
            ${activeSession ? 
              `<span style="color:#16a34a;background:#dcfce7;padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:8px;height:8px;background:#16a34a;border-radius:50%;"></span> កំពុងបើកដំណើរការ</span>` : 
              `<span style="color:#dc2626;background:#fee2e2;padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;">បិទ</span>`
            }
          </h3>
          ${activeSession ? `
            <p style="margin:0;color:var(--text-secondary);font-size:0.9rem;">
              <strong>ចំណងជើង:</strong> ${activeSession.title} <br>
              <strong>រយៈពេល:</strong> ${new Date(activeSession.start_date).toLocaleDateString('en-GB')} ដល់ ${new Date(activeSession.end_date).toLocaleDateString('en-GB')} <br>
              <a href="/apply" target="_blank" style="color:var(--primary);text-decoration:none;font-weight:500;display:inline-flex;align-items:center;gap:4px;margin-top:6px;">មើលទំព័រចុះឈ្មោះសម្រាប់សិស្ស <i data-lucide="external-link" style="width:14px;height:14px;"></i></a>
            </p>
          ` : `
            <p style="margin:0;color:var(--text-secondary);font-size:0.9rem;">សិស្សមិនអាចចូលទៅចុះឈ្មោះតាមអនឡាញបានទេនៅពេលនេះ។</p>
          `}
        </div>
        <div>
          ${activeSession ? `
            <button class="btn btn-outline" data-action="close-session" style="color:#dc2626;border-color:#dc2626;">បិទការចុះឈ្មោះ</button>
          ` : `
            <button class="btn btn-primary" data-action="open-session">បើករដូវកាលថ្មី</button>
          `}
        </div>
      </div>

      ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;margin-bottom:20px;">${error}</div>` : ''}
      
      ${loading ? `<div style="text-align:center;padding:60px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>` : `
        <div class="glass-panel" style="padding:20px;">
          ${state.selectedIds.size > 0 ? `
            <div style="display:flex;align-items:center;justify-content:space-between;background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:10px 16px;margin-bottom:16px;font-size:0.85rem;color:#3730a3;flex-wrap:wrap;gap:8px;">
              <span>បានជ្រើស ${state.selectedIds.size} នាក់</span>
              <div style="display:flex;gap:8px;">
                <button data-action="bulk-approve" ${state.isProcessing ? 'disabled' : ''} style="background:#16a34a;color:white;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:0.8rem;font-weight:600;display:flex;align-items:center;gap:6px;">
                  <i data-lucide="check-circle" style="width:14px;height:14px;"></i> អនុម័តអ្នកដែលបានជ្រើស
                </button>
                <button data-action="bulk-reject" ${state.isProcessing ? 'disabled' : ''} style="background:#dc2626;color:white;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:0.8rem;font-weight:600;display:flex;align-items:center;gap:6px;">
                  <i data-lucide="x-circle" style="width:14px;height:14px;"></i> បដិសេធអ្នកដែលបានជ្រើស
                </button>
              </div>
            </div>
          ` : ''}
          <div class="table-container pending-table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="width:36px;"><input type="checkbox" data-action="select-all" ${applications.length > 0 && applications.every(s => state.selectedIds.has(String(s.id))) ? 'checked' : ''} /></th>
                  <th>កាលបរិច្ឆេទសុំ</th>
                  <th>ឈ្មោះសិស្ស</th>
                  <th>ភេទ</th>
                  <th>ថ្ងៃខែឆ្នាំកំណើត</th>
                  <th>លេខទូរស័ព្ទ</th>
                  <th>កម្រិតវប្បធម៌</th>
                  <th style="text-align:right;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${applications.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);">មិនមានពាក្យសុំថ្មីទេ</td></tr>` : applications.map((s) => `
                  <tr class="hover-row">
                    <td><input type="checkbox" data-action="select-row" data-id="${s.id}" ${state.selectedIds.has(String(s.id)) ? 'checked' : ''} /></td>
                    <td>${s.created_at ? new Date(s.created_at).toLocaleString('en-GB') : '---'}</td>
                    <td style="font-weight:600;color:var(--text-primary);">
                      <div class="pending-row">
                        <div class="pending-avatar">${s.image_url ? `<img src="${s.image_url}" />` : initials(s)}</div>
                        <span>${s.last_name || ''} ${s.first_name || ''}</span>
                      </div>
                    </td>
                    <td>${s.gender || '---'}</td>
                    <td>${s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString('en-GB') : '---'}</td>
                    <td>${s.phone || '---'}</td>
                    <td><span style="background:rgba(234, 179, 8, 0.15);color:#ca8a04;padding:4px 10px;border-radius:6px;font-size:0.85rem;font-weight:600;">${s.education_level || '---'}</span></td>
                    <td style="text-align:right;">
                      <div style="display:flex;gap:4px;justify-content:flex-end;align-items:center;">
                        <button data-action="view" data-id="${s.id}" class="pending-iconbtn" title="មើល"><i data-lucide="eye" style="width:16px;height:16px;"></i></button>
                        <button data-action="approve" data-id="${s.id}" style="background:#16a34a;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:4px;"><i data-lucide="check-circle" style="width:16px;height:16px;"></i> អនុម័ត</button>
                        <button data-action="reject" data-id="${s.id}" style="background:#dc2626;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:4px;"><i data-lucide="x-circle" style="width:16px;height:16px;"></i> បដិសេធ</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}
    </div>
  `;

  // Bind Events
  root.querySelector('[data-action="open-session"]')?.addEventListener('click', openSessionModal);
  root.querySelector('[data-action="close-session"]')?.addEventListener('click', closeActiveSession);

  root.querySelectorAll('button[data-action="approve"]').forEach(btn => {
    btn.addEventListener('click', () => handleApprove(btn.dataset.id));
  });

  root.querySelectorAll('button[data-action="reject"]').forEach(btn => {
    btn.addEventListener('click', () => handleReject(btn.dataset.id));
  });

  root.querySelectorAll('button[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const app = applications.find(a => String(a.id) === String(btn.dataset.id));
      if (app) openViewModal(app);
    });
  });

  root.querySelectorAll('input[data-action="select-row"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) state.selectedIds.add(id);
      else state.selectedIds.delete(id);
      update();
    });
  });

  root.querySelector('input[data-action="select-all"]')?.addEventListener('change', (e) => {
    if (e.target.checked) applications.forEach(s => state.selectedIds.add(String(s.id)));
    else applications.forEach(s => state.selectedIds.delete(String(s.id)));
    update();
  });

  root.querySelector('[data-action="bulk-approve"]')?.addEventListener('click', () => {
    handleApprove(Array.from(state.selectedIds));
  });
  root.querySelector('[data-action="bulk-reject"]')?.addEventListener('click', () => {
    handleReject(Array.from(state.selectedIds));
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  injectStyles();
  root = container;
  state = { applications: [], loading: true, error: null, activeSession: null, selectedIds: new Set(), isProcessing: false };
  update();
  fetchActiveSession();
  fetchApplications();
}

export function destroy() {
  root = null;
}
