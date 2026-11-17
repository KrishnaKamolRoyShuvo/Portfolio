/**
 * Custom Interactive Magnetic Cursor
 */
export function initCustomCursor() {
  // Check if touch device
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovering = false;
  let isViewing = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Immediate update for dot
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth lerp loop for the outer ring
  function render() {
    const ease = 0.18;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  render();

  // Attach hover listeners to interactable elements
  function attachHoverListeners() {
    const interactables = document.querySelectorAll('a, button, input, textarea, select, [data-cursor="hover"]');
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

  // Click pulse animation
  window.addEventListener('mousedown', () => {
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(0.85)`;
  });
  window.addEventListener('mouseup', () => {
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(1)`;
  });

  attachHoverListeners();

  return { attachHoverListeners };
}
