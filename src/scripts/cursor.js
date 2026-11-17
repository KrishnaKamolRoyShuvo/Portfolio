/**
 * Custom Interactive Precision Magnetic Cursor
 */
export function initCustomCursor() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  // Create custom cursor elements
  let dot = document.querySelector('.custom-cursor-dot');
  let ring = document.querySelector('.custom-cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(ring);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovering = false;
  let isViewing = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.opacity = '1';
    ring.style.opacity = '1';
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  function render() {
    const ease = 0.2;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  render();

  function attachHoverListeners() {
    const interactables = document.querySelectorAll(
      'a, button, input, textarea, select, [data-cursor="hover"], .glass-card, [data-tilt]'
    );
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        isHovering = true;
        ring.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        isHovering = false;
        ring.classList.remove('cursor-hover');
      });
    });

    const projectCards = document.querySelectorAll('[data-cursor="view"]');
    projectCards.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        isViewing = true;
        ring.classList.add('cursor-hover', 'cursor-view');
      });
      el.addEventListener('mouseleave', () => {
        isViewing = false;
        ring.classList.remove('cursor-hover', 'cursor-view');
      });
    });
  }

  window.addEventListener('mousedown', () => {
    ring.classList.add('cursor-click');
  });
  window.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-click');
  });

  attachHoverListeners();

  return { attachHoverListeners };
}
