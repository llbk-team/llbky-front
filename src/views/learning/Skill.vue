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

    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <h4 class="fw-bold mb-3">📄 이력서 분석 결과 선택</h4>
        <p class="text-muted small mb-3">아래 결과 중 하나를 선택하세요. (가상 데이터)</p>

        <ul class="resume-list">
          <li v-for="(item, index) in mockResumes" :key="index" @click="selectResume(item)" class="resume-item">
            <strong>{{ item.title }}</strong>
            <p class="small text-muted mb-1">예상 강점: {{ item.strengths.join(', ') }}</p>
            <p class="small text-muted">보완 필요: {{ item.weaknesses.join(', ') }}</p>
          </li>
        </ul>
        <button class="btn btn-dark w-100 mt-3" @click="closeModal">닫기</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const selectedSkills = ref([]);

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

const showModal = ref(false)
const mockResumes = ref([
  {
    title: '이력서 #1 - Java 백엔드 중심',
    strengths: ['Java', 'Spring Boot', '팀 협업'],
    weaknesses: ['Docker', 'AWS', '보안']
  },
  {
    title: '이력서 #2 - 인프라 기반 백엔드',
    strengths: ['Linux', 'CI/CD', '서버 운영'],
    weaknesses: ['Spring Security', 'JPA']
  },
  {
    title: '이력서 #3 - 데이터 중심 개발자',
    strengths: ['SQL', '데이터 분석', '문제 해결 능력'],
    weaknesses: ['REST API', '테스트 자동화']
  }
])

function openResumeModal() {
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function selectResume(item) {
  formData.value.lackingSkills = [...new Set(item.weaknesses)]
  showModal.value = false
  alert(`✅ "${item.title}" 결과를 불러왔습니다!`)
}

function generatePlan() {
  console.log('플랜 생성 데이터:', formData.value);
  alert('플랜을 생성합니다!\n' + JSON.stringify(formData.value, null, 2));
}

</script>

<style scoped>
.ai-coaching-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 24px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.main-title {
  font-size: 28.8px;
  font-weight: 700;
  margin-bottom: 24px;
}

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

.checkbox-item:last-child {
  margin-bottom: 0;
}

.checkbox-item:hover {
  background-color: #F9FAFB;
}

.checkbox-item:has(input[type="checkbox"]:checked) {
  background-color: #F0FDF4;
  border-color: #10B981;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
}

.checkbox-item label {
  font-size: 16px;
  cursor: pointer;
  flex-grow: 1;
}

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
  font-size: 13.5px;
  font-weight: 500;
  height: 37px;
  border-radius: 6px;
  background-color: #A2F1D6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #71EBBE;
}

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
  font-size: 15.2px;
}

.remove-button {
  background: none;
  border: none;
  color: #9CA3AF;
  font-size: 19.2px;
  cursor: pointer;
  padding: 0px 4px;
}

.remove-button:hover {
  color: #EF4444;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  font-size: 13.5px;
  font-weight: 500;
  height: 37px;
  border-radius: 6px;
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
  color: #374151;
  border: 1px solid #D1D5DB;
}

.btn-secondary:hover {
  background-color: #F9FAFB;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .yellow-info {
    flex-direction: column;
    align-items: flex-start;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: #FFFFFF;
  padding: 24px;
  border-radius: 6px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.15);
  color: #111111;
  pointer-events: auto;
  z-index: 2100;
}

.yellow-info {
  cursor: pointer;
  transition: background-color 0.2s;
}

.yellow-info:hover {
  background-color: #FEF3C7;
}

.title {
  font-weight: 700;
  font-size: 28px;
}

.subtitle {
  color: #6C757D;
  font-size: 16px;
  margin-bottom: 0px;
}
</style>