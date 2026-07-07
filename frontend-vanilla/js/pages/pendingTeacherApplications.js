import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

let root = null;
let state = {
  applications: [],
  loading: true,
  error: null,
  activeSession: null,
};

async function fetchActiveSession() {
  try {
    const res = await api.get('/api/users/teacher-registration-sessions/active/');
    state.activeSession = res.ok ? res.data : null;
    update();
  } catch (err) {
    state.activeSession = null;
    update();
  }
}

function openSessionModal() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;">
      <h2 style="font-size:1.25rem;font-weight:bold;margin:0;">បង្កើតតំណដាក់ពាក្យសុំថ្មី</h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;"><i data-lucide="x" style="width:20px;height:20px;color:var(--text-secondary)"></i></button>
    </div>

    <form style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ចំណងជើង (ឧ. ការជ្រើសរើសគ្រូប្រចាំឆ្នាំ ២០២៦)</label>
        <input type="text" data-f="title" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃចាប់ផ្តើម</label>
          <input type="date" data-f="start_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ថ្ងៃផុតកំណត់ (ត្រូវផុតកំណត់តំណ)</label>
          <input type="date" data-f="end_date" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db;" required />
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:20px;">
        <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
        <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">បង្កើតតំណ</button>
      </div>
    </form>
  `;

  if (window.lucide) window.lucide.createIcons({ root: wrap });

  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = wrap.querySelector('[data-role="submit"]');
    btn.disabled = true;
    btn.textContent = 'កំពុងបង្កើត...';

    try {
      const res = await api.post('/api/users/teacher-registration-sessions/', {
        title: wrap.querySelector('[data-f="title"]').value,
        start_date: wrap.querySelector('[data-f="start_date"]').value,
        end_date: wrap.querySelector('[data-f="end_date"]').value,
        is_active: true
      });
      if (!res.ok) throw new Error('បរាជ័យក្នុងការបង្កើត');
      showToast('បានបង្កើតតំណដាក់ពាក្យសុំថ្មីជោគជ័យ', 'success');
      handle.close();
      fetchActiveSession();
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'បង្កើតតំណ';
    }
  });

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  const handle = openModal(wrap);
}

async function closeActiveSession() {
  if (!state.activeSession || !window.confirm('តើអ្នកពិតជាចង់បិទតំណដាក់ពាក្យសុំនេះមែនទេ?')) return;
  try {
    const res = await api.patch(`/api/users/teacher-registration-sessions/${state.activeSession.id}/`, {
      is_active: false
    });
    if (!res.ok) throw new Error('បរាជ័យ');
    showToast('បានបិទតំណដាក់ពាក្យសុំជោគជ័យ!', 'success');
    fetchActiveSession();
  } catch (err) {
    showToast('មានបញ្ហាក្នុងការបិទ', 'error');
  }
}

async function fetchApplications() {
  state.loading = true;
  update();
  try {
    const res = await api.get('/api/users/pending-teachers/?status=submitted');
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

async function handleApprove(id) {
  if (!window.confirm('តើបងពិតជាចង់អនុម័តគ្រូនេះមែនទេ? (នឹងបញ្ចូលទៅក្នុងបញ្ជីគ្រូបង្រៀនសកម្ម)')) return;
  try {
    const res = await api.post(`/api/users/pending-teachers/${id}/approve/`);
    if (!res.ok) throw new Error('បរាជ័យ');
    showToast('អនុម័តរួចរាល់', 'success');
    fetchApplications();
  } catch (err) {
    showToast('មានបញ្ហាក្នុងការអនុម័ត', 'error');
  }
}

async function handleReject(id) {
  const reason = window.prompt('មូលហេតុនៃការបដិសេធ:');
  if (reason === null) return;
  if (!reason.trim()) {
    showToast('សូមបញ្ចូលមូលហេតុនៃការបដិសេធ', 'error');
    return;
  }
  try {
    const res = await api.post(`/api/users/pending-teachers/${id}/reject/`, { reason });
    if (!res.ok) throw new Error('បរាជ័យ');
    showToast('បដិសេធរួចរាល់', 'success');
    fetchApplications();
  } catch (err) {
    showToast('មានបញ្ហាក្នុងការបដិសេធ', 'error');
  }
}

function openApplicationViewModal(t) {
  const wrap = document.createElement('div');
  wrap.style.margin = '-28px -32px';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';

  wrap.innerHTML = `
    <div style="padding:24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;border-top-left-radius:20px;border-top-right-radius:20px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:56px;height:72px;border-radius:10px;overflow:hidden;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${t.image_url ? `<img src="${t.image_url}" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user" style="width:26px;height:26px;color:#cbd5e1;"></i>`}
        </div>
        <div>
          <h2 style="font-size:1.3rem;font-weight:800;color:var(--text-primary);margin:0;">${t.last_name || ''} ${t.first_name || ''}</h2>
          <span style="font-size:0.9rem;color:var(--text-secondary);font-weight:600;">កូដតាមដាន: ${t.tracking_code || '---'}</span>
        </div>
      </div>
      <button data-action="close" style="width:40px;height:40px;border-radius:50%;background:#f1f5f9;border:none;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <i data-lucide="x" style="width:20px;height:20px;"></i>
      </button>
    </div>

    <div style="padding:32px;display:flex;flex-direction:column;gap:24px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ឈ្មោះឡាតាំង</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${t.latin_name || '---'}</div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ភេទ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${t.gender || '---'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ឋានៈ</div>
          <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);">${t.monk_status || '---'}</div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">លេខទូរស័ព្ទ</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="phone" style="color:var(--primary);width:18px;height:18px;"></i>${t.phone || '---'}
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">ថ្ងៃអាចចូលបម្រើការ</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="calendar" style="color:#8b5cf6;width:18px;height:18px;"></i>${t.start_date || '---'}
          </div>
        </div>
        <div style="background:#f8fafc;padding:16px;border-radius:16px;border:1px solid var(--border);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">កាលបរិច្ឆេទដាក់ពាក្យ</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:800;color:var(--text-primary);">
            <i data-lucide="clock" style="color:#0ea5e9;width:18px;height:18px;"></i>${t.created_at ? new Date(t.created_at).toLocaleString('en-GB') : '---'}
          </div>
        </div>
      </div>
    </div>

    <div style="padding:24px;border-top:1px solid var(--border);background:#f8fafc;display:flex;gap:12px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;">
      <button data-action="reject" style="flex:1;padding:12px;border-radius:12px;background:none;border:1px solid var(--danger);color:var(--danger);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:500;">
        <i data-lucide="x-circle" style="width:18px;height:18px;"></i> បដិសេធ
      </button>
      <button data-action="approve" class="btn btn-primary" style="flex:1;display:flex;justify-content:center;gap:8px;padding:12px;border-radius:12px;background:#16a34a;border-color:#16a34a;">
        <i data-lucide="check-circle" style="width:18px;height:18px;"></i> អនុម័ត
      </button>
    </div>
  `;

  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="approve"]').addEventListener('click', () => {
    handle.close();
    handleApprove(t.id);
  });
  wrap.querySelector('[data-action="reject"]').addEventListener('click', () => {
    handle.close();
    handleReject(t.id);
  });

  const handle = openModal(wrap);
}

