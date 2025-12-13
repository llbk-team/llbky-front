import axios from "axios";
import "./axiosConfig";
import { BASE_URL } from "./axiosConfig";

// ✅ SSE 스트리밍 수신 (수정 버전)
async function streamTodayNews(memberId, limit = 100, onNews, onComplete, onError) {
    console.log('🔌 SSE 연결 시작:', { memberId, limit });
    
    // ✅ EventSource는 axios를 사용하지 않으므로 BASE_URL 명시적 사용
    const url = `${BASE_URL}/trend/news/today/stream?memberId=${memberId}&limit=${limit}`;
    
    console.log('📡 연결 URL:', url);
    
    const eventSource = new EventSource(url);
    
    let dataReceived = false;  // 데이터 수신 여부 플래그
    
    eventSource.onopen = () => {
        console.log('✅ SSE 연결 성공!');
    };
    
    eventSource.onmessage = (event) => {
        console.log('📨 데이터 수신:', event.data);
        dataReceived = true;
        
        try {
            const news = JSON.parse(event.data);
            onNews(news);
        } catch (error) {
            console.error('❌ 파싱 에러:', error);
        }
    };
    
    eventSource.onerror = (error) => {
        // ✅ 데이터를 받았으면 정상 종료로 간주 (더 이상 로그 출력 안 함)
        if (dataReceived) {
            console.log('✅ 스트리밍 정상 완료');
            eventSource.close();
            onComplete?.();
            return;
        }
        
        // 데이터를 못 받았을 때만 에러 로그 출력
        console.error('❌ SSE 에러:', error);
        console.error('   readyState:', eventSource.readyState);
        console.error('   연결 URL:', url);
        
        const stateMsg = {
            0: 'CONNECTING (연결 시도 중 또는 실패)',
            1: 'OPEN (연결 성공)',
            2: 'CLOSED (연결 종료)'
        }[eventSource.readyState];
        
        console.error('   상태:', stateMsg);
        console.error('   💡 확인사항: 백엔드 서버 실행 중? SSE 형식이 올바른가?');
        
        eventSource.close();
        onError?.(error);
    };
    
    return eventSource;
}




/**
 * 관련 뉴스 키워드로 검색
 */
async function searchRelatedNews(summaryId, limit = 50) {
  
  const response = await axios.get(`/trend/news/${summaryId}/related-search`, {
    params: { limit }
  });
    
  return response.data;
}


/**
 * 네이버 뉴스 검색
 */
async function searchNews(keywords, memberId, limit=50, period='month') {
  const keywordString = Array.isArray(keywords) ? keywords.join(',') : keywords;
  
  const response = await axios.get(`/trend/news/search`, {
    params: {
      keywords: keywordString,  // 문자열로 전달
      memberId: memberId,
      period: period,
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
  
  
  
  return axios.get('/trend/news/feed', { params });
}

async function getTodayNews(memberId, limit = 50) {
  const response = await axios.get('/trend/news/today', {
    params: { memberId, limit }
  });
  return response;
}


export default {
  searchNews,
  analyzeNews,
  getNewsDetail,
  searchRelatedNews,
  feedNews,
  getTodayNews ,
  streamTodayNews 
};