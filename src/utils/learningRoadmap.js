// src/views/learning/learningRoadmap.js
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import learningApi from "@/apis/learningApi";

function learningRoadmap() {

  const PURPOSE_LABELS = {
    "job-prep": "취업 준비",
    "job-change": "이직 준비",
    "job-switch": "커리어 전환",

    "certification": "자격증 취득",
    "basics": "기초 다지기",
    "deepen": "기술 심화",
    "self-dev": "자기계발",

    "portfolio": "포트폴리오",
    "side-project": "사이드 프로젝트",
    "study-main": "학습 루틴",
    "explore": "진로 탐색"
  };


  const store = useStore();

  const roadmapData = ref({ weeks: [] });
  const isRefining = ref(false);
  const aiInput = ref("");

  const showAiModal = ref(false);
  const showSaveModal = ref(false);
  const showWeekModal = ref(false);

  const selectedWeek = ref(null);
  const purposes = ref(store.getters["learning/getPurposes"] || []);

  const purposeLabels = computed(() =>
    purposes.value.map(p => PURPOSE_LABELS[p] || p)
  );


  // store에서 로드맵 받기
  watch(
    () => store.getters["learning/getRoadmap"],
    (newVal) => {
      if (newVal) roadmapData.value = newVal;
    },
    { immediate: true }
  );

  // 주차 상세 모달
  function openWeekModal(week) {
    selectedWeek.value = week;
    showWeekModal.value = true;
  }

  function closeWeekModal() {
    showWeekModal.value = false;
  }

  // 저장
  async function saveRoadmap() {
    try {
      const payload = {
        memberId: 1,
        title: roadmapData.value.title,
        weeks: roadmapData.value.weeks
      };

      await learningApi.saveRoadmap(payload);
      showSaveModal.value = true;
    } catch (e) {
      alert("로드맵 저장 중 오류 발생");
    }
  }

  // AI 수정 모달
  function openAiModal() { showAiModal.value = true; }
  function closeAiModal() { showAiModal.value = false; }

  function startLearning() { showSaveModal.value = false; }
  function goToMyLearning() { showSaveModal.value = false; }

  // AI 수정 요청
  async function sendRefineRequest() {
    if (!aiInput.value) return;

    try {
      isRefining.value = true;

      const payload = {
        memberId: 1,
        currentRoadmap: roadmapData.value,
        userFeedback: aiInput.value
      };

      const res = await learningApi.refineRoadmap(payload);
      roadmapData.value = res.data;

      showAiModal.value = false;

    } catch (err) {
      alert("AI 수정 중 오류 발생");
    } finally {
      isRefining.value = false;
    }
  }

  return {
    roadmapData,
    isRefining,
    aiInput,

    showAiModal,
    showSaveModal,
    showWeekModal,
    selectedWeek,

    openWeekModal,
    closeWeekModal,
    saveRoadmap,

    openAiModal,
    closeAiModal,
    startLearning,
    goToMyLearning,

    sendRefineRequest,

    purposes,
    purposeLabels
  };
}

export default learningRoadmap;
