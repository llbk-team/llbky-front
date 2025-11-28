import axios from "axios";
import "./axiosConfig";

/**
 * 1) AI 예상 질문 생성
 */
function createAiQuestions(memberId, type, targetCompany, keywords, file) {
  const formData = new FormData();
  formData.append("memberId", memberId);
  formData.append("type", type);
  formData.append("targetCompany", targetCompany);

  if (keywords && keywords.length > 0) {
    keywords.forEach(k => formData.append("keywords", k));
  }

  if (file) {
    formData.append("file", file);
  }

  return axios.post("/interview/ai-questions", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * AI 생성 질문 + 사용자 질문 + 파일 → 면접 세션 저장
 */
function saveSession(memberId, type, targetCompany, keywords, aiQuestions, customQuestions, file) {
  const formData = new FormData();

  formData.append("memberId", memberId);
  formData.append("type", type);
  formData.append("targetCompany", targetCompany);

  if (keywords) {
    keywords.forEach(k => formData.append("keywords", k));
  }

  if (aiQuestions) {
    aiQuestions.forEach(q => formData.append("aiQuestions", q));
  }

  if (customQuestions) {
    customQuestions.forEach(q => formData.append("customQuestions", q));
  }

  if (file) {
    formData.append("file", file);
  }

  return axios.post("/interview/session-save", formData, {
    headers: { "Content-Type": "multipart/form-data" }
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
