// src/utils/resumeMain.js
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import resumeApi from "@/apis/resumeApi";
import portfolioApi from "@/apis/portfolioApi";
import coverletterApi from "@/apis/coverletterApi";

export function useResumeMain() {
    const router = useRouter();

    // 사용자 정보
    const userName = ref("김병현");

    // 이력서
    const resumeList = ref([]);

    const extractDescription = (item) => {
        try {
            const career = JSON.parse(item.careerInfo);
            if (Array.isArray(career) && career.length > 0) {
                return career[0].description || "-";
            }
            return "-";
        } catch {
            return "-";
        }
    };

    const fetchResumeList = async () => {
        try {
            const res = await resumeApi.list(1);
            resumeList.value = res.data.map((item) => ({
                id: item.resumeId,
                title: item.title,
                description: extractDescription(item),
                updatedAt: item.updatedAt?.substring(0, 10),
            }));
        } catch (err) {
            console.error("이력서 조회 실패:", err);
        }
    };

    const goToResumeDetail = (id) => {
        router.push(`/resume/coach?id=${id}`);
    };

    // 자소서 
    const coverLetterList = ref([]);

    const fetchCoverletterList = async () => {
        try {
            const res = await coverletterApi.getCoverLetterList(1);
            coverLetterList.value = res.data.map((item) => ({
                id: item.coverletterId,
                title: item.title,
                updatedAt: item.updatedAt?.substring(0, 10),
            }));
        } catch (err) {
            console.error("이력서 조회 실패:", err);
        }
    };

    const goToCoverDetail = (id) => {
        router.push(`/resume/coverletter/detail?id=${id}`);
    };

    // 포트폴리오
    const portfolioList = ref([]);

    const fetchPortfolioList = async () => {
        try {
            const res = await portfolioApi.getPortfolioList(1);
            portfolioList.value = res.data.map(item => ({
                portfolioId: item.portfolioId ?? item.portfolio_id,
                title: item.title,
                updatedAt: item.updatedAt?.substring(0, 10)
            }));
        } catch (err) {
            console.error("포트폴리오 조회 실패:", err);
        }
    };

    const goToPortfolioDetail = (id) => {
        router.push(`/resume/portfolio/coach?id=${id}`);
    };

    // 선택 모드
    const isSelecting = ref(false);
    const selectedResumes = ref([]);
    const selectedCovers = ref([]);
    const selectedPortfolios = ref([]);

    const toggleSelectMode = () => {
        isSelecting.value = !isSelecting.value;
        if (!isSelecting.value) {
            selectedResumes.value = [];
            selectedCovers.value = [];
            selectedPortfolios.value = [];
        }
    };

    const hasSelectedItems = computed(() => {
        return (
            selectedResumes.value.length > 0 ||
            selectedCovers.value.length > 0 ||
            selectedPortfolios.value.length > 0
        );
    });

    const selectResume = (id) => {
        const idx = selectedResumes.value.indexOf(id);
        if (idx === -1) selectedResumes.value.push(id);
        else selectedResumes.value.splice(idx, 1);
    };

    const selectCover = (id) => {
        const idx = selectedCovers.value.indexOf(id);
        if (idx === -1) selectedCovers.value.push(id);
        else selectedCovers.value.splice(idx, 1);
    };

    const selectPortfolio = (id) => {
        const idx = selectedPortfolios.value.indexOf(id);
        if (idx === -1) selectedPortfolios.value.push(id);
        else selectedPortfolios.value.splice(idx, 1);
    };


    // 이력서 삭제
    const deleteSelectedResumes = async () => {
        for (const id of selectedResumes.value) {
            try {
                await resumeApi.remove(id);
            } catch (err) {
                console.error("이력서 삭제 실패:", err);
            }
        }
        await fetchResumeList();
        selectedResumes.value = [];
    };

    // 자소서 삭제
    const deleteCoverLetter = async () => {
        for (const id of selectedCovers.value) {
            try {
                await coverletterApi.deleteCoverLetter(1, id);
            } catch (err) {
                console.error("자소서 삭제 실패:", err);
            }
        }
        await fetchCoverletterList();
        selectedCovers.value = [];
    };

    // 포트폴리오 삭제
    const deleteSelectedPortfolios = async () => {
        for (const id of selectedPortfolios.value) {
            try {
                await portfolioApi.deletePortfolio(id);
            } catch (err) {
                console.error("포트폴리오 삭제 실패:", err);
            }
        }
        await fetchPortfolioList();
        selectedPortfolios.value = [];
    };

    // 삭제 확인
    const confirmDelete = () => {
        if (!hasSelectedItems.value) return;

        if (confirm("정말 삭제하시겠습니까?")) {
            deleteSelectedResumes();
            deleteSelectedPortfolios();
            deleteCoverLetter();
        }
    };


    onMounted(() => {
        fetchResumeList();
        fetchCoverletterList();
        fetchPortfolioList();
    });

    return {
        userName,
        resumeList,
        coverLetterList,
        portfolioList,

        isSelecting,
        selectedResumes,
        selectedCovers,
        selectedPortfolios,

        toggleSelectMode,
        selectResume,
        selectCover,
        selectPortfolio,
        hasSelectedItems,

        goToResumeDetail,
        goToCoverDetail,
        goToPortfolioDetail,

        confirmDelete,
    };
}
