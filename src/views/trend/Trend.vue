<template>
  <div class="trend-page">
    <h2 class="page-title">채용 시장 트렌드 분석</h2>
    <p class="page-subtitle">AI가 분석한 산업별 키워드 트렌드와 시장 흐름</p>

    <!-- 상단 요약 카드 -->
    <div class="summary-cards">
      <div v-for="(card, i) in summaryCards" :key="i" class="summary-card">
        <p class="label">{{ card.label }}</p>
        <h3 class="value">{{ card.value }}</h3>
        <span v-if="card.change" class="change" :class="{ up: card.change > 0, down: card.change < 0 }">
          {{ card.change > 0 ? "+" : "" }}{{ card.change }}%
        </span>
      </div>
    </div>

    <!-- 채용 시장 키워드 트렌드 -->
    <div class="chart-container pretty-trend">
      <h4 class="chart-title">채용 시장 키워드 트렌드</h4>
      <p class="chart-subtitle">최근 1개월간 주요 기술 및 직무 키워드 변화율</p>

      <div class="chart-wrapper">
        <canvas id="trendChart"></canvas>
      </div>

      <div class="trend-stats">
        <div v-for="(item, i) in keywordData" :key="i" class="trend-item">
          <p class="keyword">{{ item.keyword }}</p>
          <p class="change" :class="{ up: item.change > 0, down: item.change < 0 }">
            {{ item.change > 0 ? "▲" : "▼" }} {{ Math.abs(item.change) }}%
          </p>
        </div>
      </div>
    </div>

    <!-- 핵심 기술 키워드 + 산업별 채용 시장 분위기 -->
    <div class="insight-row">
      <div class="card wordcloud-box">
        <div class="card-header">
          <h4>핵심 기술 키워드</h4>
          <p>AI가 추출한 주요 스킬 및 산업별 키워드</p>
        </div>
        <div id="wordCloud" class="wordcloud"></div>
      </div>

      <div class="card sentiment-box">
        <div class="card-header">
          <h4>산업별 채용 시장 분위기</h4>
          <p>긍정·중립·부정 비율로 본 산업별 채용 감정 분석</p>
        </div>

        <div class="sentiment-chart-container">
          <canvas id="sentimentChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 시장 인사이트 요약 -->
    <div class="insight-summary">
      <h4>시장 인사이트 요약</h4>
      <ul>
        <li>
          <b>AI/머신러닝</b> 관련 채용은 지난달 대비 <b>45%</b> 증가했으며,
          <span>LLM, RAG, MLOps</span> 관련 기술의 수요가 꾸준히 상승 중입니다.
        </li>
        <li>
          <b>클라우드 및 DevOps</b> 직군은 <b>32%</b> 상승, 스타트업 중심으로 채용 활발.
        </li>
        <li>
          <b>보안/블록체인</b> 분야는 <b>15% 감소</b>하며 시장 조정기에 진입했습니다.
        </li>
      </ul>

      <div class="insight-link">
        <router-link to="/trend/insight" class="btn-link">
          👉 내 맞춤 <b>직무 인사이트 보기</b>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";
import WordCloud from "wordcloud";

const summaryCards = [
  { label: "주목 키워드", value: "AI / 머신러닝" },
  { label: "평균 관심도", value: "78.5", change: 4.1 },
  { label: "분석 키워드 수", value: "10개" },
  { label: "시장 활기", value: "65%" },
];

const keywordData = [
  { keyword: "AI/머신러닝", score: 98, change: 45 },
  { keyword: "클라우드", score: 94, change: 32 },
  { keyword: "React", score: 91, change: 15 },
  { keyword: "TypeScript", score: 87, change: 28 },
  { keyword: "Python", score: 76, change: 12 },
  { keyword: "보안", score: 54, change: -12 },
  { keyword: "블록체인", score: 42, change: -25 },
];

