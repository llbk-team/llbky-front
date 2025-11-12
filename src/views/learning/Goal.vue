<template>
  <div class="container py-4">

    <!-- 제목 -->
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="fw-bold fs-3 mb-1" style="color:#111111;">AI 학습 설정</h1>
        <p class="text-muted fs-6 mb-0">
          목표 직무와 학습 목적을 선택하고 나만의 코칭을 시작해보세요!
        </p>
      </div>
    </div>

    <!-- <LearningHeader :progress="progress" :current-step="1" /> -->

    <div class="row g-4">
      <!-- 왼쪽 -->
      <div class="col-md-4">
        <div class="card shadow-sm p-4 card-clean h-45">
          <h5 class="fw-bold mb-3 text-dark">내 직무</h5>
          <div class="job-tag-wrapper mb-3">
            <span class="job-tag">백엔드 개발자</span>
          </div>
          <p class="text-muted small mb-0">
            직무는 마이페이지에서 변경이 가능합니다.
          </p>
        </div>
      </div>

      <!-- 오른쪽 -->
      <div class="col-md-8">
        <div class="card shadow-sm p-4 card-clean">
          <h5 class="fw-bold mb-3 text-dark">학습 목적 (복수 선택)</h5>
          <div class="row">
            <div class="col-md-4" v-for="(section, index) in goalSections" :key="index">
              <h6 class="fw-semibold mb-2 text-dark">{{ section.title }}</h6>
              <div v-for="(goal, i) in section.items" :key="i" class="checkbox-item">
                <input type="checkbox" :id="goal.id" :value="goal.value" v-model="formData[section.model]" />
                <label :for="goal.id">{{ goal.label }}</label>
              </div>
            </div>
          </div>
          <div class="info-box bg-green-light border border-mint text-dark mt-3">
            여러 개 선택 가능합니다. 목적에 따라 코칭 방향이 달라집니다.
          </div>
        </div>
      </div>
    </div>

    <!-- 주당 공부 가능 시간 -->
    <div class="card shadow-sm p-4 card-clean mt-4 mb-4">
      <h5 class="fw-bold mb-3 text-dark">주당 공부 가능 시간</h5>
      <div class="d-flex align-items-center gap-3 mb-3">
        <!-- flex-grow 제거하고 custom-width 클래스 추가 -->
        <input type="range" id="study-hours" min="0" max="50" v-model.number="formData.studyHours" class="slider slider-narrow" @touchmove.prevent @wheel.prevent />
        <span class="fw-semibold text-mint fs-6">
          {{ formData.studyHours }} 시간
        </span>
      </div>
      <div class="info-box bg-green-light border border-mint text-dark">
        현실적으로 가능한 주당 공부 시간을 알려주세요.
      </div>
    </div>

    <router-link :to="`/learning/skill`" class="btn btn-outline-mint w-100 fw-semibold py-2 fs-6">
      ▶ AI 코칭 시작하기
    </router-link>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from "vuex"

const store = useStore();
const goals = ["취업 준비", "이직 준비", "기술 심화", "자기계발"];
const selectedGoals = ref([]);

store.dispatch("learning/updateProgress", 0); 

watch(selectedGoals, (newVal) => {
  store.dispatch("learning/updateProgress", newVal.length > 0 ? 50 : 0);
});

const formData = ref({
  careerGoals: [],
  learningGoals: [],
  projectGoals: [],
  studyHours: 25
})

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
]




</script>

<style scoped>
.goal-page-wrapper {
  background-color: #F1F2F3;
  min-height: calc(100vh - 80px);
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1.5rem;
}

.goal-container {
  width: 100%;
  max-width: 1140px;
  padding-left: 1rem;
  padding-right: 1rem;
}

.text-dark {
  color: #111111 !important;
}

.text-mint {
  color: #71EBBE;
}

.bg-green-light {
  background-color: #DDF3EB;
}

.border-mint {
  border-color: #71EBBE !important;
}

.card-clean {
  border-radius: 1rem;
  border: 1px solid #EAEBEC;
  background-color: #FFFFFF;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
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
}

.checkbox-item:hover {
  background-color: #F1F2F3;
}

.checkbox-item:has(input[type='checkbox']:checked) {
  background-color: #DDF3EB;
  border-color: #71EBBE;
}

.checkbox-item label {
  margin-left: 6px;
}

.job-tag {
  display: inline-block;
  background-color: #111111;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #EAEBEC;
  border-radius: 5px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: #71EBBE;
  border-radius: 50%;
  border: 4px solid #ffffff;
  cursor: pointer;
}

.btn-green {
  background-color: #71EBBE;
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 0.75rem;
  transition: 0.2s;
}

.btn-green:hover {
  background-color: #A2F1D6;
  border-color: #A2F1D6;
}

.btn-dark-solid {
  background-color: #111111;
  border: 1px solid #111111;
  color: #ffffff;
  border-radius: 0.75rem;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}

.btn-dark-solid:hover {
  background-color: #000000;
  border-color: #000000;
  color: #ffffff;
  transform: translateY(-1px);
}

.slider-narrow {
  width: 94%;
  flex-shrink: 0;
}

.info-box {
  padding: 5px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
}

.btn-outline-mint {
  border: 2px solid #A2F1D6;
  color: #111111;
  background-color: transparent;
  border-radius: 0.6rem;
  transition: all 0.2s ease;
}

.btn-outline-mint:hover {
  background-color: #111111;
  color: #ffffff;
  border-color: #111111;
}
</style>
