// utils/learningGoal.js

import { ref, onMounted, computed } from "vue";
import learningApi from "@/apis/learningApi";
import jobInsightApi from "@/apis/jobInsightApi";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

function useLearningGoal() {
  const router = useRouter();
  const store = useStore();

  // 기본 상태
  const isLoading = ref(false);
  const keywordList = ref([]);          
  const newInterestSkill = ref("");
  const recommendedSkills = ref([]);

  // 로그인 정보
  const userInfo = computed(() => store.getters["user/userInfo"] || {});
  const memberId = computed(() => userInfo.value?.memberId ?? null);
  const myJobRole = computed(() => userInfo.value?.jobRole || "직무 정보 없음");

  // 폼 데이터
  const formData = ref({
    careerGoals: [],
    learningGoals: [],
    projectGoals: [],
    studyHours: 3,
    lackingSkills: [],
    interestedSkills: []
  });

  // 학습 목적 목록
  const goalSections = [
    {
      title: "커리어",
      model: "careerGoals",
      items: [
        { id: "career-prep", label: "취업 준비", value: "job-prep" },
        { id: "career-change", label: "이직 준비", value: "job-change" },
        { id: "career-switch", label: "커리어 전환", value: "job-switch" }
      ]
    },
    {
      title: "학습",
      model: "learningGoals",
      items: [
        { id: "learn-cert", label: "자격증 취득", value: "certification" },
        { id: "learn-basics", label: "기초 다지기", value: "basics" },
        { id: "learn-deepen", label: "기술 심화", value: "deepen" },
        { id: "learn-develop", label: "자기계발", value: "self-dev" }
      ]
    },
    {
      title: "프로젝트",
      model: "projectGoals",
      items: [
        { id: "proj-portfolio", label: "포트폴리오", value: "portfolio" },
        { id: "proj-side", label: "사이드 프로젝트", value: "side-project" },
        { id: "proj-study", label: "학습 루틴", value: "study-main" },
        { id: "proj-explore", label: "진로 탐색", value: "explore" }
      ]
    }
  ];

  // 부족 역량 로드
  async function loadRecommendedSkills() {
    try {
      const { data } = await learningApi.recommendSkills(memberId.value);

      recommendedSkills.value = Array.isArray(data?.skills)
        ? data.skills.filter(v => typeof v === "string" && v.trim() !== "")
        : [];
    } catch (err) {
      console.error("추천 기술 로딩 실패:", err);
      recommendedSkills.value = [];
    }
  }

  // 관심 키워드 로드
  async function loadSavedKeywords() {
    try {
      const { data } = await jobInsightApi.getSavedKeywords(memberId.value);

      keywordList.value = Array.isArray(data)
        ? data
            .map(k => k?.keyword)
            .filter(v => typeof v === "string" && v.trim() !== "")
        : [];
    } catch (err) {
      console.error("키워드 로딩 실패:", err);
      keywordList.value = [];
    }
  }

  // 관심 기술 추가
  function addInterestSkill() {
    const kw = newInterestSkill.value.trim();
    if (!kw) return;

    if (keywordList.value.includes(kw)) {
      alert("이미 존재하는 키워드입니다.");
      return;
    }

    keywordList.value.push(kw);
    newInterestSkill.value = "";
  }

  // 공부 가능 시간 조절
  function increaseHour() {
    if (formData.value.studyHours < 15) formData.value.studyHours++;
  }
  function decreaseHour() {
    if (formData.value.studyHours > 1) formData.value.studyHours--;
  }

  // 로드맵 생성
  async function generateRoadmap() {
    const purposes = [
      ...formData.value.careerGoals,
      ...formData.value.learningGoals,
      ...formData.value.projectGoals
    ];

    store.dispatch("learning/savePurposes", purposes);

    if (purposes.length === 0) {
      alert("학습 목적을 1개 이상 선택해주세요.");
      return;
    }

    isLoading.value = true;

    const fd = new FormData();
    fd.append("memberId", memberId.value);
    fd.append("studyHours", formData.value.studyHours);

    purposes.forEach(p => fd.append("purposes", p));

    const skills = [
      ...formData.value.lackingSkills,
      ...formData.value.interestedSkills
    ];
    skills.forEach(s => fd.append("skills", s));

    try {
      const res = await learningApi.createRoadmap(fd);
      store.dispatch("learning/saveRoadmap", res.data);
      router.push("/learning/roadmap");
    } catch (err) {
      alert("로드맵 생성 중 오류 발생");
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    loadRecommendedSkills();
    loadSavedKeywords();
  });

  return {
    isLoading,
    keywordList,
    newInterestSkill,
    recommendedSkills,
    formData,
    goalSections,
    myJobRole,

    addInterestSkill,
    increaseHour,
    decreaseHour,
    generateRoadmap
  };
}

export default useLearningGoal;
