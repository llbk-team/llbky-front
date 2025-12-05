<template>
  <div class="learning-progress container py-4">
    <div class="d-flex justify-content-between align-items-end mb-1">
      <div>
        <div class="title">{{ learningTitle }}</div>
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
              <div class="day-card rounded-3" :class="{ active: selectedItem && selectedItem.dayId === item.dayId }">
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

        <div class="memo-box shadow-sm p-4">
          <div v-if="selectedItem">
            <h6 class="fw-bold mb-3">📝 {{ selectedItem.title }} 학습 노트</h6>
            <p class="text-muted small mb-2">학습한 내용을 자유롭게 작성하세요. AI가 내용을 검토해드립니다.</p>
            <p class="small text-muted mb-2">{{ selectedItem.desc }}</p>
            <div v-if="memoContent.startsWith('[학습 기록 거부 안내]')" class="alert alert-warning small">
              ⚠️ 학습 기록이 거부되었습니다. 내용을 다시 확인해주세요.
            </div>

            <div class="ai-memo-box bg-light rounded border mt-4">

              <!-- 1) 로딩 중 -->
              <div v-if="isLoading" class="loading-spinner">
                <div class="spinner-border text-mint"></div>
                <p class="mt-2 small">AI가 내용을 검토하고 있어요...</p>
              </div>

              <!-- 2) AI 결과(fixedMemo)가 있으면 출력 -->
              <div v-else-if="fixedMemo" class="ai-memo-content" v-html="parsedMemo"></div>

              <!-- 3) 결과가 없으면 입력 모드 -->
              <div v-else>
                <textarea v-model="memoContent" rows="14" class="form-control mb-3 mt-4" placeholder="예: Session vs JWT 차이점 정리..."></textarea>

                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">{{ memoContent.length }}/500자</small>
                  <div>
                    <button class="btn btn-outline-secondary me-2" @click="cancelMemo">취소</button>
                    <button class="btn btn-mint" @click="submitMemo">⚡ AI 검증 받기</button>
                  </div>
                </div>
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

  <div v-if="showCongrats" class="congrats-modal-overlay">
    <div class="congrats-modal">
      <h3>🎉 학습 목표 달성을 축하합니다! 🎉</h3>
      <p>당신은 끝까지 해냈어요! 정말 대단해요🔥</p>
      <button class="btn btn-mint mt-3" @click="goToCoach">
        학습 코치로 돌아가기 →
      </button>
    </div>
  </div>



  <WeekDetailModal v-if="showWeekModal && selectedWeek && selectedWeek.days && selectedWeek.days.length" :week="selectedWeek" @close="closeWeekModal" />

</template>

<script setup>
import { useRoute } from 'vue-router';
import learningStart from '@/utils/learningStart';
import WeekDetailModal from "@/components/modal/LearningWeekDetailModal.vue";

const route = useRoute();
const learningId = Number(route.query.learningId);

const {
  // 기본 정보
  isLoading,
  learningTitle,
  loadLearningInfo,
  totalWeeks,
  currentWeek,
  overallProgress,

  // 진행률 & 내용
  weeklyProgress,
  weeklyItems,
  loadWeeks,
  loadWeeklyItems,
  currentPage,
  itemsPerPage,
  totalPages,
  paginatedItems,
  nextPage,
  prevPage,

  // 주차 상세 모달
  selectedWeek,
  showWeekModal,
  openWeekModal,
  closeWeekModal,

  // 메모 작성
  selectedItem,
  memoContent,
  fixedMemo,
  parseMarkDown,
  parsedMemo,
  selectItem,
  cancelMemo,
  submitMemo,

  showCongrats,
  goToCoach

} = learningStart.useLearningStart(learningId);

</script>

<style scoped src="@/assets/css/learningStart.css"></style>
