<template>
  <main class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <p class="tagline">AI 기반 커리어 성장 플랫폼</p>
        <h1>
          취업 준비의 모든 과정을<br />
          <span>AI가 함께합니다</span>
        </h1>
        <p class="desc">
          이력서 작성부터 면접 준비, 학습 트렌드 분석까지<br />
          당신만을 위한 맞춤 커리어 코칭으로 목표를 실현하세요.
        </p>
        <button class="btn-main" @click="router.push('/login')">시작하기</button>
      </div>
    </section>

    <!-- 기능 카드 -->
    <section class="features" id="features">
      <h2>핵심 기능</h2>
      <p class="subtitle">AI 기술로 당신의 취업을 완벽하게 준비하세요</p>

      <div class="feature-box">
        <div v-for="(f, i) in features" :key="i" class="feature">
          <i :class="f.icon"></i>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 통계 -->
    <section class="stats">
      <div v-for="(s, i) in stats" :key="i" class="stat">
        <i :class="s.icon"></i>
        <h4>{{ s.number }}</h4>
        <p>{{ s.label }}</p>
      </div>
    </section>

    <!-- 단계 -->
    <section class="steps">
      <h2>이렇게 시작하세요</h2>
      <p class="subtitle">간단한 3단계로 AI 커리어의 준비를 경험해보세요</p>
      <div class="step-list">
        <div v-for="(s, i) in steps" :key="i" class="step">
          <p class="num">{{ s.num }}</p>
          <h3>{{ s.title }}</h3>
          <p>{{ s.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>지금 바로 시작하세요</h2>
      <p>AI 커리어 코칭의 완성형과 함께 당신의 꿈을 실현해보세요</p>

      <div class="btn-group">
        <button class="btn-main" @click="router.push('/login')">시작하기</button>
         <button class="btn-sub" @click="scrollToFeatures">더 알아보기</button>
      </div>

      <p class="footer">© 2025 Career Coach | Let AI guide your next career move.</p>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const scrollToFeatures = () => {
  const el = document.getElementById('features')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' }) // 부드럽게 스크롤
  }
}

const features = [
  { icon: "ri-file-text-line", title: "이력서 코칭", desc: "AI 기반 이력서 분석 및 피드백 제공" },
  { icon: "ri-user-voice-line", title: "면접 코칭", desc: "AI 기반 면접 답변 분석 및 피드백 제공" },
  { icon: "ri-book-open-line", title: "학습 코칭", desc: "AI 기반 학습 피드백 및 맞춤 학습 제안" },
  { icon: "ri-line-chart-line", title: "트렌드 분석", desc: "AI 기반 취업 트렌드 분석 및 제안" },
];

const stats = [
  { icon: "ri-file-list-line", number: "1,234", label: "누적 코칭 완료" },
  { icon: "ri-emotion-happy-line", number: "94%", label: "사용자 만족도" },
  { icon: "ri-trophy-line", number: "234", label: "취업 성공" },
];

const steps = [
  { num: "01", title: "목표 설정", desc: "원하는 직무와 기업을 선택하고 커리어 목표를 세우세요." },
  { num: "02", title: "AI 분석", desc: "이력서, 자소서를 업로드하면 AI가 즉시 피드백을 제공합니다." },
  { num: "03", title: "성장 추적", desc: "매번 분석 결과를 통해 당신의 커리어 성장을 확인하세요." },
];
</script>

<style>
/* 공통 컬러 */
:root {
  --black: #000000;
  --gray-dark: #111111;
  --white: #ffffff;
  --gray-light1: #f1f2f3;
  --gray-light2: #eaebec;
  --green-light1: #ddf3eb;
  --green-light2: #a2f1d6;
  --green: #71ebbe;
  font-family: "Pretendard", sans-serif;
}

/* Hero */
.hero {
  background-color: var(--black);
  color: var(--white);
  text-align: center;
  padding: 140px 20px 160px;
}
.hero-inner {
  max-width: 780px;
  margin: 0 auto;
}
.tagline {
  color: var(--green);
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 10px;
}
.hero h1 {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 20px;
}
.hero h1 span {
  color: var(--green);
}
.hero .desc {
  color: #ccc;
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 40px;
}
.btn-main {
  background-color: var(--green);
  border: none;
  color: var(--black);
  padding: 13px 38px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}
.btn-main:hover {
  background-color: var(--green-light2);
}

/* 기능 카드 */
.features {
  background-color: var(--white);
  text-align: center;
  padding: 100px 20px;
}
.features h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
}
.subtitle {
  color: #666;
  margin: 10px 0 50px;
}
.feature-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}
.feature {
  background: var(--white);
  border: 1px solid var(--gray-light2);
  border-radius: 12px;
  padding: 40px 20px;
  width: 230px;
  transition: all 0.3s;
}
.feature:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
}
.feature i {
  font-size: 38px;
  color: var(--green);
  margin-bottom: 14px;
  display: block;
}
.feature h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
}
.feature p {
  color: #666;
  font-size: 0.9rem;
}

/* 통계 */
.stats {
  background-color: var(--green-light1);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 100px;
  padding: 100px 20px;
  text-align: center;
}
.stat i {
  font-size: 48px;
  color: var(--green);
  margin-bottom: 10px;
}
.stat h4 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}
.stat p {
  color: #555;
}

/* 단계 */
.steps {
  text-align: center;
  padding: 100px 20px;
  background-color: var(--gray-light1);
}
.steps h2 {
  font-size: 1.8rem;
  font-weight: 700;
}
.step-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 60px;
  margin-top: 60px;
}
.step {
  width: 220px;
}
.step .num {
  color: var(--green);
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
}
.step h3 {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 8px;
}
.step p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* CTA */
.cta {
  background-color: var(--black);
  color: var(--white);
  text-align: center;
  padding: 120px 20px;
}
.cta h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.cta p {
  color: #ccc;
  margin-bottom: 40px;
  font-size: 0.95rem;
}
.btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.btn-sub {
  background: transparent;
  border: 2px solid var(--green);
  color: var(--green);
  padding: 13px 36px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}
.btn-sub:hover {
  background-color: var(--green);
  color: var(--black);
}
.footer {
  color: #666;
  font-size: 0.8rem;
  margin-top: 60px;
}
</style>
