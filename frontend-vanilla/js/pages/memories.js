// Ports pages/Memories.jsx (static album showcase, no API calls).

const albums = [
  { title: 'ទិវាអំណានជាតិ ២០២៦', photos: 18, date: '១១ មីនា ២០២៦', desc: 'សកម្មភាពសិស្សានុសិស្សចូលរួមប្រកួតអានសៀវភៅ និងការតាំងពិព័រណ៍' },
  { title: 'ដំណើរកម្សាន្តសិក្សាទៅកាន់ប្រាសាទបុរាណ', photos: 45, date: '១៥ មករា ២០២៦', desc: 'សិស្សថ្នាក់ទី១២ ទៅសិក្សាស្វែងយល់ប្រវត្តិសាស្ត្រនៅខេត្តសៀមរាប' },
  { title: 'កីឡាសាលាប្រចាំឆ្នាំ ២០២៥', photos: 32, date: '២០ ធ្នូ ២០២៥', desc: 'ការប្រកួតកីឡាបាល់ទាត់ បាល់ទះ និងរត់ប្រណាំង' },
];

export function render(container) {
  container.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:40px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <h1 class="page-title" style="margin-bottom:0;">កម្រងអនុស្សាវរីយ៍សាលា</h1>
        <button class="btn btn-primary"><i data-lucide="camera" style="width:18px;height:18px"></i> បង្កើតអាល់ប៊ុមថ្មី</button>
      </div>
      <div class="dashboard-grid">
        ${albums.map((album, idx) => `
          <div class="glass-panel stat-card animate-slide-up" style="padding:0;overflow:hidden;animation-delay:${idx * 0.1}s;">
            <div style="height:140px;background:linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);display:flex;align-items:center;justify-content:center;color:#fff;position:relative;">
              <i data-lucide="image" style="width:48px;height:48px;opacity:0.5"></i>
              <span style="position:absolute;bottom:12px;right:12px;background-color:rgba(0,0,0,0.5);padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:600;color:#fff;">${album.photos} រូបថត</span>
            </div>
            <div style="padding:20px;">
              <div style="display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text-secondary);margin-bottom:8px;">
                <i data-lucide="calendar" style="width:14px;height:14px"></i>
                <span>${album.date}</span>
              </div>
              <h3 style="font-size:1rem;font-weight:700;margin-bottom:8px;">${album.title}</h3>
              <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.4;">${album.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

export function destroy() {}
