// Replaces react-easy-crop (only used in PublicApply.jsx for the applicant
// photo). Canvas + pointer-events pan/zoom cropper with a fixed-aspect
// viewport, matching the crop-then-upload flow of the original page.

/**
 * @param {object} opts
 * @param {string} opts.imageSrc - object URL or data URL of the source image
 * @param {number} opts.aspect - width/height ratio of the crop viewport (e.g. 1 for square)
 * @param {number} opts.viewportSize - rendered viewport height in px (width = height*aspect)
 * @returns {{ el: HTMLElement, getCroppedBlob: function(outputSize): Promise<Blob>, destroy: function }}
 */
export function createImageCropper({ imageSrc, aspect = 1, viewportSize = 280 }) {
  const width = Math.round(viewportSize * aspect);
  const height = viewportSize;

  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '12px';

  const viewport = document.createElement('div');
  viewport.style.width = `${width}px`;
  viewport.style.height = `${height}px`;
  viewport.style.overflow = 'hidden';
  viewport.style.position = 'relative';
  viewport.style.borderRadius = '12px';
  viewport.style.border = '2px solid var(--primary)';
  viewport.style.background = '#000';
  viewport.style.cursor = 'grab';
  viewport.style.touchAction = 'none';

  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.position = 'absolute';
  img.style.userSelect = 'none';
  img.draggable = false;

  let scale = 1;
  let minScale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let naturalW = 0;
  let naturalH = 0;

  function applyTransform() {
    img.style.width = `${naturalW * scale}px`;
    img.style.height = `${naturalH * scale}px`;
    img.style.left = `${offsetX}px`;
    img.style.top = `${offsetY}px`;
  }

  function clampOffset() {
    const w = naturalW * scale;
    const h = naturalH * scale;
    offsetX = Math.min(0, Math.max(offsetX, width - w));
    offsetY = Math.min(0, Math.max(offsetY, height - h));
  }

  img.addEventListener('load', () => {
    naturalW = img.naturalWidth;
    naturalH = img.naturalHeight;
    minScale = Math.max(width / naturalW, height / naturalH);
    scale = minScale;
    offsetX = (width - naturalW * scale) / 2;
    offsetY = (height - naturalH * scale) / 2;
    applyTransform();
  });

  viewport.appendChild(img);

  let dragging = false;
  let lastX = 0, lastY = 0;

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    viewport.style.cursor = 'grabbing';
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    offsetX += e.clientX - lastX;
    offsetY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    clampOffset();
    applyTransform();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt =>
    viewport.addEventListener(evt, () => { dragging = false; viewport.style.cursor = 'grab'; })
  );
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale = Math.min(minScale * 4, Math.max(minScale, scale - e.deltaY * 0.001));
    clampOffset();
    applyTransform();
  });

  const zoomRow = document.createElement('div');
  zoomRow.style.display = 'flex';
  zoomRow.style.alignItems = 'center';
  zoomRow.style.gap = '8px';
  zoomRow.style.width = `${width}px`;
  const zoomSlider = document.createElement('input');
  zoomSlider.type = 'range';
  zoomSlider.min = '0';
  zoomSlider.max = '100';
  zoomSlider.value = '0';
  zoomSlider.style.flex = '1';
  zoomSlider.addEventListener('input', () => {
    const t = Number(zoomSlider.value) / 100;
    scale = minScale + t * (minScale * 3);
    clampOffset();
    applyTransform();
  });
  zoomRow.innerHTML = '<span style="font-size:0.8rem;color:var(--text-secondary);">បន្តិច</span>';
  zoomRow.appendChild(zoomSlider);
  const zoomMax = document.createElement('span');
  zoomMax.style.fontSize = '0.8rem';
  zoomMax.style.color = 'var(--text-secondary)';
  zoomMax.textContent = 'ច្រើន';
  zoomRow.appendChild(zoomMax);

  wrap.appendChild(viewport);
  wrap.appendChild(zoomRow);

  function getCroppedCanvas(outputSize = 400) {
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = Math.round(outputSize / aspect);
    const ctx = canvas.getContext('2d');
    const sx = -offsetX / scale;
    const sy = -offsetY / scale;
    const sw = width / scale;
    const sh = height / scale;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  function getCroppedBlob(outputSize = 400) {
    return new Promise((resolve) => {
      getCroppedCanvas(outputSize).toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
  }

  return {
    el: wrap,
    getCroppedCanvas,
    getCroppedBlob,
    destroy() { wrap.remove(); },
  };
}
