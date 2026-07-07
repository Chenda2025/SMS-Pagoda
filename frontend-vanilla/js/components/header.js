// Ports components/Header.jsx: search box, notification bell, user avatar,
// logout, and the mobile hamburger toggle.

import { getUser, logout } from '../auth.js';
import { navigate } from '../router.js';

export function createHeader({ onToggleSidebar }) {
  const user = getUser();
  const username = user?.username || 'Admin';
  const initials = username.substring(0, 2).toUpperCase();

  const el = document.createElement('div');
  el.className = 'top-header';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;">
      <button class="show-mobile-flex" data-action="toggle-sidebar" style="display:none;color:var(--text-primary);padding:4px;">
        <i data-lucide="menu" style="width:24px;height:24px"></i>
      </button>
      <div class="header-search hidden-mobile">
        <i data-lucide="search" style="width:18px;height:18px;color:var(--text-muted)"></i>
        <input type="text" placeholder="Search students, classes, etc..." />
      </div>
    </div>
    <div class="header-profile">
      <button style="position:relative;margin-right:8px;">
        <i data-lucide="bell" style="width:20px;height:20px;color:var(--text-secondary)"></i>
        <span style="position:absolute;top:0;right:0;width:8px;height:8px;background-color:var(--danger);border-radius:50%;"></span>
      </button>
      <div style="text-align:right;display:flex;flex-direction:column;">
        <span style="font-size:0.875rem;font-weight:600;">${username}</span>
        <span style="font-size:0.75rem;color:var(--text-secondary);">Administrator</span>
      </div>
      <div class="avatar">${initials}</div>
      <button data-action="logout" style="margin-left:16px;color:var(--danger);display:flex;align-items:center;gap:4px;">
        <i data-lucide="log-out" style="width:18px;height:18px"></i>
      </button>
    </div>
  `;

  el.querySelector('[data-action="toggle-sidebar"]').addEventListener('click', () => onToggleSidebar && onToggleSidebar());
  el.querySelector('[data-action="logout"]').addEventListener('click', () => {
    logout();
    navigate('/login');
  });

  return { el };
}
