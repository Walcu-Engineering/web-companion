<template>
  <form class="search-form" @submit.prevent="handleSearch">
    <div class="search-form__grid">
      <div class="form-group">
        <label class="form-label">Marca</label>
        <select v-model="filters.brand" class="form-select">
          <option value="">Todas las marcas</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Modelo</label>
        <select v-model="filters.model" class="form-select" :disabled="!filters.brand">
          <option value="">Todos los modelos</option>
          <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Precio máximo</label>
        <select v-model="filters.maxPrice" class="form-select">
          <option value="">Sin límite</option>
          <option value="10000">10.000 €</option>
          <option value="15000">15.000 €</option>
          <option value="20000">20.000 €</option>
          <option value="25000">25.000 €</option>
          <option value="30000">30.000 €</option>
          <option value="40000">40.000 €</option>
          <option value="50000">50.000 €</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Año mínimo</label>
        <select v-model="filters.minYear" class="form-select">
          <option value="">Cualquier año</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Kilometraje máximo</label>
        <select v-model="filters.maxKm" class="form-select">
          <option value="">Sin límite</option>
          <option value="10000">10.000 km</option>
          <option value="30000">30.000 km</option>
          <option value="50000">50.000 km</option>
          <option value="80000">80.000 km</option>
          <option value="100000">100.000 km</option>
          <option value="150000">150.000 km</option>
        </select>
      </div>

      <div class="form-group form-group--submit">
        <button type="submit" class="btn-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Buscar coches
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cars, brands } from '../data/cars.js'

const emit = defineEmits(['search'])
const router = useRouter()

const filters = ref({
  brand: '',
  model: '',
  maxPrice: '',
  minYear: '',
  maxKm: ''
})

const availableModels = computed(() => {
  if (!filters.value.brand) return []
  return [...new Set(
    cars.filter(c => c.brand === filters.value.brand).map(c => c.model)
  )].sort()
})

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const result = []
  for (let y = currentYear; y >= 2000; y--) result.push(y)
  return result
})

function handleSearch() {
  const query = {}
  if (filters.value.brand) query.brand = filters.value.brand
  if (filters.value.model) query.model = filters.value.model
  if (filters.value.maxPrice) query.maxPrice = filters.value.maxPrice
  if (filters.value.minYear) query.minYear = filters.value.minYear
  if (filters.value.maxKm) query.maxKm = filters.value.maxKm

  emit('search', { ...filters.value })
  router.push({ path: '/coches', query })
}
</script>

<style scoped>
.search-form {
  background: #fff;
  border-radius: 12px;
  padding: 28px 30px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}

.search-form__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr) auto;
  gap: 14px;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.form-select {
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 7px;
  font-size: 14px;
  color: #333;
  background: #fafafa;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-select:focus {
  border-color: #E8401C;
  box-shadow: 0 0 0 3px rgba(232, 64, 28, 0.12);
  background-color: #fff;
}

.form-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-group--submit {
  min-width: 160px;
}

.btn-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #E8401C;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 11px 22px;
  font-size: 15px;
  font-weight: 700;
  width: 100%;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
}

.btn-search:hover {
  background: #c73210;
  transform: translateY(-1px);
}

.btn-search:active {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .search-form__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-group--submit {
    grid-column: 1 / -1;
  }
}

@media (max-width: 520px) {
  .search-form {
    padding: 20px 16px;
  }

  .search-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
