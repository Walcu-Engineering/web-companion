<template>
  <header class="header">
    <div class="header-top">
      <div class="container">
        <RouterLink to="/" class="logo">
          <span class="logo-icon">🚗</span>
          <span class="logo-text">coches<span class="logo-dot">.net</span></span>
        </RouterLink>

        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Busca por marca, modelo, versión..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        <div class="header-actions">
          <button class="btn-login">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Acceder
          </button>
          <button class="btn-publish">Publicar anuncio</button>
        </div>
      </div>
    </div>

    <nav class="header-nav">
      <div class="container">
        <RouterLink to="/coches" class="nav-link" active-class="nav-link--active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-5h14v5z"/>
            <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
          </svg>
          Coches
        </RouterLink>
        <a href="#" class="nav-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M8 12l2-4 4 8 2-4"/>
          </svg>
          Motos
        </a>
        <a href="#" class="nav-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          Furgonetas
        </a>
        <a href="#" class="nav-link">Camiones</a>
        <a href="#" class="nav-link">Autocaravanas</a>
        <div class="nav-separator"></div>
        <a href="#" class="nav-link nav-link--secondary">Concesionarios</a>
        <a href="#" class="nav-link nav-link--secondary">Financiación</a>
        <a href="#" class="nav-link nav-link--secondary">Seguros</a>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const router = useRouter()

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/coches', query: { q: searchQuery.value.trim() } })
  } else {
    router.push('/coches')
  }
}
</script>

<style scoped>
.header {
  background: #E8401C;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.header-top {
  background: #E8401C;
  padding: 10px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
  line-height: 1;
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}

.logo-dot {
  color: rgba(255, 255, 255, 0.75);
  font-weight: 400;
}

.search-bar {
  flex: 1;
  display: flex;
  max-width: 540px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.search-input {
  flex: 1;
  padding: 9px 14px;
  border: none;
  outline: none;
  font-size: 14px;
  background: #fff;
  color: #333;
}

.search-input::placeholder {
  color: #aaa;
}

.search-btn {
  background: #c73210;
  border: none;
  padding: 0 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.search-btn:hover {
  background: #a82a0d;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: #fff;
  padding: 7px 14px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, border-color 0.15s;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff;
}

.btn-publish {
  background: #fff;
  color: #E8401C;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.15s, transform 0.1s;
}

.btn-publish:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.header-nav {
  background: rgba(0, 0, 0, 0.18);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.header-nav .container {
  gap: 0;
  padding: 0 16px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 14px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link--active {
  color: #fff !important;
  border-bottom-color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.nav-link--secondary {
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
}

.nav-separator {
  flex: 1;
}
</style>
