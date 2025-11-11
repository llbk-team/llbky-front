const routes = [
  {
    path: "/my/page",
    name: "MyPage",
    component: () =>
      import(/*webpackChunkName: "myRouting"*/ "@/views/my/MyPage.vue"),
  },
  {
    path: "/my/report",
    name: "MyReport",
    component: () =>
      import(/*webpackChunkName: "myRouting"*/ "@/views/my/MyReport.vue"),
  },
  {
    path: "/my/edit",
    name: "MyEdit",
    component: () =>
      import(/*webpackChunkName: "myRouting"*/ "@/views/my/MyEdit.vue"),
  },
];

export default routes;
