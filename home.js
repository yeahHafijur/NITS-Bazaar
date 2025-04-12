
// ===== ANIMATED COUNTER =====
function animateCounter(elementId, target) {
  let count = 0;
  const element = document.getElementById(elementId);
  const increment = target / 50;
  const timer = setInterval(() => {
    count += increment;
    element.textContent = Math.floor(count);
    if (count >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, 20);
}

// ===== TRENDING ITEMS =====
function loadTrendingItems() {
  const items = JSON.parse(localStorage.getItem('items')) || [];

  // Sort by views (highest first)
  const trending = [...items]
    .filter(item => !item.sold)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  renderTrendingItems(trending);
  setupFilters();
}

function renderTrendingItems(items) {
  const container = document.getElementById('trending-items');
  container.innerHTML = items.map(item => `
    <div class="trending-item" data-category="${item.category.toLowerCase()}">
      <img src="${item.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${item.title}">
      <div class="info">
        <h3>${item.title}</h3>
        <p>${item.desc.substring(0, 40)}...</p>
        <span class="price">₹${item.price}</span>
        <span style="font-size: 0.85rem; color: var(--text-light);">👀 ${item.views || 0} views</span>
      </div>
    </div>
  `).join('');
}

function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const allItems = document.querySelectorAll('.trending-item');

      allItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  animateCounter('total-items', 142);
  animateCounter('active-users', 328);
  animateCounter('success-deals', 89);
  loadTrendingItems();

  const user = localStorage.getItem('currentUser');
  if (user) {
    const greeting = document.getElementById('user-greeting');
    if (greeting) {
      greeting.textContent = `Hello, ${user}`;
    }
  }
});

