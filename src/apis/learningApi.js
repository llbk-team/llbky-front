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
  submitLearningDaySummary
};
