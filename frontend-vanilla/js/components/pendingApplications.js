// Ports pages/PendingApplications.jsx -- NOT a router page; this is a tab
// embedded inside Students.jsx (`<PendingApplications />` at Students.jsx:1340).
// Exposed as createPendingApplications(container) -> { refresh(), destroy() }
// so the future students.js page can mount/unmount it inside its tab switch.

import { getTgConfig } from '../utils/telegram.js';

const HOST = window.location.hostname;

let root = null;
let state = {
  pendingStudents: [], loading: true, viewStudent: null, rejectTargets: [], rejectReason: '', rejecting: false,
  selectedIds: new Set(), bulkApproving: false,
  currentPage: 1, itemsPerPage: Number(localStorage.getItem('pendingApplications_itemsPerPage')) || 10,
};

async function fetchPending() {
  state = { ...state, loading: true };
  update();
  try {
    const res = await fetch(`http://${HOST}:8000/api/students/pending/?status=submitted`);
    const data = await res.json();
    state = { ...state, pendingStudents: data.filter(s => s.status !== 'approved' && s.status !== 'rejected'), loading: false };
  } catch (err) {
    console.error(err);
    state = { ...state, loading: false };
  }
  update();
}

function toggleSelect(id) {
  const next = new Set(state.selectedIds);
  if (next.has(id)) next.delete(id); else next.add(id);
  state = { ...state, selectedIds: next };
  update();
}

function toggleSelectAll() {
  const allSelected = state.pendingStudents.length > 0 && state.selectedIds.size === state.pendingStudents.length;
  state = { ...state, selectedIds: allSelected ? new Set() : new Set(state.pendingStudents.map(s => s.id)) };
  update();
}

async function handleApprove(id) {
  if (!window.confirm('តើលោកអ្នកពិតជាចង់អនុម័តពាក្យស្នើសុំនេះមែនទេ? ទិន្នន័យនឹងត្រូវបញ្ចូលទៅក្នុងបញ្ជីសិស្សផ្លូវការ។')) return;
  try {
    const res = await fetch(`http://${HOST}:8000/api/students/pending/${id}/approve/`, { method: 'POST' });
    const data = await res.json();
    alert(`អនុម័តជោគជ័យ! កូដសិស្សថ្មីគឺ៖ ${data.student_code}`);
    state = { ...state, viewStudent: null };
    fetchPending();
  } catch (err) {
    console.error(err);
    alert('បរាជ័យក្នុងការអនុម័ត។');
  }
}

async function handleBulkApprove() {
  if (state.selectedIds.size === 0) return;
  if (!window.confirm(`តើលោកអ្នកពិតជាចង់អនុម័តពាក្យស្នើសុំចំនួន ${state.selectedIds.size} មែនទេ? ទិន្នន័យនឹងត្រូវបញ្ចូលទៅក្នុងបញ្ជីសិស្សផ្លូវការ។`)) return;
  state = { ...state, bulkApproving: true };
  update();
  let successCount = 0;
  const failed = [];
  for (const id of state.selectedIds) {
    try {
      await fetch(`http://${HOST}:8000/api/students/pending/${id}/approve/`, { method: 'POST' });
      successCount += 1;
    } catch (err) {
      console.error(err);
      const row = state.pendingStudents.find(s => s.id === id);
      failed.push(row ? `${row.last_name} ${row.first_name}` : id);
    }
  }
  state = { ...state, bulkApproving: false, selectedIds: new Set() };
  fetchPending();
  if (failed.length > 0) alert(`អនុម័តជោគជ័យ ${successCount} ករណី។ បរាជ័យ ${failed.length} ករណី៖ ${failed.join(', ')}`);
  else alert(`អនុម័តជោគជ័យទាំង ${successCount} ករណី!`);
}

