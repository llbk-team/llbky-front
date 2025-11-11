<template>
  <div class="container py-4">
    <form @submit.prevent="generatePlan">

      <LearningHeader :current-step="2" />

      <section class="info-section">
        <div class="info-box green-info">
          좋아요! '백엔드 개발자'를 목표로 하고 있군요.
          <br>
          이제 강화하고 싶은 기술이나 부족한 역량을 선택해볼까요?
        </div>

        <div class="info-box yellow-info" @click="openResumeModal">
          <span>📄</span>
          <strong>이력서 분석 결과 불러오기</strong>
          <p>분석 모듈에서 나온 JSON 데이터를 불러옵니다</p>
        </div>
      </section>

      <section class="main-content">

        <div class="content-column">
          <h3>부족 역량 선택</h3>
          <div class="info-box green-info-light">
            선택한 직무에 맞춰 추천한 기술 목록이에요
          </div>

          <div class="skill-list-wrapper">
            <div class="checkbox-item" v-for="skill in recommendedSkills" :key="skill">
              <input type="checkbox" :id="'skill-' + skill" :value="skill" v-model="formData.lackingSkills">
              <label :for="'skill-' + skill">{{ skill }}</label>
            </div>
          </div>
        </div>

        <div class="content-column">
          <h3>관심 기술</h3>
          <div class="info-box green-info-light">
            새롭게 배우고 싶은 기술이 있다면 추가하세요
          </div>

          <div class="add-skill-form">
            <input type="text" v-model="newSkill" placeholder="새 기술 입력..." @keydown.enter.prevent="addSkill" class="skill-input">
            <button type="button" @click="addSkill" class="add-button">
              + 추가
            </button>
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


      <footer class="navigation-buttons">
        <router-link :to="`/learning/goal`" class="btn btn-secondary">
          ← 이전
        </router-link>
        <router-link :to="`/learning/roadmap`" class="btn btn-primary">
          플랜 생성하기 ▶
        </router-link>
      </footer>

    </form>

    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <h4 class="fw-bold mb-3">📄 이력서 분석 결과 선택</h4>
        <p class="text-muted small mb-3">
          아래 결과 중 하나를 선택하세요. (가상 데이터)
        </p>

        <ul class="resume-list">
          <li
            v-for="(item, index) in mockResumes"
            :key="index"
            @click="selectResume(item)"
            class="resume-item"
          >
            <strong>{{ item.title }}</strong>
            <p class="small text-muted mb-1">예상 강점: {{ item.strengths.join(', ') }}</p>
            <p class="small text-muted">보완 필요: {{ item.weaknesses.join(', ') }}</p>
          </li>
        </ul>

        <button class="btn btn-dark w-100 mt-3" @click="closeModal">
          닫기
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import LearningHeader from "@/components/bar/LearningHeader.vue";

const store = useStore();
const skills = ["SQL", "Spring", "Docker", "AWS"];
const selectedSkills = ref([]);

onMounted(() => {
  if (store.getters["learning/getProgress"] < 50) {
    store.dispatch("learning/updateProgress", 50);
  }
});

watch(selectedSkills, (newVal) => {
  store.dispatch("learning/updateProgress", newVal.length > 0 ? 100 : 50);
});



// 폼 전체 데이터를 관리하는 ref
const formData = ref({
  lackingSkills: [],     // "부족 역량" 체크박스 (배열)
  interestedSkills: [],  // "관심 기술" (사용자 추가 목록)
});

// "부족 역량" 목록 (v-for 렌더링용)
// (이미지보다 많게 추가하여 스크롤이 생기도록 했습니다)
const recommendedSkills = ref([
  'SQL', 'Spring Security', 'REST API', 'JPA', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'
]);

// "관심 기술" 추가용 임시 ref
const newSkill = ref('');

// "관심 기술"에 새 기술을 추가하는 함수
function addSkill() {
  const skillToAdd = newSkill.value.trim();
  if (skillToAdd !== '' && !formData.value.interestedSkills.includes(skillToAdd)) {
    formData.value.interestedSkills.push(skillToAdd);
    newSkill.value = ''; // 입력창 비우기
  }
}

// "관심 기술"에서 기술을 제거하는 함수
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
  // 선택 시 모달 닫고 부족 역량 자동 반영
  formData.value.lackingSkills = [...new Set(item.weaknesses)]
  showModal.value = false
  alert(`✅ "${item.title}" 결과를 불러왔습니다!`)
}





