// 자소서 상세 페이지 컴포넌트용 js 파일
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import * as bootstrap from "bootstrap";
import coverletterApi from "@/apis/coverletterApi";

// 자소서 상세
function useCoverletterDetail() {
    const route = useRoute();

    // 자소서 내용=================================================
    const introFields = reactive({
        "지원동기": "",
        "성장경험": "",
        "직무역량": "",
        "입사 후 포부": "",
    });

    // 섹션 값 연결=================================================
    const sectionMap = {
        "지원동기": "supportMotive",
        "성장경험": "growthExperience",
        "직무역량": "jobCapability",
        "입사 후 포부": "futurePlan",
    };

    // AI 피드백===================================================
    const feedback = reactive({
        grammarScore: 0,    //문법 점수
        readabilityScore: 0,    //가독성 점수
        logicFlowScore: 0,  //논리 흐름 점수
        strength: [],    //강점
        improvement: [], //개선점
    });

    // 피드백 초기화=====================================================
    const resetFeedback = () => {
        feedback.grammarScore = 0;
        feedback.readabilityScore = 0;
        feedback.logicFlowScore = 0;

        feedback.strength = [];
        feedback.improvement = [];
    };

    // 선택된 섹션 (문체 버전용)================================================
    const selectedSection = ref("");

    // 모달 ID 고정=====================================================
    const styleModal = "styleModal"
    
    // 문체 선택 모달======================================================================
    const openStyleModal = async (section) => {
        selectedSection.value = section;
        // bootstrap modal
        const modal = new bootstrap.Modal(document.getElementById(styleModal));
        modal.show();
        await loadWritingStyles(section);
    };

    // 문체 버전 생성========================================================================
    const versions = ref([]);

    const loadWritingStyles = async (section) => {
        try {
            // url에 있는 id값을 숫자로 변환
            const coverletterId = parseInt(route.query.id);
            const mapped = sectionMap[section];

            // api 호출
            const res = await coverletterApi.getWritingStyles(coverletterId, mapped);
            versions.value = [
                { id: 1, name: "간결한 버전", text: res.data.simpleVersion },
                { id: 2, name: "사례 중심 버전", text: res.data.caseVersion },
                { id: 3, name: "비전 제시형 버전", text: res.data.visionVersion },
            ];

        } catch (err) {
            console.log("문체 버전을 불러올 수 없습니다.", err);
        }
    };

    // 문체 적용=======================================================
    const applyVersion = async (newContent) => {
        introFields[selectedSection.value] = newContent;

        try {
            const coverletterId = parseInt(route.query.id);
            const memberId = 1;

            // api 호출
            await coverletterApi.applyWritingStyles(
                coverletterId,
                memberId,
                sectionMap[selectedSection.value],
                newContent
            );

            console.log("DB 업데이트 완료");
        } catch (err) {
            console.log("문체 버전 적용 실패: ", err);
        }
    };

    // 자소서 불러오기==================================================
    const memberName = ref("");

    const loadCoverLetter = async () => {
        // url에 있는 id값을 숫자로 변환
        const coverletterId = parseInt(route.query.id);
        if (!coverletterId) return;

        try {
            // api 호출
            const res = await coverletterApi.getCoverLetterDetail(coverletterId);
            const data = res.data;

            // 본문 주입
            introFields["지원동기"] = data.supportMotive || "";
            introFields["성장경험"] = data.growthExperience || "";
            introFields["직무역량"] = data.jobCapability || "";
            introFields["입사 후 포부"] = data.futurePlan || "";

            // 작성자 이름
            memberName.value = data.memberName || "사용자";
            
            // 문자열(JSON string)이라 파싱 필요함
            let parsed = data.coverFeedback;

            // 만약 문자열이면 JSON 파싱
            if (typeof parsed === "string") {
                try {
                    parsed = JSON.parse(parsed);
                } catch (e) {
                    console.error("피드백 JSON 파싱 실패:", e);
                }
            }

            // 최종 피드백 주입
            if (parsed) {
                feedback.grammarScore = parsed.grammarScore ?? 0;
                feedback.readabilityScore = parsed.readabilityScore ?? 0;
                feedback.logicFlowScore = parsed.logicFlowScore ?? 0;
                feedback.strength = parsed.strength ?? [];
                feedback.improvement = parsed.improvement ?? [];
            }

        } catch (err) {
            console.log("자소서 불러오기 실패: ", err);
        }

        
    };

    // 수정 모드 on/off===================================================
    const isEditMode = ref(false);

    const editMode = () => {
        isEditMode.value = true;
    };

    const saveAllEdit = async () => {
        isEditMode.value = false;

        try {
            const coverletterId = parseInt(route.query.id);
            const memberId = 1;

            const payload = {
                memberId: 1,
                coverletterId: coverletterId,
                supportMotive: introFields["지원동기"],
                growthExperience: introFields["성장경험"],
                jobCapability: introFields["직무역량"],
                futurePlan: introFields["입사 후 포부"],
            };

            // api 호출
            await coverletterApi.updateCoverLetter(memberId, payload);

            console.log("자소서 수정 완료");
        } catch (err) {
            console.log("자소서 수정 실패:", err);
        }
    };
    
    return {
        introFields,
        feedback,
        resetFeedback,
        versions,
        selectedSection,
        openStyleModal,
        applyVersion,
        loadWritingStyles,
        loadCoverLetter,
        memberName,
        styleModal,
        isEditMode,
        editMode,
        saveAllEdit
    };

}

export default {
    useCoverletterDetail
};