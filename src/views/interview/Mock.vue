<template>
  <div class="py-5 bg-white">
    <div class="container">
      <div class="row g-4">
        <!-- 왼쪽 설정 영역 -->
        <div class="col-lg-6">
          <div>
            <h3 class="fw-bold mb-1 text-dark">모의 면접</h3>
            <p class="text-muted small mb-4">
              면접 키워드를 이용한 AI의 예상 질문과 피드백 자동 생성
            </p>

            <!-- 면접 유형 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-2 text-dark mt-4">어떤 유형의 면접을 연습하실 건가요?</label>
              <div class="d-flex gap-3">
                <button class="btn type-btn flex-fill py-3 d-flex flex-column align-items-center border rounded-3 w-50" :class="type === 'comprehensive' ? 'btn-mint' : 'btn-outline-dark'"
                  @click="type = 'comprehensive'">
                  <span class="fw-bold">종합 면접</span>
                  <small class="text-muted">직무+인성 질문을 함께 준비</small>
                </button>
                <button class="btn type-btn flex-fill py-3 d-flex flex-column align-items-center border rounded-3 w-50" :class="type === 'technical' ? 'btn-mint' : 'btn-outline-dark'"
                  @click="type = 'technical'">
                  <span class="fw-bold">직무 면접</span>
                  <small class="text-muted">기술 중심 평가</small>
                </button>
              </div>

            </div>

            <!-- 기업 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-2 text-dark mt-4">희망하시는 기업이 어디인가요?</label>
              <input type="text" class="form-control p-3 rounded-3" v-model="selectedCompany" placeholder="예: 네이버, 삼성전자, 카카오 등" />
              <small class="text-muted d-block mt-2">
                *AI가 입력된 기업명을 기반으로 질문을 생성합니다.
              </small>
            </div>

            <!-- 키워드 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-1 text-dark mt-4">관련 키워드 선택</label>
              <small class="text-muted d-block mt-1 mb-2">
                AI 분석을 위해 저장하신 키워드 중에서 면접과 관련된 키워드를 선택하세요.
              </small>

              <!-- 스크롤 박스 -->
              <div class="bg-light rounded-3 p-3 border mb-4 checkbox-scroll">
                <div v-for="(keyword, index) in keywordList" :key="index" class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" :id="'keyword' + index" v-model="selectedKeywords" :value="keyword" />
                  <label class="form-check-label text-dark" :for="'keyword' + index">
                    {{ keyword }}
                  </label>
                </div>
              </div>
            </div>

            <!-- 서류 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-2 text-dark mt-4">관련 서류 선택</label>
              <small class="text-muted d-block mt-1 mb-2">
                AI 분석을 위해 기존 서류 중 필요한 항목만 선택하세요.
              </small>
              <div class="bg-light rounded-3 p-3 border checkbox-scroll">
                <div v-for="(file, index) in files" :key="index" class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" :id="'file' + index" v-model="selectedFiles" :value="file" />
                  <label class="form-check-label text-dark" :for="'file' + index">
                    {{ file }}
                  </label>
                </div>
              </div>
            </div>

            <!-- AI 질문 생성 -->
            <button class="btn btn-mint w-100 py-3 fw-medium mb-3 mt-4" @click="generateQuestions">
              <i class="bi bi-stars me-2"></i>AI 예상 면접 질문 생성하기 →
            </button>
          </div>
        </div>

        <!-- 에상 질문 영역 -->
        <div v-show="showQuestions" class="col-lg-6">
          <div class="ai-question-box">

            <div class="ai-question-header">
              AI 생성 면접 예상 질문
            </div>

            <div class="ai-question-body">

              <div v-for="(q, i) in questions" :key="i" class="ai-question-item">
                <strong>Q{{ i + 1 }}.</strong> {{ q }}
              </div>

              <!-- 새 질문 입력 -->
              <div v-if="isAdding" class="d-flex align-items-center gap-2 mb-3 add-question-box">
                <input type="text" v-model="newQuestion" placeholder="새 질문을 입력하세요" class="form-control flex-grow-1 w-auto" @keyup.enter="addQuestion" />
                <button class="btn btn-mint ai-add-btn" @click="addQuestion">추가</button>
              </div>

              <!-- 플러스 버튼 -->
              <div class="d-flex justify-content-center my-3">
                <button class="btn rounded-circle ai-plus-btn" @click="isAdding = !isAdding">
                  <i class="ri-add-line fs-4"></i>
                </button>
              </div>

              <button class="btn btn-mint w-100 py-3 fw-medium" @click="router.push('/interview/progress')">
                모의 면접 시작하기 →
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref } from "vue";

