// Ports pages/Import.jsx (static placeholder UI, no API calls).

export function render(container) {
  container.innerHTML = `
    <div class="animate-fade-in">
      <h1 class="page-title">ការនាំចូលទិន្នន័យ</h1>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div class="glass-panel" style="flex:1.5;min-width:320px;padding:40px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px dashed var(--border);">
          <i data-lucide="upload-cloud" style="width:48px;height:48px;color:var(--primary);margin-bottom:16px;opacity:0.8;"></i>
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">ទាញយក និងទម្លាក់ឯកសារមកទីនេះ</h3>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:24px;">គាំទ្រប្រភេទឯកសារ Excel ឬ CSV (.xls, .xlsx, .csv)</p>
          <button class="btn btn-primary">ជ្រើសរើសឯកសារ</button>
        </div>
        <div class="glass-panel" style="flex:1;min-width:280px;padding:24px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <i data-lucide="file-spreadsheet" style="width:20px;height:20px;color:var(--success)"></i> ទម្រង់ឯកសារគំរូ
          </h3>
          <div style="display:flex;flex-direction:column;gap:12px;font-size:0.85rem;color:var(--text-secondary);">
            <div style="display:flex;gap:8px;align-items:flex-start;">
              <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--success);flex-shrink:0;margin-top:2px;"></i>
              <span>ទាញយកគំរូទិន្នន័យសិស្ស ឬគ្រូសម្រាប់បំពេញព័ត៌មានឱ្យត្រូវទម្រង់។</span>
            </div>
            <div style="display:flex;gap:8px;align-items:flex-start;">
              <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--success);flex-shrink:0;margin-top:2px;"></i>
              <span>ជួរឈរចាំបាច់៖ ឈ្មោះពេញ, អ៊ីមែល, លេខទូរសព្ទ, ថ្នាក់រៀន/មុខវិជ្ជា។</span>
            </div>
          </div>
          <button class="btn" style="width:100%;margin-top:24px;border:1px solid var(--border);justify-content:center;">ទាញយកឯកសារគំរូ (.xlsx)</button>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

export function destroy() {}
