import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import interviewRouting from '../router/interviewRouting';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
<<<<<<< Updated upstream

  ...interviewRouting

=======
  {
    path: '/login',
    name: 'login',
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
    component: () => import(/* webpackChunkName: "signup" */ '../views/SignupView.vue')
  }
>>>>>>> Stashed changes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
