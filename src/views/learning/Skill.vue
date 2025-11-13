<template>
  <div class="container py-4">
    <form @submit.prevent="generatePlan">

      <!-- 제목 -->
      <div class="d-flex justify-content-between align-items-end">
        <div>
          <div class="title">AI 학습 설정</div>
          <div class="subtitle mb-3">목표 직무와 학습 목적을 선택하고 나만의 코칭을 시작해보세요!</div>
        </div>
      </div>

      <section class="info-section">
        <div class="info-box green-info">좋아요! '백엔드 개발자'를 목표로 하고 있군요.<br>이제 강화하고 싶은 기술이나 부족한 역량을 선택해볼까요?</div>
        <div class="info-box yellow-info" @click="openResumeModal">
          <span>📄</span>
          <strong>이력서 분석 결과 불러오기</strong>
          <p>분석 모듈에서 나온 데이터를 불러옵니다</p>
        </div>
      </section>

      <section class="main-content">
        <div class="content-column">
          <h3>부족 역량 선택</h3>
          <div class="info-box green-info-light">선택한 직무에 맞춰 추천한 기술 목록이에요</div>

          <div class="skill-list-wrapper">
            <div class="checkbox-item" v-for="skill in recommendedSkills" :key="skill">
              <input type="checkbox" :id="'skill-' + skill" :value="skill" v-model="formData.lackingSkills">
              <label :for="'skill-' + skill">{{ skill }}</label>
            </div>
          </div>
        </div>

        <div class="content-column">
          <h3>관심 기술</h3>
          <div class="info-box green-info-light">새롭게 배우고 싶은 기술이 있다면 추가하세요</div>
          <div class="add-skill-form">
            <input type="text" v-model="newSkill" placeholder="새 기술 입력..." @keydown.enter.prevent="addSkill" class="skill-input">
            <button @click="addSkill" class="btn add-button">+ 추가</button>
          </div>
          <ul class="added-skills-list">
            <li v-for="(skill, index) in formData.interestedSkills" :key="index">
              <span>{{ skill }}</span>
              <button type="button" @click="removeSkill(index)" class="remove-button">
                &times;
              </button>
            </li>
          </ul>
        </div>
      </section>

      <div class="d-flex justify-content-between mt-4">
        <router-link :to="`/learning/goal`" class="btn btn-secondary">← 이전</router-link>
        <router-link :to="`/learning/roadmap`" class="btn btn-primary">플랜 생성하기 ▶</router-link>
      </div>
    </form>


    <!-- 모달 -->
    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="resume-modal">
        <button class="modal-close-btn" @click="closeModal">&times;</button>
        <h4 class="fw-bold mb-2">📄 분석 결과 가져오기</h4>
        <p class="text-muted small mb-3">이력서 / 자소서 / 포트폴리오 중 선택하세요</p>
        <!-- 카테고리 탭 -->
        <div class="doc-tabs mb-3">
          <button v-for="tab in docTabs" :key="tab.value" class="doc-tab-btn" :class="{ active: selectedTab === tab.value }" @click="selectedTab = tab.value">
            {{ tab.label }}
          </button>
        </div>
        <!-- 문서 리스트 (카테고리별 필터링) -->
        <ul class="resume-list">
          <li v-for="(item, index) in filteredDocuments" :key="index" class="resume-item-new">
            <div class="d-flex justify-content-between align-items-center">
              <span class="resume-item-title">{{ item.title }}</span>
              <input type="checkbox" :value="item" v-model="selectedDocuments" class="resume-checkbox" />
            </div>
          </li>
        </ul>
        <button class="btn btn-dark w-100 mt-3" @click="applySelectedDocuments">
          선택한 문서 적용하기
        </button>
      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const selectedSkills = ref([]);
const showModal = ref(false)

const docTabs = [
  { label: "이력서", value: "resume" },
  { label: "자소서", value: "cover-letter" },
  { label: "포트폴리오", value: "portfolio" }
]

const selectedTab = ref("resume")

// 전체 문서
const allDocuments = ref([
  { type: "resume", title: "이력서 #1 - Java 백엔드", weaknesses: ["AWS", "Docker"] },
  { type: "resume", title: "이력서 #2 - 인프라 기반", weaknesses: ["JPA"] },
  { type: "cover-letter", title: "자소서 #1 - 백엔드 지원", weaknesses: ["근거 부족"] },
  { type: "cover-letter", title: "자소서 #2 - 성장 경험 중심", weaknesses: ["협업 표현 부족"] },
  { type: "portfolio", title: "포트폴리오 #1 - 쇼핑몰", weaknesses: ["테스트 자동화"] },
  { type: "portfolio", title: "포트폴리오 #2 - Spring 프로젝트", weaknesses: ["CI/CD"] },
])

// 문서 필터링된 목록
const filteredDocuments = computed(() =>
  allDocuments.value.filter(doc => doc.type === selectedTab.value)
)

const selectedDocuments = ref([])

function openResumeModal() {
  selectedTab.value = "resume"
  selectedDocuments.value = []
  showModal.value = true
}

