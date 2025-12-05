// 자소서 작성 페이지 컴포넌트용 AI 코칭 js 파일
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import coverletterApi from "@/apis/coverletterApi";

function useCoverLetterCoach(introFields, selectedKeywords) {

  const store = useStore();
  const memberId = store.getters["user/userInfo"]?.memberId;
  
  // 오른쪽 AI 패널 ON/OFF
  const showAICoaching = ref(true);
  const toggleAICoaching = () => {
    showAICoaching.value = !showAICoaching.value;
  };

  // 로딩 스피너
  const aiLoading = ref(false);

  // 항목별 피드백 박스
  const feedbackBoxes = reactive({
    supportMotive: null,
    growthExperience: null,
    jobCapability: null,
    futurePlan: null
  });

  // 항목 매핑
  const sectionMap = {
    "지원동기": "supportMotive",
    "성장경험": "growthExperience",
    "직무역량": "jobCapability",
    "입사 후 포부": "futurePlan"
  };

  // UI용 매핑
  const reverseSectionMap = {
    supportMotive: "지원동기",
    growthExperience: "성장경험",
    jobCapability: "직무역량",
    futurePlan: "입사 후 포부"
  };

  // 현재 선택된 섹션(하이라이트용 정도)
  const currentSection = ref(null);

  // 버튼 클릭 → 해당 항목 피드백 요청
  const getSectionFeedback = async (sectionKey, content) => {
    aiLoading.value = true;

      
    if (!content || !content.trim()) {
      alert("내용을 입력해야 AI 피드백을 받을 수 있습니다.");
      aiLoading.value = false;
      return;
    }

    const mapped = sectionMap[sectionKey];   // "지원동기" → "supportMotive" 이런 식
    currentSection.value = mapped;

    try {
      const { data } = await coverletterApi.coach({
        memberId: memberId,
        section: mapped,
        content: content,
        keywords: selectedKeywords?.value || [] // 키워드 추가
      });

      feedbackBoxes[mapped] = {
        summary: data.summary,
        strengths: data.strengths,
        improvements: data.improvements,
        improvedText: data.improvedText
      };

      showAICoaching.value = true;
    } catch (err) {
      console.error("자소서 코칭 요청 실패:", err);
      alert("AI 피드백을 가져오지 못했습니다.");
    } finally {
      aiLoading.value = false;
    }
  };

  // 피드백 있는 항목들만 리스트로
  const visibleFeedbackList = computed(() => {
    return Object.entries(feedbackBoxes)
      .filter(([key, box]) => box && typeof box === "object") // null, 이상한 값 방지
      .map(([key, box]) => ({ key, box }));
  });

  // 수정된 내용을 해당 항목에 바로 적용하기 (★ sectionKey 받게 수정)
  const applyImprovedText = (sectionKey) => {
    if (!sectionKey) return;

    const feedback = feedbackBoxes[sectionKey];
    if (!feedback || !feedback.improvedText) return;

    const improvedText = feedback.improvedText;

    // 한글 key 찾기: "supportMotive" → "지원동기"
    const originalKey = Object.keys(sectionMap).find(
      (k) => sectionMap[k] === sectionKey
    );
    if (!originalKey) return;

    // 실제 텍스트 적용
    introFields[originalKey] = improvedText;
  };

  return {
    currentSection,
    showAICoaching,
    toggleAICoaching,
    aiLoading,
    sectionMap,
    reverseSectionMap,
    feedbackBoxes,
    getSectionFeedback,
    visibleFeedbackList,
    applyImprovedText
  };
}

export default {
  useCoverLetterCoach
};
