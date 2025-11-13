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
      <div class="col-lg-3">
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
            <template v-if="!isRecording">
              <i class="ri-video-line fs-1 mb-2 text-secondary"></i>
              <p class="text-muted small mb-0">
                녹음/녹화를 시작하면<br />여기에 미리보기가 표시됩니다
              </p>
            </template>

            <template v-else>
              <i v-if="mode === 'video'" class="ri-record-circle-fill fs-1 text-danger mb-2"></i>
              <i v-else class="ri-mic-fill fs-1 text-danger mb-2"></i>
              <p class="text-light small mb-1">
                {{ mode === 'video' ? '🎥 녹화 중...' : '🎙️ 녹음 중...' }}
              </p>
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
          </div>

          <!-- 모드 선택 -->
          <div class="d-flex justify-content-center gap-3 mb-4">
            <button
              class="btn w-50 py-3 fw-medium border mode-btn"
              :class="mode === 'video' ? 'active' : ''"
              @click="setMode('video')"
            >
              <i class="ri-video-line me-1"></i> 영상 녹화
            </button>
            <button
              class="btn w-50 py-3 fw-medium border mode-btn"
              :class="mode === 'audio' ? 'active' : ''"
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
              {{ current < total ? "답변 제출" : "면접 완료" }}
            </button>
          </div>
        </div>

      </div>

      <!-- 오른쪽 AI 피드백 -->
      <div class="col-lg-3">
        <div class="bg-white border rounded-4 p-3 shadow-sm h-100">
          <h6 class="fw-bold text-primary mb-3">
            💬 AI 피드백 리포트 — {{ questions[current - 1] }}
          </h6>

          <div class="small text-muted mb-3">
            <strong class="text-dark">🧾 종합 요약</strong><br />
            답변의 구조가 명확하며 논리적인 흐름이 좋습니다.<br />
            다만 강점을 좀 더 구체적인 사례로 보강해보세요.
          </div>

          <div class="small text-muted mb-3">
            <strong class="text-dark">🗣️ 발음 / 말투</strong><br />
            <ul class="ps-3 mb-0">
              <li>발음 명료하고 속도 적절 👍</li>
              <li>끝맺음은 조금 더 또렷하게!</li>
            </ul>
          </div>

          <div class="small text-muted mb-3">
            <strong class="text-dark">😊 톤 & 표정 분석</strong><br />
            <ul class="ps-3 mb-0">
              <li>표정: 자연스러움 😊</li>
              <li>시선: 안정적 👀</li>
              <li>톤: 중간 톤 유지, 감정 표현 적절.</li>
            </ul>
          </div>

          <div class="small text-muted mb-3">
            <strong class="text-dark">🕒 시간 및 구성</strong><br />
            <ul class="ps-3 mb-0">
              <li>총 길이 57초로 안정적입니다.</li>
              <li>도입-핵심-마무리 구성 적절합니다.</li>
            </ul>
          </div>

          <div class="small text-muted mb-3">
            <strong class="text-dark">📄 내용 분석</strong><br />
            <ul class="ps-3 mb-0">
              <li>핵심 키워드 전달력 우수.<br />직무 관련 키워드 추가 시 설득력 상승 가능.</li>
            </ul>
          </div>

          <div class="small text-muted">
            <strong class="text-dark">💡 코칭 포인트</strong><br />
            “자신의 경험 → 역할 → 성과” 순으로 구체화하면 설득력이 높아집니다.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import "remixicon/fonts/remixicon.css";
import router from "@/router";

const mode = ref("audio");
const isRecording = ref(false);
const recordTime = ref(0);
let timer = null;

const current = ref(1);
const total = 5;

const questions = [
  "1분 동안 자기소개를 해주세요.",
  "우리 회사에 지원한 이유는 무엇인가요?",
  "당신의 강점과 약점은 무엇인가요?",
  "팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하셨나요?",
  "AI 프로젝트를 개발할 때 가장 어려웠던 부분은 무엇이었나요?",
];

const startRecording = () => {
  isRecording.value = true;
  recordTime.value = 0;
  timer = setInterval(() => recordTime.value++, 1000);
};
const stopRecording = () => {
  isRecording.value = false;
  clearInterval(timer);
};
const setMode = (newMode) => {
  mode.value = newMode;
  stopRecording();
};
const restartRecording = () => {
  if (!isRecording.value) return;
  stopRecording();
  startRecording();
};

const lastAnswered = ref(0); // 마지막으로 완료된 질문 번호

