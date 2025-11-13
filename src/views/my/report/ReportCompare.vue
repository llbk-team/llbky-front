<template>
  <section class="compare-wrapper">
    <!-- ✔ 제목 / 부제 왼쪽 정렬 -->
    <header class="header-section">
      <h2 class="title">리포트 비교</h2>
      <p class="subtitle">{{ left.title }} - {{ right.title }}</p>
    </header>

    <!-- ✔ 점수 카드 (전체 width 100%, 내용 가운데 정렬) -->
    <section class="score-card">
      <div class="score-center">
        <div class="score-title">종합 점수</div>

        <div class="score-row-wrapper">
          <div class="score-row">
            <span class="score">{{ left.all_avg }}</span>
            <span class="arrow">→</span>
            <span class="score">{{ right.all_avg }}</span>

            <!-- 퍼센트는 가운데 정렬 계산에서 제외되도록 absolute로 배치 -->
            <span class="change" :class="isUp ? 'up' : 'down'"> {{ diffPercent }}% </span>
          </div>
        </div>

        <p class="score-desc">
          {{ scoreChangeMessage }}
        </p>
      </div>
    </section>

    <!-- ✔ 그래프 섹션 (이미지처럼 가운데 full width) -->
    <section class="chart-section">
      <Bar :data="chartData" :options="chartOptions" />
    </section>

    <!-- ✔ AI 비교 요약 (왼쪽 정렬) -->
    <section class="ai-box">
      <h3 class="ai-title">✨ AI 비교 요약</h3>
      <p class="ai-text">
        {{ aiCompareText }}
      </p>
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// 차트 라이브러리 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* -----------------------------
   1) props
----------------------------- */
const props = defineProps({
  leftReport: { type: Object, required: false },
  rightReport: { type: Object, required: false },
  aiCompareSummary: { type: String, default: "" },
});

/* -----------------------------
   2) 더미 데이터
----------------------------- */
const fallbackLeft = ref({
  title: "11월 중간 성장 리포트",
  all_avg: 83,
  resume_avg: 84,
  interview_avg: 80,
  learning_avg: 92,
  trend_avg: 78,
});

const fallbackRight = ref({
  title: "10월 중간 성장 리포트",
  all_avg: 79,
  resume_avg: 80,
  interview_avg: 76,
  learning_avg: 88,
  trend_avg: 73,
});

const left = computed(() => props.leftReport || fallbackLeft.value);
const right = computed(() => props.rightReport || fallbackRight.value);

/* -----------------------------
   3) 점수 비교
----------------------------- */
const diff = computed(() => right.value.all_avg - left.value.all_avg);

const diffPercent = computed(() => {
  const base = left.value.all_avg;
  if (!base) return 0;
  return ((diff.value / base) * 100).toFixed(1);
});

const isUp = computed(() => diff.value >= 0);

/* -----------------------------
   4) 점수 변화 문장 자동 생성
----------------------------- */
const scoreChangeMessage = computed(() => {
  const categories = [];
  if (left.value.resume_avg !== right.value.resume_avg) categories.push("이력서");
  if (left.value.interview_avg !== right.value.interview_avg) categories.push("면접");
  if (left.value.learning_avg !== right.value.learning_avg) categories.push("학습");
  if (left.value.trend_avg !== right.value.trend_avg) categories.push("트렌드");

  const changeText = categories.length ? categories.join("·") : "여러 영역";

  if (diff.value > 0) {
    return `이전 리포트 대비 종합 점수가 ${diffPercent.value}% 향상되었습니다.
${changeText} 영역의 개선이 전체 점수 상승에 기여한 것으로 분석됩니다.`;
  } else if (diff.value < 0) {
    return `이전 리포트 대비 종합 점수가 ${Math.abs(diffPercent.value)}% 감소하였습니다.
${changeText} 영역의 점수 하락이 종합 점수 변화에 영향을 준 것으로 보입니다.`;
  }
  return `두 리포트의 종합 점수는 동일한 수준입니다.
각 영역의 변화폭이 크지 않아 전체 점수가 유지된 것으로 판단됩니다.`;
});

