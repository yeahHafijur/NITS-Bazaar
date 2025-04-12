document.addEventListener('DOMContentLoaded', () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const items = JSON.parse(localStorage.getItem('items')) || [];
  const container = document.getElementById('favorites-container');

  if (favorites.length === 0) {
    container.innerHTML = '<p class="no-items">No favorites yet. <a href="market.html">Explore the market</a>!</p>';
    return;
  }

  favorites.forEach(itemId => {
    const item = items.find(i => String(i.id) === String(itemId));
    if (item) {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.dataset.category = item.category;

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="item-info">
          <h3>${item.title}</h3>
          <p>${item.desc.substring(0, 50)}...</p>
          <div class="price-row">
            <span class="price">${item.price}</span>
            ${
              item.isRental
                ? `<span class="rental-price">₹${item.rentalPrice}</span>
                   <span class="rental-badge">${item.rentalPeriod}</span>`
                : ''
            }
          </div>
          <button class="favorite-btn remove-favorite" data-item-id="${item.id}">❌ Remove</button>
        </div>
      `;

      // Card click for detail view
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('remove-favorite')) {
          localStorage.setItem('selectedItem', JSON.stringify(item));
          window.location.href = 'item-detail.html';
        }
      });

      container.appendChild(card);
    }
  });

  // Remove from favorites
  document.querySelectorAll('.remove-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.dataset.itemId;
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const updatedFavorites = favorites.filter(id => String(id) !== String(itemId));
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      e.target.closest('.item-card').remove();
      e.stopPropagation();
    });
  });
});