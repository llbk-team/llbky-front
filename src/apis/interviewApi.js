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
 * 기업 검색
 */
function searchCompany(query) {
  return axios.get("/interview/search", {
    params: { query }
  });
}

/**
 * 세션 질문 조회
 */
function getSessionDetail(sessionId) {
  return axios.get(`/interview/questions`, {
    params: { sessionId }
  });
}

/**
 * 사용자 답변 제출 (오디오/비디오)
 */
function submitAnswer(formData) {
  
  return axios.post("/interview/submit-answer", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 답변 다시 제출 (제출한 답변 수정)
 */
function reSubmitAnswer(formData) {
  
  return axios.post("/interview/re-submit-answer", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 답변별 AI 피드백 생성
 */
function createFeedback(formData) {
  
  return axios.post("/interview/create-feedback", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 면접 질문 기반 답변 조회
 */
function getAnswerByQuestionId(questionId) {
  return axios.get("/interview/answer-by-question", {
    params: { questionId }
  });
}

/**
 * 답변 단건 조회
 */
function getOneAnswer(answerId) {
  return axios.get("/interview/answer-detail", {
    params: { answerId }
  });
}


export default {
  createAiQuestions,
  searchCompany,
  saveSession,
  getSessionDetail,
  submitAnswer,
  reSubmitAnswer,
  createFeedback,
  getAnswerByQuestionId,
  getOneAnswer
};
