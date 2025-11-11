<template>
  <div class="mypage-wrapper">
    <div class="mypage-grid">
      <!-- 왼쪽: 프로필 (자기 길이만큼) -->
      <ProfileSection class="profile-section" />

      <!-- 중앙: 레이더 -->
      <RadarSection class="radar-section" />

      <!-- 오른쪽: 멘토링 -->
      <MentoringSection class="mentoring-section" />

      <!-- 하단: 히트맵 -->
      <HeatmapSection class="heatmap-section" />

      <!-- 하단: 최근 활동 내역 -->
      <LogList class="loglist-section" />
    </div>
  </div>
</template>

<script setup>
import ProfileSection from "./report/ProfileSection.vue";
import RadarSection from "./report/RadarSection.vue";
import MentoringSection from "./report/MentoringSection.vue";
import HeatmapSection from "./report/HeatmapSection.vue";
import LogList from "./report/LogList.vue";
</script>

<style scoped>
.mypage-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #f1f2f3;
}

/* ✅ 핵심 레이아웃 설정 */
.mypage-grid {
  display: grid;
  grid-template-areas:
    "profile radar mentoring"
    "profile heatmap heatmap"
    "profile loglist loglist";
  grid-template-columns: 400px 1fr 600px;
  /* 중앙-오른쪽 두 칸은 동일 높이, 왼쪽은 자동 높이 */
  grid-auto-rows: auto;
  align-items: start;
  gap: 20px;
  align-items: stretch;
  padding: 20px;
  width: 100%;
  max-width: 1700px;
  box-sizing: border-box;
  margin-bottom: 50px;
}

/* ✅ grid 배치 영역 지정 (기존 디자인 유지) */
.profile-section {
  grid-area: profile;
  align-self: start; /* 프로필은 자기 내용 높이만큼만 */
}

.radar-section {
  grid-area: radar;
}

.mentoring-section {
  grid-area: mentoring;
}

.heatmap-section {
  grid-area: heatmap;
  grid-column: 2 / 4; /* 중앙~오른쪽 폭 전체 사용 */
}

.loglist-section {
  grid-area: loglist;
  grid-column: 2 / 4; /* 중앙~오른쪽 폭 전체 사용 */
}
</style>
