import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';

/**
 * Generates an A4 portrait report container matching the official school standard.
 * @param {string} title - The main title of the report (e.g., "បញ្ជីថ្នាក់រៀនសរុប")
 * @param {HTMLElement} tableElement - The table DOM element to insert into the report
 * @param {string} [subTitle] - Optional subtitle. Defaults to standard school name.
 * @returns {HTMLElement} The complete report element ready for html2canvas
 */
export function buildStandardReportElement(title, tableElement, subTitle, orientation = 'portrait', pageInfo = null) {
  const defaultSubTitle = "នៃសាលាពុទ្ធិកអនុវិទ្យាល័យសម្តេចព្រះសង្ឃរាជ ទេព វង្ស និរោធរង្សី";
  if (subTitle === undefined || subTitle === null) subTitle = defaultSubTitle;

  const reportEl = document.createElement('div');
  // A4 dimensions at 96 DPI
  if (orientation === 'landscape') {
    reportEl.style.width = '1123px';
    reportEl.style.minHeight = '794px';
  } else {
    reportEl.style.width = '794px';
    reportEl.style.minHeight = '1123px';
  }
  reportEl.style.padding = '40px';
  reportEl.style.boxSizing = 'border-box';
  reportEl.style.position = 'relative';
  reportEl.style.backgroundColor = '#ffffff';
  reportEl.style.color = '#000000';
  reportEl.style.fontFamily = "'Battambang', sans-serif";

  // Date Helpers for footer
  const now = new Date();
  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const lunarDateText = typeof toKhmerLunarDate === 'function' ? toKhmerLunarDate(now).lunarDateText : 'ថ្ងៃ ................... ខែ ................... ឆ្នាំ ................... ព.ស ២៥៦...';

  reportEl.innerHTML = `
    
    <!-- Page Info -->
    ${pageInfo ? `<div style="position:absolute;top:20px;right:40px;font-family:'Battambang', sans-serif;font-size:12px;color:#6b7280;">ទំព័រ ${pageInfo}</div>` : ''}

    <!-- Header -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; border: none;">
      <tr>
        <td style="width: 40%; text-align: center; vertical-align: top; border: none;">
          <img src="${window.location.origin}/logo.png" style="width: 70px; height: 70px; margin-bottom: 8px; object-fit: contain;" onerror="this.style.display='none'">
          <div style="font-family: 'Moul', serif; font-size: 14px; color: #1e3a8a; line-height: 1.6;">
            មន្ទីរធម្មការ និងសាសនា រាជធានី<br>
            ភ្នំពេញ<br>
            សាលា ពុ.អ.វិ.ស.ព្រ.ទ.វ.និ
          </div>
        </td>
        <td style="width: 20%; border: none;"></td>
        <td style="width: 40%; text-align: center; vertical-align: top; border: none;">
          <div style="font-family: 'Moul', serif; font-size: 16px; color: #1e3a8a; line-height: 1.6; margin-bottom: 4px;">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div style="font-family: 'Moul', serif; font-size: 16px; color: #1e3a8a; line-height: 1.6;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="margin-top: 4px;"><img src="${window.location.origin}/tacteing.png" style="width: 50px; height: auto;" onerror="this.style.display='none'"></div>
        </td>
      </tr>
    </table>

    <!-- Title -->
    <div style="text-align:center;margin-bottom:15px;">
      <div style="font-family: 'Moul', serif; font-size: 18px; color: #1e3a8a; line-height: 1.8; margin-bottom: 8px;">${title}</div>
      ${subTitle ? `<div style="font-family: 'Moul', serif; font-size: 14px; color: #1e3a8a; line-height: 1.8;">${subTitle}</div>` : ''}
    </div>

    <!-- Table Placeholder -->
    <div id="tg-table-placeholder"></div>
    
    <!-- Footer -->
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px; border: none; font-family: 'Battambang', sans-serif;">
      <tr>
        <td style="width: 50%; border: none;"></td>
        <td style="width: 50%; text-align: center; border: none; vertical-align: top; color: #1e3a8a; white-space: nowrap;">
          <div style="font-family: 'Battambang', sans-serif; font-size: 13px; margin-bottom: 8px;">${lunarDateText}</div>
          <div style="font-family: 'Battambang', sans-serif; font-size: 13px; margin-bottom: 16px;">ភ្នំពេញ, ថ្ងៃទី ${now.getDate()} ខែ ${months[now.getMonth()]} ឆ្នាំ ${now.getFullYear()}</div>
          <div style="font-family: 'Moul', serif; font-size: 14px; margin-bottom: 80px;">គ្រូបន្ទុកថ្នាក់</div>
        </td>
      </tr>
    </table>
  `;

  if (tableElement) {
    // Apply standard table styling
    tableElement.style.width = '100%';
    tableElement.style.borderCollapse = 'collapse';
    tableElement.style.fontSize = '13px';

    // word-break: keep-all stops the browser from wrapping mid-grapheme-cluster
    // inside long unspaced Khmer compound words (e.g. pagoda names) -- breaking
    // a base consonant from its dependent vowel/subscript renders as garbled
    // text in html2canvas's captured output. Cells only wrap at real word gaps.
    tableElement.querySelectorAll('th').forEach(th => {
      th.style.border = '0.5px solid #1e3a8a';
      th.style.padding = '6px 8px';
      if (!th.style.textAlign) th.style.textAlign = 'center';
      th.style.backgroundColor = '#f0f4f8';
      th.style.color = '#1e3a8a';
      th.style.fontWeight = 'bold';
      th.style.wordBreak = 'keep-all';
    });
    tableElement.querySelectorAll('td').forEach(td => {
      td.style.border = '0.5px solid #1e3a8a';
      td.style.padding = '6px 8px';
      if (!td.style.textAlign) td.style.textAlign = 'center';
      td.style.wordBreak = 'keep-all';
    });

    reportEl.querySelector('#tg-table-placeholder').appendChild(tableElement);
  }

  return reportEl;
}
