// Ports pages/Notifications.jsx (static notice list, no API calls).

const notices = [
  { title: 'សេចក្តីជូនដំណឹងស្តីពីការប្រឡងឆមាស', desc: 'សូមសិស្សានុសិស្សទាំងអស់ត្រៀមលក្ខណៈឱ្យបានរួចរាល់សម្រាប់ការប្រឡងឆមាសទី២ ចាប់ពីថ្ងៃស្អែកនេះតទៅ។', date: '២ ម៉ោងមុន', type: 'info' },
  { title: 'ការអាប់ដេតប្រព័ន្ធគ្រប់គ្រងប្រាក់ម៉ោង', desc: 'ប្រព័ន្ធគណនាប្រាក់ម៉ោងត្រូវបានកែលម្អដើម្បីឱ្យមានភាពត្រឹមត្រូវ និងលឿនជាងមុន។', date: '១ ថ្ងៃមុន', type: 'success' },
  { title: 'ការរំលឹក៖ បញ្ជូនកិច្ចតែងការបង្រៀន', desc: 'សូមលោកគ្រូ-អ្នកគ្រូទាំងអស់បញ្ជូនកិច្ចតែងការបង្រៀនប្រចាំសប្តាហ៍ឱ្យបានមុនថ្ងៃសៅរ៍។', date: '២ ថ្ងៃមុន', type: 'warning' },
];

const ICONS = { warning: 'alert-triangle', success: 'check-circle', info: 'info' };

export function render(container) {
  container.innerHTML = `
    <div class="animate-fade-in">
      <h1 class="page-title">ប្រព័ន្ធជូនដំណឹង</h1>
      <div class="glass-panel animate-slide-up" style="padding:24px;">
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${notices.map(note => `
            <div style="display:flex;gap:16px;padding:16px;border-radius:12px;border:1px solid var(--border);
              background-color:${note.type === 'warning' ? 'rgba(245,158,11,0.05)' : note.type === 'success' ? 'rgba(16,185,129,0.05)' : 'rgba(79,70,229,0.05)'};">
              <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;
                background-color:${note.type === 'warning' ? 'rgba(245,158,11,0.1)' : note.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)'};
                color:${note.type === 'warning' ? 'var(--warning)' : note.type === 'success' ? 'var(--success)' : 'var(--primary)'};">
                <i data-lucide="${ICONS[note.type]}" style="width:18px;height:18px"></i>
              </div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <h4 style="font-size:0.95rem;font-weight:700;">${note.title}</h4>
                  <span style="font-size:0.75rem;color:var(--text-secondary);">${note.date}</span>
                </div>
                <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.4;">${note.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

export function destroy() {}
