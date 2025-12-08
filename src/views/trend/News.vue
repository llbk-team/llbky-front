<template>
  <div class="trend-news">
    <!-- Hero -->
    <section class="hero">
      <h2>AI가 분석해주는 채용 트렌드</h2>

      <!-- 검색창 -->
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="키워드를 입력하세요 (예: 인공지능, 백엔드, AI 개발자)" 
          v-model="keyword" 
          @keyup.enter="searchNews"
          :disabled="loading"
        />
        <button @click="searchNews" :disabled="loading">
          {{ loading ? '검색 중...' : '검색' }}
        </button>
      </div>

      <!-- 최근 검색어 표시 -->
      <div class="recent-keywords" v-if="recentKeywords.length">
        <div class="recent-header">
          <span class="label">최근 검색:</span>
          <button class="clear-all" @click="clearAll">전체삭제</button>
        </div>

        <div class="tags">
          <div v-for="(k, i) in recentKeywords" :key="i" class="tag" @click="clickKeyword(k)">
            <span>#{{ k }}</span>
            <span class="delete-icon" @click.stop="deleteKeyword(k)" title="삭제">❌</span>
          </div>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="apiError" class="error-message">
        {{ apiError }}
      </div>
    </section>

    <!-- 필터바 -->
    <FilterBar @filter-change="applyFilter" />

    <!-- 뉴스 카드 리스트 -->
    <section class="news-section">
      <h3>AI 뉴스 요약</h3>
      <p class="desc">
        AI가 사용자의 직무와 관심 키워드를 기반으로,
        관련성이 높은 채용·기술 뉴스를 자동 추천합니다.<br />
        각 뉴스는 신뢰도·감정 여부까지 함께 분석되어
        객관적인 시장 인사이트를 제공합니다.
      </p>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>뉴스를 불러오는 중...</p>
      </div>

      <!-- 뉴스 그리드 -->
      <div v-else class="news-grid">
        <div v-if="visibleNews.length === 0" class="no-results">
          검색 결과가 없습니다.
        </div>
        
        <div v-for="(item, i) in visibleNews" :key="item.id || i" class="news-card" @click="openDetail(item)">
          <!-- 상단 태그 -->
          <div class="tag-row">
            <span class="tag" :class="item.sentiment">{{
              item.sentimentLabel
            }}</span>
          </div>

          <!-- 제목 -->
          <h4 class="title">{{ item.title }}</h4>

          <!-- 요약 -->
          <div class="summary-box" v-html="formatSummary(item.summary_short)"></div>

          <!-- 키워드 -->
          <div class="keywords">
            <span v-for="(k, j) in item.keywords" :key="j">#{{ k }}</span>
          </div>

          <!-- 신뢰도 + 출처 -->
          <div class="card-footer">
            <div class="trust">
              <span class="label">신뢰도</span>
              <div class="bar">
                <div class="fill" :style="{ width: item.trust + '%' }"></div>
              </div>
              <span class="score">{{ item.trust }}%</span>
            </div>
            <div class="source">
              출처: {{ item.source }} · {{ item.date }}
            </div>
          </div>
        </div>
      </div>

      <!-- 추가 로딩 (무한 스크롤) -->
      <div v-if="isLoadingMore" class="loading-more">
        <div class="spinner"></div>
        <p>추가 뉴스를 불러오는 중...</p>
      </div>

      <!-- 마지막 페이지 -->
      <div v-if="!hasMore && visibleNews.length > 0" class="no-more">
        <p>모든 뉴스를 불러왔습니다.</p>
      </div>
    </section>

    <!-- 상세보기 모달 -->
    <NewsDetailModal 
      v-if="selectedNews" 
      :news="selectedNews" 
      @close="closeDetail" 
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import FilterBar from "@/components/bar/FilterBar.vue";
import NewsDetailModal from "@/components/modal/NewsDetailModal.vue";
import { news } from "@/utils/news";

// 뉴스 컴포저블 사용
const {
  // 상태
  keyword,
  recentKeywords,
  selectedNews,
  filters,
  loading,
  apiError,
  newsList,
  hasMore,
  isLoadingMore,
  isSearchMode,
  MEMBER_ID,
  
  // 계산된 속성
  filteredNews,
  visibleNews,
  
  // 유틸리티 함수
  formatSummary,
  
  // 검색어 관리
  clickKeyword,
  deleteKeyword,
  clearAll,
  
  // 뉴스 검색 및 로드
  searchNews,
  
  // 필터 관리
  applyFilter,
  
  // 모달 관리
  openDetail,
  closeDetail,
  
  // 생명주기
  initializeNews,
  cleanupNews,
} = news();

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  await initializeNews();
});

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  cleanupNews();
});
</script>

<style src="@/assets/css/news.css" scoped></style>