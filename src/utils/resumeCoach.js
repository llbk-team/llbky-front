// src/utils/resumeCoach.js
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import resumeApi from "@/apis/resume";

function useResumeCoach() {
  const route = useRoute();
  const resumeId = computed(() => route.query.id);

  // ------------------ 상태 ------------------
  const resume = ref(null);
  const report = ref(null);
  const resumeFormat = ref("default");
  const loading = ref(false);
  const error = ref("");
  const saving = ref(false);

  const isEditMode = ref(false);
  const backupEditData = ref(null);

  const editData = reactive({
    title: "",
    careers: [],
    educations: [],
    skills: [],
    activities: [],
    certificates: []
  });

  // ------------------ helpers ------------------
  const safeParse = (json, fallback) => {
    if (!json) return fallback;
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  };

  const cleanArray = (arr, keys) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) =>
      keys.some((k) => item?.[k] && String(item[k]).trim() !== "")
    );
  };

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj ?? {}));

  const normalizeSkills = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((s) =>
      typeof s === "string" ? { name: s } : { name: s?.name || "" }
    );
  };

  // ------------------ parsed data ------------------
  const rawCareers = computed(() => safeParse(resume.value?.careerInfo, []));
  const rawEducations = computed(() => safeParse(resume.value?.educationInfo, []));
  const rawSkills = computed(() => safeParse(resume.value?.skills, []));
  const rawActivities = computed(() => safeParse(resume.value?.activities, []));
  const rawCertificates = computed(() => safeParse(resume.value?.certificates, []));

  const careers = computed(() =>
    cleanArray(rawCareers.value, ["company", "position", "responsibilities"])
  );
  const educations = computed(() =>
    cleanArray(rawEducations.value, ["school", "major"])
  );
  const skillsArray = computed(() =>
    cleanArray(normalizeSkills(rawSkills.value), ["name"])
  );
  const activities = computed(() =>
    cleanArray(rawActivities.value, ["name", "organization"])
  );
  const certificates = computed(() =>
    cleanArray(rawCertificates.value, ["name", "issuer"])
  );

  const skillsText = computed(() =>
    skillsArray.value.map((s) => s.name).join(", ")
  );

  // ------------------ 섹션 토글 ------------------
  const activeSections = ref(
    new Set(["career", "education", "skills", "activities", "certificates"])
  );

  const toggleSectionVisible = (section) => {
    activeSections.value.has(section)
      ? activeSections.value.delete(section)
      : activeSections.value.add(section);
  };

  const showCareer = computed(() => activeSections.value.has("career"));
  const showEducation = computed(() => activeSections.value.has("education"));
  const showSkills = computed(() => activeSections.value.has("skills"));
  const showActivities = computed(() => activeSections.value.has("activities"));
  const showCertificates = computed(() => activeSections.value.has("certificates"));

  // ------------------ 형식 라벨 ------------------
  const formatLabel = computed(() => {
    const map = {
      default: "기본 형식",
      text: "줄글 형식",
      standard: "표준 양식"
    };
    return map[resumeFormat.value] || "";
  });

  // ------------------ 데이터 로드 ------------------
  const loadData = async () => {
    if (!resumeId.value) {
      error.value = "이력서 ID가 없습니다.";
      return;
    }
    loading.value = true;

    try {
      const { data: resumeData } = await resumeApi.find(resumeId.value);
      resume.value = resumeData;

      try {
        const { data: reportData } = await resumeApi.findanalyze(resumeId.value);
        report.value = reportData;
      } catch {
        report.value = null;
      }

      initializeEditData();
    } catch {
      error.value = "이력서를 불러오는 중 오류가 발생했습니다.";
    } finally {
      loading.value = false;
    }
  };

  const initializeEditData = () => {
    editData.title = resume.value?.title || "";
    editData.careers = deepClone(rawCareers.value);
    editData.educations = deepClone(rawEducations.value);
    editData.skills = normalizeSkills(rawSkills.value);
    editData.activities = deepClone(rawActivities.value);
    editData.certificates = deepClone(rawCertificates.value);

    backupEditData.value = deepClone(editData);
  };

  // ------------------ 저장 ------------------
  const saveChanges = async () => {
    saving.value = true;

    try {
      editData.careers = cleanArray(editData.careers, ["company", "position"]);
      editData.educations = cleanArray(editData.educations, ["school", "major"]);
      editData.skills = cleanArray(editData.skills, ["name"]);
      editData.activities = cleanArray(editData.activities, ["name", "organization"]);
      editData.certificates = cleanArray(editData.certificates, ["name", "issuer"]);

      const updated = {
        resumeId: resume.value.resumeId,
        title: editData.title,
        careerInfo: JSON.stringify(editData.careers),
        educationInfo: JSON.stringify(editData.educations),
        skills: JSON.stringify(editData.skills),
        activities: JSON.stringify(editData.activities),
        certificates: JSON.stringify(editData.certificates)
      };

      await resumeApi.update(updated);
      resume.value = { ...resume.value, ...updated };

      backupEditData.value = deepClone(editData);
      isEditMode.value = false;

      alert("변경사항이 저장되었습니다!");
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      saving.value = false;
    }
  };

  const toggleEditMode = async () => {
    isEditMode.value ? await saveChanges() : initializeEditData();
    if (!isEditMode.value) isEditMode.value = true;
  };

  const cancelEdit = () => {
    if (backupEditData.value) {
      Object.assign(editData, deepClone(backupEditData.value));
    }
    isEditMode.value = false;
  };

  // ------------------ 형식 변경 ------------------
  const setFormat = (f) => {
    resumeFormat.value = f;
  };

  // ------------------ 기간 포맷 ------------------
  const formatPeriod = (s, e, cur = false) =>
    !s ? "" : cur ? `${s} ~ 현재` : `${s} ~ ${e || ""}`;

  // ------------------ AI 분석 ------------------
  const score = computed(() => report.value?.score);
  const strengths = computed(() => report.value?.strengths || []);
  const weaknesses = computed(() => report.value?.weaknesses || []);
  const coverLetterMain = computed(() => report.value?.coverLetterSuggestions?.[0]);
  const portfolioMain = computed(() => report.value?.portfolioSuggestions?.[0]);

  // ------------------ 항목 추가/삭제 ------------------
  const addCareer = () =>
    editData.careers.push({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      responsibilities: ""
    });

  const removeCareer = (idx) => editData.careers.splice(idx, 1);

  const addEducation = () =>
    editData.educations.push({
      school: "",
      major: "",
      startDate: "",
      endDate: ""
    });

  const removeEducation = (idx) => editData.educations.splice(idx, 1);

  const addSkill = () => editData.skills.push({ name: "" });
  const removeSkill = (idx) => editData.skills.splice(idx, 1);

  const addActivity = () =>
    editData.activities.push({
      name: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: ""
    });

  const removeActivity = (idx) => editData.activities.splice(idx, 1);

  const addCertificate = () =>
    editData.certificates.push({
      name: "",
      issuer: "",
      date: ""
    });

  const removeCertificate = (idx) => editData.certificates.splice(idx, 1);

  // ------------------ Mount ------------------
  onMounted(loadData);

  return {
    resume,
    report,
    resumeFormat,
    loading,
    error,
    saving,

    careers,
    educations,
    skillsArray,
    skillsText,
    activities,
    certificates,

    score,
    strengths,
    weaknesses,
    coverLetterMain,
    portfolioMain,

    formatLabel,
    toggleSectionVisible,
    showCareer,
    showEducation,
    showSkills,
    showActivities,
    showCertificates,

    isEditMode,
    editData,
    toggleEditMode,
    cancelEdit,

    formatPeriod,
    addCareer,
    removeCareer,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addActivity,
    removeActivity,
    addCertificate,
    removeCertificate,

    setFormat,
    loadData
  };
}

export default {
  useResumeCoach
};
