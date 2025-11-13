<template>
  <div class="insight-page">
    <!-- 헤더 -->
    <div class="header">
      <div class="title-section">
        <h2>AI 추천 인사이트</h2>
        <p>
          AI가 최신 뉴스·트렌드·저장 키워드를 종합 분석해,
          희망 직무를 중심으로 연관 직무와 기술 흐름을 제안합니다.
        </p>
      </div>

      <!-- 📂 이모지 적용 -->
      <router-link to="/trend/saved" class="saved-btn">
        📂 내 키워드 보기 ({{ savedCount }})
      </router-link>
    </div>

    <!-- 💼 희망 직무 중심 성장 제안 -->
    <div class="career-analysis-box">
      <p>
        <strong>희망 직무 중심 성장 제안</strong><br />
        AI가 사용자의 <strong>희망 직무</strong>를 중심으로 최근 트렌드와
        이력서·면접·학습 데이터를 함께 분석했습니다.<br />
        아래는 시장 흐름과 현재 역량을 바탕으로 제안하는 성장 방향입니다.
      </p>

      <ul class="feedback-list">
        <li>
          <strong> 이력서 분석:</strong> 최근 업계에서는
          <b>MLOps</b>와 <b>LLM 응용</b>이 핵심 키워드로 부상했습니다.
          현재 이력서에는 관련 프로젝트 경험이 적게 나타나므로
          모델 배포 및 운영 경험을 보완해보세요.
        </li>
        <li>
          <strong> 면접 분석:</strong> 답변에서 프로젝트 성과나 수치를 구체적으로 제시하지 않은 경우가 있었습니다.
          <b>정량적 결과 중심의 스토리텔링</b>을 추가하면 전문성이 강화됩니다.
        </li>
        <li>
          <strong> 학습 데이터 분석:</strong> 현재 학습 내역은 Python 중심입니다.
          최근 트렌드에 맞춰 <b>데이터 거버넌스</b>나 <b>LLM 파인튜닝</b> 과정을 함께 진행하면 좋습니다.
        </li>
      </ul>
    </div>

    <!-- 🤖 AI 추천 인사이트 -->
    <div class="recommend-section">
      <h3>🤖 AI 추천 인사이트</h3>

      <p class="sub-desc">
        최근 뉴스·트렌드 분석과 저장된 키워드를 바탕으로
        AI가 제안하는 연관 직무와 핵심 기술 키워드입니다.
      </p>

      <div class="recommend-grid">
        <div v-for="(job, i) in jobs" :key="i" class="recommend-card">
          <h4>{{ job.title }}</h4>
          <p class="summary">{{ job.summary }}</p>

          <div class="trend-box">
            <h5>📊 트렌드 요약</h5>
            <p>{{ job.trendSummary }}</p>
          </div>

          <div class="keyword-box">
            <h5>💡 관련 키워드</h5>
            <div class="tags">
              <button
                v-for="tag in job.tags"
                :key="tag"
                class="tag-btn"
                :class="{ saved: isSaved(tag) }"
                @click="toggleKeyword(tag)"
              >
                {{ isSaved(tag) ? `✔ ${tag}` : tag }}
              </button>
            </div>
          </div>

          <p class="note">🔍 * 이 인사이트는 자동 생성된 추천입니다.</p>
        </div>
      </div>
    </div>

    <!-- 📘 설명 박스 -->
    <div class="dual-info-box">

      <div class="context-box">
        <p>
          ℹ️ <strong>왜 다른 직무도 함께 보이나요?</strong><br />
          AI가 희망 직무를 기준으로 연관 산업의 데이터들을 분석하여<br />
          <strong>인접 직무</strong>와 <strong>확장 가능한 직무</strong>도 추천합니다.
        </p>
      </div>

      <div class="personal-context-box">
        <p>
          🧠 <strong>맞춤 분석 고도화</strong><br />
          이력서·면접·학습 데이터를 기반으로 기술 격차를 분석하고<br />
          성장 방향을 제안합니다.
        </p>
      </div>
    </div>

    <div class="hint-box">💾 클릭한 키워드는 저장됩니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const savedKeywords = ref([]);
const savedCount = ref(0);
const userJob = ref(localStorage.getItem("user_job") || "AI 엔지니어");

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem("user_keywords") || "[]");
  savedKeywords.value = Array.isArray(stored) ? stored : [];
  savedCount.value = savedKeywords.value.length;
});

const isSaved = (tag) => savedKeywords.value.includes(tag);

