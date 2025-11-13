<template>
  <section class="report-wrapper preview-scale" v-if="loaded">
    <!-- 헤더 -->
    <header class="report-header">
      <div class="header-left">
        <h2>{{ title }}</h2>
        <p>{{ memo }}</p>
      </div>
    </header>

    <!-- 이력서 분석 -->
    <div class="report-card">
      <div class="card-header">
        <h3>📄 이력서 분석</h3>
        <p>문서별 작성 완성도와 점수 향상 추이를 기반으로, 자기표현 역량의 성장 방향을 분석합니다</p>
      </div>

      <hr class="header-line" />

      <div class="card-body">
        <!-- 차트1 -->
        <div class="chart-item">
          <div class="canvas-wrap">
            <Bar :data="barData" :options="chartOpt" />
          </div>
          <div class="chart-desc">
            <div class="vline"></div>
            <div class="text">
              <h4>문서유형별 세부 항목 점수 비교</h4>
              <p>문서별 강·약점 시각 비교</p>
            </div>
          </div>
        </div>

        <!-- 차트2 -->
        <div class="chart-item">
          <div class="canvas-wrap">
            <Bar :data="stackedData" :options="chartOpt" />
          </div>
          <div class="chart-desc">
            <div class="vline"></div>
            <div class="text">
              <h4>문서 작성 횟수 및 점수 향상 추이</h4>
              <p>반복 작성이 품질 향상으로 이어지는가 확인</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 면접 분석 -->
    <div class="report-card">
      <div class="card-header">
        <h3>💬 면접 분석</h3>
        <p>면접 현황과 내용 구성을 정밀하게 평가하여, 커뮤니케이션 역량과 개선점을 진단합니다</p>
      </div>

      <hr class="header-line" />

      <div class="card-body">
        <div class="chart-item">
          <div class="canvas-wrap">
            <Radar :data="radarData" :options="chartOpt" />
          </div>
          <div class="chart-desc">
            <div class="vline"></div>
            <div class="text">
              <h4>면접 역량 항목 점수</h4>
              <p>면접자의 전반적 역량을 시각화</p>
            </div>
          </div>
        </div>

        <div class="chart-item">
          <div class="canvas-wrap">
            <Line :data="lineData" :options="chartOpt" />
          </div>
          <div class="chart-desc">
            <div class="vline"></div>
            <div class="text">
              <h4>월별 면접 점수 안정성 분석</h4>
              <p>시간 경과 따른 안정성 및 일관성 분석</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 학습 분석 -->
    <div class="report-card">
      <div class="card-header">
        <h3>📚 학습 분석</h3>
        <p>학습 주제별 비중과 진도를 종합 분석해, 학습 집중도와 성장 지속성을 시각화합니다</p>
      </div>

      <hr class="header-line" />

      <div class="card-body">
        <div class="chart-item">
          <div class="canvas-wrap">
            <Doughnut :data="doughnutData" :options="chartOpt" />
          </div>
          <div class="chart-desc">
            <div class="vline"></div>
            <div class="text">
              <h4>학습 주제별 비중</h4>
              <p>학습 영역 간 균형도 평가</p>
            </div>
          </div>
        </div>

        <div class="chart-item">
          <div class="canvas-wrap">
            <Line :data="areaData" :options="chartOpt" />
          </div>
          <div class="chart-desc">
            <div class="vline"></div>
            <div class="text">
              <h4>학습 진전률 및 효율성 추이</h4>
              <p>학습 지속성·속도·완성도 통계</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Bar, Line, Radar, Doughnut } from "vue-chartjs";
import { Chart, BarElement, LineElement, ArcElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, RadialLinearScale } from "chart.js";

import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

watch(
  () => route.params.id,
  () => {
    loaded.value = false;
    loadReport();
  }
);

Chart.register(BarElement, LineElement, ArcElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, RadialLinearScale);

// 로딩 여부
const loaded = ref(false);

// 저장된 리포트 기본 정보
const title = ref("");
const memo = ref("");

// 면접/이력서/학습 요약
const resumeSummary = ref({});
const interviewSummary = ref({});
const learningSummary = ref({});
const finalSummary = ref("");

// 차트 데이터 ref
const barData = ref({});
const stackedData = ref({});
const radarData = ref({});
const lineData = ref({});
const doughnutData = ref({});
const areaData = ref({});

// 차트 옵션
const chartOpt = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" } },
};

