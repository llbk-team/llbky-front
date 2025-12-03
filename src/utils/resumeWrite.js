// 이력서 작성 페이지 전용 JS 파일
import jobInsightApi from "@/apis/jobInsightApi";
import resumeApi from "@/apis/resumeApi";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

function useResumeWrite() {
    const router = useRouter();

    /* 🔥 섹션 오픈 상태 */
    const sections = reactive({
        basic: true,
        education: false,
        career: false,
        skills: false,
        activities: false,
        certificates: false,
    });
    
    // 저장된 키워드
    const savedKeywords = ref([]);
    const selectedKeywords = ref([]);

    /* 🔥 AI 관련 */
    const aiFeedback = ref([]);
    const aiLoading = ref(false);
    const saveLoading = ref(false);

    /* 🔥 이력서 데이터 */
    const resumeData = reactive({
        title: "",
        name: "",
        phone: "",
        email: "",
        educations: [{ school: "", major: "", startDate: "", endDate: "" }],
        careers: [
            {
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                responsibilities: "",
                isCurrent: false,
            },
        ],
        skills: [{ name: "" }],
        activities: [
            {
                name: "",
                organization: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ],
        certificates: [{ name: "", date: "", issuer: "" }],
    });

    /* 🔥 섹션 토글 */
    const toggleSection = (key) => {
        sections[key] = !sections[key];
    };

    /* 🔥 입력 변경 */
    const onInputChange = (field, value) => {
        resumeData[field] = value;
    };

    const onCareerInputChange = (idx, field, value) => {
        resumeData.careers[idx][field] = value;
    };

    const onCareerCurrentChange = (idx) => {
        if (resumeData.careers[idx].isCurrent) {
            resumeData.careers[idx].endDate = "";
        }
    };

    /* 🔥 추가/삭제 (공통) */
    const addEducation = () =>
        resumeData.educations.push({
            school: "",
            major: "",
            startDate: "",
            endDate: "",
        });

    const removeEducation = (i) => {
        if (resumeData.educations.length > 1)
            resumeData.educations.splice(i, 1);
    };

    const addCareer = () =>
        resumeData.careers.push({
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            responsibilities: "",
            isCurrent: false,
        });

    const removeCareer = (i) => {
        if (resumeData.careers.length > 1) resumeData.careers.splice(i, 1);
    };

    const addActivity = () =>
        resumeData.activities.push({
            name: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "",
        });

    const removeActivity = (i) => {
        if (resumeData.activities.length > 1)
            resumeData.activities.splice(i, 1);
    };

    const addSkill = () => resumeData.skills.push({ name: "" });

    const removeSkill = (i) => {
        if (resumeData.skills.length > 1) resumeData.skills.splice(i, 1);
    };

    const addCertificate = () =>
        resumeData.certificates.push({
            name: "",
            date: "",
            issuer: "",
        });

    const removeCertificate = (i) => {
        if (resumeData.certificates.length > 1)
            resumeData.certificates.splice(i, 1);
    };

    /* 🔥 섹션 라벨 */
    const getSectionLabel = (section) => {
        return (
            {
                career: "경력",
                activity: "활동",
                education: "교육",
                skill: "스킬",
            }[section] || "기타"
        );
    };

    /* 🔥 AI 피드백 요청 */
    const getSectionFeedback = async (section, index) => {
        try {
            let content =
                section === "career"
                    ? resumeData.careers[index].responsibilities
                    : section === "activity"
                    ? resumeData.activities[index].description
                    : "";

            if (!content.trim()) {
                alert("내용을 입력해야 AI 피드백을 받을 수 있습니다.");
                return;
            }

            aiLoading.value = true;

            const payload = {
                memberId: 1,
                section,
                content,
                keywords: selectedKeywords?.value || [] // 키워드 추가
            };

            const { data } = await resumeApi.coach(payload);

            aiFeedback.value.unshift({
                section,
                index,
                summary: data.summary,
                strengths: data.strengths,
                improvements: data.improvements,
                improvedText: data.improvedText,
                timestamp: Date.now(),
            });
        } catch (err) {
            console.error("AI 피드백 오류:", err);
            alert("AI 피드백 요청 실패");
        } finally {
            aiLoading.value = false;
        }
    };

    // 키워드 불러오기 함수
    const loadSavedKeywords = async () => {
    try {
        const res = await jobInsightApi.getSavedKeywords(1);
        savedKeywords.value = res.data.map(k => k.keyword);
    } catch (e) {
        console.error("키워드 로딩 실패:", e);
    }
};

    /* 🔥 개선문 적용 */
    const applyImprovedToResume = (item) => {
        if (item.section === "career") {
            resumeData.careers[item.index].responsibilities = item.improvedText;
        }
        if (item.section === "activity") {
            resumeData.activities[item.index].description = item.improvedText;
        }
        alert("AI 수정본을 적용했습니다!");
    };

    /* 🔥 저장 */
    const submitResume = async () => {
        try {
            saveLoading.value = true;

            const payload = {
                memberId: 1,
                title: resumeData.title,
                careerInfo: JSON.stringify(resumeData.careers),
                educationInfo: JSON.stringify(resumeData.educations),
                skills: JSON.stringify(resumeData.skills),
                certificates: JSON.stringify(resumeData.certificates),
                activities: JSON.stringify(resumeData.activities),
            };

            const { data: resumeId } = await resumeApi.create(payload);
            router.push(`/resume/coach?id=${resumeId}`);
        } catch (err) {
            console.error("이력서 저장 실패:", err);
            alert("저장 실패");
        } finally {
            saveLoading.value = false;
        }
    };

    onMounted(() => {
        loadSavedKeywords();
    })

    return {
        // 데이터
        sections,
        aiFeedback,
        aiLoading,
        saveLoading,
        resumeData,
        savedKeywords,
        selectedKeywords,
        loadSavedKeywords,

        // 입력/토글/추가삭제
        toggleSection,
        onInputChange,
        onCareerInputChange,
        onCareerCurrentChange,

        addEducation,
        removeEducation,
        addCareer,
        removeCareer,
        addActivity,
        removeActivity,
        addSkill,
        removeSkill,
        addCertificate,
        removeCertificate,

        // AI
        getSectionLabel,
        getSectionFeedback,
        applyImprovedToResume,

        // 저장
        submitResume,
    };
}

export default {
    useResumeWrite,
};
