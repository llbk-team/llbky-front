<template>
  <div class="roadmap-container container py-5">

    <div class="title mb-3 text-center">나의 맞춤 학습 로드맵</div>
    <div class="alert alert-mint shadow-sm" role="alert">AI 학습 코치가 선택하신 기술을 바탕으로 <strong>'{{ purposeLabels.join(" + ") }}'</strong> 플랜을 생성했어요!
    </div>

    <div class="d-flex flex-wrap justify-content-center gap-3 my-4">
      <span class="summary-tag">🏁 {{ roadmapData.title }}</span>
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


    <!-- 주차 상세 모달 -->
    <div v-if="showWeekModal && selectedWeek" class="week-modal-overlay" @click.self="closeWeekModal">
      <div class="week-modal-content shadow-lg">

        <!-- Header -->
        <div class="modal-header-row">
          <h4 class="fw-bold">{{ selectedWeek?.title }}</h4>
          <button class="btn-close" @click="closeWeekModal"></button>
        </div>

        <!-- Week Summary -->
        <p class="week-summary-text">{{ selectedWeek?.learningWeekSummary }}</p>

        <!-- Divider -->
        <hr class="modal-divider" />

        <!-- Day detail list -->
        <div class="day-list-wrapper">
          <div v-for="day in selectedWeek?.days || []" :key="day.dayNumber" class="day-card">
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

        <p class="text-center text-muted mb-3">수정하고 싶은 내용이 있으신가요?<br />
          <small>AI에게 수정하고 싶은 부분을 요청하면 
            다시 만들어드려요!</small>
        </p>

        <div class="ai-input">
          <input v-model="aiInput" type="text" class="form-control" placeholder="데이터베이스의 개념을 더 깊이 학습하고 싶어요" />
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
          🎯 <strong>'{{ roadmapData.title }} - {{ purposeLabels.join(" + ") }}'</strong><br />
          학습 로드맵이 내 학습함에 추가되었습니다.
        </div>

        <p class="fw-semibold mb-3">👉 다음 단계로 이동할까요?</p>

        <div class="d-flex justify-content-center gap-3 mb-4">
          <router-link :to="`/learning/start?learningId=${roadmapData.learningId}`" class="btn btn-dark" @click="startLearning">▶ 학습 시작하기</router-link>
          <router-link :to="`/learning/coach`" class="btn btn-mint" @click="goToMyLearning">📁 내 학습함</router-link>
        </div>
        <div class="ai-tip">💬 <strong>AI 팁:</strong> 이제 주차별 학습을 진행하면,<br />진행률과 피드백을 자동으로 기록해드릴게요!</div>
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
import learningRoadmap from "@/utils/learningRoadmap";

const {
  roadmapData,
  isRefining,
  aiInput,

  showAiModal,
  showSaveModal,
  showWeekModal,
  selectedWeek,

  openWeekModal,
  closeWeekModal,
  saveRoadmap,

  openAiModal,
  closeAiModal,
  startLearning,
  goToMyLearning,

  sendRefineRequest,

  purposes,
  purposeLabels
} = learningRoadmap();
</script>


<style scoped src="@/assets/css/learningRoadmap.css"></style>