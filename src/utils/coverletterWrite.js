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
    const introFields = reactive({
        "지원동기": "",
        "성장경험": "",
        "직무역량": "",
        "입사 후 포부": "",
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
    
            router.push('/resume/list');
    
        } catch (err) {
            console.log("자소서 저장 실패:", err);
        } finally {
            saveLoading.value = false;
        }
    }

    // 저장 키워드 로딩

    const loadKeywords = async () => {
        try{
            const res = await jobInsightApi.getSavedKeywords(memberId);
            savedKeywords.value = res.data.map(k => k.keyword);
        } catch(e){
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