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
              <label class="fw-semibold mb-2 text-dark">어떤 유형의 면접을 연습하실 건가요?</label>
              <div class="d-flex gap-3">
              <button
                class="btn type-btn flex-fill py-3 d-flex flex-column align-items-center border rounded-3 w-50"
                :class="type === 'comprehensive' ? 'btn-mint' : 'btn-outline-dark'"
                @click="type = 'comprehensive'"
              >
                <span class="fw-bold">종합 면접</span>
                <small class="text-muted">직무+인성 질문을 함께 준비</small>
              </button>
              <button
                class="btn type-btn flex-fill py-3 d-flex flex-column align-items-center border rounded-3 w-50"
                :class="type === 'technical' ? 'btn-mint' : 'btn-outline-dark'"
                @click="type = 'technical'"
              >
                <span class="fw-bold">직무 면접</span>
                <small class="text-muted">기술 중심 평가</small>
              </button>
            </div>

            </div>

            <!-- 기업 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-2 text-dark">희망하시는 기업이 어디인가요?</label>
              <input
                type="text"
                class="form-control p-3 rounded-3"
                v-model="selectedCompany"
                placeholder="예: 네이버, 삼성전자, 카카오 등"
              />
              <small class="text-muted d-block mt-2">
                AI가 입력된 기업명을 기반으로 질문을 생성합니다.
              </small>
            </div>

            <!-- 서류 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-2 text-dark">관련 서류 선택</label>
              <div class="bg-light rounded-3 p-3 border">
                <div v-for="(file, index) in files" :key="index" class="form-check mb-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'file' + index"
                    v-model="selectedFiles"
                    :value="file"
                  />
                  <label class="form-check-label text-dark" :for="'file' + index">
                    {{ file }}
                  </label>
                </div>
                <button
                  class="btn btn-deep-mint w-100 mt-2 fw-medium py-2"
                  :disabled="!selectedFiles.length"
                >
                  선택한 서류 적용하기
                </button>
              </div>
              <small class="text-muted d-block mt-1">
                AI 분석을 위해 기존 서류 중 필요한 항목만 선택하세요.
              </small>
            </div>

            <!-- AI 질문 생성 -->
            <button class="btn btn-mint w-100 py-3 fw-medium mb-3" @click="generateQuestions">
              <i class="bi bi-stars me-2"></i>AI 예상 면접 질문 생성하기 →
            </button>
          </div>
        </div>

        <!-- 오른쪽 AI 질문 영역 -->
        <div v-show="showQuestions" class="col-lg-6">
          <div class="border rounded-4 shadow-sm">
            <div class="bg-dark text-white rounded-top-4 px-4 py-3 fw-bold">
              AI 생성 면접 예상 질문
            </div>
            <div class="p-4 bg-white rounded-bottom-4">
              <div
                v-for="(q, i) in questions"
                :key="i"
                class="border rounded-3 p-3 mb-3 bg-light-green text-dark"
              >
                <strong>Q{{ i + 1 }}.</strong> {{ q }}
              </div>

              <!-- 새 질문 입력 -->
              <div
                v-if="isAdding"
                class="d-flex align-items-center gap-2 mb-3 add-question-box"
              >
                <input
                  type="text"
                  v-model="newQuestion"
                  placeholder="새 질문을 입력하세요"
                  class="form-control flex-grow-1 w-auto"
                  @keyup.enter="addQuestion"
                />
                <button class="btn btn-mint px-4 flex-shrink-0" @click="addQuestion">
                  추가
                </button>
              </div>

              <!-- 플러스 버튼 -->
              <div class="d-flex justify-content-center my-3">
                <button
                  class="btn btn-outline-dark rounded-circle border-2"
                  @click="isAdding = !isAdding"
                >
                  <i class="ri-add-line fs-4"></i>
                </button>
              </div>

              <button
                class="btn btn-mint w-100 py-3 fw-medium"
                @click="$router.push('/interview/progress')"
              >
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
import { ref } from "vue";

const type = ref("comprehensive");
const selectedCompany = ref("");

const files = ref([
  "구글_김병현_이력서",
  "구글_김병현_포트폴리오",
  "구글_김병현_자기소개서",
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
  padding: 0 !important; /* py-3 덮어쓰기 */
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
.add-question-box .form-control { min-width: 0; }

/* 버튼이 줄바꿈되지 않도록(안전장치) */
.add-question-box .btn { white-space: nowrap; }

/* 입력 필드 placeholder 색상 연하게 */
input::placeholder {
  color: #bcbcbc !important; /* 좀 더 연한 회색 */
  opacity: 1; /* Safari용 (기본 투명도 제거) */
}

</style>
