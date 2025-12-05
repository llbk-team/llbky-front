import axios from "axios";
import "./axiosConfig";

/**
 * 회원가입
 */
function register(data) {
  return axios.post("/member/register", data);
}

/**
 * 로그인
 */
function login(data) {
  return axios.post("/member/login", data);
}

/**
 * 회원 정보 수정
 */
function updateMember(memberId, data) {
  return axios.put("/member/update", data, {
    params: { memberId }
  });
}

export default {
  register,
  login,
  updateMember,
};
