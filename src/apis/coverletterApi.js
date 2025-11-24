import axios from "axios";
import "./axiosConfig";

// 자소서 관련 API

/**
 * 자소서 작성 시 실시간 코칭 받기
 */
function coach(request) {
  return axios.post("/coverletter/realtime-coach", request);
}

/**
 * 자소서 리포트 생성
 */
function saveCoverLetter(coverLetter, memberId) {
  return axios.post(`/coverletter/save`, coverLetter, { 
    params: { memberId } 
  });
}

/**
 * 자소서 목록 조회
 */
function getCoverLetterList(memberId) {
  return axios.get("/coverletter/list", { 
    params: { memberId }
  });
}

/**
 * 자소서 상세보기
 */
function getCoverLetterDetail(coverletterId) {
  return axios.get("/coverletter/detail", {
    params: { coverletterId }
  });
}

/**
 * 문체 버전 생성
 */
function getWritingStyles(coverletterId, section) {
  return axios.get("/coverletter/detail/styles", {
    params: { coverletterId, section }
  });
}

/**
 * 문체 버전 적용
 */
function applyWritingStyles(coverletterId, memberId, section, newContent) {
  return axios.put("/coverletter/detail/styles/apply", newContent, {
    headers: { "Content-Type": "text/plain", },
    params: { coverletterId, memberId, section }
  });
}

/**
 * 자소서 수정
 */
function updateCoverLetter(memberId, coverLetter) {
  return axios.put("/coverletter/detail/update", coverLetter, {
    params: { memberId }
  });
}

/**
 * 자소서 삭제
 */
function deleteCoverLetter(memberId, coverletterId) {
  return axios.delete("/coverletter/delete", {
    params: { memberId, coverletterId }
  });
}

export default {
  coach,
  saveCoverLetter,
  getCoverLetterList,
  getCoverLetterDetail,
  getWritingStyles,
  applyWritingStyles,
  updateCoverLetter,
  deleteCoverLetter
};
