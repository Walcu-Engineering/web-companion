<template>
  <RouterLink :to="`/coches/${car.id}`" class="car-card">
    <div class="car-card__image-wrap">
      <img :src="car.image" :alt="`${car.brand} ${car.model}`" class="car-card__image" loading="lazy" />
      <span class="car-card__badge" :class="`badge--${getFuelClass(car.fuel)}`">{{ car.fuel }}</span>
      <button class="car-card__fav" @click.prevent="toggleFav" :class="{ 'is-faved': isFaved }" aria-label="Guardar en favoritos">
        <svg width="18" height="18" viewBox="0 0 24 24" :fill="isFaved ? '#E8401C' : 'none'" stroke="#E8401C" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>

    <div class="car-card__body">
      <h3 class="car-card__title">{{ car.brand }} {{ car.model }}</h3>
      <p class="car-card__version">{{ car.version }}</p>

      <div class="car-card__specs">
        <span class="spec-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ car.year }}
        </span>
        <span class="spec-sep">·</span>
        <span class="spec-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ formatKm(car.km) }} km
        </span>
        <span class="spec-sep">·</span>
        <span class="spec-item">{{ car.fuel }}</span>
      </div>

      <div class="car-card__footer">
        <div class="car-card__price">{{ formatPrice(car.price) }} €</div>
        <div class="car-card__location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {{ car.location }}
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  car: {
    type: Object,
    required: true
  }
})

const isFaved = ref(false)

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
.car-card {
  display: block;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e8e8e8;
}

.car-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  border-color: #E8401C;
}

.car-card__image-wrap {
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
  aspect-ratio: 16 / 10;
}

.car-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.car-card:hover .car-card__image {
  transform: scale(1.04);
}

.car-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge--diesel { background: #1e3a5f; color: #fff; }
.badge--gasoline { background: #c7381d; color: #fff; }
.badge--hybrid { background: #1a8c45; color: #fff; }
.badge--phev { background: #0d6e3c; color: #fff; }
.badge--electric { background: #005baa; color: #fff; }
.badge--other { background: #555; color: #fff; }

.car-card__fav {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  transition: background 0.15s, transform 0.15s;
}

.car-card__fav:hover {
  background: #fff;
  transform: scale(1.1);
}

.car-card__fav.is-faved {
  background: #fff0ed;
}

.car-card__body {
  padding: 14px 16px 16px;
}

.car-card__title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.car-card__version {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.car-card__specs {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12.5px;
  color: #666;
}

.spec-sep {
  color: #ccc;
  font-size: 14px;
}

.car-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.car-card__price {
  font-size: 20px;
  font-weight: 800;
  color: #E8401C;
  line-height: 1;
}

.car-card__location {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #888;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
}
</style>
