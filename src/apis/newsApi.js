import axios from "axios";
import "./axiosConfig";

/**
 * 관련 뉴스 키워드로 검색
 */
async function searchRelatedNews(summaryId, limit = 3) {
  console.log('🔗 [newsApi.searchRelatedNews] Request:', { summaryId, limit });
  
  const response = await axios.get(`/trend/news/${summaryId}/related-search`, {
    params: { limit }
  });
  
  console.log('✅ [newsApi.searchRelatedNews] Response:', response.data);
  
  return response.data;
}


/**
 * 네이버 뉴스 검색
 */
async function searchNews(keywords, memberId) {
  const params = new URLSearchParams();

  keywords.forEach(keyword => params.append('keywords', keyword));
  if (memberId) params.append('memberId', memberId);

  console.log('🔍 [newsApi.searchNews] Request:', { keywords, memberId, url: '/trend/news/search' });

  // ✅ /search 엔드포인트로 변경
  const response = await axios.get(`/trend/news/search`, {
    params
  });

  console.log('✅ [newsApi.searchNews] Response:', response.data);

  // ✅ 백엔드 응답 구조: { status, message, analyzed, data }
  return response.data;
}

/**
 * 뉴스 분석 및 저장
 */
async function analyzeNews(request) {
  return axios.post("/trend/news/analyze", request);
}

/**
 * 오늘 뉴스 조회
 */
async function getTodayNews(memberId, limit = 6) {
  return axios.get(`/trend/news/member/${memberId}/today`, { params: { limit } });
}

/**
 * 뉴스 상세보기
 */
async function getNewsDetail(summaryId) {
  return axios.get(`/trend/news/detail/${summaryId}`);
}

/**
 * 최신 뉴스 조회
 */
async function getLatestNews(memberId, limit = 10) {
  return axios.get(`/trend/news/member/${memberId}/latest`, { params: { limit } });
}

/**
 * 수집 상태 확인
 */
async function getCollectionStatus(memberId) {
  return axios.get(`/trend/news/member/${memberId}/status`);
}

/**
 * 뉴스 자동 수집
 */
async function collectNews(keywords, memberId) {
  return axios.post("/trend/news/collect", { keywords, memberId });
}

export default {
  searchNews,
  analyzeNews,
  getTodayNews,
  getNewsDetail,
  getLatestNews,
  getCollectionStatus,
  collectNews,
  searchRelatedNews
};