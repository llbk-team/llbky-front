import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import learningRouting from './learningRouting'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  ...learningRouting
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
