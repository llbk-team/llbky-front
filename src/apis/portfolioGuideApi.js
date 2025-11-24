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
  getRealtimeCoaching
};
