// Ports pages/Calendar.jsx (static month-grid simulator, no API calls).

const events = [
  { title: 'ប្រឡងឆមាសទី២', date: '២៥ ឧសភា ២០២៦', time: '០៨:០០', type: 'academic' },
  { title: 'ពិធីចែកវិញ្ញាបនបត្រសិស្សឆ្នើម', date: '០២ មិថុនា ២០២៦', time: '០៩:០០', type: 'ceremony' },
  { title: 'វិស្សមកាលធំ (ការឈប់សម្រាកប្រចាំឆ្នាំ)', date: '១៥ កក្កដា ២០២៦', time: 'ពេញមួយថ្ងៃ', type: 'holiday' },
];

export function render(container) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  container.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:40px;">
      <h1 class="page-title">ប្រតិទិនសាលា</h1>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div class="glass-panel" style="flex:1.5;min-width:320px;padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="font-size:1.1rem;font-weight:700;">ឧសភា ២០២៦</h3>
            <div style="display:flex;gap:8px;">
              <button class="btn" style="padding:6px;border:1px solid var(--border);"><i data-lucide="chevron-left" style="width:16px;height:16px"></i></button>
              <button class="btn" style="padding:6px;border:1px solid var(--border);"><i data-lucide="chevron-right" style="width:16px;height:16px"></i></button>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;text-align:center;font-weight:600;font-size:0.85rem;">
            ${['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'].map((d, i) => `<div style="color:${i === 0 ? 'var(--danger)' : 'var(--text-secondary)'};">${d}</div>`).join('')}
            ${days.map(day => {
              const isEvent = day === 25;
              return `<div style="padding:12px 0;border-radius:8px;background-color:${isEvent ? 'var(--primary-light)' : 'transparent'};color:${isEvent ? 'var(--primary)' : 'inherit'};font-weight:${isEvent ? 700 : 500};border:1px solid ${isEvent ? 'var(--primary)' : 'transparent'};cursor:pointer;">${day}</div>`;
            }).join('')}
          </div>
        </div>
        <div class="glass-panel" style="flex:1;min-width:280px;padding:24px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">ព្រឹត្តិការណ៍ខាងមុខ</h3>
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${events.map((ev, i) => `
              <div style="display:flex;gap:12px;padding-bottom:16px;border-bottom:${i < events.length - 1 ? '1px solid var(--border)' : 'none'};">
                <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;
                  background-color:${ev.type === 'academic' ? 'var(--primary-light)' : ev.type === 'holiday' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'};
                  color:${ev.type === 'academic' ? 'var(--primary)' : ev.type === 'holiday' ? 'var(--danger)' : 'var(--success)'};">
                  <i data-lucide="calendar" style="width:18px;height:18px"></i>
                </div>
                <div>
                  <h4 style="font-size:0.9rem;font-weight:700;">${ev.title}</h4>
                  <div style="display:flex;gap:12px;font-size:0.75rem;color:var(--text-secondary);margin-top:4px;">
                    <span>${ev.date}</span>
                    <span style="display:flex;align-items:center;gap:2px;"><i data-lucide="clock" style="width:12px;height:12px"></i> ${ev.time}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

export function destroy() {}
