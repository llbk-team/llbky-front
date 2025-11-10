<template>
  <div class="mock-interview py-5 bg-white">
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
                  class="btn type-btn flex-fill"
                  :class="type === 'comprehensive' ? 'btn-mint text-dark fw-bold' : 'btn-outline-dark'"
                  @click="type = 'comprehensive'"
                >
                  <span class="fw-bold">종합 면접</span>
                  <small class="desc">직무+인성 질문을 함께 준비</small>
                </button>
                <button
                  class="btn type-btn flex-fill"
                  :class="type === 'technical' ? 'btn-mint text-dark fw-bold' : 'btn-outline-dark'"
                  @click="type = 'technical'"
                >
                  <span class="fw-bold">직무 면접</span>
                  <small class="desc">기술 중심 평가</small>
                </button>
              </div>
            </div>


            <!-- 기업 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-2 text-dark">희망하시는 기업이 어디인가요?</label>
              <div class="bg-light p-3 rounded-3">
                <div class="input-group mb-2">
                  <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control border-start-0"
                    placeholder="기업명을 검색하세요 (예: 네이버)"
                    v-model="companySearch"
                  />
                </div>
                <small class="text-muted">선택된 기업: {{ selectedCompany || "없음" }}</small>
              </div>
            </div>

            <!-- 서류 선택 -->
            <div class="mb-4">
              <label class="fw-semibold mb-2 text-dark">관련 서류 선택</label>
              <div class="bg-light rounded-3 p-3 border">
                <div
                  v-for="(file, index) in files"
                  :key="index"
                  class="form-check mb-2"
                >
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
                  class="btn btn-deep-mint mt-2 w-100"
                  :disabled="!selectedFiles.length"
                  @click="applyFiles"
                >
                  선택한 서류 적용하기
                </button>
              </div>
              <small class="text-muted d-block mt-1">
                AI 분석을 위해 기존 서류 중 필요한 항목만 선택하세요.
              </small>
            </div>

            <!-- AI 질문 생성 -->
            <button class="btn btn-mint w-100 py-3 mb-3" @click="generateQuestions">
              <i class="bi bi-stars me-2"></i>AI 예상 면접 질문 생성하기 →
            </button>
          </div>
        </div>

        <!-- 오른쪽 AI 질문 영역 -->
        <div class="col-lg-6">
          <div class="question-box rounded-4 border">
            <div class="question-header bg-black text-white rounded-top-4 px-4 py-3 fw-bold">
              AI 생성 면접 예상 질문
            </div>
            <div class="question-body p-4 bg-white rounded-bottom-4">
              <div
                v-for="(q, i) in questions"
                :key="i"
                class="border rounded-3 p-3 mb-3 text-dark bg-light-green"
              >
                <strong>Q{{ i + 1 }}.</strong> {{ q }}
              </div>

              <!-- 새 질문 입력 -->
              <div v-if="isAdding" class="add-question-box d-flex justify-content-center align-items-center gap-2 mb-3">
                <input
                  type="text"
                  v-model="newQuestion"
                  placeholder="새 질문을 입력하세요"
                  class="form-control flex-grow-1"
                  @keyup.enter="addQuestion"
                />
                <button class="btn btn-mint px-4 py-2" @click="addQuestion">추가</button>
              </div>

              <!-- 플러스 버튼 -->
              <div class="d-flex justify-content-center my-3">
                <button
                  class="btn btn-outline-dark rounded-circle plus-btn"
                  @click="isAdding = !isAdding"
                >
                  <i class="ri-add-line"></i>
                </button>
              </div>

              <button class="btn btn-mint w-100 py-3" @click="$router.push('/interview/progress')">
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
const companySearch = ref("");
const selectedCompany = ref("한국인공지능소프트웨어산업협회");

const files = ref([
  "구글_김병현_이력서.pdf",
  "구글_김병현_포트폴리오.pdf",
  "구글_김병현_자기소개서.pdf",
]);
const selectedFiles = ref([]);

const applyFiles = () => {
  alert(`적용된 서류: ${selectedFiles.value.join(", ")}`);
};

const questions = ref([
  "1분 동안 자기소개를 해주세요.",
  "우리 회사에 지원한 이유는 무엇인가요?",
  "당신의 강점과 약점은 무엇인가요?",
  "팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하셨나요?",
  "AI 프로젝트를 개발할 때 가장 어려웠던 부분은 무엇이었나요?",
]);

const isAdding = ref(false);
const newQuestion = ref("");

const addQuestion = () => {
  if (newQuestion.value.trim()) {
    questions.value.push(newQuestion.value);
    newQuestion.value = "";
    isAdding.value = false;
  }
};

const generateQuestions = () => {
  alert("AI가 예상 질문을 생성했습니다!");
};
</script>

<style scoped>
.mock-interview {
  background-color: #fff;
  font-family: "Pretendard", sans-serif;
  color: #222;
}

/* 민트 컬러 */
.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none;
}
.btn-mint:hover {
  background-color: #5cd8ab !important;
}

/* 짙은 민트 */
.btn-deep-mint {
  background-color: #00b17f !important;
  color: #fff !important;
  border: none;
}
.btn-deep-mint:hover {
  background-color: #009a70 !important;
}

/* 유형 버튼 동일 크기 */
.type-btn {
  height: 110px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 15px;
  border-radius: 8px;
  transition: 0.2s;
  padding: 0; /* ✅ 버튼 내 여백 통일 */
  line-height: 1.2; /* ✅ 높이 점프 방지 */
  border: 1px solid #000; /* ✅ 기본 테두리 유지 */
  background-color: #fff; /* ✅ 기본 배경 */
}

/* ✅ 선택된 버튼 스타일 (높이 유지) */
.type-btn.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: 1px solid #71ebbe !important;
  height: 110px; /* ✅ 클릭 시에도 동일 높이 */
}

/* ✅ 비활성 버튼 */
.type-btn.btn-outline-dark {
  background-color: #fff !important;
  border: 1px solid #000 !important;
  color: #000 !important;
  height: 110px; /* ✅ 클릭 시에도 동일 높이 */
}

.type-btn .desc {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.btn-outline-dark {
  background-color: #fff !important;
  border: 1px solid #000 !important;
  color: #000 !important;
}
.btn-outline-dark:hover {
  background-color: #f9f9f9 !important;
}


/* 질문 박스 */
.question-box {
  background-color: #fff;
}
.bg-light-green {
  background-color: #f3fef9 !important;
}

/* 플러스 버튼 */
.add-question-box {
  max-width: 500px;
  margin: 0 auto;
}

.plus-btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  font-size: 22px;
  color: #000;
}

.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
  white-space: nowrap; 
  min-width: 70px;     
  height: 45px;        
}
.btn-mint:hover {
  background-color: #5cd8ab !important;
}
</style>
