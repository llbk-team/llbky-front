// src/views/learning/learningRoadmap.js
import { ref, watch } from "vue";
import { useStore } from "vuex";
import learningApi from "@/apis/learningApi";

function learningRoadmap() {
  const store = useStore();

  const roadmapData = ref({ weeks: [] });
  const isRefining = ref(false);
  const aiInput = ref("");

  const showAiModal = ref(false);
  const showSaveModal = ref(false);
  const showWeekModal = ref(false);

  const selectedWeek = ref(null);
  const purposes = store.getters["learning/getPurposes"];

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

    purposes
  };
}

export default learningRoadmap;
