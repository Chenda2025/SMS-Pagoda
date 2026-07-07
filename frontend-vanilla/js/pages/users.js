// Ports pages/Users.jsx.

import { api } from '../api.js';
import { openModal } from '../components/modal.js';

let root = null;
let state = { users: [], loading: true, error: null };

async function fetchUsers() {
  try {
    const res = await api.get('/api/users/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    state = { ...state, users: res.data || [], loading: false };
  } catch (err) {
    state = { ...state, error: err.message, loading: false };
  }
  update();
}

function getRoleDisplay(role) {
  switch (role) {
    case 'admin': return 'រដ្ឋបាល (Admin)';
    case 'monitor': return 'មេថ្នាក់ (Monitor)';
    case 'teacher': return 'គ្រូបង្រៀន (Teacher)';
    case 'principal': return 'នាយកសាលា (Principal)';
    default: return role;
  }
}

function openUserModal(editingUser) {
  const formData = editingUser
    ? { username: editingUser.username, password: '', role: editingUser.role, related_id: editingUser.related_id || '' }
    : { username: '', password: '', role: 'admin', related_id: '' };

  const wrap = document.createElement('div');

  function renderForm() {
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="font-size:1.25rem;font-weight:bold;">${editingUser ? 'កែប្រែគណនី' : 'បន្ថែមគណនីថ្មី'}</h2>
        <button data-action="close" style="background:none;border:none;cursor:pointer;"><i data-lucide="x" style="width:24px;height:24px;color:var(--text-secondary)"></i></button>
      </div>
      <div data-role="form-error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;"></div>
      <form style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">ឈ្មោះគណនី (Username)</label>
          <input type="text" data-f="username" ${editingUser ? 'disabled' : ''} required
            style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #d1d5db;background-color:${editingUser ? '#f3f4f6' : 'white'};font-family:inherit;" />
          ${editingUser ? `<small style="color:var(--text-secondary);">មិនអាចប្តូរឈ្មោះគណនីបានទេ</small>` : ''}
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">សិទ្ធិអនុញ្ញាត (Role)</label>
          <select data-f="role" required style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #d1d5db;font-family:inherit;background-color:white;">
            <option value="admin">រដ្ឋបាល (Admin)</option>
            <option value="monitor">មេថ្នាក់ (Monitor)</option>
            <option value="teacher">គ្រូបង្រៀន (Teacher)</option>
            <option value="principal">នាយកសាលា (Principal)</option>
          </select>
        </div>
        <div data-role="related-id-wrap" style="display:none;">
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">លេខសម្គាល់បុគ្គលិក/សិស្ស (Related ID)</label>
          <input type="number" data-f="related_id" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #d1d5db;font-family:inherit;" />
          <small data-role="related-id-hint" style="color:var(--text-secondary);"></small>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:500;font-size:0.875rem;">លេខសម្ងាត់ (Password) ${editingUser ? '(ទុកចំហរបើមិនចង់ប្តូរ)' : ''}</label>
          <input type="password" data-f="password" ${editingUser ? '' : 'required'}
            placeholder="${editingUser ? 'បញ្ចូលលេខសម្ងាត់ថ្មីបើចង់ប្តូរ...' : 'បញ្ចូលលេខសម្ងាត់...'}"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #d1d5db;font-family:inherit;" />
        </div>
        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:16px;">
          <button type="button" data-action="cancel" style="padding:10px 16px;background-color:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:500;">បោះបង់</button>
          <button type="submit" data-role="submit" style="padding:10px 16px;background-color:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:500;">រក្សាទុក</button>
        </div>
      </form>
    `;
    wrap.querySelector('[data-f="username"]').value = formData.username;
    wrap.querySelector('[data-f="role"]').value = formData.role;
    wrap.querySelector('[data-f="related_id"]').value = formData.related_id;
    wrap.querySelector('[data-f="password"]').value = formData.password;
    updateRelatedIdVisibility();

    wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
    wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
    wrap.querySelector('[data-f="username"]').addEventListener('input', (e) => { formData.username = e.target.value; });
    wrap.querySelector('[data-f="role"]').addEventListener('change', (e) => { formData.role = e.target.value; updateRelatedIdVisibility(); });
    wrap.querySelector('[data-f="related_id"]').addEventListener('input', (e) => { formData.related_id = e.target.value; });
    wrap.querySelector('[data-f="password"]').addEventListener('input', (e) => { formData.password = e.target.value; });
    wrap.querySelector('form').addEventListener('submit', handleSubmit);
    if (window.lucide) window.lucide.createIcons();
  }

  function updateRelatedIdVisibility() {
    const showRelated = formData.role === 'teacher' || formData.role === 'monitor';
    const relWrap = wrap.querySelector('[data-role="related-id-wrap"]');
    relWrap.style.display = showRelated ? 'block' : 'none';
    if (showRelated) {
      wrap.querySelector('[data-f="related_id"]').placeholder = formData.role === 'teacher' ? 'បញ្ចូលលេខ ID គ្រូ...' : 'បញ្ចូលលេខ ID សិស្ស...';
      wrap.querySelector('[data-role="related-id-hint"]').textContent = `ត្រូវប្រាកដថាលេខ ID នេះត្រឹមត្រូវតាមតារាង ${formData.role === 'teacher' ? 'គ្រូ' : 'សិស្ស'}។`;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errorBox = wrap.querySelector('[data-role="form-error"]');
    errorBox.style.display = 'none';
    const submitBtn = wrap.querySelector('[data-role="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'កំពុងរក្សាទុក...';
    try {
      if (editingUser) {
        const res = await api.put(`/api/users/users/${editingUser.id}`, { role: formData.role, password: formData.password, related_id: formData.related_id || null });
        if (!res.ok) throw new Error(res.data?.error || 'Failed to update user');
      } else {
        const res = await api.post('/api/users/users', formData);
        if (!res.ok) throw new Error(res.data?.error || 'Failed to create user');
      }
      handle.close();
      fetchUsers();
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'រក្សាទុក';
    }
  }

  const handle = openModal(wrap);
  renderForm();
}

async function handleDelete(id) {
  if (!window.confirm('តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ?')) return;
  try {
    const res = await api.del(`/api/users/users/${id}`);
    if (!res.ok) throw new Error('Failed to delete user');
    fetchUsers();
  } catch (err) {
    alert(err.message);
  }
}

function update() {
  if (!root) return;
  const { users, loading, error } = state;
  root.innerHTML = `
    <div class="animate-fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <h1 class="page-title" style="margin-bottom:0;">គ្រប់គ្រងគណនី & សិទ្ធិ</h1>
        <button class="btn btn-primary" data-action="add"><i data-lucide="plus" style="width:18px;height:18px"></i> បន្ថែមគណនីថ្មី</button>
      </div>
      ${error ? `<div style="background-color:#fee2e2;color:#b91c1c;padding:16px;border-radius:8px;margin-bottom:24px;">${error}</div>` : ''}
      <div class="glass-panel animate-slide-up" style="padding:24px;">
        ${loading ? `<div style="text-align:center;padding:40px;">កំពុងទាញយកទិន្នន័យ...</div>` : `
          <div class="table-container">
            <table>
              <thead><tr><th>លេខរៀង (ID)</th><th>ឈ្មោះគណនី (Username)</th><th>តួនាទី (Role / Permission)</th><th>កាលបរិច្ឆេទបង្កើត</th><th>សកម្មភាព</th></tr></thead>
              <tbody>
                ${users.length === 0 ? `<tr><td colspan="5" style="text-align:center;padding:32px;">មិនមានទិន្នន័យគណនី</td></tr>` : users.map(u => `
                  <tr>
                    <td>${u.id}</td>
                    <td><div style="display:flex;align-items:center;gap:12px;"><div class="avatar" style="width:36px;height:36px;font-size:0.85rem;">${u.username.substring(0, 2).toUpperCase()}</div><div style="font-weight:600;">${u.username}</div></div></td>
                    <td><div style="display:flex;align-items:center;gap:6px;font-weight:500;"><i data-lucide="shield" style="width:14px;height:14px;color:var(--primary)"></i> ${getRoleDisplay(u.role)}</div></td>
                    <td>${new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style="display:flex;gap:8px;">
                        <button data-action="edit" data-id="${u.id}" style="color:var(--primary);font-weight:600;background:none;border:none;cursor:pointer;"><i data-lucide="edit" style="width:18px;height:18px"></i></button>
                        <button data-action="delete" data-id="${u.id}" style="color:var(--danger);font-weight:600;background:none;border:none;cursor:pointer;"><i data-lucide="trash-2" style="width:18px;height:18px"></i></button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;
  root.querySelector('[data-action="add"]').addEventListener('click', () => openUserModal(null));
  root.querySelectorAll('[data-action="edit"]').forEach(btn => btn.addEventListener('click', () => openUserModal(users.find(u => String(u.id) === btn.dataset.id))));
  root.querySelectorAll('[data-action="delete"]').forEach(btn => btn.addEventListener('click', () => handleDelete(btn.dataset.id)));
  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { users: [], loading: true, error: null };
  update();
  fetchUsers();
}

export function destroy() { root = null; }
