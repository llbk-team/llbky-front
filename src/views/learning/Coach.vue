<template>
  <div class="container py-4">

    <!-- 제목 행 -->
    <div class="title">AI 학습 코치</div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="subtitle mb-4">안녕하세요! 오늘의 학습 계획을 이어가볼까요?</div>
      <router-link :to="`/learning/goal`" class="btn btn-green">+ 새 학습 시작하기</router-link>
    </div>

    <!-- 탭 버튼 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: currentTab === 'ongoing' }" @click="setTab('ongoing')">진행 중</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: currentTab === 'completed' }" @click="setTab('completed')">완료됨</button>
      </li>
    </ul>

    <div class="row g-4">
      <!-- 왼쪽 -->
      <div class="col-md-8">
        <!-- 진행 중 -->
        <div v-if="currentTab === 'ongoing'" class="card shadow-sm p-4 mb-3 card-clean ongoing-container">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">내 학습 이어하기</h5>
            <!-- 오른쪽 위 페이지 네비게이션 -->
            <div>
              <button class="page-btn" :disabled="ongoingPage === 1" @click="prevPage('ongoing')">‹</button>
              <span class="mx-1 small text-muted">{{ ongoingPage }} / {{ totalOngoingPages }}</span>
              <button class="page-btn" :disabled="ongoingPage === totalOngoingPages" @click="nextPage('ongoing')">›</button>
            </div>
          </div>
          <div v-for="(plan, i) in pagedOngoingPlans" :key="i" class="card border-light mb-3 sub-card">
            <div class="card-body">
              <h6 class="fw-semibold">{{ plan.title }}</h6>
              <p class="text-secondary small">{{ plan.period }}</p>
              <div class="progress mb-2" style="height: 6px;">
                <div class="progress-bar" role="progressbar" :style="{ width: plan.progress + '%', backgroundColor: '#71EBBE' }"></div>
              </div>
              <p class="text-secondary small mb-2">진행률 {{ plan.progress }}%</p>
              <router-link :to="`/learning/start`" class="btn btn-outline-green">학습 이어하기 →</router-link>
            </div>
          </div>
        </div>


        <!-- 완료된 학습 -->
        <div v-else class="card shadow-sm p-4 mb-3 card-clean ongoing-container-finish">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0" style="color:#111111;">완료된 학습 플랜</h5>
            <!-- 오른쪽 위 페이지 네비게이션 -->
            <div>
              <button class="page-btn" :disabled="completedPage === 1" @click="prevPage('completed')">‹</button>
              <span class="mx-1 small text-muted">{{ completedPage }} / {{ totalCompletedPages }}</span>
              <button class="page-btn" :disabled="completedPage === totalCompletedPages" @click="nextPage('completed')">›</button>
            </div>
          </div>
          <div v-for="(plan, i) in pagedCompletedPlans" :key="i" class="card border-light mb-3 sub-card clickable" @click="goToReport(plan)">
            <div class="card-body">
              <h6 class="fw-semibold">{{ plan.title }}</h6>
              <p class="text-secondary small mb-1">{{ plan.period }}</p>
              <p class="text-secondary small">완료일: {{ plan.completedDate }}</p>
            </div>
          </div>
        </div>
      </div>


      <!-- 오른쪽 -->
      <div class="col-md-4">

        <div class="stats-bar d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold py-1 ms-2">나의 학습 현황</span>
          <div class="d-flex align-items-center gap-3 small">
            <span>진행 중 | <span class="fw-bold">{{ stats.ongoing }}</span></span>
            <span>완료 | <span class="fw-bold">{{ stats.completed }}</span></span>
          </div>
        </div>

        <div class="card shadow-sm p-4 mb-3 card-clean">
          <h5 class="fw-bold mb-3">AI 코멘트</h5>
          <div class="p-3 rounded border mb-2" style="background-color:#DDF3EB; border-color:#71EBBE;">
            <p class="small mb-0">“{{ aiComment.main }}”</p>
          </div>
          <p class="text-muted small">참고: {{ aiComment.tip }} 💪</p>
        </div>

        <!-- 학습 루틴 캘린더 -->
        <div class="card shadow-sm p-4 mt-3 card-clean">
          <div class="calendar-header d-flex justify-content-between align-items-center mb-2">
            <button class="page-btn" @click="prevMonth">‹</button>
            <span class="fw-semibold">{{ year }}년 {{ month + 1 }}월</span>
            <button class="page-btn" @click="nextMonth">›</button>
          </div>
          <table class="table text-center small mb-0">
            <thead>
              <tr>
                <th v-for="d in ['일', '월', '화', '수', '목', '금', '토']" :key="d">{{ d }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, wi) in calendar" :key="wi">
                <td v-for="(day, di) in week" :key="di" :class="{ 'calendar-today': isToday(day) }">
                  {{ day > 0 ? day : '' }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="small text-muted mt-2">✓ 오늘 학습 완료 시 자동 표시됩니다</p>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";


// 📅 ----- 달력 로직 ----- //
const today = new Date();
const year = ref(today.getFullYear());
const month = ref(today.getMonth()); // 0~11
const calendar = ref([]);

function generateCalendar() {
  const firstDay = new Date(year.value, month.value, 1).getDay();
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate();

  const temp = [];
  let week = Array(7).fill(0);
  let day = 1;

  // 첫 주
  for (let i = firstDay; i < 7; i++) {
    week[i] = day++;
  }
  temp.push(week);

  // 중간 주
  while (day <= daysInMonth) {
    week = Array(7).fill(0);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      week[i] = day++;
    }
    temp.push(week);
  }

  calendar.value = temp;
}

function isToday(d) {
  return (
    d === today.getDate() &&
    month.value === today.getMonth() &&
    year.value === today.getFullYear()
  );
}

