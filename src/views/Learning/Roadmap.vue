<template>
  <div class="roadmap-container container py-5">

    <h2 class="main-title text-center">나의 맞춤 학습 로드맵</h2>

    <div class="alert alert-mint shadow-sm" role="alert">
      AI 학습 코치가 목표 <strong>'백엔드 개발자'</strong>를 기준으로 <strong>'취업 준비 + 자기계발'</strong> 플랜을 생성했어요!
    </div>

    <div class="d-flex justify-content-center flex-wrap gap-3 my-4">
      <span class="summary-tag">📅 총 4주</span>
      <span class="summary-tag">⏰ 주당 25시간</span>
      <span class="summary-tag">🏁 백엔드 포트폴리오 완성</span>
    </div>

    <div class="row">

      <div class="col-md-6 mb-4" v-for="week in roadmapData" :key="week.week">
        <div class="week-card shadow-sm">
          <h4>{{ week.title }}</h4>
          <ul class="topic-list list-unstyled">
            <li v-for="topic in week.topics" :key="topic">{{ topic }}</li>
          </ul>
          <div class="alert alert-mint-light week-note mb-0">
            {{ week.note }}
          </div>
        </div>
      </div>

    </div>

    <footer class="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">

      <router-link :to="`/Learning/Skill`" class="btn btn-outline-secondary">
        ← 이전
      </router-link>

      <div>
        <button type="button" class="btn btn-mint me-2" @click="askAI">
          AI 질문
        </button>
        <button type="button" class="btn btn-dark" @click="savePlan">
          플랜 저장
        </button>
        
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
// const router = useRouter();

// 로드맵 데이터를 동적으로 관리합니다.
const roadmapData = ref([
  {
    week: 1,
    title: '[1주차] SQL 기본 문법',
    topics: [
      '데이터베이스 구조 이해 & 쿼리 작성',
      '[K-MOOC] 데이터베이스 입문',
      '[HRD-Net] SQL 실습 과정',
      'SQLD'
    ],
    note: 'SQL 문법과 데이터 조작을 중심으로 실습에 집중해보세요!'
  },
  {
    week: 2,
    title: '[2주차] Spring Security 인증 구조',
    topics: [
      '로그인 및 인증 흐름 이해',
      '[Inflearn] 스프링 시큐리티 완전 정복',
      '정보보안기사'
    ],
    note: '백엔드 보안 구조를 익히면 포트폴리오의 경쟁력이 높아집니다.'
  },
  {
    week: 3,
    title: '[3주차] REST API와 서버 배포',
    topics: [
      '심화 API 서버 구축 및 AWS 배포',
      '[K-MOOC] 클라우드 서비스 기초',
      'AWS Certified Practitioner'
    ],
    note: 'AWS 배포 경험을 포트폴리오에 기록해두세요.'
  },
  {
    week: 4,
    title: '[4주차] Docker & CI/CD',
    topics: [
      '자동화된 배포 환경 구축',
      '[Udemy] Docker 완벽 가이드',
      'Docker Certified'
    ],
    note: '자동화 배포는 협업에서 필수 기술입니다!'
  }
]);

// 하단 버튼 클릭 이벤트
function goToPrevious() {
  console.log('이전 페이지로 이동');
  // router.push('/coaching'); // 이전 페이지 라우터 경로
}

function askAI() {
  console.log('AI 질문 모달 띄우기');
  // AI 챗봇 모달 등을 띄우는 로직
}

function savePlan() {
  console.log('플랜 저장 API 호출');
  // API로 로드맵 데이터 전송
}
</script>

<style scoped>
/* scoped: 이 스타일은 roadmap.vue 컴포넌트 안에서만 적용됩니다.
  부트스트랩을 기반으로 하되, 커스텀 디자인을 덮어씌웁니다.
*/

.roadmap-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  max-width: 1100px;
}

.main-title {
  font-weight: 700;
  margin-bottom: 1.5rem;
}

/* 1. 커스텀 민트색 알림창 (부트스트랩 .alert 오버라이드) */
.alert-mint {
  background-color: #f0fdf4;
  /* 연한 민트 배경 */
  color: #166534;
  /* 진한 녹색 글씨 */
  border: 1px solid #bbf7d0;
  /* 연한 녹색 테두리 */
}

.alert-mint strong {
  color: #15803d;
}

/* 2. 요약 태그 스타일 */
.summary-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 3. 주차별 카드 스타일 (부트스트랩 .card와 유사하게) */
.week-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  /* 8px */
  padding: 1.5rem;
  /* 24px */
  background-color: #ffffff;
  height: 100%;
  /* 카드의 높이를 맞춤 */
}

.week-card h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* 4. 학습 항목 리스트 */
.topic-list {
  padding-left: 0;
  margin-bottom: 1rem;
}

.topic-list li {
  position: relative;
  padding-left: 1.2rem;
  /* '-' 기호가 들어갈 자리 */
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.topic-list li::before {
  content: '-';
  position: absolute;
  left: 0;
  top: 0;
  font-weight: 600;
  color: #10b981;
  /* 민트색 포인트 */
}

/* 5. 카드 안의 작은 알림창 */
.week-note {
  font-size: 0.875rem;
  background-color: #f8fcfb;
  /* 기본 알림창보다 더 연하게 */
  border-color: #e0f3eb;
  color: #333;
}

/* 6. 커스텀 "AI 질문" 버튼 */
.btn-mint {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  font-weight: 600;
}

.btn-mint:hover {
  background-color: #e0f3eb;
  border-color: #bbf7d0;
}

/* (부트스트랩 .btn-dark, .btn-outline-secondary는 기본 스타일 사용) */
</style>