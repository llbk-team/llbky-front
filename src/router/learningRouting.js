const routes = [
  {
    path: '/learning/coach',
    component: () => import('@/views/learning/Coach.vue')
  },
  
  {
    path: '/learning/goal',
    component: () => import('@/views/learning/Goal.vue')
  },

  {
    path: '/learning/roadmap',
    component: () => import('@/views/learning/Roadmap.vue')
  },

  {
    path: '/learning/start',
    component: () => import('@/views/learning/Start.vue')
  },

  {
    path: '/learning/report',
    component: () => import('@/views/learning/Report.vue')
  }
]



export default routes;
