<template>
  <section class="core-card">
    <div class="core-header">
      <h3>핵심 역량 평가</h3>
      <p>6가지 핵심 역량 분석 평가</p>
    </div>

    <div class="radar-wrapper">
      <canvas id="radarChart"></canvas>
    </div>

    <div class="core-bottom">
      <div class="core-bottom-text">
        <h4>
          <span class="ai-icon-box">
            <i class="ri-ai"></i>
          </span>
          성장 분석
        </h4>
        <ul>
          <li>“AI가 본 나의 현재 성장 상태” 혹은 “이번 주 성장 포인트”</li>
          <li>현재 백엔드 지식은 우수하지만 협업력과 표현력이 다소 부족합니다.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import Chart from "chart.js/auto";
import "remixicon/fonts/remixicon.css";

onMounted(() => {
  const ctx = document.getElementById("radarChart");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["이력서", "면접", "학습", "트렌드", "네트워킹", "프로젝트"],
      datasets: [
        {
          data: [85, 40, 60, 55, 30, 70],
          backgroundColor: "rgba(162, 241, 214, 0.4)",
          borderColor: "#71EBBE",
          borderWidth: 2,
          pointBackgroundColor: "#111111",
        },
      ],
    },
    options: {
      scales: {
        r: {
          angleLines: { color: "#EAEBEC" },
          grid: { color: "#EAEBEC" },
          pointLabels: { color: "#111111", font: { size: 13 } },
          ticks: { display: false },
        },
      },
      plugins: { legend: { display: false } },
    },
  });
});
</script>

<style scoped>
.core-card {
  grid-area: radar;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  padding: 20px 24px;
}

.core-header h3 {
  text-align: left;
  font-size: 18px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #111;
}

.core-header p {
  font-size: 12px;
  /* margin-top: 4px; */
  color: #666;
}

/* ✅ radar 차트 중앙 정렬 */
.radar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  height: 230px;
}
.radar-wrapper canvas {
  width: 90%;
  height: 90%;
}

.core-bottom {
  margin-top: 16px;
  background-color: #f6f6f6;
  border-radius: 10px;
  padding: 14px 16px;
}

.core-bottom-text h4 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ✅ 아이콘 박스 (둥근 사각형 효과) */
.ai-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px; /* 라운드 사각형 */
  background-color: #ffffff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.ai-icon-box i {
  font-size: 18px;
  color: #000;
}

.core-bottom-text li {
  font-size: 14px;
}
</style>
