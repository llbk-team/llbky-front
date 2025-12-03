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

export default {
  createRoadmap,
  saveRoadmap,
  getLearningList
};
