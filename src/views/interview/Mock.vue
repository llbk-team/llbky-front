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

              <div class="input-group">
                <input type="text" class="form-control p-3 rounded-start-3" v-model="companyQuery" @keyup.enter="searchCompany" placeholder="예: 네이버, 삼성전자, 카카오 등" />

                <button class="btn btn-outline-secondary px-4" @click="searchCompany">
                  검색
                </button>
              </div>

              <!-- 로딩 스피너 -->
              <div v-if="companyLoading" class="mt-2 text-muted small">
                <i class="spinner-border spinner-border-sm me-2"></i>
                검색 중...
              </div>

              <!-- 검색 결과 표시 -->
              <ul v-if="companyResults.length && !companyLoading" class="list-group mt-2">
                <li v-for="(c, index) in companyResults" :key="index" class="list-group-item list-group-item-action" @click="selectCompany(c)">
                  {{ c }}
                </li>
              </ul>

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
              <label class="fw-semibold mb-2 text-dark mt-4">분석할 PDF 파일 업로드</label>
              <small class="text-muted d-block mt-1 mb-2">
                AI 분석을 위해 이력서, 자기소개서, 포트폴리오 중 하나의 파일을 선택해주세요.
              </small>

              <input type="file" accept="application/pdf" class="form-control" @change="onFileSelect" />

              <!-- 선택된 파일 표시 -->
              <div v-if="selectedFileObject" class="mt-3 p-3 bg-light rounded-3 border">
                <strong class="text-dark">업로드된 파일:</strong>
                <span class="ms-2">{{ selectedFileObject.name }}</span>

                <button class="btn btn-sm btn-outline-danger float-end" @click="removeFile">
                  제거
                </button>
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

              <!-- 스피너 (AI 질문 생성 중일 때만 표시) -->
              <div v-if="loading" class="d-flex justify-content-center py-5">
                <div class="spinner-border text-success" role="status"></div>
              </div>

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

              <button class="btn btn-mint w-100 py-3 fw-medium" @click="saveSession">
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
import interviewMock from "@/utils/interviewMock";

const { useInterviewMock } = interviewMock;

const {
  type,

  companyQuery,
  companyResults,
  companyLoading,
  searchCompany,
  selectCompany,
  idealTalent,

  selectedKeywords,
  keywordList,

  questions,
  isAdding,
  newQuestion,
  showQuestions,
  loading,

  selectedFileObject,
  onFileSelect,
  removeFile,

  addQuestion,
  generateQuestions,
  saveSession,
} = useInterviewMock();

</script>

<style scoped src="@/assets/css/interviewMock.css"></style>
