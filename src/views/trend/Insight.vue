<template>
  <div class="insight-page">
    <h2 class="page-title">AI 직무 인사이트</h2>
    <p class="page-subtitle">
      뉴스 트렌드와 커리어 관심사를 분석해 AI가 추천하는 맞춤 직무
    </p>

    <div class="summary-box">
      <h4>맞춤 분석 결과</h4>
      <p>
        최근 2개월간 뉴스 트렌드와 커리어 데이터를 기반으로 분석한 결과입니다.<br />
        AI 직무 인사이트는 관련 뉴스 요약, 트렌드 상승률, 키워드 패턴을 종합하여 추천 직무를 제안합니다.
      </p>
      <div class="summary-stats">
        <span>분석 뉴스: 1,234건</span>
        <span>직무 키워드: 156개</span>
      </div>
    </div>

    <div class="job-grid">
      <div v-for="(job, i) in jobs" :key="i" class="job-card">
        <div class="job-header">
          <router-link
            :to="`/trend?keyword=${encodeURIComponent(job.title)}`"
            class="job-link"
          >
            {{ job.title }}
          </router-link>
          <span class="confidence">{{ job.match }}%</span>
        </div>
        <div class="progress-bar">
          <div class="fill" :style="{ width: job.match + '%' }"></div>
        </div>
        <p class="desc">{{ job.desc }}</p>

        <div class="tags">
          <span v-for="(tag, t) in job.tags" :key="t">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const jobs = [
  {
    title: "AI 엔지니어",
    match: 92,
    desc: "AI 모델 설계부터 데이터 분석까지 담당하며, 산업별 AI 적용 전략을 수립합니다.",
    tags: ["Python", "TensorFlow", "LLM", "MLOps"],
  },
  {
    title: "클라우드 엔지니어",
    match: 88,
    desc: "클라우드 기반 인프라 설계와 서비스 운영을 담당합니다. DevOps 및 보안 역량이 요구됩니다.",
    tags: ["AWS", "Kubernetes", "DevOps", "Docker"],
  },
  {
    title: "데이터 사이언티스트",
    match: 85,
    desc: "데이터 분석 및 머신러닝을 통해 인사이트를 도출하며, 모델 성능을 최적화합니다.",
    tags: ["Python", "Pandas", "Machine Learning"],
  },
  {
    title: "보안 전문가",
    match: 78,
    desc: "기업 시스템 및 네트워크 보안을 유지하고, 취약점 분석 및 대응 전략을 수립합니다.",
    tags: ["Security", "Network", "Forensic"],
  },
];
</script>

<style scoped>
.insight-page {
  background: #ffffff;
  padding: 40px 80px 100px;
  font-family: "Pretendard", sans-serif;
  color: #111111;
}

/* 공통 카드 효과 */
.summary-box,
.job-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 14px;
  transition: 0.25s ease;
}
.summary-box:hover,
.job-card:hover {
  border-color: #d0d0d0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

/* 헤더 */
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #000000;
}
.page-subtitle {
  font-size: 14px;
  color: #555555;
  margin-bottom: 30px;
}

/* 분석 요약 */
.summary-box {
  padding: 20px 28px;
  margin-bottom: 36px;
}
.summary-box h4 {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 6px;
}
.summary-box p {
  font-size: 14px;
  color: #333333;
  line-height: 1.7;
}
.summary-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 13px;
  color: #555555;
}

/* 직무 카드 */
.job-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.job-card {
  padding: 22px 26px;
}
.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.job-link {
  font-size: 17px;
  font-weight: 700;
  color: #111;
  text-decoration: none;
}
.job-link:hover {
  color: #00c896;
}
.confidence {
  font-weight: 600;
  font-size: 14px;
  color: #71ebbe;
}

/* 진행바 */
.progress-bar {
  background: #f1f2f3;
  height: 7px;
  border-radius: 10px;
  margin: 10px 0 14px;
  overflow: hidden;
}
.progress-bar .fill {
  background: linear-gradient(90deg, #a2f1d6 0%, #71ebbe 100%);
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
}

/* 설명 */
.desc {
  font-size: 13.5px;
  color: #333333;
  line-height: 1.6;
  margin-bottom: 12px;
}

/* 태그 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tags span {
  background: #ddf3eb;
  color: #111111;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #a2f1d6;
  font-weight: 500;
}
</style>
