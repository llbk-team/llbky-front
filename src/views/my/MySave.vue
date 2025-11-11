<template>
  <section class="report-save-page">
    <header class="page-header">
      <h2>저장된 리포트</h2>
      <p>저장된 리포트를 확인하고 성장 추이를 분석하세요</p>
    </header>

    <div class="report-container">
      <!-- ✅ 좌측: 리포트 목록 -->
      <aside class="report-list">
        <h3>리포트 목록</h3>
        <ul>
          <li
            v-for="(report, i) in reports"
            :key="i"
            :class="{ active: selectedReport?.id === report.id }"
            @click="selectReport(report)"
          >
            <div class="report-item">
              <div class="item-info">
                <h4>{{ report.title }}</h4>
                <p>{{ formatDate(report.created_at) }}</p>
              </div>
              <span
                class="growth"
                :class="report.growth > 0 ? 'plus' : 'minus'"
              >
                {{ report.growth > 0 ? "+" : "" }}{{ report.growth }}%
              </span>
            </div>
          </li>
        </ul>

        <div class="report-summary">
          <h4>전체 통계</h4>
          <ul>
            <li>저장된 리포트 <strong>{{ reports.length }}개</strong></li>
            <li>
              평균 성장률
              <strong :class="avgGrowth > 0 ? 'plus' : 'minus'">
                {{ avgGrowth > 0 ? "+" : "" }}{{ avgGrowth }}%
              </strong>
            </li>
            <li>최고 점수 <strong>{{ maxScore }}</strong></li>
          </ul>
        </div>
      </aside>

<main class="report-detail" v-if="selectedReport">
  <h3>{{ selectedReport.title }}</h3>
  <p class="date">{{ formatDate(selectedReport.created_at) }}</p>

  <!-- 종합 점수 -->
  <div class="score-box">
    <h4>종합 점수</h4>
    <p class="score">
      {{ selectedReport.score }}
      <span class="growth" :class="selectedReport.growth > 0 ? 'plus' : 'minus'">
        {{ selectedReport.growth > 0 ? '+' : '' }}{{ selectedReport.growth }}%
      </span>
    </p>
    <p class="compare-text">
      {{ previousReport
        ? `${previousReport.title} 대비 변화`
        : '이전 리포트 없음' }}
    </p>
  </div>

  <!-- ✅ 비교 차트 -->
  <div class="chart-section">
    <canvas id="reportChart"></canvas>
  </div>

  <!-- ✅ AI 요약 분석 -->
  <div class="ai-summary-box">
    <h4>AI 요약 분석</h4>
    <p>{{ aiSummary }}</p>
  </div>
</main>


      <!-- ✅ 우측: 주요 성과 및 내보내기 -->
      <aside class="report-insight">
        <div class="insight-section">
          <h3>주요 성과</h3>
          <div class="insight-card" v-for="(item, i) in insights" :key="i">
            <i :class="item.icon"></i>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>

        <div class="export-section">
          <h3>리포트 내보내기</h3>
          <button class="export-btn">PDF 다운로드</button>
          <button class="export-btn">Markdown 내보내기</button>
          <button class="export-btn">이메일로 전송</button>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const reports = ref([
  {
    id: 1,
    title: "11월 종합 성장 리포트",
    created_at: "2025-11-11",
    score: 78,
    growth: 12,
    data: [82, 74, 91, 68],
  },
  {
    id: 2,
    title: "10월 종합 성장 리포트",
    created_at: "2025-10-31",
    score: 75,
    growth: 8,
    data: [80, 70, 86, 65],
  },
  {
    id: 3,
    title: "면접 집중 분석",
    created_at: "2025-10-25",
    score: 72,
    growth: 5,
    data: [76, 81, 74, 60],
  },
  {
    id: 4,
    title: "9월 종합 리포트",
    created_at: "2025-09-30",
    score: 70,
    growth: 10,
    data: [72, 65, 80, 68],
  },
]);

const insights = ref([
  { icon: "ri-file-text-line", title: "이력서 완성도", desc: "최고 수준 달성" },
  { icon: "ri-bar-chart-line", title: "꾸준한 성장", desc: "5개월 연속 상승" },
]);

const selectedReport = ref(reports.value[0]);
const previousReport = ref(null);
const aiSummary = ref("");
const avgGrowth = ref(8.75);
const maxScore = ref(85);
let chartInstance = null;

onMounted(() => {
  findPrevious(selectedReport.value);
});

function selectReport(report) {
  selectedReport.value = report;
  findPrevious(report);
}

/* ✅ 선택된 리포트의 이전 리포트를 자동 탐색 */
function findPrevious(current) {
  const currentDate = new Date(current.created_at);
  const prev = reports.value
    .filter((r) => new Date(r.created_at) < currentDate)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  previousReport.value = prev || null;
  renderCompareChart();
  generateAISummary();
}

