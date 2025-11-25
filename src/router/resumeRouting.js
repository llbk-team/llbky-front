// 이력서 관련 라우터 설정
const resumeRouting = [
  {
    path: '/resume/list',
    name: 'resume',
    component: () => import('../views/resume/ResumeMain.vue')
  },
  {
    path: '/resume/write',
    name: 'resume-write', 
    component: () => import('../views/resume/ResumeWrite.vue')
  },
  {
    path: '/resume/coach',
    name: 'resume-coach',
    component: () => import('../views/resume/ResumeCoach.vue')
  },
  {
    path: '/resume/coverletter/write',
    name: 'coverletter-write',
    component: () => import('../views/resume/CoverLetterWrite.vue')
  },
  {
    path: '/resume/coverletter/detail',
    name: 'coverletter-detail',
    component: () => import('../views/resume/CoverLetterDetail.vue')
  },
  {
    path: '/resume/portfolio/write',
    name: 'portfolio-write',
    component: () => import('../views/resume/PortfolioWrite.vue')
  },
  {
    path: '/resume/portfolio/coach',
    name: 'portfolio-coach',
    component: () => import('../views/resume/PortfolioCoach.vue')
  },
  {
    path: '/resume/portfolio/stepbystep',
    name: 'portfolio-stepbystep',
    component: () => import('../views/resume/PortfolioStepbystep.vue')
  },
  
]

export default resumeRouting