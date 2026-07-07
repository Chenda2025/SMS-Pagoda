// Helper for the full-redraw-per-state-change pattern used across pages:
// re-rendering an input's container on every keystroke would otherwise steal
// focus and reset cursor position. This captures focus/selection before a
// render and restores it on the newly-created matching element afterward.

export function withFocusPreserved(root, renderFn) {
  const active = document.activeElement;
  let selector = null;
  let selectionStart = null;
  let selectionEnd = null;

  if (active && root.contains(active)) {
    if (active.id) {
      selector = `#${CSS.escape(active.id)}`;
    } else if (active.name) {
      selector = `${active.tagName.toLowerCase()}[name="${CSS.escape(active.name)}"]`;
    } else if (active.dataset && Object.keys(active.dataset).length) {
      const attrs = Object.entries(active.dataset).map(([k, v]) => `[data-${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}="${v}"]`).join('');
      selector = active.tagName.toLowerCase() + attrs;
    }
    if (selector && typeof active.selectionStart === 'number') {
      selectionStart = active.selectionStart;
      selectionEnd = active.selectionEnd;
    }
  }

  renderFn();

  if (selector) {
    const el = root.querySelector(selector);
    if (el) {
      el.focus({ preventScroll: true });
      if (selectionStart !== null && el.setSelectionRange) {
        try { el.setSelectionRange(selectionStart, selectionEnd); } catch { /* not a text input */ }
      }
    }
  }
}

// IME-safe replacement for `el.addEventListener('input', handler)` when the
// handler triggers a full re-render (e.g. via setFormData/setState + the
// withFocusPreserved pattern above). Typing Khmer/Chinese/Japanese etc. via
// an OS input method fires compositionstart/compositionupdate while a
// syllable is still being composed; re-rendering (destroying/recreating the
// input) mid-composition cancels that composition and makes the cursor/text
// visibly jump. Deferring the handler until the composition settles fixes it.
export function onLiveInput(el, handler) {
  let composing = false;
  el.addEventListener('compositionstart', () => { composing = true; });
  el.addEventListener('compositionend', () => { composing = false; handler(); });
  el.addEventListener('input', (e) => {
    if (e.isComposing || composing) return;
    handler();
  });
}
