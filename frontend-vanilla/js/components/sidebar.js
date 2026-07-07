// Sidebar with collapsible dropdown menu groups.
// Each section can be expanded/collapsed. State is persisted in localStorage.

const STORAGE_KEY = 'sidebar_collapsed_groups';

const NAV_GROUPS = [
  {
    id: 'overview',
    title: null,
    icon: null,
    items: [
      { to: '/', icon: 'layout-dashboard', label: 'ផ្ទាំងគ្រប់គ្រង', end: true },
      { to: '/activity-logs', icon: 'activity', label: 'ប្រវត្តិសកម្មភាព' },
    ]
  },
  {
    id: 'students',
    title: 'សិស្ស',
    icon: 'users',
    color: '#6366f1',
    items: [
      { to: '/students', icon: 'user-round', label: 'ព័ត៌មានសិស្ស' },
      { to: '/student-list', icon: 'list', label: 'បញ្ជីសិស្ស' },
      { to: '/enrollments', icon: 'user-check', label: 'បញ្ចូលសិស្សទៅថ្នាក់' },
      { to: '/pending-applications', icon: 'user-plus', label: 'ពាក្យសុំចូលរៀន' },
    ]
  },
  {
    id: 'teachers',
    title: 'គ្រូបង្រៀន',
    icon: 'graduation-cap',
    color: '#8b5cf6',
    items: [
      { to: '/teachers', icon: 'graduation-cap', label: 'ព័ត៌មានគ្រូ' },
      { to: '/pending-teacher-applications', icon: 'user-plus', label: 'ពាក្យសុំធ្វើគ្រូបង្រៀន' },
    ]
  },
  {
    id: 'curriculum',
    title: 'កម្មវិធីសិក្សា',
    icon: 'book-open',
    color: '#3b82f6',
    items: [
      { to: '/subjects', icon: 'book-open', label: 'មុខវិជ្ជា' },
      { to: '/class-subjects', icon: 'layers', label: 'ការកំណត់មុខវិជ្ជា' },
      { to: '/subject-swap', icon: 'arrow-left-right', label: 'ប្តូរមុខវិជ្ជា' },
      { to: '/classrooms', icon: 'school', label: 'ថ្នាក់រៀន' },
      { to: '/schedule', icon: 'clock', label: 'កាលវិភាគសិក្សា' },
    ]
  },
  {
    id: 'attendance-grades',
    title: 'វត្តមាន និងពិន្ទុ',
    icon: 'calendar-check',
    color: '#10b981',
    items: [
      { to: '/attendance', icon: 'calendar-check', label: 'វត្តមានសិស្ស' },
      { to: '/attendance-report', icon: 'bar-chart-3', label: 'របាយការណ៍វត្តមាន' },
      { to: '/grades', icon: 'award', label: 'បញ្ចូលពិន្ទុ និងលទ្ធផល' },
      { to: '/reports', icon: 'file-text', label: 'លទ្ធផលប្រឡង' },
      { to: '/achievements', icon: 'trophy', label: 'ជ័យលាភី' },
    ]
  },
  {
    id: 'admin-resources',
    title: 'រដ្ឋបាល និងធនធាន',
    icon: 'building-2',
    color: '#f59e0b',
    items: [
      { to: '/structure', icon: 'network', label: 'រចនាសម្ព័ន្ធសាលា' },
      { to: '/pagodas', icon: 'landmark', label: 'វត្ត' },
      { to: '/academic-years', icon: 'calendar-range', label: 'ឆ្នាំសិក្សា' },
      { to: '/lesson-plans', icon: 'file-text', label: 'កិច្ចតែងការបង្រៀន' },
      { to: '/calendar', icon: 'calendar', label: 'ប្រតិទិនសាលា' },
      { to: '/memories', icon: 'camera', label: 'កម្រងអនុស្សាវរីយ៍' },
      { to: '/notifications', icon: 'bell', label: 'ការជូនដំណឹង' },
      { to: '/users', icon: 'user', label: 'អ្នកប្រើប្រាស់' },
    ]
  },
  {
    id: 'finance-data',
    title: 'គណនេយ្យ និងទិន្នន័យ',
    icon: 'wallet',
    color: '#ef4444',
    items: [
      { to: '/payroll', icon: 'banknote', label: 'ប្រាក់ម៉ោង' },
      { to: '/payroll-report', icon: 'file-bar-chart', label: 'របាយការណ៍ប្រាក់ម៉ោង' },
      { to: '/import', icon: 'upload-cloud', label: 'ការនាំចូលទិន្នន័យ' },
    ]
  }
];

function loadCollapsedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCollapsedState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createSidebar({ currentPath, onClose }) {
  const el = document.createElement('div');
  el.className = 'sidebar';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.height = '100%';

  const collapsed = loadCollapsedState();

  // Auto-expand group with the active route
  NAV_GROUPS.forEach(group => {
    if (group.title && group.items.some(item => {
      return item.end ? currentPath === item.to : currentPath === item.to || currentPath.startsWith(item.to + '/');
    })) {
      collapsed[group.id] = false;
    }
  });

  function injectStyles() {
    if (document.getElementById('sidebar-dropdown-styles')) return;
    const style = document.createElement('style');
    style.id = 'sidebar-dropdown-styles';
    style.textContent = `
      /* ====== SIDEBAR SCROLLBAR ====== */
      .sidebar-nav::-webkit-scrollbar { width: 4px; }
      .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
      .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      .sidebar-nav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

      /* ====== GROUP HEADER (dropdown toggle) ====== */
      .nav-group-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        margin: 2px 0;
        border-radius: 10px;
        cursor: pointer;
        color: rgba(255,255,255,0.5);
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.2px;
        transition: all 0.2s ease;
        user-select: none;
      }
      .nav-group-header:hover {
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.8);
      }
      .nav-group-header.has-active {
        color: rgba(255,255,255,0.95);
      }

      /* Group icon circle */
      .nav-group-header .group-icon-wrap {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s ease;
      }
      .nav-group-header .group-icon-wrap svg,
      .nav-group-header .group-icon-wrap i {
        width: 15px;
        height: 15px;
      }
      .nav-group-header:hover .group-icon-wrap {
        transform: scale(1.05);
      }

      .nav-group-header .group-label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.3;
        font-family: 'Moul', sans-serif;
        font-weight: 400;
        font-size: 0.75rem;
      }

      /* Chevron */
      .nav-group-header .group-chevron {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0.35;
      }
      .nav-group-header:hover .group-chevron { opacity: 0.7; }
      .nav-group-header.expanded .group-chevron {
        transform: rotate(90deg);
        opacity: 0.8;
      }

      /* ====== COLLAPSIBLE ITEMS ====== */
      .nav-group-items {
        overflow: hidden;
        transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
        margin-left: 20px;
        padding-left: 12px;
        border-left: 1.5px solid rgba(255,255,255,0.06);
      }
      .nav-group-items.collapsed {
        max-height: 0 !important;
        opacity: 0;
        pointer-events: none;
      }
      .nav-group-items.expanded {
        opacity: 1;
      }

      /* Sub-items */
      .nav-group-items .nav-item {
        font-size: 0.82rem;
        padding: 8px 12px;
        gap: 10px;
        border-radius: 8px;
        margin: 1px 0;
        color: rgba(255,255,255,0.5);
        position: relative;
      }
      .nav-group-items .nav-item i,
      .nav-group-items .nav-item svg {
        width: 15px !important;
        height: 15px !important;
        opacity: 0.6;
        flex-shrink: 0;
      }
      .nav-group-items .nav-item:hover {
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.9);
      }
      .nav-group-items .nav-item:hover i,
      .nav-group-items .nav-item:hover svg {
        opacity: 1;
      }
      .nav-group-items .nav-item.active {
        background: var(--primary);
        color: #fff;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
      }
      .nav-group-items .nav-item.active i,
      .nav-group-items .nav-item.active svg {
        opacity: 1;
      }

      /* ====== GROUP SEPARATOR ====== */
      .nav-group-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
        margin: 8px 14px;
      }

      /* ====== TOP-LEVEL NAV ITEMS (overview group) ====== */
      .sidebar-nav > .nav-item {
        font-size: 0.88rem;
        padding: 10px 14px;
        gap: 12px;
        border-radius: 10px;
        margin: 1px 0;
      }
    `;
    document.head.appendChild(style);
  }

  function renderNav() {
    return NAV_GROUPS.map((group, gi) => {
      // Top-level items (no dropdown)
      if (!group.title) {
        return group.items.map(item => `
          <a href="${item.to}" data-link data-route="${item.to}" data-exact="${item.end ? '1' : '0'}" class="nav-item">
            <i data-lucide="${item.icon}" style="width:18px;height:18px"></i>
            <span>${item.label}</span>
          </a>
        `).join('') + '<div class="nav-group-divider"></div>';
      }

      const isCollapsed = collapsed[group.id] === true;
      const hasActive = group.items.some(item => {
        return item.end ? currentPath === item.to : currentPath === item.to || currentPath.startsWith(item.to + '/');
      });
      const accentColor = group.color || '#6366f1';

      return `
        <div class="nav-group-header ${isCollapsed ? '' : 'expanded'} ${hasActive ? 'has-active' : ''}" data-group="${group.id}">
          <span class="group-icon-wrap" style="background:${accentColor}20;color:${accentColor};">
            <i data-lucide="${group.icon}" class="group-icon"></i>
          </span>
          <span class="group-label">${group.title}</span>
          <i data-lucide="chevron-right" class="group-chevron"></i>
        </div>
        <div class="nav-group-items ${isCollapsed ? 'collapsed' : 'expanded'}" data-group-items="${group.id}"
             style="max-height:${isCollapsed ? '0' : group.items.length * 42 + 16 + 'px'};">
          ${group.items.map(item => `
            <a href="${item.to}" data-link data-route="${item.to}" data-exact="${item.end ? '1' : '0'}" class="nav-item">
              <i data-lucide="${item.icon}"></i>
              <span>${item.label}</span>
            </a>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  function buildHTML() {
    el.innerHTML = `
      <div class="sidebar-header" style="padding:20px 24px;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="/logo_1.png" alt="School logo" style="width:34px;height:34px;border-radius:10px;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.3);" />
          <span style="font-family:'Moul';font-weight:400;font-size:1.05rem;line-height:1.3;">គ្រប់គ្រងសាលា</span>
        </div>
        <button class="show-mobile" data-action="close" style="color:var(--text-muted);display:none;background:none;border:none;cursor:pointer;">
          <i data-lucide="x" style="width:24px;height:24px"></i>
        </button>
      </div>
      <nav class="sidebar-nav" style="overflow-y:auto;flex:1;padding:10px 10px 32px;">
        ${renderNav()}
      </nav>
      <div style="padding:12px 10px;border-top:1px solid rgba(255,255,255,0.06);">
        <a href="/db-test" data-link data-route="/db-test" data-exact="0" class="nav-item" style="font-size:0.82rem;padding:9px 14px;border-radius:10px;gap:10px;opacity:0.6;">
          <i data-lucide="settings" style="width:16px;height:16px"></i>
          <span>ការកំណត់</span>
        </a>
      </div>
    `;
    bindEvents();
    if (window.lucide) window.lucide.createIcons({ nodes: el.querySelectorAll('[data-lucide]') });
  }

  function bindEvents() {
    el.querySelector('[data-action="close"]')?.addEventListener('click', () => onClose && onClose());

    el.querySelectorAll('.nav-group-header').forEach(header => {
      header.addEventListener('click', () => {
        const groupId = header.dataset.group;
        const items = el.querySelector(`[data-group-items="${groupId}"]`);
        if (!items) return;

        const isCurrentlyCollapsed = items.classList.contains('collapsed');

        // Accordion: close all OTHER open groups first
        el.querySelectorAll('.nav-group-header').forEach(otherHeader => {
          const otherId = otherHeader.dataset.group;
          if (otherId === groupId) return; // skip the clicked one
          const otherItems = el.querySelector(`[data-group-items="${otherId}"]`);
          if (!otherItems || otherItems.classList.contains('collapsed')) return;
          // Collapse this other group
          otherItems.style.maxHeight = otherItems.scrollHeight + 'px';
          otherItems.offsetHeight; // force reflow
          otherItems.style.maxHeight = '0px';
          otherItems.classList.remove('expanded');
          otherItems.classList.add('collapsed');
          otherHeader.classList.remove('expanded');
          collapsed[otherId] = true;
        });

        // Now toggle the clicked group
        if (isCurrentlyCollapsed) {
          items.classList.remove('collapsed');
          items.classList.add('expanded');
          items.style.maxHeight = items.scrollHeight + 'px';
          header.classList.add('expanded');
          collapsed[groupId] = false;
        } else {
          items.style.maxHeight = items.scrollHeight + 'px';
          items.offsetHeight; // force reflow
          items.style.maxHeight = '0px';
          items.classList.remove('expanded');
          items.classList.add('collapsed');
          header.classList.remove('expanded');
          collapsed[groupId] = true;
        }

        saveCollapsedState(collapsed);
        if (window.lucide) window.lucide.createIcons({ nodes: el.querySelectorAll('[data-lucide]') });
      });
    });
  }

  function setActive(path) {
    el.querySelectorAll('[data-route]').forEach(a => {
      const route = a.dataset.route;
      const exact = a.dataset.exact === '1';
      const isActive = exact ? path === route : path === route || path.startsWith(route + '/');
      a.classList.toggle('active', isActive);
    });

    // Auto-expand the active group
    NAV_GROUPS.forEach(group => {
      if (!group.title) return;
      const hasActive = group.items.some(item => {
        return item.end ? path === item.to : path === item.to || path.startsWith(item.to + '/');
      });

      const header = el.querySelector(`.nav-group-header[data-group="${group.id}"]`);
      const items = el.querySelector(`[data-group-items="${group.id}"]`);
      if (!header || !items) return;

      header.classList.toggle('has-active', hasActive);

      if (hasActive && items.classList.contains('collapsed')) {
        items.classList.remove('collapsed');
        items.classList.add('expanded');
        items.style.maxHeight = items.scrollHeight + 'px';
        header.classList.add('expanded');
        collapsed[group.id] = false;
        saveCollapsedState(collapsed);
      }
    });
  }

  injectStyles();
  buildHTML();
  setActive(currentPath);

  return {
    el,
    setActive,
    setOpen: (open) => el.classList.toggle('open', open),
  };
}
