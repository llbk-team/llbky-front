// 자소서 작성 페이지 컴포넌트용 js 파일
import coverletterApi from "@/apis/coverletterApi";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import jobInsightApi from "@/apis/jobInsightApi";

// 자소서 작성
function useCoverletterWrite() {

    const store = useStore();
    const memberId = store.getters["user/userInfo"]?.memberId;

    // 제목
    const coverTitle = ref("");

    // 저장한 키워드
    const savedKeywords = ref([]);

    // 저장한 키워드 선택
    const selectedKeywords = ref([]);

    // 저장 로딩 상태
    const saveLoading = ref(false);

    // 자소서 내용
    // const introFields = reactive({
    //     "지원동기": "",
    //     "성장경험": "",
    //     "직무역량": "",
    //     "입사 후 포부": "",
    // });
    const introFields = reactive({ // 발표용 데이터
        "지원동기":
            "귀사의 서비스 개발 방향성과 성장 가능성에 깊이 공감했습니다. " +
            "사용자 중심의 기능 개선과 안정적인 시스템 구축에 관심이 많았고, " +
            "특히 백엔드 성능 최적화와 데이터 기반 의사결정을 중요하게 생각하는 점이 저와 잘 맞았습니다. " +
            "개발자로서 함께 성장하며 가치 있는 서비스를 만들고 싶어 지원하게 되었습니다.",

        "성장경험":
            "문제를 해결할 때 '왜?'라는 질문을 반복하며 근본 원인을 파악하려는 습관을 가지고 있습니다. " +
            "팀 프로젝트에서 성능 저하 문제가 발생했을 때 로그 분석을 통해 병목 지점을 찾아내고, " +
            "비동기 처리와 캐싱 전략을 적용해 응답 속도를 40% 개선한 경험이 있습니다. " +
            "이 과정에서 기술적인 해결뿐 아니라 팀과의 소통, 기록의 중요성도 배웠습니다.",

        "직무역량":
            "Java & Spring Boot 기반 백엔드 개발을 주력으로 하며 REST API 설계, JPA/Hibernate 활용, " +
            "MySQL 성능 튜닝, Docker 배포 경험을 보유하고 있습니다. " +
            "특히 문제 상황에서 로그 기반 디버깅과 원인 분석에 강점이 있으며, " +
            "CI/CD 구축과 클린 코드 원칙을 적용하는 데 익숙합니다.",

        "입사 후 포부":
            "입사 후에는 서비스 안정성과 확장성을 높이는 백엔드 개발자로 성장하고 싶습니다. " +
            "신규 기능 개발뿐 아니라 성능 개선, 장애 예방 등 전체적인 시스템 품질 향상에 기여하고자 합니다. " +
            "장기적으로는 데이터 기반 분석 역량을 키워 기술적 의사결정에도 도움을 줄 수 있는 개발자가 되겠습니다."
    });


    // 각 항목 펼침/닫힘 여부
    const sections = reactive({
        "지원동기": true,
        "성장경험": false,
        "직무역량": false,
        "입사 후 포부": false,
    });

    // 섹션 토글 (true면 false로, false면 true로)
    const toggleSection = (key) => {
        sections[key] = !sections[key];
    };

    // 자소서 저장
    const saveCoverLetter = async () => {
        try {
            saveLoading.value = true;
            const coverLetter = {
                title: coverTitle.value,
                supportMotive: introFields["지원동기"],
                growthExperience: introFields["성장경험"],
                jobCapability: introFields["직무역량"],
                futurePlan: introFields["입사 후 포부"],
                coverFeedback: null,
            }

            // api 호출
            const res = await coverletterApi.saveCoverLetter(coverLetter, memberId);
            console.log("저장 완료: ", res.data);

            const id = res.data.coverletterId;

            router.push(`/resume/coverletter/detail?id=${id}`);

        } catch (err) {
            console.log("자소서 저장 실패:", err);
        } finally {
            saveLoading.value = false;
        }
    }

    // 저장 키워드 로딩

    const loadKeywords = async () => {
        try {
            const res = await jobInsightApi.getSavedKeywords(memberId);
            savedKeywords.value = res.data.map(k => k.keyword);
        } catch (e) {
            console.error("저장 키워드 로딩 실패", e);
        }
    };

    // 페이지 로딩 시 자동 실행
    onMounted(() => {
        loadKeywords();
    });

    return {
        coverTitle,
        introFields,
        sections,
        saveLoading,
        toggleSection,
        saveCoverLetter,
        savedKeywords,
        loadKeywords,
        selectedKeywords
    };
}


export default {
    useCoverletterWrite,
};