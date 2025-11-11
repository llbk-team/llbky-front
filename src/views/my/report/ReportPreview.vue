<template>
  <div class="report-preview-wrapper">
    <div v-for="(section, i) in sections" :key="i" class="report-card">
      <header class="report-header">
        <h3>{{ section.title }}</h3>
        <p class="report-desc">
          <strong>강점:</strong> {{ section.strength }}<br />
          <strong>개선점:</strong> {{ section.weakness }}<br />
          <strong>보완점:</strong> {{ section.suggestion }}
        </p>
      </header>

      <div class="chart-group">
        <div class="chart-box" v-for="(chart, idx) in section.charts" :key="idx">
          <component :is="chart.type" :data="chart.data" :options="chart.options" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ sections: Array });
</script>

<style scoped>
.report-preview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 10px;
}
.report-card {
  background: #f9f9f9;
  border: 1px solid #eaebec;
  border-radius: 16px;
  padding: 20px;
}
.report-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}
.report-desc {
  font-size: 12px;
  line-height: 1.6;
}
.chart-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 10px;
}
.chart-box {
  height: 180px;
  background: #fff;
  border-radius: 10px;
  padding: 8px;
  border: 1px solid #f1f2f3;
}
</style>