const toggleRecording = () => {
  if (isRecording.value) {
    // 녹음 중지
    stopRecording();
  } else {
    // 새로 시작 or 재녹음
    startRecording();
    const action =
      current.value <= lastAnswered.value
        ? (mode.value === "video" ? "재녹화" : "재녹음")
        : (mode.value === "video" ? "녹화" : "녹음");
  }
};

const goPrevQuestion = () => {
  if (current.value > 1) {
    stopRecording(); // 혹시 녹음 중이면 중단
    current.value--; // 이전 질문로 이동
  }
};

const handleSubmit = () => {
  if (current.value < total) {
    alert(`질문 ${current.value}의 답변이 제출되었습니다.`);
    lastAnswered.value = Math.max(lastAnswered.value, current.value);
    current.value++;
    stopRecording();
  } else {
    alert("면접이 완료되었습니다! AI 분석을 시작합니다.");
    stopRecording();
    router.push("/interview/report");
  }
};

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
/* -------------------------
   🔹 제목 / 부제 폰트 통일
-------------------------- */

/* 상단 큰 제목 */
h3.fw-bold {
  font-size: 1.75rem !important;
  font-weight: 700 !important;
}

/* 설명 텍스트 */
p.small,
.text-muted.small,
label,
small,
span,
div.small

/* 질문 번호 */
.fw-semibold,
.fw-bold {
  font-weight: 700 !important;
}


/* -------------------------
   🔹 버튼 규격 통일
-------------------------- */

.btn {
  height: 37px !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  display: inline-flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 0 16px !important;
  letter-spacing: 0 !important;
}

/* 기본 버튼 너비(130px), 풀사이즈 버튼은 따로 유지 */
.btn:not(.w-50):not(.w-100):not(.rounded-circle) {
  width: 130px !important;
}

/* pill 버튼 */
.btn.rounded-pill {
  border-radius: 30px !important;
}

/* 기본 라운드는 네모(6px)—기존 px 유지 */
.btn {
  border-radius: 6px !important;
}

/* 녹화/녹음 버튼(크기 유지해야 하므로 width 제외) */
.record-btn {
  width: auto !important;
}

/* ‘이전 질문으로 돌아가기’ 링크 버튼 크기 깨지지 않도록 예외 처리 */
.btn-link {
  width: auto !important;
  height: auto !important;
  padding: 0 !important;
  font-size: 0.85rem !important;
}


/* -------------------------
   🔹 모드 선택 버튼도 규격 맞추기
-------------------------- */

.mode-btn {
  height: 37px !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  border-radius: 6px !important;
}

/* 🔹 민트 색상 통일 */
.bg-mint,
.progress-bar.bg-mint {
  background-color: #71ebbe !important;
}

/* 🔹 버튼 폰트 & 간격 */
.btn {
  font-weight: 500 !important;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
}

/* 🔹 기본 민트 버튼 */
.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
}
.btn-mint:hover {
  background-color: #5cd8ab !important;
}

/* 🔹 모드 선택 버튼 (비활성 시 DDF3EB) */
.mode-btn {
  background-color: #ddf3eb !important;
  color: #000 !important;
  border: none !important;
}
.mode-btn.active {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
}
.mode-btn:hover {
  background-color: #b8ecdb !important;
}

/* 🔹 기타 스타일 */
.bg-dark {
  background-color: #0e1111 !important;
}
.btn-danger {
  background-color: #ff6464 !important;
  border: none !important;
}
.btn-danger:hover {
  background-color: #e45454 !important;
}

.status-box {
  min-height: 85px !important; /* 두 줄 기준 고정 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 미리보기 박스 */
.preview-box {
  height: 320px;
  background-color: #0e1111 !important;
  font-weight: 100;
  color: #fff;
}
.preview-box i {
  opacity: 0.8;
}
.preview-box p {
  line-height: 1.4;
}
.prev-question-btn {
  left: -8px !important; /* 더 왼쪽으로 당기기 */
  padding-left: 0 !important;
  margin-left: 0 !important;
}

.tip-box {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
  border-radius: 12px;
  padding: 18px 22px;
  font-size: 10px;
  margin-top: 20px;
}

.tip-box h6 {
  color: #008b6a;  /* 분석 완료 박스 톤에 맞춰 자연스러운 녹색 */
}

.tip-box ul li {
  color: #555;
  font-size: 13px;
  line-height: 1.55;
}

</style>
