const routes = [
  {
    path: '/Learning/Coach',
    component: () => import('@/views/Learning/Coach.vue')
  },
  
  {
    path: '/Learning/Goal',
    component: () => import('@/views/Learning/Goal.vue')
  },
  
  {
    path: '/Learning/Skill',
    component: () => import('@/views/Learning/Skill.vue')
  },


  {
    path: '/Learning/Roadmap',
    component: () => import('@/views/Learning/Roadmap.vue')
  },

  {
    path: '/Learning/Start',
    component: () => import('@/views/Learning/Start.vue')
  }
]



export default routes;