const type = ref("comprehensive");
const selectedCompany = ref("");
const selectedKeywords = ref([]);


const keywordList = ref([
  "Spring AI",
  "Oracle",
  "Vue.js",
  "Python"
]);

const files = ref([
  "구글_김병현_이력서",
  "구글_김병현_포트폴리오",
  "구글_김병현_자기소개서",
  "카카오_김병현_이력서",
  "카카오_김병현_포트폴리오",
  "카카오_김병현_자기소개서",
]);
const selectedFiles = ref([]);

const questions = ref([
  "1분 동안 자기소개를 해주세요.",
  "우리 회사에 지원한 이유는 무엇인가요?",
  "당신의 강점과 약점은 무엇인가요?",
  "팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하셨나요?",
  "AI 프로젝트를 개발할 때 가장 어려웠던 부분은 무엇이었나요?",
]);

const isAdding = ref(false);
const newQuestion = ref("");
const showQuestions = ref(false);

const addQuestion = () => {
  if (newQuestion.value.trim()) {
    questions.value.push(newQuestion.value);
    newQuestion.value = "";
    isAdding.value = false;
  }
};

const generateQuestions = () => {
  showQuestions.value = true;
};
</script>

<style scoped>
/* 제목 */
.title,
h3.fw-bold {
  font-size: 1.75rem !important;
  /* 28px */
  font-weight: 700 !important;
}

/* 설명 텍스트 */
.subtitle,
.text-muted.small,
p,
label,
span,
small {
  font-size: 1rem !important;
  /* 16px */
}

.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
}

.btn-mint:hover {
  background-color: #5cd8ab !important;
}

.btn-deep-mint {
  background-color: #00b17f !important;
  color: #fff !important;
  border: none !important;
}

.btn-deep-mint:hover {
  background-color: #009a70 !important;
}

.bg-light-green {
  background-color: #f3fef9 !important;
}

/* 면접 유형 버튼 높이 통일 */
.type-btn {
  height: 100px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 4px;
  padding: 0 !important;
  /* py-3 덮어쓰기 */
  white-space: nowrap;
  text-align: center;
}

.type-btn span {
  font-size: 16px;
}

.type-btn small {
  font-size: 13px;
  color: #666;
}



/* 입력칸이 flex에서 과도하게 넓어지지 않도록 */
.add-question-box .form-control {
  min-width: 0;
}

/* 버튼이 줄바꿈되지 않도록(안전장치) */
.add-question-box .btn {
  white-space: nowrap;
}

/* 입력 필드 placeholder 색상 연하게 */
input::placeholder {
  color: #bcbcbc !important;
  /* 좀 더 연한 회색 */
  opacity: 1;
  /* Safari용 (기본 투명도 제거) */
}

/* 오른쪽 AI 질문 영역 전체 스타일 */
.ai-question-box {
  background: linear-gradient(135deg, #f0fdf4 0%, #f5f7ff 100%) !important;
  border: 1px solid #e0e7ff !important;
  border-radius: 16px !important;
  padding: 0 !important;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

/* 헤더 (bg-dark 부분 대체) */
.ai-question-header {
  background: #ffffff !important;
  padding: 16px 24px !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  border-bottom: 1px solid #e0e7ff !important;
}

/* 본문 */
.ai-question-body {
  padding: 24px !important;
  background: transparent !important;
}

/* 각 질문 카드 */
.ai-question-item {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 12px !important;
  padding: 16px !important;
  margin-bottom: 12px !important;
  transition: 0.2s ease;
}

.ai-question-item:hover {
  background: #f8fafc !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

/* 플러스 버튼 배경 정리 */
.ai-plus-btn {
  background: #ffffff !important;
  border: 2px solid #d1d5db !important;
}

/* “추가” 버튼 통일 */
.ai-add-btn {
  height: 37px !important;
  width: 130px !important;
  border-radius: 30px !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
}

/* 체크박스 영역 스크롤 – 3줄까지만 보이도록 */
.checkbox-scroll {
  max-height: 140px;
  /* 약 3줄 높이 */
  overflow-y: auto;
}
</style>