async function notifyRejectionOnTelegram(student, reason) {
  const tgConfig = getTgConfig();
  if (!tgConfig.token || !tgConfig.chatId) return;

  const text = [
    '🚫 ពាក្យស្នើសុំត្រូវបានបដិសេធ', '',
    `- កូដតាមដាន: ${student.tracking_code || '---'}`,
    `👤 ឈ្មោះ: ${student.last_name || ''} ${student.first_name || ''}`.trim(),
    `- ឈ្មោះឡាតាំង: ${student.latin_name || '---'}`,
    `- ភេទ: ${student.gender || '---'}`,
    `- ថ្ងៃខែឆ្នាំកំណើត: ${student.date_of_birth || '---'}`,
    `📱 លេខទូរស័ព្ទ: ${student.phone || '---'}`,
    `- ឋានៈព្រះសង្ឃ: ${student.monk_status || '---'}`,
    `- កម្រិតវប្បធម៌: ${student.education_level || '---'}`,
    `- អាសយដ្ឋាន: ${student.address || '---'}`,
    `📅 ថ្ងៃស្នើសុំ: ${student.created_at ? new Date(student.created_at).toLocaleString('en-GB') : '---'}`, '',
    `⚠️ មូលហេតុបដិសេធ (កំហុស):`, reason,
  ].join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: tgConfig.chatId, text }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.description || 'Telegram API error');
  } catch (err) {
    console.error('Failed to notify Telegram about rejection:', err);
  }
}

