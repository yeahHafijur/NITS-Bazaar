// ===== INITIALIZE MARKETPLACE =====
document.addEventListener('DOMContentLoaded', () => {
  renderMarketplace();
  setupEventListeners();
});

function renderMarketplace() {
  const items = JSON.parse(localStorage.getItem('items')) || [];
  const container = document.getElementById('item-list');
  container.innerHTML = '';

  // Filter out rental items
  const marketItems = items.filter(item => !item.isRental);

  if (marketItems.length === 0) {
    container.innerHTML = '<p>No items found. Add some items!</p>';
    return;
  }

  marketItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.category = item.category || 'uncategorized';
    card.dataset.price = item.price || '';

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="item-info">
        <h3>${item.title}</h3>
        <p>${item.desc.substring(0, 50)}...</p>
        <span class="price">₹${item.price}</span>
        <p class="posted-by">Posted by: ${item.user || 'Anonymous'}</p>
        ${item.sold ? '<span class="sold-badge">Sold</span>' : ''}
        <button class="favorite-btn" data-item-id="${item.id}">
          ${isFavorite(item.id) ? '❤️ Saved' : '❤️ Save'}
        </button>
      </div>
    `;

    // Handle item click (not favorite)
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('favorite-btn')) {
        localStorage.setItem('selectedItem', JSON.stringify(item));
        window.location.href = 'item-detail.html';
      }
    });

    // ✅ Add favorite functionality here
    const favBtn = card.querySelector('.favorite-btn');
    favBtn.addEventListener('click', (e) => {
      const itemId = parseInt(favBtn.dataset.itemId);
      toggleFavorite(itemId);
      favBtn.textContent = isFavorite(itemId) ? '❤️ Saved' : '❤️ Save';
      e.stopPropagation();
    });

    container.appendChild(card);
  });
}

function setupEventListeners() {
  document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterItems(searchTerm);
  });

  document.getElementById('category-filter').addEventListener('change', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    filterItems(searchTerm);
  });

  document.getElementById('price-filter').addEventListener('change', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    filterItems(searchTerm);
  });
}

function filterItems(searchTerm) {
  const category = document.getElementById('category-filter').value;
  const priceRange = document.getElementById('price-filter').value;

  const cards = document.querySelectorAll('.item-card');
  let visibleItems = 0;

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();
    const price = parseInt(card.querySelector('.price').textContent.replace(/[₹,]/g, ''));
    const itemCategory = card.dataset.category;

    const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
    const matchesCategory = category === 'all' || itemCategory.toLowerCase() === category.toLowerCase();
    const matchesPrice = (
      priceRange === 'all' ||
      (priceRange === '0-500' && price <= 500) ||
      (priceRange === '500-2000' && price > 500 && price <= 2000)
    );

    const isVisible = matchesSearch && matchesCategory && matchesPrice;
    card.style.display = isVisible ? 'block' : 'none';

    if (isVisible) visibleItems++;
  });

  if (visibleItems === 0) {
    const container = document.getElementById('item-list');
    container.innerHTML = '<p>No items match your search criteria. Try adjusting the filters!</p>';
  }
}

// ===== FAVORITES FUNCTIONALITY =====
function toggleFavorite(itemId) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = favorites.indexOf(itemId);

  if (index === -1) {
    favorites.push(itemId);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(itemId) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(itemId);
}
