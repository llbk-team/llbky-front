// 뉴스 트렌드 페이지 컴포넌트용 Composition API
import { ref, computed } from "vue";
import newsApi from "@/apis/newsApi";
import { useStore } from "vuex";

// 뉴스 트렌드 페이지 컴포저블
function news() {
    // ========== 기본 상태 관리 ==========
    const keyword = ref("");
    const recentKeywords = ref([]);
    const selectedNews = ref(null);
    const filters = ref({
        period: "week",
        sentiment: "",
        trustMin: 70,
    });

    const loading = ref(false);
    const apiError = ref(null);
    const newsList = ref([]);
    const hasMore = ref(true);           // 더 불러올 데이터가 있는지
    const isLoadingMore = ref(false);    // 추가 로딩 중인지
    const isSearchMode = ref(false);     // 검색 모드 여부


    const store= useStore();
    // ⚠️ FIXME: 하드코딩된 memberId - 실제 로그인 시스템에서 가져와야 함
    const memberId = computed(()=>(store.state.user.user?.memberId || null));

    // 무한 스크롤용 타임아웃
    let scrollTimeout = null;

    // ========== 유틸리티 함수들 ==========
    
    /**
     * 기간에 따른 시작 날짜 계산
     */
    const calculateStartDate = (period) => {
        const today = new Date();
        
        switch (period) {
            case "today":
                today.setHours(0, 0, 0, 0);
                return today;
            case "week":
                return new Date(today.setDate(today.getDate() - 7));
            case "month":
                return new Date(today.setMonth(today.getMonth() - 1));
            default:
                return new Date(0); // 전체
        }
    };

    /**
     * API 응답 데이터를 화면용 데이터로 변환
     */
    const mapNewsData = (newsItems) => {
        if (!Array.isArray(newsItems)) {
            console.warn('⚠️ mapNewsData: newsItems가 배열이 아님:', newsItems);
            return [];
        }
        
        try {
            const mapped = newsItems.map((n) => {
                const result = {
                    id: n.summaryId || n.summary_id || n.id,
                    title: n.title || "제목 없음",
                    summary_short: n.summaryText || n.summary_text || n.summary_short || "",
                    keywords: Array.isArray(n.keywords) 
                        ? n.keywords.map(k => {
                            if (typeof k === 'string') return k;
                            if (typeof k === 'object') return k.keyword || k.name || k.value || JSON.stringify(k);
                            return String(k);
                        })
                        : [],
                    trust: n.trustScore ?? n.trust_score ?? n.trust ?? 0,
                    sentiment: n.sentiment || "neutral",
                    sentimentLabel: 
                        n.sentiment === 'positive' ? '긍정적' : 
                        n.sentiment === 'negative' ? '부정적' : '중립적',
                    bias_detected: n.biasDetected ?? n.bias_detected ?? false,
                    bias_type: n.biasType || n.bias_type || "",
                    date: n.publishedAt || n.published_at || n.date || "",
                    source: n.sourceName || n.source_name || n.source || "",
                    source_url: n.sourceUrl || n.source_url || "",
                };
                
                return result;
            });
            
            console.log('✅ mapNewsData 변환 완료:', mapped.length, '개 항목');
            return mapped;
            
        } catch (error) {
            console.error('❌ mapNewsData 에러:', error);
            return [];
        }
    };

    /**
     * 요약 텍스트를 HTML ul/li 형태로 변환
     */
    const formatSummary = (summary) => {
        if (!summary) return "";
        
        const lines = summary.trim().split("\n").filter(line => line.trim());
        
        if (lines.length === 0) return "";
        
        return (
            "<ul>" +
            lines.map((line) => `<li>${line.trim()}</li>`).join("") +
            "</ul>"
        );
    };

    // ========== 계산된 속성 ==========
    
    /**
     * 필터링된 뉴스 목록
     */
    const filteredNews = computed(() => {
        let filtered = newsList.value;
        
        // 1. 날짜 필터링 (period)
        const startDate = calculateStartDate(filters.value.period);
        filtered = filtered.filter(n => {
            const newsDate = new Date(n.date || n.publishedAt);
            return newsDate >= startDate;
        });
        
        // 2. 감정 필터링
        if (filters.value.sentiment) {
            filtered = filtered.filter(n => n.sentiment === filters.value.sentiment);
        }
        
        // 3. 신뢰도 필터링
        filtered = filtered.filter(n => n.trust >= filters.value.trustMin);
        
        // 4. 키워드 검색
        if (keyword.value) {
            filtered = filtered.filter(n =>
                n.title.includes(keyword.value) ||
                n.summary_short.includes(keyword.value) ||
                n.keywords.some(k => k.includes(keyword.value))
            );
        }
        
        return filtered;
    });

    /**
     * 화면에 표시할 뉴스 (무한 스크롤용)
     */
    const visibleNews = computed(() => filteredNews.value);

    // ========== 최근 검색어 관리 ==========
    
    /**
     * 로컬스토리지에서 최근 검색어 로드
     */
    const loadRecentKeywords = () => {
        try {
            recentKeywords.value = JSON.parse(
                localStorage.getItem("search_keywords") || "[]"
            );
        } catch (error) {
            console.error('❌ 최근 검색어 로드 실패:', error);
            recentKeywords.value = [];
        }
    };

    /**
     * 최근 검색어에 키워드 추가
     */
    const addRecentKeyword = (term) => {
        try {
            const saved = JSON.parse(localStorage.getItem("search_keywords") || "[]");
            const updated = [term, ...saved.filter((k) => k !== term)].slice(0, 5);
            localStorage.setItem("search_keywords", JSON.stringify(updated));
            recentKeywords.value = updated;
        } catch (error) {
            console.error('❌ 검색어 저장 실패:', error);
        }
    };

    /**
     * 특정 검색어 삭제
     */
    const deleteKeyword = (k) => {
        try {
            const updated = recentKeywords.value.filter((item) => item !== k);
            recentKeywords.value = updated;
            localStorage.setItem("search_keywords", JSON.stringify(updated));
        } catch (error) {
            console.error('❌ 검색어 삭제 실패:', error);
        }
    };

    /**
     * 모든 최근 검색어 삭제
     */
    const clearAll = () => {
        try {
            recentKeywords.value = [];
            localStorage.removeItem("search_keywords");
        } catch (error) {
            console.error('❌ 전체 검색어 삭제 실패:', error);
        }
    };

    // ========== 뉴스 검색 ==========
    
    /**
     * 뉴스 검색 실행
     */
    const searchNews = async () => {
        if (!keyword.value.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }
        
        const term = keyword.value.trim();
        
        // 최근 검색어 저장
        addRecentKeyword(term);
        
        loading.value = true;
        apiError.value = null;
        
        try {
            const response = await newsApi.searchNews([term], memberId.value);
            
            if (response.data.status === 'success' && response.data.data) {
                const newsItems = Array.isArray(response.data.data) ? response.data.data : [];
                
                if (newsItems.length > 0) {
                    newsList.value = mapNewsData(newsItems);
                    isSearchMode.value = true;   // 검색 모드 활성화
                    hasMore.value = false; 
                    keyword.value = '';
                   
                } else {
                    apiError.value = '검색 결과가 없습니다.';
                }
            } else {
                apiError.value = response.data.message || '검색에 실패했습니다.';
            }

        } catch (error) {
            console.error('❌ 뉴스 검색 실패:', error);
            console.error('에러 응답:', error.response?.data);
            apiError.value = error.response?.data?.message || '뉴스 검색에 실패했습니다.';
        } finally {
            loading.value = false;
        }
    };

    /**
     * 최근 검색어 클릭
     */
    const clickKeyword = (k) => {
        keyword.value = k;
        searchNews();
    };

    // ========== 초기 데이터 로드 ==========
    
    /**
     * 초기 뉴스 피드 로드
     */
    const loadInitialNews = async () => {
        if (newsList.value.length > 0) {
            console.log('이미 뉴스가 로드되어 있음');
            return;
        }

        loading.value = true;
        apiError.value = null;
        hasMore.value = true;

        try {
            const response = await newsApi.feedNews(
                memberId.value, 
                15,
                filters.value.period
            );
           
            if (response.data.status === 'success' && response.data.data) {
                const newsItems = Array.isArray(response.data.data) ? response.data.data : [];
                      
                if (newsItems.length > 0) {
                    newsList.value = mapNewsData(newsItems);
                 
                    // 15개 미만이면 더이상 없음
                    if(newsItems.length < 15) {
                        hasMore.value = false;
                    }

                } else {
                    apiError.value = '회원님의 직군에 맞는 뉴스가 아직 없습니다.';
                    hasMore.value = false;
                }
            } else {
                apiError.value = response.data.message || '뉴스 피드를 불러오는데 실패했습니다.';
                hasMore.value = false;
            }
            
        } catch (error) {
            console.error('❌ 피드 로드 실패:', error);
            apiError.value = error.response?.data?.message || '뉴스를 불러오는 데 실패했습니다.';
            hasMore.value = false;  
        } finally {
            loading.value = false;
        }
    };

    // ========== 무한 스크롤 ==========
    
    /**
     * 추가 뉴스 로드 (무한 스크롤)
     */
    const loadMoreNews = async () => {
        if (isSearchMode.value) {
            console.log('검색 모드 - 무한 스크롤 비활성화');
            return;
        }

        if (!hasMore.value || isLoadingMore.value || loading.value) {
            return;
        }
        
        const lastItem = newsList.value[newsList.value.length - 1];
        if (!lastItem) {
            return;
        }
        
        const lastPublishedAt = lastItem.date;
        const lastSummaryId = lastItem.id; 

        isLoadingMore.value = true;
        
        try {
            const response = await newsApi.feedNews(
                memberId.value,
                15,
                filters.value.period,
                lastPublishedAt,
                lastSummaryId
            );
          
            if (response.data.status === 'success' && response.data.data) {
                const newsItems = Array.isArray(response.data.data) ? response.data.data : [];

                if (newsItems.length > 0) {
                    const mapped = mapNewsData(newsItems);
                    newsList.value = [...newsList.value, ...mapped];
             
                    if (newsItems.length < 15) {
                        hasMore.value = false;
                    }
                } else {
                    hasMore.value = false;
                }
            }

        } catch (error) {
            console.error('❌ 추가 로드 실패:', error);
            apiError.value = '추가 뉴스를 불러오는 데 실패했습니다.';
        } finally {
            isLoadingMore.value = false;
        }
    };

    /**
     * 스크롤 이벤트 핸들러 (디바운싱 적용)
     */
    const handleScroll = () => {
        if (!hasMore.value || isLoadingMore.value || loading.value) {
            return;
        }
        
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 300) {
                loadMoreNews();
            }
        }, 100);
    };

    // ========== 필터 관리 ==========
    
    /**
     * 필터 변경 처리
     */
    const applyFilter = (newFilters) => {
        console.log('🔄 필터 변경:', newFilters);
        filters.value = newFilters;
        // filteredNews computed가 자동으로 재계산됨
    };

    // ========== 모달 관리 ==========
    
    /**
     * 뉴스 상세 모달 열기
     */
    const openDetail = (item) => {
        selectedNews.value = item;
    };

    /**
     * 뉴스 상세 모달 닫기
     */
    const closeDetail = () => {
        selectedNews.value = null;
    };

    // ========== 생명주기 관리 ==========
    
    /**
     * 컴포넌트 마운트 시 초기화
     */
    const initializeNews = async () => {
        // 최근 검색어 로드
        loadRecentKeywords();
        
        // 초기 뉴스 로드
        await loadInitialNews();
        
        // 스크롤 이벤트 등록
        window.addEventListener('scroll', handleScroll);
        
        console.log('✅ 뉴스 컴포저블 초기화 완료');
    };

    /**
     * 컴포넌트 언마운트 시 정리
     */
    const cleanupNews = () => {
        // 스크롤 이벤트 제거
        window.removeEventListener('scroll', handleScroll);
        
        // 타임아웃 정리
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        console.log('✅ 뉴스 컴포저블 정리 완료');
    };

    // ========== 반환 객체 ==========
    return {
        // 상태
        keyword,
        recentKeywords,
        selectedNews,
        filters,
        loading,
        apiError,
        newsList,
        hasMore,
        isLoadingMore,
        isSearchMode,
        memberId,
        
        // 계산된 속성
        filteredNews,
        visibleNews,
        
        // 유틸리티 함수
        calculateStartDate,
        mapNewsData,
        formatSummary,
        
        // 검색어 관리
        loadRecentKeywords,
        addRecentKeyword,
        deleteKeyword,
        clearAll,
        clickKeyword,
        
        // 뉴스 검색 및 로드
        searchNews,
        loadInitialNews,
        loadMoreNews,
        
        // 스크롤 관리
        handleScroll,
        
        // 필터 관리
        applyFilter,
        
        // 모달 관리
        openDetail,
        closeDetail,
        
        // 생명주기
        initializeNews,
        cleanupNews,
    };
}

// Named export

export {news};