import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/routes/home/HomePage.vue'
import NotFoundPage from '@/routes/not-found/NotFoundPage.vue'

export const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
