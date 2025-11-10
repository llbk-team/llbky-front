<template>
  <section class="heatmap-card">
    <h3>활동 패턴 분석</h3>
    <p>최근 1년간의 활동 빈도와 성장 리듬을 시각화합니다</p>

    <CalendarHeatmap :values="heatmapData" :end-date="new Date()" :max="10" :round="5" :tooltip="true" tooltip-unit="회" :dark-mode="false" :range-color="['#F1F2F3', '#EAEBEC', '#DDF3EB', '#A2F1D6', '#71EBBE']" style="--ch-cell-size: 12px; --ch-gap: 2px; max-width: 900px; margin: 0 auto" />
  </section>
</template>

<script>
import { CalendarHeatmap } from "vue3-calendar-heatmap";
import "@/assets/heatmap.css";

export default {
  name: "HeatmapSection",
  components: { CalendarHeatmap },
  data() {
    return { heatmapData: [] };
  },
  mounted() {
    const now = new Date();
    const values = [];

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      // ✅ count가 max(4)보다 크면 4로 고정
      let count = Math.floor(Math.random() * 8); // 일부러 더 크게 만들어봄
      if (count > 4) count = 4;

      values.push({
        date: d.toISOString().split("T")[0],
        count,
      });
    }

    this.heatmapData = values;
  },
};
</script>

<style scoped>
.heatmap-card {
  grid-column: 2 / 4 !important;
  text-align: center;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}
</style>
