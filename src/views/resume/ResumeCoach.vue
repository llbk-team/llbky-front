<template>
  <div class="page-wrapper">
    <div class="main-layout">
      <!-- 컨텐츠 영역 -->
      <section class="content">
        <h1 class="title">서류 AI 코칭</h1>

        <!-- 로딩/에러 -->
        <div v-if="loading" class="alert alert-secondary py-2 mb-3">
          이력서와 AI 분석 결과를 불러오는 중입니다...
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-3">
          {{ error }}
        </div>

        <div class="resume-layout" v-if="resume">
          <!-- 상단: 이력서 & AI 제안 -->
          <div class="top-section">

            <!-- ⬅ 왼쪽: 이력서 상세 -->
            <div class="resume-card">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2>📄 이력서 상세</h2>
                <span class="badge bg-mint">{{ formatLabel }}</span>
              </div>

              <!-- 기본 형식 -->
              <div v-if="resumeFormat === 'default'">
                <div class="section">
                  <h3>기본 정보</h3>
                  <p><strong>제목:</strong> {{ resume.title }}</p>
                  <p><strong>회원 ID:</strong> {{ resume.memberId }}</p>
                </div>

                <div class="section" v-if="primaryCareer">
                  <h3>경력 사항</h3>
                  <p>
                    <strong>{{ primaryCareer.company }} | {{ primaryCareer.position }}</strong><br>
                    {{ careerPeriodText }}
                  </p>
                  <ul>
                    <li v-for="(item, idx) in primaryCareerBullets" :key="idx">
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div class="section" v-if="skillsText">
                  <h3>기술 스택</h3>
                  {{ skillsText }}
                </div>
              </div>

              <!-- 줄글 형식 -->
              <div v-else-if="resumeFormat === 'text'" class="text-format">
                <div class="section">
                  <h3>기본 정보</h3>
                  <p class="text-paragraph">
                    저는 <strong>{{ resume.title }}</strong> 이력서를 기반으로 지원하고 있으며,
                    회원 ID는 <strong>{{ resume.memberId }}</strong> 입니다.
                  </p>
                </div>

                <div class="section" v-if="primaryCareer">
                  <h3>경력 및 성과</h3>
                  <p class="text-paragraph">
                    <strong>{{ primaryCareer.company }}</strong>에서 
                    <strong>{{ primaryCareer.position }}</strong> 역할로 
                    {{ careerPeriodText }} 근무하였습니다.
                  </p>
                  <p class="text-paragraph" v-if="primaryCareer.responsibilities">
                    주요 업무: {{ primaryCareer.responsibilities }}
                  </p>
                </div>

                <div class="section" v-if="skillsText">
                  <h3>보유 기술</h3>
                  <p class="text-paragraph">
                    {{ skillsText }} 기술을 기반으로 다양한 프로젝트 경험이 있습니다.
                  </p>
                </div>
              </div>

              <!-- 표준 양식 -->
              <div v-else-if="resumeFormat === 'standard'" class="standard-format">

                <table class="table table-bordered resume-table">
                  <tbody>
                    <tr>
                      <th class="table-header" width="20%">이력서 제목</th>
                      <td width="30%">{{ resume.title }}</td>
                      <th class="table-header" width="20%">회원 ID</th>
                      <td width="30%">{{ resume.memberId }}</td>
                    </tr>
                    <tr>
                      <th class="table-header">작성일</th>
                      <td>{{ formattedCreatedAt }}</td>
                      <th class="table-header">수정일</th>
                      <td>{{ formattedUpdatedAt }}</td>
                    </tr>
                  </tbody>
                </table>

                <h3 class="mt-4 mb-3">경력사항</h3>
                <table class="table table-bordered resume-table" v-if="primaryCareer">
                  <thead>
                    <tr>
                      <th class="table-header">회사명</th>
                      <th class="table-header">직무</th>
                      <th class="table-header">기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ primaryCareer.company }}</td>
                      <td>{{ primaryCareer.position }}</td>
                      <td>{{ careerPeriodText }}</td>
                    </tr>
                  </tbody>
                </table>

                <h4 class="mt-3 mb-2" v-if="primaryCareerBullets.length">주요 업무</h4>
                <ul class="standard-list">
                  <li v-for="(item, idx) in primaryCareerBullets" :key="idx">
                    {{ item }}
                  </li>
                </ul>

                <h3 class="mt-4 mb-3" v-if="skillsText">보유 기술</h3>
                <table class="table table-bordered resume-table">
                  <tbody>
                    <tr>
                      <th class="table-header" width="20%">기술 스택</th>
                      <td>{{ skillsText }}</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>

            <!-- ➡ 오른쪽: AI 제안 -->
            <div class="edit-card">
              <h2>✏️ AI 제안</h2>
              <p class="edit-label ms-1">자소서 · 포트폴리오 맞춤 제안</p>

              <div class="before">
                <strong>자소서 강조 포인트</strong><br>
                <span v-if="coverLetterMain">{{ coverLetterMain }}</span>
                <span v-else class="text-muted">데이터 없음</span>
              </div>

              <div class="after">
                <strong>포트폴리오 추가 제안</strong><br>
                <span v-if="portfolioMain">{{ portfolioMain }}</span>
                <span v-else class="text-muted">데이터 없음</span>
              </div>
            </div>

          </div>

          <!-- 아래: AI 상세 리포트 -->
          <div class="card border-0 shadow-sm mt-4">
            <div class="card-body">
              <h2 class="title p-2">🧠 AI 코칭 결과</h2>

              <div class="score-details mb-4" v-if="score">
                <span><strong>경력 기술</strong> {{ score.careerScore }}%</span>
                <span><strong>적합도</strong> {{ score.matchScore }}%</span>
                <span><strong>완성도</strong> {{ score.completionScore }}%</span>
              </div>

              <div class="feedback mb-4">
                <div class="good mb-3">
                  <strong>강점</strong>
                  <ul v-if="strengths.length">
                    <li v-for="(s, idx) in strengths" :key="idx">{{ s }}</li>
                  </ul>
                  <p v-else class="text-muted small">강점 없음</p>
                </div>

                <div class="bad">
                  <strong>개선 사항</strong>
                  <ul v-if="weaknesses.length">
                    <li v-for="(w, idx) in weaknesses" :key="idx">{{ w }}</li>
                  </ul>
                  <p v-else class="text-muted small">개선 사항 없음</p>
                </div>
              </div>

              <!-- 이력서 형식 선택 -->
              <div class="d-flex flex-column gap-3 mb-4 align-items-center">
                <div class="subtitle2">이력서 형식 선택</div>
                <div class="text-muted small">
                  원하는 형식을 선택하면 화면에서 바로 확인할 수 있습니다.
                </div>
              </div>

              <div class="d-flex gap-4 mb-4 justify-content-center flex-wrap">

                <!-- 기본 형식 -->
                <button class="btn btn-resume-format"
                        :class="{ active: resumeFormat === 'default' }"
                        @click="setFormat('default')">
                  <div class="format-title">기본 형식</div>
                </button>

                <!-- 줄글 형식 (모달 열기만 JS에서) -->
                <button class="btn btn-resume-format"
                        :class="{ active: resumeFormat === 'text' }"
                        @click="openModal('text')">
                  <div class="format-title">줄글 형식 이력서</div>
                </button>

                <!-- 표준 양식 (모달 열기만 JS에서) -->
                <button class="btn btn-resume-format"
                        :class="{ active: resumeFormat === 'standard' }"
                        @click="openModal('standard')">
                  <div class="format-title">표준 양식 이력서</div>
                </button>
              </div>

              <div class="d-flex gap-3 justify-content-center">
                <button class="btn btn-outline-secondary btn-fixed-width"
                        @click="$router.push('/resume/list')">
                  리포트 목록으로
                </button>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>

    <!-- 줄글 형식 모달 -->
    <div class="modal fade" id="textFormatModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">📝 줄글 형식 이력서 샘플</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img src="/images/text-format-resume.png" class="img-fluid" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button class="btn btn-mint" @click="applyTextFormat">적용하기</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 표준 양식 모달 -->
    <div class="modal fade" id="standardFormatModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">📋 규격화된 이력서 샘플</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img src="/images/standard-format-resume.png" class="img-fluid" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button class="btn btn-mint" @click="applyStandardFormat">적용하기</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from 'bootstrap';
