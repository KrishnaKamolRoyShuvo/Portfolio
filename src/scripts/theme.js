/**
 * Dark Mode & Day Mode Theme Controller
 * Defaults dynamically to real-time wall clock (Day: 6 AM - 6 PM; Night: 6 PM - 6 AM)
 * Allows visitor to manually toggle and persist preference.
 */
export function initTheme(callbacks = {}) {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme');
  let currentTheme = savedTheme;
  if (!currentTheme) {
    const hour = new Date().getHours();
    currentTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }

  function setTheme(theme, isManualAction = false) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      if (isManualAction) {
        localStorage.setItem('theme', 'light');
      }
      if (toggleBtn) {
        toggleBtn.innerHTML = `
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        `;
        toggleBtn.setAttribute('title', 'Switch to Dark Mode');
      }
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      if (isManualAction) {
        localStorage.setItem('theme', 'dark');
      }
      if (toggleBtn) {
        toggleBtn.innerHTML = `
          <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        `;
        toggleBtn.setAttribute('title', 'Switch to Light Mode');
      }
    }

    if (callbacks.onThemeChange) {
      callbacks.onThemeChange(theme);
    }
  }

  // Initialize icon & state
  setTheme(currentTheme, false);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light', true);
    });
  }

  return { setTheme };
}
