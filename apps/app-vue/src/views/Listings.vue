<template>
  <div class="listings">
    <!-- Breadcrumb -->
    <div class="breadcrumb-bar">
      <div class="container">
        <nav class="breadcrumb">
          <RouterLink to="/" class="breadcrumb-link">Inicio</RouterLink>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Coches de segunda mano</span>
        </nav>
      </div>
    </div>

    <div class="container listings-layout">
      <!-- Sidebar -->
      <div class="sidebar-wrap">
        <FilterSidebar @filter-change="onFilterChange" />
      </div>

      <!-- Main -->
      <div class="listings-main">
        <!-- Toolbar -->
        <div class="listings-toolbar">
          <div class="listings-count">
            <strong>{{ filteredCars.length }}</strong> coches encontrados
            <span v-if="activeQuery" class="query-badge">
              "{{ activeQuery }}"
              <button @click="clearQuery" class="clear-query">×</button>
            </span>
          </div>

          <div class="toolbar-right">
            <div class="sort-group">
              <label class="sort-label">Ordenar por:</label>
              <select v-model="sortBy" class="sort-select">
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="year-desc">Año: más reciente</option>
                <option value="km-asc">Km: menor a mayor</option>
              </select>
            </div>

            <div class="view-toggle">
              <button
                class="view-btn"
                :class="{ 'is-active': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
                aria-label="Vista cuadrícula"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button
                class="view-btn"
                :class="{ 'is-active': viewMode === 'list' }"
                @click="viewMode = 'list'"
                aria-label="Vista lista"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Active filters tags -->
        <div v-if="hasActiveFilters" class="active-filters">
          <template v-if="activeFilters.brands?.length">
            <span v-for="b in activeFilters.brands" :key="b" class="filter-tag">
              {{ b }}
              <button @click="removeFilter('brands', b)">×</button>
            </span>
          </template>
          <template v-if="activeFilters.fuels?.length">
            <span v-for="f in activeFilters.fuels" :key="f" class="filter-tag">
              {{ f }}
              <button @click="removeFilter('fuels', f)">×</button>
            </span>
          </template>
          <template v-if="activeFilters.maxPrice">
            <span class="filter-tag">
              Hasta {{ formatPrice(activeFilters.maxPrice) }} €
              <button @click="activeFilters.maxPrice = ''">×</button>
            </span>
          </template>
        </div>

        <!-- No results -->
        <div v-if="filteredCars.length === 0" class="no-results">
          <div class="no-results__icon">🔍</div>
          <h3>No encontramos coches con esos filtros</h3>
          <p>Prueba a ampliar los criterios de búsqueda</p>
          <RouterLink to="/" class="btn-home">Volver al inicio</RouterLink>
        </div>

        <!-- Grid view -->
        <div v-else-if="viewMode === 'grid'" class="cars-grid">
          <CarCard v-for="car in paginatedCars" :key="car.id" :car="car" />
        </div>

        <!-- List view -->
        <div v-else class="cars-list">
          <RouterLink
            v-for="car in paginatedCars"
            :key="car.id"
            :to="`/coches/${car.id}`"
            class="list-card"
          >
            <div class="list-card__image-wrap">
              <img :src="car.image" :alt="`${car.brand} ${car.model}`" class="list-card__image" loading="lazy" />
              <span class="list-card__fuel-badge">{{ car.fuel }}</span>
            </div>
            <div class="list-card__body">
              <div class="list-card__top">
                <h3 class="list-card__title">{{ car.brand }} {{ car.model }} {{ car.version }}</h3>
                <div class="list-card__price">{{ formatPrice(car.price) }} €</div>
              </div>
              <div class="list-card__specs">
                <span>{{ car.year }}</span>
                <span class="spec-sep">·</span>
                <span>{{ formatKm(car.km) }} km</span>
                <span class="spec-sep">·</span>
                <span>{{ car.fuel }}</span>
                <span class="spec-sep">·</span>
                <span>{{ car.transmission }}</span>
                <span class="spec-sep">·</span>
                <span>{{ car.bodyType }}</span>
              </div>
              <div class="list-card__footer">
                <span class="list-card__location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ car.location }}
                </span>
                <span class="list-card__seller">{{ car.seller }}</span>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-btn"
            :class="{ 'page-btn--active': page === currentPage, 'page-btn--ellipsis': page === '...' }"
            @click="page !== '...' && (currentPage = page)"
          >
            {{ page }}
          </button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cars } from '../data/cars.js'
