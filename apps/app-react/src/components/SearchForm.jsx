import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { brands } from '../data/cars'
import styles from './SearchForm.module.css'

const MODELS_BY_BRAND = {
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'TT'],
  BMW: ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['Clase A', 'Clase B', 'Clase C', 'Clase E', 'GLA', 'GLB', 'GLC'],
  Volkswagen: ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Cross', 'ID.3', 'ID.4'],
  Toyota: ['Corolla', 'Yaris', 'RAV4', 'C-HR', 'Prius', 'Camry', 'Land Cruiser'],
  SEAT: ['Ibiza', 'León', 'Ateca', 'Arona', 'Tarraco', 'Mii'],
  Ford: ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Mustang', 'EcoSport'],
  Renault: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Zoe', 'Austral'],
  Peugeot: ['208', '308', '3008', '5008', 'e-208', '2008'],
  Hyundai: ['i10', 'i20', 'i30', 'Tucson', 'Santa Fe', 'Kona', 'IONIQ 5'],
  Kia: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Niro', 'EV6'],
  Skoda: ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
  Volvo: ['V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
  Opel: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'Zafira'],
  Nissan: ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'Ariya'],
  Mazda: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-30', 'MX-5'],
  Honda: ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'e'],
  CUPRA: ['Born', 'Formentor', 'Ateca', 'Leon'],
  Dacia: ['Sandero', 'Duster', 'Logan', 'Spring', 'Jogger'],
}

const PRICE_OPTIONS = [
  { value: '', label: 'Sin límite' },
  { value: '5000', label: 'Hasta 5.000 €' },
  { value: '10000', label: 'Hasta 10.000 €' },
  { value: '15000', label: 'Hasta 15.000 €' },
  { value: '20000', label: 'Hasta 20.000 €' },
  { value: '25000', label: 'Hasta 25.000 €' },
  { value: '30000', label: 'Hasta 30.000 €' },
  { value: '40000', label: 'Hasta 40.000 €' },
  { value: '50000', label: 'Hasta 50.000 €' },
]

const YEAR_OPTIONS = [
  { value: '', label: 'Cualquier año' },
  { value: '2023', label: 'Desde 2023' },
  { value: '2022', label: 'Desde 2022' },
  { value: '2020', label: 'Desde 2020' },
  { value: '2018', label: 'Desde 2018' },
  { value: '2015', label: 'Desde 2015' },
  { value: '2010', label: 'Desde 2010' },
  { value: '2005', label: 'Desde 2005' },
]

const KM_OPTIONS = [
  { value: '', label: 'Sin límite' },
  { value: '10000', label: 'Hasta 10.000 km' },
  { value: '30000', label: 'Hasta 30.000 km' },
  { value: '50000', label: 'Hasta 50.000 km' },
  { value: '75000', label: 'Hasta 75.000 km' },
  { value: '100000', label: 'Hasta 100.000 km' },
  { value: '150000', label: 'Hasta 150.000 km' },
]

export default function SearchForm({ compact = false }) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    maxPrice: '',
    minYear: '',
    maxKm: '',
  })

  const availableModels = filters.brand ? (MODELS_BY_BRAND[filters.brand] || []) : []

  function handleChange(e) {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' ? { model: '' } : {}),
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    navigate(`/coches?${params.toString()}`)
  }

  return (
    <form
      className={`${styles.form} ${compact ? styles.compact : ''}`}
      onSubmit={handleSubmit}
    >
      {!compact && (
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Encuentra tu coche ideal</h2>
          <p className={styles.formSubtitle}>Busca entre miles de anuncios de particulares y concesionarios</p>
        </div>
      )}

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="sf-brand">Marca</label>
          <select
            id="sf-brand"
            name="brand"
            className={styles.select}
            value={filters.brand}
            onChange={handleChange}
          >
            <option value="">Todas las marcas</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="sf-model">Modelo</label>
          <select
            id="sf-model"
            name="model"
            className={styles.select}
            value={filters.model}
            onChange={handleChange}
            disabled={!filters.brand}
          >
            <option value="">Todos los modelos</option>
            {availableModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="sf-maxPrice">Precio máximo</label>
          <select
            id="sf-maxPrice"
            name="maxPrice"
            className={styles.select}
            value={filters.maxPrice}
            onChange={handleChange}
          >
            {PRICE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="sf-minYear">Año mínimo</label>
          <select
            id="sf-minYear"
            name="minYear"
            className={styles.select}
            value={filters.minYear}
            onChange={handleChange}
          >
            {YEAR_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="sf-maxKm">Kilometraje máximo</label>
          <select
            id="sf-maxKm"
            name="maxKm"
            className={styles.select}
            value={filters.maxKm}
            onChange={handleChange}
          >
            {KM_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className={`${styles.fieldGroup} ${styles.submitGroup}`}>
          {!compact && <label className={styles.labelHidden}>Buscar</label>}
          <button type="submit" className={styles.submitBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.submitIcon}>
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Buscar coches
          </button>
        </div>
      </div>
    </form>
  )
}
