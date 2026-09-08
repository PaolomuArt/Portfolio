document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));

document.querySelectorAll('.compare-slider').forEach(initCompareSlider);

function initCompareSlider(root){
  const overlay = root.querySelector('.compare-overlay');
  const handle = root.querySelector('.compare-handle');
  if(!overlay || !handle) return;

  function setPos(clientX){
    const rect = root.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.min(100, Math.max(0, pct));
    overlay.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  root.addEventListener('pointerdown', e => {
    root.setPointerCapture(e.pointerId);
    root.classList.add('dragging');
    setPos(e.clientX);
  });
  root.addEventListener('pointermove', e => {
    if(!root.classList.contains('dragging')) return;
    setPos(e.clientX);
  });
  ['pointerup','pointercancel','pointerleave'].forEach(evt =>
    root.addEventListener(evt, () => root.classList.remove('dragging'))
  );

  handle.tabIndex = 0;
  handle.setAttribute('role','slider');
  handle.setAttribute('aria-valuemin','0');
  handle.setAttribute('aria-valuemax','100');
  handle.setAttribute('aria-label','Comparar versión A y B');
  handle.addEventListener('keydown', e => {
    const current = parseFloat(handle.style.left) || 50;
    let next = current;
    if(e.key === 'ArrowLeft') next = Math.max(0, current - 5);
    else if(e.key === 'ArrowRight') next = Math.min(100, current + 5);
    else return;
    e.preventDefault();
    overlay.style.clipPath = `inset(0 ${100 - next}% 0 0)`;
    handle.style.left = next + '%';
    handle.setAttribute('aria-valuenow', Math.round(next));
  });

  const rect = root.getBoundingClientRect();
  setPos(rect.left + rect.width / 2);
}
