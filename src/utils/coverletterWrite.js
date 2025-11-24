// 자소서 작성 페이지 컴포넌트용 js 파일
import coverletterApi from "@/apis/coverletterApi";
import { reactive } from "vue";
import router from "@/router";

// 자소서 작성
function useCoverletterWrite() {
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
            const coverLetter = {
                supportMotive: introFields["지원동기"],
                growthExperience: introFields["성장경험"],
                jobCapability: introFields["직무역량"],
                futurePlan: introFields["입사 후 포부"],
                coverFeedback: null,
            }
    
            // 사용자 ID 지정
            const memberId = 1;
    
            // api 호출
            const res = await coverletterApi.saveCoverLetter(coverLetter, memberId);
            console.log("저장 완료: ", res.data);
    
            router.push('/resume/list');
    
        } catch (err) {
            console.log("자소서 저장 실패:", err);
        }
    }

    return { introFields, sections, toggleSection, saveCoverLetter }; 
}


export default {
    useCoverletterWrite,
};