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

    <!-- 분석 완료 안내 -->
    <div class="notice-box">
      <p>
        ✅ <strong>분석 완료</strong><br />
        최근 뉴스 요약, 트렌드 데이터, 그리고 사용자의 <strong>저장 키워드</strong>를 함께 분석했습니다.<br />
        아래의 결과는 AI가 <strong>희망 직무</strong>를 중심으로 <strong>연관 직무와 기술 흐름</strong>까지 확장 분석한 인사이트입니다.
      </p>
    </div>

    <!-- 📊 두 개의 가로 박스 (이유 + 고도화) -->
    <div class="dual-info-box">
      <!-- 왼쪽: 왜 다른 직무도 함께 보이나요 -->
      <div class="context-box">
        <p>
          ℹ️ <strong>왜 다른 직무도 함께 보이나요?</strong><br />
          회원가입 시 선택한 희망 직무를 기준으로, AI가 관련 산업의 뉴스와 트렌드 데이터를 종합 분석하여<br />
          <strong>인접 직무</strong>나 <strong>전환 가능성이 높은 분야</strong>도 함께 제안합니다.<br />
          이는 커리어 확장 가능성과 학습 방향성을 돕기 위한 추천입니다.
        </p>
      </div>

      <!-- 오른쪽: 맞춤 분석 고도화 -->
      <div class="personal-context-box">
        <p>
          🧠 <strong>맞춤 분석 고도화</strong><br />
          AI는 사용자의 <strong>이력서</strong>·<strong>면접 피드백</strong>·<strong>학습 내역</strong>을 함께 분석하여 
          현재 역량과 시장 수요 간의 <strong>기술 격차(Skill Gap)</strong>를 파악합니다.<br />
          이를 바탕으로 <strong>보완이 필요한 기술</strong>과 
          <strong>성장 방향</strong>을 함께 제안합니다.
        </p>
      </div>
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
            🔍 * 이 인사이트는 희망 직무 및 AI 분석 데이터를 기반으로 자동 생성되었습니다.
          </p>
        </div>
      </div>
    </div>

    <!-- 💼 희망 직무 중심 성장 제안 -->
    <div class="career-analysis-box">
      <p>
        💼 <strong>희망 직무 중심 성장 제안</strong><br />
        AI가 사용자의 <strong>희망 직무</strong>를 중심으로 최근 트렌드와 
        이력서·면접·학습 데이터를 함께 분석했습니다.<br />
        아래는 시장 흐름과 현재 역량을 바탕으로 제안하는 성장 방향입니다.
      </p>

      <ul class="feedback-list">
        <li>
          <strong>📄 이력서 분석:</strong> 최근 업계에서는 
          <b>MLOps</b>와 <b>LLM 응용</b>이 핵심 키워드로 부상했습니다. 
          현재 이력서에는 관련 프로젝트 경험이 적게 나타나므로 
          모델 배포 및 운영 경험을 보완해보세요.
        </li>
        <li>
          <strong>🎤 면접 분석:</strong> 답변에서 프로젝트 성과나 수치를 구체적으로 제시하지 않은 경우가 있었습니다. 
          <b>정량적 결과 중심의 스토리텔링</b>을 추가하면 전문성이 강화됩니다.
        </li>
        <li>
          <strong>📚 학습 데이터 분석:</strong> 현재 학습 내역은 Python 중심입니다. 
          최근 트렌드에 맞춰 <b>데이터 거버넌스</b>나 <b>LLM 파인튜닝</b> 과정을 함께 진행하면 좋습니다.
        </li>
      </ul>
    </div>

    <div class="hint-box">
      💾 클릭한 키워드는 <strong>내 키워드</strong> 페이지에서 다시 확인할 수 있습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const savedCount = ref(0);

// 로컬 스토리지에서 희망 직무 가져오기
const userJob = ref(localStorage.getItem("user_job") || "AI 엔지니어");

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("user_keywords") || "[]");
  savedCount.value = saved.length;
});

// 첫 번째 카드 = 희망 직무
const jobs = ref([
  {
    title: userJob.value,
    summary: `${userJob.value} 직무는 최근 산업 트렌드에서 핵심 성장 분야로 분석되었습니다. 
    데이터 기반 문제 해결 능력과 모델 운영(MLOps) 역량이 중요하게 평가되고 있습니다.`,
    trendSummary: `최근 ${userJob.value} 관련 키워드로는 LLM, 모델 최적화, Python 자동화가 가장 많이 언급되었습니다. 
    산업 전반에서 ${userJob.value} 수요가 빠르게 확산 중입니다.`,
    tags: ["MLOps", "LLM", "Python", "AI Automation"],
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
  font-size: 24px;
  font-weight: 700;
}
.title-section p {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
}
.saved-btn {
  background: #00c896;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.2s;
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
  margin-bottom: 20px;
}

/* Dual Info Section */
.dual-info-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
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
  transition: 0.2s;
}
.tag-btn:hover {
  background: #a2f1d6;
  transform: scale(1.05);
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
  margin-top: 36px;
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
