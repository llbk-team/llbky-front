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
      </div>
    </div>

    <!-- 채용 시장 키워드 트렌드 -->
    <div class="chart-container pretty-trend">
      <h4 class="chart-title">채용 시장 키워드 트렌드</h4>
      <p class="chart-subtitle">최근 7일간 주요 기술 및 직무 키워드 평균 관심도</p>

      <div class="chart-wrapper">
        <canvas id="trendChart"></canvas>
      </div>

      <div class="trend-stats">
        <div v-for="(item, i) in keywordData" :key="i" class="trend-item">
          <p class="keyword">{{ item.keyword }}</p>
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

      <!-- 산업별 시장 분위기 -->
      <div class="card sentiment-box">
        <div class="card-header">
          <h4>산업별 시장 분위기</h4>
          <p>관심 직무와 관련된 산업군의 최신 뉴스 흐름을 기반으로 분위기를 분석했습니다.
            긍정·중립·부정 비율을 통해 각 산업군이 현재 어떤 분위기와 이슈에 반응하고 있는지 확인할 수 있어요</p>

          <!-- ❔ 도움말 버튼 -->
          <button class="info-btn" @click="showReason = !showReason">
            ?
          </button>
        </div>

        <div class="sentiment-chart-container">
          <canvas id="sentimentChart"></canvas>
        </div>

        <!-- 🔽 토글 영역: finalSummary -->
        <transition name="fade">
          <div v-if="showReason" class="sentiment-summary-box">
            <h5>📌 왜 이런 분위기가 나왔나요?</h5>
            <p class="summary-text">{{ finalSummary }}</p>
          </div>
        </transition>
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
  saveLoading,
  finalSummary,
  showReason
} = useTrendAnalysis();

</script>

<style scoped src="@/assets/css/trendAnalysis.css"></style>