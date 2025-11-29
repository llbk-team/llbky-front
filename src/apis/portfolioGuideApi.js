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
 * 특정 평가 기준 조회 (ID로)
 * @param {Number} standardId - 표준 ID
 * @returns {Promise} PortfolioStandard
 */
function getStandardById(standardId) {
  return axios.get(`/portfolio-standard/${standardId}`);
}

/**
 * 직군 + 직무로 평가 기준 조회
 * @param {String} jobGroup - 직군
 * @param {String} jobRole - 직무
 * @returns {Promise} List<PortfolioStandard>
 */
function getStandardsByJob(jobGroup, jobRole) {
  return axios.get("/portfolio-standard/by-job", {
    params: { jobGroup, jobRole }
  });
}

// 포트폴리오 가이드 코칭 API

/**
 * 가이드 단일 조회
 * @param {Number} guideId - 가이드 ID
 */
function getGuideById(guideId) {
  return axios.get(`/portfolio-guide/${guideId}`);
}

/**
 * 회원별 가이드 목록 조회
 * @param {Number} memberId - 회원 ID
 */
function getGuidesByMember(memberId) {
  return axios.get(`/portfolio-guide/member/${memberId}`);
}

/**
 * 가이드의 AI 피드백 조회 (저장된 피드백)
 * @param {Number} guideId - 가이드 ID
 * @returns {Promise} GuideResult
 */
function getGuideFeedback(guideId) {
  return axios.get(`/portfolio-guide/${guideId}/feedback`);
}

/**
 * 실시간 포트폴리오 코칭 API
 * @param {Object} coachingRequest - memberId, inputFieldType, userInput, currentStep, guideId, jobGroup, jobRole, careerYears
 * @returns {Promise} GuideResult
 */
function getRealtimeCoaching(coachingRequest) {
  return axios.post("/portfolio-guide/coaching", coachingRequest);
}

export default {
  // 표준 데이터 조회
  getAllStandards,
  getStandardById,
  getStandardsByJob,

  // 코칭
  getRealtimeCoaching,

  // 가이드 조회
  getGuideById,
  getGuidesByMember,
  getGuideFeedback
};
