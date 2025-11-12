<template>
    <section class="report-wrapper">
        <!-- 헤더 -->
        <header class="report-header">
            <div class="header-left">
                <h2>통합 리포트</h2>
                <p>기능별 상세 분석 및 통계를 확인하세요</p>
            </div>
            <button class="save-btn">리포트 생성 ⬇</button>
        </header>

        <!-- 이력서 분석 -->
        <div class="report-card">
            <div class="card-header">
                <h3>📄 이력서 분석</h3>
                <p>문서별 작성 완성도와 점수 향상 추이를 기반으로, 자기표현 역량의 성장 방향을 분석합니다</p>
            </div>

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

                <!-- AI 요약 -->
                <aside class="ai-summary">
                    <h4>✨ AI 요약</h4>

                    <div class="ai-card strength">
                        <p class="title">✅ 강점</p>
                        <p class="content">협업 참여율이 높고 책임감이 뛰어남</p>
                    </div>

                    <div class="ai-card weakness">
                        <p class="title">⚠ 개선점</p>
                        <p class="content">일정 관리 일관성이 부족</p>
                    </div>

                    <div class="ai-card improvement">
                        <p class="title">💡 보완점</p>
                        <p class="content">프로젝트별 활동 기록을 정기적으로 남기세요</p>
                    </div>
                </aside>
            </div>
        </div>

        <!-- 면접 분석 -->
        <div class="report-card">
            <div class="card-header">
                <h3>💬 면접 분석</h3>
                <p>면접 현황과 내용 구성을 정밀하게 평가하여, 커뮤니케이션 역량과 개선점을 진단합니다</p>
            </div>

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

                <aside class="ai-summary">
                    <h4>✨ AI 요약</h4>

                    <div class="ai-card strength">
                        <p class="title">✅ 강점</p>
                        <p class="content">면접 대화응대 능력과 표현력이 뛰어남</p>
                    </div>

                    <div class="ai-card weakness">
                        <p class="title">⚠ 개선점</p>
                        <p class="content">답변 간의 논리적 연결성이 부족</p>
                    </div>

                    <div class="ai-card improvement">
                        <p class="title">💡 보완점</p>
                        <p class="content">모의면접을 통해 답변 일관성을 향상시키세요</p>
                    </div>
                </aside>
            </div>
        </div>

        <!-- 학습 분석 -->
        <div class="report-card">
            <div class="card-header">
                <h3>📚 학습 분석</h3>
                <p>학습 주제별 비중과 진도를 종합 분석해, 학습 집중도와 성장 지속성을 시각화합니다</p>
            </div>

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

                <aside class="ai-summary">
                    <h4>✨ AI 요약</h4>

                    <div class="ai-card strength">
                        <p class="title">✅ 강점</p>
                        <p class="content">학습 참여율이 높고 목표 달성도가 우수함</p>
                    </div>

                    <div class="ai-card weakness">
                        <p class="title">⚠ 개선점</p>
                        <p class="content">학습 일정 관리의 일관성이 부족함</p>
                    </div>

                    <div class="ai-card improvement">
                        <p class="title">💡 보완점</p>
                        <p class="content">계획적 복습을 통해 학습 효율을 유지하세요</p>
                    </div>
                </aside>
            </div>
        </div>

        <!-- 하단 AI 통합 분석 -->
        <div class="final-summary">
            <h4>✨ AI 기반 통합 분석</h4>
            <p>이 리포트는 AI가 당신의 이력서, 면접, 학습 데이터를 종합적으로 분석하여 생성되었습니다. 각 섹션의 인사이트를 참고하여 더 나은 성장을 이루어보세요.</p>
        </div>
    </section>
</template>

<script setup>
import { ref } from "vue";
import { Bar, Line, Radar, Doughnut } from "vue-chartjs";
import {
    Chart,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
} from "chart.js";
Chart.register(
    BarElement, LineElement, ArcElement, PointElement,
    CategoryScale, LinearScale, Title, Tooltip, Legend, RadialLinearScale
);

const chartOpt = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } };

