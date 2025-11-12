<template>
  <div class="report-detail py-5">
    <div class="container d-flex flex-lg-row flex-column gap-4">
      <!-- 왼쪽 영역 -->
      <section class="col-lg-5 bg-black text-white rounded-4 p-4 shadow-sm">
        <!-- 제목 -->
        <div class="mb-4">
          <h3 class="fw-bold mb-0">OOO 님의</h3>
          <h1 class="fw-bolder text-mint mt-0">AI 면접 리포트</h1>
        </div>

        <!-- 면접 정보 -->
        <div class="mb-4">
          <button class="btn btn-mint d-flex align-items-center gap-2 fw-semibold mb-3 px-3 py-1 rounded-pill text-dark">
            <i class="bi bi-info-circle-fill text-dark"></i>
            면접 정보
          </button>

          <ul class="list-unstyled small">
            <li class="mb-2">
              <strong>면접 유형</strong> <span class="text-mint">종합 면접</span>
            </li>
            <li class="mb-2">
              <strong>희망 직무</strong> <span class="text-mint">백엔드 개발자</span>
            </li>
            <li class="mb-2">
              <strong>희망 기업</strong> <span class="text-mint">구글</span>
            </li>
            <li>
              <strong>관련 서류</strong>
              <ul class="list-unstyled text-secondary ms-3 mt-2">
                <li>구글_김OO_이력서.pdf</li>
                <li>구글_김OO_포트폴리오.pdf</li>
                <li>구글_김OO_자기소개서.pdf</li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- 질문 목록 -->
        <div class="mb-4">
          <h5 class="fw-bold mb-3">질문 목록</h5>
          <div
            v-for="(q, i) in questions"
            :key="i"
            class="d-flex align-items-center justify-content-between bg-dark rounded-3 px-3 py-2 mb-2 question-item"
            :class="{ active: selectedQuestion?.id === q.id }"
            @click="selectQuestion(q)"
            style="cursor: pointer;"
          >
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-mint text-black fw-bold px-2 py-1">{{ i + 1 }}</span>
              <span>{{ q.text }}</span>
            </div>
          </div>
        </div>

        <!-- 답변 목록 -->
        <div>
          <h5 class="fw-bold mb-3">답변 목록</h5>

          <div v-if="selectedQuestion" class="bg-light text-dark rounded-3 p-3 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3 w-100">
              <div
                class="d-flex justify-content-center align-items-center bg-mint text-dark fw-bold rounded-pill"
                style="width: 55px; height: 55px; font-size: 14px;"
              >
                음성
              </div>

              <div class="flex-grow-1 d-flex align-items-center justify-content-between bg-white border rounded px-3 py-2" style="height: 55px;">
                <audio
                  ref="audioRef"
                  :src="selectedQuestion.audio"
                  @play="isPlaying = true"
                  @pause="isPlaying = false"
                  style="height: 32px; width: 100%;"
                  controls
                ></audio>
              </div>
            </div>
          </div>

          <div v-else class="text-secondary small">질문을 클릭하면 답변이 여기에 표시됩니다.</div>
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
          <h4 class="fw-bold mb-2 text-dark">종합 평가</h4>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="w-100 me-3">
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-mint" role="progressbar" style="width: 85%;"></div>
              </div>
              <small class="text-muted">언어 82/100 &nbsp;•&nbsp; 비언어 88/100</small>
            </div>
            <h4 class="fw-bold text-dark mb-0">85/100점</h4>
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
import { ref, computed } from "vue";

const isPlaying = ref(false);
const audioRef = ref(null);

const togglePlay = () => {
  if (!audioRef.value) return;
  if (isPlaying.value) audioRef.value.pause();
  else audioRef.value.play();
};

const questions = ref([
  { id: 1, text: "1분 동안 자기소개를 해주세요.", feedback: "자기소개는 구조적이지만 핵심 강조가 약합니다.", audio: "https://www.w3schools.com/html/horse.mp3" },
  { id: 2, text: "RESTful API 설계 원칙에 대해 설명해주세요.", feedback: "REST 원칙 설명은 정확하나, 예시가 부족합니다.", audio: "https://www.w3schools.com/html/horse.mp3" },
  { id: 3, text: "팀 내 의견 충돌이 발생했을 때 어떻게 해결하셨나요?", feedback: "갈등 상황을 구체적으로 설명해 설득력 있습니다.", audio: "https://www.w3schools.com/html/horse.mp3" }
]);

const selectedQuestion = ref(null);
const selectQuestion = (q) => { selectedQuestion.value = q; mode.value = "single"; };

const mode = ref("all");

const feedbackCards = ref([
  { title: "🧾 종합 요약", content: "자기소개 구조가 명확하고 말의 속도도 안정적임.<br>핵심 강점이 드러나지 않아 인상에 남기엔 약함." },
  { title: "💡 AI 추천 핵심 코칭 포인트", content: "“자기소개에서 강점 → 사례 → 포부 순으로 구성하며,<br>직무 관련 키워드를 최소 2개 이상 포함하세요.”" },
  { title: "🗣️ 발음 / 말투", content: "발음은 대체로 정확하나 문장 끝부분이 살짝 올려짐.<br>전반적 안정성 좋음 👍" },
  { title: "🕒 시간 및 구성", content: "총 58초 답변으로 시간 분배 적절.<br>도입 → 본론 → 결론 구조로 자연스러움." },
  { title: "📄 내용 분석", content: "핵심 키워드 전달력 우수.<br>직무 관련 키워드 추가 시 설득력 상승 가능." },
  { title: "😊 톤 & 표정 분석", content: "표정: 자연스러움 😊<br>시선: 안정적 👀<br>톤: 중간 톤 유지, 감정 표현 적절." }
]);

const filteredFeedback = computed(() => {
  if (mode.value === "single" && selectedQuestion.value)
    return [{ title: "💬 선택 질문 피드백", content: selectedQuestion.value.feedback }];
  return feedbackCards.value;
});
</script>

<style scoped>
.report-detail {
  background-color: #0b0b0b;
  min-height: 100vh;
  color: #fff;
}

/* 색상 공통 */
.text-mint { color: #71ebbe !important; }
.bg-mint { background-color: #71ebbe !important; }
.border-mint { border: 1px solid #71ebbe55 !important; }

/* 버튼 */
.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
}
.btn-mint:hover { background-color: #5cd8ab !important; }
.btn-outline-mint {
  border: 1px solid #71ebbe !important;
  color: #71ebbe !important;
  background: none !important;
}
.btn-outline-mint:hover {
  background-color: #71ebbe !important;
  color: #000 !important;
}

/* 질문 선택 */
.question-item.active {
  border: 1px solid #71ebbe;
  background-color: #1a1a1a;
}

/* 오른쪽 영역 (피드백) */
.right-panel {
  flex: 1;
  background-color: #f9f9f9;
  border: 1px solid #71ebbe33;
}

/* 오디오 */
audio::-webkit-media-controls-panel { background-color: transparent; }
audio { border-radius: 6px; }
</style>
