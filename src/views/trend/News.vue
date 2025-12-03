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

      <!-- 🔹 최근 검색어 표시 -->
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

    <!-- ✅ 필터바 -->
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
        <p>뉴스를 불러오는 중...</p>
      </div>

      <!-- 뉴스 그리드 -->
      <div v-else class="news-grid">
        <div v-if="visibleNews.length === 0" class="no-results">
          검색 결과가 없습니다.
        </div>
        
        <div v-for="(item, i) in visibleNews" :key="i" class="news-card" @click="openDetail(item)">
          <!-- 상단 태그 -->
          <div class="tag-row">
            <span class="tag category">채용 시장</span>
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
    </section>

    <!-- 상세보기 -->
    <NewsDetailModal v-if="selectedNews" :news="selectedNews" @close="selectedNews = null" />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import FilterBar from "@/components/bar/FilterBar.vue";
import NewsDetailModal from "@/components/modal/NewsDetailModal.vue";
import newsApi from "@/apis/newsApi";

const keyword = ref("");
const recentKeywords = ref([]);
const selectedNews = ref(null);
const filters = ref({
  period: "week",
  sentiment: "",
  trustMin: 70,
});

const loading = ref(false);
const apiError = ref(null);
const newsList = ref([]);

const MEMBER_ID = 1;

/* ------------------------------
   날짜 필터링 유틸리티
------------------------------ */
const calculateStartDate = (period) => {
  const today = new Date();
  
  switch (period) {
    case "today":
      today.setHours(0, 0, 0, 0);
      return today;
    case "week":
      return new Date(today.setDate(today.getDate() - 7));
    case "month":
      return new Date(today.setMonth(today.getMonth() - 1));
    default:
      return new Date(0); // 전체
  }
};

/* ------------------------------
   필터 및 검색
------------------------------ */
const filteredNews = computed(() => {
  let filtered = newsList.value;
  
  // ✅ 1. 날짜 필터링 (period)
  const startDate = calculateStartDate(filters.value.period);
  filtered = filtered.filter(n => {
    const newsDate = new Date(n.date || n.publishedAt);
    return newsDate >= startDate;
  });
  
  // ✅ 2. 감정 필터링
  if (filters.value.sentiment) {
    filtered = filtered.filter(n => n.sentiment === filters.value.sentiment);
  }
  
  // ✅ 3. 신뢰도 필터링
  filtered = filtered.filter(n => n.trust >= filters.value.trustMin);
  
  // ✅ 4. 키워드 검색
  if (keyword.value) {
    filtered = filtered.filter(n =>
      n.title.includes(keyword.value) ||
      n.summary_short.includes(keyword.value) ||
      n.keywords.some(k => k.includes(keyword.value))
    );
  }
  
  return filtered;
});

const visibleNews = computed(() => filteredNews.value.slice(0, 6));

/* ------------------------------
   API 응답을 화면용 데이터로 변환
------------------------------ */
const mapNewsData = (newsItems) => {
  console.log('🔄 mapNewsData - Input:', newsItems);
  
  if (!Array.isArray(newsItems)) {
    console.log('⚠️ mapNewsData - Invalid input');
    return [];
  }
  
  const mapped = newsItems.map((n) => ({
    id: n.id || n.summaryId,
    title: n.title || "제목 없음",
    summary_short: n.summaryText || n.summary_short || "",
    keywords: Array.isArray(n.keywords) 
      ? n.keywords.map(k => {
          if (typeof k === 'string') return k;
          if (typeof k === 'object') return k.keyword || k.name || k.value || JSON.stringify(k);
          return String(k);
        })
      : [],
    trust: n.trustScore ?? n.trust ?? 0,
    sentiment: n.sentiment || "neutral",
    sentimentLabel: 
      n.sentiment === 'positive' ? '긍정적' : 
      n.sentiment === 'negative' ? '부정적' : '중립적',
    bias_detected: n.biasDetected ?? n.bias_detected ?? false,
    bias_type: n.biasType || n.bias_type || "",
    date: n.publishedAt || n.date || "",
    source: n.sourceName || n.source || "",
    source_url: n.sourceUrl || n.source_url || "",
  }));
  
  console.log('✅ mapNewsData - Output:', mapped);
  return mapped;
};

/* ------------------------------
   검색
------------------------------ */
const searchNews = async () => {
  if (!keyword.value.trim()) {
    alert('검색어를 입력해주세요.');
    return;
  }
  
  const term = keyword.value.trim();
  
  // 최근 검색어 저장
  const saved = JSON.parse(localStorage.getItem("search_keywords") || "[]");
  const updated = [term, ...saved.filter((k) => k !== term)].slice(0, 5);
  localStorage.setItem("search_keywords", JSON.stringify(updated));
  recentKeywords.value = updated;
  
  loading.value = true;
  apiError.value = null;
  
  console.log('🔍 searchNews - Request:', { keywords: [term], memberId: MEMBER_ID });
  
  try {
    // ✅ API 호출 (백엔드에서 최근 1개월 데이터 가져옴)
    const response = await newsApi.searchNews([term], MEMBER_ID);
    console.log('✅ searchNews - Response:', response);
    
    if (response.status === 'success' && response.data) {
      const newsItems = Array.isArray(response.data) ? response.data : [];
      
      if (newsItems.length > 0) {
        newsList.value = mapNewsData(newsItems);
        console.log('✅ newsList 업데이트:', newsList.value.length, '건');
      } else {
        apiError.value = '검색 결과가 없습니다.';
      }
    } else {
      apiError.value = response.message || '검색에 실패했습니다.';
    }

  } catch (error) {
    console.error('뉴스 검색 실패:', error);
    apiError.value = error.response?.data?.message || '뉴스 검색에 실패했습니다.';
  } finally {
    loading.value = false;
  }
};
const clickKeyword = (k) => {
  keyword.value = k;
  searchNews();
};

