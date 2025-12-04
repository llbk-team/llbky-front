// 직무 인사이트 페이지 전용 JS 파일

import { ref, onMounted } from "vue";
import jobInsightApi from "@/apis/jobInsightApi";

function useJobInsight(memberId) {

    /*-------------------------------------
        상태 정의
    -------------------------------------*/

    const savedKeywords = ref([]);    // DB 저장된 키워드 목록
    const savedCount = ref(0);

    const growth = ref(null);         // 성장 제안
    const jobs = ref([]);             // 연관 직무 카드
    const saveLoading = ref(false); // 스피너

    const loading = ref(true);
    const error = ref(null);


    /*-------------------------------------
        DB에서 저장된 키워드 로딩
    -------------------------------------*/
    const loadKeywordsFromDB = async () => {
        try {
            const res = await jobInsightApi.getSavedKeywords(memberId);
            savedKeywords.value = res.data;    // [{savedKeywordId, keyword, sourceLabel}]
            savedCount.value = savedKeywords.value.length;
        } catch (e) {
            console.error("saved keyword load fail", e);
        }
    };


    /*-------------------------------------
        페이지 로드시 실행
    -------------------------------------*/
    onMounted(async () => {
        await loadKeywordsFromDB();
        await loadJobInsight();
    });


    /*-------------------------------------
        🔥 직무 인사이트 불러오기
    -------------------------------------*/
    const loadJobInsight = async () => {
        try {
            saveLoading.value = true;

            const res = await jobInsightApi.getJobInsight(memberId);
            const data = res.data;

            // 성장 제안 파싱
            const analysis = JSON.parse(data.analysisJson);
            growth.value = {
                resume: analysis.resumeAdvice,
                interview: analysis.interviewAdvice,
                learning: analysis.learningAdvice,
            };

            // 직무 추천 카드 파싱
            const related = JSON.parse(data.relatedJobsJson);

            jobs.value = related.insights.map((i) => ({
                title: i.jobRole,
                summary: i.summary,
                trendSummary: i.trendSummary,
                tags: i.relatedKeywords,
            }));

        } catch (err) {
            console.error("JobInsight load failed", err);
            error.value = "직무 인사이트 불러오기 실패";
        } finally {
            loading.value = false;
            saveLoading.value = false;
        }
    };


    /*-------------------------------------
        저장 여부 확인
        (tag가 존재하면 저장됨)
    -------------------------------------*/
    const isSaved = (tag) =>
        savedKeywords.value.some((k) => k.keyword === tag);


    /*-------------------------------------
        🔥 키워드 저장 / 삭제 (DB 연동)
        tag = 저장할 키워드
        jobRole = sourceLabel 로 저장됨
    -------------------------------------*/
    const toggleKeyword = async (tag, jobRole) => {
        try {
            saveLoading.value = true;

            // 저장된 상태면 → 삭제
            if (isSaved(tag)) {
                const target = savedKeywords.value.find(k => k.keyword === tag);
                if (target) {
                    await jobInsightApi.deleteKeyword(target.savedKeywordId);
                }
            }
            // 저장 안된 상태면 → 저장
            else {
                await jobInsightApi.saveKeyword({
                    memberId,
                    keyword: tag,
                    sourceLabel: jobRole
                });
            }

            // DB 다시 로딩 → UI 갱신
            await loadKeywordsFromDB();

            // 직무 인사이트 다시 로딩 (가장 중요)
            await loadJobInsight();

        } catch (e) {
            console.error("toggle keyword error", e);
        } finally {
            saveLoading.value = false;
        }
    };


    return {
        loading,
        saveLoading,
        error,
        savedKeywords,
        savedCount,
        growth,
        jobs,

        isSaved,
        toggleKeyword,
        loadKeywordsFromDB,
    };
}

export default { useJobInsight };