import CarCard from '../components/CarCard.vue'
import FilterSidebar from '../components/FilterSidebar.vue'

const route = useRoute()
const router = useRouter()

const sortBy = ref('relevance')
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = 12

const activeQuery = ref('')
const activeFilters = reactive({
  brands: [],
  minPrice: '',
  maxPrice: '',
  minYear: '',
  maxYear: '',
  maxKm: '',
  fuels: [],
  transmissions: [],
  bodyTypes: []
})

onMounted(() => {
  if (route.query.q) activeQuery.value = route.query.q
  if (route.query.brand) activeFilters.brands = [route.query.brand]
  if (route.query.maxPrice) activeFilters.maxPrice = route.query.maxPrice
  if (route.query.minYear) activeFilters.minYear = route.query.minYear
  if (route.query.maxKm) activeFilters.maxKm = route.query.maxKm
})

const hasActiveFilters = computed(() => {
  return activeFilters.brands.length > 0 ||
    activeFilters.fuels.length > 0 ||
    activeFilters.maxPrice ||
    activeFilters.minPrice ||
    activeFilters.minYear ||
    activeFilters.maxYear ||
    activeFilters.maxKm ||
    activeFilters.transmissions.length > 0 ||
    activeFilters.bodyTypes.length > 0
})

function onFilterChange(filters) {
  Object.assign(activeFilters, filters)
  currentPage.value = 1
}

function removeFilter(key, val) {
  if (Array.isArray(activeFilters[key])) {
    activeFilters[key] = activeFilters[key].filter(v => v !== val)
  } else {
    activeFilters[key] = ''
  }
}

function clearQuery() {
  activeQuery.value = ''
  router.replace({ query: { ...route.query, q: undefined } })
}

const filteredCars = computed(() => {
  let result = [...cars]

  if (activeQuery.value) {
    const q = activeQuery.value.toLowerCase()
    result = result.filter(c =>
      c.brand.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.version.toLowerCase().includes(q)
    )
  }
  if (activeFilters.brands.length) {
    result = result.filter(c => activeFilters.brands.includes(c.brand))
  }
  if (activeFilters.fuels.length) {
    result = result.filter(c => activeFilters.fuels.includes(c.fuel))
  }
  if (activeFilters.transmissions.length) {
    result = result.filter(c => activeFilters.transmissions.includes(c.transmission))
  }
  if (activeFilters.bodyTypes.length) {
    result = result.filter(c => activeFilters.bodyTypes.includes(c.bodyType))
  }
  if (activeFilters.minPrice) {
    result = result.filter(c => c.price >= Number(activeFilters.minPrice))
  }
  if (activeFilters.maxPrice) {
    result = result.filter(c => c.price <= Number(activeFilters.maxPrice))
  }
  if (activeFilters.minYear) {
    result = result.filter(c => c.year >= Number(activeFilters.minYear))
  }
  if (activeFilters.maxYear) {
    result = result.filter(c => c.year <= Number(activeFilters.maxYear))
  }
  if (activeFilters.maxKm) {
    result = result.filter(c => c.km <= Number(activeFilters.maxKm))
  }

  // Sort
  switch (sortBy.value) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break
    case 'price-desc': result.sort((a, b) => b.price - a.price); break
    case 'year-desc': result.sort((a, b) => b.year - a.year); break
    case 'km-asc': result.sort((a, b) => a.km - b.km); break
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredCars.value.length / pageSize))

const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCars.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

watch(sortBy, () => { currentPage.value = 1 })

