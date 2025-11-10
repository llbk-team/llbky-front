const routes = [
  {
    path: '/learning/coach',
    component: () => import('@/views/learning/coach.vue')
  },
  
  {
    path: '/learning/goal',
    component: () => import('@/views/learning/goal.vue')
  },
  
  {
    path: '/learning/skill',
    component: () => import('@/views/learning/skill.vue')
  },


  {
    path: '/learning/roadmap',
    component: () => import('@/views/learning/roadmap.vue')
  },

  {
    path: '/learning/start',
    component: () => import('@/views/learning/start.vue')
  }
]



export default routes;
