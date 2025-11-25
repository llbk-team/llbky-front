// src/utils/portfolioCoach.js
import { ref, computed } from "vue";
import portfolioApi from "@/apis/portfolioApi";
import { renderPdfPages } from "@/utils/pdfRenderer";
import router from "@/router";

export function usePortfolioCoach(portfolioId) {

  // 🔥 로딩 상태
  const loadingPdf = ref(true);
  const loadingPages = ref(true);
  const loadingOverall = ref(true);

  const images = ref([]);
  const pageFeedbacks = ref([]);
  const overallFeedback = ref({});
  const currentIndex = ref(0);

  const currentImage = computed(() => images.value[currentIndex.value]);

  async function loadPortfolio() {
    try {
      const id = portfolioId;

      // ----------------------
      // 1) 전체 평가 로딩
      // ----------------------
      const portfolioRes = await portfolioApi.getPortfolioDetail(id);
      if (portfolioRes.data.portfolioFeedback) {
        overallFeedback.value = JSON.parse(portfolioRes.data.portfolioFeedback);
      }
      loadingOverall.value = false;

      // ----------------------
      // 2) 페이지 피드백 로딩
      // ----------------------
      const detailRes = await portfolioApi.getPortfolioFeedback(id);
      pageFeedbacks.value = detailRes.data.map((item) => ({
        page_no: item.pageNo,
        page_feedback: JSON.parse(item.pageFeedback)
      }));
      loadingPages.value = false;

      // ----------------------
      // 3) PDF → 이미지 로딩
      // ----------------------
      const pdfRes = await portfolioApi.getPortfolioPdf(id);
      images.value = await renderPdfPages(pdfRes.data);

      loadingPdf.value = false;

    } catch (err) {
      console.error("포트폴리오 로딩 실패:", err);
      loadingPdf.value = false;
      loadingPages.value = false;
      loadingOverall.value = false;
    }
  }

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
    router.push("/resume/list");
  }

  return {
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
  };
}
