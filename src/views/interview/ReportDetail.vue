<template>
  <div class="report-detail py-5">
    <div class="container d-flex flex-lg-row flex-column gap-4">
      <!-- 왼쪽 영역 -->
      <section class="col-lg-5 bg-black text-white rounded-4 p-4 shadow-sm">
        <!-- 제목 -->
        <div class="mb-4">
          <h3 class="fw-bold mb-0">{{ userName }}님의</h3>
          <h1 class="text-mint">AI 면접 리포트</h1>
        </div>

        <!-- 면접 정보 -->
        <div class="mb-4">
          <button class="btn btn-mint d-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill text-dark">
            <strong>면접 정보</strong>
          </button>

          <ul class="list-unstyled small">
            <li class="mb-2">
              <strong>면접 유형</strong>&nbsp; 
              <span class="text-mint">{{ sessionInfo && sessionInfo.interviewType ? sessionInfo.interviewType : '정보 없음' }}</span>
            </li>
            <li class="mb-2">
              <strong>희망 직무</strong>&nbsp;
              <span class="text-mint">{{ jobRole || '정보 없음' }}</span>
            </li>
            <li class="mb-2">
              <strong>희망 기업</strong>&nbsp;
              <span class="text-mint">{{ sessionInfo && sessionInfo.targetCompany ? sessionInfo.targetCompany : '정보 없음' }}</span>
            </li>
            <li>
              <strong>관련 서류</strong>
              <ul class="list-unstyled text-secondary ms-3 mt-2">
                <li v-if="sessionInfo && sessionInfo.documentFileName">
                  {{ sessionInfo.documentFileName }}
                </li>
                <li v-else>
                  파일 없음
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- 질문 목록 -->
        <div class="mb-4">
          <h5 class="fw-bold mb-3">질문 목록</h5>
          <div
            v-for="(q, i) in qaList"
            :key="i"
            class="d-flex align-items-center justify-content-between bg-dark rounded-3 px-3 py-2 mb-2 question-item"
            :class="{ active: selectedQuestion && selectedQuestion.questionId === q.questionId }"
            @click="selectQuestion(q)"
            style="cursor: pointer;"
          >
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-mint text-black fw-bold px-2 py-1">{{ i + 1 }}</span>
              <span>{{ q.questionText }}</span>
            </div>
          </div>
        </div>

        <!-- 답변 목록 -->
        <div>
          <h5 class="fw-bold mb-3">답변 목록</h5>

          <div
            v-if="selectedQuestion"
            class="bg-light text-dark rounded-3 p-3 d-flex flex-column align-items-center"
          >
            <div class="d-flex align-items-center gap-3 w-100">

              <!-- 오디오 플레이어 -->
              <div
                class="flex-grow-1 d-flex align-items-center justify-content-between bg-white border rounded px-3 py-2"
                style="height: 55px;"
                v-if="selectedQuestion.audioUrl"
              >
                <audio
                  ref="audioRef"
                  :src="selectedQuestion.audioUrl"
                  @play="isPlaying = true"
                  @pause="isPlaying = false"
                  style="height: 32px; width: 100%;"
                  controls
                ></audio>
              </div>
            </div>

            <!-- 영상이 있을 때 -->
            <video
              v-if="selectedQuestion.videoUrl"
              controls
              :src="selectedQuestion.videoUrl"
              class="rounded-3 mt-3 mx-auto d-block"
              style="max-height: 200px; width: 90%; max-width: 500px;"
            ></video>
          </div>

          <div v-else class="text-secondary small">
            질문을 클릭하면 답변이 여기에 표시됩니다.
          </div>
        </div>
      </section>

      <!-- 오른쪽 영역 -->
      <section class="right-panel rounded-4 p-4 shadow-sm">
        <!-- 보기 모드 -->
        <div class="d-flex justify-content-end mb-3">
          <!-- 선택 질문 보기일 때 -->
          <button
            v-show="mode !== 'all'"
            class="btn btn-sm btn-outline-secondary text-dark"
            @click="mode = 'all'"
          >
            전체 보기
          </button>
        </div>

        <!-- 종합 평가 -->
        <div class="card border-mint p-4 mb-4">
          <h4 class="fw-bold mb-2 text-dark">{{ mode === 'single' ? '개별 평가' : '종합 평가' }}</h4>
          <div class="score-row">
            <div class="score-top">
              <h4 class="fw-bold text-dark mb-0">{{ mode === 'single' ? singleTotalScore : totalScore }}/100점</h4>
            </div>

            <div class="progress mb-1" style="height: 8px;">
              <div 
                class="progress-bar bg-mint" 
                role="progressbar" 
                :style="{ width: (mode === 'single' ? singleTotalScore : totalScore) + '%' }"
              ></div>
            </div>

            <small class="text-muted">
              언어 {{ mode === 'single' ? singleLanguageScore : languageScore }}/100 •
              비언어 {{ mode === 'single' ? singleNonLanguageScore : nonLanguageScore }}/100
            </small>

          </div>
        </div>

        <!-- 피드백 카드 -->
        <div class="row g-3">
          <div
            v-for="(card, index) in filteredFeedback"
            :key="index"
            class="col-md-6"
          >
            <div class="card h-100 border-mint p-3 bg-white">
              <h5 class="fw-bold text-dark mb-2">{{ card.title }}</h5>
              <p class="text-dark small mb-0" v-html="card.content"></p>
            </div>
          </div>
        </div>

        <!-- 하단 버튼 -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-outline-mint" @click="$router.push('/interview/report')">
            목록으로 돌아가기
          </button>
          <button class="btn btn-mint" @click="$router.push('/interview/mock')">
            모의 면접 시작
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import interviewReport from '@/utils/interviewReport';
import { useRoute } from 'vue-router';
import { useStore } from "vuex";
import { computed } from "vue";

const route = useRoute();

const store = useStore();

// 로그인된 사용자 정보
const userInfo = computed(() => store.getters["user/userInfo"]) ;
const memberId = computed(() => {
  if (userInfo.value) {
    return userInfo.value.memberId;
  }
  return undefined;
});
const memberName = computed(() => userInfo.value?.memberName);
const memberJobRole = computed(() => userInfo.value?.jobRole);

const {
  loading,
  userName,
  languageScore,
  nonLanguageScore,
  totalScore,
  singleLanguageScore,
  singleNonLanguageScore,
  singleTotalScore,
  error,
  sessionInfo,
  qaList,
  finalFeedback,
  jobRole,

  makeAudioUrl,
  makeVideoUrl,

  selectedQuestion,
  selectQuestion,
  mode,
  filteredFeedback,

  audioRef,
  isPlaying,
  togglePlay
} = interviewReport.useInterviewReport(route.query.sessionId, memberId.value, memberName.value, memberJobRole.value);
</script>

<style scoped src="@/assets/css/interviewReport.css"></style>
