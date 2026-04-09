import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCarById, cars } from '../data/cars'
import CarCard from '../components/CarCard'
import styles from './Detail.module.css'

function formatPrice(price) {
  return price.toLocaleString('es-ES') + ' €'
}

function formatKm(km) {
  return km.toLocaleString('es-ES') + ' km'
}

const FUEL_COLOR = {
  Diésel: '#3b5bdb',
  Gasolina: '#e67700',
  Híbrido: '#087f5b',
  Eléctrico: '#1a7f4e',
}

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = getCarById(id)

  if (!car) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundContent}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.notFoundIcon}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h1 className={styles.notFoundTitle}>Anuncio no encontrado</h1>
          <p className={styles.notFoundText}>
            Este anuncio ya no está disponible o ha sido eliminado.
          </p>
          <Link to="/coches" className={styles.notFoundBtn}>Ver todos los coches</Link>
        </div>
      </div>
    )
  }

  const related = cars
    .filter(c => c.id !== car.id && (c.brand === car.brand || c.bodyType === car.bodyType))
    .slice(0, 4)

  const fuelColor = FUEL_COLOR[car.fuel] || '#555'

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link to="/" className={styles.breadcrumbLink}>Inicio</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <Link to="/coches" className={styles.breadcrumbLink}>Coches de segunda mano</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <Link to={`/coches?brand=${car.brand}`} className={styles.breadcrumbLink}>{car.brand}</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{car.brand} {car.model} {car.version}</span>
          </nav>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.leftCol}>
            {/* Image gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImageWrap}>
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model} ${car.version}`}
                  className={styles.mainImage}
                />
                <div className={styles.imageBadges}>
                  {car.fuel === 'Eléctrico' && (
                    <span className={styles.electricBadge}>ELÉCTRICO</span>
                  )}
                  {car.fuel === 'Híbrido' && (
                    <span className={styles.hybridBadge}>HÍBRIDO</span>
                  )}
                </div>
                <div className={styles.imageCount}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.imageCountIcon}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  1 foto
                </div>
              </div>
              {/* Thumbnail row (visual only) */}
              <div className={styles.thumbRow}>
                {[1,2,3,4].map(i => (
                  <div key={i} className={`${styles.thumb} ${i === 1 ? styles.thumbActive : ''}`}>
                    <img src={car.image} alt="" className={styles.thumbImg} />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className={styles.descriptionCard}>
              <h2 className={styles.cardTitle}>Descripción</h2>
              <p className={styles.description}>{car.description}</p>
            </div>

            {/* Full specs table */}
            <div className={styles.specsCard}>
              <h2 className={styles.cardTitle}>Características completas</h2>
              <div className={styles.specsGrid}>
                {[
                  { label: 'Marca', value: car.brand },
                  { label: 'Modelo', value: car.model },
                  { label: 'Versión', value: car.version },
                  { label: 'Año', value: car.year },
                  { label: 'Kilómetros', value: formatKm(car.km) },
                  { label: 'Combustible', value: car.fuel },
                  { label: 'Cambio', value: car.transmission },
                  { label: 'Carrocería', value: car.bodyType },
                  { label: 'Potencia', value: `${car.cv} CV` },
                  { label: 'Color', value: car.color },
                  { label: 'Puertas', value: car.doors },
                  { label: 'Provincia', value: car.location },
                ].map(row => (
                  <div key={row.label} className={styles.specRow}>
                    <span className={styles.specLabel}>{row.label}</span>
                    <span className={styles.specValue}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — sticky */}
          <div className={styles.rightCol}>
            <div className={styles.priceCard}>
              {/* Header */}
              <div className={styles.priceCardHeader}>
                <div>
                  <h1 className={styles.carTitle}>{car.brand} {car.model}</h1>
                  <p className={styles.carVersion}>{car.version}</p>
                </div>
                <button
                  type="button"
                  className={styles.favoriteBtn}
                  aria-label="Guardar en favoritos"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              {/* Quick specs */}
              <div className={styles.quickSpecs}>
                <div className={styles.quickSpec}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickSpecIcon}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <span className={styles.quickSpecValue}>{car.year}</span>
                    <span className={styles.quickSpecLabel}>Año</span>
                  </div>
                </div>
                <div className={styles.quickSpec}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickSpecIcon}>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                  <div>
                    <span className={styles.quickSpecValue}>{formatKm(car.km)}</span>
                    <span className={styles.quickSpecLabel}>Kilómetros</span>
                  </div>
                </div>
                <div className={styles.quickSpec}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickSpecIcon}>
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                  </svg>
                  <div>
                    <span className={styles.quickSpecValue} style={{ color: fuelColor }}>{car.fuel}</span>
                    <span className={styles.quickSpecLabel}>Combustible</span>
                  </div>
                </div>
                <div className={styles.quickSpec}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickSpecIcon}>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                  </svg>
                  <div>
                    <span className={styles.quickSpecValue}>{car.cv} CV</span>
                    <span className={styles.quickSpecLabel}>Potencia</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className={styles.priceSection}>
                <span className={styles.price}>{formatPrice(car.price)}</span>
                <span className={styles.priceNote}>IVA incluido · Precio negociable</span>
              </div>

              {/* Location */}
              <div className={styles.locationRow}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.locationIcon}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className={styles.locationText}>{car.location}</span>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button type="button" className={styles.phoneBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.actionIcon}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.77 12.47 19.79 19.79 0 0 1 1.72 3.84 2 2 0 0 1 3.71 1.66h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.3a16 16 0 0 0 6.29 6.29l1.6-1.6a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Ver teléfono
                </button>
                <button type="button" className={styles.chatBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.actionIcon}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Enviar mensaje
                </button>
              </div>

              {/* WhatsApp */}
              <button type="button" className={styles.whatsappBtn}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.whatsappIcon}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Contactar por WhatsApp
              </button>

              {/* Safety note */}
              <p className={styles.safetyNote}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.safetyIcon}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Compra segura garantizada por coches.net
              </p>
            </div>
          </div>
        </div>

        {/* Related cars */}
        {related.length > 0 && (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <h2 className={styles.relatedTitle}>Coches similares</h2>
              <Link to="/coches" className={styles.relatedLink}>
                Ver más
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.relatedLinkIcon}>
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map(c => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
