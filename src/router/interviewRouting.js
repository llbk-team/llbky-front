const routes = [
  {
    path: "/interview/report",
    name: "Report",
    component: () => import(/*webpackChunkName: "interviewRouting"*/ "@/views/interview/Report.vue")
  },
  {
    path: "/interview/report/detail",
    name: "ReportDetail",
    component: () => import(/*webpackChunkName: "interviewRouting"*/ "@/views/interview/ReportDetail.vue")
  },
  {
    path: "/interview/mock",
    name: "Mock",
    component: () => import(/*webpackChunkName: "interviewRouting"*/ "@/views/interview/Mock.vue")
  },
  {
    path: "/interview/progress/:sessionId",
    name: "Progress",
    component: () => import(/*webpackChunkName: "interviewRouting"*/ "@/views/interview/Progress.vue")
  }
];

export default routes;