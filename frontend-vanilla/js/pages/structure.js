// Ports pages/Structure.jsx (static org-chart, no API calls).

export function render(container) {
  container.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:40px;">
      <h1 class="page-title">School Organizational Structure / រចនាសម្ព័ន្ធសាលារៀន</h1>
      <div class="glass-panel animate-slide-up" style="padding:40px;display:flex;flex-direction:column;align-items:center;">
        <div style="padding:16px 24px;background:var(--primary);color:#fff;border-radius:12px;font-weight:700;box-shadow:0 4px 15px rgba(79,70,229,0.3);text-align:center;min-width:220px;position:relative;">
          <i data-lucide="award" style="width:20px;height:20px;vertical-align:middle;margin-right:8px;"></i>
          Board of Directors / ក្រុមប្រឹក្សាភិបាល
          <div style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);width:2px;height:20px;background-color:var(--border);"></div>
        </div>
        <div style="margin-top:20px;padding:16px 24px;background:var(--bg-sidebar);color:#fff;border-radius:12px;font-weight:600;text-align:center;min-width:200px;position:relative;">
          <i data-lucide="user" style="width:18px;height:18px;vertical-align:middle;margin-right:8px;color:var(--primary);"></i>
          Principal Office / នាយកសាលា
          <div style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);width:2px;height:20px;background-color:var(--border);"></div>
        </div>
        <div style="width:80%;height:2px;background-color:var(--border);position:relative;margin-top:20px;display:flex;justify-content:space-between;">
          <div style="position:absolute;top:0;left:0;width:2px;height:20px;background-color:var(--border);"></div>
          <div style="position:absolute;top:0;left:50%;width:2px;height:20px;background-color:var(--border);"></div>
          <div style="position:absolute;top:0;right:0;width:2px;height:20px;background-color:var(--border);"></div>
        </div>
        <div style="display:flex;justify-content:space-between;width:90%;margin-top:20px;gap:20px;">
          <div class="glass-panel" style="flex:1;padding:20px;text-align:center;border-radius:12px;border:1px solid var(--border);">
            <h3 style="font-size:1rem;font-weight:700;color:var(--primary);margin-bottom:8px;">Academic / សិក្សាធិការ</h3>
            <p style="font-size:0.85rem;color:var(--text-secondary);">Head: Mr. Sok Mean</p>
            <div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;font-size:0.75rem;color:var(--text-muted);">Teachers, Curriculums, Grades</div>
          </div>
          <div class="glass-panel" style="flex:1;padding:20px;text-align:center;border-radius:12px;border:1px solid var(--border);">
            <h3 style="font-size:1rem;font-weight:700;color:var(--success);margin-bottom:8px;">HR & Administration / រដ្ឋបាល</h3>
            <p style="font-size:0.85rem;color:var(--text-secondary);">Head: Mrs. Jane Doe</p>
            <div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;font-size:0.75rem;color:var(--text-muted);">Staff Records, Shifts, Classrooms</div>
          </div>
          <div class="glass-panel" style="flex:1;padding:20px;text-align:center;border-radius:12px;border:1px solid var(--border);">
            <h3 style="font-size:1rem;font-weight:700;color:var(--warning);margin-bottom:8px;">Finance & Payroll / ហិរញ្ញវត្ថុ</h3>
            <p style="font-size:0.85rem;color:var(--text-secondary);">Head: Mr. Lim Sopheak</p>
            <div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;font-size:0.75rem;color:var(--text-muted);">Tuition, Hourly Payroll, Budgets</div>
          </div>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

export function destroy() {}
