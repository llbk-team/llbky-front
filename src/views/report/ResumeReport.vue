<template>
    <div class="report-card">
        <header class="report-header">
            <h3>이력서 분석</h3>
            <p class="report-desc">
                <strong>강점:</strong> 논리적 구조와 키워드 활용이 뛰어남<br />
                <strong>개선점:</strong> 문단 간 연결의 자연스러움 부족<br />
                <strong>보완점:</strong> 단락별 핵심문장 강조 필요
            </p>
        </header>

        <div class="chart-group">
            <div class="chart-box">
                <Bar :data="barData" :options="opt" />
            </div>
            <div class="chart-box">
                <Line :data="lineData" :options="opt" />
            </div>
            <div class="chart-box">
                <Radar :data="radarData" :options="radarOpt" />
            </div>
            <div class="chart-box">
                <Doughnut :data="doughData" :options="opt" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Bar, Line, Radar, Doughnut } from "vue-chartjs";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    ArcElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    ArcElement,
    Filler,
    Tooltip,
    Legend
);

const opt = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
};
const radarOpt = {
    ...opt,
    scales: { r: { ticks: { display: false }, pointLabels: { color: "#111" } } },
};

const barData = {
    labels: ["논리성", "표현력", "구조화", "키워드"],
    datasets: [
        {
            data: [85, 78, 88, 92],
            backgroundColor: "#A2F1D6",
            borderColor: "#71EBBE",
        },
    ],
};
const lineData = {
    labels: ["1차", "2차", "3차", "최종"],
    datasets: [
        {
            data: [70, 80, 85, 90],
            borderColor: "#71EBBE",
            backgroundColor: "rgba(162,241,214,0.3)",
            tension: 0.4,
            fill: true,
        },
    ],
};
const radarData = {
    labels: ["가독성", "논리성", "표현력", "키워드", "완성도"],
    datasets: [
        {
            data: [88, 84, 79, 85, 91],
            backgroundColor: "rgba(162,241,214,0.3)",
            borderColor: "#71EBBE",
        },
    ],
};
const doughData = {
    labels: ["문장력", "구조", "키워드", "논리"],
    datasets: [
        {
            data: [25, 30, 20, 25],
            backgroundColor: [
                "#71EBBE",
                "#A2F1D6",
                "#EAEBEC",
                "#DDF3EB",
            ],
        },
    ],
};
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

/* 차트 그룹 */
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
