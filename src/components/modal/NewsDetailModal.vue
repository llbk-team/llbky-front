<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- 헤더 -->
      <div class="modal-header">
        <h2>뉴스 요약 분석</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="detailLoading" class="loading-state">
        <div class="spinner"></div>
        <p>상세 정보를 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error && !newsDetail" class="error-state">
        <p>{{ error }}</p>
        <button class="retry-btn" @click="getNewsDetail">재시도</button>
      </div>

      <!-- 메인 콘텐츠 -->
      <div v-else class="modal-body">
        <!-- 왼쪽 분석 영역 -->
        <div class="left">
          <!-- 감정 비율 -->
          <div class="sentiment-box">
            <div class="sentiment-item positive">
              <div class="circle">{{ newsDetail?.sentimentScores?.positive||0 }}%</div>
              <span>긍정</span>
            </div>
            <div class="sentiment-item neutral">
              <div class="circle">{{ newsDetail?.sentimentScores?.neutral ||0}}%</div>
              <span>중립</span>
            </div>
            <div class="sentiment-item negative">
              <div class="circle">{{ newsDetail?.sentimentScores?.negative||0 }}%</div>
              <span>부정</span>
            </div>
          </div>

          <!-- 신뢰도
          <div class="trust-box">
            <span class="trust-label">신뢰도</span>
            <div class="trust-bar">
              <div class="trust-fill" :style="{ width: (newsDetail?.trustScore || news.trust) + '%' }"></div>
            </div>
            <span class="trust-score">{{ newsDetail?.trustScore || news.trust }}%</span>
          </div>-->

          <!-- 기사 내용 -->
          <div class="article">
            <h3>{{ newsDetail?.title || news.title }}</h3>
            <div class="meta">
              <span>{{ newsDetail?.sourceName || news.source }}</span> · 
              <span>{{ formatDate(newsDetail?.publishedAt || news.date) }}</span>
            </div>
            <!-- ✅ detailSummary 우선, 없으면 summary_short -->
            <p>{{ newsDetail?.detailSummary || newsDetail?.summaryText || news.summary_short || '요약 내용이 없습니다.' }}</p>

            <div class="keywords">
              <span v-for="(k, i) in formatKeywords(newsDetail?.keywords || news.keywords)" :key="i">#{{ k }}</span>
            </div>

            <!-- 원문 보기 버튼 -->
            <div class="source-btn-box" v-if="newsDetail?.sourceUrl || news.source_url">
              <button class="source-btn" @click="openSource(newsDetail?.sourceUrl || news.source_url)">
                <i class="ri-news-line"></i> 원문 보기
              </button>
            </div>
          </div>
        </div>

        <!-- 오른쪽 관련 뉴스 -->
        <div class="right">
          <h4>관련 뉴스</h4>
          
          <!-- 로딩 상태 -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>관련 뉴스를 불러오는 중...</p>
          </div>
          
          <!-- 에러 상태 -->
          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="searchRelatedNews">재시도</button>
          </div>
          
          <!-- 관련 뉴스 목록 -->
          <div v-else-if="relatedNews.length > 0" class="news-list">
            <div 
              v-for="(item, i) in relatedNews" 
              :key="i"
              class="news-item"
              @click="handleNewsClick(item)"
            >
              <p class="title">{{ removeHtmlTags(item.title) }}</p>
              <p class="description">{{ removeHtmlTags(item.description) }}</p>
              <p class="meta">
                <span v-if="item.source">{{ item.source }}</span>
                <span v-if="item.source && item.pubDate"> · </span>
                <span v-if="item.pubDate">{{ formatDate(item.pubDate) }}</span>
              </p>
            </div>
          </div>
          
          <!-- 빈 상태 -->
          <div v-else class="empty-state">
            <p>관련 뉴스가 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import newsApi from '@/apis/newsApi';

const props = defineProps({
  news: { type: Object, required: true },
});
const emit = defineEmits(['close']);

const relatedNews = ref([]);
const keywords = ref([]);
const loading = ref(false);
const error = ref(null);
// 상세 뉴스데이터
const newsDetail = ref(null);
const detailLoading = ref(false);


// 뉴스 상세 정보 가져오기
const getNewsDetail = async () => {
  if (!props.news.id && !props.news.summaryId) {
    
    return;
  }
  
  try {
    detailLoading.value = true;
    error.value = null;
    
    const summaryId = props.news.id || props.news.summaryId;
    const response = await newsApi.getNewsDetail(summaryId);
  

    if (response.data.status === "success") {
      newsDetail.value = response.data.data;
    

       if (newsDetail.value) {
      const sentiment = newsDetail.value.sentiment;
      const scores = newsDetail.value.sentimentScores;
      
    
    }

    } else {
      error.value = response.data.message || '상세 정보를 불러올 수 없습니다.';
    }
  } catch (err) {
    error.value = err.response?.data?.message || '상세 정보 조회 실패';
    console.error('❌ 뉴스 상세 조회 에러:', err);
  } finally {
    detailLoading.value = false;
  }
}

// 관련 뉴스 검색
const searchRelatedNews = async () => {
  if (!props.news.id && !props.news.summaryId) {
    console.warn('summaryId가 없어서 관련 뉴스를 불러올 수 없습니다.');
    return;
  }
  
  try {
    loading.value = true;
    error.value = null;
    
    const summaryId = props.news.id || props.news.summaryId;
    const response = await newsApi.searchRelatedNews(summaryId, 3);
    
    // console.log('🔗 관련 뉴스 응답:', response);
    
    if (response.status === 'success') {
      keywords.value = response.keywords || [];
      relatedNews.value = (response.data || []).slice(0, 3);
     
    } else {
      error.value = response.message || '관련 뉴스를 불러올 수 없습니다.';
    }
    
  } catch (err) {
    error.value = err.response?.data?.message || '관련 뉴스 검색 실패';
    console.error('❌ 관련 뉴스 검색 에러:', err);
  } finally {
    loading.value = false;
  }
};

