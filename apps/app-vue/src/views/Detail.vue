<template>
  <div class="detail" v-if="car">
    <!-- Breadcrumb -->
    <div class="breadcrumb-bar">
      <div class="container">
        <nav class="breadcrumb">
          <RouterLink to="/" class="breadcrumb-link">Inicio</RouterLink>
          <span class="breadcrumb-sep">/</span>
          <RouterLink to="/coches" class="breadcrumb-link">Coches</RouterLink>
          <span class="breadcrumb-sep">/</span>
          <RouterLink to="/coches" class="breadcrumb-link">{{ car.brand }}</RouterLink>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">{{ car.brand }} {{ car.model }}</span>
        </nav>
      </div>
    </div>

    <div class="container detail-layout">
      <!-- Left: Images + Description -->
      <div class="detail-left">
        <!-- Image gallery -->
        <div class="gallery">
          <div class="gallery__main">
            <img :src="activeImage" :alt="`${car.brand} ${car.model}`" class="gallery__img" />
            <span class="gallery__fuel-badge" :class="`badge--${getFuelClass(car.fuel)}`">{{ car.fuel }}</span>
            <button class="gallery__fav" @click="toggleFav" :class="{ 'is-faved': isFaved }">
              <svg width="20" height="20" viewBox="0 0 24 24" :fill="isFaved ? '#E8401C' : 'none'" stroke="#E8401C" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {{ isFaved ? 'Guardado' : 'Guardar' }}
            </button>
          </div>
          <div class="gallery__thumbs">
            <button
              v-for="(img, i) in thumbnails"
              :key="i"
              class="gallery__thumb"
              :class="{ 'is-active': activeIndex === i }"
              @click="activeIndex = i"
            >
              <img :src="img" alt="" />
            </button>
          </div>
        </div>

        <!-- Description -->
        <div class="description-card">
          <h2 class="section-title">Descripción del vendedor</h2>
          <p class="description-text">{{ car.description }}</p>
        </div>

        <!-- Specs table -->
        <div class="specs-card">
          <h2 class="section-title">Características</h2>
          <div class="specs-grid">
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Año
              </span>
              <span class="spec-val">{{ car.year }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Kilometraje
              </span>
              <span class="spec-val">{{ formatKm(car.km) }} km</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                </svg>
                Combustible
              </span>
              <span class="spec-val">{{ car.fuel }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
                Potencia
              </span>
              <span class="spec-val">{{ car.power }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Cambio
              </span>
              <span class="spec-val">{{ car.transmission }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 8h14M5 12h14M5 16h6"/>
                </svg>
                Carrocería
              </span>
              <span class="spec-val">{{ car.bodyType }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                </svg>
                Puertas
              </span>
              <span class="spec-val">{{ car.doors }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Color
              </span>
              <span class="spec-val">{{ car.color }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Price card + contact -->
      <div class="detail-right">
        <div class="price-card">
          <div class="price-card__header">
            <div class="price-card__title">{{ car.brand }} {{ car.model }}</div>
            <div class="price-card__version">{{ car.version }}</div>
          </div>

          <div class="price-card__price">
            {{ formatPrice(car.price) }} €
          </div>
          <div class="price-card__finance">
            <span class="finance-label">O desde</span>
            <span class="finance-amount">{{ monthlyPayment }} €/mes</span>
            <span class="finance-info">con financiación</span>
          </div>

          <div class="price-card__meta">
            <div class="meta-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ car.location }}</span>
            </div>
            <div class="meta-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>{{ car.seller }}</span>
            </div>
          </div>

          <button class="btn-contact">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Contactar con el vendedor
          </button>

          <button class="btn-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>

          <div class="price-card__actions">
            <button class="btn-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Guardar
            </button>
            <button class="btn-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Compartir
            </button>
            <button class="btn-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Denunciar
            </button>
          </div>
        </div>

        <!-- Quick specs summary -->
        <div class="quick-specs">
          <div class="quick-spec">
            <div class="quick-spec__icon">📅</div>
            <div class="quick-spec__info">
              <span class="quick-spec__val">{{ car.year }}</span>
              <span class="quick-spec__label">Año</span>
            </div>
          </div>
          <div class="quick-spec">
            <div class="quick-spec__icon">🛣️</div>
            <div class="quick-spec__info">
              <span class="quick-spec__val">{{ formatKm(car.km) }}</span>
              <span class="quick-spec__label">Kilómetros</span>
            </div>
          </div>
          <div class="quick-spec">
            <div class="quick-spec__icon">⛽</div>
            <div class="quick-spec__info">
              <span class="quick-spec__val">{{ car.fuel }}</span>
              <span class="quick-spec__label">Combustible</span>
            </div>
          </div>
          <div class="quick-spec">
            <div class="quick-spec__icon">⚙️</div>
            <div class="quick-spec__info">
              <span class="quick-spec__val">{{ car.transmission }}</span>
              <span class="quick-spec__label">Cambio</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related cars -->
    <section class="related-section">
      <div class="container">
        <div class="related-header">
          <h2 class="section-title">Coches similares</h2>
          <RouterLink to="/coches" class="see-all-link">
            Ver todos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </RouterLink>
        </div>
        <div class="related-grid">
          <CarCard v-for="related in relatedCars" :key="related.id" :car="related" />
        </div>
      </div>
    </section>
  </div>

  <!-- Not found -->
  <div v-else class="not-found">
    <div class="container">
      <div class="not-found__content">
        <div class="not-found__icon">🚗</div>
        <h1>Anuncio no encontrado</h1>
        <p>El coche que buscas no existe o ha sido eliminado.</p>
        <RouterLink to="/coches" class="btn-back">Ver todos los coches</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { cars } from '../data/cars.js'
import CarCard from '../components/CarCard.vue'

const route = useRoute()

const car = computed(() => cars.find(c => c.id === Number(route.params.id)))

const isFaved = ref(false)
const activeIndex = ref(0)

const thumbnails = computed(() => {
  if (!car.value) return []
  return [
    car.value.image,
    `https://placehold.co/400x250/d8e8f0/888?text=Interior`,
    `https://placehold.co/400x250/f0e8d8/888?text=Motor`,
    `https://placehold.co/400x250/e8f0d8/888?text=Maletero`
  ]
})

const activeImage = computed(() => thumbnails.value[activeIndex.value] ?? '')

const monthlyPayment = computed(() => {
  if (!car.value) return 0
  // Rough estimate: 20% down, 4.9% APR, 60 months
  const principal = car.value.price * 0.8
  const rate = 0.049 / 12
  const n = 60
  const payment = principal * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(payment)
})

const relatedCars = computed(() => {
  if (!car.value) return []
  return cars
    .filter(c => c.id !== car.value.id && (c.brand === car.value.brand || c.bodyType === car.value.bodyType))
    .slice(0, 4)
})

function toggleFav() {
  isFaved.value = !isFaved.value
}

function formatKm(km) {
  return new Intl.NumberFormat('es-ES').format(km)
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES').format(price)
}

function getFuelClass(fuel) {
  const map = {
    'Diésel': 'diesel',
    'Gasolina': 'gasoline',
    'Híbrido': 'hybrid',
    'Híbrido Enchufable': 'phev',
    'Eléctrico': 'electric'
  }
  return map[fuel] || 'other'
}
</script>

<style scoped>
.detail {
  background: #f5f5f5;
  min-height: 80vh;
}

/* Breadcrumb */
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
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: #E8401C;
  text-decoration: none;
}

.breadcrumb-link:hover { text-decoration: underline; }
.breadcrumb-sep { color: #ccc; }
.breadcrumb-current { color: #666; }

/* Layout */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  padding-top: 24px;
  padding-bottom: 48px;
  align-items: start;
}

.detail-left {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-right {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Gallery */
.gallery {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.gallery__main {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #f0f0f0;
}

.gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.gallery__img:hover { transform: scale(1.02); }

.gallery__fuel-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge--diesel { background: #1e3a5f; color: #fff; }
.badge--gasoline { background: #c7381d; color: #fff; }
.badge--hybrid { background: #1a8c45; color: #fff; }
.badge--phev { background: #0d6e3c; color: #fff; }
.badge--electric { background: #005baa; color: #fff; }
.badge--other { background: #555; color: #fff; }

.gallery__fav {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.92);
  border: 1.5px solid #E8401C;
  color: #E8401C;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.gallery__fav:hover { background: #fff0ed; }
.gallery__fav.is-faved { background: #fff0ed; }

.gallery__thumbs {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.gallery__thumb {
  width: 80px;
  height: 55px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.15s;
}

.gallery__thumb.is-active { border-color: #E8401C; }

.gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Cards */
.description-card,
.specs-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e8e8e8;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.description-text {
  font-size: 14.5px;
  color: #555;
  line-height: 1.75;
}

/* Specs table */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.spec-row:nth-child(odd) { padding-right: 20px; }
.spec-row:nth-child(even) { padding-left: 20px; border-left: 1px solid #f0f0f0; }

.spec-key {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: #888;
  font-weight: 500;
}

.spec-val {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Price card */
.price-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.price-card__header {
  padding: 18px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.price-card__title {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
}

.price-card__version {
  font-size: 13.5px;
  color: #888;
  margin-top: 3px;
}

.price-card__price {
  font-size: 36px;
  font-weight: 900;
  color: #E8401C;
  padding: 16px 20px 4px;
  line-height: 1;
  letter-spacing: -1px;
}

.price-card__finance {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 0 20px 14px;
  border-bottom: 1px solid #f0f0f0;
}

.finance-label {
  font-size: 12px;
  color: #aaa;
}

.finance-amount {
  font-size: 15px;
  font-weight: 700;
  color: #444;
}

.finance-info {
  font-size: 11.5px;
  color: #aaa;
}

.price-card__meta {
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: 1px solid #f0f0f0;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: #666;
}

.btn-contact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #E8401C;
  color: #fff;
  border: none;
  width: calc(100% - 40px);
  margin: 16px 20px 8px;
  padding: 13px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.15s, transform 0.1s;
}

.btn-contact:hover {
  background: #c73210;
  transform: translateY(-1px);
}

.btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #25D366;
  color: #fff;
  border: none;
  width: calc(100% - 40px);
  margin: 0 20px 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.15s;
}

.btn-whatsapp:hover { background: #1da954; }

.price-card__actions {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.btn-action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: none;
  border: none;
  color: #888;
  font-size: 11.5px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  border-right: 1px solid #f0f0f0;
}

.btn-action:last-child { border-right: none; }
.btn-action:hover { color: #E8401C; background: #fff8f7; }

/* Quick specs */
.quick-specs {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  overflow: hidden;
}

.quick-spec {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}

.quick-spec:nth-child(even) { border-right: none; }
.quick-spec:nth-child(3),
.quick-spec:nth-child(4) { border-bottom: none; }

.quick-spec__icon { font-size: 22px; }

.quick-spec__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.quick-spec__val {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
}

.quick-spec__label {
  font-size: 11.5px;
  color: #aaa;
}

/* Related */
.related-section {
  padding: 40px 0 52px;
}

.related-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.related-header .section-title {
  border: none;
  padding: 0;
  margin: 0;
  font-size: 20px;
}

.see-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #E8401C;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: gap 0.15s;
}

.see-all-link:hover { gap: 7px; }

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* Not found */
.not-found {
  background: #f5f5f5;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.not-found__content {
  text-align: center;
  padding: 60px 20px;
  width: 100%;
}

.not-found__icon { font-size: 64px; margin-bottom: 20px; }
.not-found h1 { font-size: 28px; font-weight: 800; margin-bottom: 10px; color: #1a1a1a; }
.not-found p { color: #666; margin-bottom: 24px; font-size: 15px; }

.btn-back {
  display: inline-block;
  background: #E8401C;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: background 0.15s;
}

.btn-back:hover { background: #c73210; }

@media (max-width: 1024px) {
  .detail-layout { grid-template-columns: 1fr 320px; }
  .related-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
  .detail-right {
    position: static;
    order: -1;
  }
  .specs-grid { grid-template-columns: 1fr; }
  .spec-row:nth-child(odd) { padding-right: 0; }
  .spec-row:nth-child(even) { padding-left: 0; border-left: none; }
}

@media (max-width: 480px) {
  .related-grid { grid-template-columns: 1fr; }
  .price-card__price { font-size: 28px; }
}
</style>
