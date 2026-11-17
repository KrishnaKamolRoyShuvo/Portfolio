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

  function nextGreeting() {
    index++;
    if (index < greetings.length) {
      // Quick transition out, change word, quick transition in with stay
      gsap.to(greetingEl, {
        opacity: 0,
        y: -8,
        scale: 0.96,
        duration: 0.05,
        ease: 'power2.in',
        onComplete: () => {
          greetingEl.textContent = `• ${greetings[index]}`;
          gsap.fromTo(
            greetingEl,
            { opacity: 0, y: 8, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.08,
              ease: 'power2.out',
              onComplete: () => {
                // Stays for 200ms before next transition (-0.2s adjusted)
                setTimeout(nextGreeting, 200);
              }
            }
          );
        }
      });
    } else {
      // Finished all greetings: Dennis Snellenberg parabolic curved curtain exit
      const curveWrap = document.getElementById('preloader-curve-wrap');
      const isMobile = window.innerWidth < 640;
      const initialCurveHeight = isMobile ? '7vh' : '11vh';

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

      tl.to(greetingEl, {
        opacity: 0,
        y: -24,
        duration: 0.22,
        ease: 'power2.in'
      });

      // Lift preloader upward
      tl.to(preloader, {
        yPercent: -100,
        duration: 0.85,
        ease: 'power4.inOut'
      }, '-=0.05');

      // Simultaneously flatten curve as it finishes
      if (curveWrap) {
        tl.to(curveWrap, {
          height: '0vh',
          duration: 0.85,
          ease: 'power4.inOut'
        }, '<');
      }
    }
  }

  // Initial stay on first greeting then begin sequence
  setTimeout(nextGreeting, 245);
}