// ✅ 원문 보기 함수
const openSource = (url) => {
  if (!url) return;
  // console.log('🔗 원문 열기:', url);
  window.open(url, "_blank", "noopener,noreferrer");
};

// ✅ 관련 뉴스 클릭 핸들러
const handleNewsClick = (item) => {
  // console.log('📰 뉴스 클릭:', item);
  
  const url = item.link || item.url || item.originallink;
  
  if (!url) {
    console.warn('❌ 뉴스 링크가 없습니다:', item);
    alert('뉴스 링크를 찾을 수 없습니다.');
    return;
  }
  
  console.log('🔗 새 창 열기:', url);
  window.open(url, "_blank", "noopener,noreferrer");
};

// ✅ HTML 태그 제거
const removeHtmlTags = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
};

// ✅ 키워드 포맷팅
const formatKeywords = (keywords) => {
  if (!keywords || !Array.isArray(keywords)) return [];
  
  return keywords.map(k => {
    if (typeof k === 'string') return k;
    if (typeof k === 'object') return k.keyword || k.name || k.value || '';
    return String(k);
  }).filter(k => k); // 빈 문자열 제거
};

// ✅ 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('날짜 포맷 에러:', e);
    return dateString;
  }
};

onMounted(() => {
  getNewsDetail();
  searchRelatedNews();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 920px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  padding: 26px 30px;
  animation: scaleIn 0.25s ease;
}

/* 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #71ebbe;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #111;
}
.close-btn {
  border: none;
  background: none;
  font-size: 22px;
  color: #666;
  cursor: pointer;
  transition: 0.2s;
}
.close-btn:hover {
  color: #e85b5b;
  transform: scale(1.1);
}

/* 본문 */
.modal-body {
  display: flex;
  gap: 24px;
}
.left {
  flex: 2;
}
.right {
  flex: 1.2;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 감정 */
.sentiment-box {
  display: flex;
  justify-content: space-between;
  background: #f9fffb;
  border: 1px solid #e4f8ee;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 18px;
}
.sentiment-item {
  text-align: center;
  flex: 1;
}
.sentiment-item .circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  line-height: 52px;
  margin: 0 auto 6px;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  animation: popIn 0.4s ease;
}
.positive .circle {
  background: linear-gradient(135deg, #71ebbe, #00c896);
}
.neutral .circle {
  background: #c5c5c5;
}
.negative .circle {
  background: linear-gradient(135deg, #ff8a8a, #e85b5b);
}
.sentiment-item span {
  font-size: 12px;
  color: #555;
}

/* 신뢰도 */
.trust-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
.trust-label {
  font-size: 12px;
  color: #555;
}
.trust-bar {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.trust-fill {
  background: linear-gradient(90deg, #a2f1d6 0%, #71ebbe 100%);
  height: 100%;
  transition: width 0.4s ease;
}
.trust-score {
  font-weight: 700;
  color: #000;
  font-size: 13px;
}

/* 기사 */
.article h3 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}
.article .meta {
  font-size: 12px;
  color: #777;
  margin-bottom: 10px;
}
.article p {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  margin-bottom: 14px;
}

/* 원문 버튼 */
.source-btn-box {
  margin-top: 16px;
  text-align: right;
}
.source-btn {
  background: linear-gradient(90deg, #a2f1d6, #71ebbe);
  border: none;
  border-radius: 8px;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.25s;
}
.source-btn:hover {
  background: linear-gradient(90deg, #71ebbe, #00c896);
  transform: translateY(-2px);
}

/* 키워드 */
.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.keywords span {
  background: #eafff5;
  color: #00a877;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
}

/* 관련 뉴스 */
.right h4 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111;
}

/* ✅ 뉴스 리스트 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ✅ 뉴스 아이템 - 클릭 가능하게 수정 */
.news-item {
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  /* ✅ 중요: 포인터 이벤트 활성화 */
  pointer-events: auto;
  user-select: none;
}

.news-item:hover {
  background: #f9fffb;
  transform: translateX(4px);
  border-color: #71ebbe;
  box-shadow: 0 2px 8px rgba(113, 235, 190, 0.15);
}

.news-item:active {
  transform: translateX(2px) scale(0.98);
}

.news-item .title {
  font-size: 13.5px;
  font-weight: 600;
  color: #000;
  margin-bottom: 6px;
  line-height: 1.4;
  /* ✅ 텍스트 선택 방지 */
  pointer-events: none;
}

.news-item .description {
  font-size: 12px;
  color: #555;
  margin: 4px 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  /* ✅ 텍스트 선택 방지 */
  pointer-events: none;
}

.news-item .meta {
  font-size: 11px;
  color: #777;
  margin-top: 6px;
  /* ✅ 텍스트 선택 방지 */
  pointer-events: none;
}

/* 로딩 스피너 */
.loading-state {
  text-align: center;
  padding: 40px 10px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #71ebbe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 13px;
  color: #00c896;
  font-weight: 500;
}

/* 재시도 버튼 */
.retry-btn {
  margin-top: 10px;
  background: #71ebbe;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  color: #000;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.retry-btn:hover {
  background: #00c896;
  transform: translateY(-1px);
}

/* 에러/빈 상태 */
.error-state {
  text-align: center;
  padding: 20px 10px;
}

.error-state p {
  font-size: 13px;
  color: #e85b5b;
  margin-bottom: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 10px;
  font-size: 13px;
  color: #999;
}

/* 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes popIn {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>