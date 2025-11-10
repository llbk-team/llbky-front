import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import interviewRouting from '../router/interviewRouting';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  ...interviewRouting

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
