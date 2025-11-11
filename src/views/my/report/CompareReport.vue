<template>
  <div class="compare-report">
    <h4>📊 리포트 비교</h4>
    <p v-if="!previous">이전 리포트가 없어 비교할 수 없습니다.</p>
    <canvas v-else id="compareChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({ current: Object, previous: Object });

onMounted(() => {
  if (!props.previous) return;
  const ctx = document.getElementById("compareChart");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["이력서", "면접", "학습", "트렌드"],
      datasets: [
        {
          label: props.current.title,
          data: props.current.data,
          backgroundColor: "rgba(113,235,190,0.4)",
          borderColor: "#71EBBE",
          borderRadius: 6,
        },
        {
          label: props.previous.title,
          data: props.previous.data,
          backgroundColor: "rgba(234,235,236,0.6)",
          borderColor: "#ccc",
          borderRadius: 6,
        },
      ],
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } },
  });
});
</script>

<style scoped>
.compare-report {
  margin-top: 20px;
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
}
.compare-report h4 {
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
}
</style>
