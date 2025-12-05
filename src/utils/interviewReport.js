// 면접 리포트 상세보기 페이지 컴포넌트용 js 파일

import { ref, computed , onMounted} from "vue";
import interviewApi from "@/apis/interviewApi";

function useInterviewReport(rawSessionId, memberId) {

    /*-------------------------------------
        상태 정의
    -------------------------------------*/

    const sessionId = Number(rawSessionId);
    const loading = ref(true);
    const error = ref(null);
    
    const sessionInfo = ref(null);  // 면접 정보
    const qaList = ref([]);  // 질문 + 답변 목록
    const finalFeedback = ref(null);    // 종합 피드백

    const languageScore = computed(() => finalFeedback.value?.languageScore || 0);  // 언어점수
    const nonLanguageScore = computed(() => finalFeedback.value?.nonLanguageScore || 0);    //비언어점수
    const totalScore = computed(() => {
        if (!qaList.value.length) return 0;

        let scores = qaList.value.map(q => {
            const lang = q.answerFeedback?.languageScore ?? 0;
            const non = q.answerFeedback?.nonLanguageScore ?? 0;

            // 영상 없음 → 언어 점수만 종합 점수로 반영
            if (q.answerFeedback?.toneExpressionAnalysis?.includes("영상 정보가 없어")) {
                return lang;
            }

            return Math.round((lang + non) / 2);
        });

        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return Math.round(avg);
    });

    const singleLanguageScore = computed(() => {
        return selectedQuestion.value?.answerFeedback?.languageScore ?? 0;
    });

    const singleNonLanguageScore = computed(() => {
        return selectedQuestion.value?.answerFeedback?.nonLanguageScore ?? 0;
    });

    const singleTotalScore = computed(() => {
        const lang = selectedQuestion.value?.answerFeedback?.languageScore ?? 0;
        const non = selectedQuestion.value?.answerFeedback?.nonLanguageScore ?? 0;

        // 비언어 분석 없음 → 언어 점수 그대로 사용
        if (selectedQuestion.value?.answerFeedback?.toneExpressionAnalysis?.includes("영상 정보가 없어")) {
            return lang;
        }

        return Math.round((lang + non) / 2);
    });

    
    const selectedQuestion = ref(null); // 선택된 질문
    const mode = ref("all");    // all / single 모드
    
    const audioRef = ref(null);
    const isPlaying = ref(false);
    
    const jobRole = ref("");    // 희망 직무

    
    /*-------------------------------------
        오디오 재생 토글
    -------------------------------------*/
    const togglePlay = () => {
        if (!audioRef.value) return;
        
        if (isPlaying.value) {
            audioRef.value.pause();
        } else {
            audioRef.value.play();
        }
    };
    
    /*---------------------------------------
        브라우저에서 재생 가능한 url 형태로 변환
    ---------------------------------------*/
    function makeAudioUrl(q) {
        if (!q || !q.audioFileData) return "";
        
        const type = q.audioFileType ? q.audioFileType : "audio/mp3";
        
        return "data:" + type + ";base64," + q.audioFileData;
    }

    function makeVideoUrl(q) {
        if (!q || !q.videoFileData) return "";

        const type = q.videoFileType ? q.videoFileType : "video/mp4";
        return "data:" + type + ";base64," + q.videoFileData;
    }
    
    /*-------------------------------------
        질문 선택
    -------------------------------------*/
    const selectQuestion = (q) => {
        selectedQuestion.value = q;
        mode.value = "single";
    };

    /*-------------------------------------
        리포트 데이터 불러오기
    -------------------------------------*/
    const loadReport = async () => {
        try {
            const res = await interviewApi.getInterviewDetail(sessionId);

            // 1) 면접 정보
            sessionInfo.value = res.data.sessionInfo;

            // 2) 질문 + 답변 + 파일 + 개별 피드백
            qaList.value = res.data.qaList.map(item => {
                // 개별 피드백 JSON 파싱
                let feedbackObj = {};

                if (item.answerFeedback) {
                    feedbackObj = item.answerFeedback;
                }

                return {
                    questionId: item.questionId,
                    answerId: item.answerId,
                    questionText: item.questionText,
                    answerText: item.answerText,

                    answerFeedback: feedbackObj,

                    audioUrl: item.audioFileData
                        ? "data:" + item.audioFileType + ";base64," + item.audioFileData
                        : null,

                    videoUrl: item.videoFileData
                        ? "data:" + item.videoFileType + ";base64," + item.videoFileData
                        : null
                };
            });

            // 3) 최종 피드백(JSON 문자열 -> 객체)
            if (res.data.finalFeedback) {
                try {
                    finalFeedback.value = res.data.finalFeedback;

                } catch (err) {
                    finalFeedback.value = {};
                }
            }

        } catch (e) {
            error.value = "리포트 데이터를 불러오는 중 오류 발생";

        } finally {
            loading.value = false;
        }
    };

    onMounted(async () => {
        await loadReport();
    });
    
    /*-------------------------------------
        피드백 카드 필터링
    -------------------------------------*/
    const filteredFeedback = computed(() => {
        // 싱글 모드일 때
        if (mode.value === "single" && selectedQuestion.value !== null) {

            const detail = selectedQuestion.value.answerFeedback || {};

            return [
                { title: "🧾 종합 요약", content: detail.overallSummary || "없음" },
                { title: "💡 AI 추천 핵심 코칭 포인트", content: detail.keyCoachingPoint || "없음" },
                { title: "🗣️ 발음 / 말투", content: detail.speechAnalysis || "없음" },
                { title: "🕒 시간 및 구성", content: detail.toneExpressionAnalysis || "없음" },
                { title: "📄 내용 분석", content: detail.timeStructureAnalysis || "없음" },
                { title: "😊 톤 & 표정 분석", content: detail.contentAnalysis || "없음" },
            ];
        }

        if (!finalFeedback.value) return [];

        return [
            { title: "🧾 종합 요약", content: finalFeedback.value.overallSummary },
            { title: "💡 AI 추천 핵심 코칭 포인트", content: finalFeedback.value.keyCoachingPoint },
            { title: "🗣️ 발음 / 말투", content: finalFeedback.value.speechAnalysis },
            { title: "🕒 시간 및 구성", content: finalFeedback.value.toneExpressionAnalysis },
            { title: "📄 내용 분석", content: finalFeedback.value.timeStructureAnalysis },
            { title: "😊 톤 & 표정 분석", content: finalFeedback.value.contentAnalysis },
        ];
    });
        

    return {
        loading,
        languageScore,
        nonLanguageScore,
        totalScore,
        singleLanguageScore,
        singleNonLanguageScore,
        singleTotalScore,
        error,
        sessionInfo,
        qaList,
        finalFeedback,
        jobRole,

        makeAudioUrl,
        makeVideoUrl,

        selectedQuestion,
        selectQuestion,
        mode,
        filteredFeedback,

        audioRef,
        isPlaying,
        togglePlay
    };
}

export default { useInterviewReport };