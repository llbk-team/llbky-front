// 포트폴리오 리스트 조회 전용 JS
import { ref, onMounted } from "vue";
import portfolioApi from "@/apis/portfolioApi";

function usePortfolioList() {
    const portfolioList = ref([]);

    const fetchPortfolioList = async () => {
        try {
            const memberId = 1; // 테스트용
            const res = await portfolioApi.getPortfolioList(memberId);
            portfolioList.value = res.data;
            console.log("📂 포트폴리오 리스트:", res.data);
        } catch (err) {
            console.error("❌ 포트폴리오 조회 실패:", err);
        }
    };

    onMounted(fetchPortfolioList);

    return {
        portfolioList,
        fetchPortfolioList,
    };
}

export default {
    usePortfolioList,
};