// "플랜 생성하기" (폼 제출) 함수
function generatePlan() {
  console.log('플랜 생성 데이터:', formData.value);
  alert('플랜을 생성합니다!\n' + JSON.stringify(formData.value, null, 2));
  // 여기서 emit을 하거나 API를 호출합니다.
  // emit('generate-plan', formData.value);
}

// "이전" 버튼 함수
function goToPrevious() {
  console.log('이전 단계로 이동');
  // 여기서 emit을 하거나 라우터 로직을 수행합니다.
  // emit('prev-step');
}
</script>

<style scoped>
/* 전체 컨테이너 (이전 요청대로 테두리 없음) */
.ai-coaching-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
}

.main-title {
  font-size: 1.8rem;
  /* 28px */
  font-weight: 700;
  margin-bottom: 24px;
}

.info-section {
  margin-bottom: 24px;
}

/* 정보 박스 공통 스타일 */
.info-box {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

/* 상단 메인 녹색 박스 */
.green-info {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  line-height: 1.6;
}

/* 서브 녹색 박스 (연한 버전) */
.green-info-light {
  background-color: #f8fcfb;
  color: #333;
  border: 1px solid #e0f3eb;
  padding: 12px 16px;
  font-size: 0.875rem;
}

/* 이력서 노란색 박스 */
.yellow-info {
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
  display: flex;
  align-items: center;
  gap: 12px;
}

.yellow-info span {
  font-size: 1.5rem;
}

.yellow-info strong {
  color: #78350f;
  font-weight: 600;
}

.yellow-info p {
  margin: 0;
  font-size: 0.875rem;
}

/* 메인 컨텐츠 2단 레이아웃 */
.main-content {
  display: flex;
  gap: 24px;
  margin-top: 32px;
}

.content-column {
  flex: 1;
  /* 두 컬럼이 1:1 비율을 가짐 */
}

.content-column h3 {
  font-size: 1.25rem;
  /* 20px */
  font-weight: 600;
  margin-bottom: 12px;
}

/* 왼쪽: 기술 목록 스크롤 래퍼 */
.skill-list-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  max-height: 250px;
  /* 스크롤 높이 지정 */
  overflow-y: auto;
  margin-top: 12px;
}

/* ★★★ 이전 컴포넌트의 체크박스 스타일 재사용 ★★★ */
.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.checkbox-item:last-child {
  margin-bottom: 0;
}

.checkbox-item:hover {
  background-color: #f9fafb;
}

.checkbox-item:has(input[type="checkbox"]:checked) {
  background-color: #f0fdf4;
  border-color: #10b981;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
}

.checkbox-item label {
  font-size: 1rem;
  cursor: pointer;
  flex-grow: 1;
}

/* ★★★ 여기까지 ★★★ */


/* 오른쪽: 기술 추가 폼 */
.add-skill-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.skill-input {
  flex-grow: 1;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.add-button {
  padding: 0 16px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: #A2F1D6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #71EBBE;
}

/* 추가된 기술 목록 (UX 향상) */
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
  background-color: #f9fafb;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.remove-button {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
}

.remove-button:hover {
  color: #ef4444;
  /* 빨간색 */
}

/* 하단 네비게이션 버튼 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  /* 상단 섹션과 구분선 */
}

/* 버튼 공통 스타일 */
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

/* "플랜 생성하기" 버튼 (이전 컴포넌트의 submit과 동일) */
.btn-primary {
  background-color: #111827;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #374151;
}

/* "이전" 버튼 */
.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

/* 반응형: 모바일에서 1단 레이아웃으로 변경 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .yellow-info {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ✅ 모달 배경 (지금 너무 어두워서 투명도 조정) */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35); /* ← 진한 검정 대신 35% 투명도 */
  backdrop-filter: blur(2px); /* 살짝 블러 효과 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* ✅ 모달 박스 */
.modal-content {
  background: #ffffff; /* 완전 흰색 배경 */
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  color: #111111; /* 검정 텍스트 보이게 */
  pointer-events: auto;
  z-index: 2100;
}
.yellow-info {
  cursor: pointer;
  transition: background-color 0.2s;
}
.yellow-info:hover {
  background-color: #fef3c7; /* 살짝 더 진한 노랑 */
}

</style>