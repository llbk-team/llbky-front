// 이력서 관련 라우터 설정
const resumeRouting = [
  {
    path: '/resume',
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
    path: '/resume/coverletter',
    name: 'coverletter-coach',
    component: () => import('../views/resume/CoverLetterCoach.vue'),
    meta: { 
      title: '서류코칭',
      requiresAuth: true 
    }
  }
  
]

export default resumeRouting