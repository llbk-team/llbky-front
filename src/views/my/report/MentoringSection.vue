<template>
  <aside class="mentoring-card-wrapper">
    <h3 class="mentoring-title">AI 멘토링</h3>
    <p class="mentoring-desc">
      AI가 지난 주 활동 데이터를 분석해 이번 주 성장 방향을 제안합니다
    </p>

    <div
      v-for="(item, index) in mentoringData"
      :key="index"
      class="mentoring-item"
    >
      <!-- ✅ 전체 높이 라인 -->
      <div class="stripe"></div>

      <div class="mentoring-main">
        <div class="mentoring-header">
          <h4>{{ item.title }}</h4>
          <div v-if="item.label" class="mentoring-badge">{{ item.label }}</div>
        </div>
        <p>{{ item.content }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

const mentoringData = ref([
  {
    title: "이번 주 추천 활동",
    content: "발표력·표현력 향상을 위한 실전 중심 활동이 추천됩니다",
    label: "면접",
  },
  {
    title: "다음 학습 방향",
    content: "Spring Security 학습을 시작해보세요",
    label: "학습",
  },
  {
    title: "활동 분석",
    content: "이번 주 활동 빈도가 40% 증가했습니다.",
    label: "",
  },
  {
    title: "문제점 분석",
    content: "이력서 업데이트가 3주 이상 지연되고 있습니다.",
    label: "",
  },
]);
</script>

<style scoped>
.mentoring-card-wrapper {
  grid-area: mentoring;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  padding: 20px 22px;
}

/* 제목 / 설명 */
.mentoring-title {
  text-align: left;
  font-size: 18px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #111;
}

.mentoring-desc {
  font-size: 12px;
  color: #666;
}

/* ✅ 각 항목 */
.mentoring-item {
  margin-top: 14px;
  background-color: #edfcf7;
  border-radius: 5px;
  padding: 10px 14px;
  display: grid;
  grid-template-columns: 4px 1fr auto;
  column-gap: 10px;
  align-items: stretch; /* 라인 높이 늘리기 */
}

/* ✅ 세로 라인 - 항목 전체 높이 */
.stripe {
  width: 4px;
  background-color: #71ebbe;
  border-radius: 2px;
  height: 100%; /* 중요: 전체 높이 차지 */
}

/* ✅ 메인 텍스트 영역 */
.mentoring-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 제목 + 라벨 한 줄 */
.mentoring-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 제목 */
.mentoring-header h4 {
  font-size: 15px;
  font-weight: 800;
  margin: 0;
}

/* 본문 */
.mentoring-main p {
  font-size: 13px;
  margin: 2px 0 0 0;
  color: #111;
  line-height: 1.4;
}

/* ✅ 라벨 */
.mentoring-badge {
  background-color: #71ebbe;
  color: #111111;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  padding: 3px 10px;
  height: fit-content;
  align-self: center;
  line-height: 1.2;
}
</style>