function prevMonth() {
  if (month.value === 0) {
    month.value = 11;
    year.value--;
  } else {
    month.value--;
  }
  generateCalendar();
}

function nextMonth() {
  if (month.value === 11) {
    month.value = 0;
    year.value++;
  } else {
    month.value++;
  }
  generateCalendar();
}

generateCalendar();
// 달력 끝

const router = useRouter();
const route = useRoute();

// 기본 탭 상태 (진행 중)
const currentTab = ref(route.query.tab || "ongoing");

// 페이지 상태
const ongoingPage = ref(1);
const completedPage = ref(1);
const itemsPerPage = 3;

watch(
  () => route.query.tab,
  (newVal) => {
    currentTab.value = newVal || "ongoing";
  }
);

function setTab(tabName) {
  currentTab.value = tabName;
  router.replace({ query: { tab: tabName } }); // 쿼리도 함께 갱신
}

function goToReport(plan) {
  router.push(`/learning/report`); // 임시로 report로 감. 나중에 planId별로 이동할 예정
  // router.push(`/learning/report/${plan.id || 1}`);
}

// 진행 중 / 완료 플랜 (임시 데이터)
const ongoingPlans = [
  { title: "백엔드 취업 준비 1", period: "4주 플랜", progress: 40 },
  { title: "Spring Boot 실전", period: "3주 플랜", progress: 60 },
  { title: "SQL 완전정복", period: "2주 플랜", progress: 80 },
  { title: "JPA 마스터", period: "3주 플랜", progress: 20 },
];

const completedPlans = [
  { title: "백엔드 취업 준비 1", period: "4주 플랜", completedDate: "2025-10-01" },
  { title: "Spring Security", period: "3주 플랜", completedDate: "2025-11-01" },
  { title: "REST API 설계", period: "2주 플랜", completedDate: "2025-11-05" },
  { title: "JPA 학습", period: "3주 플랜", completedDate: "2025-11-10" },
];

// 페이지 계산
const totalOngoingPages = computed(() => Math.ceil(ongoingPlans.length / itemsPerPage));
const totalCompletedPages = computed(() => Math.ceil(completedPlans.length / itemsPerPage));

// 페이지별 데이터
const pagedOngoingPlans = computed(() => {
  const start = (ongoingPage.value - 1) * itemsPerPage;
  return ongoingPlans.slice(start, start + itemsPerPage);
});

const pagedCompletedPlans = computed(() => {
  const start = (completedPage.value - 1) * itemsPerPage;
  return completedPlans.slice(start, start + itemsPerPage);
});

// 페이지 이동 함수
function nextPage(type) {
  if (type === "ongoing" && ongoingPage.value < totalOngoingPages.value) ongoingPage.value++;
  if (type === "completed" && completedPage.value < totalCompletedPages.value) completedPage.value++;
}

function prevPage(type) {
  if (type === "ongoing" && ongoingPage.value > 1) ongoingPage.value--;
  if (type === "completed" && completedPage.value > 1) completedPage.value--;
}

watch(
  () => route.query.tab,
  (newVal) => {
    currentTab.value = newVal || "ongoing";
  }
);

const stats = { ongoing: 2, completed: 1 }

const aiComment = {
  main: 'SQL 학습 플랜을 잘 진행 중이에요! 이번 주 목표는 Spring Security를 공부해봐요.',
  tip: '하루 30분만 더 투자하면 목표 자격증 합격 확률이 높아져요!'
}
</script>

<style scoped>
body {
  background-color: #F1F2F3;
  color: #111111;
}

.card-clean {
  border-radius: 16px;
  border: 1px solid #EAEBEC;
  background-color: #FFFFFF;
}

.sub-card {
  border-radius: 12px;
  border: 1px solid #EAEBEC;
  background-color: #F8FAF9;
}

.btn-green {
  display: inline-flex;
  align-items: center;
  height: 37px;
  background-color: #71EBBE;
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
}

.btn-green:hover {
  background-color: #A2F1D6;
  border-color: #A2F1D6;
}

.btn-outline-green {
  display: inline-flex;
  align-items: center;
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 8px;
  height: 37px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
}

.btn-outline-green:hover {
  background-color: #71EBBE;
  color: #111111;
}

.shadow-sm {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05) !important;
}

.nav-tabs .nav-link {
  color: #111111;
  border: none;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  border-bottom: 3px solid #71EBBE;
  color: #111111;
}

.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable:hover {
  background-color: #E9FAF5;
}

.page-btn {
  border: none;
  background: transparent;
  font-size: 22.4px;
  color: #444444;
  cursor: pointer;
  padding: 0px 8px;
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

.ongoing-container {
  min-height: 660px;
}

.ongoing-container-finish {
  min-height: 520px;
}

.calendar-today {
  background-color: #DDF3EB;
  border-radius: 6px;
  font-weight: 700;
  color: #111111;
}

/* 나의 학습 현황 미니 박스 */
.mini-stats-card {
  padding: 12px !important;
  border-radius: 10px !important;
}

.mini-stats-card h5 {
  font-size: 14px !important;
  margin-bottom: 10px !important;
}

/* 안의 블록 크기 줄이기 */
.mini-stat-box {
  padding: 8px 0 !important;
  border-radius: 6px !important;
  margin-bottom: 8px !important;
}

.mini-stat-number {
  font-size: 18px !important;
  margin-bottom: 0 !important;
}

.mini-stat-label {
  font-size: 11px !important;
  margin-bottom: 0 !important;
}

.stats-bar {
  padding: 8px 12px;
  border: 1px solid #EAEBEC;
  border-radius: 10px;
  background-color: #FFFFFF;
}
</style>
