<template>
  <div class="resume-coach-page d-flex">
    <SideBar />

    <div class="coach-container flex-fill d-flex flex-column">
      <!-- 헤더 -->
      <div class="page-header">
        <h2 class="fw-bold mb-1" style="color:#111;">AI 포트폴리오 코칭</h2>
        <p class="text-muted mb-0">
          업로드된 포트폴리오 페이지별로 AI가 분석한 피드백과 전체 종합 리포트를 확인하세요.
        </p>
      </div>

      <!-- 본문 -->
      <div class="d-flex flex-fill content-wrapper">
        <!-- 왼쪽: 이미지 뷰어 -->
        <div class="preview-section d-flex flex-column align-items-center justify-content-center">
          <div class="image-viewer position-relative">
            <button class="slide-btn left" :disabled="currentIndex === 0" @click="prevImage">‹</button>

            <transition name="fade" mode="out-in">
              <img :key="currentIndex" :src="currentImage" alt="portfolio page" class="portfolio-image rounded shadow-sm" />
            </transition>

            <button class="slide-btn right" :disabled="currentIndex === images.length - 1" @click="nextImage">›</button>
            <div class="page-indicator">{{ currentIndex + 1 }} / {{ images.length }}</div>
          </div>

          <!-- 썸네일 미리보기 -->
          <div class="thumbnail-bar mt-3">
            <div v-for="(img, i) in images" :key="i" class="thumbnail-item" :class="{ active: currentIndex === i }" @click="goToPage(i)">
              <img :src="img" class="thumbnail-img" />
              <span class="thumb-label">{{ i + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- 오른쪽: AI 분석 -->
        <div class="analysis-section">
          <h5 class="fw-bold mb-3" style="color:#111;">AI 페이지별 분석 결과</h5>

          <div class="analysis-card p-4 rounded mb-4" style="background-color:#DDF3EB;">
            <p class="fw-semibold mb-2">📄 페이지 {{ pageFeedbacks[currentIndex].page }}</p>
            <p class="small mb-2" style="color:#111;">{{ pageFeedbacks[currentIndex].summary }}</p>
            <p class="text-muted small mb-0">💬 코멘트: {{ pageFeedbacks[currentIndex].comment }}</p>
          </div>

          <div class="overall-feedback-box p-4 rounded mb-4">
            <h6 class="fw-bold mb-3" style="color:#111;">🧠 전체 포트폴리오 종합 분석</h6>

            <div class="score-box mb-3">
              <p class="fw-bold fs-4 mb-1" style="color:#00b47b;">{{ overallFeedback.score }}/100</p>
              <p class="text-muted small mb-0">AI 평가 기준 종합 점수</p>
            </div>

            <div class="criteria-list mb-3">
              <p v-for="(c, i) in overallFeedback.criteria" :key="i" class="small mb-1">
                <span class="fw-semibold" style="color:#111;">• {{ c.category }}:</span>
                <span class="text-muted">{{ c.comment }}</span>
              </p>
            </div>

            <p class="small mb-2" style="color:#111;">{{ overallFeedback.summary }}</p>
            <p class="text-muted small">💬 총평: {{ overallFeedback.comment }}</p>
          </div>

          <div class="text-center mt-4">
            <button class="btn btn-save" @click="saveReport">
              💾 리포트 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SideBar from "@/components/sidebar/SideBar.vue";

import portfolio1 from "@/assets/portfolio.png";
import portfolio2 from "@/assets/portfolio2.png";
import portfolio3 from "@/assets/portfolio3.png";
import portfolio4 from "@/assets/portfolio4.png";
import portfolio5 from "@/assets/portfolio5.png";

const images = ref([portfolio1, portfolio2, portfolio3, portfolio4, portfolio5]);

const pageFeedbacks = ref([
  { page: 1, summary: "프로젝트 개요가 명확하며 서비스 목적이 잘 드러납니다.", comment: "상단 타이틀과 간격 조정 시 시각 안정감 향상." },
  { page: 2, summary: "핵심 기능과 흐름이 잘 정리되어 있습니다.", comment: "섹션별 강조색 대비를 약간 더 줘도 좋습니다." },
  { page: 3, summary: "기술 스택 및 아키텍처 구성이 명확합니다.", comment: "노드 간 여백 조정으로 가독성 개선 가능." },
  { page: 4, summary: "데이터 시각화 구성이 깔끔하고 핵심이 명확합니다.", comment: "그래프의 축 레이블을 추가하면 명료도 향상." },
  { page: 5, summary: "결론 및 향후 계획이 잘 정리되어 있습니다.", comment: "팀 역할 구분 그래픽 추가 시 완성도 향상." },
]);

const overallFeedback = ref({
  score: 93,
  criteria: [
    { category: "시각 디자인", comment: "색상 대비와 여백이 안정적입니다." },
    { category: "정보 구조", comment: "페이지 흐름이 자연스럽고 논리적입니다." },
    { category: "기술 구성", comment: "기술 스택이 목적과 잘 맞습니다." },
    { category: "콘텐츠 명료성", comment: "텍스트 구성이 명확하고 핵심이 잘 전달됩니다." },
    { category: "표현력", comment: "그래픽과 타이포그래피 조화가 좋습니다." },
  ],
  summary:
    "AI 기반 포트폴리오로서 구조와 내용의 일관성이 우수합니다. 특히 기술 섹션과 트렌드 분석 파트는 시각적으로도 완성도가 높습니다. 정보 흐름이 자연스럽고 페이지 간 연결성이 뛰어나며, 전반적으로 기획력과 표현력이 잘 드러납니다.",
  comment:
    "세부 인터랙션(hover, transition 등)을 추가하면 사용자 경험이 한층 강화될 것입니다.",
});

const currentIndex = ref(0);
const currentImage = computed(() => images.value[currentIndex.value]);

function nextImage() {
  if (currentIndex.value < images.value.length - 1) currentIndex.value++;
}
function prevImage() {
  if (currentIndex.value > 0) currentIndex.value--;
}
function goToPage(i) {
  currentIndex.value = i;
}

function saveReport() {
  alert("AI 리포트가 저장되었습니다!");
}
</script>

<style scoped>
.resume-coach-page {
  background: #f5f5f5;
  min-height: 100vh;
}

/* 헤더 */
.page-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e5e5;
  background: #ffffff;
}

/* 레이아웃 */
.content-wrapper {
  flex: 1;
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

/* 왼쪽 이미지 섹션 */
.preview-section {
  width: 50%;
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-viewer {
  position: relative;
  text-align: center;
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

/* ✨ 페이드 전환 애니메이션 */
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
  display: flex; /* 🔥 정중앙 정렬 */
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
  line-height: 1; /* 폰트 정렬 맞추기 */
}

.slide-btn:hover {
  background: #71ebbe;
  color: #fff;
  transform: translateY(-50%) scale(1.08);
}

/* 좌우 위치 */
.slide-btn.left {
  left: 14px;
}

.slide-btn.right {
  right: 14px;
}

/* 페이지 인디케이터 (🔹 하단 중앙 고정) */
.page-indicator {
  position: absolute;
  bottom: 2px; /* 이미지 아래쪽으로 이동 */
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #555;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 3;
}


/* 썸네일 미리보기 */
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
  border-radius: 4px;
  padding: 1px 6px;
  color: #111;
}

/* 오른쪽 분석 */
.analysis-section {
  width: 50%;
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.analysis-card {
  background: #ddf3eb;
}

.overall-feedback-box {
  background: #f0f8f5;
  border-left: 4px solid #71ebbe;
}

.score-box {
  text-align: center;
  background: #ffffff;
  border: 1px solid #71ebbe;
  border-radius: 12px;
  padding: 12px;
}

/* 저장 버튼 */
.btn-save {
  background: linear-gradient(135deg, #71ebbe, #a2f1d6);
  border: none;
  color: #000;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.8rem 1.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(113, 235, 190, 0.4);
}
</style>
