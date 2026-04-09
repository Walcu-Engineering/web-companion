<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <h2 class="sidebar__title">Filtros</h2>
      <button v-if="hasActiveFilters" class="sidebar__clear" @click="clearAll">
        Limpiar todo
      </button>
    </div>

    <!-- Marca -->
    <div class="filter-group">
      <button class="filter-group__toggle" @click="toggleSection('brand')">
        <span>Marca</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          :style="{ transform: open.brand ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div v-show="open.brand" class="filter-group__content">
        <div v-for="brand in brands" :key="brand" class="checkbox-item">
          <label class="checkbox-label">
            <input type="checkbox" :value="brand" v-model="localFilters.brands" @change="emitChange" />
            <span class="checkbox-custom"></span>
            {{ brand }}
            <span class="checkbox-count">{{ brandCount(brand) }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Precio -->
    <div class="filter-group">
      <button class="filter-group__toggle" @click="toggleSection('price')">
        <span>Precio</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          :style="{ transform: open.price ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div v-show="open.price" class="filter-group__content">
        <div class="range-inputs">
          <div class="range-input-group">
            <label class="range-label">Desde</label>
            <select v-model="localFilters.minPrice" class="range-select" @change="emitChange">
              <option value="">Mín.</option>
              <option value="5000">5.000 €</option>
              <option value="10000">10.000 €</option>
              <option value="15000">15.000 €</option>
              <option value="20000">20.000 €</option>
              <option value="30000">30.000 €</option>
            </select>
          </div>
          <div class="range-input-group">
            <label class="range-label">Hasta</label>
            <select v-model="localFilters.maxPrice" class="range-select" @change="emitChange">
              <option value="">Máx.</option>
              <option value="10000">10.000 €</option>
              <option value="15000">15.000 €</option>
              <option value="20000">20.000 €</option>
              <option value="25000">25.000 €</option>
              <option value="30000">30.000 €</option>
              <option value="40000">40.000 €</option>
              <option value="50000">50.000 €</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Año -->
    <div class="filter-group">
      <button class="filter-group__toggle" @click="toggleSection('year')">
        <span>Año</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          :style="{ transform: open.year ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div v-show="open.year" class="filter-group__content">
        <div class="range-inputs">
          <div class="range-input-group">
            <label class="range-label">Desde</label>
            <select v-model="localFilters.minYear" class="range-select" @change="emitChange">
              <option value="">Mín.</option>
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div class="range-input-group">
            <label class="range-label">Hasta</label>
            <select v-model="localFilters.maxYear" class="range-select" @change="emitChange">
              <option value="">Máx.</option>
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Kilometraje -->
    <div class="filter-group">
      <button class="filter-group__toggle" @click="toggleSection('km')">
        <span>Kilometraje</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          :style="{ transform: open.km ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div v-show="open.km" class="filter-group__content">
        <div v-for="option in kmOptions" :key="option.value" class="radio-item">
          <label class="radio-label">
            <input type="radio" name="km" :value="option.value" v-model="localFilters.maxKm" @change="emitChange" />
            <span class="radio-custom"></span>
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>

    <!-- Combustible -->
    <div class="filter-group">
      <button class="filter-group__toggle" @click="toggleSection('fuel')">
        <span>Combustible</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          :style="{ transform: open.fuel ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div v-show="open.fuel" class="filter-group__content">
        <div v-for="fuel in fuelTypes" :key="fuel" class="checkbox-item">
          <label class="checkbox-label">
            <input type="checkbox" :value="fuel" v-model="localFilters.fuels" @change="emitChange" />
            <span class="checkbox-custom"></span>
            {{ fuel }}
          </label>
        </div>
      </div>
    </div>

    <!-- Cambio -->
    <div class="filter-group">
      <button class="filter-group__toggle" @click="toggleSection('transmission')">
        <span>Cambio</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          :style="{ transform: open.transmission ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div v-show="open.transmission" class="filter-group__content">
        <div v-for="t in transmissions" :key="t" class="checkbox-item">
          <label class="checkbox-label">
            <input type="checkbox" :value="t" v-model="localFilters.transmissions" @change="emitChange" />
            <span class="checkbox-custom"></span>
            {{ t }}
          </label>
        </div>
      </div>
    </div>

    <!-- Carrocería -->
    <div class="filter-group">
      <button class="filter-group__toggle" @click="toggleSection('body')">
        <span>Carrocería</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          :style="{ transform: open.body ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div v-show="open.body" class="filter-group__content">
        <div v-for="type in bodyTypes" :key="type" class="checkbox-item">
          <label class="checkbox-label">
            <input type="checkbox" :value="type" v-model="localFilters.bodyTypes" @change="emitChange" />
            <span class="checkbox-custom"></span>
            {{ type }}
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { cars, brands, fuelTypes, transmissions, bodyTypes } from '../data/cars.js'

const emit = defineEmits(['filter-change'])

const open = reactive({
  brand: true,
  price: true,
  year: false,
  km: false,
  fuel: true,
  transmission: false,
  body: false
})

const localFilters = reactive({
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

const kmOptions = [
  { value: '', label: 'Cualquier kilometraje' },
  { value: '20000', label: 'Hasta 20.000 km' },
  { value: '50000', label: 'Hasta 50.000 km' },
  { value: '80000', label: 'Hasta 80.000 km' },
  { value: '100000', label: 'Hasta 100.000 km' },
  { value: '150000', label: 'Hasta 150.000 km' }
]

const yearOptions = computed(() => {
  const result = []
  for (let y = 2024; y >= 2000; y--) result.push(y)
  return result
})

const hasActiveFilters = computed(() => {
  return localFilters.brands.length > 0 ||
    localFilters.minPrice || localFilters.maxPrice ||
    localFilters.minYear || localFilters.maxYear ||
    localFilters.maxKm ||
    localFilters.fuels.length > 0 ||
    localFilters.transmissions.length > 0 ||
    localFilters.bodyTypes.length > 0
})

function brandCount(brand) {
  return cars.filter(c => c.brand === brand).length
}

function toggleSection(key) {
  open[key] = !open[key]
}

function emitChange() {
  emit('filter-change', { ...localFilters })
}

function clearAll() {
  localFilters.brands = []
  localFilters.minPrice = ''
  localFilters.maxPrice = ''
  localFilters.minYear = ''
  localFilters.maxYear = ''
  localFilters.maxKm = ''
  localFilters.fuels = []
  localFilters.transmissions = []
  localFilters.bodyTypes = []
  emitChange()
}
</script>

<style scoped>
.sidebar {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.sidebar__title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.sidebar__clear {
  background: none;
  border: none;
  color: #E8401C;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.filter-group {
  border-bottom: 1px solid #eee;
}

.filter-group:last-child {
  border-bottom: none;
}

.filter-group__toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 18px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #222;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.filter-group__toggle:hover {
  background: #fafafa;
}

.filter-group__content {
  padding: 4px 18px 14px;
}

.checkbox-item,
.radio-item {
  padding: 3px 0;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13.5px;
  color: #444;
  cursor: pointer;
  transition: color 0.15s;
}

.checkbox-label:hover,
.radio-label:hover {
  color: #E8401C;
}

.checkbox-label input,
.radio-label input {
  display: none;
}

.checkbox-custom,
.radio-custom {
  width: 17px;
  height: 17px;
  border: 2px solid #ccc;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s, background 0.15s;
}

.radio-custom {
  border-radius: 50%;
}

.checkbox-label input:checked ~ .checkbox-custom {
  background: #E8401C;
  border-color: #E8401C;
}

.checkbox-label input:checked ~ .checkbox-custom::after {
  content: '';
  width: 9px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
  display: block;
}

.radio-label input:checked ~ .radio-custom {
  border-color: #E8401C;
}

.radio-label input:checked ~ .radio-custom::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E8401C;
  display: block;
}

.checkbox-count {
  margin-left: auto;
  font-size: 12px;
  color: #aaa;
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 10px;
}

.range-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.range-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.range-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
}

.range-select {
  padding: 7px 10px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  background: #fafafa;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s;
}

.range-select:focus {
  border-color: #E8401C;
}
</style>
