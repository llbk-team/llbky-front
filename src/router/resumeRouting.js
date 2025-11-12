// 이력서 관련 라우터 설정
const resumeRouting = [
  {
    path: '/resume/list',
    name: 'resume',
    component: () => import('../views/resume/ResumeMain.vue'),
    meta: { 
      title: '이력서 관리',
      requiresAuth: true 
    }
  },
  {
    path: '/resume/write',
    name: 'resume-write', 
    component: () => import('../views/resume/ResumeWrite.vue'),
    meta: { 
      title: '서류작성',
      requiresAuth: true 
    }
  },
  {
    path: '/resume/coach',
    name: 'resume-coach',
    component: () => import('../views/resume/ResumeCoach.vue'),
    meta: { 
      title: '서류코칭',
      requiresAuth: true 
    }
  },
  {
    path: '/resume/coverletter/write',
    name: 'coverletter-write',
    component: () => import('../views/resume/CoverLetterWrite.vue'),
    meta: { 
      title: '자소서 코칭/작성',
      requiresAuth: true 
    }
  },
  {
    path: '/resume/coverletter/detail',
    name: 'coverletter-detail',
    component: () => import('../views/resume/CoverLetterDetail.vue'),
    meta: { 
      title: '자소서 상세',
      requiresAuth: true 
    }
  },
  {
    path: '/resume/portfolio/write',
    name: 'portfolio-write',
    component: () => import('../views/resume/PortfolioWrite.vue'),
    meta: { 
      title: '서류코칭',
      requiresAuth: true 
    }
  },
  {
    path: '/resume/portfolio/coach',
    name: 'portfolio-coach',
    component: () => import('../views/resume/PortfolioCoach.vue'),
    meta: { 
      title: '서류코칭',
      requiresAuth: true 
    }
  }
  
]

export default resumeRouting