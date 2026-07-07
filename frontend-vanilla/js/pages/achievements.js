// Ports pages/Achievements.jsx (static showcase, no API calls).

const honors = [
  { title: 'សិស្សឆ្នើមថ្នាក់ជាតិផ្នែកគណិតវិទ្យា', name: 'ម៉ៅ សំណាង', rank: 'លេខ ១ គណិតវិទ្យា', year: '២០២៦', color: 'var(--warning)' },
  { title: 'ពានរង្វាន់ស្ទាត់ជំនាញភាសាអង់គ្លេស', name: 'សួង ស្រីពេជ្រ', rank: 'ជើងឯកនិយាយភាសា', year: '២០២៦', color: 'var(--primary)' },
  { title: 'ជ័យលាភីគូរគំនូរកម្រិតខេត្ត', name: 'លឹម ហេង', rank: 'លេខ ២ ផ្នែកសិល្បៈ', year: '២០២៥', color: 'var(--success)' },
];

export function render(container) {
  container.innerHTML = `
    <div class="animate-fade-in">
      <h1 class="page-title">ជ័យលាភី និងការលើកទឹកចិត្ត</h1>
      <div class="dashboard-grid">
        ${honors.map((item, idx) => `
          <div class="glass-panel stat-card animate-slide-up" style="padding:24px;animation-delay:${idx * 0.1}s;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <span style="font-size:0.75rem;font-weight:600;color:var(--text-secondary);">ឆ្នាំសិក្សា ${item.year}</span>
              <i data-lucide="trophy" style="width:20px;height:20px;color:${item.color}"></i>
            </div>
            <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">${item.title}</h3>
            <p style="font-size:0.9rem;color:var(--text-secondary);">ជ័យលាភី៖ <strong style="color:var(--text-primary);">${item.name}</strong></p>
            <div style="border-top:1px solid var(--border);margin-top:16px;padding-top:12px;display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-muted);">
              <i data-lucide="star" style="width:14px;height:14px;color:var(--warning)"></i>
              ${item.rank}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

export function destroy() {}
