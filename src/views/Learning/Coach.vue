<template>
  <div class="container py-4">
    <!-- 제목 행 -->
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="fw-bold fs-3 mb-1" style="color:#111111;">AI 학습 코치</h1>
        <p class="text-muted mb-0">안녕하세요! 오늘의 학습 계획을 이어가볼까요?</p>
      </div>

      <router-link :to="`/learning/goal`" class="btn btn-green shadow-sm px-3 fw-semibold">
        + 새 학습 시작하기
      </router-link>
    </div>

    <div class="row g-4">
      <!-- 왼쪽 -->
      <div class="col-md-7">
        <div class="card shadow-sm p-4 mb-3 card-clean">
          <h5 class="fw-bold mb-3" style="color:#111111;">내 학습 이어하기</h5>

          <div v-for="(plan, i) in ongoingPlans" :key="i" class="card border-light mb-3 sub-card">
            <div class="card-body">
              <h6 class="fw-semibold">{{ plan.title }}</h6>
              <p class="text-secondary small">{{ plan.period }}</p>

              <div class="progress mb-2" style="height: 6px;">
                <div class="progress-bar" role="progressbar" :style="{ width: plan.progress + '%', backgroundColor: '#71EBBE' }"></div>
              </div>

              <p class="text-secondary small mb-2">진행률 {{ plan.progress }}%</p>
              <button class="btn btn-outline-green btn-sm">학습 이어하기 →</button>
            </div>
          </div>
        </div>

        <div class="card shadow-sm p-4 card-clean">
          <h5 class="fw-bold mb-3" style="color:#111111;">완료된 학습 플랜</h5>
          <div v-for="(plan, i) in completedPlans" :key="i" class="card border-light mb-3 sub-card">
            <div class="card-body">
              <h6 class="fw-semibold">{{ plan.title }}</h6>
              <p class="text-secondary small mb-1">{{ plan.period }}</p>
              <p class="text-secondary small">완료일: {{ plan.completedDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 -->
      <div class="col-md-5">
        <div class="card shadow-sm p-4 mb-3 card-clean">
          <h5 class="fw-bold mb-3" style="color:#111111;">나의 학습 현황</h5>

          <div class="rounded-3 p-3 text-center mb-3" style="background-color:#DDF3EB;">
            <p class="fw-bold fs-4 mb-0" style="color:#111111;">{{ stats.ongoing }}</p>
            <p class="text-secondary small mb-0">진행 중인 플랜</p>
          </div>

          <div class="rounded-3 p-3 text-center" style="background-color:#A2F1D6;">
            <p class="fw-bold fs-4 mb-0" style="color:#111111;">{{ stats.completed }}</p>
            <p class="text-secondary small mb-0">완료한 플랜 🎉</p>
          </div>
        </div>

        <div class="card shadow-sm p-4 card-clean">
          <h5 class="fw-bold mb-3" style="color:#111111;">AI 코멘트</h5>
          <div class="p-3 rounded border mb-2" style="background-color:#DDF3EB; border-color:#71EBBE;">
            <p class="small mb-0" style="color:#111111;">“{{ aiComment.main }}”</p>
          </div>
          <p class="text-muted small">참고: {{ aiComment.tip }} 💪</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const ongoingPlans = [
  { title: '백엔드 취업 준비', period: '4주 플랜', progress: 40 },
  { title: '백엔드 취업 준비', period: '4주 플랜', progress: 40 }
]

const completedPlans = [
  { title: '백엔드 취업 준비', period: '4주 플랜', completedDate: '2025-10-01' }
]

const stats = { ongoing: 2, completed: 1 }

const aiComment = {
  main: 'SQL 학습 플랜을 잘 진행 중이에요! 이번 주 목표는 Spring Security를 공부해봐요.',
  tip: '하루 30분만 더 투자하면 목표 자격증 합격 확률이 눈에 띄게 높아져요!'
}
</script>

<style scoped>
body {
  font-family: 'Pretendard', sans-serif;
  background-color: #F1F2F3;
  color: #111111;
}

/* 카드 공통 */
.card-clean {
  border-radius: 1rem;
  border: 1px solid #EAEBEC;
  background-color: #FFFFFF;
}

.sub-card {
  border-radius: 0.75rem;
  border: 1px solid #EAEBEC;
  background-color: #F8FAF9;
}

/* 민트색 버튼 */
.btn-green {
  background-color: #71EBBE;
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 0.75rem;
}

.btn-green:hover {
  background-color: #A2F1D6;
  border-color: #A2F1D6;
}

.btn-outline-green {
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 0.5rem;
}

.btn-outline-green:hover {
  background-color: #71EBBE;
  color: #111111;
}

/* 그림자 */
.shadow-sm {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
}
</style>
