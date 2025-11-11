<template>
  <div class="heatmap-wrapper">
    <!-- ✅ 히트맵 카드 (박스 유지) -->
    <section class="heatmap-card">
      <h3>활동 패턴 분석</h3>
      <p>최근 1년간의 활동 빈도와 성장 리듬을 시각화합니다</p>

      <CalendarHeatmap
        :values="heatmapData"
        :end-date="new Date()"
        :max="10"
        :round="5"
        :tooltip="true"
        tooltip-unit="회"
        :dark-mode="false"
        :range-color="['#F1F2F3', '#EAEBEC', '#DDF3EB', '#A2F1D6', '#71EBBE']"
        style="--ch-cell-size: 12px; --ch-gap: 2px; max-width: 900px; margin: 0 auto"
      />
    </section>
  </div>
</template>

<script>
import { CalendarHeatmap } from "vue3-calendar-heatmap";
import "@/assets/heatmap.css";

export default {
  name: "HeatmapSection",
  components: { CalendarHeatmap },
  data() {
    return {
      heatmapData: [],
      activityLogs: [],
    };
  },
  mounted() {
    this.generateHeatmapData();
    this.generateActivityLogs();
  },
  methods: {
    generateHeatmapData() {
      const now = new Date();
      const values = [];
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        let count = Math.floor(Math.random() * 8);
        if (count > 4) count = 4;
        values.push({ date: d.toISOString().split("T")[0], count });
      }
      this.heatmapData = values;
    },
    generateActivityLogs() {
      this.activityLogs = [
        { date: "2025-11-10T15:30:00", type: "이력서 분석", description: "AI 분석 리포트 생성" },
        { date: "2025-11-09T11:20:00", type: "면접 피드백", description: "면접 AI 피드백 완료" },
        { date: "2025-11-08T19:45:00", type: "학습 계획", description: "주간 학습 리포트 작성" },
        { date: "2025-11-07T09:10:00", type: "트렌드 분석", description: "산업 트렌드 데이터 업데이트" },
      ];
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    },
  },
};
</script>

<style scoped>
/* 전체 wrapper */
.heatmap-wrapper {
  grid-column: 2 / 4 !important;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* ✅ 히트맵 박스 */
.heatmap-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  box-sizing: border-box;
}

/* 제목과 설명 */
.heatmap-card h3 {
  text-align: left;
  font-size: 18px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #111;
}
.heatmap-card p {
  text-align: left;
  font-size: 12px;
  color: #666;
}

/* ✅ 최근 활동 내역 (박스 없음) */
.activity-log {
  text-align: left;
  margin-top: 0;
  padding: 0 8px;
}
.activity-log h4 {
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.activity-log ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.activity-log li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 4px 0;
  color: #555;
}
.activity-log li .date {
  width: 120px;
  color: #666;
}
.activity-log li .type {
  font-weight: 600;
  color: #111;
}
.activity-log li .desc {
  color: #555;
}
</style>
