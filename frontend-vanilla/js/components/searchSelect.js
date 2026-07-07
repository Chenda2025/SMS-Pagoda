// Replaces react-select / react-select/creatable (used in Students, Teachers,
// Classrooms, SubjectSwap, MonitorAttendance, PublicApply). Modeled on the
// hand-rolled classroom multi-select already in Subjects.jsx: a clickable
// display box showing chips + a search input, expanding into a filtered list.

/**
 * @param {object} opts
 * @param {{value:string,label:string}[]} opts.options
 * @param {boolean} opts.multiple
 * @param {boolean} opts.creatable - allow typing a value not in options
 * @param {string[]|string} opts.value - initial selected value(s)
 * @param {function} opts.onChange - called with the new value(s)
 * @param {string} opts.placeholder
 * @returns {{ el: HTMLElement, getValue: function, setOptions: function, setValue: function }}
 */
export function createSearchSelect(opts) {
  const { options: initialOptions, multiple = false, creatable = false, onChange, placeholder = 'ជ្រើសរើស...' } = opts;
  let options = initialOptions || [];
  let selected = multiple ? (Array.isArray(opts.value) ? [...opts.value] : []) : (opts.value || '');
  let search = '';
  let open = false;

  const root = document.createElement('div');
  root.style.position = 'relative';

  const box = document.createElement('div');
  box.className = 'form-input';
  box.style.minHeight = '40px';
  box.style.display = 'flex';
  box.style.flexWrap = 'wrap';
  box.style.gap = '4px';
  box.style.cursor = 'pointer';
  box.style.padding = '6px 10px';

  // Rendered into document.body (not `root`) and positioned with `fixed`
  // coords from the box's bounding rect. Modals use overflow-y:auto plus a
  // transform on the centering wrapper, which clips/hides any dropdown that
  // would otherwise be position:absolute inside that scroll container --
  // appending to body sidesteps that clipping entirely.
  const dropdown = document.createElement('div');
  dropdown.className = 'search-select-dropdown';
  dropdown.style.position = 'fixed';
  dropdown.style.background = '#fff';
  dropdown.style.border = '1px solid var(--border)';
  dropdown.style.borderRadius = '8px';
  dropdown.style.zIndex = '4000';
  dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  dropdown.style.maxHeight = '300px';
  dropdown.style.overflowY = 'auto';
  dropdown.style.padding = '8px';
  dropdown.style.display = 'none';
  dropdown.style.boxSizing = 'border-box';

  function labelFor(val) {
    const found = options.find(o => o.value === val);
    return found ? found.label : val;
  }

  function renderBox() {
    box.innerHTML = '';
    const values = multiple ? selected : (selected ? [selected] : []);
    if (values.length === 0) {
      const ph = document.createElement('span');
      ph.style.color = 'var(--text-muted)';
      ph.style.paddingTop = '4px';
      ph.textContent = placeholder;
      box.appendChild(ph);
    } else {
      values.forEach(v => {
        const chip = document.createElement('span');
        chip.style.background = 'rgba(79,70,229,0.1)';
        chip.style.color = 'var(--primary)';
        chip.style.padding = '4px 8px';
        chip.style.borderRadius = '4px';
        chip.style.fontSize = '0.8rem';
        chip.style.display = 'flex';
        chip.style.alignItems = 'center';
        chip.style.gap = '4px';
        chip.textContent = labelFor(v);
        if (multiple || opts.clearable !== false) {
          const x = document.createElement('span');
          x.textContent = '✕';
          x.style.cursor = 'pointer';
          x.addEventListener('click', (e) => {
            e.stopPropagation();
            if (multiple) selected = selected.filter(s => s !== v);
            else selected = '';
            renderBox();
            if (onChange) onChange(selected);
          });
          chip.appendChild(x);
        }
        box.appendChild(chip);
      });
    }
  }

  function renderDropdown() {
    dropdown.innerHTML = '';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'ស្វែងរក...';
    searchInput.className = 'form-input';
    searchInput.style.marginBottom = '8px';
    searchInput.value = search;
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('input', (e) => { search = e.target.value; renderList(); });
    dropdown.appendChild(searchInput);

    const list = document.createElement('div');
    list.dataset.role = 'list';
    dropdown.appendChild(list);

    if (creatable) {
      const createRow = document.createElement('div');
      createRow.style.display = 'none';
      createRow.dataset.role = 'create-row';
      dropdown.appendChild(createRow);
    }

    renderList();
  }

  function renderList() {
    const list = dropdown.querySelector('[data-role="list"]');
    list.innerHTML = '';
    const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

    filtered.forEach(o => {
      const isSelected = multiple ? selected.includes(o.value) : selected === o.value;
      const row = document.createElement('label');
      row.style.padding = '8px';
      row.style.borderRadius = '4px';
      row.style.cursor = 'pointer';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '10px';
      row.style.background = isSelected ? 'rgba(79,70,229,0.08)' : 'transparent';
      row.innerHTML = `<span>${o.label}</span>`;
      row.addEventListener('click', (e) => {
        e.preventDefault();
        if (multiple) {
          selected = isSelected ? selected.filter(v => v !== o.value) : [...selected, o.value];
        } else {
          selected = o.value;
          close();
        }
        renderBox();
        renderList();
        if (onChange) onChange(selected);
      });
      list.appendChild(row);
    });

    if (creatable && search && !options.some(o => o.label.toLowerCase() === search.toLowerCase())) {
      const createRow = dropdown.querySelector('[data-role="create-row"]');
      createRow.style.display = 'block';
      createRow.style.padding = '8px';
      createRow.style.cursor = 'pointer';
      createRow.style.color = 'var(--primary)';
      createRow.style.fontWeight = '600';
      createRow.textContent = `+ បង្កើត "${search}"`;
      createRow.onclick = () => {
        const newOpt = { value: search, label: search };
        options = [...options, newOpt];
        if (multiple) selected = [...selected, newOpt.value];
        else { selected = newOpt.value; close(); }
        search = '';
        renderBox();
        renderDropdown();
        if (onChange) onChange(selected);
      };
    }
  }

  function reposition() {
    const rect = box.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight || 300;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
    if (openUpward) {
      dropdown.style.top = 'auto';
      dropdown.style.bottom = `${window.innerHeight - rect.top + 4}px`;
    } else {
      dropdown.style.bottom = 'auto';
      dropdown.style.top = `${rect.bottom + 4}px`;
    }
  }

  function onViewportChange() { if (open) reposition(); }

  function open_() {
    open = true;
    document.body.appendChild(dropdown);
    dropdown.style.display = 'block';
    renderDropdown();
    reposition();
    window.addEventListener('scroll', onViewportChange, true);
    window.addEventListener('resize', onViewportChange);
    setTimeout(() => dropdown.querySelector('input')?.focus(), 0);
  }

  function close() {
    open = false;
    search = '';
    dropdown.style.display = 'none';
    dropdown.remove();
    window.removeEventListener('scroll', onViewportChange, true);
    window.removeEventListener('resize', onViewportChange);
  }

  box.addEventListener('click', () => { open ? close() : open_(); });
  // Capture phase: modal.js's panel calls e.stopPropagation() on every click
  // (so clicks inside the modal don't bubble to the backdrop's close handler),
  // which would otherwise stop this listener from ever seeing clicks made
  // elsewhere inside the same modal. Capture fires before that stopPropagation.
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target) && !dropdown.contains(e.target)) close();
  }, true);

  root.appendChild(box);
  renderBox();

  return {
    el: root,
    getValue: () => selected,
    setValue: (v) => { selected = v; renderBox(); },
    setOptions: (opts2) => { options = opts2; if (open) renderList(); },
  };
}
