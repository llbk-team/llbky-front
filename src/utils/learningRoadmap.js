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
        memberId: 1, // 멤버 Id 수정해주세요~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        title: roadmapData.value.title,
        weeks: roadmapData.value.weeks
      };

      const res = await learningApi.saveRoadmap(payload);
      // 저장이 끝난 뒤, 백엔드에서 최신 로드맵 다시 조회
      const full = await learningApi.getLearningDetail(res.data.learningId);
      store.dispatch("learning/saveRoadmap", full.data);
      roadmapData.value = full.data;
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
      originalRoadmapJson: JSON.stringify(roadmapData.value),
      userFeedback: aiInput.value,

      // 생성 시 사용했던 정보들 (store에서 가져옴)
      jobRole: store.getters["learning/getJobRole"],
      purposes: store.getters["learning/getPurposes"],
      skills: store.getters["learning/getSkills"],
      studyHours: store.getters["learning/getStudyHours"]
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