const barData = ref({
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        { label: "Series 1", data: [40, 60, 70, 55, 80, 90], backgroundColor: "#FFB1C1" },
        { label: "Series 2", data: [50, 65, 75, 60, 85, 95], backgroundColor: "#9AD0F5" },
    ],
});
const stackedData = ref({
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        { type: "bar", label: "Series 1", data: [30, 50, 80, 40, 70, 90], backgroundColor: "#FF6384" },
        { type: "line", label: "Trend", data: [20, 45, 60, 55, 75, 85], borderColor: "#36A2EB", tension: .3, fill: false },
    ],
});
const radarData = ref({
    labels: ["논리성", "표현력", "대응력", "분석력", "발음"],
    datasets: [
        { label: "면접 점수", data: [80, 70, 85, 90, 75], backgroundColor: "rgba(255,177,193,.4)", borderColor: "#FFB1C1" },
    ],
});
const lineData = ref({
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        { label: "면접 점수", data: [60, 70, 80, 90, 85, 88], borderColor: "#36A2EB", backgroundColor: "rgba(154,208,245,.3)", fill: true, tension: .4 },
    ],
});
const doughnutData = ref({
    labels: ["이론", "실습", "복습", "테스트"],
    datasets: [{ data: [30, 25, 25, 20], backgroundColor: ["#71EBBE", "#DDF3EB", "#EAEBEC", "#A2F1D6"] }],
});
const areaData = ref({
    labels: ["January", "February", "March", "April", "May"],
    datasets: [{ label: "학습 효율", data: [50, 60, 75, 90, 100], borderColor: "#9AD0F5", backgroundColor: "rgba(154,208,245,.3)", fill: true, tension: .3 }],
});
</script>

<style scoped>
:global(body) {
    background-color: #F1F3F4;
}

/* 공통 */
.report-wrapper {
    width: 1400px;
    margin: 0 auto;
    color: #111;
    padding: 20px;
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.header-left h2 {
    font-size: 28px;
    font-weight: 700;
    color: #000;
    margin-bottom: 3px;
}

.header-left p {
    font-size: 12px;
    color: #555;
}

.save-btn {
    width: 110px;
    height: 33px;
    background: #71EBBE;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
}

/* 카드 */
.report-card {
    width: 1400px;
    height: 350px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .05);
    margin-bottom: 25px;
    overflow: hidden;
}

.card-header {
    height: 65px;
    background: #111111;
    color: #fff;
    padding: 12px 20px;
    border-radius: 10px 10px 0 0;
}

.card-header h3 {
    font-size: 18px;
    font-weight: 700;
}

.card-header p {
    font-size: 12px;
    color: #B4B4B4;
    margin-top: 3px;
}

.card-body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
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
    width: 200px;
    /* 캡션 텍스트 블록 너비 */
    display: flex;
    align-items: flex-start;
    justify-content: center;
    /* 차트 기준 가운데 배치 */
    margin-top: 35px;
    text-align: left;
}

.vline {
    width: 3px;
    height: 14px;
    background: #71EBBE;
    border-radius: 2px;
    margin-right: 8px;
}

.text {
    width: 200px;
}

.text h4 {
    font-size: 12px;
    font-weight: 700;
    color: #111;
    margin: 0 0 2px 0;
}

.text p {
    font-size: 10px;
    color: #111;
    margin: 0;
}

/* AI 요약 */
.ai-summary {
    width: 400px;
    display: flex;
    flex-direction: column;
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
    margin-bottom: 8px;
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
    font-size: 10px;
    line-height: 1.3;
}

.strength {
    background: #E9F8F2;
    border: 1px solid #A2F1D6;
}

.weakness {
    background: #FFF8EA;
    border: 1px solid #FFE19D;
}

.improvement {
    background: #EDF8FF;
    border: 1px solid #9AD0F5;
}

/* 하단 요약 (좌측 정렬, 지정 테두리/배경) */
.final-summary {
    width: 1400px;
    height: 70px;
    background: #E9F8F2;
    border: 1px solid #71EBBE;
    border-radius: 8px;
    margin-top: 30px;
    padding: 20px;
}

.final-summary h4 {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    margin: 0 0 6px 0;
}

.final-summary p {
    font-size: 12px;
    color: #333;
    margin: 0;
}
</style>
