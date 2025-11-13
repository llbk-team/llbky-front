<template>
  <section class="compare-wrapper">
    <h3>AI 멘토링 비교 분석</h3>

    <div class="ai-card" v-for="(value, key) in ai" :key="key">
      <h4>{{ value.title }}</h4>
      <p class="tag" v-if="value.tag">{{ value.tag }}</p>
      <p>{{ value.text }}</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  reports: Array
});

const ai = {
  growth: { title: "성장 방향", text: "최근 2개 리포트 비교 결과 평균 5% 향상" },
  action: { title: "추천 활동", tag: "면접", text: "표현력 중심 훈련 추천" },
  learning: { title: "다음 학습 방향", tag: "학습", text: "Spring Security 학습 필요" },
  activity: { title: "활동 분석", text: "지난 기간 대비 40% 증가" },
  problem: { title: "문제점", text: "이력서 업데이트 부재" }
};
</script>

<style scoped>
.compare-wrapper {
  text-align: left;
}

.ai-card {
  background: #fafafa;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.tag {
  font-size: 12px;
  font-weight: 600;
  color: #71ebbe;
}
</style>
