// 포트폴리오 작성 도우미 페이지 컴포넌트용 js 파일 (임시 저장 기능 추가)
import portfolioGuideApi from "@/apis/portfolioGuideApi";
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// 포트폴리오 작성 도우미
function portfolioStepbystep() {
    const router = useRouter();
    const store = useStore();

    // 전체 진행률 및 현재 단계
    const overallProgress = ref(0);
    const currentStep = ref(1);

    // 사용자 정보
    const memberId = ref(null);
    const guideId = ref(null);
    const isGuideCreated = ref(false);
    const userName = ref('');
    const userEmail = ref('');
    const jobGroup = ref('');
    const jobRole = ref('');

    const isLoggedIn = computed(() => store.getters['user/isLoggedIn']);
    const currentUser = computed(() => store.getters['user/userInfo']);

    // 포트폴리오 단계 (DB에서 가져올 데이터)
    const portfolioSteps = ref([]);

    // 아코디언 상태 관리
    const openStepIndex = ref(0);
    const openItemIndex = ref(null);
    const showItemFeedback = ref(Array(20).fill(false));
    const currentAiFeedback = ref(null);
    const currentContent = ref("");
    const selectedItem = ref(null);

    // 예시 선택 관련 상태
    const selectedExample = ref("");
    const selectedExampleIndex = ref(null);
    const originalContent = ref("");
    const aiLoading = ref(false);

    // 임시 저장 관련 상태
    const isSaving = ref(false);
    const lastSavedTime = ref(null);
    const hasUnsavedChanges = ref(false);

    //초기화 관련 상태
    const isResetting = ref(false);
    const showResetConfirm = ref(false);
    const guideCreatedAt = ref(null);

    const showDownloadCompleteModal = ref(false);


    // 모든 단계 완료 여부
    const isAllComplete = computed(() => {
        const stage5 = portfolioSteps.value.find(step => step.label === "5단계");
        const allStagesComplete = portfolioSteps.value.every(step => step.progress === 100);
        return stage5 && stage5.progress === 100 && allStagesComplete;
    });

    //24시간 경과 여부
    const isExpired = computed(() => {
        if (!guideCreatedAt.value) return false;
        const hoursDiff = (new Date() - new Date(guideCreatedAt.value)) / (1000 * 60 * 60);
        return hoursDiff > 24;
    })

    // ⭐ 임시 저장 키 생성 (사용자별 고유키)
    const getStorageKey = () => {
        return `portfolio_temp_${memberId.value || 'guest'}`;
    };

    // ⭐ 임시 저장 함수
    const saveTemporaryContent = async () => {
        if (!memberId.value) {
            console.warn('❌ 로그인된 사용자가 없어 임시 저장을 건너뜁니다.');
            return;
        }

        try {
            isSaving.value = true;

            // 현재 작성 중인 모든 데이터 수집
            const tempData = {
                timestamp: new Date().toISOString(),
                currentStep: currentStep.value,
                openStepIndex: openStepIndex.value,
                openItemIndex: openItemIndex.value,
                currentContent: currentContent.value,
                portfolioSteps: portfolioSteps.value.map(step => ({
                    ...step,
                    items: step.items.map(item => ({
                        title: item.title,
                        userInput: item.userInput || '',
                        status: item.status,
                        feedback: item.feedback
                    }))
                })),
                overallProgress: overallProgress.value
            };

            // localStorage에 저장
            localStorage.setItem(getStorageKey(), JSON.stringify(tempData));

            lastSavedTime.value = new Date();
            hasUnsavedChanges.value = false;

            // console.log('✅ 임시 저장 완료:', lastSavedTime.value.toLocaleTimeString());

        } catch (error) {
            console.error('❌ 임시 저장 실패:', error);
        } finally {
            isSaving.value = false;
        }
    };

    // ⭐ 임시 저장된 내용 불러오기
    const loadTemporaryContent = async () => {
        try {
            const storageKey = getStorageKey();
            const tempDataStr = localStorage.getItem(storageKey);

            if (!tempDataStr) {
                console.log('📭 저장된 임시 데이터가 없습니다.');
                return false;
            }

            const tempData = JSON.parse(tempDataStr);
            const savedTime = new Date(tempData.timestamp);
            const hoursDiff = (new Date() - savedTime) / (1000 * 60 * 60);

            // 24시간 이상 된 데이터는 삭제
            if (hoursDiff > 24) {
                localStorage.removeItem(storageKey);
                // console.log('🗑️ 오래된 임시 데이터 삭제 (24시간 초과)');
                return false;
            }

            // 임시 데이터가 있다면 사용자에게 복원할지 확인
            const shouldRestore = confirm(
                `${savedTime.toLocaleString()}에 저장된 임시 데이터를 발견했습니다.\n` +
                '작성 중이던 내용을 복원하시겠습니까?'
            );

            if (shouldRestore && tempData.portfolioSteps) {
                // 데이터 복원
                currentStep.value = tempData.currentStep || 1;
                openStepIndex.value = tempData.openStepIndex || 0;
                openItemIndex.value = tempData.openItemIndex || null;
                currentContent.value = tempData.currentContent || '';
                overallProgress.value = tempData.overallProgress || 0;

                // 포트폴리오 단계 데이터 복원 (기존 구조와 병합)
                if (portfolioSteps.value && portfolioSteps.value.length > 0) {
                    tempData.portfolioSteps.forEach((tempStep, stepIndex) => {
                        if (portfolioSteps.value[stepIndex]) {
                            tempStep.items.forEach((tempItem, itemIndex) => {
                                if (portfolioSteps.value[stepIndex].items[itemIndex]) {
                                    portfolioSteps.value[stepIndex].items[itemIndex].userInput = tempItem.userInput || '';
                                    portfolioSteps.value[stepIndex].items[itemIndex].status = tempItem.status || '미작성';
                                    if (tempItem.feedback) {
                                        portfolioSteps.value[stepIndex].items[itemIndex].feedback = tempItem.feedback;
                                    }
                                }
                            });
                            portfolioSteps.value[stepIndex].progress = tempStep.progress || 0;
                        }
                    });
                }

                lastSavedTime.value = savedTime;
                hasUnsavedChanges.value = false;

                // console.log('✅ 임시 데이터 복원 완료');
                return true;
            }

            return false;
        } catch (error) {
            console.error('❌ 임시 데이터 로드 실패:', error);
            return false;
        }
    };

    // ⭐ 임시 저장 데이터 삭제
    const clearTemporaryContent = () => {
        try {
            localStorage.removeItem(getStorageKey());
            lastSavedTime.value = null;
            hasUnsavedChanges.value = false;
            // console.log('🗑️ 임시 저장 데이터 삭제 완료');
        } catch (error) {
            console.error('❌ 임시 데이터 삭제 실패:', error);
        }
    };

    // ⭐ 전체 초기화 확인 대화상자
    const confirmReset = () => {
        showResetConfirm.value = true;
    };

    // 전체 내용 초기화 함수
    const resetAllContent = async () => {
        if (isResetting.value) return;
        try {
            isResetting.value = true;
            showResetConfirm.value = false;
            console.log('전체 내용 초기화 시작');
             hasUnsavedChanges.value = false;
            // 기존 가이드 삭제
            if (guideId.value) {
                try {
                    await deleteGuide();
                } catch (error) {
                    console.warn('가이드 삭제 중 오류:', error);
                }
            }

            // 로컬 상태 초기화
            resetLocalState();

            // ✅ 임시저장 데이터 삭제 (함수 호출)
            clearTemporaryContent();

            // ✅ 새 가이드 생성 및 표준 데이터 다시 로드 (함수 호출)
            await fetchPortfolioStandards();
            
            // ⭐ 표준 데이터 로드 후 플래그 재설정
            hasUnsavedChanges.value = false;
            
            // ⭐ 새 가이드 생성 (24시간 타이머 리셋)
            await createGuide();
            
            // ⭐ 가이드 생성 후 플래그 재설정
            hasUnsavedChanges.value = false;

            openStepIndex.value = 0;
            currentStep.value = 1;
            openItemIndex.value = null;
            
            console.log('✅ 초기화 완료 - 새 가이드 생성됨');
            alert('모든 내용이 초기화되었습니다. 새로 시작하세요.');

        } catch (error) {
            console.error('❌ 초기화 실패:', error);
            alert('초기화 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        } finally {
            isResetting.value = false;
        }
    };
    const resetLocalState = () => {
        guideId.value = null;
        isGuideCreated.value = false;
        guideCreatedAt.value = null;

        overallProgress.value = 0;
        currentStep.value = 1;

        openStepIndex.value = 0;
        openItemIndex.value = null;
        currentContent.value = '';
        selectedItem.value = null;

        // AI 피드백 상태 초기화
        showItemFeedback.value = Array(20).fill(false);
        currentAiFeedback.value = null;
        selectedExample.value = '';
        selectedExampleIndex.value = null;
        originalContent.value = '';

        lastSavedTime.value = null;
        hasUnsavedChanges.value = false;
        console.log('로컬 상태 초기화 완료');

    };

    const deleteGuide = async () => {
        if (!guideId.value) return;
        try {
            console.log('가이드 삭제 시작 - guideId:', guideId.value);

            // ✅ 올바른 API 함수 이름 사용
            await portfolioGuideApi.deleteGuideId(guideId.value, memberId.value);

            console.log('✅ 가이드 삭제 완료');
        } catch (error) {
            console.error('❌ 가이드 삭제 실패:', error);
            throw error; // 상위로 에러 전파
        }
    };

    //완료된 항목 다시 편집하기
    const editCompletedItem = (stepIndex, itemIndex) => {
        const item = portfolioSteps.value[stepIndex].items[itemIndex];

        item.status = '작성중';

        openStepIndex.value = stepIndex;
        openItemIndex.value = itemIndex;
        selectedItem.value = item;

        currentContent.value = item.userInput || '';
        showItemFeedback.value[itemIndex] = false;
        currentAiFeedback.value = null;
        updateProgress();

        hasUnsavedChanges.value = true;
        console.log(`📝 완료된 항목 재편집 시작: ${item.title}`);
    };

    const checkAndHandleExpiration = () => {
        if (isExpired.value) {
            const shouldReset = confirm(
                '⏰ 가이드가 생성된 지 24시간이 경과했습니다.\n' +
                '내용을 초기화하고 새로 시작하시겠습니까?\n\n' +
                '(취소하면 기존 내용을 계속 사용합니다)'
            );

            if (shouldReset) {
                resetAllContent();
            }
        }
    };



    // ⭐ 변경사항 감지 (currentContent 변경 시)
    watch(currentContent, () => {
        if (isResetting.value) return;
        hasUnsavedChanges.value = true;
    });

    // ⭐ 페이지 떠날 때 경고 및 임시 저장
    const handleBeforeUnload = (event) => {
        if (hasUnsavedChanges.value) {
            // 임시 저장 실행
            saveTemporaryContent();

            // 브라우저 경고 메시지
            event.preventDefault();
            event.returnValue = '작성 중인 내용이 있습니다. 정말 나가시겠습니까?';
            return event.returnValue;
        }
    };

    // 컴포넌트 해제 시 정리
    onBeforeUnmount(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (hasUnsavedChanges.value) {
            saveTemporaryContent();
        }
    });

    // 특정 단계를 열기 전에 이전 단계가 완료되었는지 확인
    const isPreviousStepComplete = (stepIndex) => {
        if (stepIndex === 0) return true; // 1단계는 항상 접근 가능

        // 이전 단계의 진행률이 100%인지 확인
        const previousStep = portfolioSteps.value[stepIndex - 1];
        return previousStep && previousStep.progress === 100;
    };

    // 단계 토글
    const toggleStep = (step) => {
        const index = portfolioSteps.value.indexOf(step);

        // ⭐ 이전 단계 완료 여부 확인 (닫을 때는 검증 안 함)
        if (openStepIndex.value !== index && !isPreviousStepComplete(index)) {
            alert(`이전 단계를 먼저 완료해주세요. (${index}단계는 ${index}단계 완료 후 진행 가능)`);
            return;
        }

        openStepIndex.value = openStepIndex.value === index ? null : index;
        // 단계 변경 시 항목 초기화
        if (openStepIndex.value !== null) {
            currentStep.value = parseInt(portfolioSteps.value[openStepIndex.value].label);
        }
        openItemIndex.value = null;

        // ⭐ 단계 변경 시 임시 저장
        hasUnsavedChanges.value = true;
    };

    // 항목 토글
    const toggleItem = (item, index) => {
        openItemIndex.value = openItemIndex.value === index ? null : index;
        selectedItem.value = item;

        // 기존 작성 내용이 있으면 로드
        if (openItemIndex.value !== null && !showItemFeedback.value[index]) {
            currentContent.value = item.userInput || "";
        }

        // ⭐ 항목 변경 시 임시 저장
        hasUnsavedChanges.value = true;
    };

    // 입력 취소
    const cancelItemInput = (index) => {
        openItemIndex.value = null;
        currentContent.value = "";
        // ⭐ 취소 시에도 변경사항으로 간주
        hasUnsavedChanges.value = true;
    };

    // 피드백 초기화
    const cancelItemFeedback = (index) => {
        showItemFeedback.value[index] = false;
        currentAiFeedback.value = null;
        selectedExample.value = "";
        selectedExampleIndex.value = null;
        originalContent.value = "";
    };

    // AI 피드백 요청
    const submitItemContent = async (index) => {
        try {
            if (!memberId.value) {
                console.warn('❌ 사용자 정보가 없습니다. 다시 로그인해주세요.');
                router.push('/login');
                return;
            }

            const currentItem = portfolioSteps.value[openStepIndex.value].items[index];

            // 입력값 검증
            if (!currentContent.value || currentContent.value.trim() === '') {
                alert('내용을 입력해주세요.');
                return;
            }

            // 로딩 시작
            aiLoading.value = true;

            // 원본 내용 저장 (나중에 복원을 위해)
            originalContent.value = currentContent.value;

            const requestData = {
                userInput: currentContent.value,
                inputFieldType: currentItem.title,
                memberId: memberId.value,
                jobGroup: jobGroup.value,
                jobRole: jobRole.value,
                careerYears: 2,
                currentStep: currentStep.value
            };

            // console.log('🚀 AI 피드백 요청 (하드코딩 포함):', requestData);

            // 실시간 코칭 API 호출 (POST /portfolio-guide/coaching)
            const response = await portfolioGuideApi.getRealtimeCoaching(requestData);

            if (response.data) {
                const feedback = response.data;

                // 피드백 표시
                showItemFeedback.value[index] = true;

                // AI 코치 패널에 표시할 상세 피드백 (전체 객체)
                currentAiFeedback.value = feedback;

                // 초기 선택 상태 리셋
                selectedExample.value = "";
                selectedExampleIndex.value = null;

                // 사용자 입력을 임시 저장 (아직 완료되지 않음)
                currentItem.feedback = feedback; // 전체 피드백 객체 저장

                // ⭐ AI 피드백 받은 후 임시 저장
                hasUnsavedChanges.value = true;
                await saveTemporaryContent();

                // console.log('✅ AI 피드백 수신 완료');
            }
        } catch (error) {
            // console.error('❌ API 호출 중 오류:', error);
            // console.error('상태 코드:', error.response?.status);
            // console.error('응답 헤더:', error.response?.headers);
            // console.error('에러 상세:', error.response?.data || error.message);

            // 더 자세한 에러 메시지
            let errorMessage = '서버와의 통신 중 오류가 발생했습니다.\n\n';
            if (error.response) {
                errorMessage += `상태 코드: ${error.response.status}\n`;
                errorMessage += `메시지: ${error.response.data?.message || error.message}`;
            } else if (error.request) {
                errorMessage += '서버로부터 응답이 없습니다.\n백엔드 서버(http://localhost:8081)가 실행 중인지 확인해주세요.';
            } else {
                errorMessage += error.message;
            }

            alert(errorMessage);
            if (error.response?.status === 401) {
                errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
                store.dispatch('user/logout'); // 로그아웃 처리
                router.push('/login');
                return;
            }

        } finally {
            // 로딩 종료 (성공/실패 모두)
            aiLoading.value = false;
        }
    };

    // 예시 선택 함수
    const selectExample = (index, exampleText) => {
        selectedExampleIndex.value = index;
        selectedExample.value = exampleText;
        // console.log('🎯 예시 선택:', { index, exampleText });

        // ⭐ 예시 선택 시 변경사항 표시
        hasUnsavedChanges.value = true;
    };

    // 원본 내용 사용
    const useOriginalContent = (itemIndex) => {
        selectedExample.value = originalContent.value;
        selectedExampleIndex.value = null;
        // console.log('📝 원본 내용 사용:', originalContent.value);

        // ⭐ 원본 사용 시 변경사항 표시
        hasUnsavedChanges.value = true;
    };

    // 선택된 내용 적용
    const applySelectedContent = async (itemIndex) => {
        const currentItem = portfolioSteps.value[openStepIndex.value].items[itemIndex];

        // 선택된 내용을 적용 (예시 또는 원본)
        const finalContent = selectedExample.value || originalContent.value;

        if (!finalContent || finalContent.trim() === '') {
            alert('적용할 내용이 없습니다.');
            return;
        }

        // 항목에 최종 내용 저장
        currentItem.userInput = finalContent;
        currentItem.status = '완료';
        currentItem.appliedFeedback = currentAiFeedback.value; // 적용된 피드백도 저장

        // 진행률 업데이트
        updateProgress();

        // 피드백 창 닫기
        showItemFeedback.value[itemIndex] = false;
        currentAiFeedback.value = null;
        selectedExample.value = "";
        selectedExampleIndex.value = null;
        originalContent.value = "";

        // 입력창으로 돌아가기
        openItemIndex.value = null;
        currentContent.value = "";

        // ⭐ 내용 적용 후 임시 저장
        hasUnsavedChanges.value = false; // 완료 상태이므로 미저장 변경사항 해제
        await saveTemporaryContent();

        alert('✅ 내용이 성공적으로 적용되었습니다!');
    };

    // 피드백 없이 바로 완료하는 함수
    const completeItemWithoutFeedback = async (index) => {
        // 해당 항목 상태 '완료'로 업데이트
        portfolioSteps.value[openStepIndex.value].items[index].status = '완료';

        // 사용자 입력 저장  
        portfolioSteps.value[openStepIndex.value].items[index].userInput = currentContent.value;

        // 단계 진행률 업데이트
        updateProgress();

        // 입력창 닫기
        openItemIndex.value = null;
        currentContent.value = "";

        // ⭐ 완료 후 임시 저장
        hasUnsavedChanges.value = false;
        await saveTemporaryContent();
    };

    // 진행률 업데이트
    const updateProgress = () => {
        // 모든 단계 순회하며 진행률 계산
        portfolioSteps.value.forEach((step, stepIndex) => {
            const items = step.items;
            const completedCount = items.filter(item => item.status === '완료').length;
            const progress = Math.round((completedCount / items.length) * 100);

            // 단계 진행률 업데이트
            portfolioSteps.value[stepIndex].progress = progress;
        });

        // 전체 진행률 업데이트
        const totalItems = portfolioSteps.value.reduce((acc, step) => acc + step.items.length, 0);
        const totalCompleted = portfolioSteps.value.reduce((acc, step) =>
            acc + step.items.filter(item => item.status === '완료').length, 0);

        overallProgress.value = Math.round((totalCompleted / totalItems) * 100);

        // ⭐ 진행률 변경 시 변경사항 표시
        hasUnsavedChanges.value = true;
    };

    // DB에서 포트폴리오 가이드 표준 데이터 가져오기
    const fetchPortfolioStandards = async () => {
        try {
            // 사용자/직군/직무 유효성 확인
            // console.log('🔎 표준 데이터 조회 요청:', {
            //     memberId: memberId.value,
            //     jobGroup: jobGroup.value,
            //     jobRole: jobRole.value
            // });

            if (!memberId.value) {
                console.warn('❌ memberId가 없습니다. 로그인 정보를 확인하세요.');
                await fetchAllStandards();
                return;
            }

            if (!jobGroup.value || !jobRole.value) {
                console.warn('⚠️ 직군/직무가 설정되지 않았습니다. 전체 표준을 불러옵니다.');
                await fetchAllStandards();
                return;
            }

            // 직군/직무별 평가 기준 조회
            const response = await portfolioGuideApi.getStandardsByMember(memberId.value);

            const standards = response?.data;
            // console.log('📦 표준 데이터 응답:', standards);

            // DB에서 받은 데이터를 포트폴리오 단계 형식으로 변환
            if (Array.isArray(standards) && standards.length > 0) {
                portfolioSteps.value = transformStandardsToSteps(standards);
                // console.log('✅ 직군/직무 기준으로 표준 데이터 적용:', {
                //     stepsCount: portfolioSteps.value.length
                // });
            } else {
                console.warn('ℹ️ 직군/직무 기준 데이터가 없어 전체 표준으로 대체합니다.');
                await fetchAllStandards();
            }
        } catch (error) {
            console.error('❌ 표준 데이터 조회 중 오류:', error);
            // 오류 시 전체 표준 데이터 조회 시도
            await fetchAllStandards();
        }
    };

    // 전체 평가 기준 조회 (대체 방법)
    const fetchAllStandards = async () => {
        try {
            const response = await portfolioGuideApi.getAllStandards();

            if (response.data) {
                const standards = response.data;
                // console.log('전체 표준 데이터:', standards);

                if (Array.isArray(standards) && standards.length > 0) {
                    portfolioSteps.value = transformStandardsToSteps(standards);
                } else {
                    loadDefaultSteps();
                }
            }
        } catch (error) {
            console.error('전체 표준 데이터 조회 중 오류:', error);
            loadDefaultSteps();
        }
    };

    // 서브 질문 추출 함수
    const extractSubQuestions = (questionText) => {
        const subQuestions = [];

        // 콜론 이후 부분 추출
        const afterColon = questionText.split(':')[1];
        if (!afterColon) return subQuestions;

        // 1), 2), 3) 등으로 분리
        const matches = afterColon.match(/\d+\)\s*[^0-9)]+/g);
        if (matches) {
            matches.forEach(match => {
                // "1) 항목명" → "항목명"
                const cleaned = match.replace(/^\d+\)\s*/, '').trim();
                if (cleaned) {
                    subQuestions.push(cleaned);
                }
            });
        }

        return subQuestions;
    };

    // ✅ 최종 수정 버전: prompt_template을 실제 질문으로 사용
    const transformStandardsToSteps = (standards) => {
        // console.log('🔍 받은 standards 데이터:', standards);

        // ⭐ 1단계: standardId 순으로 정렬 (DB 순서 유지)
        const sortedStandards = [...standards].sort((a, b) => {
            const idA = a.standardId || 0;
            const idB = b.standardId || 0;
            return idA - idB;
        });

        // console.log('📊 standardId 순 정렬 결과:', sortedStandards.map(s => ({
        //     standardId: s.standardId,
        //     standardName: s.standardName
        // })));

        // ⭐ 2단계: 정렬된 순서대로 1~5단계 매핑
        const stepMap = {};

        sortedStandards.forEach((standard, index) => {
            // ⭐ 핵심: 배열 인덱스로 1~5단계 강제 매핑
            const stepNum = (index % 5) + 1;  // 0→1, 1→2, 2→3, 3→4, 4→5, 5→1, ...

            // console.log(`📋 처리 중: standardId=${standard.standardId} → ${stepNum}단계`);

            // ⭐ 단계 토픽 = standardName (짧은 제목)
            const stepTopic = standard.standardName || `${stepNum}단계`;

            // 단계가 없으면 새로 생성
            if (!stepMap[stepNum]) {
                stepMap[stepNum] = {
                    label: `${stepNum}단계`,
                    topic: stepTopic,
                    progress: 0,
                    items: [],
                    // ⭐ 원본 standardId 정보 보존 (API 호출용)
                    standardIds: [],
                    descriptions: [],
                    promptTemplates: [],
                    weightPercentages: []
                };
            }

            // ⭐ 메타 정보 누적 저장 (여러 standard가 같은 단계에 들어갈 수 있음)
            stepMap[stepNum].standardIds.push(standard.standardId);
            stepMap[stepNum].descriptions.push(standard.standardDescription || standard.description);
            stepMap[stepNum].promptTemplates.push(standard.promptTemplate);
            stepMap[stepNum].weightPercentages.push(standard.weightPercentage || 20);

            // ✅ 핵심 수정: prompt_template을 실제 질문으로 사용
            if (standard.promptTemplate && standard.promptTemplate.trim() !== '') {
                const questionText = standard.promptTemplate;

                // 서브 질문 추출 (1), 2), 3) 형식 분리)
                const subQuestions = extractSubQuestions(questionText);

                // console.log(`📌 ${stepNum}단계 질문 추가:`, {
                //     topic: stepTopic,
                //     mainQuestion: questionText.split(':')[0],
                //     subQuestionCount: subQuestions.length
                // });

                stepMap[stepNum].items.push({
                    // ⭐ prompt_template의 메인 질문을 title로
                    title: questionText.split(':')[0].trim() || stepTopic,

                    // ⭐ 전체 질문 텍스트 (서브 질문 포함)
                    fullQuestion: questionText,

                    description: standard.standardDescription || standard.description || '',
                    status: '미작성',
                    placeholder: `질문에 대한 답변을 작성하세요`,
                    imageUpload: false,
                    userInput: '',
                    weight: standard.weightPercentage || 20,

                    // ⭐ 원본 메타데이터 보존
                    originalStandardId: standard.standardId,
                    subQuestions: subQuestions,  // 서브 질문 배열

                    // ⭐ AI 평가 기준 (evaluation_items)
                    evaluationCriteria: standard.evaluationItems || null
                });
            } else {
                console.warn('⚠️ promptTemplate이 비어있음:', standard.standardId);
            }
        });

        // ⭐ 3단계: 1~5단계 순으로 배열 생성
        const steps = [];
        for (let i = 1; i <= 5; i++) {
            if (stepMap[i]) {
                steps.push(stepMap[i]);
            }
        }

        // ⭐ 4단계: 빈 단계가 있으면 기본 항목 추가
        for (let i = 1; i <= 5; i++) {
            if (!stepMap[i]) {
                steps.push({
                    label: `${i}단계`,
                    topic: `${i}단계`,
                    progress: 0,
                    items: [{
                        title: `${i}단계 내용`,
                        fullQuestion: `${i}단계에 대해 작성하세요`,
                        description: `${i}단계 작성 내용`,
                        status: '미작성',
                        placeholder: `${i}단계에 대해 작성하세요`,
                        imageUpload: false,
                        userInput: '',
                        weight: 20,
                        subQuestions: []
                    }],
                    standardIds: [],
                    descriptions: [],
                    promptTemplates: [],
                    weightPercentages: [20]
                });
            }

            // 각 단계별 항목이 없으면 기본 항목 추가
            const currentStep = steps[i - 1];
            if (currentStep && currentStep.items.length === 0) {
                currentStep.items.push({
                    title: currentStep.topic,
                    fullQuestion: currentStep.promptTemplates[0] || currentStep.topic,
                    description: currentStep.descriptions[0] || '',
                    status: '미작성',
                    placeholder: `${currentStep.topic}에 대해 작성하세요`,
                    imageUpload: false,
                    userInput: '',
                    weight: 20,
                    originalStandardId: currentStep.standardIds[0],
                    subQuestions: []
                });
            }
        }

        // console.log('✅ 변환된 단계 데이터 (1~5단계):', steps.map(step => ({
        //     label: step.label,
        //     topic: step.topic,
        //     itemCount: step.items.length,
        //     standardIds: step.standardIds
        // })));

        return steps;
    };

    // 기본 데이터 로드 (API 실패 시 사용)
    const loadDefaultSteps = () => {
        portfolioSteps.value = [
            {
                label: "1단계",
                topic: "프로젝트 개요",
                progress: 0,
                items: [
                    { title: "프로젝트 제목", description: "프로젝트 이름", status: "미작성", placeholder: "예: AI 기반 취업 컨설팅 서비스", userInput: '' },
                    { title: "프로젝트 기간", description: "시작/종료 일자", status: "미작성", placeholder: "예: 2024.01 ~ 2024.03 (3개월)", userInput: '' },
                    { title: "프로젝트 목적", description: "개발 배경과 목표", status: "미작성", placeholder: "예: 취업 준비생들이 AI의 도움을 받아...", userInput: '' },
                    { title: "팀 구성", description: "역할 분담", status: "미작성", placeholder: "예: 개인 프로젝트 / 4인 팀", userInput: '' }
                ]
            },
            {
                label: "2단계",
                topic: "핵심 역량 & 기술",
                progress: 0,
                items: [
                    { title: "사용 기술", description: "주요 기술 스택", status: "미작성", placeholder: "예: Spring Boot, Vue.js...", userInput: '' },
                    { title: "핵심 기능", description: "주요 기능 설명", status: "미작성", placeholder: "예: 1. 이력서 AI 분석...", userInput: '' },
                    { title: "본인 역할", description: "담당 업무", status: "미작성", placeholder: "예: 백엔드 API 개발...", userInput: '' },
                    { title: "기술 선택 이유", description: "기술 스택 결정 근거", status: "미작성", placeholder: "예: PostgreSQL의 JSONB...", userInput: '' }
                ]
            },
            {
                label: "3단계",
                topic: "구현 내용",
                progress: 0,
                items: [
                    { title: "시스템 아키텍처", description: "시스템 구조", status: "미작성", placeholder: "예: 3-tier 아키텍처...", imageUpload: true, userInput: '' },
                    { title: "데이터베이스 설계", description: "DB 스키마", status: "미작성", placeholder: "예: 사용자, 이력서...", imageUpload: true, userInput: '' },
                    { title: "핵심 알고리즘", description: "중요 로직", status: "미작성", placeholder: "예: RAG 패턴 구현...", userInput: '' },
                    { title: "UI/UX 설계", description: "사용자 경험", status: "미작성", placeholder: "예: 직관적인 UI...", imageUpload: true, userInput: '' }
                ]
            },
            {
                label: "4단계",
                topic: "결과 & 성과",
                progress: 0,
                items: [
                    { title: "주요 성과", description: "정량적 지표", status: "미작성", placeholder: "예: 사용자 만족도 92%...", imageUpload: true, userInput: '' },
                    { title: "문제 해결", description: "극복한 어려움", status: "미작성", placeholder: "예: JSONB 매핑 문제...", userInput: '' },
                    { title: "배포 & 운영", description: "서비스 런칭", status: "미작성", placeholder: "예: AWS EC2 배포...", userInput: '' },
                    { title: "시연 영상", description: "동작 예시", status: "미작성", placeholder: "예: 주요 기능 시연...", imageUpload: true, userInput: '' }
                ]
            },
            {
                label: "5단계",
                topic: "회고 & 개선점",
                progress: 0,
                items: [
                    { title: "배운 점", description: "기술적 성장", status: "미작성", placeholder: "예: Spring AI 연동...", userInput: '' },
                    { title: "개선할 점", description: "향후 발전 방향", status: "미작성", placeholder: "예: 벡터 검색 최적화...", userInput: '' },
                    { title: "성장 방향", description: "앞으로의 계획", status: "미작성", placeholder: "예: NLP와 AI 추가 학습...", userInput: '' }
                ]
            }
        ];
    };

    const setUserInfoFromStore = () => {
        // console.log('🔍 Vuex store에서 사용자 정보 확인 중...');

        if (!isLoggedIn.value || !currentUser.value) {
            console.warn('❌ 로그인되지 않은 상태입니다.');
            router.push('/login');
            return false;
        }

        const user = currentUser.value;

        // 🔥 핵심: store에서 실제 사용자 정보 가져오기
        memberId.value = user.memberId || user.id || user.member_id;
        userName.value = user.name || user.username || user.member_name || '';
        userEmail.value = user.email || user.member_email || '';

        // 직군/직무 정보도 있다면 설정
        if (user.jobGroup || user.job_group) {
            jobGroup.value = user.jobGroup || user.job_group;
        }
        if (user.jobRole || user.job_role) {
            jobRole.value = user.jobRole || user.job_role;
        }

        // console.log('✅ 사용자 정보 설정 완료:', {
        //     memberId: memberId.value,
        //     userName: userName.value,
        //     userEmail: userEmail.value
        // });

        return true;
    };

    // 수정된 초기화 함수 (임시 저장 기능 포함)
    const initializePortfolio = async () => {
        // 로그인 및 사용자 정보 설정
        const ok = setUserInfoFromStore();
        if (!ok) return; // 로그인되지 않았으면 중단

        openStepIndex.value = 0;

        // 표준 데이터 로드 (회원의 직군/직무 기반)
        await fetchPortfolioStandards();
        hasUnsavedChanges.value = false;
        // ⭐ 기존 가이드 로드 시도
        try {
            const guidesResponse = await portfolioGuideApi.getGuidesByMember(memberId.value);
            if (guidesResponse.data && guidesResponse.data.length > 0) {
                const latestGuide = guidesResponse.data[0];
                guideId.value = latestGuide.guideId;
                isGuideCreated.value = true;

                //가이드 생성시간 저장
                guideCreatedAt.value = latestGuide.createdAt || latestGuide.created_at || new Date().toISOString();

                // ⭐ 수정: standard와 저장된 내용 병합
                if (latestGuide.guideContent) {
                    let parsedContent = latestGuide.guideContent;

                    // 문자열이면 파싱
                    if (typeof parsedContent === 'string') {
                        parsedContent = JSON.parse(parsedContent);
                    }

                    const savedSteps = parsedContent.guideSteps || parsedContent.steps;

                    // ⭐ 병합: standard 구조는 유지하고 userInput만 복원
                    if (savedSteps && Array.isArray(savedSteps)) {
                        savedSteps.forEach((savedStep, stepIndex) => {
                            if (portfolioSteps.value[stepIndex]) {
                                // 진행률 복원
                                portfolioSteps.value[stepIndex].progress = savedStep.progress || 0;

                                // 각 항목의 userInput, status 복원
                                savedStep.items?.forEach((savedItem, itemIndex) => {
                                    if (portfolioSteps.value[stepIndex].items[itemIndex]) {
                                        portfolioSteps.value[stepIndex].items[itemIndex].userInput =
                                            savedItem.userInput || savedItem.content || '';
                                        portfolioSteps.value[stepIndex].items[itemIndex].status =
                                            savedItem.status || '미작성';
                                        if (savedItem.feedback) {
                                            portfolioSteps.value[stepIndex].items[itemIndex].feedback = savedItem.feedback;
                                        }
                                    }
                                });
                            }
                        });
                    }

                    currentStep.value = latestGuide.currentStep || 1;
                }

                setTimeout(() => {
                    checkAndHandleExpiration();
                }, 1000); // 1초 후에 체크 (UI 로딩 후)  
            } else {
                console.log('새 가이드를 생성합니다.');
                await createGuide();
            }
        } catch (error) {
            console.log('가이드 조회 실패, 새 가이드 생성:', error);
            await createGuide();
        }

        // ⭐ 임시 저장된 내용 복원 시도
        await loadTemporaryContent();

        // 이벤트 리스너 등록
        window.addEventListener('beforeunload', handleBeforeUnload);
    };

    // ⭐ 가이드 생성 함수
    const createGuide = async () => {
        try {
            isSaving.value = true;

            const createRequest = {
                memberId: memberId.value,
                title: "포트폴리오 작성 가이드",
                standardId: 1  // 기본 표준 (실제로는 직군/직무에 따라 선택)
            };

            const response = await portfolioGuideApi.createGuide(createRequest);


            if (response.data) {
                guideId.value = response.data.guideId;
                isGuideCreated.value = true;

                // 새로 생성된 가이드의 생성 시간 저장
                guideCreatedAt.value = new Date().toISOString();

                console.log('✅ 가이드 생성 완료:', guideId.value);
            }

        } catch (error) {
            console.error('❌ 가이드 생성 실패:', error);
        } finally {
            isSaving.value = false;
        }
    };

    // ⭐ 가이드 저장 함수
    const saveGuide = async () => {
        if (!guideId.value) {
            console.warn('가이드 ID가 없습니다. 먼저 가이드를 생성해주세요.');
            return;
        }

        try {
            isSaving.value = true;
            hasUnsavedChanges.value = false;

            const saveRequest = {
                guideId: guideId.value,
                currentStep: currentStep.value,
                completionPercentage: overallProgress.value,
                // 저장 전에 DTO 형식으로 변환
                guideSteps: portfolioSteps.value.map(step => ({
                    stepNumber: parseInt(step.label),
                    stepTitle: step.topic,
                    stepProgress: step.progress,
                    items: step.items.map(item => ({
                        title: item.title,
                        content: item.userInput,  // ⭐
                        status: item.status
                    }))
                }))  // 현재 작성된 모든 내용
            };
            // console.log("💡 guideSteps 타입:", typeof portfolioSteps.value);
            // console.log("💡 guideSteps 실제 값:", portfolioSteps.value);

            const response = await portfolioGuideApi.saveGuide(saveRequest);
            // console.log("📌 저장 요청 payload:", JSON.stringify(saveRequest, null, 2));
            if (response.data) {
                lastSavedTime.value = new Date().toISOString();



                await saveTemporaryContent();

            }



        } catch (error) {
            console.error('❌ 가이드 저장 실패:', error);
            hasUnsavedChanges.value = true;
        } finally {
            isSaving.value = false;
        }
    };

    // ⭐ PDF 다운로드 함수 (핵심!)
    const downloadPortfolioPdf = async () => {
        if (!guideId.value) {
            alert('아직 가이드가 생성되지 않았습니다. 먼저 내용을 저장해주세요.');
            await createGuide();  // 가이드가 없으면 생성
            return;
        }

        // 저장되지 않은 변경사항이 있으면 먼저 저장
        if (hasUnsavedChanges.value) {
            await saveGuide();
        }

        try {
            console.log(`🔄 PDF 다운로드 시작 - guideId: ${guideId.value}`);

            // ⚡ Postman 테스트 URL: GET http://localhost:8080/portfolio-guide/123/pdf?memberId=1
            const response = await portfolioGuideApi.downloadGuidePdf(guideId.value, memberId.value);

            // ⚡ Blob 데이터를 파일로 다운로드 (검색 결과 기반 구현)
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `포트폴리오_가이드_${guideId.value}.pdf`);
            document.body.appendChild(fileLink);
            fileLink.click();

            // 메모리 정리
            document.body.removeChild(fileLink);
            window.URL.revokeObjectURL(fileURL);

            console.log('✅ PDF 다운로드 성공');

            showDownloadCompleteModal.value = true;

        } catch (error) {
            console.error('❌ PDF 다운로드 실패:', error);
            alert('PDF 다운로드에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // ⭐ 새 가이드 작성 (초기화 + 모달 닫기)
    const startNewGuide = async () => {
        showDownloadCompleteModal.value = false;
        await resetAllContent();
    };

    // ⭐ 목록으로 이동 (모달 닫기 + 라우팅)
    const goToList = () => {
        showDownloadCompleteModal.value = false;
        router.push('/resume/portfolio');
    };

    // ⭐ 수동 임시 저장 함수 (사용자가 직접 호출)
    const saveManually = async () => {
        if (!isGuideCreated.value) {
            await createGuide();
            if (!guideId.value) {
                console.error('❌ 가이드 생성 실패');
                alert('가이드 생성에 실패했습니다.');
                return;
            }

        }
        await saveGuide();
        // await saveTemporaryContent();
    };

    return {
        // 상태
        overallProgress,
        currentStep,
        portfolioSteps,
        openStepIndex,
        openItemIndex,
        showItemFeedback,
        currentAiFeedback,
        currentContent,
        selectedItem,
        selectedExample,
        selectedExampleIndex,
        originalContent,
        isAllComplete,
        aiLoading,
         showDownloadCompleteModal,
        // ⭐ 임시 저장 관련 상태
        isSaving,
        lastSavedTime,
        hasUnsavedChanges,

        // 사용자 정보
        memberId,
        guideId,
        isGuideCreated,
        userName,
        userEmail,
        jobGroup,
        jobRole,

        // 함수
        setUserInfoFromStore,
        isLoggedIn,
        currentUser,
        isPreviousStepComplete,
        toggleStep,
        toggleItem,
        cancelItemInput,
        cancelItemFeedback,
        submitItemContent,
        selectExample,
        useOriginalContent,
        applySelectedContent,
        completeItemWithoutFeedback,
        updateProgress,
        initializePortfolio,

        isResetting,
        showResetConfirm,
        guideCreatedAt,
        isExpired,

        confirmReset,
        resetAllContent,
        deleteGuide,
        editCompletedItem,
        checkAndHandleExpiration,
        clearTemporaryContent,

        // 가이드 생성 및 저장
        createGuide,
        saveGuide,
        downloadPortfolioPdf,

        // 임시 저장
        saveManually,
        startNewGuide,
        goToList,

        router
    };
}

// Named export로 변경
export { portfolioStepbystep };