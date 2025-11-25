// 포트폴리오 피드백 생성
import { ref } from "vue";
import portfolioApi from "@/apis/portfolioApi";
import { useRouter } from "vue-router";

export function usePortfolioWrite() {
  const router = useRouter();

  // 상태값
  const uploadedFile = ref(null);
  const portfolioTitle = ref("");
  const loadingUpload = ref(false);

  // 파일 input 열기
  function triggerFileInput() {
    document.getElementById("fileInput").click();
  }

  // 파일 선택
  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploadedFile.value = file;
    console.log("업로드된 PDF:", file.name);
  }

  // 업로드 + 생성 + 페이지 이동
  async function startAnalysis() {
    if (!uploadedFile.value) {
      alert("먼저 포트폴리오 파일을 업로드하세요!");
      return;
    }

    if (!portfolioTitle.value.trim()) {
      alert("포트폴리오 제목을 입력해야 합니다!");
      return;
    }

    loadingUpload.value = true;

    const formData = new FormData();
    formData.append("memberId", 1);
    formData.append("title", portfolioTitle.value);
    formData.append("pdfFile", uploadedFile.value);

    try {
      const res = await portfolioApi.createPortfolio(formData);

      const newId = res.data.portfolioId;

      if (!newId) {
        alert("포트폴리오 ID를 가져오지 못했습니다.");
        return;
      }

      router.push(`/resume/portfolio/coach?id=${newId}`);

    } catch (error) {
      console.error(error);
      alert("포트폴리오 업로드 실패!");
    } finally {
      loadingUpload.value = false;
    }
  }

  return {
    uploadedFile,
    portfolioTitle,
    loadingUpload,

    triggerFileInput,
    handleUpload,
    startAnalysis,
  };
}