function formatKm(km) {
  return new Intl.NumberFormat('es-ES').format(km)
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES').format(price)
}
</script>

<style scoped>
.listings {
  background: #f5f5f5;
  min-height: 80vh;
}

.breadcrumb-bar {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.breadcrumb-link {
  color: #E8401C;
  text-decoration: none;
}

.breadcrumb-link:hover { text-decoration: underline; }
.breadcrumb-sep { color: #ccc; }
.breadcrumb-current { color: #666; }

.listings-layout {
  display: grid;
  grid-template-columns: 264px 1fr;
  gap: 20px;
  padding-top: 20px;
  padding-bottom: 40px;
  align-items: start;
}

.sidebar-wrap {
  position: sticky;
  top: 86px;
}

/* Toolbar */
.listings-toolbar {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 12px;
  flex-wrap: wrap;
}

.listings-count {
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.listings-count strong {
  color: #1a1a1a;
  font-size: 15px;
}

.query-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff0ed;
  color: #E8401C;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.clear-query {
  background: none;
  border: none;
  color: #E8401C;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.sort-select {
  padding: 6px 30px 6px 10px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 13.5px;
  color: #333;
  background: #fafafa;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
}

.sort-select:focus {
  border-color: #E8401C;
}

.view-toggle {
  display: flex;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.view-btn {
  padding: 6px 10px;
  background: #fafafa;
  border: none;
  color: #aaa;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.view-btn:hover { background: #f0f0f0; color: #555; }
.view-btn.is-active { background: #E8401C; color: #fff; }

/* Active filters */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #fff0ed;
  color: #E8401C;
  border: 1px solid #f9c4b6;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.filter-tag button {
  background: none;
  border: none;
  color: #E8401C;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

/* No results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #eee;
}

.no-results__icon { font-size: 48px; margin-bottom: 16px; }
.no-results h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a; }
.no-results p { color: #666; margin-bottom: 20px; }

.btn-home {
  display: inline-block;
  background: #E8401C;
  color: #fff;
  padding: 10px 24px;
  border-radius: 7px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}

.btn-home:hover { background: #c73210; }

/* Cars grid */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* List view */
.cars-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-card {
  display: flex;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.list-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border-color: #E8401C;
}

.list-card__image-wrap {
  position: relative;
  width: 220px;
  flex-shrink: 0;
  overflow: hidden;
}

.list-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.list-card:hover .list-card__image { transform: scale(1.04); }

.list-card__fuel-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0,0,0,0.65);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.list-card__body {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.list-card__title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.list-card__price {
  font-size: 22px;
  font-weight: 800;
  color: #E8401C;
  white-space: nowrap;
  flex-shrink: 0;
}

.list-card__specs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13.5px;
  color: #666;
  margin-bottom: 12px;
}

.spec-sep { color: #ccc; }

.list-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-card__location {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12.5px;
  color: #888;
}

.list-card__seller {
  font-size: 12px;
  color: #888;
  background: #f5f5f5;
  padding: 3px 9px;
  border-radius: 10px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 28px;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #ddd;
  border-radius: 7px;
  background: #fff;
  color: #444;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.page-btn:hover:not(:disabled):not(.page-btn--ellipsis) {
  border-color: #E8401C;
  color: #E8401C;
}

.page-btn--active {
  background: #E8401C;
  border-color: #E8401C;
  color: #fff !important;
}

.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn--ellipsis { border-color: transparent; background: transparent; cursor: default; }

@media (max-width: 1024px) {
  .listings-layout { grid-template-columns: 240px 1fr; }
  .cars-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .listings-layout { grid-template-columns: 1fr; }
  .sidebar-wrap { position: static; }
  .cars-grid { grid-template-columns: repeat(2, 1fr); }
  .list-card__image-wrap { width: 160px; }
}

@media (max-width: 480px) {
  .cars-grid { grid-template-columns: 1fr; }
  .list-card { flex-direction: column; }
  .list-card__image-wrap { width: 100%; height: 180px; }
}
</style>
