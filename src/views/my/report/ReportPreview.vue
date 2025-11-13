<template>
  <!-- 데이터 준비 안되었을 때 -->
  <div v-if="!report || !report.chartData" class="loading">
    <p>리포트 데이터를 불러오는 중...</p>
  </div>

  <!-- 정상 렌더링 -->
  <section v-else class="preview-wrapper">
    <h2>{{ report.title }}</h2>
    <p class="date">{{ formatDate(report.date) }}</p>
    <p class="memo">{{ report.memo }}</p>

    <!-- 이력서 -->
    <div class="preview-card">
      <h3>📄 이력서 분석</h3>
      <div class="chart-wrap">
        <Bar :data="safeResume" :options="opt" />
      </div>
    </div>

    <!-- 면접 -->
    <div class="preview-card">
      <h3>💬 면접 분석</h3>
      <div class="chart-wrap">
        <Radar :data="safeInterview" :options="opt" />
      </div>
    </div>

    <!-- 학습 -->
    <div class="preview-card">
      <h3>📚 학습 분석</h3>
      <div class="chart-wrap">
        <Doughnut :data="safeLearning" :options="opt" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { Bar, Radar, Doughnut } from "vue-chartjs";

// Chart.js register 생략 (이미 적용한 것 그대로 유지)

const props = defineProps({
  report: Object
});

// 안전한 데이터 변환
const safeResume = computed(() =>
  props.report?.chartData?.resumeChart ?? { labels: [], datasets: [] }
);

const safeInterview = computed(() =>
  props.report?.chartData?.interviewChart ?? { labels: [], datasets: [] }
);

const safeLearning = computed(() =>
  props.report?.chartData?.learningChart ?? { labels: [], datasets: [] }
);

const opt = { responsive: true, maintainAspectRatio: false };

function formatDate(date) {
  return new Date(date).toLocaleDateString("ko-KR");
}
</script>

<style scoped>
.loading {
  margin-top: 200px;
  text-align: center;
  font-size: 14px;
  color: #666;
}
.chart-wrap {
  height: 180px;
}
</style>
