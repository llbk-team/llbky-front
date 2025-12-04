<template>
  <div class="container py-4 main-wrapper">

    <!-- 페이지 제목 -->
    <div>
      <div class="title">AI 학습 설정</div>
      <div class="subtitle">목표 직무와 학습 목적을 선택하고 시작해보세요</div>
    </div>

    <div class="row g-4">

      <!-- LEFT: 내 직무 + 주당 공부시간 -->
      <div class="col-md-4 left-col">

        <!-- 내 직무 -->
        <div class="card shadow-sm p-4 card-clean mb-3">
          <h5 class="fw-bold mb-3">내 희망 직무</h5>
          <div class="job-tag-wrapper mb-3">
            <span class="job-tag">백엔드 개발자</span>
          </div>
          <p class="text-muted small mb-0">직무는 마이페이지에서 변경 가능합니다.</p>
        </div>

        <!-- 하루 공부 가능 시간 -->
        <div class="card shadow-sm p-3 card-clean study-box mb-3">
          <h6 class="fw-bold mb-2 text-center">하루 공부 가능 시간</h6>

          <div class="study-time-selector">
            <button class="btn-circle" @click="decreaseHour">-</button>
            <span class="study-hour-text">{{ formData.studyHours }} 시간</span>
            <button class="btn-circle" @click="increaseHour">+</button>
          </div>
        </div>

      </div>

      <!-- RIGHT: 학습 목적 -->
      <div class="col-md-8">
        <div class="card shadow-sm p-4 card-clean h-100">
          <h5 class="fw-bold mb-3">학습 목적 (복수 선택)</h5>

          <div class="row">
            <div class="col-md-4" v-for="(section, index) in goalSections" :key="index">
              <h6 class="fw-semibold mb-2">{{ section.title }}</h6>

              <div v-for="(goal, i) in section.items" :key="i" class="checkbox-item">
                <input type="checkbox" :id="goal.id" :value="goal.value" v-model="formData[section.model]" />
                <label :for="goal.id">{{ goal.label }}</label>
              </div>

            </div>
          </div>

          <div class="info-box-mint mt-3">
            여러 개 선택 가능합니다. 목적에 따라 코칭 방향이 달라집니다.
          </div>

        </div>
      </div>

    </div>

    <!-- =======================
         아래 2열: 부족 역량 + 관심 기술
    ======================== -->
    <div class="row g-4 mt-0">

      <!-- 부족 역량 리스트 -->
      <div class="col-md-6">
        <div class="card shadow-sm p-4 card-clean h-100">
          <h5 class="fw-bold mb-2">부족 역량 선택</h5>
          <div class="info-box green-info-light mb-3">AI가 문서를 기반으로 추천한 기술입니다.</div>

          <div class="skill-scroll-box">
            <div v-if="recommendedSkills.length === 0" class="text-muted small">AI 추천 로딩 중...</div>

            <div v-for="skill in recommendedSkills" :key="skill" class="checkbox-item mb-2">
              <input type="checkbox" :id="'skill-' + skill" :value="skill" v-model="formData.lackingSkills" />
              <label :for="'skill-' + skill">{{ skill }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 관심 기술 -->
      <div class="col-md-6">
        <div class="card shadow-sm p-4 card-clean h-100">

          <h5 class="fw-bold mb-2">관심 기술</h5>
          <div class="info-box green-info-light mb-3">트렌드 기반 기술입니다.</div>

          <div class="skill-scroll-box mb-3">
            <div v-for="tech in interestSkillList" :key="tech" class="checkbox-item mb-2">
              <input type="checkbox" :id="'interest-' + tech" :value="tech" v-model="formData.interestedSkills" />
              <label :for="'interest-' + tech">{{ tech }}</label>
            </div>
          </div>

          <div class="add-skill-box">
            <input type="text" v-model="newInterestSkill" placeholder="기술 키워드 입력..." class="skill-input" @keydown.enter.prevent="addInterestSkill" />
            <button class="btn add-button" @click="addInterestSkill">추가</button>
          </div>

        </div>
      </div>

    </div>

    <!-- 플랜 생성하기 -->
    <div class="d-flex justify-content-end mt-4">
      <button class="btn btn-primary" @click="generateRoadmap">
        AI 플랜 생성하기 ▶
      </button>
    </div>

    <!-- 모달 -->
    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="resume-modal">

        <button class="modal-close-btn" @click="closeModal">&times;</button>
        <h4 class="fw-bold mb-2">📄 분석 결과 가져오기</h4>
        <p class="text-muted small mb-3">이력서 / 자소서 / 포트폴리오 중 선택하세요</p>

        <!-- 탭 -->
        <div class="doc-tabs mb-3">
          <button v-for="tab in docTabs" :key="tab.value" class="doc-tab-btn" :class="{ active: selectedTab === tab.value }" @click="selectedTab = tab.value">
            {{ tab.label }}
          </button>
        </div>

        <!-- 문서 리스트 -->
        <ul class="resume-list">
          <li v-for="(item, index) in filteredDocuments" :key="index" class="resume-item-new">
            <div class="d-flex justify-content-between align-items-center">
              <span class="resume-item-title">{{ item.title }}</span>
              <input type="checkbox" :value="item" v-model="selectedDocuments" />
            </div>
          </li>
        </ul>

        <button class="btn btn-dark w-100 mt-3" @click="applySelectedDocuments">
          선택한 문서 적용하기
        </button>

      </div>
    </div>

  </div>

  <!-- 전체 화면 스피너 -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p class="loading-text">AI가 로드맵을 생성 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import learningApi from "@/apis/learningApi";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const showModal = ref(false);
const selectedTab = ref("resume");
const selectedDocuments = ref([]);
const isLoading = ref(false);

const selectedGoal = ref(""); // 예: "백엔드 개발자", "SQLD", "Redis 공부"


// ----------------------------
// AI 추천 기술 저장 리스트
// ----------------------------
const recommendedSkills = ref([]);

// ----------------------------
// 부족 역량 추천 API 호출
// ----------------------------
async function loadRecommendedSkills() {
  const memberId = 1;

  try {
    const res = await learningApi.recommendSkills(memberId);

    console.log("🔥 AI 추천 기술:", res.data);

    // 백엔드 응답 형식: { skills: [...] }
    recommendedSkills.value = res.data.skills || [];

  } catch (err) {
    console.error("AI 추천 기술 로딩 실패:", err);
    recommendedSkills.value = [];
  }
}

// ----------------------------
// 폼 데이터
// ----------------------------
const formData = ref({
  careerGoals: [],
  learningGoals: [],
  projectGoals: [],
  studyHours: 3,
  lackingSkills: [],
  interestedSkills: ["MSA", "Spring Batch", "Redis", "OAuth2"]
});

// 시간 증가/감소
function increaseHour() { if (formData.value.studyHours < 15) formData.value.studyHours++; }
function decreaseHour() { if (formData.value.studyHours > 1) formData.value.studyHours--; }

// ----------------------------
// 학습 목적 섹션
// ----------------------------
const goalSections = [
  {
    title: '커리어',
    model: 'careerGoals',
    items: [
      { id: 'career-prep', label: '취업 준비', value: 'job-prep' },
      { id: 'career-change', label: '이직 준비', value: 'job-change' },
      { id: 'career-switch', label: '커리어 전환', value: 'job-switch' }
    ]
  },
  {
    title: '학습',
    model: 'learningGoals',
    items: [
      { id: 'learn-cert', label: '자격증 취득', value: 'certification' },
      { id: 'learn-basics', label: '기초 다지기', value: 'basics' },
      { id: 'learn-deepen', label: '기술 심화', value: 'deepen' },
      { id: 'learn-develop', label: '자기계발', value: 'self-dev' }
    ]
  },
  {
    title: '프로젝트',
    model: 'projectGoals',
    items: [
      { id: 'proj-portfolio', label: '포트폴리오', value: 'portfolio' },
      { id: 'proj-side', label: '사이드 프로젝트', value: 'side-project' },
      { id: 'proj-study', label: '학습 루틴', value: 'study-main' },
      { id: 'proj-explore', label: '진로 탐색', value: 'explore' }
    ]
  }
];

// ----------------------------
// 관심 기술
// ----------------------------
const interestSkillList = ref(["MSA", "Spring Batch", "Redis", "OAuth2"]);
const newInterestSkill = ref("");

function addInterestSkill() {
  const keyword = newInterestSkill.value.trim();

  if (!keyword) return;
  if (interestSkillList.value.includes(keyword)) {
    alert("이미 존재하는 키워드입니다.");
    return;
  }

  interestSkillList.value.push(keyword);
  newInterestSkill.value = "";
}

// ----------------------------
// 문서 모달
// ----------------------------
const allDocuments = ref([
  { type: "resume", title: "이력서 #1 - Java 백엔드", weaknesses: ["AWS", "Docker"] },
  { type: "resume", title: "이력서 #2 - 인프라 기반", weaknesses: ["JPA"] },
  { type: "cover-letter", title: "자소서 #1 - 백엔드 지원", weaknesses: ["근거 부족"] },
  { type: "portfolio", title: "포트폴리오 #1 - 쇼핑몰", weaknesses: ["테스트 자동화"] },
]);

const docTabs = [
  { label: "이력서", value: "resume" },
  { label: "자소서", value: "cover-letter" },
  { label: "포트폴리오", value: "portfolio" }
];

const filteredDocuments = computed(() =>
  allDocuments.value.filter(doc => doc.type === selectedTab.value)
);

function applySelectedDocuments() {
  if (selectedDocuments.value.length === 0) {
    alert("선택된 문서가 없습니다!");
    return;
  }

  const combined = [...new Set(selectedDocuments.value.flatMap(d => d.weaknesses))];
  formData.value.lackingSkills = combined;
  showModal.value = false;
}

// ----------------------------
// 로드맵 생성
// ----------------------------
async function generateRoadmap() {
  // 1. 목적 체크
  const purposes = [
    ...formData.value.careerGoals,
    ...formData.value.learningGoals,
    ...formData.value.projectGoals
  ];

  if (purposes.length === 0) {
    alert("학습 목적을 최소 1개 이상 선택해주세요!");
    return;
  }

  isLoading.value = true;

  const memberId = 1;
  const studyHours = formData.value.studyHours;

  const skills = [
    ...formData.value.lackingSkills,
    ...formData.value.interestedSkills
  ];

  const fd = new FormData();
  fd.append("memberId", memberId);
  fd.append("studyHours", studyHours);
  purposes.forEach(p => fd.append("purposes", p));
  skills.forEach(s => fd.append("skills", s));

  try {
    const res = await learningApi.createRoadmap(fd);

    console.log("🔥 생성된 로드맵:", res.data);

    store.dispatch("learning/saveRoadmap", res.data);
    router.push("/learning/roadmap");

  } catch (err) {
    alert("로드맵 생성 중 오류가 발생했습니다.");
  } finally {
    isLoading.value = false;
  }
}


function closeModal() {
  showModal.value = false;
}

// ----------------------------
// 페이지 진입 시 AI 추천 기술 불러오기
// ----------------------------
onMounted(() => {
  loadRecommendedSkills();
});
</script>


<style scoped>
* {
  font-family: 'Pretendard', 'Inter', sans-serif;
}

.main-wrapper {
  max-width: 1150px;
}

/* 제목 */
.title {
  font-weight: 700;
  font-size: 28px;
}

.subtitle {
  color: #6C757D;
  font-size: 16px;
  margin-bottom: 16px;
}

/* 카드 */
.card-clean {
  border-radius: 14px;
  border: 1px solid #EAEBEC;
  background-color: #FFFFFF;
}

/* 직무 태그 */
.job-tag {
  background: #111;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

/* 주당 공부 박스 */
.study-box {
  text-align: center;
}

.study-time-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 8px;
}

.btn-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #F3F4F6;
  border: 1px solid #DDD;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
}

