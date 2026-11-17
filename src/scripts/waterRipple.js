/**
 * Natural Interactive Fluid Water Ripple Simulation
 * Realistic concentric wave propagation with physical damping and caustic highlights.
 */
export function initWaterRipple() {
  const canvas = document.getElementById('water-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ripples = [];
  const maxRipples = 60;
  let isEnabled = true;
  let lastMouseX = -1;
  let lastMouseY = -1;
  let lastMoveTime = 0;
  let animationFrameId = null;

  class Ripple {
    constructor(x, y, maxRadius = 120, strength = 1.0, speed = 2.2) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = maxRadius;
      this.strength = strength;
      this.currentStrength = strength;
      this.speed = speed;
      this.waves = [
        { offset: 0, amp: 1.0 },
        { offset: -12, amp: 0.65 },
        { offset: -24, amp: 0.35 }
      ];
      this.alive = true;
    }

    update() {
      this.radius += this.speed;
      const progress = this.radius / this.maxRadius;
      this.currentStrength = this.strength * Math.pow(1 - progress, 1.8);

      if (this.radius >= this.maxRadius || this.currentStrength <= 0.01) {
        this.alive = false;
      }
    }

    draw(ctx, isLightMode) {
      if (!this.alive) return;

      for (const wave of this.waves) {
        const r = this.radius + wave.offset;
        if (r <= 0) continue;

        const alpha = Math.max(0, this.currentStrength * wave.amp);
        if (alpha <= 0.005) continue;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);

        // Highlight ring (caustic reflection)
        const primaryColor = isLightMode
          ? `rgba(2, 132, 199, ${alpha * 0.4})`
          : `rgba(6, 182, 212, ${alpha * 0.45})`;
        const secondaryColor = isLightMode
          ? `rgba(99, 102, 241, ${alpha * 0.25})`
          : `rgba(99, 102, 241, ${alpha * 0.35})`;

        const gradient = ctx.createRadialGradient(
          this.x, this.y, Math.max(1, r - 6),
          this.x, this.y, r + 6
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, primaryColor);
        gradient.addColorStop(0.8, secondaryColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function addRipple(x, y, maxRadius = 140, strength = 0.8, speed = 2.4) {
    if (!isEnabled) return;
    if (ripples.length >= maxRipples) {
      ripples.shift();
    }
    ripples.push(new Ripple(x, y, maxRadius, strength, speed));
    ensureLoop();
  }

  // Mousemove with distance-based threshold for natural droplet disturbance
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    if (lastMouseX >= 0) {
      const dx = x - lastMouseX;
      const dy = y - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Create gentle disturbance when moving
      if (dist > 25 && now - lastMoveTime > 35) {
        const speed = Math.min(dist * 0.08 + 1.8, 4.0);
        addRipple(x, y, 90 + dist * 0.8, 0.45, speed);
        lastMoveTime = now;
        lastMouseX = x;
        lastMouseY = y;
      }
    } else {
      lastMouseX = x;
      lastMouseY = y;
    }
  });

  // Click generates high-energy concentric ripples
  window.addEventListener('pointerdown', (e) => {
    // Avoid triggering if clicking on terminal input or buttons if needed, or allow everywhere
    addRipple(e.clientX, e.clientY, 260, 1.2, 3.8);
    // Secondary delayed ring for realistic splash
    setTimeout(() => {
      addRipple(e.clientX, e.clientY, 180, 0.7, 2.5);
    }, 90);
  });

  let isLoopRunning = false;

  function render() {
    const isLightMode = document.documentElement.classList.contains('light');
    ctx.clearRect(0, 0, width, height);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.update();
      r.draw(ctx, isLightMode);
      if (!r.alive) {
        ripples.splice(i, 1);
      }
    }

    if (ripples.length > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      isLoopRunning = false;
      animationFrameId = null;
    }
  }

  function ensureLoop() {
    if (!isLoopRunning) {
      isLoopRunning = true;
      render();
    }
  }

  return {
    toggle: (val) => {
      isEnabled = typeof val === 'boolean' ? val : !isEnabled;
      return isEnabled;
    },
    splash: (x, y) => addRipple(x, y, 220, 1.0, 3.0)
  };
}