import resumeApi from '@/apis/resume';

// 🔎 URL에서 resumeId 가져오기
const route = useRoute();
const resumeId = computed(() => route.query.id);

// 상태 관리
const resume = ref(null);
const report = ref(null);
const resumeFormat = ref('default');
const loading = ref(false);
const error = ref('');

// ----------------------
// JSON Safe Parse 헬퍼
// ----------------------
const safeParse = (json, fallback) => {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch (err) {
    console.error('JSON 파싱 실패:', json);
    return fallback;
  }
};

// ----------------------
// 이력서 정보 파싱
// ----------------------
const careers = computed(() => safeParse(resume.value?.careerInfo, []));
const skillsRaw = computed(() => safeParse(resume.value?.skills, []));
const activities = computed(() => safeParse(resume.value?.activities, []));
const educations = computed(() => safeParse(resume.value?.educationInfo, []));
const certificates = computed(() => safeParse(resume.value?.certificates, []));

// 대표 경력
const primaryCareer = computed(() => {
  return careers.value?.[0] || null;
});

const careerPeriodText = computed(() => {
  if (!primaryCareer.value) return '';

  const { startDate, endDate, isCurrent } = primaryCareer.value;

  if (isCurrent) return `${startDate || ''} ~ 현재`;
  if (startDate || endDate) return `${startDate || ''} ~ ${endDate || ''}`;
  return '';
});

