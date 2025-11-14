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

                  <!-- 항목 피드백 결과 -->
                  <div class="item-feedback p-3 bg-light-mint rounded-3" 
                       v-if="openItemIndex === itemIndex && openStepIndex === index && showItemFeedback[itemIndex]">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h6 class="fw-bold mb-0">AI 피드백</h6>
                      
                    </div>
                    <p class="feedback-text">{{ itemFeedbacks[itemIndex] }}</p>
                    <div class="d-flex justify-content-between">
                      <div class="feedback-score">
                        <span class="badge bg-success me-1" >강점 8점</span>
                        <span class="badge bg-warning text-dark">개선점 2점</span>
                      </div>
                      <button class="btn btn-primary" style="height: 37px;" @click="applyItemFeedback(itemIndex)">
                        피드백 반영하기
                      </button>
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
              <div class="d-flex">
                <div class="score-pill me-2 bg-success-light">효과성 85%</div>
                <div class="score-pill me-2 bg-info-light">구체성 78%</div>
                <div class="score-pill bg-warning-light">차별성 65%</div>
              </div>
            </div>
            
            <div class="feedback-section mb-4">
              <h6 class="feedback-title">👍 강점</h6>
              <ul class="feedback-list">
                <li>기술스택을 명확하게 설명했습니다.</li>
                <li>각 기술 선택에 대한 이유가 논리적입니다.</li>
                <li>실제 프로젝트 경험이 잘 드러납니다.</li>
              </ul>
            </div>
            
            <div class="feedback-section mb-4">
              <h6 class="feedback-title">💡 개선 포인트</h6>
              <ul class="feedback-list">
                <li>PostgreSQL JSONB 활용 사례를 더 구체적으로 언급하세요.</li>
                <li>Spring AI 연동 과정에서의 기술적 고민을 추가하세요.</li>
              </ul>
            </div>
            
            <div class="feedback-section">
              <h6 class="feedback-title">✨ 면접 대비 팁</h6>
              <p class="feedback-text">면접관이 "왜 관계형 DB에 JSONB를 선택했는가?"라는 질문을 할 수 있습니다. 
                NoSQL과 관계형 DB의 장단점을 비교하며 답변을 준비해보세요.</p>
            </div>
            
            <div class="feedback-actions mt-4 pt-3 border-top">
              <button class="btn btn-outline-secondary w-100 mb-2">피드백 저장하기</button>
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

// 전체 진행률
const overallProgress = ref(35);
const currentStep = ref(1);
const router = useRouter();


// 포트폴리오 단계
//LLM으로 공통적으로 사용할수 있는포트폴리오가 될수 있는지 확인할것
const portfolioSteps = ref([
  {
    label: "1단계",
    topic: "프로젝트 개요",
    requiresCoaching: false,
    progress: 60,
    items: [
      { title: "프로젝트 제목", description: "프로젝트 이름", status: "완료", placeholder: "예: AI 기반 취업 컨설팅 서비스" },
      { title: "프로젝트 기간", description: "시작/종료 일자", status: "작성 중", placeholder: "예: 2024.01 ~ 2024.03 (3개월)" },
      { title: "프로젝트 목적", description: "개발 배경과 목표", status: "미작성", placeholder: "예: 취업 준비생들이 AI의 도움을 받아 더 효과적으로 이력서와 포트폴리오를 준비할 수 있도록 하는 서비스 개발" },
      { title: "팀 구성", description: "역할 분담", status: "미작성", placeholder: "예: 개인 프로젝트 / 4인 팀(본인: 백엔드 개발 담당)" }
    ]
  },
  {
    label: "2단계",
    topic: "핵심 역량 & 기술",
    progress: 0,
    items: [
      { title: "사용 기술", description: "주요 기술 스택", status: "미작성", placeholder: "예: Spring Boot, Vue.js, PostgreSQL, Spring AI, OpenAI" },
      { title: "핵심 기능", description: "주요 기능 설명", status: "미작성", placeholder: "예: 1. 이력서 AI 분석 2. 포트폴리오 자동 개선 3. 맞춤형 면접 질문 생성" },
      { title: "본인 역할", description: "담당 업무", status: "미작성", placeholder: "예: 백엔드 API 개발, 프론트엔드 UI 구현, Spring AI 연동" },
      { title: "기술 선택 이유", description: "기술 스택 결정 근거", status: "미작성", placeholder: "예: PostgreSQL의 JSONB 타입을 활용해 복잡한 구조의 데이터를 효율적으로 저장하고자 했습니다." }
    ]
  },
  {
    label: "3단계",
    topic: "구현 내용",
    progress: 0,
    items: [
      { title: "시스템 아키텍처", description: "시스템 구조", status: "미작성", placeholder: "예: 3-tier 아키텍처로 구성하여 유지보수성을 높였습니다.", imageUpload: true },
      { title: "데이터베이스 설계", description: "DB 스키마", status: "미작성", placeholder: "예: 사용자, 이력서, 피드백 테이블을 설계하고 PostgreSQL의 JSONB 타입으로...", imageUpload: true },
      { title: "핵심 알고리즘", description: "중요 로직", status: "미작성", placeholder: "예: 이력서 분석을 위한 Retrieval Augmented Generation 패턴을 구현했습니다." },
      { title: "UI/UX 설계", description: "사용자 경험", status: "미작성", placeholder: "예: 사용자 피드백을 반영해 직관적인 UI를 설계했습니다.", imageUpload: true }
    ]
  },
  {
    label: "4단계",
    topic: "결과 & 성과",
    progress: 0,
    items: [
      { title: "주요 성과", description: "정량적 지표", status: "미작성", placeholder: "예: 사용자 만족도 92%, 이력서 개선율 평균 67%", imageUpload: true },
      { title: "문제 해결", description: "극복한 어려움", status: "미작성", placeholder: "예: JSONB 데이터 매핑 시 발생한 MyBatis 문제를 해결하기 위해..." },
      { title: "배포 & 운영", description: "서비스 런칭", status: "미작성", placeholder: "예: AWS EC2를 활용한 배포 및 CI/CD 파이프라인 구축" },
      { title: "시연 영상", description: "동작 예시", status: "미작성", placeholder: "예: 주요 기능 시연 영상 링크 및 설명", imageUpload: true }
    ]
  },
  {
    label: "5단계",
    topic: "회고 & 개선점",
    progress: 0,
    items: [
      { title: "배운 점", description: "기술적 성장", status: "미작성", placeholder: "예: Spring AI와 OpenAI를 연동하는 과정에서 얻은 인사이트..." },
      { title: "개선할 점", description: "향후 발전 방향", status: "미작성", placeholder: "예: 벡터 검색 성능 최적화와 prompt 엔지니어링 개선이 필요합니다." },
      { title: "성장 방향", description: "앞으로의 계획", status: "미작성", placeholder: "예: 이번 프로젝트를 통해 NLP와 AI 연동에 관심이 생겨 추가 학습을 계획 중입니다." }
    ]
  }
]);