/* ✅ 비교 그래프 생성 */
function renderCompareChart() {
  const ctx = document.getElementById("reportChart");
  if (!ctx) return;
  if (chartInstance) chartInstance.destroy();

  const labels = ["이력서", "면접", "학습", "트렌드"];
  const datasets = [
    {
      label: selectedReport.value.title,
      data: selectedReport.value.data,
      backgroundColor: "rgba(113,235,190,0.4)",
      borderColor: "#71EBBE",
      borderRadius: 6,
    },
  ];

  if (previousReport.value) {
    datasets.push({
      label: previousReport.value.title,
      data: previousReport.value.data,
      backgroundColor: "rgba(234,235,236,0.6)",
      borderColor: "#ccc",
      borderRadius: 6,
    });
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true, max: 100 } },
    },
  });
}

/* ✅ AI 요약 생성 (이전 리포트 대비 변화 문장) */
function generateAISummary() {
  if (!previousReport.value) {
    aiSummary.value = "이전 리포트가 없어 비교할 수 없습니다.";
    return;
  }

  const current = selectedReport.value.data;
  const prev = previousReport.value.data;
  const labels = ["이력서", "면접", "학습", "트렌드"];

  const diffs = current.map((v, i) => v - prev[i]);
  const improved = labels.filter((_, i) => diffs[i] > 0);
  const declined = labels.filter((_, i) => diffs[i] < 0);

  const avgDiff = (
    current.reduce((a, b) => a + b) / current.length -
    prev.reduce((a, b) => a + b) / prev.length
  ).toFixed(1);

  aiSummary.value = `
    이번 리포트(${selectedReport.value.title})는 이전(${previousReport.value.title}) 대비 
    평균 ${avgDiff > 0 ? "+" + avgDiff : avgDiff}% ${avgDiff > 0 ? "상승" : "하락"}했습니다.
    향상된 항목: ${improved.length ? improved.join(", ") : "없음"}.
    개선이 필요한 항목: ${declined.length ? declined.join(", ") : "없음"}.
  `;
}

/* ✅ 날짜 포맷 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("ko-KR");
}
</script>


<style scoped>
.report-save-page {
  background: #fff;
  min-height: 100vh;
  padding: 40px 60px;
  color: #111;
}
.page-header {
  margin-bottom: 24px;
}
.page-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}
.page-header p {
  font-size: 13px;
  color: #666;
}

/* -------------------- */
/* 전체 레이아웃        */
/* -------------------- */
.report-container {
  display: grid;
  grid-template-columns: 1fr 2.3fr 1.1fr;
  gap: 20px;
}

/* -------------------- */
/* 좌측 리포트 목록      */
/* -------------------- */
.report-list {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.report-list h3 {
  font-size: 16px;
  margin-bottom: 14px;
}
.report-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.report-list li {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.report-list li.active {
  border-color: #71ebbe;
  background: #ddf3eb;
}
.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-info h4 {
  font-size: 14px;
  font-weight: 600;
}
.item-info p {
  font-size: 12px;
  color: #777;
}
.growth {
  font-size: 12px;
  font-weight: 600;
}
.growth.plus {
  color: #2cb67d;
}
.growth.minus {
  color: #ef4444;
}

/* -------------------- */
/* 통계 요약 박스        */
/* -------------------- */
.report-summary {
  background: #fff;
  border-radius: 8px;
  padding: 14px;
  font-size: 13px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.report-summary h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.report-summary ul {
  list-style: none;
  padding: 0;
}
.report-summary li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.report-summary strong {
  font-weight: 700;
}

/* -------------------- */
/* 중앙 리포트 상세 영역 */
/* -------------------- */
.report-detail {
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.report-detail h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}
.report-detail .date {
  font-size: 12px;
  color: #777;
  margin-bottom: 20px;
}

/* 종합 점수 */
.score-box {
  background: #f9fafb;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
}
.score {
  font-size: 42px;
  font-weight: 700;
  margin: 4px 0;
}
.compare-text {
  font-size: 13px;
  color: #666;
}

/* 차트 영역 */
.chart-section {
  margin-top: 20px;
}

/* -------------------- */
/* 우측 주요 성과 영역   */
/* -------------------- */
.report-insight {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.insight-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
.insight-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  background: #f9fafb;
  padding: 10px;
  border-radius: 8px;
}
.insight-card i {
  font-size: 20px;
  color: #71ebbe;
}
.insight-card strong {
  font-size: 13px;
}
.insight-card p {
  font-size: 12px;
  color: #666;
}

/* 내보내기 */
.export-section {
  margin-top: 24px;
}
.export-section h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}
.export-btn {
  width: 100%;
  background: #f1f2f3;
  border: none;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  text-align: left;
  font-size: 13px;
  color: #111;
  cursor: pointer;
  transition: 0.2s;
}
.export-btn:hover {
  background: #a2f1d6;
}

.ai-summary-box {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px 20px;
  margin-top: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.ai-summary-box h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #111;
}
.ai-summary-box p {
  font-size: 13px;
  color: #444;
  line-height: 1.6;
}

</style>
