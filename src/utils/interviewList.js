// 면접 목록 페이지 컴포넌트용 js 파일

import router from "@/router";
import { ref, computed, onMounted } from "vue";
import interviewApi from "@/apis/interviewApi";

function useInterviewList(memberId) {

    /*-------------------------------------
        상태 정의
    -------------------------------------*/
    const tab = ref("question");
    const showAllJob = ref(false);
    const showAllGeneral = ref(false);
    const showModal = ref(false);
    const selectedQuestion = ref(null);
    
    const jobQuestions = ref([]);   // 직무 질문
    const generalQuestions = ref([]);   // 종합 질문
    const histories = ref([]);    // 면접 이력
    
    
    /*-------------------------------------
        1) 면접 이력 불러오기
    -------------------------------------*/
    onMounted(async () => {
        await loadHistories();
        await loadQuestions(memberId);
    });
    
    async function loadHistories() {
        const res = await interviewApi.getInterviewList(memberId);
        const list = [];

        for (const s of res.data) {

            const date = s.createdAt ? s.createdAt.slice(0, 10) : "";

            const detailRes = await interviewApi.getInterviewDetail(s.sessionId);
            const qaList = detailRes.data.qaList || [];

            const perScores = qaList.map(q => {
                const lang = q.answerFeedback?.languageScore ?? 0;
                const non = q.answerFeedback?.nonLanguageScore ?? 0;

                if (q.answerFeedback?.toneExpressionAnalysis?.includes("영상 정보가 없어")) {
                    return lang;
                }
                return Math.round((lang + non) / 2);
            });

            let total = 0;
            if (perScores.length > 0) {
                total = Math.round(perScores.reduce((a, b) => a + b, 0) / perScores.length);
            }

            list.push({
                sessionId: s.sessionId,
                date,
                scoreSummary: total > 0 ? `종합 점수 ${total}점` : "점수 없음",
                feedback: detailRes.data.finalFeedback?.overallSummary || "피드백 없음",
                progress: total
            });
        }

        histories.value = list;
    }
    
    /*-------------------------------------
    2) 사용자 질문 목록 불러오기
    -------------------------------------*/
    async function loadQuestions(memberId) {

        // 질문 + 세션 병렬 요청
        const [questionsRes, sessionsRes] = await Promise.all([
            interviewApi.getAllQuestions(memberId),
            interviewApi.getInterviewList(memberId)
        ]);

        // 세션 맵 생성 (sessionId → type)
        const sessionMap = new Map();
        sessionsRes.data.forEach(s => {
            sessionMap.set(s.sessionId, s.interviewType);
        });

        // 2. 질문 데이터 분류
        const job = [];
        const general = [];

        questionsRes.data.forEach(q => {
            const type = sessionMap.get(q.sessionId);

            if (type === "직무") {
                job.push({
                    questionId: q.questionId,
                    text: q.questionText,
                    sessionId: q.sessionId
                });
            } else if (type === "종합") {
                general.push({
                    questionId: q.questionId,
                    text: q.questionText,
                    sessionId: q.sessionId
                });
            }
        });

        jobQuestions.value = job;
        generalQuestions.value = general;
    }

    
    /*-------------------------------------
        3) 전체보기 / 접기
    -------------------------------------*/ 
    const displayedJobQuestions = computed(() =>
        showAllJob.value ? jobQuestions.value : jobQuestions.value.slice(0, 5)
    );

    const displayedGeneralQuestions = computed(() =>
        showAllGeneral.value
            ? generalQuestions.value
            : generalQuestions.value.slice(0, 5)
    );


    /*-------------------------------------
        4) 답변 보기 모달
    -------------------------------------*/
    const openAnswerModal = async (question) => {

        // 답변 조회
        const res = await interviewApi.getAnswerByQuestionId(question.questionId);
        const answer = res.data;

        selectedQuestion.value = {
            text: question.text,
            type: answer?.videoFileData ? "video" : "audio",
            answerUrl: makeMediaUrl(answer),
            sessionId: question.sessionId
        };

        showModal.value = true;
    };

    function makeMediaUrl(answer) {
        if (!answer) return null;

        if (answer.audioFileData) {
            return `data:${answer.audioFileType};base64,${answer.audioFileData}`;
        }
        
        if (answer.videoFileData) {
            return `data:${answer.videoFileType};base64,${answer.videoFileData}`;
        }

        return null;
    }

    /*-------------------------------------
        5) 리포트 이동
    -------------------------------------*/
    const goToReport = (item) => {
        showModal.value = false;
        
        if (!item || !item.sessionId) return;

        router.push(`/interview/report/detail?sessionId=${item.sessionId}`);
    };


    return {
        tab,
        jobQuestions,
        generalQuestions,
        displayedJobQuestions,
        displayedGeneralQuestions,
        showAllJob,
        showAllGeneral,
        showModal,
        selectedQuestion,
        histories,
        openAnswerModal,
        goToReport
    };
}

export default { useInterviewList };