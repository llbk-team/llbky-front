// src/utils/interviewMock.js
import { ref, onMounted } from "vue";
import router from "@/router";
import interviewApi from "@/apis/interviewApi";
import jobInsightApi from "@/apis/jobInsightApi";

function useInterviewMock(memberId) {
  // --- 상태값 ---
  memberId = Number(memberId);
  const type = ref("comprehensive");

  const companyQuery = ref("");
  const companyResults = ref([]);
  const companyLoading = ref(false);

  const selectedCompany = ref("");
  const selectedKeywords = ref([]);
  const keywordList = ref([]);

  const questions = ref([]);
  const aiQuestions = ref([]);
  const customQuestions = ref([]);

  const isAdding = ref(false);
  const newQuestion = ref("");
  const showQuestions = ref(false);
  const loading = ref(false);

  const selectedFileObject = ref(null);

  // --- 파일 선택 및 제거 ---
  const onFileSelect = (e) => {
    selectedFileObject.value = e.target.files[0];
  };

  const removeFile = () => {
    selectedFileObject.value = null;
  };

  // --- 기업 검색 (디바운스 적용) ---
  let debounceTimer = null;

  const searchCompany = async () => {
    const query = companyQuery.value.trim();

    if (!query) {
      companyResults.value = [];
      return;
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      companyLoading.value = true;

      try {
        const res = await interviewApi.searchCompany(query);
        companyResults.value = res.data;
      } catch (err) {
        console.error("기업 검색 오류:", err);
        companyResults.value = [];
      } finally {
        companyLoading.value = false;
      }
    }, 300);
  };

  const idealTalent = ref(null); // 기업 인재상 저장

  const selectCompany = async (company) => {
    selectedCompany.value = company;
    companyQuery.value = company;
    companyResults.value = [];

    try {
      // 기업 인재상 요약 API 호출
      const res = await interviewApi.idealTalent(company);
      idealTalent.value = res.data;

      console.log("기업 인재상 요약:", idealTalent.value);
    } catch (err) {
      console.error("기업 인재상 요약 오류:", err);
    }
  };


  // --- 질문 추가 ---
  const addQuestion = () => {
    if (newQuestion.value.trim()) {
      questions.value.push(newQuestion.value);
      customQuestions.value.push(newQuestion.value);
      newQuestion.value = "";
      isAdding.value = false;
    }
  };

  // --- AI 질문 생성 ---
  const generateQuestions = async () => {
    showQuestions.value = true;

    if (!selectedFileObject.value) {
      alert("면접 질문 생성을 위한 PDF 파일을 업로드해주세요.");
      showQuestions.value = false;
      return;
    }

    loading.value = true;

    try {
      const formData = new FormData();
      formData.append("memberId", memberId);
      formData.append(
        "type",
        type.value === "comprehensive" ? "종합" : "직무"
      );
      formData.append("targetCompany", selectedCompany.value);

      selectedKeywords.value.forEach((k) =>
        formData.append("keywords", k)
      );

      formData.append("documentFile", selectedFileObject.value);

      const res = await interviewApi.createAiQuestions(formData);
      questions.value = res.data.map((q) => q.aiQuestion);
      aiQuestions.value = [...questions.value];
    } catch (err) {
      console.error("AI 질문 생성 오류:", err);
    } finally {
      loading.value = false;
    }
  };

  // --- 세션 저장 ---
  const saveSession = async () => {
    try {
      const formData = new FormData();
      formData.append("memberId", memberId);
      formData.append(
        "type",
        type.value === "comprehensive" ? "종합" : "직무"
      );
      formData.append("targetCompany", selectedCompany.value);

      selectedKeywords.value.forEach((k) =>
        formData.append("keywords", k)
      );

      aiQuestions.value.forEach((q) =>
        formData.append("aiQuestions", q)
      );
      customQuestions.value.forEach((q) =>
        formData.append("customQuestions", q)
      );

      if (selectedFileObject.value) {
        formData.append("file", selectedFileObject.value);
      }

      const res = await interviewApi.saveSession(formData);
      const sessionId = res.data[0]?.sessionId;

      router.push(`/interview/progress/${sessionId}`);
    } catch (err) {
      console.error("세션 저장 오류:", err);
      router.push("/interview/progress");
    }


  };

  // 저장한 키워드 불러오기
  async function loadSavedKeywords() {
    try {
      const res = await jobInsightApi.getSavedKeywords(memberId);
      keywordList.value = res.data.map(k => k.keyword);
    } catch (e) {
      console.error("키워드 로딩 실패:", e);
    }
  }

  onMounted(() => {
    loadSavedKeywords();
  });

  return {
    // 면접 유형
    type,

    // 기업 검색
    companyQuery,
    companyResults,
    companyLoading,
    searchCompany,
    selectCompany,

    // 키워드
    selectedKeywords,
    keywordList,

    // 질문 관련
    questions,
    aiQuestions,
    customQuestions,
    isAdding,
    newQuestion,
    showQuestions,
    loading,

    // 파일 관련
    selectedFileObject,
    onFileSelect,
    removeFile,

    // 기능 함수
    addQuestion,
    generateQuestions,
    saveSession,
  };
}

export default {
  useInterviewMock,
};
