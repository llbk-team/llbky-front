<template>
  <section class="filter-bar">
    <div class="filter-item">
      <label>기간</label>
      <select v-model="period">
        <option value="">전체</option> <!-- ✅ 기본값 -->
        <option value="day">오늘</option>
        <option value="week">최근 1주</option>
        <option value="month">최근 1개월</option>
      </select>
    </div>

    <div class="filter-item">
      <label>감정</label>
      <select v-model="sentiment">
        <option value="">전체</option>
        <option value="positive">긍정</option>
        <option value="neutral">중립</option>
        <option value="negative">부정</option>
      </select>
    </div>

    <div class="filter-item">
      <label>편향</label>
      <input type="checkbox" v-model="biasOnly" />
      <span class="check-label">편향 없는 뉴스만</span>
    </div>

    <div class="filter-item trust-item">
      <label>신뢰도</label>
      <input type="range" v-model="trustMin" min="0" max="100" />
      <span class="trust-value">{{ trustMin }}% 이상</span>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";
const emit = defineEmits(["filter-change"]);

const period = ref(""); // ✅ 전체(default)
const sentiment = ref("");
const biasOnly = ref(false);
const trustMin = ref(70);

watch([period, sentiment, biasOnly, trustMin], () => {
  emit("filter-change", {
    period: period.value,
    sentiment: sentiment.value,
    biasOnly: biasOnly.value,
    trustMin: Number(trustMin.value),
  });
});
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px 32px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 14px 26px;
  margin: 30px 80px 20px;
}

/* 공통 항목 */
.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #333;
}
.filter-item label {
  font-weight: 700;
  color: #222;
}

/* select */
.filter-item select {
  height: 36px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fdfdfd;
  font-size: 13px;
  transition: all 0.2s;
  cursor: pointer;
}
.filter-item select:hover {
  border-color: #71ebbe;
}
.filter-item select:focus {
  border-color: #71ebbe;
  box-shadow: 0 0 4px rgba(113, 235, 190, 0.4);
  outline: none;
}

/* 체크박스 */
.filter-item input[type="checkbox"] {
  accent-color: #71ebbe;
  cursor: pointer;
  transform: scale(1.05);
}
.check-label {
  font-size: 12px;
  color: #555;
}

/* 슬라이더 */
.trust-item input[type="range"] {
  width: 120px;
  accent-color: #71ebbe;
  cursor: pointer;
}
.trust-value {
  font-size: 12px;
  font-weight: 600;
  color: #444;
}

/* 반응형 */
@media (max-width: 900px) {
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
    margin: 20px;
  }
}
</style>
