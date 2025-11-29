import axios from "axios";
import "./axiosConfig";

// 오늘 트렌드 조회(없으면 자동 분석)
function getTodayTrend(memberId){
  return axios.get("/trend/today",{params: {memberId}});
}

const trendApi = {
  getTodayTrend
}

export default trendApi;