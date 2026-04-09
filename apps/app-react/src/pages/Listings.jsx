import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSidebar from '../components/FilterSidebar'
import CarCard from '../components/CarCard'
import { cars } from '../data/cars'
import styles from './Listings.module.css'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'year-desc', label: 'Año: más nuevos primero' },
  { value: 'km-asc', label: 'Kilómetros: menos primero' },
]

const PRICE_RANGES_MAP = {
  'Hasta 10.000 €': { max: 10000 },
  '10.000 – 20.000 €': { min: 10000, max: 20000 },
  '20.000 – 30.000 €': { min: 20000, max: 30000 },
  '30.000 – 40.000 €': { min: 30000, max: 40000 },
  'Más de 40.000 €': { min: 40000 },
}

const YEAR_RANGES_MAP = {
  '2022 o más nuevo': { min: 2022 },
  '2020 – 2021': { min: 2020, max: 2021 },
  '2018 – 2019': { min: 2018, max: 2019 },
  '2015 – 2017': { min: 2015, max: 2017 },
  'Antes de 2015': { max: 2014 },
}

const KM_RANGES_MAP = {
  'Hasta 20.000 km': { max: 20000 },
  '20.000 – 50.000 km': { min: 20000, max: 50000 },
  '50.000 – 100.000 km': { min: 50000, max: 100000 },
  'Más de 100.000 km': { min: 100000 },
}

function matchesRanges(value, selectedRanges, rangesMap) {
  if (!selectedRanges || selectedRanges.length === 0) return true
  return selectedRanges.some(label => {
    const range = rangesMap[label]
    if (!range) return false
    if (range.min !== undefined && value < range.min) return false
    if (range.max !== undefined && value > range.max) return false
    return true
  })
}

export default function Listings({ category }) {
  const [searchParams] = useSearchParams()
  const [sort, setSort] = useState('relevance')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    brands: searchParams.get('brand') ? [searchParams.get('brand')] : [],
    priceRanges: [],
    yearRanges: [],
    kmRanges: [],
    fuels: [],
    transmissions: [],
    bodyTypes: searchParams.get('bodyType') ? [searchParams.get('bodyType')] : [],
  })

  const filtered = useMemo(() => {
    let result = cars

    const q = searchParams.get('q')
    if (q) {
      const lower = q.toLowerCase()
      result = result.filter(c =>
        `${c.brand} ${c.model} ${c.version}`.toLowerCase().includes(lower)
      )
    }

    if (filters.brands.length > 0) {
      result = result.filter(c => filters.brands.includes(c.brand))
    }

    if (filters.fuels.length > 0) {
      result = result.filter(c => filters.fuels.includes(c.fuel))
    }

    if (filters.transmissions.length > 0) {
      result = result.filter(c => filters.transmissions.includes(c.transmission))
    }

    if (filters.bodyTypes.length > 0) {
      result = result.filter(c => filters.bodyTypes.includes(c.bodyType))
    }

    result = result.filter(c =>
      matchesRanges(c.price, filters.priceRanges, PRICE_RANGES_MAP)
    )

    result = result.filter(c =>
      matchesRanges(c.year, filters.yearRanges, YEAR_RANGES_MAP)
    )

    result = result.filter(c =>
      matchesRanges(c.km, filters.kmRanges, KM_RANGES_MAP)
    )

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'year-desc':
        result = [...result].sort((a, b) => b.year - a.year)
        break
      case 'km-asc':
        result = [...result].sort((a, b) => a.km - b.km)
        break
      default:
        break
    }

    return result
  }, [filters, sort, searchParams])

  const pageTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : searchParams.get('q')
      ? `Resultados para "${searchParams.get('q')}"`
      : 'Coches de segunda mano'

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbContainer}>
          <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
            <a href="/" className={styles.breadcrumbLink}>Inicio</a>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>
              {category || 'Coches de segunda mano'}
            </span>
          </nav>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Mobile filter toggle */}
        <div className={styles.mobileFilterBar}>
          <button
            type="button"
            className={styles.filterToggleBtn}
            onClick={() => setSidebarOpen(v => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.filterIcon}>
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="14" y2="12"/>
              <line x1="4" y1="18" x2="10" y2="18"/>
            </svg>
            Filtros
            {Object.values(filters).some(v => Array.isArray(v) && v.length > 0) && (
              <span className={styles.filterBadge} />
            )}
          </button>
          <span className={styles.mobileCount}>{filtered.length} resultados</span>
        </div>

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarVisible : ''}`}>
          <div className={styles.sidebarClose}>
            <button type="button" onClick={() => setSidebarOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            totalResults={filtered.length}
          />
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          <div className={styles.mainHeader}>
            <div>
              <h1 className={styles.pageTitle}>{pageTitle}</h1>
              <p className={styles.resultsCount}>
                <strong>{filtered.length}</strong> coches encontrados
              </p>
            </div>
            <div className={styles.sortWrapper}>
              <label htmlFor="sort-select" className={styles.sortLabel}>Ordenar por:</label>
              <select
                id="sort-select"
                className={styles.sortSelect}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {Object.values(filters).some(v => Array.isArray(v) && v.length > 0) && (
            <div className={styles.activeFilters}>
              {Object.entries(filters).map(([key, values]) =>
                values.map(val => (
                  <button
                    key={`${key}-${val}`}
                    type="button"
                    className={styles.filterChip}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        [key]: prev[key].filter(v => v !== val),
                      }))
                    }}
                  >
                    {val}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.chipClose}>
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                ))
              )}
              <button
                type="button"
                className={styles.clearAllChip}
                onClick={() => setFilters({
                  brands: [], priceRanges: [], yearRanges: [],
                  kmRanges: [], fuels: [], transmissions: [], bodyTypes: [],
                })}
              >
                Limpiar todo
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <h2 className={styles.emptyTitle}>Sin resultados</h2>
              <p className={styles.emptyText}>
                No hemos encontrado coches con los filtros aplicados. Prueba a ampliar la búsqueda.
              </p>
              <button
                type="button"
                className={styles.emptyBtn}
                onClick={() => setFilters({
                  brands: [], priceRanges: [], yearRanges: [],
                  kmRanges: [], fuels: [], transmissions: [], bodyTypes: [],
                })}
              >
                Quitar filtros
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
