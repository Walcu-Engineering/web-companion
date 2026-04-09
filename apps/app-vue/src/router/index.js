import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Listings from '../views/Listings.vue'
import Detail from '../views/Detail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/coches',
    name: 'Listings',
    component: Listings
  },
  {
    path: '/coches/:id',
    name: 'Detail',
    component: Detail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
