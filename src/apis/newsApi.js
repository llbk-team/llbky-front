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
async function searchNews(keywords, memberId) {
   const response = await axios.get(`/trend/news/search`,{
      params:{
      keywords: keywords,  
          memberId: memberId,
          period: 'month',
          limit: 20
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


async function feedNews(memberId,limit=15){
   return axios.get(`/trend/news/feed`,{
    params:{
      memberId: memberId,
      limit:limit
    }
   });
}

export default {
  searchNews,
  analyzeNews,
  getNewsDetail,
  searchRelatedNews,
  feedNews
};