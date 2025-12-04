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
        <!-- ======================== -->
        <!--   진행중 탭 (ongoing)     -->
        <!-- ======================== -->
        <div v-if="currentTab === 'ongoing'" class="card shadow-sm p-4 mb-3 card-clean ongoing-container">

          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">내 학습 이어하기</h5>

            <div v-if="totalOngoingPages > 0">
              <button class="page-btn" :disabled="ongoingPage === 1" @click="prevPage('ongoing')">‹</button>
              <span class="mx-1 small text-muted">{{ ongoingPage }} / {{ totalOngoingPages }}</span>
              <button class="page-btn" :disabled="ongoingPage === totalOngoingPages" @click="nextPage('ongoing')">›</button>
            </div>
          </div>

          <!-- 학습 없음 표시 -->
          <div v-if="pagedOngoingPlans.length === 0" class="text-center py-5 text-muted">
            <p class="mb-2">🚀 아직 시작한 학습이 없어요.</p>
            <p class="small">새 학습을 시작해 보세요!</p>
          </div>

          <!-- 학습 있을 때 -->
          <div v-else>
            <div v-for="(plan, i) in pagedOngoingPlans" :key="i" class="card mb-3 sub-card">
              <div class="card-body">
                <h6 class="fw-semibold">{{ plan.title }}</h6>
                <p class="text-secondary small">{{ plan.period }}</p>

                <div class="progress mb-2" style="height: 6px;">
                  <div class="progress-bar" role="progressbar" :style="{ width: plan.progress + '%', backgroundColor: '#71EBBE' }"></div>
                </div>

                <p class="text-secondary small mb-2">진행률 {{ plan.progress }}%</p>
                <router-link :to="`/learning/start?learningId=${plan.id}`" class="btn btn-outline-green">
                  학습 이어하기 →
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- ======================== -->
        <!--      완료됨 탭           -->
        <!-- ======================== -->
        <div v-else class="card shadow-sm p-4 mb-3 card-clean ongoing-container-finish">

          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">완료된 학습 플랜</h5>

            <div v-if="totalCompletedPages > 0">
              <button class="page-btn" :disabled="completedPage === 1" @click="prevPage('completed')">‹</button>
              <span class="mx-1 small text-muted">{{ completedPage }} / {{ totalCompletedPages }}</span>
              <button class="page-btn" :disabled="completedPage === totalCompletedPages" @click="nextPage('completed')">›</button>
            </div>
          </div>

          <!-- 완료 없음 표시 -->
          <div v-if="pagedCompletedPlans.length === 0" class="text-center py-5 text-muted">
            <p class="mb-2">📘 아직 완료된 학습이 없어요.</p>
            <p class="small">학습을 모두 마치면 여기에 표시돼요!</p>
          </div>

          <!-- 완료된 학습 있을 때 -->
          <div v-else>
            <div v-for="(plan, i) in pagedCompletedPlans" :key="i" class="card mb-3 sub-card" @click="goToReport(plan)">
              <div class="card-body">
                <h6 class="fw-semibold">{{ plan.title }}</h6>
                <p class="text-secondary small mb-1">{{ plan.period }}</p>
                <p class="text-secondary small">완료일: {{ plan.completedDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================== -->
      <!--     오른쪽 사이드바       -->
      <!-- ======================== -->
      <div class="col-md-4">

        <!-- 학습 현황 -->
        <div class="stats-bar d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold py-1 ms-2">나의 학습 현황</span>
          <div class="d-flex align-items-center gap-3 small">
            <span>진행 중 | <span class="fw-bold">{{ stats.ongoing }}</span></span>
            <span>완료 | <span class="fw-bold">{{ stats.completed }}</span></span>
          </div>
        </div>

        <!-- 캘린더 -->
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
          <p class="small text-muted mt-2">✓ 오늘 하루도 화이팅!</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useLearningCoach } from "@/utils/learningCoach";

const memberId = 1;
const {
  ongoingPlans,
  completedPlans,
  pagedOngoingPlans,
  pagedCompletedPlans,

  // 페이지네이션
  ongoingPage,
  completedPage,
  totalOngoingPages,
  totalCompletedPages,
  nextPage,
  prevPage,

  // 탭
  currentTab,
  setTab,

  // 캘린더
  calendar,
  year,
  month,
  prevMonth,
  nextMonth,
  isToday,

  // 통계
  stats,
  goToReport
} = useLearningCoach(memberId);
</script>





<style scoped src="@/assets/css/learningCoach.css"></style>
