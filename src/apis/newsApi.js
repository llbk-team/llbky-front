import axios from "axios";
import "./axiosConfig";

/**
 * 관련 뉴스 키워드로 검색
 */
async function searchRelatedNews(summaryId, limit = 3) {
  
  const response = await axios.get(`/trend/news/${summaryId}/related-search`, {
    params: { limit }
  });
    
  return response.data;
}


/**
 * 네이버 뉴스 검색
 */
async function searchNews(keywords, memberId,limit=15) {

   const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
  
   const response = await axios.get(`/trend/news/search`,{
      params:{
      keywords: keywords,  
          memberId: memberId,
          period: 'month',
          limit: limit
      }
    });

  return response;
}

/**
 * 뉴스 분석 및 저장
 */
async function analyzeNews(request) {
  return axios.post("/trend/news/analyze", request);
}

/**
 * 뉴스 상세보기
 */
async function getNewsDetail(summaryId) {
  return axios.get(`/trend/news/detail/${summaryId}`);
}


// ✅ 피드 뉴스 조회 (무한 스크롤 지원)
async function feedNews(
  memberId, 
  limit = 15, 
  period = 'week',  // ✅ 추가
  lastPublishedAt = null, 
  lastSummaryId = null
) {
  const params = {
    memberId,
    limit,
    period  // ✅ 추가
  };
  
  if (lastPublishedAt) {
    params.lastPublishedAt = lastPublishedAt;  
  }
  if (lastSummaryId) {
    params.lastSummaryId = lastSummaryId;
  }
  
  console.log('📡 feedNews 요청:', params);
  
  return axios.get('/trend/news/feed', { params });
}

export default {
  searchNews,
  analyzeNews,
  getNewsDetail,
  searchRelatedNews,
  feedNews
};