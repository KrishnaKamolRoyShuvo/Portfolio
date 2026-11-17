import gsap from 'gsap';

export function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const greetingEl = document.getElementById('preloader-greeting');
  const svgCurve = document.getElementById('preloader-curve');
  if (!preloader || !greetingEl) {
    if (onComplete) onComplete();
    return;
  }

  // Greetings sequence with Bengali "নমস্কার" strictly 2nd as requested
  const greetings = [
    'Hello',
    'নমস্কার',
    'Bonjour',
    'Ciao',
    'Olá',
    'こんにちは',
    'Guten Tag',
    'হ্যালো'
  ];

  let index = 0;
  greetingEl.textContent = `• ${greetings[0]}`;

  // 200ms per word = ~1.6s total reading duration
  const interval = setInterval(() => {
    index++;
    if (index < greetings.length) {
      greetingEl.textContent = `• ${greetings[index]}`;
    } else {
      clearInterval(interval);

      // Dennis Snellenberg iconic curved upward slide
      const tl = gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }
      });

      tl.to(greetingEl, {
        opacity: 0,
        y: -30,
        duration: 0.35,
        ease: 'power2.in'
      });

      if (svgCurve) {
        tl.to(svgCurve, {
          attr: { d: 'M0 0 L100 0 L100 100 Q50 0 0 100 Z' },
          duration: 0.9,
          ease: 'power4.in'
        }, '-=0.15');
      }

      tl.to(preloader, {
        yPercent: -100,
        duration: 0.95,
        ease: 'power4.inOut'
      }, '-=0.7');
    }
  }, 200);
}