// 아코디언 상태 관리
const openStepIndex = ref(0); // 기본적으로 1단계 열림
const openItemIndex = ref(null);
const showItemFeedback = ref(Array(20).fill(false)); // 각 항목별 피드백 표시 여부
const itemFeedbacks = ref(Array(20).fill("")); // 각 항목별 피드백 내용
const currentContent = ref("");
const selectedItem = ref(null);

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
  
  // 입력 내용 및 피드백 초기화
  if (openItemIndex.value !== null && !showItemFeedback.value[index]) {
    currentContent.value = "";
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
}

// AI 피드백 요청
function submitItemContent(index) {
  if (currentContent.value.trim().length < 5) {
    alert("5자 이상 입력해주세요.");
    return;
  }
  
  // 실제로는 API 호출, 여기서는 정적 데이터
  showItemFeedback.value[index] = true;
  
  // 각 항목별 맞춤 피드백
  if (portfolioSteps.value[openStepIndex.value].items[index].title === "프로젝트 제목") {
    itemFeedbacks.value[index] = "제목이 명확하고 프로젝트의 목적을 잘 나타냅니다. 'AI 기반'이라는 키워드가 포함되어 기술적 특성이 잘 드러납니다.";
  } else if (portfolioSteps.value[openStepIndex.value].items[index].title === "프로젝트 기간") {
    itemFeedbacks.value[index] = "3개월이라는 기간이 명시되어 있어 좋습니다. 구체적인 시작일과 종료일을 포함하면 더 정확한 정보가 될 것입니다.";
  } else if (portfolioSteps.value[openStepIndex.value].items[index].title === "프로젝트 목적") {
    itemFeedbacks.value[index] = "프로젝트의 목적과 배경이 명확히 설명되었습니다. 더 구체적인 문제 상황과 해결 방안을 추가하면 좋을 것 같습니다.";
  } else if (portfolioSteps.value[openStepIndex.value].items[index].title === "팀 구성") {
    itemFeedbacks.value[index] = "팀 규모와 본인의 역할이 명시되어 있어 좋습니다. 다른 팀원들의 역할과 협업 방식을 추가하면 더 완성도가 높아질 것입니다.";
  } else {
    itemFeedbacks.value[index] = "내용이 구체적이고 적절합니다. 핵심 키워드를 강조하고 기술적 역량이 잘 드러나도록 일부 표현을 다듬어보세요.";
  }
}




// 피드백 반영
function applyItemFeedback(index) {
  // 실제로는 개선된 내용 적용
  showItemFeedback.value[index] = false;
  
  // 해당 항목 상태 업데이트
  portfolioSteps.value[openStepIndex.value].items[index].status = '완료';
  
  // 단계 진행률 업데이트
  updateProgress();
}


// 피드백 없이 바로 완료하는 함수
function completeItemWithoutFeedback(index) {
  if (currentContent.value.trim().length < 5) {
    alert("5자 이상 입력해주세요.");
    return;
  }
  
  // 해당 항목 상태 '완료'로 업데이트
  portfolioSteps.value[openStepIndex.value].items[index].status = '완료';
  
  // 단계 진행률 업데이트
  updateProgress();
  
  // 입력창 닫기
  openItemIndex.value = null;
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




// 초기 설정 - 1단계 열기
onMounted(() => {
  openStepIndex.value = 0;
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

.feedback-list {
  padding-left: 20px;
  margin-bottom: 0;
}

.feedback-list li {
  margin-bottom: 5px;
  font-size: 0.85rem;
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


</style>