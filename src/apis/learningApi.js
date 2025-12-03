import axios from "axios";
import "./axiosConfig";

// 학습 관련 api

/**
 * AI 학습 로드맵 생성
 */
function createRoadmap(formData) {
  return axios.post("/learning/roadmap-create", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

/**
 * AI 학습 로드맵 저장
 */
function saveRoadmap(roadmap) {
  return axios.post("/learning/roadmap-save", roadmap);
}

/**
 * 학습 리스트 조회
 */
function getLearningList(memberId, status) {
  return axios.get("/learning/list", {
    params: { memberId, status }
  });
}

/**
 * 일일 학습 조회 (주차별)
 */
function getLearningDayByWeek(weekId) {
  return axios.get("/learning/day-by-week", {
    params: { weekId }
  });
}

/**
 * 일일 학습 조회 (일차별)
 */
function getLearningDayByDayId(dayId) {
  return axios.get("/learning/day-by-day", {
    params: { dayId }
  });
}

/**
 * AI 일일 학습 정리 제출
 */
function submitLearningDaySummary(dayId, learningDaySummary) {
  return axios.post("/learning/submit-day-summary", null, {
    params: { dayId, learningDaySummary }
  });
}


export default {
  createRoadmap,
  saveRoadmap,
  getLearningList,
  getLearningDayByWeek,
  getLearningDayByDayId,
  submitLearningDaySummary
};
