import { Link } from 'react-router-dom'
import styles from './CarCard.module.css'

function formatPrice(price) {
  return price.toLocaleString('es-ES') + ' €'
}

function formatKm(km) {
  return km.toLocaleString('es-ES') + ' km'
}

const FUEL_ICONS = {
  Diésel: '⛽',
  Gasolina: '⛽',
  Híbrido: '🔋',
  Eléctrico: '⚡',
}

export default function CarCard({ car }) {
  return (
    <Link to={`/coches/${car.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={car.image}
          alt={`${car.brand} ${car.model} ${car.version}`}
          className={styles.image}
          loading="lazy"
        />
        <span className={styles.locationBadge}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.locationIcon}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {car.location}
        </span>
        {car.fuel === 'Eléctrico' && (
          <span className={styles.electricBadge}>ELÉCTRICO</span>
        )}
        {car.fuel === 'Híbrido' && (
          <span className={styles.hybridBadge}>HÍBRIDO</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            {car.brand} {car.model}
          </h3>
        </div>
        <p className={styles.version}>{car.version}</p>

        <div className={styles.specs}>
          <span className={styles.spec}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.specIcon}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {car.year}
          </span>
          <span className={styles.specDivider}>·</span>
          <span className={styles.spec}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.specIcon}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            {formatKm(car.km)}
          </span>
          <span className={styles.specDivider}>·</span>
          <span className={styles.spec}>{car.fuel}</span>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(car.price)}</span>
          <span className={styles.transmission}>{car.transmission}</span>
        </div>
      </div>
    </Link>
  )
}
