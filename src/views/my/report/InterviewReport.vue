<template>
    <div class="report-card">
        <header class="report-header">
            <h3>면접 분석</h3>
            <p class="report-desc">
                <strong>강점:</strong> 자신감 있는 발음과 어조<br />
                <strong>개선점:</strong> 즉흥 질문 대처력 부족<br />
                <strong>보완점:</strong> 모의면접으로 예상질문 대응력 향상
            </p>
        </header>

        <div class="chart-group">
            <div class="chart-box">
                <Doughnut :data="doughData" :options="opt" />
            </div>
            <div class="chart-box">
                <Bar :data="barData" :options="opt" />
            </div>
            <div class="chart-box">
                <PolarArea :data="polarData" :options="opt" />
            </div>
            <div class="chart-box">
                <Line :data="lineData" :options="opt" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Doughnut, Bar, PolarArea, Line } from "vue-chartjs";
import {
    Chart,
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    RadialLinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
Chart.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    RadialLinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const opt = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
};

const doughData = {
    labels: ["논리력", "자신감", "표현력"],
    datasets: [
        {
            data: [35, 45, 20],
            backgroundColor: ["#71EBBE", "#A2F1D6", "#EAEBEC"],
        },
    ],
};
const barData = {
    labels: ["1회", "2회", "3회"],
    datasets: [
        {
            data: [75, 82, 90],
            backgroundColor: "#A2F1D6",
            borderColor: "#71EBBE",
        },
    ],
};
const polarData = {
    labels: ["피드백", "시선처리", "공감도"],
    datasets: [
        {
            data: [88, 80, 75],
            backgroundColor: [
                "rgba(113,235,190,0.3)",
                "rgba(162,241,214,0.3)",
                "rgba(221,243,235,0.3)",
            ],
        },
    ],
};
const lineData = {
    labels: ["초기", "중기", "후기"],
    datasets: [
        {
            data: [68, 78, 86],
            borderColor: "#71EBBE",
            backgroundColor: "rgba(162,241,214,0.3)",
            tension: 0.3,
            fill: true,
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

/* 제목 + 부제목 */
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