// 책임을 bullet로 변환
const primaryCareerBullets = computed(() => {
  if (!primaryCareer.value?.responsibilities) return [];
  return primaryCareer.value.responsibilities
    .split(/[\n•-]/)
    .map((s) => s.trim())
    .filter(Boolean);
});

// 스킬 표시
const skillsText = computed(() => {
  if (!skillsRaw.value?.length) return '';
  return typeof skillsRaw.value[0] === 'string'
    ? skillsRaw.value.join(', ')
    : skillsRaw.value.map((s) => s.name).join(', ');
});

// 날짜 표시
const formattedCreatedAt = computed(() => resume.value?.createdAt || '-');
const formattedUpdatedAt = computed(() => resume.value?.updatedAt || '-');

// ----------------------
// AI 분석 데이터
// ----------------------
const score = computed(() => report.value?.score || null);
const strengths = computed(() => report.value?.strengths || []);
const weaknesses = computed(() => report.value?.weaknesses || []);
const portfolioMain = computed(() => report.value?.portfolioSuggestions?.[0] || '');
const coverLetterMain = computed(() => report.value?.coverLetterSuggestions?.[0] || '');

// ----------------------
// UI 라벨
// ----------------------
const formatLabel = computed(() => {
  switch (resumeFormat.value) {
    case 'text': return '줄글 형식';
    case 'standard': return '규격화된 형식';
    default: return '기본 형식';
  }
});

