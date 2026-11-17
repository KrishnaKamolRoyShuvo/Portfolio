import './styles/index.css';
import { initPreloader } from './scripts/preloader.js';
import { initTheme } from './scripts/theme.js';
import { initCustomCursor } from './scripts/cursor.js';
import { initWaterRipple } from './scripts/waterRipple.js';
import { initThreeBackground } from './scripts/threeBg.js';
import { initParallaxAndMotion } from './scripts/parallax.js';
import { initTerminal } from './scripts/terminal.js';
import { initContactFeatures } from './scripts/contact.js';
import { initGallery } from './scripts/gallery.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Multi-Language Greetings Preloader (Dennis Snellenberg Style)
  initPreloader(() => {
    // Reveal callbacks once preloader finishes
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
      heroContent.classList.remove('opacity-0');
    }
  });

  // 2. Real WebGL Water Ripple Engine
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

  // 3. Three.js Background
  const threeBg = initThreeBackground();

  // 4. Theme Controller (Dark & Day Mode)
  initTheme({
    onThemeChange: () => {
      if (threeBg && threeBg.updateThemeColors) {
        threeBg.updateThemeColors();
      }
    }
  });

  // 5. Custom Mouse Pointer
  const cursorController = initCustomCursor();

  // 6. Parallax, Hero Zoom-Out & Smooth Momentum Scrolling
  initParallaxAndMotion();

  // 7. Interactive Developer CLI Terminal with Ghost Command Watermark
  initTerminal();

  // 8. Contact Hub & Live Features
  initContactFeatures();

  // 9. Client Projects Bento Gallery (Emerald/Teal aesthetic + Progressive Reveal)
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
        typeDelay = 2200;
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
