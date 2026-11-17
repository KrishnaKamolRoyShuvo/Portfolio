/**
 * Interactive Developer Terminal CLI
 */
export function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  if (!terminalBody || !terminalInput) return;

  const history = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () => `
<div class="text-cyan-400 font-bold mb-1">Available System Commands:</div>
<div class="grid grid-cols-2 sm:grid-cols-3 gap-1 text-slate-300">
  <div><span class="text-indigo-400">help</span> - Display command list</div>
  <div><span class="text-indigo-400">about</span> - Brief summary</div>
  <div><span class="text-indigo-400">skills</span> - Technical matrix</div>
  <div><span class="text-indigo-400">projects</span> - Flagship systems</div>
  <div><span class="text-indigo-400">contact</span> - Phone, email, socials</div>
  <div><span class="text-indigo-400">thesis</span> - Vision Transformer ML</div>
  <div><span class="text-indigo-400">hire</span> - Open to opportunities</div>
  <div><span class="text-indigo-400">clear</span> - Clear terminal buffer</div>
</div>`,

    about: () => `
<div class="text-slate-300">
  <span class="text-cyan-400 font-bold">Krishna Kamol Roy Shuvo</span> - Software Engineer & Systems Developer.<br>
  B.Sc. in Computer Science & Engineering from IUBAT (2026, CGPA: 3.30).<br>
  Former Software Developer Intern at <span class="text-emerald-400">FeroTech Ltd.</span> building ASP.NET Core & Neon PostgreSQL architectures.<br>
  Published 3rd Author at <span class="text-indigo-400">Springer Nature (ICACCP 2025)</span> in benchmark ML fake news detection.
</div>`,

    skills: () => `
<div class="text-slate-300 space-y-1">
  <div><span class="text-cyan-400 font-bold">Languages:</span> C, C++, C#, Java, JavaScript, Python, SQL</div>
  <div><span class="text-indigo-400 font-bold">Backend & Frameworks:</span> ASP.NET Core MVC, Entity Framework Core, SignalR, MERN Stack (Node, Express)</div>
  <div><span class="text-emerald-400 font-bold">Databases:</span> PostgreSQL (Neon Serverless), MS SQL Server, SSMS, MongoDB</div>
  <div><span class="text-amber-400 font-bold">Systems & Networking:</span> DNS/DHCP, IP Addressing, Server Diagnostics, LAN/WLAN, Windows Admin</div>
  <div><span class="text-purple-400 font-bold">Machine Learning:</span> Vision Transformer (ViT), CNN-LSTM, PyTorch, Scikit-Learn</div>
</div>`,

    projects: () => `
<div class="text-slate-300 space-y-2">
  <div>
    <span class="text-cyan-400 font-bold">1. MicroShift (Job Portal & Escrow):</span><br>
    ASP.NET Core MVC, SignalR, Stripe Escrow, Leaflet.js, Neon PostgreSQL.<br>
    Live Demo: <a href="https://microshift.onrender.com" target="_blank" class="text-indigo-400 underline">microshift.onrender.com</a>
  </div>
  <div>
    <span class="text-cyan-400 font-bold">2. School Management & Admission:</span><br>
    React, Node.js, Express, Neon PostgreSQL. Dual-portal student & admin platform.<br>
    Live Demo: <a href="https://school-admission-6bz8.onrender.com" target="_blank" class="text-indigo-400 underline">school-admission-6bz8.onrender.com</a>
  </div>
  <div>
    <span class="text-cyan-400 font-bold">3. Smart Car Parking System:</span><br>
    MERN Stack, dynamic surge pricing algorithm, real-time slot reservation.
  </div>
</div>`,

    thesis: () => `
<div class="text-slate-300">
  <span class="text-cyan-400 font-bold">Undergraduate Thesis:</span> Bangla Sign Language Detection with Machine Learning Multi-Modal Approach.<br>
  Dual-stream architecture fusing spatial feature vectors via <span class="text-indigo-400 font-semibold">Vision Transformer (ViT)</span> with sequential joint temporal dynamics using <span class="text-emerald-400 font-semibold">CNN-LSTM</span> with late fusion.
</div>`,

    contact: () => `
<div class="text-slate-300 space-y-1">
  <div><span class="text-cyan-400">Email:</span> <a href="mailto:kk.roy.shuvo@gmail.com" class="text-indigo-400 underline">kk.roy.shuvo@gmail.com</a></div>
  <div><span class="text-cyan-400">Phone / WhatsApp:</span> <a href="tel:+8801761650989" class="text-indigo-400 underline">+88 01761 650 989</a></div>
  <div><span class="text-cyan-400">LinkedIn:</span> <a href="https://www.linkedin.com/in/krishna-kamol-royshuvo/" target="_blank" class="text-indigo-400 underline">linkedin.com/in/krishna-kamol-royshuvo</a></div>
  <div><span class="text-cyan-400">GitHub:</span> <a href="https://github.com/KrishnaKamolRoyShuvo" target="_blank" class="text-indigo-400 underline">github.com/KrishnaKamolRoyShuvo</a></div>
  <div><span class="text-cyan-400">Location:</span> Uttara-10, Dhaka-1230, Bangladesh</div>
</div>`,

    hire: () => `
<div class="text-emerald-400 font-bold">
  [SUCCESS] Currently open to Full-Stack Software Engineer, Backend (.NET / Node), and Systems/IT Executive roles.<br>
  <span class="text-slate-300 font-normal">Feel free to book a direct conversation or send an inquiry below!</span>
</div>`
  };

  function appendOutput(cmd, htmlContent) {
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

  // Focus terminal input when clicking anywhere inside terminal box
  const terminalCard = document.getElementById('terminal-card');
  if (terminalCard) {
    terminalCard.addEventListener('click', () => {
      terminalInput.focus();
    });
  }
}
