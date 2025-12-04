<template>
  <div class="roadmap-container container py-5">

    <div class="title mb-3 text-center">나의 맞춤 학습 로드맵</div>
    <div class="alert alert-mint shadow-sm" role="alert">
      AI 학습 코치가 목표 <strong>'백엔드 개발자'</strong>를 기준으로 <strong>'취업 준비 + 자기계발'</strong> 플랜을 생성했어요!
    </div>

    <div class="d-flex flex-wrap justify-content-center gap-3 my-4">
      <span class="summary-tag">📅 총 4주</span>
      <span class="summary-tag">⏰ 주당 25시간</span>
      <span class="summary-tag">🏁 백엔드 포트폴리오 완성</span>
    </div>

    <div class="row">

      <div class="col-md-6 mb-4" v-for="week in roadmapData.weeks" :key="week.weekNumber">
        <div class="week-card shadow-sm clickable-card" @click="openWeekModal(week)">
          <h4>{{ week.title }}</h4>

          <p class="week-goal"><strong>🎯 목표:</strong> {{ week.goal }}</p>
          <p class="week-summary"><strong>📌 요약:</strong> {{ week.learningWeekSummary }}</p>

          <ul class="topic-list list-unstyled">
            <li v-for="day in week.days" :key="day.dayNumber">
              <span class="day-title">{{ day.dayNumber }}일차 — {{ day.title }}</span><br />
            </li>
          </ul>
        </div>

      </div>
    </div>


    <!-- 📘 주차 상세 모달 -->
    <div v-if="showWeekModal" class="week-modal-overlay" @click.self="closeWeekModal">
      <div class="week-modal-content shadow-lg">

        <!-- Header -->
        <div class="modal-header-row">
          <h4 class="fw-bold">{{ selectedWeek.title }}</h4>
          <button class="btn-close" @click="closeWeekModal"></button>
        </div>

        <!-- Week Summary -->
        <p class="week-summary-text">{{ selectedWeek.learningWeekSummary }}</p>

        <!-- Divider -->
        <hr class="modal-divider" />

        <!-- Day detail list -->
        <div class="day-list-wrapper">
          <div v-for="day in selectedWeek.days" :key="day.dayNumber" class="day-card">
            <div class="day-card-title">
              {{ day.dayNumber }}일차 — {{ day.title }}
            </div>

            <div class="day-card-content">
              {{ day.content }}
            </div>
          </div>
        </div>

      </div>
    </div>



    <!-- AI 질문 모달 -->
    <div v-if="showAiModal" class="ai-modal-overlay" @click.self="closeAiModal">
      <div class="ai-modal-content shadow-lg">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">🧭 현재 로드맵 요약</h5>
          <button class="btn-close" @click="closeAiModal"></button>
        </div>
        <ul class="list-group mb-3">
          <li v-for="week in roadmapData.weeks" :key="week.weekNumber" class="list-group-item">
            {{ week.weekNumber }}주차: {{ week.title.replace(/\[.*?\]\s*/, '') }}
          </li>

        </ul>

        <p class="text-center text-muted mb-3">
          질문을 입력하면 AI가 답변해드려요!<br />
          <small>예: "Spring Security가 어려워요. 다른 순서로 바꿀 수 있나요?"</small>
        </p>

        <div class="ai-input">
          <input v-model="aiInput" type="text" class="form-control" placeholder="Spring Security가 어려워요. 다른 순서로 바꿀 수 있나요?" />
          <button class="btn btn-mint ms-2" @click="sendRefineRequest" :disabled="isSending">
            <span v-if="!isSending">전송</span>

            <!-- 로딩 스피너 -->
            <span v-else>
              <div class="spinner-border spinner-border-sm text-success" role="status"></div>
            </span>
          </button>

        </div>
      </div>
    </div>

    <div class="bottom-actions d-flex justify-content-between align-items-center">
      <router-link :to="`/learning/goal`" class="btn btn-secondary">← 이전</router-link>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-mint" @click="openAiModal">플랜 수정하기</button>
        <button type="button" class="btn btn-dark" @click="saveRoadmap">플랜 저장</button>

      </div>
    </div>


    <!-- 저장 완료 모달 -->
    <div v-if="showSaveModal" class="save-modal-overlay">
      <div class="save-modal-content shadow-lg text-center">
        <h4 class="fw-bold mb-3">플랜이 저장되었습니다!</h4>

        <div class="alert alert-mint-light mb-4">
          🎯 <strong>'백엔드 개발자 – 취업 준비 + 자기계발'</strong><br />
          4주 학습 로드맵이 내 학습함에 추가되었습니다.
        </div>

        <p class="fw-semibold mb-3">👉 다음 단계로 이동할까요?</p>

        <div class="d-flex justify-content-center gap-3 mb-4">
          <router-link :to="`/learning/start`" class="btn btn-dark" @click="startLearning">▶ 학습 시작하기</router-link>
          <router-link :to="`/learning/coach`" class="btn btn-mint" @click="goToMyLearning">📁 내 학습함</router-link>
        </div>
        <div class="ai-tip">💬 <strong>AI 팁:</strong> 이제 주차별 학습을 진행하면,<br />진행률과 피드백을 자동으로 기록해드릴게요!!!!!!!!!!!!!!!</div>
      </div>
    </div>

    <!-- AI 수정 로딩 오버레이 -->
    <div v-if="isRefining" class="refine-loading-overlay">
      <div class="refine-loading-box">
        <div class="spinner-border text-success mb-3" role="status"></div>
        <div class="loading-text">AI가 로드맵을 다시 구성하고 있어요...</div>
      </div>
    </div>


  </div>
