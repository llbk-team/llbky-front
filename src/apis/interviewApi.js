import axios from "axios";
import "./axiosConfig";

// 면접 관련 api

/**
 * 1) 면접 종료 후 종합 피드백 생성
 */
function createInterviewFinalFeedback(sessionId) {
  return axios.post("/interview/final-feedback", null, {
    params: { sessionId }
  });
}

/**
 * 2) 면접 목록 조회
 */
function getInterviewList(memberId) {
  return axios.get("/interview/list", {
    params: { memberId }
  });
}

/**
 * 3) 면접 상세 조회
 */
function getInterviewDetail(sessionId) {
  return axios.get("/interview/report", {
    params: { sessionId }
  });
}


/**
 * 4) AI 예상 질문 생성
 */
function createAiQuestions(formData) {
  return axios.post("/interview/ai-questions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 5) AI 생성 질문 + 사용자 질문 + 파일 → 면접 세션 저장
 */
function saveSession(formData) {
  return axios.post("/interview/session-save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 6) 기업 검색
 */
function searchCompany(query) {
  return axios.get("/interview/search", {
    params: { query }
  });
}

/**
 * 7) 기업 검색
 */
function idealTalent(companyName) {
  return axios.get(`/interview/company-ideal`, {
    params: {companyName}
  })
}

/**
 * 8) 세션 질문 조회
 */
function getSessionDetail(sessionId) {
  return axios.get(`/interview/questions`, {
    params: { sessionId }
  });
}

/**
 * 9) 사용자 질문 조회
 */
function getAllQuestions(memberId) {
  return axios.get(`/interview/all-questions`, {
    params: { memberId }
  });
}

/**
 * 10) 사용자 답변 제출 (오디오/비디오)
 */
function submitAnswer(formData) {
  
  return axios.post("/interview/submit-answer", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 11) 답변 다시 제출 (제출한 답변 수정)
 */
function reSubmitAnswer(formData) {
  
  return axios.post("/interview/re-submit-answer", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 12) 답변별 AI 피드백 생성
 */
function createFeedback(formData) {
  
  return axios.post("/interview/create-feedback", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 13) 면접 질문 기반 답변 조회
 */
function getAnswerByQuestionId(questionId) {
  return axios.get("/interview/answer-by-question", {
    params: { questionId }
  });
}

/**
 *14) 답변 단건 조회
 */
function getOneAnswer(answerId) {
  return axios.get("/interview/answer-detail", {
    params: { answerId }
  });
}


export default {
  createInterviewFinalFeedback,
  getInterviewList,
  getInterviewDetail,
  createAiQuestions,
  searchCompany,
  idealTalent,
  saveSession,
  getSessionDetail,
  getAllQuestions,
  submitAnswer,
  reSubmitAnswer,
  createFeedback,
  getAnswerByQuestionId,
  getOneAnswer
};
