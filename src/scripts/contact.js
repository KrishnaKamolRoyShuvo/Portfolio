/**
 * Contact Hub, Live Clock, 1-Click Copy & vCard Generation
 */

export function initContactFeatures() {
  // 1. Live Dhaka, Bangladesh Time Clock
  const clockEl = document.getElementById('dhaka-live-clock');
  function updateClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `${timeStr} (GMT+6, Dhaka)`;
    } catch {
      clockEl.textContent = 'Dhaka, Bangladesh (GMT+6)';
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 2. 1-Click Copy Functionality
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text');
      const originalText = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = `
          <svg class="w-4 h-4 text-emerald-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-emerald-400 font-semibold ml-1">Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });

  // 3. Contact Form Submission
  const contactForm = document.getElementById('direct-contact-form');
  const formStatus = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('sender_name') || '';
      const email = formData.get('sender_email') || '';
      const topic = formData.get('inquiry_topic') || 'Portfolio Inquiry';
      const message = formData.get('sender_message') || '';

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.innerHTML = `<span class="text-rose-400 font-semibold">Please fill in all required fields.</span>`;
        }
        return;
      }

      // Generate mailto link as guaranteed universal fallback
      const subject = encodeURIComponent(`[${topic}] Message from ${name}`);
      const body = encodeURIComponent(
        `Hi Krishna,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`
      );
      const mailtoUrl = `mailto:kk.roy.shuvo@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.innerHTML = `
          <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs">
            ✓ Preparing message for <strong>kk.roy.shuvo@gmail.com</strong>. Opening your email client...
          </div>
        `;
      }

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  // 4. vCard Download (.vcf)
  const vcardBtn = document.getElementById('download-vcard-btn');
  if (vcardBtn) {
    vcardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Roy Shuvo;Krishna;Kamol;;',
        'FN:Krishna Kamol Roy Shuvo',
        'ORG:Software Engineer',
        'TITLE:Software Engineer & Systems Developer',
        'TEL;TYPE=CELL,VOICE:+8801761650989',
        'EMAIL;TYPE=PREF,INTERNET:kk.roy.shuvo@gmail.com',
        'URL:https://KrishnaKamolRoyShuvo.github.io/portfolio',
        'URL;TYPE=GitHub:https://github.com/KrishnaKamolRoyShuvo',
        'URL;TYPE=LinkedIn:https://www.linkedin.com/in/krishna-kamol-royshuvo/',
        'ADR;TYPE=HOME:;;House-78, Road-3/a, Palpara;Rangpur;;5400;Bangladesh',
        'NOTE:B.Sc. in CSE from IUBAT | ASP.NET Core, MERN & ML Researcher',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Krishna_Kamol_Roy_Shuvo.vcf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}