async function handleReject() {
  if (state.rejectTargets.length === 0) return;
  const reason = state.rejectReason.trim();
  if (!reason) { alert('សូមបញ្ចូលមូលហេតុ/កំហុសសម្រាប់ការបដិសេធ។'); return; }
  state = { ...state, rejecting: true };
  update();
  let successCount = 0;
  const failed = [];
  for (const student of state.rejectTargets) {
    try {
      await fetch(`http://${HOST}:8000/api/students/pending/${student.id}/reject/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
      await notifyRejectionOnTelegram(student, reason);
      successCount += 1;
    } catch (err) {
      console.error(err);
      failed.push(`${student.last_name} ${student.first_name}`);
    }
  }
  state = { ...state, rejecting: false, rejectTargets: [], rejectReason: '', viewStudent: null, selectedIds: new Set() };
  fetchPending();
  if (failed.length > 0) alert(`បដិសេធបានជោគជ័យ ${successCount} ករណី។ បរាជ័យ ${failed.length} ករណី៖ ${failed.join(', ')}`);
}

function fieldRow(...pairs) {
  return `<div class="form-row" style="margin-bottom:20px;">${pairs.map(([label, value]) => `<div><label class="input-label">${label}</label><div>${value ?? '---'}</div></div>`).join('')}</div>`;
}

function renderViewModal() {
  const s = state.viewStudent;
  if (!s) return '';
  const isMonk = s.monk_status === 'សាមណេរ' || s.monk_status === 'ភិក្ខុ';
  return `
    <div data-action="close-view" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;width:100%;max-width:700px;border-radius:16px;padding:24px;max-height:90vh;overflow-y:auto;" data-stop>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #e2e8f0;padding-bottom:15px;">
          <h2 style="font-family:Moul;margin:0;font-size:1.4rem;">ព័ត៌មានលម្អិតរបស់សិស្ស (ពាក្យស្នើសុំ)</h2>
          <button data-action="close-view" style="background:none;border:none;cursor:pointer;color:#64748b;"><i data-lucide="x" style="width:24px;height:24px"></i></button>
        </div>
        <div style="display:flex;justify-content:center;margin-bottom:20px;">
          ${s.image_url
            ? `<img src="${s.image_url}" alt="រូបថត" style="width:130px;height:170px;object-fit:cover;border-radius:10px;border:1px solid #e2e8f0;" />`
            : `<div style="width:130px;height:170px;border-radius:10px;border:1px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;text-align:center;">គ្មានរូបថត</div>`}
        </div>
        ${fieldRow(['កូដតាមដាន', `<span style="font-weight:bold;color:var(--primary);">${s.tracking_code}</span>`], ['គោត្តនាម និងនាម', `<span style="font-weight:bold;">${s.last_name} ${s.first_name}</span>`], ['ឈ្មោះឡាតាំង', s.latin_name])}
        ${fieldRow(['ភេទ', s.gender], ['ថ្ងៃខែឆ្នាំកំណើត', s.date_of_birth], ['លេខទូរស័ព្ទ', s.phone])}
        ${fieldRow(['ឋានៈព្រះសង្ឃ', s.monk_status], ['កម្រិតវប្បធម៌', s.education_level], ['សញ្ជាតិ', s.nationality_name])}
        ${fieldRow(['វត្តកំពុងស្នាក់', s.current_pagoda_name], ['កុដិ', s.kuti_name], ['ថ្ងៃស្នើសុំ', new Date(s.created_at).toLocaleString('en-GB')])}
        ${fieldRow(['វត្តកំណើត', s.birth_pagoda_name], ['ខេត្ត/រាជធានីកំណើត', s.birth_province_name], ['ស្រុក/ខណ្ឌកំណើត', s.birth_district_name])}
        ${fieldRow(['ឃុំ/សង្កាត់កំណើត', s.birth_commune_name], ['ភូមិកំណើត', s.birth_village_name])}
        ${isMonk ? `
          <div style="margin-bottom:20px;padding:16px;background:#f8fafc;border-radius:10px;border:1px dashed #cbd5e1;">
            <h3 style="font-family:Moul;font-size:1rem;margin-top:0;margin-bottom:14px;">ឯកសារព្រះសង្ឃ</h3>
            ${fieldRow(['ប្រភេទឯកសារ', s.monk_document_type], ['ថ្ងៃបួស', s.ordination_date], ['ឈ្មោះព្រះឧបជ្ឈាយ៍', s.preceptor_name])}
            <div class="form-row">
              ${(s.monk_document_type || 'ឆាយា') === 'ឆាយា'
                ? `<div><label class="input-label">ឈ្មោះឆាយា</label><div>${s.chaya_name || '---'}</div></div><div><label class="input-label">លេខឆាយា</label><div>${s.chaya_no || '---'}</div></div>`
                : `<div><label class="input-label">លេខសង្ឃាដិក</label><div>${s.sanghatika_no || '---'}</div></div>`}
            </div>
          </div>
        ` : ''}
        ${s.note ? `<div style="margin-bottom:20px;"><label class="input-label">កំណត់ចំណាំ</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${s.note}</div></div>` : ''}
        <div style="display:flex;justify-content:flex-end;gap:12px;border-top:1px solid #e2e8f0;padding-top:20px;">
          <button class="btn btn-outline" data-action="close-view">បិទ</button>
          <button class="btn btn-primary" style="background:var(--danger)" data-action="reject-from-view"><i data-lucide="x-circle" style="width:18px;height:18px;margin-right:8px;"></i> បដិសេធ</button>
          <button class="btn btn-primary" style="background:var(--success)" data-action="approve-from-view"><i data-lucide="check-circle" style="width:18px;height:18px;margin-right:8px;"></i> អនុម័តបញ្ចូលសិស្សនេះ</button>
        </div>
      </div>
    </div>
  `;
}

function renderRejectModal() {
  if (state.rejectTargets.length === 0) return '';
  const { rejectTargets, rejectReason, rejecting } = state;
  return `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1100;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;width:100%;max-width:480px;border-radius:16px;padding:24px;" data-stop>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h2 style="font-family:Moul;margin:0;font-size:1.2rem;color:var(--danger);">${rejectTargets.length > 1 ? `បដិសេធពាក្យស្នើសុំ (${rejectTargets.length} ករណី)` : 'បដិសេធពាក្យស្នើសុំ'}</h2>
          <button data-action="close-reject" style="background:none;border:none;cursor:pointer;color:#64748b;"><i data-lucide="x" style="width:22px;height:22px"></i></button>
        </div>
        <div style="margin-bottom:14px;font-weight:600;">${rejectTargets.length > 1 ? rejectTargets.map(s => `${s.last_name} ${s.first_name} (${s.tracking_code})`).join(', ') : `${rejectTargets[0].last_name} ${rejectTargets[0].first_name} (${rejectTargets[0].tracking_code})`}</div>
        <label class="input-label">មូលហេតុ / កំហុស (នឹងផ្ញើទៅ Telegram)</label>
        <textarea class="form-input" data-role="reject-reason" rows="4" placeholder="សូមបញ្ជាក់ពីកំហុស ឬ មូលហេតុនៃការបដិសេធ..." style="width:100%;resize:vertical;margin-bottom:20px;">${rejectReason}</textarea>
        <div style="display:flex;justify-content:flex-end;gap:12px;">
          <button class="btn btn-outline" data-action="close-reject" ${rejecting ? 'disabled' : ''}>បោះបង់</button>
          <button class="btn btn-primary" style="background:var(--danger)" data-action="confirm-reject" ${rejecting ? 'disabled' : ''}>${rejecting ? 'កំពុងផ្ញើ...' : 'បញ្ជាក់បដិសេធ'}</button>
        </div>
      </div>
    </div>
  `;
}

function update() {
  if (!root) return;
  const { pendingStudents, loading, selectedIds, currentPage, itemsPerPage, bulkApproving } = state;
  const allSelected = pendingStudents.length > 0 && selectedIds.size === pendingStudents.length;
  const totalPages = Math.max(1, Math.ceil(pendingStudents.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedStudents = pendingStudents.slice(startIndex, startIndex + itemsPerPage);

  root.innerHTML = `
    <div style="margin-top:20px;">
      ${selectedIds.size > 0 ? `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding:10px 16px;background:#eef2ff;border-radius:10px;">
          <span style="font-weight:600;color:var(--primary);">បានជ្រើស ${selectedIds.size} ករណី</span>
          <button class="btn" style="background:var(--success);color:#fff;padding:6px 14px;border-radius:8px;border:none;display:inline-flex;align-items:center;gap:6px;" data-action="bulk-approve" ${bulkApproving ? 'disabled' : ''}>
            <i data-lucide="check-circle" style="width:16px;height:16px"></i> ${bulkApproving ? 'កំពុងអនុម័ត...' : 'អនុម័តច្រើន'}
          </button>
          <button class="btn" style="background:var(--danger);color:#fff;padding:6px 14px;border-radius:8px;border:none;display:inline-flex;align-items:center;gap:6px;" data-action="bulk-reject">
            <i data-lucide="x-circle" style="width:16px;height:16px"></i> បដិសេធច្រើន
          </button>
          <button class="btn btn-outline" style="padding:6px 14px;border-radius:8px;" data-action="clear-selection">លុបការជ្រើស</button>
        </div>
      ` : ''}
      <div class="modern-table-wrap">
        <table class="modern-table" style="width:100%;border-collapse:collapse;text-align:left;">
          <thead style="background-color:#f8fafc;border-bottom:2px solid #e2e8f0;">
            <tr>
              <th style="padding:12px 16px;width:36px;"><input type="checkbox" data-action="select-all" ${allSelected ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;" /></th>
              <th style="padding:12px 16px;color:#64748b;">អត្តលេខតាមដាន</th>
              <th style="padding:12px 16px;color:#64748b;">គោត្តនាម និងនាម</th>
              <th style="padding:12px 16px;color:#64748b;">ភេទ</th>
              <th style="padding:12px 16px;color:#64748b;">លេខទូរស័ព្ទ</th>
              <th style="padding:12px 16px;color:#64748b;">ថ្ងៃស្នើសុំ</th>
              <th style="padding:12px 16px;color:#64748b;text-align:center;">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            ${loading ? `<tr><td colspan="7" style="text-align:center;padding:40px;color:#64748b;">កំពុងទាញយកទិន្នន័យ...</td></tr>`
              : pendingStudents.length === 0 ? `<tr><td colspan="7" style="text-align:center;padding:40px;color:#64748b;">មិនមានពាក្យស្នើសុំថ្មីទេ</td></tr>`
              : paginatedStudents.map(row => `
                <tr class="student-row" style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:12px 16px;"><input type="checkbox" data-select="${row.id}" ${selectedIds.has(row.id) ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;" /></td>
                  <td style="padding:12px 16px;"><span style="background:#e0e7ff;color:var(--primary);padding:4px 8px;border-radius:6px;font-weight:bold;font-size:0.9rem;">${row.tracking_code}</span></td>
                  <td style="padding:12px 16px;font-weight:bold;">${row.last_name} ${row.first_name}</td>
                  <td style="padding:12px 16px;">${row.gender}</td>
                  <td style="padding:12px 16px;">${row.phone}</td>
                  <td style="padding:12px 16px;">${new Date(row.created_at).toLocaleDateString('en-GB')}</td>
                  <td style="padding:12px 16px;text-align:center;">
                    <button class="action-icon-btn" style="color:#0ea5e9;background:#e0f2fe;margin-right:8px;" data-action="view" data-id="${row.id}" title="មើលលម្អិត"><i data-lucide="eye" style="width:18px;height:18px"></i></button>
                    <button class="action-icon-btn" style="color:#10b981;background:#d1fae5;margin-right:8px;" data-action="approve" data-id="${row.id}" title="អនុម័ត"><i data-lucide="check-circle" style="width:18px;height:18px"></i></button>
                    <button class="action-icon-btn" style="color:#ef4444;background:#fee2e2;" data-action="reject-single" data-id="${row.id}" title="បដិសេធ"><i data-lucide="x-circle" style="width:18px;height:18px"></i></button>
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>

        ${pendingStudents.length > 0 ? `
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
            <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary);">
              <span>បង្ហាញ</span>
              <select class="filter-select" data-role="items-per-page" style="padding:6px 12px;border-radius:8px;font-weight:600;">
                <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>១០ ពាក្យ / ទំព័រ</option>
                <option value="15" ${itemsPerPage === 15 ? 'selected' : ''}>១៥ ពាក្យ / ទំព័រ</option>
                <option value="30" ${itemsPerPage === 30 ? 'selected' : ''}>៣០ ពាក្យ / ទំព័រ</option>
              </select>
              <span>ក្នុងមួយទំព័រ</span>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <button data-action="prev-page" ${safePage === 1 ? 'disabled' : ''} class="btn" style="padding:6px 10px;border:1px solid var(--border);background-color:#fff;cursor:${safePage === 1 ? 'not-allowed' : 'pointer'};opacity:${safePage === 1 ? 0.5 : 1};"><i data-lucide="chevron-left" style="width:16px;height:16px"></i></button>
              ${totalPages <= 7
                ? Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `<button data-page="${p}" style="width:32px;height:32px;border-radius:8px;border:1px solid ${safePage === p ? 'var(--primary)' : 'var(--border)'};background-color:${safePage === p ? 'var(--primary)' : '#fff'};color:${safePage === p ? '#fff' : 'var(--text-primary)'};font-weight:600;font-size:0.85rem;cursor:pointer;">${p}</button>`).join('')
                : `<span style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">ទំព័រទី</span><input type="number" min="1" max="${totalPages}" value="${safePage}" data-role="page-input" style="width:50px;height:32px;text-align:center;border-radius:8px;border:1px solid var(--border);outline:none;" /><span style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">នៃ ${totalPages}</span>`}
              <button data-action="next-page" ${safePage === totalPages ? 'disabled' : ''} class="btn" style="padding:6px 10px;border:1px solid var(--border);background-color:#fff;cursor:${safePage === totalPages ? 'not-allowed' : 'pointer'};opacity:${safePage === totalPages ? 0.5 : 1};"><i data-lucide="chevron-right" style="width:16px;height:16px"></i></button>
            </div>
          </div>
        ` : ''}
      </div>
      ${renderViewModal()}
      ${renderRejectModal()}
    </div>
  `;

  root.querySelector('[data-action="select-all"]').addEventListener('change', toggleSelectAll);
  root.querySelectorAll('[data-select]').forEach(cb => cb.addEventListener('change', () => toggleSelect(Number(cb.dataset.select))));
  const bulkApproveBtn = root.querySelector('[data-action="bulk-approve"]');
  if (bulkApproveBtn) bulkApproveBtn.addEventListener('click', handleBulkApprove);
  const bulkRejectBtn = root.querySelector('[data-action="bulk-reject"]');
  if (bulkRejectBtn) bulkRejectBtn.addEventListener('click', () => { state = { ...state, rejectTargets: pendingStudents.filter(s => selectedIds.has(s.id)), rejectReason: '' }; update(); });
  const clearSelBtn = root.querySelector('[data-action="clear-selection"]');
  if (clearSelBtn) clearSelBtn.addEventListener('click', () => { state = { ...state, selectedIds: new Set() }; update(); });

  root.querySelectorAll('[data-action="view"]').forEach(btn => btn.addEventListener('click', () => { state = { ...state, viewStudent: pendingStudents.find(s => s.id === Number(btn.dataset.id)) }; update(); }));
  root.querySelectorAll('[data-action="approve"]').forEach(btn => btn.addEventListener('click', () => handleApprove(Number(btn.dataset.id))));
  root.querySelectorAll('[data-action="reject-single"]').forEach(btn => btn.addEventListener('click', () => { state = { ...state, rejectTargets: [pendingStudents.find(s => s.id === Number(btn.dataset.id))], rejectReason: '' }; update(); }));

  root.querySelectorAll('[data-action="close-view"]').forEach(el => el.addEventListener('click', (e) => { if (e.target.closest('[data-stop]') && e.target !== el) return; state = { ...state, viewStudent: null }; update(); }));
  const approveFromView = root.querySelector('[data-action="approve-from-view"]');
  if (approveFromView) approveFromView.addEventListener('click', () => handleApprove(state.viewStudent.id));
  const rejectFromView = root.querySelector('[data-action="reject-from-view"]');
  if (rejectFromView) rejectFromView.addEventListener('click', () => { state = { ...state, rejectTargets: [state.viewStudent], rejectReason: '' }; update(); });

  root.querySelectorAll('[data-action="close-reject"]').forEach(el => el.addEventListener('click', () => { state = { ...state, rejectTargets: [], rejectReason: '' }; update(); }));
  const rejectTextarea = root.querySelector('[data-role="reject-reason"]');
  if (rejectTextarea) { rejectTextarea.addEventListener('input', (e) => { state.rejectReason = e.target.value; }); rejectTextarea.focus(); }
  const confirmRejectBtn = root.querySelector('[data-action="confirm-reject"]');
  if (confirmRejectBtn) confirmRejectBtn.addEventListener('click', handleReject);

  const itemsPerPageSel = root.querySelector('[data-role="items-per-page"]');
  if (itemsPerPageSel) itemsPerPageSel.addEventListener('change', (e) => {
    const val = Number(e.target.value);
    localStorage.setItem('pendingApplications_itemsPerPage', String(val));
    state = { ...state, itemsPerPage: val, currentPage: 1 };
    update();
  });
  const prevBtn = root.querySelector('[data-action="prev-page"]');
  if (prevBtn) prevBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.max(1, safePage - 1) }; update(); });
  const nextBtn = root.querySelector('[data-action="next-page"]');
  if (nextBtn) nextBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.min(totalPages, safePage + 1) }; update(); });
  root.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => { state = { ...state, currentPage: Number(btn.dataset.page) }; update(); }));
  const pageInput = root.querySelector('[data-role="page-input"]');
  if (pageInput) pageInput.addEventListener('change', (e) => { state = { ...state, currentPage: Math.min(Math.max(1, parseInt(e.target.value, 10) || 1), totalPages) }; update(); });

  if (window.lucide) window.lucide.createIcons();
}

/** Mounts the pending-applications tab into `container`. Returns { refresh, destroy }. */
export function createPendingApplications(container) {
  root = container;
  state = { ...state, currentPage: 1 };
  update();
  fetchPending();
  return { refresh: fetchPending, destroy: () => { root = null; } };
}
