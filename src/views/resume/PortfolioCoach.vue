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
                  <p class="small mb-2">{{ pageFeedbacks[currentIndex].page_feedback.pageSummary }}</p>
                  <p class="text-muted small">💬 {{ pageFeedbacks[currentIndex].page_feedback.pageComment }}</p>
                </div>

                <!-- 전체 분석 로딩 -->
                <div v-if="loadingOverall" class="overall-feedback-box spinner-container">
                  <div class="spinner"></div>
                  <p class="text-muted mt-2">전체 분석 로딩 중...</p>
                </div>

                <!-- 전체 분석 -->
                <div v-if="!loadingOverall" class="overall-feedback-box">

                  <h6 class="fw-bold mb-3">🧠 전체 포트폴리오 분석</h6>

                  <!-- 종합 점수 -->
                  <div class="score-box mb-3">
                    <p class="fw-bold fs-4">{{ overallFeedback.finalScore }}/100</p>
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
                  <div class="feedback-section mb-3" v-if="overallFeedback.visualDesign">
                    <h6 class="fw-bold">시각적 디자인 🎨</h6>
                    <p>{{ overallFeedback.visualDesign }}</p>
                  </div>

                  <!-- content_quality -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.contentQuality">
                    <h6 class="fw-bold">콘텐츠 품질 📄</h6>
                    <p>{{ overallFeedback.contentQuality }}</p>
                  </div>

                  <!-- information_structure -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.informationStructure">
                    <h6 class="fw-bold">정보 구조 🧩</h6>
                    <p>{{ overallFeedback.informationStructure }}</p>
                  </div>

                  <!-- technical_composition -->
                  <div class="feedback-section mb-3" v-if="overallFeedback.technicalComposition">
                    <h6 class="fw-bold">기술 구성 ⚙️</h6>
                    <p>{{ overallFeedback.technicalComposition }}</p>
                  </div>

                  <!-- overall_review -->
                  <div class="feedback-section" v-if="overallFeedback.overallReview">
                    <h6 class="fw-bold">종합 리뷰 📝</h6>
                    <p>{{ overallFeedback.overallReview }}</p>
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
  goToPage
} = usePortfolioCoach(portfolioId);

onMounted(loadPortfolio);
</script>

<style scoped src="@/assets/css/portfolioCoach.css"></style>