function applySelectedDocuments() {
  if (selectedDocuments.value.length === 0) {
    alert("선택된 문서가 없습니다!")
    return
  }

  const combinedWeakness = [
    ...new Set(selectedDocuments.value.flatMap(d => d.weaknesses))
  ]

  formData.value.lackingSkills = combinedWeakness
  showModal.value = false

  alert(`📄 ${selectedDocuments.value.length}개의 문서를 불러왔어요!`)
}

function closeModal() {
  showModal.value = false
}


onMounted(() => {
  if (store.getters["learning/getProgress"] < 50) {
    store.dispatch("learning/updateProgress", 50);
  }
});

watch(selectedSkills, (newVal) => {
  store.dispatch("learning/updateProgress", newVal.length > 0 ? 100 : 50);
});

const formData = ref({
  lackingSkills: [],
  interestedSkills: [],
});

const recommendedSkills = ref([
  'SQL', 'Spring Security', 'REST API', 'JPA', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'
]);

const newSkill = ref('');

function addSkill() {
  const skillToAdd = newSkill.value.trim();
  if (skillToAdd !== '' && !formData.value.interestedSkills.includes(skillToAdd)) {
    formData.value.interestedSkills.push(skillToAdd);
    newSkill.value = '';
  }
}

function removeSkill(index) {
  formData.value.interestedSkills.splice(index, 1);
}




</script>

<style scoped>
/* 전체 박스 */
.ai-coaching-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 24px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

/* 제목 */
.title {
  font-weight: 700;
  font-size: 28px;
}

.subtitle {
  color: #6C757D;
  font-size: 16px;
  margin-bottom: 0px;
}

/* 안내 박스 */
.info-section {
  margin-bottom: 24px;
}

.info-box {
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 15.2px;
}

.green-info {
  background-color: #F0FDF4;
  color: #166534;
  border: 1px solid #BBF7D0;
  line-height: 1.6;
}

.green-info-light {
  background-color: #F8FCFB;
  color: #333333;
  border: 1px solid #E0F3EB;
  padding: 12px 16px;
  font-size: 14px;
}

.yellow-info {
  background-color: #FFFBEB;
  color: #B45309;
  border: 1px solid #FDE68A;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.yellow-info:hover {
  background-color: #FEF3C7;
}

.yellow-info span {
  font-size: 24px;
}

.yellow-info strong {
  color: #78350F;
  font-weight: 600;
}

.yellow-info p {
  margin: 0;
  font-size: 14px;
}

/* 메인 2컬럼 */
.main-content {
  display: flex;
  gap: 24px;
  margin-top: 32px;
}

.content-column {
  flex: 1;
}

.content-column h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* 체크박스 리스트 */
.skill-list-wrapper {
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 12px;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 1px solid #EAEBEC;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  height: 37px;
  font-size: 13.5px;
  font-weight: 500;
}

.checkbox-item:hover {
  background-color: #F9FAFB;
}

.checkbox-item input {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
}

/* 관심 기술 추가 */
.add-skill-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.skill-input {
  flex-grow: 1;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
}

.add-button {
  padding: 0px 16px;
  height: 37px;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  background-color: #A2F1D6;
  cursor: pointer;
  transition: 0.2s;
}

.add-button:hover {
  background-color: #71EBBE;
}

/* 관심 기술 리스트 */
.added-skills-list {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}

.added-skills-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #F9FAFB;
  border-radius: 6px;
  margin-bottom: 8px;
}

.remove-button {
  background: none;
  border: none;
  color: #9CA3AF;
  font-size: 20px;
  cursor: pointer;
}

.remove-button:hover {
  color: #EF4444;
}

/* prev/next 버튼 */
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  height: 37px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
}

.btn-primary {
  background-color: #111827;
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: #374151;
}

.btn-secondary {
  background-color: #FFFFFF;
  border: 1px solid #D1D5DB;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #F9FAFB;
}

/* 모바일 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
}

/*──────────────────────────────*/
/* 모달 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.resume-modal {
  background: #FFFFFF;
  padding: 36px 40px;
  border-radius: 6px;
  width: 95%;
  max-width: 720px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.14);
}

.modal-close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #999;
  transition: 0.2s;
}

.modal-close-btn:hover {
  color: #555;
}

/* 탭 */
.doc-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.doc-tab-btn {
  width: 130px;
  height: 37px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  border: 1px solid #E5E7EB;
  background-color: #F9FAFB;
  cursor: pointer;
  transition: 0.2s;
}

.doc-tab-btn.active {
  background-color: #E8FFF5;
  border-color: #71EBBE;
  color: #0F5132;
}

/* 문서 리스트 */
.resume-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 55vh;
  overflow-y: auto;
}

.resume-item-new {
  padding: 20px 22px;
  background: #F9FAFB;
  border: 1px solid #EAEBEC;
  border-radius: 10px;
  margin-bottom: 14px;
  transition: 0.25s;
  cursor: pointer;
}

.resume-item-new:hover {
  background: #F0FDF4;
  border-color: #71EBBE;
}

.resume-item-title {
  font-size: 16px;
  font-weight: 500;
}

.resume-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* 적용 버튼 */
.resume-modal .btn-dark {
  width: 100%;
  height: 37px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  background-color: #111827;
  color: #FFFFFF;
  border: none;
  transition: 0.2s;
}

.resume-modal .btn-dark:hover {
  background-color: #374151;
}



</style>