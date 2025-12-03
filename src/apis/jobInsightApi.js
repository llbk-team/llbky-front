import axios from "axios";
import "./axiosConfig";

// 직무 인사이트 조회 및 생성
function getJobInsight(memberId){
  return axios.get("/jobInsight/today", {params: {memberId}});
}

// 키워드 저장
function savekeyword(data){
  return axios.post("/keyword/create", data);
}

// 저장한 키워드 목록 조회
function getSavedKeywords(memberId){
  return axios.get("/keyword/list", {params:{memberId}});
}

// 저장 키워드 삭제

function deleteKeyword(savedKeywordId){
  return axios.delete("/keyword/delete", {params: {savedKeywordId}});
}

const jobInsightApi = {
  getJobInsight,
  savekeyword,
  getSavedKeywords,
  deleteKeyword
}

export default jobInsightApi;