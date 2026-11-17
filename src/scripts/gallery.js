/**
 * Interactive Client Portfolio Bento Gallery (36 Projects)
 * Inspired by modern emerald/teal glowing bento-grid aesthetic
 * Active verified sites prioritized on top + Progressive variable step reveal
 */

export function initGallery(cursorController) {
  const container = document.getElementById('client-gallery-grid');
  const loadMoreBtn = document.getElementById('load-more-projects-btn');
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  if (!container) return;

  let allProjects = [];
  let currentFiltered = [];
  let visibleCount = 6;
  const stepSize = 6; // Completes 2 full rows (3 cols per row) per click

  async function loadProjects() {
    try {
      const res = await fetch('projects.json');
      if (res.ok) {
        allProjects = await res.json();
      } else {
        throw new Error('Failed to load JSON');
      }
    } catch {
      console.warn('Fallback: checking local projects array');
    }

    // Sort: Verified active links (HTTP 200) first!
    allProjects.sort((a, b) => {
      const aLive = a.status === 200 || a.status === '200' ? 1 : 0;
      const bLive = b.status === 200 || b.status === '200' ? 1 : 0;
      return bLive - aLive;
    });

    applyFilter('*');
  }

  function applyFilter(category) {
    visibleCount = 6; // reset count on filter change
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
    const toShow = currentFiltered.slice(0, visibleCount);

    container.innerHTML = toShow
      .map((p, idx) => {
        const isLive = p.status === 200 || p.status === '200';
        const isFeaturedSpan = idx % 5 === 0; // Bento variation: every 5th card spans 2 columns on lg screens

        const statusBadge = isLive
          ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Online
            </span>`
          : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              Delivered Work
            </span>`;

        const imgSrc = p.local_image || p.image;
        const targetUrl = p.url || '#';

        return `
          <div class="bento-card group rounded-3xl overflow-hidden flex flex-col justify-between border border-emerald-950/80 hover:border-emerald-500/50 bg-[#061817]/60 backdrop-blur-xl transition-all duration-500 shadow-xl hover:shadow-emerald-950/40 ${isFeaturedSpan ? 'sm:col-span-2 lg:col-span-2' : ''}" data-tilt data-cursor="view">
            <div class="relative overflow-hidden aspect-[16/9] bg-slate-950">
              <img 
                src="${imgSrc}" 
                alt="${p.title}" 
                loading="lazy" 
                class="w-full h-full object-cover object-top filter brightness-[0.92] group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                onerror="this.src='images/profile-hero.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#061817] via-transparent to-transparent opacity-90"></div>
              <div class="absolute top-3.5 right-3.5">
                ${statusBadge}
              </div>
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span class="text-[11px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40 backdrop-blur">
                  ${p.category || 'Client System'}
                </span>
                <span class="text-[10px] text-emerald-400/60 font-mono">#${idx + 1}</span>
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 class="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  ${p.title}
                </h4>
                <p class="text-xs text-emerald-300/60 font-mono line-clamp-1 mt-1">
                  ${p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Commercial Client'}
                </p>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-emerald-900/40">
                <a 
                  href="${targetUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
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

    // Update Load More Button state
    if (loadMoreBtn) {
      if (visibleCount >= currentFiltered.length) {
        loadMoreBtn.innerHTML = `
          <span>All ${currentFiltered.length} Projects Unveiled</span>
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        `;
        loadMoreBtn.classList.add('opacity-60', 'pointer-events-none');
      } else {
        loadMoreBtn.classList.remove('opacity-60', 'pointer-events-none');
        loadMoreBtn.innerHTML = `
          <span>Explore More Projects (${visibleCount} of ${currentFiltered.length})</span>
          <svg class="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        `;
      }
    }

    if (cursorController && cursorController.attachHoverListeners) {
      cursorController.attachHoverListeners();
    }
  }

  // Handle Load More Button Click
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += stepSize;
      render();
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
