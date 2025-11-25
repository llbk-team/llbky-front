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
          
          <!-- AI 분석 중 스피너 -->
          <div v-if="aiLoading" class="spinner-container text-center py-5">
            <div class="spinner"></div>
            <p class="text-muted mt-3 mb-0">AI가 분석 중입니다...</p>
          </div>
          
          <div v-else-if="selectedItem && showItemFeedback[openItemIndex]" class="ai-feedback">
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
import { onMounted } from "vue";
import { portfolioStepbystep } from "@/utils/portfolioStepbystep";
import "@/assets/css/PortfolioStepbystep.css";

const {
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
  
  // 함수
  toggleStep,
  toggleItem,
  cancelItemInput,
  cancelItemFeedback,
  submitItemContent,
  selectExample,
  useOriginalContent,
  applySelectedContent,
  completeItemWithoutFeedback,
  initializePortfolio,
  router
} = portfolioStepbystep();


// 초기 설정 - 1단계 열기 및 데이터 로드
onMounted(() => {
  initializePortfolio();
});
</script>