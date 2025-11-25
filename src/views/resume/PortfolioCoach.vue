<template>
  <div class="resume-coach-page d-flex">
    <div class="coach-container flex-fill d-flex flex-column">
      <div class="content-wrapper">
        <div class="content-inner">

          <!-- 상단 헤더 -->
          <div class="content-header-row">
            <div class="content-title-box">
              <h2 class="page-title">AI 포트폴리오 코칭</h2>
              <p class="page-subtitle">업로드된 포트폴리오 페이지별로 AI가 분석한 피드백을 확인하세요.</p>
            </div>

            <button class="btn btn-save" @click="saveReport">
              💾 리포트 저장하기
            </button>
          </div>

          <!-- 본문 -->
          <div class="content-main-row">

            <!-- 왼쪽: PDF 이미지 -->
            <div class="preview-section" v-show="true">


              <!-- PDF 로딩 스피너 -->
              <div v-if="loadingPdf" class="spinner-container">
                <div class="spinner"></div>
                <p class="text-muted mt-2">PDF 렌더링 중...</p>
              </div>

              <!-- PDF 이미지 뷰 -->
              <div v-else-if="images.length" class="image-viewer position-relative">
                <button class="slide-btn left" @click="prevImage" :disabled="currentIndex === 0">‹</button>

                <transition name="fade" mode="out-in">
                  <img :key="currentIndex" :src="currentImage" class="portfolio-image" />
                </transition>

                <button class="slide-btn right" @click="nextImage" :disabled="currentIndex === images.length - 1">›</button>

                <div class="page-indicator">{{ currentIndex + 1 }} / {{ images.length }}</div>
              </div>

              <!-- 썸네일 -->
              <div v-if="!loadingPdf && images.length" class="thumbnail-bar mt-3">
                <div v-for="(img, index) in images" :key="index" class="thumbnail-item" :class="{ active: currentIndex === index }" @click="goToPage(index)">
                  <img :src="img" class="thumbnail-img" />
                  <span class="thumb-label">{{ index + 1 }}</span>
                </div>
              </div>
            </div>

            <!-- 오른쪽: 분석 -->
            <div class="analysis-section" v-show="true">

              <!-- 페이지별 피드백 로딩 -->
              <div v-if="loadingPages" class="spinner-container">
                <div class="spinner"></div>
                <p class="text-muted mt-2">페이지 분석 로딩 중...</p>
              </div>

              <!-- 페이지별 피드백 -->
              <div v-else-if="pageFeedbacks.length">
                <h5 class="fw-bold mb-3">AI 페이지별 분석</h5>

                <div class="analysis-card mb-4">
                  <p class="fw-semibold mb-2">📄 페이지 {{ currentIndex + 1 }}</p>
                  <p class="small mb-2">
                    {{ pageFeedbacks[currentIndex].page_feedback.page_summary }}
                  </p>
                  <p class="text-muted small">
                    💬 {{ pageFeedbacks[currentIndex].page_feedback.page_comment }}
                  </p>
                </div>

                <!-- 🔥 전체 분석 로딩 -->
                <div v-if="loadingOverall" class="overall-feedback-box spinner-container">
                  <div class="spinner"></div>
                  <p class="text-muted mt-2">전체 분석 로딩 중...</p>
                </div>

                <!-- 전체 분석 -->
                <div v-if="!loadingOverall" class="overall-feedback-box">

                  <h6 class="fw-bold mb-3">🧠 전체 포트폴리오 분석</h6>

                  <!-- 종합 점수 -->
                  <div class="score-box mb-3">
                    <p class="fw-bold fs-4">{{ overallFeedback.final_score }}/100</p>
                    <p class="text-muted small">AI 종합 점수</p>
                  </div>

                  <!-- strengths -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.strengths?.length">
                    <h6 class="fw-bold">강점 👍</h6>
                    <ul>
                      <li v-for="(item, idx) in overallFeedback.strengths" :key="'s' + idx">
                        {{ item }}
                      </li>
                    </ul>
                  </div>

                  <!-- weaknesses -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.weaknesses?.length">
                    <h6 class="fw-bold">보완 필요점 👎</h6>
                    <ul>
                      <li v-for="(item, idx) in overallFeedback.weaknesses" :key="'w' + idx">
                        {{ item }}
                      </li>
                    </ul>
                  </div>

                  <!-- expression -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.expression">
                    <h6 class="fw-bold">표현 분석 ✏️</h6>
                    <p>{{ overallFeedback.expression }}</p>
                  </div>

                  <!-- visual_design -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.visual_design">
                    <h6 class="fw-bold">시각적 디자인 🎨</h6>
                    <p>{{ overallFeedback.visual_design }}</p>
                  </div>

                  <!-- content_quality -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.content_quality">
                    <h6 class="fw-bold">콘텐츠 품질 📄</h6>
                    <p>{{ overallFeedback.content_quality }}</p>
                  </div>

                  <!-- information_structure -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.information_structure">
                    <h6 class="fw-bold">정보 구조 🧩</h6>
                    <p>{{ overallFeedback.information_structure }}</p>
                  </div>

                  <!-- technical_composition -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.technical_composition">
                    <h6 class="fw-bold">기술 구성 ⚙️</h6>
                    <p>{{ overallFeedback.technical_composition }}</p>
                  </div>

                  <!-- overall_review -->
                  <div class="feedback-section" v-if="overallFeedback.overall_review">
                    <h6 class="fw-bold">종합 리뷰 📝</h6>
                    <p>{{ overallFeedback.overall_review }}</p>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted } from "vue";