</template>

<script setup>
import learningApi from "@/apis/learningApi";
import { ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const roadmapData = ref({
  weeks: []
});

const isSending = ref(false); // 로딩 상태
const isRefining = ref(false);



// store 값이 들어오면 갱신되도록 watch 추가
watch(
  () => store.getters["learning/getRoadmap"],
  (newVal) => {
    if (newVal) {
      roadmapData.value = newVal;
    }
  },
  { immediate: true }
);


console.log("로드맵 데이터:", roadmapData.value);

async function saveRoadmap() {
  try {
    const payload = {
      memberId: 1,
      title: roadmapData.value.title,
      weeks: roadmapData.value.weeks
    };

    const res = await learningApi.saveRoadmap(payload);
    console.log("로드맵 저장 성공:", res.data);

    showSaveModal.value = true;

  } catch (error) {
    console.error("로드맵 저장 실패:", error);
    alert("로드맵 저장 중 오류 발생");
  }
}


// 모달 부분 기존 코드 그대로 유지
const showAiModal = ref(false);
const aiInput = ref("");
const showSaveModal = ref(false);

function openAiModal() {
  showAiModal.value = true;
}
function closeAiModal() {
  showAiModal.value = false;
}

function openSaveModal() {
  showSaveModal.value = true;
}
function closeSaveModal() {
  showSaveModal.value = false;
}

function startLearning() {
  showSaveModal.value = false;
}
function goToMyLearning() {
  showSaveModal.value = false;
}

const showWeekModal = ref(false);
const selectedWeek = ref(null);

function openWeekModal(week) {
  selectedWeek.value = week;
  showWeekModal.value = true;
}

function closeWeekModal() {
  showWeekModal.value = false;
}

async function sendRefineRequest() {
  if (!aiInput.value) return;

  try {
    isRefining.value = true; // ⬅️ 오버레이 띄우기

    const payload = {
      memberId: 1,
      currentRoadmap: roadmapData.value,
      userFeedback: aiInput.value
    };

    const res = await learningApi.refineRoadmap(payload);

    roadmapData.value = res.data;
    showAiModal.value = false;

  } catch (err) {
    console.error("로드맵 수정 실패:", err);
    alert("AI 수정 중 오류 발생");
  } finally {
    isRefining.value = false; // ⬅️ 오버레이 제거
  }
}




</script>


<style scoped>
.roadmap-container {
  max-width: 1100px;
}

.title {
  font-weight: 700;
  font-size: 28px;
}

.alert-mint {
  background-color: #F0FDF4;
  color: #166534;
  border: 1px solid #BBF7D0;
}

.alert-mint strong {
  color: #15803D;
}

.summary-tag {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14.4px;
  font-weight: 500;
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.week-card {
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 24px;
  background-color: #FFFFFF;
  height: 100%;
}

.week-card h4 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.topic-list {
  padding-left: 0px;
  margin-bottom: 16px;
}

.topic-list li {
  position: relative;
  padding-left: 19.2px;
  font-size: 15.2px;
  color: #333333;
  margin-bottom: 8px;
}

.topic-list li::before {
  content: '-';
  position: absolute;
  left: 0px;
  top: 0px;
  font-weight: 600;
  color: #10B981;
}

.week-note {
  font-size: 14px;
  background-color: #F8FCFB;
  border-color: #E0F3EB;
  color: #333333;
}

.btn-mint {
  height: 37px;
  font-weight: 500;
  border-radius: 6px;
  font-size: 13.5px;
  background-color: #F0FDF4;
  color: #166534;
  border: 1px solid #BBF7D0;
  font-weight: 500;
}

.btn-mint:hover {
  background-color: #E0F3EB;
  border-color: #BBF7D0;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  font-size: 13.5px;
  font-weight: 500;
  height: 37px;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background-color: #FFFFFF;
  border-radius: 6px;
  padding: 32px;
  width: 90%;
  max-width: 600px;
  text-align: left;
}

.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.ai-modal-content {
  background-color: #FFFFFF;
  border-radius: 6px;
  padding: 32px;
  width: 90%;
  max-width: 600px;
  animation: fadeIn 0.3s ease-in-out;
}

.list-group-item {
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  margin-bottom: 6.4px;
}

.ai-input {
  display: flex;
  align-items: center;
  width: 100%;
}

.ai-input input {
  flex: 1;
  height: 44px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 0px 12px;
}

.save-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.save-modal-content {
  background-color: #FFFFFF;
  border: 1px solid #EAEBEC;
  border-radius: 6px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  animation: fadeIn 0.3s ease-in-out;
  color: #111111;
  box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.08);
}

.check-icon {
  font-size: 48px;
  color: #71EBBE;
}

.alert-mint-light {
  background-color: #FFFFFF;
  color: #166534;
  border: 1px solid #BBF7D0;
  border-radius: 6px;
  padding: 16px;
}

.btn-dark {
  display: inline-flex;
  align-items: center;
  background-color: #000000;
  color: #FFFFFF;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
}

.btn-mint {
  display: inline-flex;
  align-items: center;
  background-color: #BBF7D0;
  color: #111111;
  font-weight: 500;
  height: 37px;
  font-size: 13.5px;
  border-radius: 6px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
}


.ai-tip {
  background-color: #F1F2F3;
  color: #111111;
  border-radius: 6px;
  padding: 12.8px;
  font-size: 14.4px;
  border: 1px solid #EAEBEC;
  line-height: 1.6;
}

.day-title {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.clickable-card:hover {
  transform: translateY(-3px);
  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.08);
}

/* 모달 배경 */
.week-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  backdrop-filter: blur(3px);
}