function update() {
  if (!root) return;
  const { applications, loading, error, activeSession } = state;

  root.innerHTML = `
    <div class="animate-fade-in" style="display:flex;flex-direction:column;gap:24px;">

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">ពាក្យសុំធ្វើគ្រូបង្រៀន</h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">ពិនិត្យ និងអនុម័តពាក្យសុំធ្វើគ្រូបង្រៀនថ្មី (${applications.length} ពាក្យសុំ)</p>
        </div>
      </div>

      <!-- Application Link Status -->
      <div style="background:white;padding:20px;border-radius:12px;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h3 style="margin:0 0 8px 0;font-size:1.1rem;display:flex;align-items:center;gap:8px;">
            តំណដាក់ពាក្យសុំធ្វើគ្រូ:
            ${activeSession ?
              `<span style="color:#16a34a;background:#dcfce7;padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:8px;height:8px;background:#16a34a;border-radius:50%;"></span> កំពុងបើកដំណើរការ</span>` :
              `<span style="color:#dc2626;background:#fee2e2;padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;">បិទ</span>`
            }
          </h3>
          ${activeSession ? `
            <p style="margin:0;color:var(--text-secondary);font-size:0.9rem;">
              <strong>ចំណងជើង:</strong> ${activeSession.title} <br>
              <strong>ផុតកំណត់:</strong> ${new Date(activeSession.start_date).toLocaleDateString('en-GB')} ដល់ ${new Date(activeSession.end_date).toLocaleDateString('en-GB')} <br>
              <a href="/apply-teacher" target="_blank" style="color:var(--primary);text-decoration:none;font-weight:500;display:inline-flex;align-items:center;gap:4px;margin-top:6px;">មើលទំព័រដាក់ពាក្យសុំសម្រាប់គ្រូ <i data-lucide="external-link" style="width:14px;height:14px;"></i></a>
            </p>
          ` : `
            <p style="margin:0;color:var(--text-secondary);font-size:0.9rem;">គ្រូមិនអាចចូលទៅដាក់ពាក្យសុំតាមអនឡាញបានទេនៅពេលនេះ។</p>
          `}
        </div>
        <div>
          ${activeSession ? `
            <button class="btn btn-outline" data-action="close-session" style="color:#dc2626;border-color:#dc2626;">បិទតំណ (ផុតកំណត់ឥឡូវនេះ)</button>
          ` : `
            <button class="btn btn-primary" data-action="open-session">បង្កើតតំណថ្មី</button>
          `}
        </div>
      </div>

      ${error ? `<div style="background:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;margin-bottom:20px;">${error}</div>` : ''}

      ${loading ? `<div style="text-align:center;padding:60px;color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យ...</div>` : `
        <div class="glass-panel" style="padding:20px;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>កាលបរិច្ឆេទសុំ</th>
                  <th>រូបថត</th>
                  <th>ឈ្មោះ</th>
                  <th>ភេទ</th>
                  <th>ឋានៈ</th>
                  <th>លេខទូរស័ព្ទ</th>
                  <th style="text-align:right;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                ${applications.length === 0 ? `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">មិនមានពាក្យសុំថ្មីទេ</td></tr>` : applications.map((t) => `
                  <tr class="hover-row">
                    <td>${new Date(t.created_at || new Date()).toLocaleString('en-GB')}</td>
                    <td>
                      <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
                        ${t.image_url ? `<img src="${t.image_url}" style="width:100%;height:100%;object-fit:cover;" />` : `<i data-lucide="user" style="width:20px;height:20px;color:#cbd5e1;"></i>`}
                      </div>
                    </td>
                    <td style="font-weight:600;color:var(--text-primary);">${t.last_name || ''} ${t.first_name || ''}</td>
                    <td>${t.gender || '---'}</td>
                    <td><span style="background:rgba(79, 70, 229, 0.1);color:var(--primary);padding:4px 10px;border-radius:20px;font-size:0.8rem;font-weight:600;">${t.monk_status || '---'}</span></td>
                    <td>${t.phone || '---'}</td>
                    <td style="text-align:right;">
                      <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button data-action="view" data-id="${t.id}" style="color:var(--text-secondary);background:none;border:1px solid var(--border);padding:6px 10px;border-radius:6px;cursor:pointer;" title="មើលលម្អិត"><i data-lucide="eye" style="width:16px;height:16px;"></i></button>
                        <button data-action="approve" data-id="${t.id}" style="background:#16a34a;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:4px;"><i data-lucide="check-circle" style="width:16px;height:16px;"></i> អនុម័ត</button>
                        <button data-action="reject" data-id="${t.id}" style="background:#dc2626;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:4px;"><i data-lucide="x-circle" style="width:16px;height:16px;"></i> បដិសេធ</button>
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

  root.querySelector('[data-action="open-session"]')?.addEventListener('click', openSessionModal);
  root.querySelector('[data-action="close-session"]')?.addEventListener('click', closeActiveSession);

  root.querySelectorAll('button[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = applications.find(x => String(x.id) === btn.dataset.id);
      if (t) openApplicationViewModal(t);
    });
  });

  root.querySelectorAll('button[data-action="approve"]').forEach(btn => {
    btn.addEventListener('click', () => handleApprove(btn.dataset.id));
  });

  root.querySelectorAll('button[data-action="reject"]').forEach(btn => {
    btn.addEventListener('click', () => handleReject(btn.dataset.id));
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { applications: [], loading: true, error: null, activeSession: null };
  update();
  fetchActiveSession();
  fetchApplications();
}

export function destroy() {
  root = null;
}
