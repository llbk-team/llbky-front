
const routes = [
  {
    path: '/trend/news',
    component: () => import('@/views/trend/News.vue')
  },
  {
    path: '/trend/analysis',
    component: () => import('@/views/trend/Trend.vue')
  },
  {
    path: '/trend/insight',
    component: () => import('@/views/trend/Insight.vue')
  }

]



export default routes;
