import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoText}>coches</span>
              <span className={styles.logoDot}>.net</span>
            </Link>
            <p className={styles.tagline}>
              El mayor marketplace de coches de segunda mano en España. Compra y vende con total confianza.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter/X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>Comprar</h3>
              <ul className={styles.linkList}>
                <li><Link to="/coches">Coches de segunda mano</Link></li>
                <li><a href="#">Coches nuevos</a></li>
                <li><Link to="/motos">Motos</Link></li>
                <li><Link to="/furgonetas">Furgonetas</Link></li>
                <li><a href="#">Coches de concesionario</a></li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>Herramientas</h3>
              <ul className={styles.linkList}>
                <li><a href="#">Tasación gratuita</a></li>
                <li><a href="#">Financiación</a></li>
                <li><a href="#">Comparador</a></li>
                <li><a href="#">Seguro de coche</a></li>
                <li><a href="#">Historial de vehículo</a></li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>Vender</h3>
              <ul className={styles.linkList}>
                <li><a href="#">Publicar anuncio</a></li>
                <li><a href="#">Consejos para vender</a></li>
                <li><a href="#">Precios de mercado</a></li>
                <li><a href="#">Gestión de anuncios</a></li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>Empresa</h3>
              <ul className={styles.linkList}>
                <li><a href="#">Sobre nosotros</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Prensa</a></li>
                <li><a href="#">Trabaja con nosotros</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} coches.net — Todos los derechos reservados
          </p>
          <div className={styles.legal}>
            <a href="#">Política de privacidad</a>
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de cookies</a>
            <a href="#">Aviso legal</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
