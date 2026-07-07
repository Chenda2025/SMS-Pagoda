// Ports the `itemsPerPage`/`page` slicing logic duplicated across pages
// (e.g. Teachers.jsx, AcademicYears.jsx, Students.jsx).

export function paginate(items, page, itemsPerPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * itemsPerPage;
  return {
    page: safePage,
    totalPages,
    items: items.slice(start, start + itemsPerPage),
    rangeStart: items.length === 0 ? 0 : start + 1,
    rangeEnd: Math.min(safePage * itemsPerPage, items.length),
    total: items.length,
  };
}

/** Renders the "Showing X-Y of Z" + prev/next pager markup used across pages. */
export function renderPager({ page, totalPages, rangeStart, rangeEnd, total }, { onPrev, onNext } = {}) {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.justifyContent = 'space-between';
  wrap.style.alignItems = 'center';
  wrap.style.marginTop = '20px';
  wrap.style.flexWrap = 'wrap';
  wrap.style.gap = '12px';
  wrap.innerHTML = `
    <div style="font-size:0.9rem;color:var(--text-secondary);">បង្ហាញ ${rangeStart} ដល់ ${rangeEnd} នៃ ${total}</div>
    <div style="display:flex;gap:8px;align-items:center;">
      <button class="btn" data-pager="prev" ${page === 1 ? 'disabled' : ''} style="background:#f1f5f9;color:var(--text-primary);">‹</button>
      <span style="padding:8px 16px;background:#f1f5f9;border-radius:8px;font-weight:600;">ទំព័រ ${page} / ${totalPages}</span>
      <button class="btn" data-pager="next" ${page === totalPages ? 'disabled' : ''} style="background:#f1f5f9;color:var(--text-primary);">›</button>
    </div>
  `;
  if (onPrev) wrap.querySelector('[data-pager="prev"]').addEventListener('click', onPrev);
  if (onNext) wrap.querySelector('[data-pager="next"]').addEventListener('click', onNext);
  return wrap;
}
