import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import interviewRouting from "@/router/interviewRouting"
import trendRouting from "@/router/trendRouting"
import learningRouting from './learningRouting'
import myRouting from "@/router/myRouting"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SignupView.vue')
  },
  ...interviewRouting,
  ...trendRouting,
  ...myRouting,
  ...learningRouting

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
