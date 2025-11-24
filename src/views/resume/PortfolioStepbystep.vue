<template>
  <div class="portfolio-write container py-4">
    <div class="d-flex justify-content-between align-items-end mb-1">
      <div>
        <h1 class="fw-bold fs-3 mb-1" style="color:#111111;">포트폴리오 작성 도우미</h1>
        <p class="subtitle1">취업 준비 · 작성 진행률: {{ overallProgress }}%</p>
      </div>
      <div class="fs-5">{{ overallProgress }}% 전체 진행률</div>
    </div>

    <div class="row g-4 align-items-start">
      <!-- 왼쪽 영역 -->
      <div class="col-lg-8">
        <!-- 단계별 아코디언 -->
        <div class="mb-4 mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="subtitle2">포트폴리오 작성 단계</h5>
            <span class="text-muted small">{{ currentStep }}단계 진행 중</span>
          </div>

          <!-- 단계별 아코디언 -->
          <div v-for="(step, index) in portfolioSteps" :key="index" class="step-accordion mb-3">
            <div class="step-header" @click="toggleStep(step)" :class="{ 'active': openStepIndex === index }">
              <div class="d-flex align-items-center">
                <span class="step-icon" :class="{ complete: step.progress === 100, ongoing: step.progress > 0 && step.progress < 100 }">
                  <i v-if="step.progress === 100">✔</i>
                  <i v-else-if="step.progress > 0">🏴󠁡󠁴󠀱󠁿</i>
                  <i v-else>🏴󠁡󠁴󠀱󠁿</i>
                </span>
                <div class="ms-2 flex-grow-1">
                  <span class="fw-semibold">{{ step.label }}</span>
                  <span class="text-muted ms-2 small">{{ step.topic }}</span>
                </div>
                <span class="fw-semibold me-2">{{ step.progress }}%</span>
                <span class="accordion-icon">
                  <i v-if="openStepIndex === index">▲</i>
                  <i v-else>▼</i>
                </span>
              </div>

              <div class="progress custom-progress mt-2">
                <div class="progress-bar" role="progressbar" :style="{
                  width: step.progress + '%',
                  backgroundColor:
                    step.progress === 100
                      ? '#71EBBE'
                      : step.progress > 0
                        ? '#A2F1D6'
                        : '#E5E7EB',
                }"></div>
              </div>
            </div>

            <!-- 단계 내용 (드롭다운) -->
            <div class="step-content" v-if="openStepIndex === index">
              <div class="p-4 bg-white rounded-bottom-4 shadow-sm">
                <p class="text-muted small mb-3">
                  💡 아래 항목을 차례로 작성하여 포트폴리오를 완성하세요
                </p>

                <!-- 항목 아코디언 -->
                <div v-for="(item, itemIndex) in step.items" :key="itemIndex" class="item-accordion mb-3">
                  <div class="item-header" @click="toggleItem(item, itemIndex)" 
                       :class="{ 'active': openItemIndex === itemIndex && openStepIndex === index }">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <span class="fw-semibold">{{ item.title }}</span>
                        <span class="text-muted ms-2 small">{{ item.description }}</span>
                      </div>
                      <div class="d-flex align-items-center">
                        <span v-if="item.userInput && item.userInput.trim()" class="text-success me-2 small">
                          <i class="bi bi-check-circle-fill me-1"></i>작성됨
                        </span>
                        <span class="status-badge me-2" :class="{
                          done: item.status === '완료',
                          ongoing: item.status === '작성 중',
                          planned: item.status === '미작성',
                        }">
                          {{ item.status }}
                        </span>
                        <span class="accordion-icon-sm">
                          <i v-if="openItemIndex === itemIndex && openStepIndex === index">▲</i>
                          <i v-else>▼</i>
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 항목 입력 폼 -->
                  <div class="item-content p-3 bg-light rounded-3" 
                       v-if="openItemIndex === itemIndex && openStepIndex === index && !showItemFeedback[itemIndex]">
                    
                    <!-- 기존 저장된 내용 표시 -->
                    <div v-if="item.userInput && item.userInput.trim()" class="mb-2 p-2 bg-info-light rounded">
                      <small class="text-primary fw-bold">📝 현재 저장된 내용:</small>
                      <div class="mt-1 small">{{ item.userInput }}</div>
                    </div>

                    <textarea v-model="currentContent" rows="5" class="form-control mb-3" 
                              :placeholder="item.placeholder"></textarea>
                    
                    <div v-if="item.imageUpload" class="mb-3">
                      <input type="file" class="form-control" accept="image/*">
                    </div>

                    <div class="d-flex justify-content-end">
                      <button class="btn btn-outline-secondary me-2" @click="cancelItemInput(itemIndex)">취소</button>

                       <button class="btn btn-dark" style="height: 37px;" @click="completeItemWithoutFeedback(itemIndex)">
                          {{ openStepIndex === 0 ? '완료하기' : '바로 완료하기' }}
                        </button>
                        <!-- 1단계(인덱스 0)가 아닐 때만 AI 피드백 버튼 표시 -->
                        <button v-if="openStepIndex !== 0" class="btn btn-mint ms-2" style="height: 37px;" @click="submitItemContent(itemIndex)">
                          ⚡ AI 피드백 받기
                        </button>
                    </div>
                  </div>

                  <!-- 항목 피드백 결과 (수정된 부분 - 예시 포함) -->
                  <div class="item-feedback p-3 bg-light-mint rounded-3" 
                       v-if="openItemIndex === itemIndex && openStepIndex === index && showItemFeedback[itemIndex]">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="fw-bold mb-0">✨ AI 피드백 결과</h6>
                      <button class="btn-close btn-sm" @click="cancelItemFeedback(itemIndex)" aria-label="Close"></button>
                    </div>
                    
                    <!-- 점수 표시 -->
                    <div v-if="currentAiFeedback?.appropriatenessScore" class="feedback-score mb-3">
                      <span class="badge bg-success">적절성 {{ currentAiFeedback.appropriatenessScore }}점</span>
                    </div>

                    <!-- 원본 작성 내용 표시 -->
                    <div class="mb-3 p-2 bg-white border rounded">
                      <h6 class="feedback-subtitle mb-2">📝 작성하신 내용</h6>
                      <div class="user-content">{{ originalContent }}</div>
                    </div>

                    <!-- 코칭 메시지 -->
                    <div v-if="currentAiFeedback?.coachingMessage" class="mb-3">
                      <h6 class="feedback-subtitle">💬 AI 코칭 메시지</h6>
                      <div class="feedback-content">
                        {{ currentAiFeedback.coachingMessage }}
                      </div>
                    </div>

                    <!-- 예시 선택 기능 -->
                    <div v-if="currentAiFeedback?.examples && currentAiFeedback.examples.length > 0" class="mb-3">
                      <h6 class="feedback-subtitle">💡 개선된 작성 예시 (하나를 선택하세요)</h6>
                      <div class="examples-selection-container">
                        <div v-for="(example, exampleIndex) in currentAiFeedback.examples" 
                             :key="exampleIndex" 
                             class="example-selection-card mb-3"
                             :class="{ 'selected': selectedExampleIndex === exampleIndex }">
                          <div class="example-header d-flex justify-content-between align-items-start">
                            <div class="example-info">
                              <i class="bi bi-lightbulb-fill text-warning me-2"></i>
                              <span class="example-label">개선 예시 {{ exampleIndex + 1 }}</span>
                            </div>
                            <button 
                              class="btn btn-sm"
                              :class="selectedExampleIndex === exampleIndex ? 'btn-success' : 'btn-outline-primary'"
                              @click="selectExample(exampleIndex, example)">
                              <i v-if="selectedExampleIndex === exampleIndex" class="bi bi-check-circle-fill me-1"></i>
                              <i v-else class="bi bi-hand-index me-1"></i>
                              {{ selectedExampleIndex === exampleIndex ? '선택됨' : '선택하기' }}
                            </button>
                          </div>
                          <div class="example-content mt-2">
                            "{{ example }}"
                          </div>
                        </div>
                        
                        <!-- 선택된 예시 미리보기 -->
                        <div v-if="selectedExample" class="selected-preview mt-3 p-3 border border-success rounded bg-success-light">
                          <h6 class="text-success fw-bold mb-2">
                            <i class="bi bi-check-circle-fill me-2"></i>선택된 내용
                          </h6>
                          <div class="preview-content">{{ selectedExample }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- 개선 제안 -->
                    <div v-if="currentAiFeedback?.suggestions && currentAiFeedback.suggestions.length > 0" class="mb-3">
                      <h6 class="feedback-subtitle">🎯 개선 제안</h6>
                      <div class="suggestions-list">
                        <div v-for="(suggestion, sugIndex) in currentAiFeedback.suggestions" 
                             :key="sugIndex" 
                             class="suggestion-item">
                          <i class="bi bi-arrow-right-circle text-primary me-2"></i>
                          {{ suggestion }}
                        </div>
                      </div>
                    </div>

                    <!-- 다음 단계 가이드 -->
                    <div v-if="currentAiFeedback?.nextStepGuide" class="mb-3">
                      <h6 class="feedback-subtitle">🚀 다음 단계</h6>
                      <div class="next-step-content">
                        {{ currentAiFeedback.nextStepGuide }}
                      </div>
                    </div>

                    <!-- 버튼 영역 -->
                    <div class="d-flex justify-content-between pt-3 border-top">
                      <button class="btn btn-outline-secondary" @click="cancelItemFeedback(itemIndex)">
                        <i class="bi bi-x-circle me-1"></i>닫기
                      </button>
                      <div class="d-flex">
                        <button class="btn btn-outline-primary me-2" @click="useOriginalContent(itemIndex)">
                          <i class="bi bi-arrow-return-left me-1"></i>원본 사용
                        </button>
                        <button class="btn btn-primary" 
                                @click="applySelectedContent(itemIndex)"
                                :disabled="!selectedExample && !originalContent">
                          <i class="bi bi-check-circle me-1"></i>
                          {{ selectedExample ? '선택한 예시 적용' : '원본 내용 적용' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 영역 (AI 코치) -->
      <div class="col-lg-4">
        <div class="ai-coach-box shadow-sm p-4 rounded-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">
              🤖 AI 코치 피드백
            </h6>
            <span class="badge bg-light text-dark">실시간</span>
          </div>
          
          <div v-if="selectedItem && showItemFeedback[openItemIndex]" class="ai-feedback">
            <div class="feedback-header mb-3 pb-2 border-bottom">
              <p class="fw-semibold mb-1">{{ selectedItem.title }} 분석 결과</p>
              <div class="d-flex align-items-center">
                <div class="score-pill me-2 bg-success-light">
                  적절성 {{ currentAiFeedback?.appropriatenessScore || 0 }}점
                </div>
                <div class="feedback-section-inline" v-if="currentAiFeedback?.examples && currentAiFeedback.examples.length > 0">
                  <h6 class="feedback-title-inline mb-0">✨ 작성 예시</h6>
                </div>
              </div>
            </div>

          
            
            <div class="feedback-section mb-4" v-if="currentAiFeedback?.coachingMessage">
              <h6 class="feedback-title">💬 AI 코칭 메시지</h6>
              <p class="feedback-text">{{ currentAiFeedback.coachingMessage }}</p>
            </div>
            
            <div class="feedback-section mb-4" v-if="currentAiFeedback?.suggestions && currentAiFeedback.suggestions.length > 0">
              <h6 class="feedback-title">💡 개선 제안</h6>
              <ul class="feedback-list">
                <li v-for="(suggestion, idx) in currentAiFeedback.suggestions" :key="idx">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
            
            <div class="feedback-section" v-if="currentAiFeedback?.nextStepGuide">
              <h6 class="feedback-title">🎯 다음 단계 가이드</h6>
              <p class="feedback-text">{{ currentAiFeedback.nextStepGuide }}</p>
            </div>
            
            
          </div>
          
          <div v-else class="text-center text-muted py-5">
            <p>왼쪽에서 작성할 항목을 선택하고<br />AI 피드백을 요청하면 분석 결과가 표시됩니다 🧠</p>
            <p class="small mt-4">AI가 분석한 내용을 참고하여<br />더 효과적인 포트폴리오로 발전시켜 보세요!</p>
          </div>
        </div>
      </div>
    </div>
  </div>

 <!-- 페이지 하단에 등록 버튼 영역 추가 -->
    <div class="registration-button mt-1 mb-1">
      <div v-if="!isAllComplete" class="warning-message mb-3 p-3 rounded-3 bg-warning-light">
        <p class="mb-0">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          완전하지 않은 상태로 등록 시 코칭 결과가 부정확할 수 있습니다.
        </p>
      </div>
      <button class="btn btn-mint w-100 py-3 fw-bold"  :class="isAllComplete ? 'btn-mint' : 'btn-outline-secondary'"
      @click="router.push('/resume/portfolio/write')">
        <i class="bi bi-check-circle me-2"></i>
        포트폴리오 파일올리기
      </button>
    </div>
  
</template>

<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import portfolioGuideApi from "@/apis/portfolioGuideApi";

// 전체 진행률
const overallProgress = ref(0);
const currentStep = ref(1);
const router = useRouter();

// 사용자 정보 (하드코딩 - DB 데이터: memberId=1, username="user123", jobGroup="개발", jobRole="백엔드")
const memberId = ref(1);  // DB의 memberId
const guideId = ref(2);   // DB의 guideId
const userName = ref('사용자1');  // DB의 memberName
const userEmail = ref('user@test.com');  // DB의 email

// 직군/직무 정보 (DB에서 가져온 값으로 하드코딩)
const jobGroup = ref('개발');  // DB의 jobGroup
const jobRole = ref('백엔드');  // DB의 jobRole

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

// 단계 토글
function toggleStep(step) {
  const index = portfolioSteps.value.indexOf(step);
  openStepIndex.value = openStepIndex.value === index ? null : index;
  // 단계 변경 시 항목 초기화
  if (openStepIndex.value !== null) {
    currentStep.value = parseInt(portfolioSteps.value[openStepIndex.value].label);
  }
  openItemIndex.value = null;
}

// 항목 토글
function toggleItem(item, index) {
  openItemIndex.value = openItemIndex.value === index ? null : index;
  selectedItem.value = item;
  
  // 기존 작성 내용이 있으면 로드
  if (openItemIndex.value !== null && !showItemFeedback.value[index]) {
    currentContent.value = item.userInput || "";
  }
}

// 입력 취소
function cancelItemInput(index) {
  openItemIndex.value = null;
  currentContent.value = "";
}

// 피드백 초기화
function cancelItemFeedback(index) {
  showItemFeedback.value[index] = false;
  currentAiFeedback.value = null;
  selectedExample.value = "";
  selectedExampleIndex.value = null;
  originalContent.value = "";
}

// AI 피드백 요청
async function submitItemContent(index) {
  try {
    const currentItem = portfolioSteps.value[openStepIndex.value].items[index];

    // 입력값 검증
    if (!currentContent.value || currentContent.value.trim() === '') {
      alert('내용을 입력해주세요.');
      return;
    }

    // 원본 내용 저장 (나중에 복원을 위해)
    originalContent.value = currentContent.value;

    // test-example API 요청 데이터
    const requestData = {
      userInput: currentContent.value,
      inputFieldType: currentItem.title
    };

    console.log('🚀 AI 피드백 요청 (test-example):', requestData);

    // test-example API 호출
    const response = await portfolioGuideApi.getTestExample(requestData);

    console.log('✅ AI 피드백 응답 (전체):', response);
    console.log('✅ AI 피드백 응답 (data):', response.data);

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
      errorMessage += '서버로부터 응답이 없습니다.\n백엔드 서버(http://localhost:8080)가 실행 중인지 확인해주세요.';
    } else {
      errorMessage += error.message;
    }

    alert(errorMessage);
  }
}

// 예시 선택 함수
function selectExample(index, exampleText) {
  selectedExampleIndex.value = index;
  selectedExample.value = exampleText;
  console.log('🎯 예시 선택:', { index, exampleText });
}

// 원본 내용 사용
function useOriginalContent(itemIndex) {
  selectedExample.value = originalContent.value;
  selectedExampleIndex.value = null;
  console.log('📝 원본 내용 사용:', originalContent.value);
}

// 선택된 내용 적용
function applySelectedContent(itemIndex) {
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
}

// 피드백 반영 (기존 함수 - 호환성 유지)
function applyItemFeedback(index) {
  applySelectedContent(index);
}

// 피드백 없이 바로 완료하는 함수
function completeItemWithoutFeedback(index) {
  // 해당 항목 상태 '완료'로 업데이트
  portfolioSteps.value[openStepIndex.value].items[index].status = '완료';
  
  // 사용자 입력 저장
  portfolioSteps.value[openStepIndex.value].items[index].userInput = currentContent.value;
  
  // 단계 진행률 업데이트
  updateProgress();
  
  // 입력창 닫기
  openItemIndex.value = null;
  currentContent.value = "";
}

// 진행률 업데이트
function updateProgress() {
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
}

// 모든 단계가 100% 완료되었는지 확인하는 계산된 속성 추가
const isAllComplete = computed(() => {
  // 5단계가 존재하고 그 진행률이 100%인지 확인
  const stage5 = portfolioSteps.value.find(step => step.label === "5단계");
  
  // 모든 단계가 100%인지 확인
  const allStagesComplete = portfolioSteps.value.every(step => step.progress === 100);
  
  return stage5 && stage5.progress === 100 && allStagesComplete;
});

// DB에서 포트폴리오 가이드 표준 데이터 가져오기
async function fetchPortfolioStandards() {
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
}

// 전체 평가 기준 조회 (대체 방법)
async function fetchAllStandards() {
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
}

// DB 데이터를 화면 형식으로 변환
function transformStandardsToSteps(standards) {
  // PortfolioStandard 객체 구조에 맞게 변환
  // standardId, standardName, jobGroup, jobRole, description, weightPercentage, evaluationItems (JSONB), scoreRangeDescription (JSONB)

  console.log('🔍 받은 standards 데이터:', standards);

  const stepMap = {};

  standards.forEach(standard => {
    console.log('📋 처리 중인 standard:', standard);
    console.log('📋 evaluationItems 타입:', typeof standard.evaluationItems);
    console.log('📋 evaluationItems 내용:', standard.evaluationItems);

    // standardName을 파싱하여 단계 정보 추출 (예: "프로젝트 개요", "기술적 구현" 등)
    // 백엔드 데이터에는 "1단계:"가 없으므로 standardId를 기준으로 단계 번호 설정
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
    // evaluationItems 형식: { "clarity": {"weight": 30, "description": "..."}, "technical_stack": {...}, ... }
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
}

// 기본 데이터 로드 (API 실패 시 사용)
function loadDefaultSteps() {
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
}

// 가이드 정보 조회
async function fetchGuideInfo() {
  try {
    const response = await portfolioGuideApi.getGuideById(guideId.value);

    if (response.data) {
      console.log('✅ 가이드 정보 조회 성공:', response.data);
      // 가이드 정보를 사용하여 필요한 설정 수행
      // 예: jobGroup, jobRole 등
    }
  } catch (error) {
    console.error('❌ 가이드 정보 조회 실패:', error);
  }
}

// 회원별 가이드 목록 조회
async function fetchMemberGuides() {
  try {
    const response = await portfolioGuideApi.getGuidesByMember(memberId.value);

    if (response.data) {
      console.log('✅ 회원 가이드 목록 조회 성공:', response.data);
      // 가이드 목록을 사용하여 UI 업데이트 등
    }
  } catch (error) {
    console.error('❌ 회원 가이드 목록 조회 실패:', error);
  }
}

// 저장된 가이드 피드백 조회
async function fetchSavedFeedback() {
  try {
    const response = await portfolioGuideApi.getGuideFeedback(guideId.value);

    if (response.data) {
      console.log('✅ 저장된 피드백 조회 성공:', response.data);

      // 저장된 피드백을 UI에 표시
      // response.data 구조: PortfolioGuideResult
      const savedFeedback = response.data;

      // 피드백 텍스트 생성
      let feedbackText = '';

      if (savedFeedback.coachingMessage) {
        feedbackText = savedFeedback.coachingMessage;
      }

      // 점수 추가
      if (savedFeedback.appropriatenessScore) {
        feedbackText = `[점수: ${savedFeedback.appropriatenessScore}점]\n\n${feedbackText}`;
      }

      // 제안사항 추가
      if (savedFeedback.suggestions && Array.isArray(savedFeedback.suggestions)) {
        feedbackText += '\n\n📌 개선 제안:\n' + savedFeedback.suggestions.map(s => `• ${s}`).join('\n');
      }

      // 다음 단계 가이드 추가
      if (savedFeedback.nextStepGuide) {
        feedbackText += '\n\n🎯 다음 단계:\n' + savedFeedback.nextStepGuide;
      }

      // 예시 추가
      if (savedFeedback.examples && Array.isArray(savedFeedback.examples)) {
        feedbackText += '\n\n💡 작성 예시:\n' + savedFeedback.examples.map(e => `"${e}"`).join('\n\n');
      }

      // 현재 단계에 피드백 표시 (임시로 첫 번째 항목에 표시)
      if (portfolioSteps.value.length > 0 && portfolioSteps.value[0].items.length > 0) {
        itemFeedbacks.value[0] = feedbackText;
        // showItemFeedback.value[0] = true; // 자동으로 표시하려면 주석 해제
      }

      return savedFeedback;
    }
  } catch (error) {
    console.error('❌ 저장된 피드백 조회 실패:', error);
    return null;
  }
}

// 초기 설정 - 1단계 열기 및 데이터 로드
onMounted(async () => {
  openStepIndex.value = 0;

  // 표준 데이터 로드
  await fetchPortfolioStandards();

  // 가이드 정보 로드 (선택적 - 실패해도 계속 진행)
  // fetchGuideInfo().catch(err => console.warn('가이드 정보 없음:', err));
  // fetchMemberGuides().catch(err => console.warn('회원 가이드 목록 없음:', err));

  // 저장된 피드백 로드 (선택적)
  fetchSavedFeedback().catch(err => console.warn('저장된 피드백 없음:', err));
});
</script>

<style scoped>
.portfolio-write {
  color: #111;
}

.subtitle1 {
    color: #6c757d;
    font-size: 1rem;
    margin-bottom: 0px;
}

.subtitle2 {
    color: #6c757d;
    font-size: 1rem;
    margin-bottom: 0px;
    font-weight: 700;
}

/* 아코디언 스타일 */
.step-accordion {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.step-header {
  background-color: white;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.step-header:hover {
  background-color: #f0fdf4;
}

.step-header.active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: #f0fdf4;
  border-color: #A2F1D6;
}

.step-content {
  border: 1px solid #A2F1D6;
  border-top: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* 항목 아코디언 */
.item-accordion {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.item-header {
  background-color: white;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.item-header:hover {
  background-color: #f8fafc;
}

.item-header.active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: #f8fafc;
  border-color: #A2F1D6;
}

.item-content, .item-feedback {
  border: 1px solid #e5e7eb;
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.step-icon {
  font-size: 1.2rem;
  color: #9ca3af;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.step-icon.complete {
  color: #4cd3a3;
}

.accordion-icon, .accordion-icon-sm {
  font-size: 0.8rem;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.accordion-icon-sm {
  font-size: 0.7rem;
}

/* 프로그레스 바 */
.custom-progress {
  height: 8px;
  border-radius: 4px;
  background-color: #f3f4f6;
}

.custom-progress .progress-bar {
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 상태 배지 */
.status-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.status-badge.done {
  background: #ecfdf5;
  color: #059669;
}

.status-badge.ongoing {
  background: #eef2ff;
  color: #4f46e5;
}

.status-badge.planned {
  background: #f3f4f6;
  color: #6b7280;
}

/* 오른쪽 AI 코치 */
.ai-coach-box {
  background: white;
  border: 1px solid #e5e7eb;
  min-height: 600px;
  transition: 0.3s;
  margin-top: 64px;
}

/* 피드백 스타일 */
.feedback-header {
  margin-bottom: 15px;
}

.score-pill {
  display: inline-flex; /* inline-block에서 inline-flex로 변경 */
  align-items: center; /* 수직 중앙 정렬 추가 */
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 10px;
  height: 37px;
  justify-content: center; /* 수평 중앙 정렬 - 기존 유지 */
}
.bg-success-light {
  background-color: #ecfdf5;
  color: #059669;
}

.bg-info-light {
  background-color: #eff6ff;
  color: #3b82f6;
}

.bg-warning-light {
  background-color: #fffbeb;
  color: #d97706;
}

.feedback-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.feedback-title-inline {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  margin-left: 8px;
}

.feedback-section-inline {
  display: inline-flex;
  align-items: center;
}

.feedback-list {
  padding-left: 20px;
  margin-bottom: 0;
}

.feedback-list li {
  margin-bottom: 5px;
  font-size: 0.85rem;
}

.feedback-list .example-item {
  margin-bottom: 8px;
  color: #4b5563;
  font-style: italic;
  line-height: 1.6;
}

.feedback-text {
  font-size: 0.85rem;
  line-height: 1.5;
}

.bg-light-mint {
  background-color: #F0FDF4 !important;
}

.btn-mint {
  background-color: #A2F1D6;
  border: none;
  color: #111;
  font-weight: 600;
}

.btn-mint:hover {
  background-color: #71EBBE;
}

.registration-button {
  max-width: 800px;
  margin: 0 auto;
}

.registration-button2 {
  background-color: #71EBBE;
}

/* 🔥 새로 추가된 스타일: 드롭다운 예시 영역 */
.feedback-subtitle {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.feedback-content {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.5;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #A2F1D6;
}

/* 예시 카드 스타일 */
.examples-dropdown-container {
  margin-top: 8px;
}

.example-item-dropdown {
  transition: all 0.2s ease;
}

.example-card {
  background-color: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s ease;
}

.example-card:hover {
  background-color: #f0fdf4;
  border-color: #A2F1D6;
  box-shadow: 0 2px 4px rgba(162, 241, 214, 0.1);
}

.example-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.example-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.example-content {
  font-size: 0.8rem;
  color: #1f2937;
  line-height: 1.4;
  font-style: italic;
  padding-left: 4px;
}

/* 예시 선택 관련 스타일 */
.examples-selection-container {
  margin-top: 12px;
}

.example-selection-card {
  background-color: #fafafa;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.example-selection-card:hover {
  border-color: #A2F1D6;
  background-color: #f0fdf4;
}

.example-selection-card.selected {
  border-color: #71EBBE;
  background-color: #ecfdf5;
  box-shadow: 0 4px 12px rgba(113, 235, 190, 0.2);
}

.example-header {
  margin-bottom: 10px;
}

.example-info {
  display: flex;
  align-items: center;
}

.selected-preview {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.preview-content {
  font-size: 0.9rem;
  font-weight: 500;
  color: #065f46;
  line-height: 1.5;
}

.user-content {
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.4;
  padding: 8px;
  background-color: #f8fafc;
  border-radius: 4px;
  border-left: 3px solid #6b7280;
}

.feedback-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.feedback-content {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.5;
  padding: 8px;
  background-color: #f9fafb;
  border-radius: 4px;
}

.suggestions-list {
  padding-left: 8px;
}

.suggestion-item {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 8px;
}

/* 개선 제안 스타일 */
.suggestions-dropdown-list {
  margin-top: 8px;
}

.suggestion-item-dropdown {
  display: flex;
  align-items: flex-start;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: #374151;
  line-height: 1.4;
  border-left: 2px solid #3b82f6;
}

.suggestion-item-dropdown:last-child {
  margin-bottom: 0;
}

/* 다음 단계 스타일 */
.next-step-content {
  background-color: #eff6ff;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  font-size: 0.85rem;
  color: #1e40af;
  line-height: 1.5;
}

/* Close 버튼 스타일 개선 */
.btn-close {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}
</style>