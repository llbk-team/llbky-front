<template>
  <div class="mypage-wrapper">
    <div class="mypage-grid">
      <!-- 왼쪽: 프로필 -->
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
/* 전체 배경 */
.mypage-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #f1f2f3;
}

/* ===========================
   기본 GRID 레이아웃
   =========================== */
.mypage-grid {
  display: grid;
  grid-template-areas:
    "profile radar mentoring"
    "profile heatmap heatmap"
    "profile loglist loglist";
  grid-template-columns: 400px 1fr 600px;
  gap: 20px;
  padding: 20px;
  width: 100%;
  max-width: 1600px;
  box-sizing: border-box;
  margin-bottom: 50px;
}

/* 영역 매핑 */
.profile-section {
  grid-area: profile;
  align-self: start;
}

.radar-section {
  grid-area: radar;
}

.mentoring-section {
  grid-area: mentoring;
}

.heatmap-section {
  grid-area: heatmap;
  grid-column: 2 / 4;
}

.loglist-section {
  grid-area: loglist;
  grid-column: 2 / 4;
}


/* ===========================
   반응형 설정
   =========================== */

/* 1400px 이하 → 오른쪽 mentoring이 아래로 내려감 */
@media (max-width: 1400px) {
  .mypage-grid {
    grid-template-areas:
      "profile radar"
      "profile mentoring"
      "heatmap heatmap"
      "loglist loglist";
    grid-template-columns: 350px 1fr;
  }
}

/* 1200px 이하 → Profile이 위로 오고 2단 구성 */
@media (max-width: 1200px) {
  .mypage-grid {
    grid-template-areas:
      "profile profile"
      "radar mentoring"
      "heatmap heatmap"
      "loglist loglist";
    grid-template-columns: 1fr 1fr;
  }
}

/* 992px 이하 → 1열 구조 */
@media (max-width: 992px) {
  .mypage-grid {
    grid-template-areas:
      "profile"
      "radar"
      "mentoring"
      "heatmap"
      "loglist";
    grid-template-columns: 1fr;
  }

  .heatmap-section,
  .loglist-section {
    grid-column: 1 / 2 !important;
  }
}

/* 600px 이하 → 모바일 최적화 */
@media (max-width: 600px) {
  .mypage-grid {
    gap: 15px;
    padding: 15px;
  }
}
</style>
