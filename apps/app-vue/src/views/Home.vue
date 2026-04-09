<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero__bg"></div>
      <div class="hero__content">
        <div class="hero__text">
          <h1 class="hero__title">Encuentra tu coche ideal</h1>
          <p class="hero__subtitle">Más de 400.000 coches de segunda mano y nuevos en España</p>
        </div>
        <SearchForm @search="handleSearch" />
      </div>
    </section>

    <!-- Stats bar -->
    <section class="stats-bar">
      <div class="container">
        <div class="stat-item">
          <span class="stat-number">+400.000</span>
          <span class="stat-label">anuncios</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">+8.000</span>
          <span class="stat-label">concesionarios</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">+2M</span>
          <span class="stat-label">usuarios al mes</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">20 años</span>
          <span class="stat-label">de experiencia</span>
        </div>
      </div>
    </section>

    <!-- Featured brands -->
    <section class="section brands-section">
      <div class="container">
        <h2 class="section-title">Buscar por marca</h2>
        <div class="brands-grid">
          <RouterLink
            v-for="brand in topBrands"
            :key="brand.name"
            :to="`/coches?brand=${brand.name}`"
            class="brand-card"
          >
            <div class="brand-logo-placeholder">{{ brand.initial }}</div>
            <span class="brand-name">{{ brand.name }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Featured cars -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Coches destacados</h2>
          <RouterLink to="/coches" class="see-all-link">
            Ver todos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </RouterLink>
        </div>
        <div class="cars-grid">
          <CarCard v-for="car in featuredCars" :key="car.id" :car="car" />
        </div>
      </div>
    </section>

    <!-- Body type filters -->
    <section class="section body-type-section">
      <div class="container">
        <h2 class="section-title">Buscar por tipo de carrocería</h2>
        <div class="body-types-grid">
          <RouterLink
            v-for="bt in bodyTypeOptions"
            :key="bt.label"
            :to="`/coches?bodyType=${bt.label}`"
            class="body-type-card"
          >
            <div class="body-type-icon">{{ bt.icon }}</div>
            <span class="body-type-label">{{ bt.label }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Why coches.net -->
    <section class="section why-section">
      <div class="container">
        <h2 class="section-title">¿Por qué coches.net?</h2>
        <div class="why-grid">
          <div class="why-card">
            <div class="why-icon">🔍</div>
            <h3>Mayor oferta</h3>
            <p>Más de 400.000 vehículos disponibles entre particulares y concesionarios oficiales.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">✅</div>
            <h3>Anuncios verificados</h3>
            <p>Comprobamos cada anuncio para que encuentres coches con historial completo.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">💰</div>
            <h3>Financiación fácil</h3>
            <p>Calcula tu cuota mensual y solicita financiación directamente desde el anuncio.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">🛡️</div>
            <h3>Garantías incluidas</h3>
            <p>Encuentra coches con garantía de concesionario oficial y asistencia en carretera.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { cars } from '../data/cars.js'
import CarCard from '../components/CarCard.vue'
import SearchForm from '../components/SearchForm.vue'

const router = useRouter()

const featuredCars = computed(() => cars.slice(0, 8))

const topBrands = [
  { name: 'Audi', initial: 'A' },
  { name: 'BMW', initial: 'B' },
  { name: 'Ford', initial: 'F' },
  { name: 'Honda', initial: 'H' },
  { name: 'Kia', initial: 'K' },
  { name: 'Mazda', initial: 'M' },
  { name: 'Mercedes-Benz', initial: 'MB' },
  { name: 'Nissan', initial: 'N' },
  { name: 'Opel', initial: 'O' },
  { name: 'Peugeot', initial: 'P' },
  { name: 'Renault', initial: 'R' },
  { name: 'SEAT', initial: 'S' },
  { name: 'Skoda', initial: 'Š' },
  { name: 'Toyota', initial: 'T' },
  { name: 'Volkswagen', initial: 'VW' },
  { name: 'Volvo', initial: 'V' }
]

const bodyTypeOptions = [
  { label: 'SUV', icon: '🚙' },
  { label: 'Berlina', icon: '🚗' },
  { label: 'Hatchback', icon: '🚘' },
  { label: 'Urbano', icon: '🛺' },
  { label: 'Familiar', icon: '🚐' },
  { label: 'Coupé', icon: '🏎️' }
]

function handleSearch(filters) {
  // Navigation is handled inside SearchForm
}
</script>

<style scoped>
.home {
  background: #f5f5f5;
}

.hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #E8401C 0%, #c73210 40%, #7a1a08 100%);
  z-index: 0;
}

.hero__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%);
}

.hero__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 60px 16px 56px;
}

.hero__text {
  text-align: center;
  margin-bottom: 28px;
}

.hero__title {
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.hero__subtitle {
  font-size: 17px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}

/* Stats */
.stats-bar {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.stats-bar .container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 32px;
}

.stat-number {
  font-size: 22px;
  font-weight: 800;
  color: #E8401C;
  line-height: 1.1;
}

.stat-label {
  font-size: 12.5px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #e8e8e8;
}

/* Sections */
.section {
  padding: 48px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 24px;
}

.section-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.section-header .section-title {
  margin-bottom: 0;
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

.see-all-link:hover {
  gap: 7px;
}

/* Brands */
.brands-section {
  background: #fff;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
}

.brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 10px;
  border: 1.5px solid #eee;
  background: #fff;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.brand-card:hover {
  border-color: #E8401C;
  box-shadow: 0 3px 12px rgba(232, 64, 28, 0.12);
  transform: translateY(-2px);
}

.brand-logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #555;
}

.brand-name {
  font-size: 12px;
  font-weight: 600;
  color: #444;
  text-align: center;
}

/* Cars grid */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

/* Body types */
.body-type-section {
  background: #fff;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.body-types-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.body-type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 22px 12px;
  border-radius: 10px;
  border: 1.5px solid #eee;
  background: #fff;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.body-type-card:hover {
  border-color: #E8401C;
  box-shadow: 0 3px 12px rgba(232, 64, 28, 0.12);
  transform: translateY(-2px);
}

.body-type-icon {
  font-size: 32px;
  line-height: 1;
}

.body-type-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

/* Why section */
.why-section {
  background: #f9f9f9;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.why-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px 22px;
  border: 1px solid #eee;
  transition: box-shadow 0.2s;
}

.why-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.why-icon {
  font-size: 36px;
  margin-bottom: 14px;
}

.why-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.why-card p {
  font-size: 13.5px;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 1100px) {
  .cars-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .brands-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 768px) {
  .hero__title { font-size: 28px; }
  .hero__subtitle { font-size: 15px; }
  .cars-grid { grid-template-columns: repeat(2, 1fr); }
  .brands-grid { grid-template-columns: repeat(4, 1fr); }
  .body-types-grid { grid-template-columns: repeat(3, 1fr); }
  .why-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-item { padding: 8px 16px; }
}

@media (max-width: 480px) {
  .cars-grid { grid-template-columns: 1fr; }
  .brands-grid { grid-template-columns: repeat(3, 1fr); }
  .body-types-grid { grid-template-columns: repeat(2, 1fr); }
  .why-grid { grid-template-columns: 1fr; }
}
</style>
