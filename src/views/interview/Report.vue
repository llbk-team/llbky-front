<template>
  <div class="report-container">
    <!-- 헤더 -->
    <div class="report-header">
      <div>
        <h2 class="title">면접 리포트</h2>
        <p class="subtitle">예상 질문 / 면접 이력 확인 및 상세 조회</p>
      </div>
      <button class="mock-btn" @click="$router.push('/interview/mock')">
        <span class="icon">▶️</span> 모의 면접 시작
      </button>
    </div>

    <!-- 탭 -->
    <div class="tab-wrapper">
      <button
        class="tab"
        :class="{ active: tab === 'question' }"
        @click="tab = 'question'"
      >
        예상 질문
      </button>
      <button
        class="tab"
        :class="{ active: tab === 'history' }"
        @click="tab = 'history'"
      >
        면접 이력
      </button>
    </div>

    <!-- 예상 질문 탭 -->
    <div v-if="tab === 'question'" class="question-section">
      <!-- 직무 질문 -->
      <div class="question-group">
        <div class="group-header">
          <h3>직무 질문 <span>{{ jobQuestions.length }}개</span></h3>
          <!-- ✅ 5개 초과일 때만 전체보기/접기 버튼 표시 -->
          <button 
            v-if="jobQuestions.length > 5"
            class="view-all"
            @click="showAllJob = !showAllJob"
          >
            {{ showAllJob ? '접기' : '전체보기' }}
          </button>
        </div>
        <div
          class="question-card"
          v-for="(q, i) in displayedJobQuestions"
          :key="i"
        >
          <div class="q-left">
            <span class="q-number">{{ i + 1 }}</span>
            <p>{{ q.text }}</p>
          </div>
          <div class="q-right">
            <button class="icon-btn" title="음성 듣기">🎤</button>
            <button class="icon-btn" title="답변 보기">🎞️</button>
          </div>
        </div>
      </div>

      <!-- 종합 질문 -->
      <div class="question-group">
        <div class="group-header">
          <h3>종합 질문 <span>{{ generalQuestions.length }}개</span></h3>
          <!-- ✅ 5개 초과일 때만 전체보기/접기 버튼 표시 -->
          <button 
            v-if="generalQuestions.length > 5"
            class="view-all"
            @click="showAllGeneral = !showAllGeneral"
          >
            {{ showAllGeneral ? '접기' : '전체보기' }}
          </button>
        </div>
        <div
          class="question-card"
          v-for="(q, i) in displayedGeneralQuestions"
          :key="i"
        >
          <div class="q-left">
            <span class="q-number">{{ i + 1 }}</span>
            <p>{{ q.text }}</p>
          </div>
          <div class="q-right">
            <button class="icon-btn" title="음성 듣기">🎤</button>
            <button class="icon-btn" title="답변 보기">🎞️</button>
          </div>
        </div>
      </div>

    </div>

    <!-- 면접 이력 탭 -->
    <div v-else class="history-section">
      <div
        v-for="(h, i) in histories"
        :key="i"
        class="history-card"
      >
        <div class="history-top">
          <div class="left">
            <span class="badge">완료</span>
            <span class="date">{{ h.date }}</span>
            <span class="count">{{ h.questionCount }}개 질문</span>
          </div>
          <button class="report-btn" @click="$router.push(`/interview/report/${i}`)">
            📄 리포트 보기
          </button>
        </div>
        <p class="summary">{{ h.scoreSummary }}</p>
        <p class="feedback">{{ h.feedback }}</p>
        <div class="progress-bar">
          <div class="fill" :style="{ width: h.progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const tab = ref("question");

const showAllJob = ref(false);
const showAllGeneral = ref(false);

const jobQuestions = ref([
  { text: "Spring Boot와 Spring Framework의 차이점을 설명해주세요." },
  { text: "RESTful API 설계 원칙에 대해 설명해주세요." },
  { text: "JPA N+1 문제의 해결 방법을 설명해주세요." },
  { text: "서비스 계층의 역할은 무엇인가요?" },
  { text: "DI(Dependency Injection)에 대해 설명해주세요." },
  { text: "트랜잭션의 ACID 특성은 무엇인가요?" },
]);

const generalQuestions = ref([
  { text: "1분 자기소개를 해주세요." },
  { text: "본인의 강점과 약점을 말해주세요." },
  { text: "팀 내 의견 충돌이 있었을 때 어떻게 해결하셨나요?" },
  { text: "성공적인 협업 경험을 말해주세요." },
  { text: "가장 도전적이었던 프로젝트는 무엇인가요?" },
  { text: "실패 경험이 있다면 어떻게 극복했나요?" },
]);

// 표시할 질문 개수 제어
const displayedJobQuestions = computed(() =>
  showAllJob.value ? jobQuestions.value : jobQuestions.value.slice(0, 5)
);
const displayedGeneralQuestions = computed(() =>
  showAllGeneral.value
    ? generalQuestions.value
    : generalQuestions.value.slice(0, 5)
);

const histories = ref([
  {
    date: "2025-10-28",
    questionCount: 8,
    scoreSummary: "종합 점수 67점",
    feedback: "답변 구조는 좋으나 구체적인 예시 보완 필요",
    progress: 70,
  },
  {
    date: "2025-10-25",
    questionCount: 3,
    scoreSummary: "종합 점수 50점",
    feedback: "시선 처리와 말의 속도 개선 필요",
    progress: 50,
  },
  {
    date: "2025-10-18",
    questionCount: 10,
    scoreSummary: "종합 점수 76점",
    feedback: "STAR 기법 활용 적절",
    progress: 80,
  },
]);
</script>

<style scoped>
/* 전체 */
.report-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Pretendard", sans-serif;
  color: #222;
}

/* 헤더 */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.title {
  font-weight: 700;
  font-size: 22px;
}
.subtitle {
  color: #777;
  font-size: 13px;
}
.mock-btn {
  background-color: #71ebbe;
  color: #000;
  border: none;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.mock-btn:hover {
  background-color: #5cd8ab;
}

/* 탭 */
.tab-wrapper {
  display: flex;
  background: #f3f3f3;
  border-radius: 30px;
  padding: 4px;
  margin-bottom: 24px;
}
.tab {
  flex: 1;
  border: none;
  border-radius: 30px;
  padding: 10px 0;
  background: transparent;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}
.tab.active {
  background-color: #71ebbe;
  color: #fff;
}

/* 질문 카드 */
.question-group {
  margin-bottom: 36px;
}
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.group-header h3 {
  font-size: 15px;
  font-weight: 700;
}
.group-header span {
  color: #888;
  font-size: 13px;
}
.view-all {
  font-size: 12px;
  color: #000;
  background: #fff;
  border: 1px solid #71ebbe;
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
}
.view-all:hover {
  background-color: #71ebbe;
  color: #fff;
}
.question-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  transition: all 0.2s;
}
.question-card:hover {
  background: #f2fef9;
}
.q-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.q-number {
  background-color: #71ebbe;
  color: #000;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 13px;
}
.q-right {
  display: flex;
  gap: 10px;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 17px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}
.icon-btn:hover {
  color: #000;
}

/* 면접 이력 */
.history-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin-bottom: 16px;
}
.history-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge {
  background: #71ebbe;
  color: #000;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
}
.report-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  padding: 3px 8px;
  cursor: pointer;
}
.report-btn:hover {
  border-color: #71ebbe;
}
.summary {
  font-weight: 600;
  margin: 8px 0 2px;
}
.feedback {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}
.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: #71ebbe;
  transition: width 0.3s;
}
</style>
