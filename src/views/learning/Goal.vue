<template>
  <div class="container py-4 main-wrapper">

    <!-- 페이지 제목 -->
    <div>
      <div class="title">AI 학습 설정</div>
      <div class="subtitle">목표 직무와 학습 목적을 선택하고 시작해보세요</div>
    </div>

    <div class="row g-4">

      <!-- LEFT -->
      <div class="col-md-4 left-col">

        <!-- 내 희망 직무 -->
        <div class="card shadow-sm p-4 card-clean mb-3">
          <h5 class="fw-bold mb-3">내 희망 직무</h5>
          <div class="job-tag-wrapper mb-3">
            <span class="job-tag">{{ myJobRole }}</span>
          </div>
          <p class="text-muted small mb-0">직무는 마이페이지에서 변경 가능합니다.</p>
        </div>

        <!-- 하루 공부 시간 -->
        <div class="card shadow-sm p-3 card-clean study-box mb-3">
          <h6 class="fw-bold mb-2 text-center">하루 공부 가능 시간</h6>
          <div class="study-time-selector">
            <button class="btn-circle" @click="decreaseHour">-</button>
            <span class="study-hour-text">{{ formData.studyHours }} 시간</span>
            <button class="btn-circle" @click="increaseHour">+</button>
          </div>
        </div>

      </div>

      <!-- RIGHT -->
      <div class="col-md-8">
        <div class="card shadow-sm p-4 card-clean h-100">
          <h5 class="fw-bold mb-3">학습 목적 (복수 선택)</h5>

          <div class="row">
            <div class="col-md-4"
                 v-for="(section, idx) in goalSections"
                 :key="idx">
              <h6 class="fw-semibold mb-2">{{ section.title }}</h6>

              <div class="checkbox-item"
                   v-for="goal in section.items"
                   :key="goal.id">
                <input type="checkbox"
                       :id="goal.id"
                       :value="goal.value"
                       v-model="formData[section.model]" />
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

    <!-- 부족 역량 / 관심 기술 -->
    <div class="row g-4 mt-0">

      <!-- 부족 역량 -->
      <div class="col-md-6">
        <div class="card shadow-sm p-4 card-clean h-100">
          <h5 class="fw-bold mb-2">부족 역량 선택</h5>

          <div class="info-box green-info-light mb-3">
            AI가 문서를 기반으로 추천한 기술입니다.
          </div>

          <div class="skill-scroll-box">
            <div v-if="recommendedSkills.length === 0" class="text-muted small">
              AI 추천 로딩 중...
            </div>

            <div v-for="skill in recommendedSkills"
                 :key="skill"
                 class="checkbox-item mb-2">
              <input type="checkbox"
                     :value="skill"
                     v-model="formData.lackingSkills" />
              <label>{{ skill }}</label>
            </div>
          </div>

        </div>
      </div>

      <!-- 관심 기술 -->
      <div class="col-md-6">
        <div class="card shadow-sm p-4 card-clean h-100">

          <h5 class="fw-bold mb-2">관심 기술</h5>
          <div class="info-box green-info-light mb-3">
            트렌드 기반 기술입니다.
          </div>

          <div class="skill-scroll-box mb-3">

            <div v-for="tech in keywordList"
                 :key="tech"
                 class="checkbox-item mb-2">
              <input type="checkbox"
                     :value="tech"
                     v-model="formData.interestedSkills" />
              <label>{{ tech }}</label>
            </div>

          </div>

          <div class="add-skill-box">
            <input class="skill-input"
                   type="text"
                   v-model="newInterestSkill"
                   placeholder="기술 키워드 입력..."
                   @keydown.enter.prevent="addInterestSkill" />
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

    <!-- 로딩 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">AI가 로드맵을 생성 중입니다...</p>
    </div>

  </div>
</template>

<script setup>
import useLearningGoal from "@/utils/learningGoal";

const {
  isLoading,
  keywordList,
  newInterestSkill,
  recommendedSkills,
  formData,
  goalSections,
  myJobRole,

  addInterestSkill,
  increaseHour,
  decreaseHour,
  generateRoadmap
} = useLearningGoal();
</script>

<style scoped src="@/assets/css/learningGoal.css"></style>
