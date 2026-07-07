// Ports pages/Reports.jsx (static stats/chart simulators, no API calls).

const classBars = [
  { label: 'Class 12A', pct: 86, color: 'var(--primary)' },
  { label: 'Class 11B', pct: 72, color: 'var(--success)' },
  { label: 'Class 10A', pct: 79, color: 'var(--warning)' },
  { label: 'Class 9C', pct: 64, color: 'var(--danger)' },
];

const attendanceCols = [
  { month: 'Jan', val: 94 }, { month: 'Feb', val: 95 }, { month: 'Mar', val: 92 }, { month: 'Apr', val: 89 }, { month: 'May', val: 96 },
];

export function render(container) {
  container.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:40px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <h1 class="page-title" style="margin-bottom:0;">School Reports & Analytics / របាយការណ៍សង្ខេប</h1>
        <button class="btn btn-primary"><i data-lucide="download" style="width:18px;height:18px"></i> Export PDF</button>
      </div>

      <div class="dashboard-grid" style="margin-bottom:24px;">
        <div class="glass-panel stat-card">
          <div style="display:flex;justify-content:space-between;align-items:center;color:var(--text-secondary);">
            <span style="font-size:0.875rem;font-weight:600;">Tuition Collection</span>
            <i data-lucide="file-text" style="width:20px;height:20px;color:var(--primary)"></i>
          </div>
          <div class="stat-value">$45,280</div>
          <div style="font-size:0.85rem;color:var(--success);">92% of total collection target reached</div>
        </div>
        <div class="glass-panel stat-card">
          <div style="display:flex;justify-content:space-between;align-items:center;color:var(--text-secondary);">
            <span style="font-size:0.875rem;font-weight:600;">Avg. Exam Scores</span>
            <i data-lucide="bar-chart-2" style="width:20px;height:20px;color:var(--success)"></i>
          </div>
          <div class="stat-value">78.5%</div>
          <div style="font-size:0.85rem;color:var(--success);"><i data-lucide="trending-up" style="width:14px;height:14px;display:inline;margin-right:4px;"></i>+4.2% since Midterm exams</div>
        </div>
      </div>

      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div class="glass-panel" style="flex:1;min-width:340px;padding:24px;">
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">Grade Performance by Class / ពិន្ទុមធ្យមតាមថ្នាក់</h2>
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${classBars.map(bar => `
              <div>
                <div style="display:flex;justify-content:space-between;font-size:0.875rem;margin-bottom:6px;">
                  <span style="font-weight:500;">${bar.label}</span>
                  <span style="font-weight:600;">${bar.pct}% Avg Score</span>
                </div>
                <div style="width:100%;height:8px;background-color:var(--border);border-radius:4px;overflow:hidden;">
                  <div style="width:${bar.pct}%;height:100%;background-color:${bar.color};border-radius:4px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="glass-panel" style="flex:1;min-width:340px;padding:24px;">
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">Attendance Monthly Trends / វត្តមានប្រចាំខែ</h2>
          <div style="display:flex;align-items:flex-end;height:180px;gap:24px;justify-content:space-around;padding-top:20px;">
            ${attendanceCols.map(col => `
              <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
                <div style="font-size:0.75rem;font-weight:600;color:var(--primary);margin-bottom:8px;">${col.val}%</div>
                <div style="width:100%;height:${col.val * 1.2}px;background:linear-gradient(180deg, var(--primary) 0%, var(--primary-light) 100%);border-radius:6px 6px 0 0;box-shadow:0 4px 10px rgba(79,70,229,0.1);"></div>
                <span style="font-size:0.75rem;font-weight:500;color:var(--text-secondary);margin-top:8px;">${col.month}</span>
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
