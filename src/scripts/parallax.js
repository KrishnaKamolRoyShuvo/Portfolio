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

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Parallax Floating Elements in Hero
  const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
  parallaxElements.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.2;
    gsap.to(el, {
      y: () => -(window.innerHeight * speed * 0.4),
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

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

  // 4. Sticky Stacked Project Cards Parallax
  const projectCards = document.querySelectorAll('.stacked-card');
  projectCards.forEach((card, index) => {
    if (index < projectCards.length - 1) {
      gsap.to(card, {
        scale: 0.94,
        opacity: 0.5,
        filter: 'blur(3px)',
        ease: 'power1.out',
        scrollTrigger: {
          trigger: projectCards[index + 1],
          start: 'top 65%',
          end: 'top 20%',
          scrub: true
        }
      });
    }
  });

  // 5. Timeline Progress Tracer Line
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
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 0.5
        }
      }
    );
  }

  // 6. 3D Tilt Micro-Interaction for Cards
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 7. General Fade-Up Entrance Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  return { lenis };
}