// ⭐⭐ 임시 데이터로 바로 세팅 ⭐⭐
const loadReport = () => {
  // 제목/메모
  title.value = "카카오 면접 대비";
  memo.value = "이력서 작성 후 모의 면접 진행";

  // AI 요약 임시 데이터
  resumeSummary.value = {
    strength: "문서 구성력이 뛰어남",
    weakness: "키워드 활용이 부족함",
    improvement: "문장 간 논리 흐름을 강화하세요",
  };

  interviewSummary.value = {
    strength: "표현력 및 응답 속도가 우수함",
    weakness: "설명 구조가 다소 산만함",
    improvement: "PREP 방식으로 답변 구조화 필요",
  };

  learningSummary.value = {
    strength: "학습 지속성이 우수함",
    weakness: "휴식 없이 과도한 학습",
    improvement: "주간 목표를 세분화하여 균형 유지",
  };

  finalSummary.value = "전체적으로 학습과 면접 준비 사이의 밸런스가 잘 잡혀 있으며, 논리적 표현을 보완하면 완성도가 크게 상승합니다.";

  // ⭐⭐ 차트 임시 데이터 (MyReport.vue와 동일) ⭐⭐
  barData.value = {
    labels: ["이력서", "자기소개서", "포트폴리오"],
    datasets: [
      { label: "항목 1", data: [85, 75, 88], backgroundColor: "#FFB1C1" },
      { label: "항목 2", data: [88, 82, 90], backgroundColor: "#9AD0F5" },
      { label: "항목 3", data: [92, 78, 93], backgroundColor: "#71EBBE" },
    ],
  };

  stackedData.value = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      { type: "bar", label: "Series 1", data: [30, 50, 80, 40, 70, 90], backgroundColor: "#FF6384" },
      { type: "line", label: "Trend", data: [20, 45, 60, 55, 75, 85], borderColor: "#36A2EB", tension: 0.3, fill: false },
    ],
  };

  radarData.value = {
    labels: ["논리성", "표현력", "대응력", "분석력", "발음"],
    datasets: [{ label: "면접 점수", data: [80, 70, 85, 90, 75], backgroundColor: "rgba(255,177,193,.4)", borderColor: "#FFB1C1" }],
  };

  lineData.value = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [{ label: "면접 점수", data: [60, 70, 80, 90, 85, 88], borderColor: "#36A2EB", backgroundColor: "rgba(154,208,245,.3)", fill: true, tension: 0.4 }],
  };

  doughnutData.value = {
    labels: ["이론", "실습", "복습", "테스트"],
    datasets: [{ data: [30, 25, 25, 20], backgroundColor: ["#71EBBE", "#DDF3EB", "#EAEBEC", "#A2F1D6"] }],
  };

  areaData.value = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [{ label: "학습 효율", data: [50, 60, 75, 90, 100], borderColor: "#9AD0F5", backgroundColor: "rgba(154,208,245,.3)", fill: true, tension: 0.3 }],
  };

  // 화면 렌더 가능 상태
  loaded.value = true;
};

// mount 시 바로 임시 데이터 로드
onMounted(loadReport);
</script>

<style scoped>
/* 공통 */
.report-wrapper {
  width: 100% !important;
  margin: 0 auto;
  color: #111;
  padding: 20px;
}

.preview-scale {
  transform: scale(0.75);
  transform-origin: top left;
  width: 133%;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h2 {
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin-bottom: 3px;
}

.header-left p {
  font-size: 15px;
  color: #555;
}

.save-btn {
  width: 130px;
  height: 37px;
  color: #ffffff;
  background: #111111;
  border: none;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #71ebbe;
}

/* 카드 */
.report-card {
  width: 100% !important;
  height: auto; /* 고정 350px 제거 */
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  padding-bottom: 20px;
}

.card-header {
  height: 65px;
  color: #fff;
  padding: 15px 20px;
  border-radius: 10px 10px 0 0;
  text-align: left;
}

.header-line {
  border: none;
  height: 1px;
  background-color: #cccccc; /* 회색 계열의 미묘한 구분선 */
  margin-top: 8px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111111;
}

.card-header p {
  font-size: 13px;
  color: #555555;
  margin-top: -3px;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
}

/* =======================
   📊 최종 스타일 수정본
   ======================= */
.chart-item {
  width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* ✅ 차트 중심 기준으로 캡션 정렬 */
}

.canvas-wrap {
  width: 460px;
  height: 180px;
}

/* ✅ 차트 설명 중앙 배치 + 왼쪽정렬 */
.chart-desc {
  width: 300px;
  /* 캡션 텍스트 블록 너비 */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* 차트 기준 가운데 배치 */
  margin-top: 15px;
  text-align: left;
}

.vline {
  width: 5px;
  height: 14px;
  background: #71ebbe;
  margin-right: 8px;
}

.text {
  width: 200px;
}

.text h4 {
  font-size: 14px;
  font-weight: 700;
  color: #111;
  margin: 0 0 2px 0;
}

.text p {
  font-size: 12px;
  color: #111;
  margin: 0;
  white-space: nowrap;
  color: #555555;
}

/* AI 요약 */
.ai-summary {
  width: 400px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 15px;
}

.ai-summary h4 {
  font-size: 14px;
  margin: 0 0 8px 0;
}

.ai-card {
  width: 400px;
  height: 50px;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ai-card .title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.ai-card .content {
  margin: 2px 0 0 0;
  font-size: 12px;
  line-height: 1.3;
  color: #333;
}

.strength {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
}

.weakness {
  background: #fff8ea;
  border: 1px solid #ffe19d;
}

.improvement {
  background: #edf8ff;
  border: 1px solid #9ad0f5;
}

/* 하단 요약 (좌측 정렬, 지정 테두리/배경) */
.final-summary {
  width: 1400px;
  height: 80px;
  background: #e9f8f2;
  border: 1px solid #71ebbe;
  border-radius: 8px;
  margin-top: 30px;
  padding: 20px;
}

.final-summary h4 {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 0 0 4px 0;
}

.final-summary p {
  font-size: 13px;
  color: #333;
  margin: 0;
}
</style>