const deleteKeyword = (k) => {
  const updated = recentKeywords.value.filter((item) => item !== k);
  recentKeywords.value = updated;
  localStorage.setItem("search_keywords", JSON.stringify(updated));
};

const clearAll = () => {
  recentKeywords.value = [];
  localStorage.removeItem("search_keywords");
};

/* ------------------------------
   초기 데이터 로드
------------------------------ */
const loadInitialNews = async () => {
  if (newsList.value.length > 0) {
    console.log('⏭️ 이미 뉴스가 있으므로 스킵');
    return;
  }

  loading.value = true;
  apiError.value = null;

  try {
    console.log('🌅 loadInitialNews - memberId:', MEMBER_ID);
    
    // ✅ 최근 1개월 데이터 로드 (충분히 넓은 범위)
    const response = await newsApi.getLatestNews(MEMBER_ID, 30);
    console.log('✅ loadInitialNews - Response:', response);
    
    if (response && response.data) {
      const newsItems = Array.isArray(response.data.data) 
        ? response.data.data 
        : Array.isArray(response.data) 
          ? response.data 
          : [];
          
      if (newsItems.length > 0) {
        newsList.value = mapNewsData(newsItems);
      }
    }
  } catch (error) {
    console.error('뉴스 로드 실패:', error);
    apiError.value = '뉴스를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  console.log('🚀 onMounted');
  
  recentKeywords.value = JSON.parse(
    localStorage.getItem("search_keywords") || "[]"
  );
  
  await loadInitialNews();
  console.log('✅ onMounted 완료 - newsList:', newsList.value.length, '건');
});

/* ------------------------------
   유틸리티 함수
------------------------------ */
const formatSummary = (summary) => {
  if (!summary) return "";
  
  const lines = summary.trim().split("\n").filter(line => line.trim());
  
  if (lines.length === 0) return "";
  
  return (
    "<ul>" +
    lines.map((line) => `<li>${line.trim()}</li>`).join("") +
    "</ul>"
  );
};

// ✅ 필터 변경 시 호출 (API 재호출 없이 클라이언트 필터링만)
const applyFilter = (newFilters) => {
  console.log('🔧 필터 변경:', newFilters);
  filters.value = newFilters;
  // filteredNews computed가 자동으로 재계산됨
};

const openDetail = (item) => {
  selectedNews.value = item;
};
</script>

<style scoped>
.trend-news {
  background: #fff;
  color: #111;
  font-family: "NexonLv1Gothic", sans-serif;
}

/* Hero */
.hero {
  background: #000;
  color: #fff;
  text-align: center;
  padding: 70px 20px;
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

.hero h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 28px;
  letter-spacing: -0.3px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.search-bar input {
  width: 440px;
  padding: 12px 18px;
  height: 37px;
  border-radius: 30px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-bar button {
  background: #71ebbe;
  border: none;
  color: #000;
  height: 37px;
  font-weight: 600;
  font-size: 13.5px;
  padding: 10px 22px;
  border-radius: 30px;
  cursor: pointer;
}

/* 최근 검색어 */
.recent-keywords {
  margin-top: 18px;
  text-align: center;
}

.recent-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.clear-all {
  background: none;
  border: none;
  color: #ccc;
  font-size: 12px;
  cursor: pointer;
}

.clear-all:hover {
  color: #fff;
}

.recent-keywords .tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.recent-keywords .tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f3f3f3;
  border-radius: 30px;
  padding: 4px 10px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: 0.2s;
}

.recent-keywords .tag:hover {
  background: #ddf3eb;
  color: #00c896;
}

.recent-keywords .tag i {
  font-size: 14px;
  color: #aaa;
  cursor: pointer;
}

.recent-keywords .tag i:hover {
  color: #ff6666;
}

/* 뉴스 섹션 */
.news-section {
  padding: 40px 80px 100px;
}

.news-section h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
}

.news-section .desc {
  font-size: 16px;
  color: #6c757d;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.news-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: 0.2s;
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border-color: #d0d0d0;
}

/* 카드 내부 */
.tag-row {
  display: flex;
  gap: 6px;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  padding: 3px 8px;
}

.tag.category {
  background: #eafff5;
  color: #00a877;
}

.tag.positive {
  background: #eafff5;
  color: #00c896;
}

.tag.neutral {
  background: #f5f5f5;
  color: #555;
}

.tag.negative {
  background: #ffecec;
  color: #e85b5b;
}

.title {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin: 8px 0 12px;
}

.summary-box {
  background: #f9fdfb;
  border: 1px solid #e4f7ee;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
}

.summary-box ul {
  margin: 0;
  padding-left: 18px;
}

.summary-box li {
  list-style-type: disc;
  margin-bottom: 4px;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.keywords span {
  background: #f3f3f3;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 12px;
  color: #444;
}

.bias {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}



.bias-status {
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  padding: 3px 8px;
}

.biasYes {
  background: #ffecec;
  color: #e85b5b;
}

.biasNo {
  background: #f3f3f3;
  color: #555;
}

.trust {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trust .label {
  font-size: 12px;
  color: #777;
}

.trust .bar {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.trust .fill {
  height: 100%;
  background: #71ebbe;
}

.trust .score {
  font-weight: 700;
  font-size: 12px;
}

.source {
  font-size: 11.5px;
  color: #888;
  text-align: right;
}

.delete-icon {
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
}

.delete-icon:hover {
  opacity: 1;
  color: #ff5b5b;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px 20px;
  border-radius: 8px;
  margin: 16px 0;
  text-align: center;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
  grid-column: 1 / -1;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

</style>
