<template>
  <div class="insight-page">
    <!-- 헤더 -->
    <div class="header">
      <div class="title-section">
        <h2>AI 추천 인사이트</h2>
        <p>뉴스·트렌드와 저장한 키워드를 분석해 제안하는 맞춤 직무 인사이트</p>
      </div>
      <router-link to="/trend/saved" class="saved-btn">
        📑 내 키워드 보기 ({{ savedCount }})
      </router-link>
    </div>

    <!-- 분석 안내 -->
    <div class="notice-box">
      <p>
        ✅ <strong>분석 완료</strong><br />
        최근 뉴스 요약, 트렌드 데이터, 그리고 사용자의 <strong>저장 키워드</strong>를 함께 분석했습니다.<br />
        아래의 결과는 AI가 <strong>희망 직무</strong>를 중심으로 <strong>연관 직무와 기술 흐름</strong>까지 확장 분석한 인사이트입니다.
      </p>
    </div>

    <!-- 추가 안내 문구 (이유 설명) -->
    <div class="context-box">
      <p>
        ℹ️ <strong>왜 다른 직무도 함께 보이나요?</strong><br />
        회원가입 시 선택한 희망 직무를 기준으로, AI가 관련 산업의 뉴스와 트렌드 데이터를 종합 분석하여<br />
        <strong>인접 직무</strong>나 <strong>전환 가능성이 높은 분야</strong>도 함께 제안합니다.<br />
        이는 당신의 커리어 확장 가능성과 학습 방향성을 돕기 위한 추천입니다.
      </p>
    </div>

    <!-- AI 추천 인사이트 -->
    <div class="recommend-section">
      <h3>🤖 AI 추천 인사이트</h3>
      <p class="sub-desc">
        최근 뉴스·트렌드 분석과 저장된 키워드를 바탕으로 AI가 추천한 직무 방향과 핵심 기술 키워드입니다.
      </p>

      <div class="recommend-grid">
        <div v-for="(job, i) in jobs" :key="i" class="recommend-card">
          <h4>{{ job.title }}</h4>
          <p class="summary">{{ job.summary }}</p>

          <div class="trend-box">
            <h5>📈 트렌드 요약</h5>
            <p>{{ job.trendSummary }}</p>
          </div>

          <div class="keyword-box">
            <h5>💡 관련 키워드</h5>
            <div class="tags">
              <button
                v-for="tag in job.tags"
                :key="tag"
                class="tag-btn"
                @click="saveKeyword(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <p class="note">
            🔍 * 이 인사이트는 사용자의 희망 직무, 저장 키워드, 최신 뉴스 데이터를 기반으로 자동 생성되었습니다.
          </p>
        </div>
      </div>
    </div>

    <div class="hint-box">
      💾 클릭한 키워드는 <strong>내 키워드</strong> 페이지에서 다시 확인할 수 있습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const savedCount = ref(0);

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("user_keywords") || "[]");
  savedCount.value = saved.length;
});

// AI 추천 인사이트 (직무별 예시)
const jobs = ref([
  {
    title: "AI 엔지니어",
    summary:
      "생성형 AI, 모델 배포(MLOps), Python 활용 역량이 핵심으로 꼽히고 있습니다. 최신 뉴스에서도 AI 자동화와 모델 운영이 주요 주제로 다뤄집니다.",
    trendSummary:
      "LLM, MLOps, Python 관련 수요가 지속적으로 상승 중이며, 산업 전반에서 AI 도입이 가속화되고 있습니다.",
    tags: ["LLM", "MLOps", "Python", "TensorFlow"],
  },
  {
    title: "클라우드 엔지니어",
    summary:
      "기업의 클라우드 전환 속도가 빨라지며 AWS, Docker, Kubernetes 관련 기술 수요가 증가하고 있습니다.",
    trendSummary:
      "DevOps 자동화와 컨테이너 보안이 주요 키워드로 부상했습니다.",
    tags: ["AWS", "Kubernetes", "DevOps", "Docker"],
  },
  {
    title: "데이터 사이언티스트",
    summary:
      "데이터 기반 예측과 생성형 AI의 융합이 활발히 진행되고 있으며, SQL과 머신러닝 역량이 핵심으로 꼽힙니다.",
    trendSummary:
      "Pandas, SQL, 머신러닝 기술이 여전히 높은 검색량을 유지하고 있습니다.",
    tags: ["SQL", "Pandas", "Machine Learning", "Visualization"],
  },
]);

const saveKeyword = (tag) => {
  const saved = JSON.parse(localStorage.getItem("user_keywords") || "[]");
  if (!saved.includes(tag)) {
    saved.push(tag);
    localStorage.setItem("user_keywords", JSON.stringify(saved));
    savedCount.value = saved.length;
    alert(`'${tag}' 키워드가 저장되었습니다 ✅`);
  } else {
    alert(`이미 저장된 키워드입니다.`);
  }
};
</script>

<style scoped>
.insight-page {
  background: #f9faf9;
  padding: 40px 80px;
  color: #111;
  font-family: "NexonLv1Gothic", sans-serif;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}
.title-section h2 {
  font-size: 24px;
  font-weight: 700;
}
.title-section p {
  font-size: 14px;
  color: #555;
}
.saved-btn {
  background: #00c896;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
}
.saved-btn:hover {
  background: #00b487;
}

/* Notice */
.notice-box {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
  border-radius: 12px;
  padding: 18px 22px;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Context Explanation */
.context-box {
  background: #fff8ea;
  border: 1px solid #ffe19d;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 26px;
  font-size: 13px;
  color: #444;
  line-height: 1.6;
}
.context-box strong {
  color: #b25c00;
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
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.recommend-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  padding: 24px;
}
.recommend-card h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
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
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.tag-btn:hover {
  background: #a2f1d6;
}
.note {
  font-size: 12px;
  color: #777;
  margin-top: 8px;
}

/* Hint */
.hint-box {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 13px;
  margin-top: 28px;
}
</style>
