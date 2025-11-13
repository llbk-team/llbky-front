<template>
  <div class="container py-4">

    <!-- 제목 -->
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <div class="title">AI 학습 설정</div>
        <div class="subtitle">목표 직무와 학습 목적을 선택하고 나만의 코칭을 시작해보세요!</div>
      </div>
    </div>

    <div class="row g-4">
      <!-- 왼쪽 -->
      <div class="col-md-4">
        <div class="card shadow-sm p-4 card-clean h-45">
          <h5 class="fw-bold mb-3">내 직무</h5>
          <div class="job-tag-wrapper mb-3">
            <span class="job-tag">백엔드 개발자</span>
          </div>
          <p class="text-muted small mb-0">직무는 마이페이지에서 변경이 가능합니다.</p>
        </div>
      </div>

      <!-- 오른쪽 -->
      <div class="col-md-8">
        <div class="card shadow-sm p-4 card-clean">
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
          <div class="info-box-mint">여러 개 선택 가능합니다. 목적에 따라 코칭 방향이 달라집니다.</div>
        </div>
      </div>
    </div>

    <!-- 주당 공부 가능 시간 -->
    <div class="card shadow-sm p-4 card-clean mt-4 mb-4">
      <h5 class="fw-bold mb-3">주당 공부 가능 시간</h5>
      <div class="d-flex align-items-center gap-3 mb-3">
        <input type="range" id="study-hours" min="0" max="50" v-model.number="formData.studyHours" class="slider slider-narrow" @touchmove.prevent @wheel.prevent />
        <span class="fw-semibold text-mint fs-6">
          {{ formData.studyHours }} 시간
        </span>
      </div>
      <div class="info-box-mint">현실적으로 가능한 주당 공부 시간을 알려주세요.</div>
    </div>

    <router-link :to="`/learning/skill`" class="btn btn-outline-mint w-100">▶ AI 코칭 시작하기</router-link>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from "vuex"

const store = useStore();
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
  padding-top: 24px;
}

.goal-container {
  width: 100%;
  max-width: 1140px;
  padding-left: 16px;
  padding-right: 16px;
}

.text-mint {
  color: #71EBBE;
}

.card-clean {
  border-radius: 16px;
  border: 1px solid #EAEBEC;
  background-color: #FFFFFF;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
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
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 13.5px;
  font-weight: 500;
  height: 37px;
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
  border: 4px solid #FFFFFF;
  cursor: pointer;
}

.btn-green {
  background-color: #71EBBE;
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 12px;
  transition: 0.2s;
}

.btn-green:hover {
  background-color: #A2F1D6;
  border-color: #A2F1D6;
}

.btn-dark-solid {
  background-color: #111111;
  border: 1px solid #111111;
  color: #FFFFFF;
  border-radius: 12px;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}

.btn-dark-solid:hover {
  background-color: #000000;
  border-color: #000000;
  color: #FFFFFF;
  transform: translateY(-1px);
}

.slider-narrow {
  width: 94%;
  flex-shrink: 0;
}

.btn-outline-mint {
  height: 37px;
  border: 2px solid #A2F1D6;
  border-radius: 6px;
  font-size: 13.5px;
  background-color: transparent;
  border-radius: 9.6px;
  transition: all 0.2s ease;
  font-weight: 700;
}

.btn-outline-mint:hover {
  background-color: #111111;
  color: #FFFFFF;
  border-color: #111111;
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

.info-box-mint {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  border-radius: 6px;
  font-size: 13.5px;
  height: 37px;
  background-color: #DDF3EB;
  border: 1px solid #71EBBE;
  font-weight: 500;
}

</style>
