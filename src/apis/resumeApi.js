import axios from "axios";
import "./axiosConfig";

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

// 이력서 수정
function update(resume){
  return axios.put("/resume/update", resume);
}

// 이력서 삭제
function remove(resumeId){
  return axios.delete(`/resume/delete/${resumeId}`);
}

// AI 분석
function analyze(memberId, resumeId){
  return axios.post("/resume/analyze", null, {params: {memberId, resumeId}});
}

// AI 분석 결과 조회
function findanalyze(resumeId){
  return axios.get(`/resume/report/${resumeId}`);
}

// 실시간 코칭
function coach(data){
  return axios.post("/resume/coach", data);
}

const resumeApi = {
  create,
  find,
  list,
  update,
  remove,
  analyze,
  findanalyze,
  coach
}

export default resumeApi;