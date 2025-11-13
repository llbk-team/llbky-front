<template>
  <div class="container py-5">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold mb-1 title">면접 리포트</h3>
        <p class="text-muted mb-0 subtitle">예상 질문 / 면접 이력 확인 및 상세 조회</p>
      </div>
      <button class="btn btn-mint rounded-pill btn-auto shadow-sm"
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

        <!-- 목록 없을 때 -->
        <div v-if="jobQuestions.length === 0" class="text-center text-muted py-3">
          등록된 직무 질문이 없습니다.
        </div>

        <!-- 목록 있을 때 -->
        <div v-else>
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
              <button
                class="btn btn-sm text-muted"
                title="답변 보기"
                @click="openAnswerModal(q)"
              >
                🎞️ 답변 보기
              </button>
            </div>
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

        <div v-if="generalQuestions.length === 0" class="text-center text-muted py-3">
          등록된 종합 질문이 없습니다.
        </div>

        <div v-else>
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
              <button
                class="btn btn-sm text-muted"
                title="답변 보기"
                @click="openAnswerModal(q)"
              >
                🎞️ 답변 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 면접 이력 탭 -->
    <div v-else>
      <div v-if="histories.length === 0" class="text-center text-muted py-3">
        면접 이력이 없습니다.
      </div>
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
            class="btn btn-outline-secondary rounded-pill px-4 btn-auto"
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

    <!-- 답변 보기 모달 -->
    <div v-if="showModal" class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-content-custom p-4 rounded-4 shadow-lg bg-white text-center">
        <h5 class="fw-bold mb-3">{{ selectedQuestion?.text }}</h5>
        <!-- 오디오 -->
        <div v-if="selectedQuestion?.type === 'audio'">
          <audio controls class="w-100 mb-3">
            <source :src="selectedQuestion.answerUrl || ''" type="audio/mp3" />
            브라우저가 오디오 재생을 지원하지 않습니다.
          </audio>
        </div>

        <!-- 비디오 -->
        <div v-else-if="selectedQuestion?.type === 'video'">
          <video controls class="w-100 mb-3 rounded-3">
            <source :src="selectedQuestion.answerUrl || ''" type="video/mp4" />
            브라우저가 비디오 재생을 지원하지 않습니다.
          </video>
        </div>

        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-secondary rounded-pill px-4" @click="showModal = false">
            닫기
          </button>
         <!-- 리포트로 이동 버튼 -->
          <button
            class="btn btn-mint btn-outline-secondary btn-sm rounded-pill px-4 fw-medium btn-auto"
            @click="goToReport(selectedQuestion)"
          >
            📄 리포트로 이동
          </button>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import router from "@/router";
import { ref, computed } from "vue";

const tab = ref("question");
const showAllJob = ref(false);
const showAllGeneral = ref(false);
const showModal = ref(false);
const selectedQuestion = ref(null);

const jobQuestions = ref([
  { text: "Spring Boot와 Spring Framework의 차이점을 설명해주세요.", type: "audio" },
  { text: "RESTful API 설계 원칙에 대해 설명해주세요.", type: "video" },
  { text: "JPA N+1 문제의 해결 방법을 설명해주세요.", type: "audio" },
  { text: "서비스 계층의 역할은 무엇인가요?", type: "video" },
  { text: "DI(Dependency Injection)에 대해 설명해주세요.", type: "audio" },
]);

const generalQuestions = ref([
  { text: "1분 자기소개를 해주세요.", type: "video" },
  { text: "본인의 강점과 약점을 말해주세요.", type: "audio" },
  { text: "팀 내 의견 충돌이 있었을 때 어떻게 해결하셨나요?", type: "audio" },
  { text: "성공적인 협업 경험을 말해주세요.", type: "video" },
  { text: "가장 도전적이었던 프로젝트는 무엇인가요?", type: "audio" },
  { text: "실패 경험이 있다면 어떻게 극복했나요?", type: "video" },
]);

const displayedJobQuestions = computed(() =>
  showAllJob.value ? jobQuestions.value : jobQuestions.value.slice(0, 5)
);
const displayedGeneralQuestions = computed(() =>
  showAllGeneral.value
    ? generalQuestions.value
    : generalQuestions.value.slice(0, 5)
);

const openAnswerModal = (question) => {
  selectedQuestion.value = question;
  showModal.value = true;
};

const goToReport = (question) => {
  showModal.value = false;

  // ⚙️ 정적 예시 (실제론 question.id 나 sessionId 로 매핑될 예정)
  // 여기서는 그냥 질문 타입에 따라 임시 리포트 페이지 다르게 이동시킴
  if (question.type === "audio") {
    // 오디오형 질문 -> 리포트 1번 페이지
    router.push("/interview/report/1");
  } else {
    // 비디오형 질문 -> 리포트 2번 페이지
    router.push("/interview/report/2");
  }
};

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
.title {
    font-weight: 700;
    font-size: 28px;
}

.subtitle {
  color: #6c757d;
  font-size: 16px;
}

/* 탭 버튼 */
.d-flex.bg-light .btn {
    font-size: 14px;
}

/* 섹션 제목 */
h5.fw-bold {
    font-size: 18px;
}

/* 목록 폰트 크기 */
.border.rounded-3 span,
.border.rounded-3 p {
    font-size: 14px;
}

/* small 통일 */
small,
.text-muted.small {
    font-size: 12px !important;
}

/* 모달 */
.modal-content-custom h5 {
    font-size: 18px;
}
.modal-content-custom button {
    font-size: 14px;
}

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
/* 버튼 공통 규격 */
.btn {
  width: 130px;
  height: 37px;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 라운드형 버튼 */
.btn.rounded-pill {
  border-radius: 30px !important;
}

/* 네모형 버튼 */
.btn.square {
  border-radius: 6px !important;
}

/* 기존 mint 버튼 색상 유지 */
.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
}

/* 아웃라인 mint */
.btn-outline-mint {
  border: 1px solid #71ebbe !important;
  color: #000 !important;
}

/* 작은 버튼(답변보기, 전체보기 등)도 동일 규격 적용 */
.btn-sm {
  width: 130px !important;
  height: 37px !important;
  font-size: 13.5px !important;
  border-radius: 30px !important;
}
/* 문구 긴 버튼 전용 */
.btn-auto {
  width: auto !important;       /* 글자만큼 자동 확장 */
  min-width: 130px !important;  /* 최소 너비는 동일 */
  padding-left: 20px !important;
  padding-right: 20px !important; /* 너무 붙지 않게 */
  height: 37px !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1050;
}
.modal-content-custom {
  width: 90%;
  max-width: 600px;
}

</style>