/* 모달 본문 */
.week-modal-content {
  background: #ffffff;
  width: 92%;
  max-width: 600px;
  max-height: 85vh;
  padding: 26px 28px;
  border-radius: 14px;
  animation: fadeIn 0.25s ease;
  overflow-y: auto;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);

}

/* header */
.modal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.week-summary-text {
  color: #6B7280;
  font-size: 14px;
  margin-top: 6px;
  margin-bottom: 16px;
}

.modal-divider {
  border: none;
  border-top: 1px solid #E5E7EB;
  margin: 10px 0 18px 0;
}

/* 일차 카드 리스트 wrappper */
.day-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 일차 카드 */
.day-card {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 14px 16px;
  transition: all 0.15s ease;
}

.day-card:hover {
  background: #F3F4F6;
}

/* 일차 제목 */
.day-card-title {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 6px;
  color: #111827;
}

/* 일차 내용 */
.day-card-content {
  font-size: 14px;
  color: #4B5563;
  white-space: pre-line;
  /* 줄바꿈 적용 핵심 */
  line-height: 1.55;
}

.refine-loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.refine-loading-box {
  background: #ffffff;
  padding: 30px 40px;
  border-radius: 14px;
  border: 1px solid #D1D5DB;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.refine-loading-box .spinner-border {
  width: 3rem;
  height: 3rem;
}

.loading-text {
  font-size: 16px;
  font-weight: 600;
  color: #166534; /* Mint 계열 */
  margin-top: 10px;
}




@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>