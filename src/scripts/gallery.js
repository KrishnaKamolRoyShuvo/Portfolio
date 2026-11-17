/**
 * Interactive Client Portfolio Gallery (36 Projects)
 */

export function initGallery(cursorController) {
  const container = document.getElementById('client-gallery-grid');
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  if (!container) return;

  let allProjects = [];

  async function loadProjects() {
    try {
      const res = await fetch('projects.json');
      if (res.ok) {
        allProjects = await res.json();
      } else {
        throw new Error('Fallback to local');
      }
    } catch {
      // If fetching fails during dev or relative path
      console.warn('Using inline fallback for projects list');
    }

    renderGallery('*');
  }

  function renderGallery(filterCategory) {
    const filtered =
      filterCategory === '*'
        ? allProjects
        : allProjects.filter((p) => {
            const cat = (p.category || '').toLowerCase();
            return cat.includes(filterCategory.toLowerCase());
          });

    container.innerHTML = filtered
      .map((p, idx) => {
        const isLive = p.status === 200 || p.status === '200';
        const statusBadge = isLive
          ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Site
            </span>`
          : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Client Project
            </span>`;

        const imgSrc = p.local_image || p.image;
        const targetUrl = p.url || '#';

        return `
          <div class="glass-card group rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800 hover:border-cyan-500/50 transition-all duration-300" data-tilt data-cursor="view">
            <div class="relative overflow-hidden aspect-[16/10] bg-slate-900">
              <img 
                src="${imgSrc}" 
                alt="${p.title}" 
                loading="lazy" 
                class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onerror="this.src='images/profile-hero.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute top-3 right-3">
                ${statusBadge}
              </div>
              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span class="text-[11px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded backdrop-blur">
                  ${p.category || 'Web App'}
                </span>
              </div>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                  ${p.title}
                </h4>
                <p class="text-xs text-slate-400 font-mono line-clamp-1 mb-4">
                  ${p.url ? p.url.replace(/^https?:\/\//, '') : 'Confidential Client'}
                </p>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <a 
                  href="${targetUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Visit Website</span>
                  <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <span class="text-[10px] text-slate-500 font-mono">#${idx + 1}</span>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    if (cursorController && cursorController.attachHoverListeners) {
      cursorController.attachHoverListeners();
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
        b.classList.add('text-slate-400', 'border-slate-800');
      });
      btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');
      btn.classList.remove('text-slate-400', 'border-slate-800');

      const filter = btn.getAttribute('data-gallery-filter');
      renderGallery(filter);
    });
  });

  loadProjects();
}
