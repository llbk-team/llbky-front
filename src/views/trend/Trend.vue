<!-- 트렌드 분석 컴포넌트 -->
<template>
  <div class="trend-page">
    <h2 class="page-title">채용 시장 트렌드 분석</h2>
    <p class="page-subtitle">AI가 분석한 산업별 키워드 트렌드와 시장 흐름</p>

    <!-- 상단 요약 카드 -->
    <div class="summary-cards">
      <div v-for="(card, i) in summaryCards" :key="i" class="summary-card">
        <p class="label">{{ card.label }}</p>
        <h3 class="value">{{ card.value }}</h3>
        <span v-if="card.change" class="change" :class="{ up: card.change > 0, down: card.change < 0 }">
          {{ card.change > 0 ? "+" : "" }}{{ card.change }}%
        </span>
      </div>
    </div>

    <!-- 채용 시장 키워드 트렌드 -->
    <div class="chart-container pretty-trend">
      <h4 class="chart-title">채용 시장 키워드 트렌드</h4>
      <p class="chart-subtitle">최근 1개월간 주요 기술 및 직무 키워드 변화율</p>

      <div class="chart-wrapper">
        <canvas id="trendChart"></canvas>
      </div>

      <div class="trend-stats">
        <div v-for="(item, i) in keywordData" :key="i" class="trend-item">
          <p class="keyword">{{ item.keyword }}</p>
          <p class="change" :class="{ up: item.change > 0, down: item.change < 0 }">
            {{ item.change > 0 ? "▲" : "▼" }} {{ Math.abs(item.change) }}%
          </p>
        </div>
      </div>
    </div>

    <!-- 핵심 기술 키워드 + 산업별 채용 시장 분위기 -->
    <div class="insight-row">
      <div class="card wordcloud-box">
        <div class="card-header">
          <h4>핵심 기술 키워드</h4>
          <p>AI가 추출한 주요 스킬 및 산업별 키워드</p>
        </div>

        <div id="wordCloud" class="wordcloud">
        </div>
      </div>

      <div class="card sentiment-box">
        <div class="card-header">
          <h4>산업별 채용 시장 분위기</h4>
          <p>긍정·중립·부정 비율로 본 산업별 채용 감정 분석</p>
        </div>

        <div class="sentiment-chart-container">
          <canvas id="sentimentChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 시장 인사이트 요약 -->
    <div class="insight-summary">
      <h4>시장 인사이트 요약</h4>
      <ul>
        <li v-for="(item, i) in marketInsight" :key="i">{{ item }}</li>
      </ul>
      <div class="insight-link">
        <router-link to="/trend/insight" class="btn-link">
          👉 내 맞춤 <b>직무 인사이트 보기</b>
        </router-link>
      </div>
    </div>
  </div>

  <!-- 작성 완료 로딩 오버레이 -->
  <div v-if="saveLoading" class="save-loading-overlay">
    <div class="save-loading-box">
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <p>트렌드를 분석하고 있습니다</p>
      <p class="sub">AI 분석이 자동으로 실행돼요!</p>
    </div>
  </div>
</template>

<script setup>
import { useTrendAnalysis } from "@/utils/trendAnalysis";

const {
  summaryCards,
  keywordData,
  sentimentData,
  wordCloudData,
  marketInsight,
  saveLoading
} = useTrendAnalysis(1);

</script>

<style src="@/assets/css/trendAnalysis.css"></style>