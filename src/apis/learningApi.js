import axios from "axios";
import "./axiosConfig";

// 학습 관련 api

/**
 * AI 학습 로드맵 생성
 */
function createRoadmap(formData) {
  return axios.post("/learning/roadmap/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

/**
 * AI 학습 로드맵 저장
 */
function saveRoadmap(roadmap) {
  return axios.post("/learning/roadmap/save", roadmap);
}

export default {
  createRoadmap,
  saveRoadmap
};
