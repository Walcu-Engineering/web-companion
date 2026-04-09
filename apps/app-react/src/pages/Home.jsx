import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import CarCard from '../components/CarCard'
import { cars } from '../data/cars'
import styles from './Home.module.css'

const FEATURED_BRANDS = [
  { name: 'Volkswagen', count: 12483 },
  { name: 'BMW', count: 9821 },
  { name: 'Audi', count: 11205 },
  { name: 'Mercedes-Benz', count: 8934 },
  { name: 'Toyota', count: 7612 },
  { name: 'SEAT', count: 10341 },
  { name: 'Ford', count: 9102 },
  { name: 'Renault', count: 8876 },
]

const BODY_TYPES = [
  { label: 'SUV', icon: '🚙', count: 45231 },
  { label: 'Berlina', icon: '🚗', count: 38901 },
  { label: 'Hatchback', icon: '🚘', count: 31200 },
  { label: 'Familiar', icon: '🚐', count: 12450 },
  { label: 'Coupé', icon: '🏎', count: 8320 },
  { label: 'Cabrio', icon: '🚗', count: 3210 },
]

export default function Home() {
  const featured = cars.slice(0, 8)
  const recent = [...cars].sort((a, b) => b.id - a.id).slice(0, 4)

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Encuentra tu coche<br />
              <span className={styles.heroAccent}>de segunda mano</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Más de 350.000 anuncios de coches al mejor precio
            </p>
          </div>
          <div className={styles.heroForm}>
            <SearchForm />
          </div>
        </div>

        {/* Stats banner */}
        <div className={styles.statsBanner}>
          <div className={styles.statsContainer}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>350.000+</span>
              <span className={styles.statLabel}>Anuncios activos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>12.000+</span>
              <span className={styles.statLabel}>Concesionarios</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>1.5M+</span>
              <span className={styles.statLabel}>Usuarios mensuales</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Gratis publicar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by body type */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Busca por tipo de carrocería</h2>
          </div>
          <div className={styles.bodyTypeGrid}>
            {BODY_TYPES.map(type => (
              <Link
                key={type.label}
                to={`/coches?bodyType=${type.label}`}
                className={styles.bodyTypeCard}
              >
                <span className={styles.bodyTypeIcon}>{type.icon}</span>
                <span className={styles.bodyTypeLabel}>{type.label}</span>
                <span className={styles.bodyTypeCount}>{type.count.toLocaleString('es-ES')} anuncios</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Coches destacados</h2>
            <Link to="/coches" className={styles.sectionLink}>
              Ver todos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.sectionLinkIcon}>
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </div>
          <div className={styles.carsGrid}>
            {featured.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular brands */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Marcas populares</h2>
            <Link to="/coches" className={styles.sectionLink}>
              Todas las marcas
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.sectionLinkIcon}>
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </div>
          <div className={styles.brandsGrid}>
            {FEATURED_BRANDS.map(brand => (
              <Link
                key={brand.name}
                to={`/coches?brand=${brand.name}`}
                className={styles.brandCard}
              >
                <span className={styles.brandInitial}>{brand.name[0]}</span>
                <div className={styles.brandInfo}>
                  <span className={styles.brandName}>{brand.name}</span>
                  <span className={styles.brandCount}>{brand.count.toLocaleString('es-ES')} coches</span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.brandArrow}>
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently added */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Últimas incorporaciones</h2>
            <Link to="/coches" className={styles.sectionLink}>
              Ver todos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.sectionLinkIcon}>
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </div>
          <div className={styles.recentGrid}>
            {recent.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>¿Quieres vender tu coche?</h2>
            <p className={styles.ctaSubtitle}>
              Publica tu anuncio gratis y llega a millones de compradores potenciales
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a href="#" className={styles.ctaBtnPrimary}>Publicar anuncio gratis</a>
            <a href="#" className={styles.ctaBtnSecondary}>Cómo funciona</a>
          </div>
        </div>
      </section>
    </main>
  )
}
