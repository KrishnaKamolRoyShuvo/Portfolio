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
                // Stays for 225ms before next transition (+0.5s total across sequence)
                setTimeout(nextGreeting, 225);
              }
            }
          );
        }
      });
    } else {
      // Finished all greetings: outro transition with semi-rounded bottom
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

      // Semi-rounded bottom curve (gentle arc, not overly carved)
      if (svgCurve) {
        tl.to(svgCurve, {
          attr: { d: 'M0 0 L100 0 L100 80 Q50 115 0 80 Z' },
          duration: 0.7,
          ease: 'power3.in'
        }, '-=0.08');
      }

      tl.to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut'
      }, '-=0.55');
    }
  }

  // Initial stay on first greeting then begin sequence
  setTimeout(nextGreeting, 270);
}
