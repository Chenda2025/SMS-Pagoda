// Ports pages/DatabaseTest.jsx.

let root = null;
let state = { data: null, loading: false, error: null };

async function testConnection() {
  state = { ...state, loading: true, error: null };
  update();
  try {
    const response = await fetch('/test');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    state = { ...state, data: result, loading: false };
  } catch (e) {
    state = { ...state, error: e.message, loading: false };
  }
  update();
}

function update() {
  if (!root) return;
  const { data, loading, error } = state;
  root.innerHTML = `
    <div class="animate-fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <h1 class="page-title" style="margin-bottom:0;">សាកល្បង Database / Database Test</h1>
        <button data-action="refresh" class="btn btn-primary" ${loading ? 'disabled' : ''}>
          <i data-lucide="refresh-cw" class="${loading ? 'animate-spin' : ''}" style="width:18px;height:18px"></i>
          ${loading ? 'កំពុងភ្ជាប់...' : 'ភ្ជាប់ឡើងវិញ (Refresh)'}
        </button>
      </div>
      <div class="glass-panel animate-slide-up" style="padding:32px;text-align:center;">
        <div style="margin-bottom:24px;">
          ${loading ? `
            <div style="color:var(--primary);">
              <i data-lucide="refresh-cw" class="animate-spin" style="width:48px;height:48px;margin:0 auto;margin-bottom:16px;display:block;"></i>
              <h2 style="font-size:1.5rem;font-weight:600;">កំពុងតភ្ជាប់ទៅកាន់ PostgreSQL...</h2>
            </div>
          ` : error ? `
            <div style="color:var(--danger);">
              <i data-lucide="x-circle" style="width:48px;height:48px;margin:0 auto;margin-bottom:16px;display:block;"></i>
              <h2 style="font-size:1.5rem;font-weight:600;">បរាជ័យក្នុងការតភ្ជាប់ (Connection Failed)</h2>
              <p style="margin-top:8px;color:var(--text-secondary);">Error: ${error}</p>
            </div>
          ` : data ? `
            <div style="color:#059669;">
              <i data-lucide="check-circle" style="width:48px;height:48px;margin:0 auto;margin-bottom:16px;display:block;"></i>
              <h2 style="font-size:1.5rem;font-weight:600;">តភ្ជាប់ជោគជ័យ! (Connection Successful)</h2>
              <p style="margin-top:8px;color:var(--text-secondary);">បម្រើទិន្នន័យពី PostgreSQL Database</p>
            </div>
          ` : ''}
        </div>
        ${data ? `
          <div style="text-align:left;margin-top:32px;border-top:1px solid var(--border);padding-top:24px;">
            <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
              <i data-lucide="database" style="width:18px;height:18px"></i> ទិន្នន័យពី Table 'test_table'
            </h3>
            <div class="table-container">
              <table>
                <thead><tr><th>ID</th><th>Message</th><th>Created At</th></tr></thead>
                <tbody>
                  ${data.length === 0
                    ? `<tr><td colspan="3" style="text-align:center;padding:24px;">គ្មានទិន្នន័យ (No data found)</td></tr>`
                    : data.map(row => `<tr><td>${row.id}</td><td style="font-weight:500;color:var(--primary);">${row.message}</td><td>${new Date(row.created_at).toLocaleString()}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  root.querySelector('[data-action="refresh"]').addEventListener('click', testConnection);
  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  testConnection();
}

export function destroy() { root = null; }
