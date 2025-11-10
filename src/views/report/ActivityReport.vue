<template>
    <div class="report-card">
        <header class="report-header">
            <h3>활동 및 참여도 분석</h3>
            <p class="report-desc">
                <strong>강점:</strong> 협업 참여율이 높고 책임감이 뛰어남<br />
                <strong>개선점:</strong> 일정 관리 일관성이 부족<br />
                <strong>보완점:</strong> 프로젝트별 활동 기록을 정기적으로 남기세요.
            </p>
        </header>

        <div class="chart-group">
            <div class="chart-box">
                <Radar :data="radarData" :options="radarOpt" />
            </div>
            <div class="chart-box">
                <Pie :data="pieData" :options="opt" />
            </div>
            <div class="chart-box">
                <Line :data="lineData" :options="opt" />
            </div>
            <div class="chart-box">
                <Bar :data="barData" :options="opt" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Radar, Pie, Line, Bar } from "vue-chartjs";
import { Chart, CategoryScale, LinearScale, RadialLinearScale, ArcElement, PointElement, LineElement, BarElement, Filler, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, RadialLinearScale, ArcElement, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

const opt = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
const radarOpt = { ...opt, scales: { r: { ticks: { display: false }, pointLabels: { color: "#111" } } } };

const radarData = { labels: ["협업", "책임감", "참여율", "시간관리", "소통"], datasets: [{ data: [90, 85, 88, 80, 92], backgroundColor: "rgba(162,241,214,0.3)", borderColor: "#71EBBE" }] };
const pieData = { labels: ["기획", "개발", "테스트", "리뷰"], datasets: [{ data: [30, 40, 15, 15], backgroundColor: ["#71EBBE", "#A2F1D6", "#EAEBEC", "#DDF3EB"] }] };
const lineData = { labels: ["오전", "오후", "저녁"], datasets: [{ data: [60, 90, 75], borderColor: "#71EBBE", backgroundColor: "rgba(162,241,214,0.3)", tension: 0.3, fill: true }] };
const barData = { labels: ["1주", "2주", "3주", "4주"], datasets: [{ data: [5, 7, 6, 8], backgroundColor: "#A2F1D6", borderColor: "#71EBBE" }] };
</script>

<style scoped>
.report-card {
    background: #f9f9f9;
    border: 1px solid #eaebec;
    border-radius: 16px;
    padding: 20px;
}

.report-header {
    margin-bottom: 12px;
}

.report-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: #111111;
    margin-bottom: 6px;
}

.report-desc {
    font-size: 12px;
    color: #111111;
    line-height: 1.6;
    border-radius: 8px;
    padding: 10px 14px;
}

.report-desc strong {
    color: #000000;
    font-weight: 600;
}

.chart-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.chart-box {
    height: 200px;
    background: #ffffff;
    border-radius: 12px;
    padding: 10px;
    border: 1px solid #f1f2f3;
}
</style>
