<template>
  <div class="learning-progress container py-4">
    <div class="d-flex justify-content-between align-items-end mb-1">
      <div>
        <div class="title">백엔드 개발자 학습 코칭</div>
        <div class="subtitle">취업 준비 · 주 {{ weeklyHours }}시간</div>
      </div>
      <div class="fs-5">{{ overallProgress }}% 전체 진행률</div>
    </div>

    <div class="row g-4 align-items-start">
      <!-- 왼쪽 영역 -->
      <div class="col-lg-8">
        <!-- 주차별 진행 -->
        <div class="mb-4 mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-semibold mb-0">주차별 학습 진행</h5>
            <span class="text-muted small">{{ currentWeek }}주차 진행 중</span>
          </div>

          <div v-for="(week, index) in weeklyProgress" :key="index" class="week-card" @click="openWeekModal(week)">
            <div class="d-flex align-items-center mb-2">
              <span class="week-icon" :class="{ complete: week.progress === 100, ongoing: week.progress > 0 && week.progress < 100 }">
                <i v-if="week.progress === 100">✔</i>
                <i v-else-if="week.progress > 0">🕓</i>
                <i v-else>📅</i>
              </span>
              <div class="ms-2 flex-grow-1">
                <span class="fw-semibold">{{ week.label }}</span>
                <span class="text-muted ms-2 small">{{ week.topic }}</span>
              </div>
              <span class="fw-semibold">{{ week.progress }}%</span>
            </div>

            <div class="progress custom-progress">
              <div class="progress-bar" role="progressbar" :style="{
                width: week.progress + '%',
                backgroundColor:
                  week.progress === 100
                    ? '#71EBBE'
                    : week.progress > 0
                      ? '#A2F1D6'
                      : '#E5E7EB',
              }"></div>
            </div>
          </div>
        </div>

        <!-- 이번 주 학습 내용 -->
        <div class="week-detail p-4 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">이번 주 학습 내용 ({{ currentWeek }}주차)</h6>

            <!-- 페이지 전환 버튼 -->
            <div>
              <button class="page-btn me-2" :disabled="currentPage === 1" @click="prevPage">‹</button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">›</button>
            </div>
          </div>

          <p class="text-muted small mb-4">💡 각 항목을 클릭해서 학습 정리 노트를 작성하세요</p>

          <!-- 일차별 카드 -->
          <div class="row g-3">
            <div v-for="(item, index) in paginatedItems || []" :key="index" class="col-md-6" @click="selectItem(item)">
              <div class="day-card rounded-3" :class="{ active: selectedItem && selectedItem.title === item.title }">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="fw-semibold">{{ item.title }}</span>
                    <div class="small text-muted">{{ item.day }}</div>
                  </div>
                  <span class="status-badge" :class="{
                    done: item.status === '완료',
                    ongoing: item.status === '진행 중',
                    planned: item.status === '예정',
                  }">
                    {{ item.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 영역 (메모 입력) -->
      <div class="col-lg-4">

        <!-- 스톱워치 -->
        <div class="timer-box shadow-sm p-3" style="margin-top: 65px;">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="fw-bold">⏱ 학습 타이머</h6>
            <span class="timer-display">{{ formattedTime }}</span>
          </div>
          <div class="d-flex mt-1">
            <button class="btn btn-sm btn-mint me-2" @click="startTimer" :disabled="timerRunning">▶︎</button>
            <button class="btn btn-sm btn-outline-secondary me-2" @click="pauseTimer" :disabled="!timerRunning">⏸︎</button>
          </div>
        </div>

        <div class="memo-box shadow-sm p-4">
          <div v-if="selectedItem">
            <h6 class="fw-bold mb-3">📝 {{ selectedItem.title }} 학습 노트</h6>
            <p class="text-muted small mb-2">학습한 내용을 자유롭게 작성하세요. AI가 내용을 검토해드립니다.</p>
            <textarea v-model="memoContent" rows="14" class="form-control mb-3" placeholder="예: Session vs JWT 차이점 정리..."></textarea>

            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">{{ memoContent.length }}/500자</small>
              <div>
                <button class="btn btn-outline-secondary me-2" @click="cancelMemo">취소</button>
                <button class="btn btn-mint" @click="submitMemo">⚡ AI 검증 받기</button>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-5 rounded-6">
            <p>왼쪽에서 학습 항목을 선택하면<br />여기에 정리 노트를 작성할 수 있습니다 ✍️</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <WeekDetailModal v-if="showWeekModal" :week="selectedWeek" @close="closeWeekModal" />

</template>

<script setup>
import { ref, computed } from "vue";
import WeekDetailModal from "@/components/modal/LearningWeekDetailModal.vue";

const weeklyHours = ref(25);
const currentWeek = ref(2);
const overallProgress = ref(45);

const weeklyProgress = ref([
  {
    label: "1주차",
    topic: "Java 기초",
    progress: 100,
    details: [
      "1일차: Java 개발 환경 설정 및 Hello World 출력",
      "2일차: 변수, 자료형, 연산자 실습",
      "3일차: 조건문과 반복문 학습",
      "4일차: 배열과 메서드 이해",
      "5일차: 클래스와 객체 개념 정리",
      "6일차: 간단한 콘솔 미니프로젝트 제작",
      "7일차: 주간 복습 및 퀴즈"
    ]
  },
  {
    label: "2주차",
    topic: "Spring Security",
    progress: 60,
    details: [
      "1일차: 스프링 시큐리티 구조와 필터 이해",
      "2일차: AuthenticationManager 학습",
      "3일차: JWT 발급 및 검증 로직 구현",
      "4일차: OAuth2 로그인 구조 실습",
      "5일차: AccessDeniedHandler 설정",
      "6일차: 커스텀 로그인 페이지 구현",
      "7일차: 예외 처리 및 테스트"
    ]
  },
  {
    label: "3주차",
    topic: "JPA & Database",
    progress: 0,
    details: [
      "1일차: JPA 환경 설정 및 기본 CRUD",
      "2일차: Entity 매핑 실습",
      "3일차: 연관관계 매핑 (1:N, N:M)",
      "4일차: JPQL 쿼리 작성",
      "5일차: 영속성 컨텍스트 이해",
      "6일차: 트랜잭션 및 롤백 실습",
      "7일차: 데이터베이스 최적화 복습"
    ]
  },
  {
    label: "4주차",
    topic: "REST API 설계",
    progress: 0,
    details: [
      "1일차: RESTful 설계 원칙 학습",
      "2일차: Controller 및 Service 설계",
      "3일차: 요청/응답 구조 정의",
      "4일차: 예외 처리(Exception Handling)",
      "5일차: Swagger API 문서화",
      "6일차: 배포 환경 테스트",
      "7일차: 프로젝트 리팩토링 및 점검"
    ]
  }
]);



const weeklyItems = ref([
  { day: "1일차", title: "인증/인가 개념 이해", status: "완료" },
  { day: "2일차", title: "AuthenticationManager 학습", status: "완료" },
  { day: "3일차", title: "Security 필터 체인 구조", status: "진행 중" },
  { day: "4일차", title: "JWT 발급/검증 로직 구현", status: "진행 중" },
  { day: "5일차", title: "OAuth2 로그인 실습", status: "예정" },
  { day: "6일차", title: "AccessDeniedHandler 적용", status: "예정" },
  { day: "7일차", title: "테스트 및 마무리", status: "예정" },
]);
const currentPage = ref(1);
const itemsPerPage = 4; // 첫 페이지에 1~4일차, 두 번째 페이지에 5~7일차
const totalPages = computed(() => Math.ceil((weeklyItems.value?.length || 0) / itemsPerPage));

const paginatedItems = computed(() => {
  if (!weeklyItems.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return weeklyItems.value.slice(start, start + itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}


const showWeekModal = ref(false);
const selectedWeek = ref(null);

function openWeekModal(week) {
  selectedWeek.value = week;
  showWeekModal.value = true;
}

function closeWeekModal() {
  showWeekModal.value = false;
}


const selectedItem = ref(null);
const memoContent = ref("");

function selectItem(item) {
  selectedItem.value = item;
  memoContent.value = "";
}

function cancelMemo() {
  selectedItem.value = null;
  memoContent.value = "";
}

function submitMemo() {
  alert(`"${selectedItem.value.title}"주제에 맞는 내용입니다`);
  memoContent.value = "";
}

// -----------------------
// ⏱ 타이머 로직
// -----------------------
const timer = ref(0);           // 총 시간(초)
const timerRunning = ref(false);
let timerInterval = null;

const formattedTime = computed(() => {
  const h = String(Math.floor(timer.value / 3600)).padStart(2, "0");
  const m = String(Math.floor((timer.value % 3600) / 60)).padStart(2, "0");
  const s = String(timer.value % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
});

function startTimer() {
  if (timerRunning.value) return;
  timerRunning.value = true;

  timerInterval = setInterval(() => {
    timer.value++;
  }, 1000);
}

function pauseTimer() {
  timerRunning.value = false;
  clearInterval(timerInterval);
}

</script>

<style scoped>
.learning-progress {
  color: #111111;
}

.memo-box {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  min-height: 550px;
  transition: 0.3s;
  margin-top: 10px;
  border-radius: 6px;
}

.memo-box textarea {
  resize: none;
}

.week-card {
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 14px 18px;
  background-color: #FFFFFF;
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

.week-card:hover {
  background-color: #F0FDF4;
}

.week-icon {
  font-size: 19.2px;
  color: #9CA3AF;
}

.week-icon.complete {
  color: #4CD3A3;
}

.custom-progress {
  height: 8px;
  border-radius: 6px;
  background-color: #F3F4F6;
}

.custom-progress .progress-bar {
  border-radius: 6px;
  transition: width 0.3s ease;
}

.week-detail {
  background: linear-gradient(135deg, #F0FDF4 0%, #F5F7FF 100%);
  border: 1px solid #E0E7FF;
  border-radius: 6px;
}

.day-card {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  padding: 16px;
  transition: 0.2s;
  cursor: pointer;
}

.day-card:hover {
  background-color: #F8FAFC;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
}

.day-card.active {
  border-color: #71EBBE;
  box-shadow: 0px 0px 0px 3px rgba(113, 235, 190, 0.3);
}

.status-badge {
  font-size: 13.5px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
}

.status-badge.done {
  background-color: #ECFDF5;
  color: #059669;
}

.status-badge.ongoing {
  background-color: #EEF2FF;
  color: #4F46E5;
}

.status-badge.planned {
  background-color: #F3F4F6;
  color: #6B7280;
}

.btn-outline-secondary {
  display: inline-flex;
  align-items: center;
  font-size: 13.5px;
  font-weight: 500;
  height: 37px;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.btn-mint {
  background-color: #A2F1D6;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  height: 37px;
}

.page-btn {
  border: none;
  background: transparent;
  font-size: 22.4px;
  color: #444444;
  cursor: pointer;
  padding: 0px 6px;
  transition: color 0.2s;
}

.page-btn:hover:not(:disabled) {
  color: #00C896;
}

.page-btn:disabled {
  color: #CCCCCC;
  cursor: default;
}

.title {
  font-weight: 700;
  font-size: 28px;
}

.subtitle {
  color: #6C757D;
  font-size: 16px;
  margin-bottom: 0px;
}

.timer-box {
  background-color: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
}

.timer-display {
  font-size: 20px;
  font-weight: 700;
  color: #00C896;
}
</style>