import { usePortfolioCoach } from "@/utils/portfolioCoach";
import router from "@/router";

const route = router.currentRoute.value;
const portfolioId = route.query.id;

const {
  images,
  pageFeedbacks,
  overallFeedback,
  currentIndex,
  currentImage,

  loadingPdf,
  loadingPages,
  loadingOverall,

  loadPortfolio,
  nextImage,
  prevImage,
  goToPage,
  saveReport,
} = usePortfolioCoach(portfolioId);

onMounted(loadPortfolio);
</script>




<style scoped>
/* 전체 스피너 */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e0f7ef;
  border-top: 4px solid #00c896;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}


/* ============================================================
   전체 페이지
   ============================================================ */

.resume-coach-page {
  background: #f5f5f5;
  min-height: 100vh;
}

/* 메인 wrapper: 중앙 정렬 + 좌우 여백 */
.content-wrapper {
  flex: 1;
  padding: 40px 80px;
  max-width: 1400px;
  margin: 0 auto 40px;
}

.content-inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ============================================================
   상단 헤더 (제목 + 버튼)
   ============================================================ */

.content-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #111;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

/* 버튼 통합 규격 */
.btn-save {
  /* background: linear-gradient(135deg, #71ebbe, #a2f1d6); */
  background: #00c896;
  border-color: #009b72;
  color: #fff;
  border: none;
  /* color: #000; */
  width: auto;
  height: 37px !important;
  border-radius: 30px !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  /* 얇게 변경 */
  padding: 0 24px !important;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(113, 235, 190, 0.4);
}

/* ============================================================
   🌿 본문 2열 레이아웃
   ============================================================ */

.content-main-row {
  display: flex;
  gap: 24px;
}

/* 왼쪽 이미지 뷰어 */
.preview-section {
  width: 50%;
  background: #f7f4ff;
  border-color: #b5a1ec;
  border-radius: 16px;
  border: 2px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 24px;
  min-height: 650px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.analysis-section {
  width: 50%;
  min-height: 650px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.image-viewer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.portfolio-image {
  max-width: 90%;
  max-height: 550px;
  object-fit: contain;
  border-radius: 12px;
  background: #fafafa;
  margin: 0 auto;
}

/* 페이드 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 슬라이드 버튼 */
.slide-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #111;
  font-size: 1.6rem;
  border-radius: 50%;
  cursor: pointer;
  width: 42px;
  height: 42px;
  transition: all 0.25s ease;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.slide-btn:hover {
  background: #71ebbe;
  color: #fff;
  transform: translateY(-50%) scale(1.08);
}

.slide-btn.left {
  left: 14px;
}

.slide-btn.right {
  right: 14px;
}

.page-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #555;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 썸네일 */
.thumbnail-bar {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.thumbnail-item {
  width: 70px;
  height: 90px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
}

.thumbnail-item.active {
  border-color: #00b47b;
  box-shadow: 0 0 6px rgba(0, 180, 123, 0.5);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-label {
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  padding: 1px 6px;
  border-radius: 4px;
  color: #111;
}

/* 오른쪽 분석 */
.analysis-section {
  width: 50%;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 24px;
}

.analysis-section h5 {
  font-size: 19px !important;
  font-weight: 700 !important;
  margin-bottom: 18px;
}

/* 카드들 */
.analysis-card,
.overall-feedback-box {
  background: #f9fdfb;
  border-radius: 12px;
  border: 1px solid #e4f7ee;
  padding: 18px 20px;
}

.analysis-card p,
.overall-feedback-box p {
  font-size: 14px;
}

/* 종합 점수 박스 */
.score-box {
  text-align: center;
  background: #ffffff;
  border: 1px solid #71ebbe;
  border-radius: 12px;
  padding: 12px;
}

.feedback-section {
  background: #ffffff;
  border: 1px solid #e4f7ee;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 16px;
}

.feedback-section ul {
  padding-left: 18px;
  margin: 0;
}

.feedback-section li {
  font-size: 14px;
  margin-bottom: 4px;
}

</style>
