<template>
  <div class="mypage-wrapper">
    <div class="mypage-grid">
      <ProfileSection />
      <RadarSection />
      <MentoringSection />
      <HeatmapSection />
    </div>
  </div>
</template>


<script setup>
import ProfileSection from "./ProfileSection.vue";
import RadarSection from "./RadarSection.vue";
import MentoringSection from "./MentoringSection.vue";
import HeatmapSection from "./HeatmapSection.vue";
</script>

<style scoped>
.mypage-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #f1f2f3;
}

.mypage-grid {
  display: grid;
  grid-template-areas:
    "profile radar mentoring"
    "profile heatmap heatmap";
  grid-template-columns: 400px 0.8fr 460px;
  gap: 24px;
  padding: 40px;
  width: 100%;
  max-width: 1600px; /* ✅ 반응형 + 가운데 유지 */
  box-sizing: border-box;
}
</style>