const toggleKeyword = (tag) => {
  const index = savedKeywords.value.indexOf(tag);

  if (index === -1) savedKeywords.value.push(tag);
  else savedKeywords.value.splice(index, 1);

  localStorage.setItem("user_keywords", JSON.stringify(savedKeywords.value));
  savedCount.value = savedKeywords.value.length;
};

const jobs = ref([
  {
    title: userJob.value,
    summary: `${userJob.value} 직무는 최근 산업 트렌드에서 핵심 성장 분야로 분석되었습니다.`,
    trendSummary: `최근 ${userJob.value} 관련 키워드로는 LLM, MLOps, Python 자동화가 가장 많이 언급되었습니다.`,
    tags: ["MLOps", "LLM", "Python", "AI Automation"],
  },
  {
    title: "클라우드 엔지니어",
    summary:
      "기업의 클라우드 전환 속도가 빨라지며 관련 기술 수요가 증가 중입니다.",
    trendSummary: "DevOps 자동화, AWS, 보안이 주요 키워드입니다.",
    tags: ["AWS", "Kubernetes", "DevOps", "Docker"],
  },
  {
    title: "데이터 사이언티스트",
    summary:
      "데이터 기반 예측과 생성형 AI 적용이 활발한 분야입니다.",
    trendSummary: "Pandas, SQL, 머신러닝 기술이 꾸준한 관심을 받고 있습니다.",
    tags: ["SQL", "Pandas", "Machine Learning", "Visualization"],
  },
]);
</script>

<style scoped>
.insight-page {
  padding: 40px 60px 60px 60px;
  color: #111;
  font-family: "NexonLv1Gothic", sans-serif;
  max-width: 1300px;
  margin: 0 auto;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.title-section h2 {
  font-size: 28px;
  font-weight: 700;
}

.title-section p {
  font-size: 16px;
  color: #6c757d;
}

.saved-btn {
  background: #00c896;
  color: #fff;
  height: 37px;
  font-weight: 600;
  font-size: 13.5px;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  transition: 0.2s;
}

.saved-btn:hover {
  background: #00b487;
}

/* Dual Info Section */
.dual-info-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.context-box,
.personal-context-box {
  border-radius: 10px;
  padding: 16px 20px;
  font-size: 13px;
  line-height: 1.6;
}

.context-box {
  background: #fff8ea;
  border: 1px solid #ffe19d;
  color: #444;
}

.context-box strong {
  color: #b25c00;
}

.personal-context-box {
  background: #eef7ff;
  border: 1px solid #c9e3ff;
  color: #333;
}

.personal-context-box strong {
  color: #0059b3;
}

/* Recommend Section */
.recommend-section h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}

.sub-desc {
  font-size: 13px;
  color: #555;
  margin-bottom: 20px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.recommend-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.2s;
}

.recommend-card h4 {
  font-size: 19px;
  font-weight: 700;   /* 굵기 강화 */
  margin-bottom: 10px;
  color: #111;
}


.recommend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.summary {
  font-size: 13px;
  color: #444;
  line-height: 1.6;
  margin-bottom: 14px;
}

.trend-box,
.keyword-box {
  background: #f7fcfa;
  border: 1px solid #a2f1d6;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.trend-box p {
  font-size: 13px;    /* 기존보다 작고 안정적인 크기 */
  line-height: 1.55;
}

.trend-box h5,
.keyword-box h5 {
  font-size: 13px;
  font-weight: 700;
  color: #00b487;
  margin-bottom: 6px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  border: 1px solid #a2f1d6;
  background: #ddf3eb;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  transform: scale(1.05);
}

/* ⭐ 저장된 키워드 시각적 표시 */
.tag-btn.saved {
  background: #00c896;
  border-color: #009b72;
  color: #fff;
}

.tag-btn.saved:hover {
  background: #00c896;
  transform: scale(1.0);
}

/* 클릭 시 살짝 눌리는 효과 */
.tag-btn:active {
  transform: scale(0.92);
}


.note {
  font-size: 12px;
  color: #777;
  margin-top: 8px;
}

/* Career Analysis Section */
.career-analysis-box {
  
  background: #f1f6ff;
  border: 1px solid #c7dafd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 40px;
  font-size: 13px;
  color: #333;
  line-height: 1.6;
}

.career-analysis-box strong {
  color: #0040a8;
}

.feedback-list {
  margin-top: 10px;
  list-style: none;
  padding-left: 0;
}

.feedback-list li {
  background: #fff;
  border: 1px solid #dbe7ff;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  font-size: 13px;
}

.feedback-list b {
  color: #0069ff;
}

/* Hint */
.hint-box {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 13px;
  margin-top: 28px;
  text-align: center;
}
</style>
