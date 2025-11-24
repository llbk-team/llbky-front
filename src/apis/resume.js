import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

// 이력서 생성
function create(resume){
  return axios.post("/resume/create", resume);
}

// 이력서 상세 조회
function find(resumeId){
  return axios.get(`/resume/${resumeId}`);
}

// 이력서 목록 조회
function list (memberId = 1){
  return axios.get(`/resume/list/${memberId}`);
}

// 이력서 삭제
function remove(resumeId){
  return axios.delete(`/resume/delete/${resumeId}`);
}

// AI 분석
function analyze(memberId, resumeId){
  return axios.post("/resume/analyze", null, {params: {memberId, resumeId}});
}

// 실시간 코칭
function coach(data){
  return axios.post("/resume/coach", data);
}

const resumeApi = {
  create,
  find,
  list,
  remove,
  analyze,
  coach
}

export default resumeApi;