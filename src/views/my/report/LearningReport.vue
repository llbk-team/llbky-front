<template>
    <div class="report-card">
        <header class="report-header">
            <h3>학습 분석</h3>
            <p class="report-desc">
                <strong>강점:</strong> 학습 진도율과 지속성이 안정적입니다.<br />
                <strong>개선점:</strong> 복습 주기가 일정하지 않습니다.<br />
                <strong>보완점:</strong> 주간 복습 계획을 추가하여 효율을 높이세요.
            </p>
        </header>

        <div class="chart-group">
            <div class="chart-box">
                <Line :data="lineData" :options="opt" />
            </div>
            <div class="chart-box">
                <Bar :data="barData" :options="opt" />
            </div>
            <div class="chart-box">
                <Scatter :data="scatterData" :options="opt" />
            </div>
            <div class="chart-box">
                <Radar :data="radarData" :options="radarOpt" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Line, Bar, Scatter, Radar } from "vue-chartjs";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Filler, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Filler, Tooltip, Legend);

const opt = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
const radarOpt = { ...opt, scales: { r: { ticks: { display: false }, pointLabels: { color: "#111" } } } };

const lineData = { labels: ["1주", "2주", "3주", "4주"], datasets: [{ data: [70, 75, 85, 90], borderColor: "#71EBBE", backgroundColor: "rgba(162,241,214,0.3)", tension: 0.3, fill: true }] };
const barData = { labels: ["1주", "2주", "3주", "4주"], datasets: [{ data: [12, 15, 17, 20], backgroundColor: "#A2F1D6", borderColor: "#71EBBE" }] };
const scatterData = { datasets: [{ data: [{ x: 1, y: 65 }, { x: 2, y: 72 }, { x: 3, y: 85 }, { x: 4, y: 90 }], backgroundColor: "#71EBBE", borderColor: "#A2F1D6" }] };
const radarData = { labels: ["집중력", "지속력", "이해도", "복습률", "성취도"], datasets: [{ data: [85, 80, 88, 75, 90], backgroundColor: "rgba(162,241,214,0.3)", borderColor: "#71EBBE" }] };
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