onMounted(async () => {
  // 키워드 트렌드 차트
  const ctx1 = document.getElementById("trendChart");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: keywordData.map((d) => d.keyword),
      datasets: [
        {
          data: keywordData.map((d) => d.score),
          backgroundColor: keywordData.map((d) =>
            d.change > 0 ? "#71EBBE" : "#FF9F9F"
          ),
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: "#eee" } },
        x: { grid: { display: false }, ticks: { color: "#333" } },
      },
      plugins: { legend: { display: false } },
    },
  });

  // 산업별 채용 감정 분석 차트
  await nextTick();
  const ctx2 = document.getElementById("sentimentChart");
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: [
        "IT/소프트웨어",
        "금융/보험",
        "제조/화학",
        "게임/엔터테인먼트",
        "서비스/유통",
        "바이오/헬스케어",
      ],
      datasets: [
        {
          label: "긍정",
          data: [49, 44, 47, 39, 50, 43],
          backgroundColor: "#71EBBE",
          borderRadius: 6,
        },
        {
          label: "중립",
          data: [37, 38, 36, 42, 35, 40],
          backgroundColor: "#A0A0A0",
          borderRadius: 6,
        },
        {
          label: "부정",
          data: [14, 18, 17, 19, 15, 17],
          backgroundColor: "#FF9F9F",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        x: { stacked: true, max: 100, grid: { color: "#f0f0f0" } },
        y: { stacked: true, grid: { display: false } },
      },
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, color: "#444" } },
      },
    },
  });

  // 워드클라우드 (가중치 기반 색상 단계 적용)
  const words = [
    ["Kubernetes", 40],
    ["AI", 30],
    ["Python", 25],
    ["TensorFlow", 22],
    ["데이터", 18],
    ["React", 15],
    ["Kafka", 14],
    ["Spring", 14],
    ["TypeScript", 12],
    ["Next.js", 10],
    ["Node.js", 10],
    ["클라우드", 8],
  ];

  WordCloud(document.getElementById("wordCloud"), {
    list: words,
    gridSize: 12,
    weightFactor: 4,
    color: (word, weight) => {
      if (weight > 30) return "#00C896";  // 진한 민트
      if (weight > 25) return "#3CC3D3";  // 청록 (시원한 대비)
      if (weight > 20) return "#5B8DEF";  // 하늘/블루 계열
      if (weight > 15) return "#B47EFF";  // 보라 계열
      if (weight > 10) return "#FFA07A";  // 코랄/살구톤
      return "#CFFFE2";                   // 파스텔 톤 (보조)
    },
    rotateRatio: 0,
    backgroundColor: "#ffffff",
  });
});
</script>

<style scoped>
.trend-page {
  background: #ffffff;
  padding: 40px 80px 100px;
  font-family: "NexonLv1Gothic", sans-serif;
  color: #111;
}

/* Header */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 6px;
}
.page-subtitle {
  color: #6c757d;
  font-size: 16px;
}

/* Summary Cards */
.summary-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 36px;
}
.summary-card {
  flex: 1;
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 24px;
  text-align: center;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}
.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border-color: #d0d0d0;
}
.summary-card .label {
  font-size: 13px;
  color: #666;
}
.summary-card .value {
  font-size: 20px;
  font-weight: 700;
  color: #00c896;
}
.summary-card .change {
  font-size: 13px;
  font-weight: 600;
}
.change.up {
  color: #00c896;
}
.change.down {
  color: #e85b5b;
}

/* Keyword Trend Section */
.pretty-trend {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 28px 30px;
  margin-bottom: 36px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
.chart-title {
  font-size: 16px;
  font-weight: 700;
}
.chart-subtitle {
  font-size: 13px;
  color: #777;
  margin-bottom: 16px;
}
.chart-wrapper {
  height: 280px;
  margin-bottom: 20px;
}
.trend-stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  border-top: 1px solid #eee;
  padding-top: 10px;
}
.trend-item {
  text-align: center;
  width: 100px;
  padding: 6px 0;
}
.trend-item .keyword {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.trend-item .change {
  font-size: 12px;
  font-weight: 500;
}
.trend-item .change.up {
  color: #00b37e;
}
.trend-item .change.down {
  color: #ff5f5f;
}

/* Insight Row */
.insight-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
  margin-bottom: 40px;
}
.card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 22px 26px;
}

.card-header {
  background: transparent !important;
}

.card-header h4 {
  font-size: 16px;
  font-weight: 700;
}
.card-header p {
  font-size: 13px;
  color: #777;
  margin-bottom: 14px;
}
.wordcloud {
  width: 100%;
  height: 260px;
  margin-top: 6px;
}
.sentiment-chart-container {
  position: relative;
  width: 100%;
  min-height: 340px;
  height: 340px;
}
.sentiment-chart-container canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}

/* Insight Summary */
.insight-summary {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  padding: 26px 30px;
  line-height: 1.8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
.insight-summary h4 {
  font-size: 17px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
  border-left: 4px solid #71ebbe;
  padding-left: 10px;
}
.insight-summary ul {
  padding-left: 18px;
  margin-bottom: 16px;
}
.insight-summary li {
  font-size: 14px;
  color: #333;
}
.insight-summary b {
  color: #00c896;
  font-weight: 600;
}
.insight-summary span {
  color: #555;
}
.insight-link {
  text-align: right;
}
.btn-link {
  font-size: 14px;
  font-weight: 600;
  color: #00c896;
  text-decoration: none;
}
.btn-link:hover {
  text-decoration: underline;
}
</style>
