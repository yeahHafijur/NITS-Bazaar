// ===== UTILITY FUNCTIONS =====
function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// ===== USER AUTH =====
function initUserAuth() {
  const user = localStorage.getItem('currentUser');
  const authLinks = document.getElementById('auth-links');
  const profileMenu = document.getElementById('profile-menu');
  const userName = document.getElementById('user-name');

  if (user) {
    if (authLinks) authLinks.style.display = 'none';
    if (profileMenu) profileMenu.style.display = 'inline-block';
    if (userName) userName.textContent = `Hi, ${user}`;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      };
    }
  } else {
    if (authLinks) authLinks.style.display = 'inline';
    if (profileMenu) profileMenu.style.display = 'none';
  }
}


// ===== DARK MODE TOGGLE =====
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  updateDarkModeIcon(isDarkMode);
}

function updateDarkModeIcon(isDarkMode) {
  const toggleBtn = document.getElementById('darkModeToggle');
  if (!toggleBtn) return;
  
  const icon = isDarkMode ? '☀️' : '🌓';
  const text = isDarkMode ? 'Light Mode' : 'Dark Mode';
  
  toggleBtn.innerHTML = `<span aria-hidden="true">${icon}</span> <span class="sr-only">${text}</span>`;
  toggleBtn.setAttribute('aria-pressed', isDarkMode);
}

function initDarkMode() {
  try {
    let darkModeToggle = document.getElementById('darkModeToggle');

    // Ensure toggle exists
    if (!darkModeToggle) {
      const nav = document.querySelector('header nav');
      if (!nav) return;
      
      darkModeToggle = document.createElement('button');
      darkModeToggle.id = 'darkModeToggle';
      darkModeToggle.className = 'dark-mode-btn';
      darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
      darkModeToggle.setAttribute('aria-pressed', 'false');
      nav.appendChild(darkModeToggle);
    }

    // Add event listener
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Apply saved mode
    const savedMode = localStorage.getItem('darkMode') === 'true';
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }
    updateDarkModeIcon(savedMode);
  } catch (e) {
    console.error('Dark mode initialization failed:', e);
  }
}

// ===== NAVIGATION ACTIVE LINK =====
function setActiveNav() {
  try {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
      const linkPage = link.getAttribute('href');
      const isActive = 
        linkPage === currentPage ||
        (currentPage === 'index.html' && linkPage === '') ||
        (currentPage === '' && linkPage === 'index.html');
      link.classList.toggle('active', isActive);
    });
  } catch (e) {
    console.error('Active nav initialization failed:', e);
  }
}

// ===== INITIALIZE FAVORITES =====
function initFavorites() {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn('LocalStorage not available - favorites disabled');
      return;
    }

    if (!localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
  } catch (e) {
    console.error('Favorites initialization failed:', e);
  }
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initUserAuth();
  initDarkMode();
  setActiveNav();
  initFavorites();
});