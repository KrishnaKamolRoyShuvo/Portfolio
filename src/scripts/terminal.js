/**
 * Interactive Developer Terminal CLI with Ghost Command Watermark
 */
export function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const ghostWatermark = document.getElementById('terminal-ghost-watermark');
  if (!terminalBody || !terminalInput) return;

  const history = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () => `
<div class="text-cyan-400 font-bold mb-1">Available System Commands:</div>
<div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-slate-300">
  <div><span class="text-emerald-400">help</span> - Display this manual</div>
  <div><span class="text-emerald-400">about</span> - Executive candidate summary</div>
  <div><span class="text-emerald-400">skills</span> - Technical matrix & tools</div>
  <div><span class="text-emerald-400">projects</span> - Production software systems</div>
  <div><span class="text-emerald-400">research</span> - Springer Nature 2025 publication</div>
  <div><span class="text-emerald-400">academic</span> - Education & honors</div>
  <div><span class="text-emerald-400">experience</span> - FeroTech & commercial delivery</div>
  <div><span class="text-emerald-400">cv</span> - Download official CV (PDF)</div>
  <div><span class="text-emerald-400">contact</span> - Phone, email, socials</div>
  <div><span class="text-emerald-400">clear</span> - Clear terminal buffer</div>
</div>`,

    about: () => `
<div class="text-slate-300 leading-relaxed">
  <span class="text-cyan-400 font-bold">Krishna Kamol Roy Shuvo</span> - Software Engineer & Systems Developer.<br>
  B.Sc. in Computer Science & Engineering from <span class="text-indigo-400">IUBAT (2026, CGPA: 3.30)</span>.<br>
  Former Software Developer Intern at <span class="text-emerald-400">FeroTech Ltd.</span> building ASP.NET Core & Neon PostgreSQL architectures.<br>
  Published 3rd Author at <span class="text-cyan-400 font-semibold">Springer Nature (ICACCP 2025)</span> on deep learning disinformation benchmarks.
</div>`,

    skills: () => `
<div class="text-slate-300 space-y-1">
  <div><span class="text-cyan-400 font-bold">Languages:</span> C, C++, C#, Java, JavaScript, Python, SQL</div>
  <div><span class="text-emerald-400 font-bold">Backend & Frameworks:</span> ASP.NET Core MVC, Entity Framework Core, SignalR, Node.js, Express</div>
  <div><span class="text-indigo-400 font-bold">Databases:</span> Neon Serverless PostgreSQL, MS SQL Server (SSMS), MongoDB Atlas</div>
  <div><span class="text-amber-400 font-bold">Systems & Networking:</span> DNS/DHCP, IP Addressing, Server Diagnostics, LAN/WLAN Diagnostics</div>
  <div><span class="text-purple-400 font-bold">AI / Machine Learning:</span> Vision Transformer (ViT), CNN-LSTM, PyTorch, Scikit-Learn</div>
</div>`,

    projects: () => `
<div class="text-slate-300 space-y-2">
  <div>
    <span class="text-cyan-400 font-bold">1. MicroShift (Job Portal & Escrow):</span><br>
    ASP.NET Core MVC, SignalR, Stripe Escrow, Leaflet.js, Neon PostgreSQL.<br>
    Live Demo: <a href="https://microshift.onrender.com" target="_blank" class="text-emerald-400 underline">microshift.onrender.com</a> (Admin: admin112@microshift.com / Pass@1234)
  </div>
  <div>
    <span class="text-cyan-400 font-bold">2. School Management & Admission:</span><br>
    React, Node.js, Express, Neon PostgreSQL. Dual-portal student & admin platform.<br>
    Live Demo: <a href="https://school-admission-6bz8.onrender.com" target="_blank" class="text-emerald-400 underline">school-admission-6bz8.onrender.com</a>
  </div>
  <div>
    <span class="text-cyan-400 font-bold">3. Smart Car Parking System:</span><br>
    MERN Stack, dynamic surge pricing algorithm, real-time slot reservation.
  </div>
</div>`,

    research: () => `
<div class="text-slate-300 space-y-2">
  <div class="text-cyan-400 font-bold">Springer Nature ICACCP 2025 Publication:</div>
  <div><em>"Advanced Fake News Detection: A Benchmark Study Using Machine Learning, Deep Learning and Ensemble Methods"</em></div>
  <div class="text-xs text-slate-400">Authorship: 3rd Author | Pages: 396–406 | DOI: <a href="https://doi.org/10.1007/978-3-032-13555-1_34" target="_blank" class="text-indigo-400 underline">10.1007/978-3-032-13555-1_34</a></div>
  <div class="text-emerald-400 font-bold mt-2">Undergraduate ML Thesis:</div>
  <div><em>"Bangla Sign Language Detection with Machine Learning Multi-Modal Approach"</em> (Vision Transformer + CNN-LSTM Late Fusion).</div>
</div>`,

    academic: () => `
<div class="text-slate-300 space-y-1.5">
  <div><span class="text-cyan-400 font-bold">B.Sc. in Computer Science & Engineering (2026):</span> International University of Business Agriculture & Technology (IUBAT) — CGPA: 3.30/4.00</div>
  <div><span class="text-emerald-400 font-bold">Higher Secondary Certificate (HSC 2020):</span> Carmichael College, Rangpur — GPA: 5.00/5.00</div>
  <div><span class="text-indigo-400 font-bold">Secondary School Certificate (SSC 2018):</span> Rangpur Zilla School — GPA: 5.00/5.00</div>
  <div><span class="text-amber-400 font-bold">Debate Honors:</span> Champion, Somokal Regional Debate 2017 | Best Debater, Digital Unnoyon-Mela 2017</div>
</div>`,

    experience: () => `
<div class="text-slate-300 space-y-2">
  <div>
    <span class="text-cyan-400 font-bold">Software Developer Intern — FeroTech Ltd.</span> (Dec 2025 – May 2026)<br>
    Independently developed enterprise ASP.NET Core job marketplace with Neon PostgreSQL, Stripe Escrow, SignalR, and EXIF forensic dispute analysis.
  </div>
  <div>
    <span class="text-emerald-400 font-bold">Freelance Web Developer</span> (Oct 2024 – Dec 2025)<br>
    Delivered 30+ responsive web platforms to international and domestic clients, earning $1,200+ USD in client contracts.
  </div>
</div>`,

    education: () => `
<div class="text-slate-300">
  Type <span class="text-cyan-400 font-bold">academic</span> to view comprehensive university degree, college, and high-school honors.
</div>`,

    cv: () => `
<div class="text-emerald-400 font-bold">
  [DOWNLOAD PROTOCOL] Official CV ready:
  <a href="Krishna_Kamol_Roy_Shuvo_CV.pdf" download="Krishna_Kamol_Roy_Shuvo_CV.pdf" class="text-cyan-400 underline ml-2">Click to Download Krishna_Kamol_Roy_Shuvo_CV.pdf</a>
</div>`,

    contact: () => `
<div class="text-slate-300 space-y-1">
  <div><span class="text-cyan-400">Email:</span> <a href="mailto:kk.roy.shuvo@gmail.com" class="text-emerald-400 underline">kk.roy.shuvo@gmail.com</a></div>
  <div><span class="text-cyan-400">Phone:</span> <a href="tel:+8801761650989" class="text-emerald-400 underline">+88 01761 650 989</a> (WhatsApp available)</div>
  <div><span class="text-cyan-400">LinkedIn:</span> <a href="https://www.linkedin.com/in/krishna-kamol-royshuvo/" target="_blank" class="text-emerald-400 underline">linkedin.com/in/krishna-kamol-royshuvo</a></div>
  <div><span class="text-cyan-400">GitHub:</span> <a href="https://github.com/KrishnaKamolRoyShuvo" target="_blank" class="text-emerald-400 underline">github.com/KrishnaKamolRoyShuvo</a></div>
  <div><span class="text-cyan-400">Location:</span> Uttara-10, Dhaka-1230, Bangladesh</div>
</div>`,

    hire: () => `
<div class="text-emerald-400 font-bold">
  [AVAILABLE] Actively interviewing for Full-Stack Software Engineer, Backend (.NET / Node), and Systems roles.<br>
  <span class="text-slate-300 font-normal">Direct phone: +88 01761 650 989 • Email: kk.roy.shuvo@gmail.com</span>
</div>`
  };

  function appendOutput(cmd, htmlContent) {
    if (ghostWatermark) {
      ghostWatermark.style.opacity = '0';
      ghostWatermark.style.pointerEvents = 'none';
    }

    const entry = document.createElement('div');
    entry.className = 'mb-2';
    entry.innerHTML = `
      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span class="text-cyan-400 font-mono">guest@shuvo:~$</span>
        <span class="text-white font-mono font-semibold">${cmd}</span>
      </div>
      <div class="mt-1 text-xs font-mono">${htmlContent}</div>
    `;
    terminalBody.appendChild(entry);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim();
      const cmd = rawCmd.toLowerCase();
      terminalInput.value = '';

      if (!cmd) return;

      history.push(rawCmd);
      historyIndex = history.length;

      if (cmd === 'clear') {
        terminalBody.innerHTML = '';
        if (ghostWatermark) ghostWatermark.style.opacity = '0.12';
        return;
      }

      if (COMMANDS[cmd]) {
        appendOutput(rawCmd, COMMANDS[cmd]());
      } else {
        appendOutput(
          rawCmd,
          `<span class="text-rose-400">Command not found: "${rawCmd}". Type <span class="text-cyan-400 underline cursor-pointer" onclick="document.getElementById('terminal-input').value='help'; document.getElementById('terminal-input').focus();">help</span> to view available commands.</span>`
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  const terminalCard = document.getElementById('terminal-card');
  if (terminalCard) {
    terminalCard.addEventListener('click', () => {
      terminalInput.focus();
    });
  }
}
