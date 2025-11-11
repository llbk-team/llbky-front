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

    <!-- ✅ AI 질문 모달 -->
    <div v-if="showAiModal" class="ai-modal-overlay" @click.self="closeAiModal">
      <div class="ai-modal-content shadow-lg">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">🧭 현재 로드맵 요약</h5>
          <button class="btn-close" @click="closeAiModal"></button>
        </div>

        <ul class="list-group mb-3">
          <li v-for="week in roadmapData" :key="week.week" class="list-group-item">{{ week.week }}주차: {{ week.title.replace(/\[.*?\]\s*/, '') }}</li>
        </ul>

        <p class="text-center text-muted mb-3">
          질문을 입력하면 AI가 답변해드려요!<br />
          <small>예: "Spring Security가 어려워요. 다른 순서로 바꿀 수 있나요?"</small>
        </p>

        <div class="ai-input">
          <input v-model="aiInput" type="text" class="form-control" placeholder="Spring Security가 어려워요. 다른 순서로 바꿀 수 있나요?" />
          <button class="btn btn-mint ms-2">전송</button>
        </div>
      </div>
    </div>


    <footer class="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">

      <router-link :to="`/learning/skill`" class="btn btn-outline-secondary">
        ← 이전
      </router-link>

      <div>
        <button type="button" class="btn btn-mint me-2" @click="openAiModal">
          AI 질문
        </button>
        <button type="button" class="btn btn-dark" @click="openSaveModal">
          플랜 저장
        </button>
      </div>
    </footer>

    <!-- ✅ 저장 완료 모달 -->
    <div v-if="showSaveModal" class="save-modal-overlay" @click.self="closeSaveModal">
      <div class="save-modal-content shadow-lg text-center">
        <div class="check-icon mb-3">✅</div>
        <h4 class="fw-bold mb-3">플랜이 저장되었습니다!</h4>

        <div class="alert alert-mint-light mb-4">
          🎯 <strong>'백엔드 개발자 – 취업 준비 + 자기계발'</strong><br />
          4주 학습 로드맵이 내 학습함에 추가되었습니다.
        </div>

        <p class="fw-semibold mb-3">👉 다음 단계로 이동할까요?</p>

        <div class="d-flex justify-content-center gap-3 mb-4">

          <router-link :to="`/learning/start`" class="btn btn-green" @click="startLearning">
            ▶ 학습 시작하기
          </router-link>
          <router-link :to="`/learning/coach`" class="btn btn-outline-mint" @click="goToMyLearning">
            📁 내 학습함
          </router-link>
        </div>

        <div class="ai-tip">
          💬 <strong>AI 팁:</strong> 이제 주차별 학습을 진행하면,<br />
          진행률과 피드백을 자동으로 기록해드릴게요!!!!!!!!!!!!!!!
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
// const router = useRouter();

const selectedWeek = ref(null);
const showAiModal = ref(false);
const aiInput = ref("");
const showSaveModal = ref(false);

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

function openModal(week) {
  selectedWeek.value = week;
}
function closeModal() {
  selectedWeek.value = null;
}

function openAiModal() {
  showAiModal.value = true;
}
function closeAiModal() {
  showAiModal.value = false;
}

function savePlan() {
  console.log('플랜 저장 API 호출');
  // API로 로드맵 데이터 전송
}

function openSaveModal() {
  showSaveModal.value = true;
}
function closeSaveModal() {
  showSaveModal.value = false;
}

function startLearning() {
  console.log("학습 시작 페이지로 이동");
  showSaveModal.value = false;
}

function goToMyLearning() {
  console.log("내 학습함 페이지로 이동");
  showSaveModal.value = false;
}
</script>

<style scoped>
/* scoped: 이 스타일은 roadmap.vue 컴포넌트 안에서만 적용됩니다.
  부트스트랩을 기반으로 하되, 커스텀 디자인을 덮어씌웁니다.
*/

.roadmap-container {
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

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  text-align: left;
}

/* ✅ AI 질문 모달 */
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.ai-modal-content {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  animation: fadeIn 0.3s ease-in-out;
}

.list-group-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 0.4rem;
}

.ai-input {
  display: flex;
  align-items: center;
  width: 95%;
}

.ai-input input {
  height: 44px;
  /* 입력창 높이 고정 */
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0 12px;
}

/* ✅ 민트 베이스 저장 완료 모달 */
.save-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.save-modal-content {
  background: #f0fdf4;
  /* 민트 톤 베이스 */
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  animation: fadeIn 0.3s ease-in-out;
  color: #111;
}

.check-icon {
  font-size: 3rem;
}

.alert-mint-light {
  background-color: #ffffff;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 0.75rem;
  padding: 1rem;
}

.btn-green {
  background-color: #10b981;
  color: #fff;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  border: none;
}

.btn-green:hover {
  background-color: #059669;
}

.btn-outline-mint {
  background-color: #ffffff;
  color: #166534;
  border: 2px solid #a7f3d0;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
}

.btn-outline-mint:hover {
  background-color: #dcfce7;
}

.ai-tip {
  background-color: #ecfdf5;
  color: #065f46;
  border-radius: 10px;
  padding: 0.8rem;
  font-size: 0.9rem;
  border: 1px solid #bbf7d0;
  line-height: 1.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* (부트스트랩 .btn-dark, .btn-outline-secondary는 기본 스타일 사용) */
</style>