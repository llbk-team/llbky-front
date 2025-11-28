import axios from "axios";
import "./axiosConfig";

/**
 * 1) AI 예상 질문 생성
 */
function createAiQuestions(formData) {
  return axios.post("/interview/ai-questions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * AI 생성 질문 + 사용자 질문 + 파일 → 면접 세션 저장
 */
function saveSession(formData) {
  return axios.post("/interview/session-save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 세션 질문 조회
 */
function getSessionDetail(sessionId) {
  return axios.get(`/interview/detail/${sessionId}`);
}

export default {
  createAiQuestions,
  saveSession,
  getSessionDetail
};
