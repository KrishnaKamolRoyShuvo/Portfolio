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

  const STEPS = [7, 14, 21, 28, 35, 36];
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

  const SLOTS = [
    { row: 'wide' },
    { row: false },
    { row: false },
    { row: false },
    { row: false },
    { row: false },
    { row: 'compact' },
  ];

  function render() {
    const targetCount = STEPS[currentStepIndex] || 36;
    const toShow = currentFiltered.slice(0, targetCount);

    const isFinalBlockWithWide = toShow.length % 7 === 1 && toShow.length > 7;
    const standardProjects = isFinalBlockWithWide ? toShow.slice(0, -1) : toShow;
    const wideProject = isFinalBlockWithWide ? toShow[toShow.length - 1] : null;

    // Group into 7-item bento blocks
    const chunks = [];
    for (let i = 0; i < standardProjects.length; i += 7) {
      chunks.push(standardProjects.slice(i, i + 7));
    }

    const blocksHtml = chunks
      .map((chunk, b) => {
        const mirror = b % 2 === 1;
        const groupClass = `bento-group ${mirror ? 'bento-cols-mirror' : 'bento-cols-normal'}`;

        const cardsHtml = chunk
          .map((p, i) => {
            const globalIdx = b * 7 + i;
            const slot = SLOTS[i] || { row: false };
            const isLive = p.status === 200 || p.status === '200';
            const imgSrc = p.local_image || p.image;
            const targetUrl = p.url || '#';
            const displayUrl = p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Commercial Client';

            const slotClass = mirror ? `slot-mirr-${i}` : `slot-norm-${i}`;
            const rowClass = slot.row === 'wide' ? 'card-row-wide' : slot.row === 'compact' ? 'card-row-compact' : 'card-col';

            const statusBadge = isLive
              ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Online
                </span>`
              : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-400 border border-slate-500/20 backdrop-blur">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Client System
                </span>`;

            return `
              <article class="bento-card ${slotClass} ${rowClass} group rounded-3xl p-3 flex flex-col justify-between overflow-hidden min-h-0 transition-all duration-300 shadow-xl col-span-1 row-span-1" data-tilt data-cursor="view">
                <div class="card-img-wrap relative overflow-hidden rounded-2xl bg-slate-950 aspect-[16/10] w-full min-h-0">
                  <div class="absolute top-3 left-3 z-10">${statusBadge}</div>
                  <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                    <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-black/75 px-2 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur">
                      ${p.category || 'Client System'}
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono bg-black/60 px-1.5 py-0.5 rounded">#${globalIdx + 1}</span>
                  </div>
                  <img 
                    src="${imgSrc}" 
                    alt="${p.title}" 
                    loading="lazy" 
                    class="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.95] group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                    onerror="this.src='images/profile-hero.jpg'"
                  />
                </div>

                <div class="card-content-wrap px-2 pb-1 flex flex-col justify-between">
                  <div>
                    <h4 class="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      ${p.title}
                    </h4>
                    <p class="mt-1 text-xs text-slate-400 font-mono line-clamp-1">
                      ${displayUrl}
                    </p>
                  </div>

                  <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <a 
                      href="${targetUrl}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Launch Website</span>
                      <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <span class="w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-600'}"></span>
                  </div>
                </div>
              </article>
            `;
          })
          .join('');

        return `<div class="${groupClass}">${cardsHtml}</div>`;
      })
      .join('');

    let wideHtml = '';
    if (wideProject) {
      const isLive = wideProject.status === 200 || wideProject.status === '200';
      const imgSrc = wideProject.local_image || wideProject.image;
      const targetUrl = wideProject.url || '#';
      const displayUrl = wideProject.url ? wideProject.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Commercial Client';

      const statusBadge = isLive
        ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Online
          </span>`
        : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-400 border border-slate-500/20 backdrop-blur">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Client System
          </span>`;

      wideHtml = `
        <article class="bento-card card-wide-final card-row-wide col-span-1 sm:col-span-2 xl:col-span-3 group rounded-3xl p-3 flex overflow-hidden min-h-0 transition-all duration-300 shadow-xl" data-tilt data-cursor="view">
          <div class="card-img-wrap relative overflow-hidden rounded-2xl bg-slate-950 aspect-[16/10] xl:aspect-auto w-full min-h-0">
            <div class="absolute top-3 left-3 z-10">${statusBadge}</div>
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
              <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-black/75 px-2 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur">
                ${wideProject.category || 'Client System'}
              </span>
              <span class="text-[10px] text-slate-400 font-mono bg-black/60 px-1.5 py-0.5 rounded">#36</span>
            </div>
            <img 
              src="${imgSrc}" 
              alt="${wideProject.title}" 
              loading="lazy" 
              class="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.95] group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
              onerror="this.src='images/profile-hero.jpg'"
            />
          </div>
          <div class="card-content-wrap px-2 pb-1 flex flex-col justify-between">
            <div>
              <h4 class="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                ${wideProject.title}
              </h4>
              <p class="mt-1 text-xs text-slate-400 font-mono line-clamp-1">
                ${displayUrl}
              </p>
            </div>
            <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <a 
                href="${targetUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Launch Website</span>
                <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <span class="w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-600'}"></span>
            </div>
          </div>
        </article>
      `;
    }

    container.innerHTML = blocksHtml + wideHtml;

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
