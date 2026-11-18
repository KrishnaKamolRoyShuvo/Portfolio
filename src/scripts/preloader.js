import gsap from 'gsap';

export function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const greetingEl = document.getElementById('preloader-greeting');
  if (!preloader || !greetingEl) {
    if (onComplete) onComplete();
    return;
  }

  // Exact multilingual greeting sequence specified by user
  const greetings = [
    'Hello',
    'Hola',
    'Bonjour',
    'Ciao',
    'नमस्ते',
    'নমস্কার',
    'مرحباً',
    '你好',
    'Xin chào',
    'Olá',
    'Hallo'
  ];

  let index = 0;
  greetingEl.textContent = `• ${greetings[0]}`;

  // Stable word display with ultra-snappy switch (no lingering transition delay)
  function nextGreeting() {
    index++;
    if (index < greetings.length) {
      // Instant, stable word swap with a crisp micro-fade (15ms)
      gsap.to(greetingEl, {
        opacity: 0.3,
        duration: 0.015,
        ease: 'none',
        onComplete: () => {
          greetingEl.textContent = `• ${greetings[index]}`;
          gsap.to(greetingEl, {
            opacity: 1,
            duration: 0.015,
            ease: 'none',
            onComplete: () => {
              // Stable viewing time per greeting (140ms)
              setTimeout(nextGreeting, 140);
            }
          });
        }
      });
    } else {
      // Finished all greetings: Dennis Snellenberg parabolic curved curtain exit
      const curveWrap = document.getElementById('preloader-curve-wrap');
      const isMobile = window.innerWidth < 640;
      const initialCurveHeight = isMobile ? '7vh' : '10vh';

      if (curveWrap) {
        gsap.set(curveWrap, { height: initialCurveHeight });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }
      });

      // Quick fade out of greeting
      tl.to(greetingEl, {
        opacity: 0,
        y: -18,
        duration: 0.16,
        ease: 'power2.in'
      });

      // Lift preloader curtain upward smoothly
      tl.to(preloader, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut'
      }, '-=0.04');

      // Flatten curve simultaneously
      if (curveWrap) {
        tl.to(curveWrap, {
          height: '0vh',
          duration: 0.75,
          ease: 'power4.inOut'
        }, '<');
      }
    }
  }

  // Initial stay on first greeting (150ms) then start sequence
  setTimeout(nextGreeting, 150);
}
