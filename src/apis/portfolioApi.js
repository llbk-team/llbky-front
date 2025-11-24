import axios from "axios";
import "./axiosConfig";

/**
 * 포트폴리오 리스트 조회
 */
function getPortfolioList(memberId) {
  return axios.get(`/portfolio/list/${memberId}`);
}

/**
 * 포트폴리오 상세 조회
 */
function getPortfolioDetail(portfolioId) {
  return axios.get(`/portfolio/${portfolioId}`);
}

/**
 * 포트폴리오 이미지(feedback) 조회
 */
function getPortfolioFeedback(portfolioId) {
  return axios.get(`/portfolio/detail/${portfolioId}`);
}

/**
 * 포트폴리오 PDF 조회
 */
function getPortfolioPdf(portfolioId) {
  return axios.get(`/portfolio/pdf/${portfolioId}`, {
    responseType: "arraybuffer"
  });
}

/**
 * 포트폴리오 생성
 */
function createPortfolio(formData) {
  return axios.post(`/portfolio/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * 포트폴리오 삭제
 */
function deletePortfolio(portfolioId) {
  return axios.delete(`/portfolio/delete/${portfolioId}`);
}

export default {
  getPortfolioList,
  getPortfolioDetail,
  getPortfolioFeedback,
  getPortfolioPdf,
  createPortfolio,
  deletePortfolio
};
