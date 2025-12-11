import axios from "axios";
import "./axiosConfig";

// 포트폴리오 표준 데이터 관련 API

/**
 * 모든 평가 기준 조회
 * @returns {Promise} List<PortfolioStandard>
 */
function getAllStandards() {
  return axios.get("/portfolio-standard");
}


/**
 * 직군 + 직무로 평가 기준 조회
 * @param {String} jobGroup - 직군
 * @param {String} jobRole - 직무
 * @param {Number} memberId - 회원 ID (선택)
 * @returns {Promise} List<PortfolioStandard>
 */
function getStandardsByJob(jobGroup, jobRole) {
  return axios.get("/portfolio-standard/by-job", {
    params: { jobGroup, jobRole }
  });
}


function getStandardsByMember(memberId) {
  return axios.get("/portfolio-standard/member", {
    params: { memberId }
  });
}



// 포트폴리오 가이드 코칭 API

/**
 * ⭐ 새 가이드 생성
 * POST /portfolio-guide/create
 * Content-Type: application/json
 * Body: {memberId: 1, title: "백엔드 포트폴리오", standardId: 1}
 * @param {Object} createRequest - {memberId, title, standardId}
 * @returns {Promise} PortfolioGuide
 */
function createGuide(createRequest) {
  return axios.post("/portfolio-guide/create", createRequest);
}

/**
 * ⭐ 가이드 내용 저장
 * PUT /portfolio-guide/save
 * Content-Type: application/json
 * Body: {guideId: 1, currentStep: 2, guideSteps: [...]}
 * @param {Object} saveRequest - {guideId, currentStep, guideSteps}
 * @returns {Promise} PortfolioGuide
 */
function saveGuide(saveRequest) {
  return axios.put("/portfolio-guide/save", saveRequest);
}

/**
 * 가이드 단일 조회
 * GET /portfolio-guide/{guideId}?memberId=1
 * @param {Number} guideId - 가이드 ID
 * @param {Number} memberId - 회원 ID (선택)
 * @returns {Promise} PortfolioGuide
 */
function getGuideById(guideId, memberId) {
  const params = memberId ? { memberId } : {};
  return axios.get(`/portfolio-guide/${guideId}`, { params });
}

/**
 * 회원별 가이드 목록 조회
 * GET /portfolio-guide/member/{memberId}
 * @param {Number} memberId - 회원 ID
 * @returns {Promise} List<PortfolioGuide>
 */
function getGuidesByMember(memberId) {
  return axios.get(`/portfolio-guide/member/${memberId}`);
}

/**
 * 가이드의 AI 피드백 조회 (저장된 피드백)
 * GET /portfolio-guide/{guideId}/feedback?memberId=1
 * @param {Number} guideId - 가이드 ID
 * @param {Number} memberId - 회원 ID (선택)
 * @returns {Promise} GuideResult
 */
function getGuideFeedback(guideId, memberId) {
  const params = memberId ? { memberId } : {};
  return axios.get(`/portfolio-guide/${guideId}/feedback`, { params });
}

/**
 * 실시간 포트폴리오 코칭 API
 * POST /portfolio-guide/coaching
 * Content-Type: application/json
 * Body: {memberId, inputFieldType, userInput, currentStep, guideId, jobGroup, jobRole, careerYears}
 * @param {Object} coachingRequest - memberId, inputFieldType, userInput, currentStep, guideId, jobGroup, jobRole, careerYears
 * @returns {Promise} GuideResult
 */
function getRealtimeCoaching(coachingRequest) {
  return axios.post("/portfolio-guide/coaching", coachingRequest);
}

/**
 * ⭐ PDF 다운로드
 * GET /portfolio-guide/{guideId}/pdf?memberId=1
 * @param {Number} guideId - 가이드 ID
 * @param {Number} memberId - 회원 ID (선택)
 * @returns {Promise} Blob 데이터
 */
function downloadGuidePdf(guideId, memberId) {
  const params = memberId ? { memberId } : {};
  
  return axios.get(`/portfolio-guide/${guideId}/pdf`, {
    params,
    responseType: 'blob'  // ⚡ PDF 다운로드 필수 설정
  });
}

/**
 * ⭐ 회원별 전체 가이드 PDF 다운로드
 * GET /portfolio-guide/member/{memberId}/pdf
 * @param {Number} memberId - 회원 ID
 * @returns {Promise} Blob 데이터
 */
function downloadMemberPdf(memberId) {
  return axios.get(`/portfolio-guide/member/${memberId}/pdf`, {
    responseType: 'blob'  // ⚡ PDF 다운로드 필수 설정
  });
}

export default {
  // 표준 데이터 조회
  getAllStandards,
 
  getStandardsByJob,
  getStandardsByMember,    // ⭐ 추가
 

  // 가이드 생성 및 저장
  createGuide,
  saveGuide,

  // 가이드 조회
  getGuideById,
  getGuidesByMember,
  getGuideFeedback,

  // 코칭
  getRealtimeCoaching,

  // PDF 다운로드
  downloadGuidePdf,
  downloadMemberPdf
};
