// 포트폴리오 작성 도우미 페이지 컴포넌트용 js 파일
import portfolioGuideApi from "@/apis/portfolioGuideApi";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// 포트폴리오 작성 도우미
function portfolioStepbystep() {
    const router = useRouter();
    const store = useStore();
    // 전체 진행률 및 현재 단계
    const overallProgress = ref(0);
    const currentStep = ref(1);

    // 사용자 정보 (하드코딩 - DB 데이터)
    const memberId = ref(null);  // DB의 memberId
    const guideId = ref(null);   // DB의 guideId
    const userName = ref('');  // DB의 memberName
    const userEmail = ref('');  // DB의 email

    // 직군/직무 정보 (DB에서 가져온 값으로 하드코딩)
    const jobGroup = ref('개발');  // DB의 jobGroup
    const jobRole = ref('백엔드');  // DB의 jobRole

    const isLoggedIn = computed(() => store.getters['user/isLoggedIn']);
    const currentUser = computed(() => store.getters['user/userInfo']);
    // 포트폴리오 단계 (DB에서 가져올 데이터)
    const portfolioSteps = ref([]);

    // 아코디언 상태 관리
    const openStepIndex = ref(0); // 기본적으로 1단계 열림
    const openItemIndex = ref(null);
    const showItemFeedback = ref(Array(20).fill(false)); // 각 항목별 피드백 표시 여부
    const itemFeedbacks = ref(Array(20).fill("")); // 각 항목별 피드백 내용 (드롭다운용 간단 텍스트)
    const currentAiFeedback = ref(null); // AI 코치 패널용 상세 피드백 객체
    const currentContent = ref("");
    const selectedItem = ref(null);

    // 예시 선택 기능 관련 상태
    const selectedExample = ref(""); // 선택된 예시 내용
    const selectedExampleIndex = ref(null); // 선택된 예시의 인덱스
    const originalContent = ref(""); // 원본 작성 내용
    
    // AI 로딩 상태
    const aiLoading = ref(false);

    // 모든 단계가 100% 완료되었는지 확인하는 계산된 속성
    const isAllComplete = computed(() => {
        // 5단계가 존재하고 그 진행률이 100%인지 확인
        const stage5 = portfolioSteps.value.find(step => step.label === "5단계");
        
        // 모든 단계가 100%인지 확인
        const allStagesComplete = portfolioSteps.value.every(step => step.progress === 100);
        
        return stage5 && stage5.progress === 100 && allStagesComplete;
    });

    // 단계 토글
    const toggleStep = (step) => {
        const index = portfolioSteps.value.indexOf(step);
        openStepIndex.value = openStepIndex.value === index ? null : index;
        // 단계 변경 시 항목 초기화
        if (openStepIndex.value !== null) {
            currentStep.value = parseInt(portfolioSteps.value[openStepIndex.value].label);
        }
        openItemIndex.value = null;
    };

    // 항목 토글
    const toggleItem = (item, index) => {
        openItemIndex.value = openItemIndex.value === index ? null : index;
        selectedItem.value = item;
        
        // 기존 작성 내용이 있으면 로드
        if (openItemIndex.value !== null && !showItemFeedback.value[index]) {
            currentContent.value = item.userInput || "";
        }
    };

    // 입력 취소
    const cancelItemInput = (index) => {
        openItemIndex.value = null;
        currentContent.value = "";
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

            // 🔥 수정: 하드코딩된 값들을 명시적으로 포함
            const requestData = {
               userInput: currentContent.value,
                inputFieldType: currentItem.title,
                memberId: memberId.value,          // 🔥 실제 로그인된 사용자 ID
                jobGroup: jobGroup.value,          
                jobRole: jobRole.value,            
                careerYears: 2,                    
                currentStep: currentStep.value  
            };

            console.log('🚀 AI 피드백 요청 (하드코딩 포함):', requestData);

            // 실시간 코칭 API 호출 (POST /portfolio-guide/coaching)
            const response = await portfolioGuideApi.getRealtimeCoaching(requestData);


            if (response.data) {
                const feedback = response.data;
                
                // 피드백 표시g
                showItemFeedback.value[index] = true;

                // AI 코치 패널에 표시할 상세 피드백 (전체 객체)
                currentAiFeedback.value = feedback;

                // 초기 선택 상태 리셋
                selectedExample.value = "";
                selectedExampleIndex.value = null;

                // 사용자 입력을 임시 저장 (아직 완료되지 않음)
                currentItem.feedback = feedback; // 전체 피드백 객체 저장

                console.log('✅ AI 피드백 수신 완료');
            }
        } catch (error) {
            console.error('❌ API 호출 중 오류:', error);
            console.error('상태 코드:', error.response?.status);
            console.error('응답 헤더:', error.response?.headers);
            console.error('에러 상세:', error.response?.data || error.message);

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
        console.log('🎯 예시 선택:', { index, exampleText });
    };

    // 원본 내용 사용
    const useOriginalContent = (itemIndex) => {
        selectedExample.value = originalContent.value;
        selectedExampleIndex.value = null;
        console.log('📝 원본 내용 사용:', originalContent.value);
    };

    // 선택된 내용 적용
    const applySelectedContent = (itemIndex) => {
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
        
        alert('✅ 내용이 성공적으로 적용되었습니다!');
    };

    // 피드백 없이 바로 완료하는 함수
    const completeItemWithoutFeedback = (index) => {
        // 해당 항목 상태 '완료'로 업데이트
        portfolioSteps.value[openStepIndex.value].items[index].status = '완료';
        
        // 사용자 입력 저장  
        portfolioSteps.value[openStepIndex.value].items[index].userInput = currentContent.value;
        
        // 단계 진행률 업데이트
        updateProgress();
        
        // 입력창 닫기
        openItemIndex.value = null;
        currentContent.value = "";
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
    };

    // DB에서 포트폴리오 가이드 표준 데이터 가져오기
    const fetchPortfolioStandards = async () => {
        try {
            // 직군/직무별 평가 기준 조회
            const response = await portfolioGuideApi.getStandardsByJob(jobGroup.value, jobRole.value);
            
            if (response.data) {
                const standards = response.data;
                console.log('표준 데이터:', standards);
                
                // DB에서 받은 데이터를 포트폴리오 단계 형식으로 변환
                if (Array.isArray(standards) && standards.length > 0) {
                    portfolioSteps.value = transformStandardsToSteps(standards);
                } else {
                    // 데이터가 없으면 전체 표준 데이터 조회
                    await fetchAllStandards();
                }
            }
        } catch (error) {
            console.error('표준 데이터 조회 중 오류:', error);
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
                console.log('전체 표준 데이터:', standards);
                
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

    // DB 데이터를 화면 형식으로 변환
    const transformStandardsToSteps = (standards) => {
        console.log('🔍 받은 standards 데이터:', standards);

        const stepMap = {};

        standards.forEach(standard => {
            console.log('📋 처리 중인 standard:', standard);
            console.log('📋 evaluationItems 타입:', typeof standard.evaluationItems);
            console.log('📋 evaluationItems 내용:', standard.evaluationItems);

            // standardName을 파싱하여 단계 정보 추출
            const stepNum = standard.standardId || 1;
            const stepTopic = standard.standardName || '단계';

            if (!stepMap[stepNum]) {
                stepMap[stepNum] = {
                    label: `${stepNum}단계`,
                    topic: stepTopic,
                    progress: 0,
                    items: [],
                    standardId: standard.standardId,
                    description: standard.description,
                    promptTemplate: standard.promptTemplate,
                    weightPercentage: standard.weightPercentage
                };
            }

            // evaluationItems가 문자열인 경우 JSON 파싱
            let evaluationItems = standard.evaluationItems;
            if (typeof evaluationItems === 'string') {
                try {
                    evaluationItems = JSON.parse(evaluationItems);
                    console.log('✅ JSON 파싱 완료:', evaluationItems);
                } catch (e) {
                    console.error('❌ JSON 파싱 실패:', e);
                    evaluationItems = null;
                }
            }

            // evaluationItems (JSONB)를 파싱하여 항목 생성
            if (evaluationItems && typeof evaluationItems === 'object') {
                const itemKeys = Object.keys(evaluationItems);
                console.log(`📌 ${stepTopic}의 항목 개수: ${itemKeys.length}개`, itemKeys);

                itemKeys.forEach((itemKey) => {
                    const item = evaluationItems[itemKey];
                    console.log(`  ➡️ ${itemKey}:`, item);

                    stepMap[stepNum].items.push({
                        title: item.description || itemKey,
                        description: standard.standardDescription || standard.description || '',
                        status: '미작성',
                        placeholder: `${item.description || itemKey}을(를) 입력하세요`,
                        imageUpload: false,
                        userInput: '',
                        weight: item.weight || 0,
                        standardId: standard.standardId,
                        evaluationKey: itemKey
                    });
                });
            } else {
                console.warn('⚠️ evaluationItems가 없거나 형식이 잘못됨:', standard.standardId);
            }
        });
        
        // 배열로 변환
        const steps = Object.keys(stepMap)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(key => stepMap[key]);
        
        // 항목이 없는 단계는 기본 항목 추가
        steps.forEach(step => {
            if (step.items.length === 0) {
                step.items.push({
                    title: step.topic,
                    description: step.description || '',
                    status: '미작성',
                    placeholder: `${step.topic}에 대해 작성하세요`,
                    imageUpload: false,
                    userInput: '',
                    weight: 0
                });
            }
        });
        
        console.log('✅ 변환된 단계 데이터:', steps);
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

    // 가이드 정보 조회
    const fetchGuideInfo = async () => {
        try {
            const response = await portfolioGuideApi.getGuideById(guideId.value);

            if (response.data) {
                console.log('✅ 가이드 정보 조회 성공:', response.data);
                // 가이드 정보를 사용하여 필요한 설정 수행
            }
        } catch (error) {
            console.error('❌ 가이드 정보 조회 실패:', error);
        }
    };

    // 회원별 가이드 목록 조회
    const fetchMemberGuides = async () => {
        try {
            const response = await portfolioGuideApi.getGuidesByMember(memberId.value);

            if (response.data) {
                console.log('✅ 회원 가이드 목록 조회 성공:', response.data);
                // 가이드 목록을 사용하여 UI 업데이트 등
            }
        } catch (error) {
            console.error('❌ 회원 가이드 목록 조회 실패:', error);
        }
    };

    // 저장된 가이드 피드백 조회
    const fetchSavedFeedback = async () => {
        try {
            const response = await portfolioGuideApi.getGuideFeedback(guideId.value);

            if (response.data) {
                console.log('✅ 저장된 피드백 조회 성공:', response.data);

                // 저장된 피드백 (JSON 객체)를 UI에 표시
                const savedFeedback = response.data;

                // 프론트엔드에서 피드백 텍스트 렌더링
                const feedbackText = formatFeedbackAsText(savedFeedback);

                // 현재 단계에 피드백 표시 (임시로 첫 번째 항목에 표시)
                if (portfolioSteps.value.length > 0 && portfolioSteps.value[0].items.length > 0) {
                    itemFeedbacks.value[0] = feedbackText;
                }

                return savedFeedback;
            }
        } catch (error) {
            console.error('❌ 저장된 피드백 조회 실패:', error);
            return null;
        }
    };

    /**
     * 백엔드에서 받은 피드백 JSON 데이터를 읽기 쉬운 텍스트로 변환
     * 프론트엔드에서 UI 렌더링을 담당
     * @param {Object} feedback - PortfolioGuideResult 객체
     * @returns {string} 포맷된 피드백 텍스트
     */
    const formatFeedbackAsText = (feedback) => {
        if (!feedback) {
            return "저장된 피드백이 없습니다.";
        }

        let text = "\n───── AI 코칭 피드백 ─────\n\n";

        // 1. 적절성 점수 출력 (0-100점)
        if (feedback.appropriatenessScore !== null && feedback.appropriatenessScore !== undefined) {
            text += `📊 적절성 점수: ${feedback.appropriatenessScore}/100점\n\n`;
        }

        // 2. 코칭 메시지 출력
        if (feedback.coachingMessage && feedback.coachingMessage.trim()) {
            text += `💬 코칭 메시지:\n${feedback.coachingMessage}\n\n`;
        }

        // 3. 개선 제안 사항 리스트 출력
        if (feedback.suggestions && Array.isArray(feedback.suggestions) && feedback.suggestions.length > 0) {
            text += "💡 개선 제안 사항:\n";
            feedback.suggestions.forEach((suggestion, index) => {
                text += `  ${index + 1}. ${suggestion}\n`;
            });
            text += "\n";
        }

        // 4. 작성 예시 리스트 출력
        if (feedback.examples && Array.isArray(feedback.examples) && feedback.examples.length > 0) {
            text += "✨ 작성 예시:\n";
            feedback.examples.forEach((example, index) => {
                text += `  예시 ${index + 1}: ${example}\n`;
            });
            text += "\n";
        }

        // 5. 다음 작성해야 할 단계 안내
        if (feedback.nextStepGuide && feedback.nextStepGuide.trim()) {
            text += `🚀 다음 단계:\n${feedback.nextStepGuide}\n\n`;
        }

        // 6. 전체 포트폴리오 진행률 표시
        if (feedback.progressPercentage !== null && feedback.progressPercentage !== undefined) {
            text += `📈 진행률: ${feedback.progressPercentage}%\n\n`;
        }

        text += "──────────────────\n";

        return text;
    };

const setUserInfoFromStore = () => {
        console.log('🔍 Vuex store에서 사용자 정보 확인 중...');
        
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

        console.log('✅ 사용자 정보 설정 완료:', {
            memberId: memberId.value,
            userName: userName.value,
            userEmail: userEmail.value
        });

        return true;
    };


    // 초기화 함수
    const initializePortfolio = async () => {

        if (!setUserInfoFromStore()) {
            return; // 로그인되지 않았으면 중단
        }
        openStepIndex.value = 0;

        // 표준 데이터 로드
        await fetchPortfolioStandards();

        // 가이드 정보 로드 (선택적 - 실패해도 계속 진행)
        fetchGuideInfo().catch(err => console.warn('가이드 정보 없음:', err));
        fetchMemberGuides().catch(err => console.warn('회원 가이드 목록 없음:', err));

        // 저장된 피드백 로드 (선택적)
        fetchSavedFeedback().catch(err => console.warn('저장된 피드백 없음:', err));
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
        
        // 사용자 정보
        memberId,
        guideId,
        userName,
        userEmail,
        jobGroup,
        jobRole,
        
        // 함수
        setUserInfoFromStore,
        isLoggedIn,
        currentUser,
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
        fetchPortfolioStandards,
        fetchAllStandards,
        transformStandardsToSteps,
        loadDefaultSteps,
        fetchGuideInfo,
        fetchMemberGuides,
        fetchSavedFeedback,
        formatFeedbackAsText,
        initializePortfolio,
        router
    };
}

// Named export로 변경
export { portfolioStepbystep };
