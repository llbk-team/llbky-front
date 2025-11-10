const routes = [
  {
    path: "/my/page",
    name: "MyPage",
    component: () => import(/*webpackChunkName: "myRouting"*/ "@/views/my/MyPage.vue")
  }
];

export default routes;