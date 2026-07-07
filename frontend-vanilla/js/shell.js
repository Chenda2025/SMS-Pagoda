// Ports components/Layout.jsx: builds the admin app-container (sidebar +
// header + content-area) once, then reuses it across admin route navigations
// -- only the content-area and active nav link change between pages.

import { createSidebar } from './components/sidebar.js';
import { createHeader } from './components/header.js';

let shellEl = null;
let sidebarApi = null;
let overlayEl = null;
let contentArea = null;
let mobileOpen = false;

function buildShell(path) {
  shellEl = document.createElement('div');
  shellEl.className = 'app-container';

  overlayEl = document.createElement('div');
  overlayEl.className = 'sidebar-overlay';
  overlayEl.addEventListener('click', () => setMobileOpen(false));

  sidebarApi = createSidebar({ currentPath: path, onClose: () => setMobileOpen(false) });

  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'main-wrapper';

  const header = createHeader({ onToggleSidebar: () => setMobileOpen(!mobileOpen) });

  contentArea = document.createElement('div');
  contentArea.className = 'content-area';

  mainWrapper.appendChild(header.el);
  mainWrapper.appendChild(contentArea);

  shellEl.appendChild(overlayEl);
  shellEl.appendChild(sidebarApi.el);
  shellEl.appendChild(mainWrapper);

  document.getElementById('app').innerHTML = '';
  document.getElementById('app').appendChild(shellEl);

  if (window.lucide) window.lucide.createIcons();
}

function setMobileOpen(open) {
  mobileOpen = open;
  sidebarApi.setOpen(open);
  overlayEl.classList.toggle('visible', open);
}

/**
 * Registered with router.setAdminRouteHandler. Called with the target path
 * for admin routes (builds/reuses the shell, returns the content-area for
 * the page module to render into), or null when navigating away from the
 * admin shell entirely (tears it down).
 */
export function renderAdminShell(path) {
  if (path === null) {
    if (shellEl) {
      shellEl.remove();
      shellEl = null;
      sidebarApi = null;
      contentArea = null;
    }
    return null;
  }

  if (!shellEl) {
    buildShell(path);
  } else {
    sidebarApi.setActive(path);
    setMobileOpen(false);
    contentArea.innerHTML = '';
  }

  return contentArea;
}
