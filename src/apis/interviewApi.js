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

/**
 * 사용자 답변 제출 (오디오/비디오)
 */
function submitAnswer(questionId, audio, video, frames = []) {
  const formData = new FormData();
  formData.append("questionId", questionId);

  if (audio) {
    formData.append("audio", audio);
  } else if (video) {
    formData.append("video", video);
  }

  if (frames.length > 0) {
    frames.forEach(f => formData.append("frames", f));
  }
  return axios.post("/interview/submit-answer", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 답변 다시 제출 (제출한 답변 수정)
 */
function reSubmitAnswer(answerId, audio, video, frames = []) {
  const formData = new FormData();
  formData.append("answerId", answerId);

  if (audio) {
    formData.append("audio", audio);
  } else if (video) {
    formData.append("video", video);
  }

  if (frames.length > 0) {
    frames.forEach(f => formData.append("frames", f));
  }
  return axios.post("/interview/re-submit-answer", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 답변별 AI 피드백 생성
 */
function createFeedback(answerId, audio, videoAudio, frames = []) {
  const formData = new FormData();
  formData.append("answerId", answerId);

  if (audio) {
    formData.append("audio", audio);
  } else if (videoAudio) {
    formData.append("videoAudio", videoAudio);
  }

  if (frames.length > 0) {
    frames.forEach(f => formData.append("frames", f));
  }
  return axios.post("/interview/create-feedback", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 면접 질문 기반 답변 조회
 */
function getAnswerByQuestionId(questionId) {
  return axios.get("/interview/answers-by-questions", {
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
  saveSession,
  getSessionDetail,
  submitAnswer,
  reSubmitAnswer,
  createFeedback,
  getAnswerByQuestionId,
  getOneAnswer
};
