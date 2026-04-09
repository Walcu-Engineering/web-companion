import { useState } from 'react'
import { brands, fuels, transmissions, bodyTypes } from '../data/cars'
import styles from './FilterSidebar.module.css'

const PRICE_RANGES = [
  { label: 'Hasta 10.000 €', max: 10000 },
  { label: '10.000 – 20.000 €', min: 10000, max: 20000 },
  { label: '20.000 – 30.000 €', min: 20000, max: 30000 },
  { label: '30.000 – 40.000 €', min: 30000, max: 40000 },
  { label: 'Más de 40.000 €', min: 40000 },
]

const YEAR_RANGES = [
  { label: '2022 o más nuevo', min: 2022 },
  { label: '2020 – 2021', min: 2020, max: 2021 },
  { label: '2018 – 2019', min: 2018, max: 2019 },
  { label: '2015 – 2017', min: 2015, max: 2017 },
  { label: 'Antes de 2015', max: 2014 },
]

const KM_RANGES = [
  { label: 'Hasta 20.000 km', max: 20000 },
  { label: '20.000 – 50.000 km', min: 20000, max: 50000 },
  { label: '50.000 – 100.000 km', min: 50000, max: 100000 },
  { label: 'Más de 100.000 km', min: 100000 },
]

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>{title}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  )
}

function CheckboxGroup({ options, selected, onChange }) {
  return (
    <ul className={styles.checkList}>
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.label
        const checked = selected.includes(val)
        return (
          <li key={val}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={checked}
                onChange={() => onChange(val)}
              />
              <span className={styles.checkText}>{val}</span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}

export default function FilterSidebar({ filters, onChange, totalResults }) {
  function toggle(field, value) {
    const current = filters[field] || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ ...filters, [field]: next })
  }

  function handleReset() {
    onChange({
      brands: [],
      priceRanges: [],
      yearRanges: [],
      kmRanges: [],
      fuels: [],
      transmissions: [],
      bodyTypes: [],
    })
  }

  const hasFilters = Object.values(filters).some(v => Array.isArray(v) && v.length > 0)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>
          Filtros
          {hasFilters && (
            <span className={styles.activeCount}>
              {Object.values(filters).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0)}
            </span>
          )}
        </h2>
        {hasFilters && (
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            Limpiar todo
          </button>
        )}
      </div>

      <div className={styles.resultsCount}>
        <strong>{totalResults}</strong> coches encontrados
      </div>

      <Section title="Marca">
        <CheckboxGroup
          options={brands}
          selected={filters.brands || []}
          onChange={v => toggle('brands', v)}
        />
      </Section>

      <Section title="Precio">
        <CheckboxGroup
          options={PRICE_RANGES}
          selected={filters.priceRanges || []}
          onChange={v => toggle('priceRanges', v)}
        />
      </Section>

      <Section title="Año">
        <CheckboxGroup
          options={YEAR_RANGES}
          selected={filters.yearRanges || []}
          onChange={v => toggle('yearRanges', v)}
        />
      </Section>

      <Section title="Kilometraje">
        <CheckboxGroup
          options={KM_RANGES}
          selected={filters.kmRanges || []}
          onChange={v => toggle('kmRanges', v)}
        />
      </Section>

      <Section title="Combustible">
        <CheckboxGroup
          options={fuels}
          selected={filters.fuels || []}
          onChange={v => toggle('fuels', v)}
        />
      </Section>

      <Section title="Cambio" defaultOpen={false}>
        <CheckboxGroup
          options={transmissions}
          selected={filters.transmissions || []}
          onChange={v => toggle('transmissions', v)}
        />
      </Section>

      <Section title="Carrocería" defaultOpen={false}>
        <CheckboxGroup
          options={bodyTypes}
          selected={filters.bodyTypes || []}
          onChange={v => toggle('bodyTypes', v)}
        />
      </Section>
    </aside>
  )
}
