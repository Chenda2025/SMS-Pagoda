// Ports pages/Pagodas.jsx.

import { api } from '../api.js';
import { openModal } from '../components/modal.js';

let root = null;
let state = { pagodas: [], loading: true };
const emptyForm = { name: '', abbot_name: '', village: '', commune: '', district: '', province: '', phone: '' };

async function fetchPagodas() {
  try {
    const res = await api.get('/api/pagodas');
    state = { ...state, pagodas: res.data || [], loading: false };
  } catch (err) {
    console.error(err);
    state = { ...state, loading: false };
  }
  update();
}

function openFormModal(editingPagoda) {
  const formData = editingPagoda ? {
    name: editingPagoda.name || '', abbot_name: editingPagoda.abbot_name || '', village: editingPagoda.village || '',
    commune: editingPagoda.commune || '', district: editingPagoda.district || '', province: editingPagoda.province || '', phone: editingPagoda.phone || ''
  } : { ...emptyForm };

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <h2 style="margin:0 0 24px 0;font-family:Moul;color:var(--primary);">${editingPagoda ? 'កែប្រែវត្ត' : 'បន្ថែមវត្តថ្មី'}</h2>
    <form style="display:flex;flex-direction:column;gap:16px;">
      <input required placeholder="ឈ្មោះវត្ត" data-f="name" class="form-input" style="padding:12px;border-radius:8px;border:1px solid #ccc;" />
      <input required placeholder="ព្រះចៅអធិការ" data-f="abbot_name" class="form-input" style="padding:12px;border-radius:8px;border:1px solid #ccc;" />
      <input placeholder="លេខទូរស័ព្ទ" data-f="phone" class="form-input" style="padding:12px;border-radius:8px;border:1px solid #ccc;" />
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <input placeholder="ភូមិ" data-f="village" class="form-input" style="padding:12px;border-radius:8px;border:1px solid #ccc;" />
        <input placeholder="ឃុំ" data-f="commune" class="form-input" style="padding:12px;border-radius:8px;border:1px solid #ccc;" />
        <input placeholder="ស្រុក" data-f="district" class="form-input" style="padding:12px;border-radius:8px;border:1px solid #ccc;" />
        <input placeholder="ខេត្ត" data-f="province" class="form-input" style="padding:12px;border-radius:8px;border:1px solid #ccc;" />
      </div>
      <div style="display:flex;gap:12px;margin-top:16px;">
        <button type="button" data-action="cancel" class="btn" style="flex:1;padding:12px;border-radius:8px;background:#f1f5f9;color:#334155;border:none;cursor:pointer;">បោះបង់</button>
        <button type="submit" class="btn btn-primary" style="flex:1;padding:12px;border-radius:8px;background:#4f46e5;color:#fff;border:none;cursor:pointer;">រក្សាទុក</button>
      </div>
    </form>
  `;

  Object.entries(formData).forEach(([k, v]) => { wrap.querySelector(`[data-f="${k}"]`).value = v; });

  const handle = openModal(wrap);
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {};
    wrap.querySelectorAll('[data-f]').forEach(input => { payload[input.dataset.f] = input.value; });
    try {
      if (editingPagoda) await api.put(`/api/pagodas/${editingPagoda.id}`, payload);
      else await api.post('/api/pagodas', payload);
      handle.close();
      fetchPagodas();
    } catch (err) {
      console.error(err);
    }
  });
}

async function handleDelete(id) {
  if (!window.confirm('តើអ្នកពិតជាចង់លុបវត្តនេះមែនទេ?')) return;
  try {
    await api.del(`/api/pagodas/${id}`);
    fetchPagodas();
  } catch (err) {
    console.error(err);
  }
}

function update() {
  if (!root) return;
  const { pagodas, loading } = state;
  root.innerHTML = `
    <div class="animate-fade-in" style="padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;">
        <div>
          <h1 style="font-family:Moul;font-size:1.8rem;color:var(--primary);margin:0 0 8px 0;">បញ្ជីរាយនាមវត្ត</h1>
          <p style="color:var(--text-secondary);margin:0;">គ្រប់គ្រងទិន្នន័យវត្ត និងអាសយដ្ឋាន</p>
        </div>
        <button data-action="add" class="btn btn-primary" style="display:flex;gap:8px;align-items:center;padding:12px 24px;border-radius:12px;">
          <i data-lucide="plus" style="width:20px;height:20px"></i> បន្ថែមវត្តថ្មី
        </button>
      </div>
      ${loading ? `<div style="text-align:center;padding:40px;">កំពុងទាញទិន្នន័យ...</div>` : `
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:24px;">
          ${pagodas.map(p => `
            <div data-card="${p.id}" style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
                <div style="display:flex;gap:12px;align-items:center;">
                  <div style="width:48px;height:48px;background:rgba(79,70,229,0.1);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--primary);">
                    <i data-lucide="landmark" style="width:24px;height:24px"></i>
                  </div>
                  <div>
                    <h3 style="margin:0;font-size:1.1rem;font-weight:bold;">${p.name}</h3>
                    <div style="color:var(--text-secondary);font-size:0.85rem;display:flex;align-items:center;gap:4px;margin-top:4px;"><i data-lucide="user" style="width:14px;height:14px"></i> ព្រះចៅអធិការ: ${p.abbot_name}</div>
                  </div>
                </div>
                <div style="display:flex;gap:8px;">
                  <button data-action="edit" data-id="${p.id}" style="background:none;border:none;color:#4f46e5;cursor:pointer;padding:4px;"><i data-lucide="edit-3" style="width:18px;height:18px"></i></button>
                  <button data-action="delete" data-id="${p.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;padding:4px;"><i data-lucide="trash-2" style="width:18px;height:18px"></i></button>
                </div>
              </div>
              <div style="font-size:0.9rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;gap:8px;align-items:center;"><i data-lucide="phone" style="width:16px;height:16px"></i> ${p.phone || 'គ្មានលេខទូរស័ព្ទ'}</div>
                <div style="display:flex;gap:8px;align-items:flex-start;"><i data-lucide="map-pin" style="width:16px;height:16px"></i> ${p.village ? `ភូមិ${p.village}, ឃុំ${p.commune}, ស្រុក${p.district}, ខេត្ត${p.province}` : 'មិនមានអាសយដ្ឋាន'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  root.querySelector('[data-action="add"]').addEventListener('click', () => openFormModal(null));
  root.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => openFormModal(pagodas.find(p => String(p.id) === btn.dataset.id)));
  });
  root.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => handleDelete(btn.dataset.id));
  });
  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { pagodas: [], loading: true };
  update();
  fetchPagodas();
}

export function destroy() { root = null; }