.btn-circle:hover {
  background: #E5E7EB;
}

.study-hour-text {
  font-size: 20px;
  font-weight: 700;
}

/* 체크박스 */
.checkbox-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #EAEBEC;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
}

.checkbox-item:hover {
  background: #F6F6F6;
}

.checkbox-item input {
  margin-right: 10px;
}

/* info 박스 */
.info-box-mint {
  padding: 6px 14px;
  background: #f0fcf7;
  border: 1px solid #71EBBE;
  border-radius: 6px;
  font-size: 13px;
}

.green-info-light {
  background: #f0fcf7;
  border: 1px solid #71EBBE;
  padding: 12px;
  border-radius: 6px;
}

/* 스크롤 박스 */
.skill-scroll-box {
  max-height: 250px;
  overflow-y: auto;
}

/* 관심 기술 */
.added-skills-list {
  list-style: none;
  padding: 0;
}

.added-skills-list li {
  background: #F9FAFB;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
}

/* 플랜 버튼 */
.btn-primary {
  background: #111827;
  height: 37px;
  font-size: 14px;
}

.btn-primary:hover {
  background: #374151;
}

/* 모달 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
}

.resume-modal {
  background: #fff;
  width: 90%;
  max-width: 650px;
  padding: 30px;
  border-radius: 10px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
}

/* 탭 */
.doc-tab-btn {
  height: 37px;
  border-radius: 6px;
  padding: 6px 16px;
  background: #f1f1f1;
  border: 1px solid #ddd;
  cursor: pointer;
  margin-right: 6px;
}

.doc-tab-btn.active {
  background: #DDF3EB;
  border-color: #71EBBE;
}

/* 리스트 */
.resume-list {
  list-style: none;
  padding: 0;
}

.resume-item-new {
  background: #F9FAFB;
  border: 1px solid #EEE;
  padding: 14px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.add-skill-box {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.skill-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
}

.add-button {
  background-color: #A2F1D6;
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.add-button:hover {
  background-color: #71EBBE;
}

/* --------------------------
      전체 화면 로딩 스피너
--------------------------- */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 원형 스피너 */
.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #e5e7eb;
  border-top-color: #10b981; /* 초록 포인트 */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 14px;
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

</style>
