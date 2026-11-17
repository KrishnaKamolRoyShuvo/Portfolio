import gsap from 'gsap';

export function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const greetingEl = document.getElementById('preloader-greeting');
  const svgCurve = document.getElementById('preloader-curve');
  if (!preloader || !greetingEl) {
    if (onComplete) onComplete();
    return;
  }

  const greetings = [
    'Hello',
    'নমস্কার',
    'Bonjour',
    'Ciao',
    'Olá',
    'こんにちは',
    'Hallå',
    'Guten Tag',
    'হ্যালো'
  ];

  let index = 0;
  greetingEl.textContent = `• ${greetings[0]}`;

  const interval = setInterval(() => {
    index++;
    if (index < greetings.length) {
      greetingEl.textContent = `• ${greetings[index]}`;
    } else {
      clearInterval(interval);

      // Slide up exit animation with curved SVG path
      const tl = gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }
      });

      tl.to(greetingEl, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in'
      });

      if (svgCurve) {
        // Dennis Snellenberg curved curtain animation
        const initialCurve = 'M0 0 L100 0 L100 100 Q50 100 0 100 Z';
        const targetCurve = 'M0 0 L100 0 L100 100 Q50 0 0 100 Z';

        tl.to(svgCurve, {
          attr: { d: targetCurve },
          duration: 0.8,
          ease: 'power3.in'
        }, '-=0.1');
      }

      tl.to(preloader, {
        yPercent: -100,
        duration: 0.85,
        ease: 'power4.inOut'
      }, '-=0.6');
    }
  }, 140);
}
