/* ===========================
   coches.net clone - main.js
   =========================== */

// Active nav state
(function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav a[data-page]').forEach(link => {
    if (link.dataset.page === currentPath) {
      link.classList.add('active');
    }
  });
})();

// Hero search form redirect
const heroForm = document.getElementById('heroSearchForm');
if (heroForm) {
  heroForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    const marca = document.getElementById('heroMarca');
    const modelo = document.getElementById('heroModelo');
    const precio = document.getElementById('heroPrecio');
    const anio = document.getElementById('heroAnio');
    const km = document.getElementById('heroKm');

    if (marca && marca.value)  params.set('marca', marca.value);
    if (modelo && modelo.value) params.set('modelo', modelo.value);
    if (precio && precio.value) params.set('precio_max', precio.value);
    if (anio && anio.value)   params.set('anio_min', anio.value);
    if (km && km.value)       params.set('km_max', km.value);

    window.location.href = 'listings.html?' + params.toString();
  });
}

// Listings page: populate URL params into filter sidebar
(function applyUrlFilters() {
  if (!document.querySelector('.listings-wrapper')) return;

  const params = new URLSearchParams(window.location.search);
  const mapping = {
    marca: 'filterMarca',
    modelo: 'filterModelo',
    precio_max: 'filterPrecioMax',
    anio_min: 'filterAnioMin',
    km_max: 'filterKmMax',
    combustible: 'filterCombustible',
  };

  Object.entries(mapping).forEach(([param, id]) => {
    const val = params.get(param);
    const el = document.getElementById(id);
    if (val && el) el.value = val;
  });

  // Show active filter tags
  const container = document.getElementById('activeFilters');
  if (!container) return;

  const labels = {
    marca: 'Marca',
    modelo: 'Modelo',
    precio_max: 'Precio máx.',
    anio_min: 'Año mín.',
    km_max: 'Km máx.',
    combustible: 'Combustible',
  };

  params.forEach((value, key) => {
    if (!value || !labels[key]) return;
    const tag = document.createElement('span');
    tag.className = 'active-filter-tag';
    tag.innerHTML = `${labels[key]}: <strong>${value}</strong> <button onclick="this.parentElement.remove()" title="Eliminar filtro">&times;</button>`;
    container.appendChild(tag);
  });
})();

// Listings sidebar filter apply
const applyBtn = document.getElementById('applyFilters');
if (applyBtn) {
  applyBtn.addEventListener('click', function() {
    const params = new URLSearchParams();
    const fields = [
      ['filterMarca', 'marca'],
      ['filterModelo', 'modelo'],
      ['filterPrecioMin', 'precio_min'],
      ['filterPrecioMax', 'precio_max'],
      ['filterAnioMin', 'anio_min'],
      ['filterKmMax', 'km_max'],
      ['filterCombustible', 'combustible'],
      ['filterCambio', 'cambio'],
      ['filterCarroceria', 'carroceria'],
    ];
    fields.forEach(([id, param]) => {
      const el = document.getElementById(id);
      if (el && el.value) params.set(param, el.value);
    });
    window.location.href = 'listings.html?' + params.toString();
  });
}

// Clear filters
const clearBtn = document.getElementById('clearFilters');
if (clearBtn) {
  clearBtn.addEventListener('click', function() {
    window.location.href = 'listings.html';
  });
}

// Favorite toggle
document.querySelectorAll('.car-fav').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isFav = this.classList.toggle('is-fav');
    this.textContent = isFav ? '♥' : '♡';
    this.style.color = isFav ? '#e8401c' : '';
  });
});

// Detail page: thumbnail gallery
document.querySelectorAll('.detail-thumb').forEach((thumb, idx) => {
  thumb.addEventListener('click', function() {
    document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active-thumb'));
    this.classList.add('active-thumb');
    const mainImg = document.getElementById('mainDetailImg');
    if (mainImg) {
      mainImg.src = this.querySelector('img').src.replace('200x130', '800x450');
    }
  });
});

// Detail contact button
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
  contactBtn.addEventListener('click', function() {
    alert('El vendedor ha sido notificado. Recibirás una respuesta en breve.');
  });
}

// Detail call button
const callBtn = document.getElementById('callBtn');
if (callBtn) {
  callBtn.addEventListener('click', function() {
    this.textContent = '📞 +34 91 234 56 78';
    this.style.background = 'var(--brand)';
    this.style.color = '#fff';
  });
}

// Mobile: toggle sidebar filters
const toggleFiltersBtn = document.getElementById('toggleFilters');
if (toggleFiltersBtn) {
  toggleFiltersBtn.addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('open');
    this.textContent = sidebar && sidebar.classList.contains('open') ? '✕ Cerrar filtros' : '⚙ Filtros';
  });
}

// Car cards click → detail page
document.querySelectorAll('.car-card[data-href]').forEach(card => {
  card.addEventListener('click', function() {
    window.location.href = this.dataset.href;
  });
});
