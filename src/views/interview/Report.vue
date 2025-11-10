<template>
  <div class="container py-5">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold mb-1">면접 리포트</h3>
        <p class="text-muted small mb-0">예상 질문 / 면접 이력 확인 및 상세 조회</p>
      </div>
      <button class="btn btn-mint rounded-pill px-3 py-2 fw-medium shadow-sm"
        @click="$router.push('/interview/mock')">
        ▶️ 모의 면접 시작하기
      </button>
    </div>

    <!-- 탭 -->
    <div class="d-flex bg-light rounded-pill p-1 mb-4">
      <button
        class="btn flex-fill rounded-pill fw-semibold py-2"
        :class="tab === 'question' ? 'btn-mint text-dark' : 'btn-light text-secondary'"
        @click="tab = 'question'"
      >
        예상 질문
      </button>
      <button
        class="btn flex-fill rounded-pill fw-semibold py-2"
        :class="tab === 'history' ? 'btn-mint text-dark' : 'btn-light text-secondary'"
        @click="tab = 'history'"
      >
        면접 이력
      </button>
    </div>

    <!-- 예상 질문 탭 -->
    <div v-if="tab === 'question'">
      <!-- 직무 질문 -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-0">
            직무 질문 <span class="text-muted small">{{ jobQuestions.length }}개</span>
          </h5>
          <button
            v-if="jobQuestions.length > 5"
            class="btn btn-outline-mint btn-sm rounded-pill px-3 py-1 fw-medium"
            @click="showAllJob = !showAllJob"
          >
            {{ showAllJob ? '접기' : '전체보기' }}
          </button>
        </div>

        <div
          v-for="(q, i) in displayedJobQuestions"
          :key="i"
          class="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-2 bg-white shadow-sm-sm"
        >
          <div class="d-flex align-items-center gap-3">
            <span class="badge bg-mint text-dark rounded-pill">{{ i + 1 }}</span>
            <span>{{ q.text }}</span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm text-muted" title="음성 듣기">🎤</button>
            <button class="btn btn-sm text-muted" title="답변 보기">🎞️</button>
          </div>
        </div>
      </div>

      <!-- 종합 질문 -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-0">
            종합 질문 <span class="text-muted small">{{ generalQuestions.length }}개</span>
          </h5>
          <button
            v-if="generalQuestions.length > 5"
            class="btn btn-outline-mint btn-sm rounded-pill px-3 py-1 fw-medium"
            @click="showAllGeneral = !showAllGeneral"
          >
            {{ showAllGeneral ? '접기' : '전체보기' }}
          </button>
        </div>

        <div
          v-for="(q, i) in displayedGeneralQuestions"
          :key="i"
          class="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-2 bg-white shadow-sm-sm"
        >
          <div class="d-flex align-items-center gap-3">
            <span class="badge bg-mint text-dark rounded-pill">{{ i + 1 }}</span>
            <span>{{ q.text }}</span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm text-muted" title="음성 듣기">🎤</button>
            <button class="btn btn-sm text-muted" title="답변 보기">🎞️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 면접 이력 탭 -->
    <div v-else>
      <div
        v-for="(h, i) in histories"
        :key="i"
        class="border rounded-3 bg-white p-3 mb-3 shadow-sm"
      >
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-mint text-dark">완료</span>
            <small class="text-muted">{{ h.date }}</small>
            <small class="text-muted">{{ h.questionCount }}개 질문</small>
          </div>
          <button
            class="btn btn-outline-secondary btn-sm rounded-pill fw-medium px-3 py-1"
            @click="$router.push(`/interview/report/${i}`)"
          >
            📄 리포트 보기
          </button>
        </div>
        <p class="fw-semibold mb-1">{{ h.scoreSummary }}</p>
        <p class="text-muted small mb-2">{{ h.feedback }}</p>
        <div class="progress" style="height: 6px;">
          <div
            class="progress-bar bg-mint"
            role="progressbar"
            :style="{ width: h.progress + '%' }"
          ></div>
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
.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
}
.btn-outline-mint {
  border: 1px solid #71ebbe !important;
  color: #000 !important;
}
.btn-outline-mint:hover {
  background-color: #71ebbe !important;
  color: #000 !important;
}
.bg-mint {
  background-color: #71ebbe !important;
}
</style>
