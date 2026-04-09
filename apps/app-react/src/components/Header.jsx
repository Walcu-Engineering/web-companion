import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/coches?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>coches</span>
            <span className={styles.logoDot}>.net</span>
          </Link>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Buscar marca, modelo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Buscar coches"
            />
            <button type="submit" className={styles.searchBtn} aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          <div className={styles.actions}>
            <a href="#" className={styles.publishBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Publicar anuncio
            </a>
            <button className={styles.loginBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Entrar
            </button>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Menú"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
        <div className={styles.container}>
          <ul className={styles.navList}>
            <li>
              <NavLink
                to="/coches"
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.navIcon}>
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                  <rect x="9" y="11" width="14" height="10" rx="2" />
                  <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                </svg>
                Coches
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/motos"
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.navIcon}>
                  <circle cx="5" cy="17" r="3" /><circle cx="19" cy="17" r="3" />
                  <path d="M12 17v-4l-3-4h5l3 4" /><path d="M5 17h4" />
                </svg>
                Motos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/furgonetas"
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.navIcon}>
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 5v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                Furgonetas
              </NavLink>
            </li>
          </ul>
          <div className={styles.navExtra}>
            <a href="#" className={styles.navExtraLink}>Concesionarios</a>
            <a href="#" className={styles.navExtraLink}>Financiación</a>
            <a href="#" className={styles.navExtraLink}>Seguros</a>
            <a href="#" className={styles.navExtraLink}>Tasación</a>
          </div>
        </div>
      </nav>
    </header>
  )
}
