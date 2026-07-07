// Replaces react-dom's createPortal-based modals/drawers/confirm-dialogs.
// One shared open/close implementation instead of per-page backdrop+panel copies.

let stack = [];

/**
 * @param {string|HTMLElement} content - inner HTML (string) or a built element
 * @param {object} opts
 * @param {boolean} opts.drawer - render as a right-side sliding drawer instead of a centered panel
 * @param {boolean} opts.closeOnBackdrop - default true
 * @param {function} opts.onClose - called after the modal is removed
 * @returns {{ close: function, panel: HTMLElement }}
 */
export function openModal(content, opts = {}) {
  const { drawer = false, closeOnBackdrop = true, onClose } = opts;

  const backdrop = document.createElement('div');
  backdrop.className = 'vmodal-backdrop';
  backdrop.style.zIndex = String(3000 + stack.length * 2);

  const panel = document.createElement('div');
  panel.className = `vmodal-panel${drawer ? ' vmodal-drawer' : ''}`;
  panel.style.zIndex = String(3001 + stack.length * 2);

  if (typeof content === 'string') panel.innerHTML = content;
  else panel.appendChild(content);

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);

  function close() {
    backdrop.remove();
    panel.remove();
    stack = stack.filter(m => m.panel !== panel);
    if (onClose) onClose();
  }

  if (closeOnBackdrop) backdrop.addEventListener('click', close);
  panel.addEventListener('click', (e) => e.stopPropagation());

  const entry = { backdrop, panel, close };
  stack.push(entry);
  if (window.lucide) window.lucide.createIcons();
  return entry;
}

export function closeTopModal() {
  const top = stack[stack.length - 1];
  if (top) top.close();
}