/* -----------------------------
   5) 차트 데이터 (이미지와 동일)
----------------------------- */
const chartData = computed(() => ({
  labels: ["이력서", "면접", "학습", "트렌드"],
  datasets: [
    {
      label: left.value.title,
      data: [left.value.resume_avg, left.value.interview_avg, left.value.learning_avg, left.value.trend_avg],
      backgroundColor: "rgba(234, 235, 236, 0.9)", // 연회색
      borderWidth: 0,
    },
    {
      label: right.value.title,
      data: [right.value.resume_avg, right.value.interview_avg, right.value.learning_avg, right.value.trend_avg],
      backgroundColor: "rgba(162, 241, 214, 0.9)", // 연민트
      borderWidth: 0,
    },
  ],
}));

/* -----------------------------
   6) 차트 옵션 (이미지와 완전 동일)
----------------------------- */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "rectRounded",
        color: "#888",
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label(context) {
          return `${context.dataset.label}: ${context.raw}점`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#666",
        font: { size: 13 },
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: "#eee",
        lineWidth: 1,
      },
      ticks: {
        stepSize: 20,
        color: "#aaa",
        font: { size: 12 },
      },
    },
  },
};

/* -----------------------------
   7) AI 요약
----------------------------- */
const aiCompareText = computed(() => {
  return props.aiCompareSummary || "면접·학습 영역의 점수 변화가 두 리포트 간의 핵심 차이를 형성하고 있습니다. " + "이전 기간 대비 학습 효율은 상승한 반면, 일부 항목은 개선이 필요합니다.";
});
</script>

<style scoped>
/* 전체 페이지 */
.compare-wrapper {
  max-width: 1000px;
}

/* -----------------
   1) 제목/부제 (왼쪽정렬)
----------------- */
.header-section {
  text-align: left;
  margin-bottom: 8px;
  /* 제목과 카드 사이 간격 축소 */
}

.header-section .title {
  font-size: 22px;
  font-weight: 700;
}

/* ✔ 부제 간격 문제 해결: 여기서만 margin 관리 */
.header-section p.subtitle {
  font-size: 14px;
  color: #777;
  margin: 4px 0 10px 0 !important;
}

/* -----------------
   2) 점수 카드
----------------- */
.score-card {
  width: 100%;
  background: #f6f6f6;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 종합 점수 내부 중앙 정렬 */
.score-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

.score-title {
  font-size: 16px;
  font-weight: 600;
}

/* 83 → 79 중앙 배치 */
.score-row-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.score-row {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  text-align: center;
}

.score {
  font-size: 32px;
  font-weight: 700;
}

.arrow {
  font-size: 20px;
  color: #555;
}

/* 변화율은 오른쪽 붙이기 */
.change {
  position: absolute;
  top: 50%;
  transform: translateY(-10%);
  right: -50px;
  font-size: 12px;
  font-weight: 500;
}

.change.up {
  color: #00a870;
}

.change.down {
  color: #ff4d4f;
}

/* 설명 텍스트 */
.score-desc {
  margin-top: 12px;
  font-size: 13px;
  color: #888;
  text-align: center;
  white-space: pre-line;
}

/* -----------------
   3) 차트 영역
----------------- */
.chart-section {
  width: 100%;
  height: 330px;
  background: #fff;
  border-radius: 10px;
  padding: 30px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 15px;
}

/* -----------------
   4) AI 비교 요약 (왼쪽정렬)
----------------- */
.ai-box {
  width: 100%;
  max-width: 880px;
  height: 105px !important;
  overflow: hidden;
  background: #dff8ef;
  border: 1px solid #a2f1d6;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
}

.ai-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
}

.ai-text {
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}
</style>
