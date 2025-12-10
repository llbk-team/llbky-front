<template>
  <div class="container py-4">
    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <div class="title">학습 리포트</div>
        <div class="subtitle">{{ learningTitle }}</div>
      </div>
      <router-link to="/learning/coach?tab=completed" class="btn btn-outline-green">← 돌아가기</router-link>
    </div>

    <div class="row g-4">
      <!-- 주차 선택 -->
      <div class="col-md-3">
        <div class="card shadow-sm p-3 card-clean">
          <h5 class="fw-bold mb-3 text-dark">주차 선택</h5>
          <ul class="list-group">
            <li v-for="(week, index) in weeks" :key="index" class="list-group-item clickable" :class="{ active: selectedWeekIndex === index }" @click="selectWeek(index)">
              <div class="fw-semibold">{{ week.label }}</div>
              <small class="text-muted">{{ week.topic }}</small>
            </li>
          </ul>
        </div>
      </div>

      <!-- 해당 주차의 일차별 내용 -->
      <div class="col-md-9">
        <div class="card shadow-sm p-4 card-clean">
          <h5 class="fw-bold mb-3 text-dark">{{ currentWeek.label }} 상세 학습 기록</h5>
          <p class="text-muted mb-4">{{ currentWeek.topic }}</p>
          <ul class="list-group">
            <li v-for="(day, dIndex) in currentWeek.days" :key="dIndex" class="list-group-item">
              <div class="d-flex justify-content-between align-items-center clickable" @click="toggleDay(dIndex)">
                <div>
                  <strong>{{ day.label }}</strong> - {{ day.title }}
                </div>
                <span class="text-muted small">{{ day.open ? "접기 ▲" : "펼치기 ▼" }}</span>
              </div>
              <transition name="slide">
                <div v-if="day.open" class="mt-2 p-3 rounded bg-light">
                  <p class="small text-muted mb-1">{{ day.date }}</p>
                  <div class="memo-text" v-html="day.memo"></div>
                </div>
              </transition>
            </li>
          </ul>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import learningReport from "@/utils/learningReport";

const {
  learningTitle,
  weeks,
  selectedWeekIndex,
  currentWeek,
  selectWeek,
  toggleDay
} = learningReport();
</script>

<style scoped src="@/assets/css/learningReport.css"></style>