// ----------------------
// 이력서 & 보고서 로드
// ----------------------
const loadData = async () => {
  if (!resumeId.value) {
    error.value = '이력서 ID가 없습니다.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // 1) 기본 이력서 정보
    const { data: resumeData } = await resumeApi.find(resumeId.value);
    resume.value = resumeData;

    // 2) AI 분석 리포트
    try {
      const { data: reportData } = await resumeApi.findanalyze(resumeId.value);
      report.value = reportData;
    } catch (e) {
      console.warn('AI 리포트 없음 → 정상:', e);
      report.value = null;
    }

  } catch (err) {
    error.value = '이력서를 불러오는 중 오류가 발생했습니다.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ----------------------
// 이력서 형식 선택
// ----------------------
const setFormat = (format) => {
  resumeFormat.value = format;
};

// ----------------------
// 모달 제어 (반투명 배경 문제 해결 핵심)
// ----------------------
let textModal = null;
let standardModal = null;

const openModal = (type) => {
  if (type === 'text') {
    const el = document.getElementById('textFormatModal');
    textModal = Modal.getOrCreateInstance(el);
    textModal.show();
  } else {
    const el = document.getElementById('standardFormatModal');
    standardModal = Modal.getOrCreateInstance(el);
    standardModal.show();
  }
};

const applyTextFormat = () => {
  resumeFormat.value = 'text';
  if (textModal) textModal.hide();
};

const applyStandardFormat = () => {
  resumeFormat.value = 'standard';
  if (standardModal) standardModal.hide();
};

// ----------------------
// 시작 시 실행
// ----------------------
onMounted(() => {
  loadData();
});
</script>




<style scoped>
/* 페이지 전체 레이아웃 */
.page-wrapper {
  background-color: #F6F6F6;
  min-height: 100vh;
}

.main-layout {
  display: flex;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.title {
  font-weight: 700;
  font-size: 1.75rem;
  margin-bottom: 15px;
}

.subtitle2 {
  font-weight: 600;
  font-size: 1.375rem;
  color: #333;
}

/* 레이아웃 */
.resume-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 상단 섹션: 좌우 2:1 */
.top-section {
  display: flex;
  gap: 1.5rem;
}

/* 이력서 카드 */
.resume-card {
  flex: 2;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.resume-card h2 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.badge.bg-mint {
  background-color: #A2D5C6 !important;
  color: #000;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.section:last-child {
  border-bottom: none;
}

.section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #333;
}

.section p {
  margin-bottom: 0.5rem;
  color: #555;
}

.section ul {
  margin-left: 1.5rem;
  color: #555;
}

.section li {
  margin-bottom: 0.4rem;
}

/* 줄글 형식 */
.text-format .text-paragraph {
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
}

/* 규격화된 스타일 */
.standard-format h3,
.standard-format h4 {
  font-size: 1.1rem;
  font-weight: 600;
}

.resume-table th.table-header {
  background-color: #f8f9fa;
  font-weight: 600;
  text-align: center;
}

.standard-list {
  margin-left: 1.5rem;
}

.standard-list li {
  line-height: 1.6;
}

/* AI 제안 카드 */
.edit-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-card h2 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.before, .after {
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.before {
  background: #fff8ea;
  border: 1px solid #ffe19d;
}

.after {
  background: #e9f8f2;
  border: 1px solid #A2D5C6;
}

/* AI 코칭 결과 */
.score-details {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.feedback {
  display: flex;
  flex-direction: column;
}

.good {
  background: #e9f8f2;
  border: 1px solid #A2D5C6;
  padding: 1rem;
  border-radius: 8px;
}

.bad {
  background: #eef7ff;
  border: 1px solid #c9e3ff;
  padding: 1rem;
  border-radius: 8px;
}

/* 이력서 형식 선택 버튼 */
.btn-resume-format {
  width: 250px;
  height: 37px;
  background: #acedd3;
  border: 1px solid #A2D5C6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.btn-resume-format:hover {
  background: #A2D5C6;
  transform: translateY(-5px);
}

.btn-resume-format.active {
  background: #A2D5C6;
  border-color: #8bc4b0;
}

/* 모달 */
.modal-header {
  background: #A2D5C6;
  color: #000;
}

.resume-sample-container {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}

/* 반응형 */
@media (max-width: 1024px) {
  .top-section { flex-direction: column; }
}

@media (max-width: 768px) {
  .content { padding: 1rem; }
  .btn-resume-format { width: 100%; height: 100px; }
}

/* 적용하기 버튼 색 유지 */
.btn-mint {
  background: #A2D5C6 !important;
  color: #000 !important;
  border: none !important;
  font-weight: 600;
}

.btn-mint:hover {
  background: #8bc4b0 !important;
  color: #000 !important;
}

</style>