<template>
  <div class="container py-5">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold mb-1 title">면접 리포트</h3>
        <p class="text-muted mb-0 subtitle">예상 질문 / 면접 이력 확인 및 상세 조회</p>
      </div>
      <button class="btn btn-mint rounded-pill btn-auto shadow-sm"
        @click="$router.push('/interview/mock')">
        ▶️ 모의 면접 시작하기
      </button>
    </div>

    <!-- 탭 -->
    <div class="d-flex bg-light rounded-pill p-1 mb-4">
      <button
        class="btn flex-fill rounded-pill fw-semibold py-2"
        :class="tab === 'question' ? 'btn-mint text-dark' : 'btn-light text-secondary'"
        @click="tab = 'question'"
      >
        예상 질문
      </button>
      <button
        class="btn flex-fill rounded-pill fw-semibold py-2"
        :class="tab === 'history' ? 'btn-mint text-dark' : 'btn-light text-secondary'"
        @click="tab = 'history'"
      >
        면접 이력
      </button>
    </div>

    <!-- 예상 질문 탭 -->
    <div v-if="tab === 'question'">
      <!-- 직무 질문 -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-0">
            직무 질문 <span class="text-muted small">{{ jobQuestions.length }}개</span>
          </h5>
          <button
            v-if="jobQuestions.length > 5"
            class="btn btn-outline-mint btn-sm rounded-pill px-3 py-1 fw-medium"
            @click="showAllJob = !showAllJob"
          >
            {{ showAllJob ? '접기' : '전체보기' }}
          </button>
        </div>

        <!-- 목록 없을 때 -->
        <div v-if="jobQuestions.length === 0" class="text-center text-muted py-3">
          등록된 직무 질문이 없습니다.
        </div>

        <!-- 목록 있을 때 -->
        <div v-else>
          <div
            v-for="(q, i) in displayedJobQuestions"
            :key="i"
            class="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-2 bg-white shadow-sm-sm"
          >
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-mint text-dark rounded-pill">{{ i + 1 }}</span>
              <span>{{ q.text }}</span>
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn btn-sm text-muted"
                title="답변 보기"
                @click="openAnswerModal(q)"
              >
                🎞️ 답변 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 종합 질문 -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-0">
            종합 질문 <span class="text-muted small">{{ generalQuestions.length }}개</span>
          </h5>
          <button
            v-if="generalQuestions.length > 5"
            class="btn btn-outline-mint btn-sm rounded-pill px-3 py-1 fw-medium"
            @click="showAllGeneral = !showAllGeneral"
          >
            {{ showAllGeneral ? '접기' : '전체보기' }}
          </button>
        </div>

        <div v-if="generalQuestions.length === 0" class="text-center text-muted py-3">
          등록된 종합 질문이 없습니다.
        </div>

        <div v-else>
          <div
            v-for="(q, i) in displayedGeneralQuestions"
            :key="i"
            class="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-2 bg-white shadow-sm-sm"
          >
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-mint text-dark rounded-pill">{{ i + 1 }}</span>
              <span>{{ q.text }}</span>
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn btn-sm text-muted"
                title="답변 보기"
                @click="openAnswerModal(q)"
              >
                🎞️ 답변 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 면접 이력 탭 -->
    <div v-else>
      <div v-if="histories.length === 0" class="text-center text-muted py-3">
        면접 이력이 없습니다.
      </div>
      <div v-else>
        <div
        v-for="(h, i) in histories"
        :key="i"
        class="border rounded-3 bg-white p-3 mb-3 shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-mint text-dark">완료</span>
              <small class="text-muted">{{ h.date }}</small>
              <!-- <small class="text-muted">{{ h.questionCount }}개 질문</small> -->
            </div>
            <button
            class="btn btn-outline-secondary rounded-pill px-4 btn-auto"
              @click="goToReport(h)"
            >
              📄 리포트 보기
            </button>
          </div>
          <p class="fw-semibold mb-1">{{ h.scoreSummary }}</p>
          <p class="text-muted small mb-2">{{ h.feedback }}</p>
          <div class="progress" style="height: 6px;">
            <div
              class="progress-bar bg-mint"
              role="progressbar"
              :style="{ width: h.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 답변 보기 모달 -->
    <div v-if="showModal" class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-content-custom p-4 rounded-4 shadow-lg bg-white text-center">
        <h5 class="fw-bold mb-3">{{ selectedQuestion?.text }}</h5>
        <!-- 오디오 -->
        <div v-if="selectedQuestion?.type === 'audio'">
          <audio controls class="w-100 mb-3">
            <source :src="selectedQuestion.answerUrl || ''" type="audio/mp3" />
            브라우저가 오디오 재생을 지원하지 않습니다.
          </audio>
        </div>

        <!-- 비디오 -->
        <div v-else-if="selectedQuestion?.type === 'video'">
          <video controls class="w-100 mb-3 rounded-3">
            <source :src="selectedQuestion.answerUrl || ''" type="video/mp4" />
            브라우저가 비디오 재생을 지원하지 않습니다.
          </video>
        </div>

        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-secondary rounded-pill px-4" @click="showModal = false">
            닫기
          </button>
         <!-- 리포트로 이동 버튼 -->
          <button
            class="btn btn-mint btn-outline-secondary btn-sm rounded-pill px-4 fw-medium btn-auto"
            @click="goToReport(selectedQuestion)"
          >
            📄 리포트로 이동
          </button>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import interviewList from '@/utils/interviewList';
import { useStore } from 'vuex';

const memberId = 1;

const {
  tab,
  jobQuestions,
  generalQuestions,
  displayedJobQuestions,
  displayedGeneralQuestions,
  showAllJob,
  showAllGeneral,
  showModal,
  selectedQuestion,
  histories,
  openAnswerModal,
  goToReport
} = interviewList.useInterviewList(memberId);
</script>

<style src="@/assets/css/interviewList.css"></style>