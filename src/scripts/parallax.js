import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallaxAndMotion() {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(500, 33);

  // 2. Dennis Snellenberg Hero Parallax Transition (Pinned Fade & Upward Content Slide on Desktop)
  const heroSection = document.getElementById('hero');
  const heroContent = document.getElementById('hero-content');
  
  if (heroSection && heroContent) {
    ScrollTrigger.matchMedia({
      // Desktop (>= 1024px): Pinned Dennis Snellenberg zoom-out parallax (two-column layout)
      "(min-width: 1024px)": function() {
        ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: '+=80%',
          pin: true,
          pinSpacing: false,
          scrub: 0.15,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(heroContent, {
              scale: 1.0 - p * 0.06,
              opacity: Math.max(0, 1.0 - p * 1.2),
              y: p * 40
            });
          }
        });
      },
      // Tablet & Mobile (< 1024px): Natural scroll flow without pin clipping
      "(max-width: 1023px)": function() {
        gsap.to(heroContent, {
          opacity: 0.3,
          scale: 0.96,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroSection,
            start: 'bottom 85%',
            end: 'bottom 15%',
            scrub: true
          }
        });
      }
    });
  }

  // 3. Counter Animation for Fast Facts
  const counters = document.querySelectorAll('[data-counter-target]');
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-counter-target'));
    const suffix = counter.getAttribute('data-counter-suffix') || '';
    const prefix = counter.getAttribute('data-counter-prefix') || '';
    const decimals = parseInt(counter.getAttribute('data-counter-decimals') || '0', 10);

    gsap.fromTo(
      counter,
      { textContent: 0 },
      {
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: function () {
          const val = (this.progress() * target).toFixed(decimals);
          counter.textContent = `${prefix}${val}${suffix}`;
        }
      }
    );
  });

  // 4. Sticky Stacked Project Cards Parallax (Desktop / Tablet only)
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function() {
      const projectCards = document.querySelectorAll('.stacked-card');
      projectCards.forEach((card, index) => {
        if (index < projectCards.length - 1) {
          const nextCard = projectCards[index + 1];
          gsap.to(card, {
            scale: 0.95,
            autoAlpha: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 55%',
              end: 'top 120px',
              scrub: true
            }
          });
        }
      });
    }
  });

  // 5. Timeline Progress Tracer Line (Balanced Pacing)
  const timelineProgress = document.getElementById('timeline-progress-bar');
  const timelineContainer = document.getElementById('timeline-container');
  if (timelineProgress && timelineContainer) {
    gsap.fromTo(
      timelineProgress,
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 45%',
          end: 'bottom 85%',
          scrub: 1.2
        }
      }
    );
  }

  // 6. 3D Tilt Micro-Interaction for Cards & Hero Floating Badges
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    const isBadge = card.classList.contains('hero-floating-badge');
    const tiltMax = isBadge ? 4 : 4;
    const liftAmount = -2;

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.2s ease-out';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -tiltMax;
      const rotateY = ((x - centerX) / centerX) * tiltMax;

      card.style.transition = 'none';
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(${liftAmount}px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 7. Floating Back-to-Top Button with Circular Progress
  const backToTopBtn = document.getElementById('floating-back-to-top');
  const progressCircle = document.getElementById('scroll-progress-circle');
  if (backToTopBtn) {
    const circumference = 2 * Math.PI * 18; // radius 18
    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference}`;
      progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

      if (scrollY > 350) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      }

      if (progressCircle) {
        progressCircle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
      }
    });

    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 1.2 });
    });
  }

  // 8. Smooth Momentum Anchor Navigation with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#cv-modal') return;

      if (href === '#hero') {
        e.preventDefault();
        history.pushState(null, null, '#hero');
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        history.pushState(null, null, href);
        lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
      }
    });
  });

  // Handle direct landing or reload with #hero
  if (window.location.hash === '#hero') {
    lenis.scrollTo(0, { immediate: true });
  }

  return { lenis };
}
