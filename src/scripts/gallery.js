/**
 * Interactive Client Portfolio Bento Gallery (36 Projects)
 * Progressive Reveal Sequence: 7 -> 12 -> 20 -> 30 -> 36
 * Formulated so every step forms a clean, complete solid rectangular layout.
 */

export function initGallery(cursorController) {
  const container = document.getElementById('client-gallery-grid');
  const loadMoreBtn = document.getElementById('load-more-projects-btn');
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  if (!container) return;

  const STEPS = [7, 12, 20, 30, 36];
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
    currentStepIndex = 0; // Reset to 7 on filter change
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
        
        // Bento rectangular layout calculations:
        // When 7 items shown: Item 0 and Item 6 span 2 cols to complete a perfect 3x3 rectangle on lg, and 2-col on md
        // When 20 items shown: Item 0 spans 2 cols to fill 21 column slots (7 rows of 3)
        let spanClass = '';
        if (targetCount === 7 && (idx === 0 || idx === 6)) {
          spanClass = 'sm:col-span-2 lg:col-span-2';
        } else if (targetCount === 20 && idx === 0) {
          spanClass = 'sm:col-span-2 lg:col-span-2';
        }

        const statusBadge = isLive
          ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 dark:text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Online
            </span>`
          : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-400 border border-slate-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Client System
            </span>`;

        const imgSrc = p.local_image || p.image;
        const targetUrl = p.url || '#';

        return `
          <div class="bento-card group rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 shadow-xl ${spanClass}" data-tilt data-cursor="view">
            <div class="relative overflow-hidden aspect-[16/9] bg-slate-950">
              <img 
                src="${imgSrc}" 
                alt="${p.title}" 
                loading="lazy" 
                class="w-full h-full object-cover object-top filter brightness-[0.95] group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                onerror="this.src='images/profile-hero.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85"></div>
              <div class="absolute top-3.5 right-3.5">
                ${statusBadge}
              </div>
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span class="text-[11px] font-mono uppercase tracking-wider text-emerald-400 dark:text-emerald-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur">
                  ${p.category || 'Client System'}
                </span>
                <span class="text-[10px] text-slate-400 font-mono">#${idx + 1}</span>
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 class="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  ${p.title}
                </h4>
                <p class="text-xs text-slate-300 font-mono line-clamp-1 mt-1">
                  ${p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Commercial Client'}
                </p>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <a 
                  href="${targetUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
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
        loadMoreBtn.classList.add('opacity-60', 'pointer-events-none');
      } else {
        const nextTarget = STEPS[currentStepIndex + 1];
        loadMoreBtn.classList.remove('opacity-60', 'pointer-events-none');
        loadMoreBtn.innerHTML = `
          <span>Explore More Projects (${toShow.length} of ${currentFiltered.length})</span>
          <svg class="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        `;
      }
    }

    if (cursorController && cursorController.attachHoverListeners) {
      cursorController.attachHoverListeners();
    }
  }

  // Handle Load More Step Click (7 -> 12 -> 20 -> 30 -> 36)
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (currentStepIndex < STEPS.length - 1) {
        currentStepIndex++;
        render();
      }
    });
  }

  // Handle Category Filters
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-500');
        b.classList.add('text-slate-400', 'border-slate-800');
      });
      btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-500');
      btn.classList.remove('text-slate-400', 'border-slate-800');

      const filter = btn.getAttribute('data-gallery-filter');
      applyFilter(filter);
    });
  });

  loadProjects();
}
