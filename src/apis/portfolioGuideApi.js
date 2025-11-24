import axios from "axios";
import "./axiosConfig";

// 포트폴리오 표준 데이터 관련 API

/**
 * 모든 평가 기준 조회
 */
function getAllStandards() {
  return axios.get("/api/portfolio-standard");
}

/**
 * 특정 평가 기준 조회 (ID로)
 */
function getStandardById(standardId) {
  return axios.get(`/api/portfolio-standard/${standardId}`);
}

/**
 * 직군 + 직무로 평가 기준 조회
 */
function getStandardsByJob(jobGroup, jobRole) {
  return axios.get("/api/portfolio-standard/by-job", {
    params: { jobGroup, jobRole }
  });
}

/**
 * 직군으로만 평가 기준 조회
 */
function getStandardsByJobGroup(jobGroup) {
  return axios.get("/api/portfolio-standard/by-group", {
    params: { jobGroup }
  });
}

/**
 * 평가 기준명으로 조회
 */
function getStandardByName(name) {
  return axios.get("/api/portfolio-standard/by-name", {
    params: { name }
  });
}

/**
 * 최소 가중치 이상의 평가 기준 조회
 */
function getStandardsByMinWeight(minWeight) {
  return axios.get("/api/portfolio-standard/by-weight", {
    params: { minWeight }
  });
}

/**
 * 평가 기준 총 개수 조회
 */
function getStandardsCount() {
  return axios.get("/api/portfolio-standard/count");
}

// 포트폴리오 가이드 코칭 API

/**
 * 실시간 포트폴리오 코칭 API
 * @param {Object} coachingRequest - memberId, guideId, currentStep, inputFieldType, userInput 포함
 */
function getRealtimeCoaching(coachingRequest) {
  return axios.post("/api/portfolio-guide/coaching", coachingRequest);
}

/**
 * 실시간 피드백 API (간단 버전 - 회원 정보 없이)
 * @param {Object} feedbackRequest - inputFieldType, userInput, currentStep, jobGroup, jobRole, careerYears
 */
function getRealtimeFeedback(feedbackRequest) {
  return axios.post("/api/portfolio-guide/feedback", feedbackRequest);
}

/**
 * 가이드 단일 조회
 * @param {Number} guideId - 가이드 ID
 */
function getGuideById(guideId) {
  return axios.get(`/api/portfolio-guide/${guideId}`);
}

/**
 * 회원별 가이드 목록 조회
 * @param {Number} memberId - 회원 ID
 */
function getGuidesByMember(memberId) {
  return axios.get(`/api/portfolio-guide/member/${memberId}`);
}

/**
 * 가이드의 AI 피드백 조회
 * @param {Number} guideId - 가이드 ID
 */
function getGuideFeedback(guideId) {
  return axios.get(`/api/portfolio-guide/${guideId}/feedback`);
}

/**
 * 테스트 예시 API (간단 버전 - Postman 테스트용)
 * @param {Object} testRequest - userInput, inputFieldType(선택)
 */
function getTestExample(testRequest) {
  return axios.post("/api/portfolio-guide/test-example", testRequest);
}

export default {
  // 표준 데이터 조회
  getAllStandards,
  getStandardById,
  getStandardsByJob,
  getStandardsByJobGroup,
  getStandardByName,
  getStandardsByMinWeight,
  getStandardsCount,

  // 코칭
  getRealtimeCoaching,
  getRealtimeFeedback,
  getTestExample,

  // 가이드 조회
  getGuideById,
  getGuidesByMember,
  getGuideFeedback
};
