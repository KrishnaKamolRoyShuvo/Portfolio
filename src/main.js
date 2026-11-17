import './styles/index.css';
import { initTheme } from './scripts/theme.js';
import { initCustomCursor } from './scripts/cursor.js';
import { initWaterRipple } from './scripts/waterRipple.js';
import { initThreeBackground } from './scripts/threeBg.js';
import { initParallaxAndMotion } from './scripts/parallax.js';
import { initTerminal } from './scripts/terminal.js';
import { initContactFeatures } from './scripts/contact.js';
import { initGallery } from './scripts/gallery.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Water Ripple Engine
  const waterEngine = initWaterRipple();

  // Water Ripple Toggle Button in Header
  const rippleToggleBtn = document.getElementById('water-toggle-btn');
  if (rippleToggleBtn) {
    let active = true;
    rippleToggleBtn.addEventListener('click', () => {
      active = !active;
      waterEngine.toggle(active);
      rippleToggleBtn.classList.toggle('text-cyan-400', active);
      rippleToggleBtn.classList.toggle('text-slate-500', !active);
    });
  }

  // 2. Three.js Background
  const threeBg = initThreeBackground();

  // 3. Theme Controller (Dark & Day Mode)
  initTheme({
    onThemeChange: () => {
      if (threeBg && threeBg.updateThemeColors) {
        threeBg.updateThemeColors();
      }
    }
  });

  // 4. Custom Mouse Pointer
  const cursorController = initCustomCursor();

  // 5. Parallax & Smooth Momentum Scrolling
  initParallaxAndMotion();

  // 6. Interactive Developer CLI Terminal
  initTerminal();

  // 7. Contact Hub & Live Features
  initContactFeatures();

  // 8. Client Projects Gallery
  initGallery(cursorController);

  // Dynamic Typewriter Effect for Hero
  const typewriterEl = document.getElementById('hero-typewriter');
  if (typewriterEl) {
    const roles = [
      'Full-Stack Software Engineer',
      'ASP.NET Core & C# Architect',
      'MERN & React.js Developer',
      'Vision Transformer & ML Researcher',
      'Systems & IT Infrastructure Specialist'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeDelay = 45;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeDelay = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeDelay = 2200; // Pause at full word
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeDelay = 400;
      }

      setTimeout(type, typeDelay);
    }
    type();
  }

  // Mobile navigation drawer toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }
});
