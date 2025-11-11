<template>
  <div class="learning-progress container py-4">
    <!-- 제목 -->
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="fw-bold fs-3 mb-1" style="color:#111111;">백엔드 개발자 학습 코칭</h1>
        <p class="text-muted mb-0">취업 준비 · 주 {{ weeklyHours }}시간</p>
      </div>
    </div>


    <!-- 주차별 진행 -->
    <div class="mb-5 mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-semibold mb-0">주차별 학습 진행</h5>
        <span class="text-muted small">{{ currentWeek }}주차 진행 중</span>
      </div>

      <div v-for="(week, index) in weeklyProgress" :key="index" class="week-card">
        <div class="d-flex align-items-center mb-2">
          <span class="week-icon" :class="{complete: week.progress === 100, ongoing: week.progress > 0 && week.progress < 100}">
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
                ? '#10B981'
                : week.progress > 0
                  ? '#71EBBE'
                  : '#E5E7EB'
          }"></div>
        </div>
      </div>
    </div>

    <!-- 이번 주 학습 내용 -->
    <div class="week-detail p-4 rounded-4 shadow-sm mt-4">
      <h6 class="fw-bold mb-3">
        이번 주 학습 내용 ({{ currentWeek }}주차)
      </h6>
      <p class="text-muted small mb-4">
        💡 각 항목을 클릭해서 학습 메모를 작성하세요
      </p>

      <div class="row g-3">
        <div v-for="(item, index) in weeklyItems" :key="index" class="col-md-6">
          <div class="day-card rounded-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="fw-semibold">{{ item.title }}</span>
                <div class="small text-muted">{{ item.day }}</div>
              </div>
              <span class="status-badge" :class="{
                done: item.status === '완료',
                ongoing: item.status === '진행 중',
                planned: item.status === '예정'
              }">
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const weeklyHours = ref(25)
const currentWeek = ref(2)

const weeklyProgress = ref([
  { label: '1주차', topic: 'Java 기초', progress: 100 },
  { label: '2주차', topic: 'Spring Security', progress: 60 },
  { label: '3주차', topic: 'JPA & Database', progress: 0 },
  { label: '4주차', topic: 'REST API 설계', progress: 0 }
])

const weeklyItems = ref([
  { day: '1~2일차', title: '인증/인가 기초', status: '완료' },
  { day: '3~4일차', title: 'Security 필터', status: '진행 중' },
  { day: '5~6일차', title: 'OAuth2 실습', status: '예정' },
  { day: '7일차', title: '테스트 & 마무리', status: '예정' }
])
</script>

<style scoped>
.learning-progress {
  color: #111;
}

/* ===== 주차별 카드 ===== */
.week-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 18px;
  background: #ffffff;
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

.week-card:hover {
  background-color: #e3fffe;
}

/* 아이콘 상태 */
.week-icon {
  font-size: 1.2rem;
  color: #9ca3af;
}

.week-icon.complete {
  color: #4cd3a3;
}

.week-icon.ongoing {
  color: #6ddab0;
}

/* 프로그레스바 */
.custom-progress {
  height: 8px;
  border-radius: 4px;
  background-color: #f3f4f6;
}

.custom-progress .progress-bar {
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* ===== 이번 주 학습 내용 ===== */
.week-detail {
  background: linear-gradient(135deg, #f8faff 0%, #f5f7ff 100%);
  border: 1px solid #e0e7ff;
}

/* 일차별 카드 */
.day-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 16px;
  transition: 0.2s;
}

.day-card:hover {
  background: #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 상태 배지 */
.status-badge {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 8px;
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
</style>
