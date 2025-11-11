<template>
  <section class="report-save-page">
    <header class="page-header">
      <h2>저장된 리포트</h2>
      <p>저장된 리포트를 선택하여 성장 추이를 비교하세요</p>
    </header>

    <div class="report-container">
      <!-- ✅ 좌측: 리포트 목록 -->
      <aside class="report-list">
        <h3>리포트 목록</h3>
        <ul>
          <li v-for="(report, i) in reports" :key="i" :class="{ active: selectedIds.includes(report.id) }"
            @click="toggleSelect(report)">
            <div class="report-item">
              <div class="item-info">
                <h4>{{ report.title }}</h4>
                <p>{{ formatDate(report.created_at) }}</p>
              </div>
              <input type="checkbox" :value="report.id" v-model="selectedIds" @click.stop />
            </div>
          </li>
        </ul>

        <!-- ✅ 비교 버튼 -->
        <button class="compare-btn" :disabled="selectedIds.length !== 2" @click="compareSelected">
          선택 리포트 비교
        </button>
      </aside>

      <!-- ✅ 중앙: 비교 결과 -->
      <main class="report-detail">
        <template v-if="selectedReports.length === 2">
          <h3>리포트 비교</h3>
          <p class="date">
            {{ selectedReports[0].title }} vs {{ selectedReports[1].title }}
          </p>

          <!-- 종합 점수 비교 -->
          <div class="score-box">
            <h4>종합 점수 비교</h4>
            <p class="score">
              {{ selectedReports[0].score }} → {{ selectedReports[1].score }}
              <span class="growth" :class="growthDiff > 0 ? 'plus' : 'minus'">
                {{ growthDiff > 0 ? '+' : '' }}{{ growthDiff }}%
              </span>
            </p>
            <p class="compare-text">
              {{ selectedReports[0].title }} 대비
              {{ growthDiff > 0 ? '상승' : '하락' }}한 결과입니다
            </p>
          </div>

          <!-- ✅ 비교 차트 -->
          <div class="chart-section">
            <canvas id="compareChart"></canvas>
          </div>

          <!-- ✅ AI 비교 요약 -->
          <div class="ai-summary-box">
            <h4>AI 비교 요약</h4>
            <p>{{ aiSummary }}</p>
          </div>
        </template>

        <!-- ⚠️ 선택 안 했을 때 -->
        <template v-else>
          <div class="empty-state">
            <p>비교할 리포트를 선택해주세요.</p>
          </div>
        </template>
      </main>

      <!-- ✅ 우측: 주요 성과 + 전체 통계 + 내보내기 -->
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

        <div class="report-summary">
          <h4>전체 통계</h4>
          <ul>
            <li>저장된 리포트 <strong>{{ reports.length }}개</strong></li>
            <li>
              평균 성장률
              <strong :class="avgGrowth > 0 ? 'plus' : 'minus'">
                {{ avgGrowth > 0 ? '+' : '' }}{{ avgGrowth }}%
              </strong>
            </li>
            <li>최고 점수 <strong>{{ maxScore }}</strong></li>
          </ul>
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
import { ref, nextTick } from "vue";
import Chart from "chart.js/auto";

/* -----------------------------
   📊 더미 리포트 데이터
------------------------------ */
const reports = ref([
  { id: 1, title: "11월 종합 성장 리포트", created_at: "2025-11-11", score: 83, growth: 5, data: [85, 80, 90, 78] },
  { id: 2, title: "10월 종합 성장 리포트", created_at: "2025-10-31", score: 79, growth: 4, data: [80, 75, 87, 74] },
  { id: 3, title: "면접 집중 분석", created_at: "2025-10-25", score: 74, growth: -2, data: [72, 70, 78, 68] },
  { id: 4, title: "9월 종합 리포트", created_at: "2025-09-30", score: 76, growth: 6, data: [78, 72, 84, 70] },
]);

/* -----------------------------
   📈 상태값
------------------------------ */
const selectedIds = ref([]);
const selectedReports = ref([]);
const avgGrowth = ref(5.5);
const maxScore = ref(90);
const growthDiff = ref(0);
const aiSummary = ref("");
let chartInstance = null;

/* -----------------------------
   📊 주요 성과
------------------------------ */
const insights = ref([
  { icon: "ri-bar-chart-line", title: "지속적인 성장", desc: "최근 3개월 평균 5% 상승" },
  { icon: "ri-file-text-line", title: "이력서 완성도", desc: "문장 구조와 키워드 사용 개선" },
]);

/* -----------------------------
   ✅ 선택 토글
------------------------------ */
function toggleSelect(report) {
  if (selectedIds.value.includes(report.id)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== report.id);
  } else if (selectedIds.value.length < 2) {
    selectedIds.value.push(report.id);
  }
}

/* -----------------------------
   ✅ 비교 실행
------------------------------ */
function compareSelected() {
  selectedReports.value = reports.value.filter((r) =>
    selectedIds.value.includes(r.id)
  );
  renderCompareChart();
  generateAISummary();
}

/* -----------------------------
   ✅ 비교 차트 렌더링
------------------------------ */
function renderCompareChart() {
  nextTick(() => {
    const ctx = document.getElementById("compareChart");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();

    const labels = ["이력서", "면접", "학습", "트렌드"];
    const [r1, r2] = selectedReports.value;

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: r1.title,
            data: r1.data,
            backgroundColor: "rgba(234,235,236,0.6)",
            borderColor: "#ccc",
            borderRadius: 6,
          },
          {
            label: r2.title,
            data: r2.data,
            backgroundColor: "rgba(113,235,190,0.4)",
            borderColor: "#71EBBE",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: { y: { beginAtZero: true, max: 100 } },
      },
    });
  });
}

/* -----------------------------
   ✅ AI 요약 비교 문장 생성
------------------------------ */
function generateAISummary() {
  const [r1, r2] = selectedReports.value;
  if (!r1 || !r2) return;

  const diff = (r2.score - r1.score).toFixed(1);
  growthDiff.value = diff;

  const improved = [];
  const declined = [];

  r2.data.forEach((v, i) => {
    const label = ["이력서", "면접", "학습", "트렌드"][i];
    if (v > r1.data[i]) improved.push(label);
    else if (v < r1.data[i]) declined.push(label);
  });

  aiSummary.value = `
    ${r2.title}는 ${r1.title} 대비 평균 ${diff > 0 ? "+" + diff : diff}% ${diff > 0 ? "상승" : "하락"}했습니다.
    향상된 항목: ${improved.length ? improved.join(", ") : "없음"}.
    개선이 필요한 항목: ${declined.length ? declined.join(", ") : "없음"}.
  `;
}

/* -----------------------------
   ✅ 날짜 포맷
------------------------------ */
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


.compare-btn {
  width: 100%;
  margin-top: 14px;
  background: #71ebbe;
  color: #000;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.compare-btn:disabled {
  background: #eaebec;
  cursor: not-allowed;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
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
