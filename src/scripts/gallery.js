/**
 * Interactive Client Portfolio Bento Gallery (36 Projects)
 * Exact Bento Pattern:
 *   Row 1-2: 1 Big Left (cols 1-2, rows 1-2) + 2 Small Right (col 3)
 *   Row 3:   3 Small Horizontal (cols 1, 2, 3)
 *   Row 4-5: 2 Small Left (col 1) + 1 Big Right (cols 2-3, rows 4-5)
 *   Row 6:   3 Small Horizontal (cols 1, 2, 3)
 *   Repeats cyclically every 12 items (6 items per 3 rows).
 * Reveal Steps: 6 -> 12 -> 18 -> 24 -> 30 -> 36 (Solid Rectangular Geometry).
 */

export function initGallery(cursorController) {
  const container = document.getElementById('client-gallery-grid');
  const loadMoreBtn = document.getElementById('load-more-projects-btn');
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  if (!container) return;

  const STEPS = [6, 12, 18, 24, 30, 36];
  let currentStepIndex = 0;
  let allProjects = [];
  let currentFiltered = [];

  async function loadProjects() {
    try {
      const res = await fetch('projects.json');
      if (res.ok) {
        allProjects = await res.json();
      } else {
        throw new Error('Fallback to local');
      }
    } catch {
      console.warn('Fallback loading projects');
    }

    // Sort: Live working links (HTTP 200) strictly on top
    allProjects.sort((a, b) => {
      const aLive = a.status === 200 || a.status === '200' ? 1 : 0;
      const bLive = b.status === 200 || b.status === '200' ? 1 : 0;
      return bLive - aLive;
    });

    applyFilter('*');
  }

  function applyFilter(category) {
    currentStepIndex = 0; // Reset to first step on filter change
    if (category === '*') {
      currentFiltered = allProjects;
    } else {
      currentFiltered = allProjects.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes(category.toLowerCase());
      });
    }
    render();
  }

  function render() {
    const targetCount = STEPS[currentStepIndex] || 36;
    const toShow = currentFiltered.slice(0, targetCount);

    container.innerHTML = toShow
      .map((p, idx) => {
        const isLive = p.status === 200 || p.status === '200';
        const imgSrc = p.local_image || p.image;
        const targetUrl = p.url || '#';

        const statusBadge = isLive
          ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Online
            </span>`
          : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-400 border border-slate-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Client System
            </span>`;

        return `
          <div class="bento-card group rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl col-span-1 row-span-1" data-tilt data-cursor="view">
            <div class="relative overflow-hidden aspect-[16/10] bg-slate-950">
              <img 
                src="${imgSrc}" 
                alt="${p.title}" 
                loading="lazy" 
                class="w-full h-full object-cover object-top filter brightness-[0.95] group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                onerror="this.src='images/profile-hero.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              <div class="absolute top-3.5 right-3.5 z-10">
                ${statusBadge}
              </div>
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                <span class="text-[11px] font-mono uppercase tracking-wider text-emerald-400 dark:text-emerald-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur">
                  ${p.category || 'Client System'}
                </span>
                <span class="text-[10px] text-slate-400 font-mono">#${idx + 1}</span>
              </div>
            </div>

            <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 class="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  ${p.title}
                </h4>
                <p class="text-xs text-slate-400 font-mono line-clamp-1 mt-1">
                  ${p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Commercial Client'}
                </p>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <a 
                  href="${targetUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  <span>Launch Website</span>
                  <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <span class="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors"></span>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // Update Load More Button label and step state
    if (loadMoreBtn) {
      if (toShow.length >= currentFiltered.length || currentStepIndex >= STEPS.length - 1) {
        loadMoreBtn.innerHTML = `
          <span>All ${currentFiltered.length} Projects Unveiled</span>
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        `;
        loadMoreBtn.disabled = true;
        loadMoreBtn.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        const nextTarget = STEPS[currentStepIndex + 1] || currentFiltered.length;
        const remaining = Math.min(nextTarget, currentFiltered.length) - toShow.length;
        loadMoreBtn.innerHTML = `
          <span>Unveil More Projects (+${remaining})</span>
          <svg class="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        `;
        loadMoreBtn.disabled = false;
        loadMoreBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  // Load More Button Event
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (currentStepIndex < STEPS.length - 1) {
        currentStepIndex++;
        render();
        // Re-init tilt on newly injected cards
        if (window.VanillaTilt) {
          const newCards = container.querySelectorAll('[data-tilt]');
          window.VanillaTilt.init(newCards, { max: 8, speed: 400, glare: true, 'max-glare': 0.15 });
        }
      }
    });
  }

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-emerald-500', 'text-slate-950', 'shadow-lg');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('bg-emerald-500', 'text-slate-950', 'shadow-lg');
      btn.classList.remove('text-slate-400');

      const filterVal = btn.getAttribute('data-gallery-filter');
      applyFilter(filterVal);
    });
  });

  loadProjects();
}
