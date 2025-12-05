<template>
  <div class="container py-5">
    <!-- 헤더 -->
    <div class="mb-4">
      <h3 class="fw-bold mb-1">모의 면접 진행</h3>
      <p class="text-muted small mb-3">AI가 음성·영상 기반으로 피드백을 제공합니다</p>
      <div class="d-flex align-items-center gap-2 mb-1">
        <small class="fw-semibold">질문 {{ current }}/{{ total }}</small>
        <div class="flex-grow-1 progress" style="height: 5px;">
          <div
            class="progress-bar bg-mint"
            role="progressbar"
            :style="{ width: (current / total) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- 왼쪽 질문 목록 -->
      <div class="col-lg-3" v-if="total > 0">
        <div>
          <div
            v-for="(q, i) in questions"
            :key="i"
            class="p-3 rounded-3 mb-2"
            :class="i + 1 === current ? 'bg-dark text-white' : 'bg-light text-dark'"
          >
            <div class="fw-bold mb-1">질문 {{ i + 1 }}</div>
            <div class="small">{{ q }}</div>
          </div>

          <!-- 면접 팁 -->
          <div class="tip-box">
            <h6 class="fw-bold mb-2">💡 면접 팁</h6>
            <ul class="mb-0 ps-3">
              <li>구체적인 사례와 수치를 포함하세요.</li>
              <li>답변은 1분 내외로 요약하세요.</li>
              <li>STAR 기법(상황-과제-행동-결과)을 활용하세요.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 중앙 녹화/녹음 영역 -->
      <div class="col-lg-6">
        <div class="bg-dark text-white rounded-4 p-4 text-center mb-3 preview-box">
          <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <!-- 녹화 안 할 때 -->
            <template v-if="!isRecording">
              <i class="ri-video-line fs-1 mb-2 text-secondary"></i>
              <p class="text-muted small mb-0">
                녹음/녹화를 시작하면<br />여기에 미리보기가 표시됩니다
              </p>
            </template>

            <!-- 녹화 중일 때 영상 미리보기 -->
            <template v-else-if="mode === 'video'">
              <video
                ref="previewRef"
                autoplay
                playsinline
                muted
                class="rounded-3"
                style="width: 100%; max-height: 250px; object-fit: cover;"
              ></video>

              <p class="text-danger fw-bold mt-2">
                <span class="record-dot"></span> {{ formatTime(recordTime) }}
              </p>
              
            </template>

            <!-- 녹음 중 -->
            <template v-else>
              <i class="ri-mic-fill fs-1 text-danger mb-2"></i>
              <p class="text-danger fw-bold">{{ formatTime(recordTime) }}</p>
            </template>
          </div>
        </div>

        <!-- 녹음/녹화 컨트롤 -->
        <div class="bg-light rounded-4 p-4 mt-3 shadow-sm">
          <!-- 상단 영역 -->
          <div class="position-relative mb-4">
            <!-- 왼쪽: 이전 질문 -->
            <button
              class="btn btn-link p-0 text-muted small position-absolute start-0 top-50 translate-middle-y prev-question-btn"
              :disabled="current <= 1"
              @click="goPrevQuestion"
              style="text-decoration: none; font-size: 0.85rem;"
            >
              <span class="me-2">&lt;</span> 이전 질문
            </button>

            <!-- 가운데: 제목 (절대 중앙 고정) -->
            <h6 class="fw-bold text-dark mb-0 text-center">답변 녹음/녹화</h6>

            <!-- 오른쪽: 다음 질문 -->
            <button
              class="btn btn-link p-0 text-muted small position-absolute end-0 top-50 translate-middle-y next-question-btn"
              :disabled="current >= total || !feedbackMap[questionIds[current - 1]]"
              @click="goNextQuestion"
              style="text-decoration: none; font-size: 0.85rem;"
            >
              다음 질문 >
            </button>
          </div>

          <!-- 모드 선택 -->
          <div class="d-flex justify-content-center gap-3 mb-4">
            <button
              class="btn w-50 py-3 fw-medium border mode-btn"
              :class="mode === 'video' ? 'active' : ''"
              :disabled="isRecording"
              @click="setMode('video')"
            >
              <i class="ri-video-line me-1"></i> 영상 녹화
            </button>
            <button
              class="btn w-50 py-3 fw-medium border mode-btn"
              :class="mode === 'audio' ? 'active' : ''"
              :disabled="isRecording"
              @click="setMode('audio')"
            >
              <i class="ri-mic-line me-1"></i> 음성 녹음
            </button>
          </div>

          <!-- 상태 표시 -->
          <div class="bg-white rounded-3 p-3 text-center border status-box">
            <div v-if="isRecording" class="text-success fw-bold">
              {{ mode === 'video' ? '🎥 녹화 중...' : '🎙️ 녹음 중...' }}
              <br />
              <small class="text-muted">{{ formatTime(recordTime) }}</small>
            </div>

            <div v-else class="text-muted small">
              아직 녹음/녹화를 시작하지 않았습니다.
            </div>
          </div>

          <!-- 녹음/녹화 버튼 -->
          <div class="d-flex justify-content-center mt-3">
            <button
              class="btn fw-medium px-4 py-2 record-btn"
              :class="isRecording ? 'btn-danger text-white' : 'btn-mint text-dark'"
              @click="toggleRecording"
            >
              <i :class="isRecording ? 'ri-stop-fill me-1' : 'ri-record-circle-fill me-1'"></i>
              {{ isRecording
                ? (mode === 'video' ? '녹화 중지' : '녹음 중지')
                : (
                    current <= lastAnswered
                      ? (mode === 'video' ? '재녹화 시작' : '재녹음 시작')
                      : (mode === 'video' ? '녹화 시작' : '녹음 시작')
                  )
              }}
            </button>
          </div>

          <!-- 답변 제출 버튼 (검정 테두리 & 작게) -->
          <div class="text-center mt-3">
            <button
              class="btn btn-outline-dark rounded-pill px-4 py-1 fw-medium small-text"
              @click="handleSubmit"
            >
              답변 제출
            </button>

            <button
              v-if="current === total && feedback"
              class="btn btn-mint w-100 mt-3"
              @click="finishInterview"
            >
              면접 결과 보러가기
            </button>

            <!-- 경고 메시지 -->
            <p v-if="errorMessage" class="text-danger mt-2 small">
              {{ errorMessage }}
            </p>
          </div>
        </div>

      </div>

      <!-- 오른쪽 AI 피드백 -->
      <div class="col-lg-3">

        <!-- AI 분석 중 스피너 -->
        <div v-if="aiLoading" class="spinner-container mt-3 mb-3">
          <div class="spinner"></div>
          <p class="text-muted mt-2">AI가 분석 중입니다...</p>
        </div>

        <!-- 분석 결과 -->
        <div class="bg-white border rounded-4 p-3 shadow-sm h-100" v-else-if="feedback && feedback.overallSummary">
          <h6 class="fw-bold text-primary mb-3">
            💬 AI 피드백 리포트 — {{ questions[current - 1] || "" }}
          </h6>

          <div class="small text-muted mb-3">
            <strong class="text-dark">🧾 종합 요약</strong><br />
            {{ feedback?.overallSummary }}
          </div>

          <div class="small text-muted mb-3" v-if="feedback.speechAnalysis">
            <strong class="text-dark">🗣️ 발음 / 말투</strong><br />
            {{ feedback.speechAnalysis }}
          </div>

          <div class="small text-muted mb-3" v-if="feedback.toneExpressionAnalysis">
            <strong class="text-dark">😊 톤 & 표정 분석</strong><br />
            {{ feedback.toneExpressionAnalysis }}
          </div>

          <div class="small text-muted mb-3" v-if="feedback.timeStructureAnalysis">
            <strong class="text-dark">🕒 시간 및 구성</strong><br />
            {{ feedback.timeStructureAnalysis }}
          </div>

          <div class="small text-muted mb-3" v-if="feedback.contentAnalysis">
            <strong class="text-dark">📄 내용 분석</strong><br />
            {{ feedback.contentAnalysis }}
          </div>

          <div class="small text-muted mb-3" v-if="feedback.keyCoachingPoint">
            <strong class="text-dark">💡 핵심 코칭 포인트</strong><br />
            {{ feedback.keyCoachingPoint }}
          </div>
        </div>

      </div>

    </div>
  </div>

  <!-- 작성 완료 로딩 오버레이 -->
  <div v-if="saveLoading" class="save-loading-overlay">
    <div class="save-loading-box">
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <p>면접 리포트가 생성되고 있습니다...</p>
      <p class="sub">AI 분석이 자동으로 실행돼요!</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import interviewProgress from "@/utils/interviewProgress.js";

const route = useRoute();
const sessionId = Number(route.params.sessionId);

const {
  mode,
  previewRef,
  isRecording,
  recordTime,
  current,
  total,
  questions,
  questionIds,
  lastAnswered,
  submitted,
  answerIds,
  lastRecordedBlob,
  errorMessage,
  feedback,
  feedbackMap,
  aiLoading,
  saveLoading,

  loadQuestions,
  toggleRecording,
  setMode,
  goPrevQuestion,
  goNextQuestion,
  handleSubmit,
  extractAudio,
  extractFrames,
  getFFmpeg,
  formatTime,
  finishInterview,
} = interviewProgress.useInterviewProgress(sessionId);

// 질문 자동 로딩
onMounted(() => {
  loadQuestions();
});
</script>

<style scoped src="@/assets/css/interviewProgress.css"></style>
