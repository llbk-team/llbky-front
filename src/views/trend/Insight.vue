<template>
  <div class="insight-page">
    <!-- 헤더 -->
    <div class="header">
      <div class="title-section">
        <h2>AI 직무 인사이트</h2>
        <p>뉴스 트렌드와 개인의 관심사를 분석해 추천하는 맞춤 직무</p>
      </div>
      <router-link to="/trend/saved" class="saved-btn">
        📑 저장한 키워드 ({{ savedCount }})
      </router-link>
    </div>

    <!-- 알림 섹션 -->
    <div class="notice-box">
      <p>
        ✅ <strong>분석 완료</strong><br />
        최근 뉴스 트렌드를 기반으로 직무별 연관 키워드를 도출했습니다.
        관심 있는 키워드를 클릭하면 저장소에 추가됩니다.
      </p>
    </div>

    <!-- 직무 카드 -->
    <div class="job-grid">
      <div v-for="(job, i) in jobs" :key="i" class="job-card">
        <div class="card-header">
          <h3>{{ job.title }}</h3>
          <span class="score">{{ job.score }}%</span>
        </div>
        <p class="desc">{{ job.desc }}</p>
        <div class="progress">
          <div class="bar" :style="{ width: job.score + '%' }"></div>
        </div>
        <div class="tags">
          <button
            v-for="tag in job.tags"
            :key="tag"
            @click="saveKeyword(tag)"
            class="tag-btn"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>

    <div class="hint-box">
      💡 클릭한 키워드는 저장소에서 확인할 수 있습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const jobs = ref([
  {
    title: "AI 엔지니어",
    score: 92,
    desc: "AI 모델 설계부터 배포까지 전반적인 영역을 담당합니다.",
    tags: ["Python", "TensorFlow", "LLM", "MLOps"],
  },
  {
    title: "클라우드 엔지니어",
    score: 88,
    desc: "클라우드 인프라 및 DevOps 환경을 관리합니다.",
    tags: ["AWS", "Kubernetes", "Docker", "DevOps"],
  },
  {
    title: "데이터 사이언티스트",
    score: 85,
    desc: "데이터 분석 및 머신러닝 모델 설계를 담당합니다.",
    tags: ["Pandas", "SQL", "Machine Learning"],
  },
  {
    title: "보안 전문가",
    score: 78,
    desc: "시스템 보안 및 네트워크 방어를 수행합니다.",
    tags: ["Security", "Network", "Forensic", "Encryption"],
  },
]);

const savedCount = ref(0);

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("user_keywords") || "[]");
  savedCount.value = saved.length;
});

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
  /* font-family: "Pretendard", sans-serif; */
}

/* 헤더 */
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
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.2s;
}
.saved-btn:hover {
  background: #00b487;
}

/* 알림 */
.notice-box {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
  border-radius: 12px;
  padding: 18px 22px;
  font-size: 14px;
  margin-bottom: 24px;
}

/* 직무 카드 */
.job-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.job-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  padding: 20px 24px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header h3 {
  font-weight: 700;
  font-size: 16px;
}
.card-header .score {
  font-weight: 700;
  color: #00c896;
}
.desc {
  font-size: 13px;
  color: #444;
  margin: 6px 0 10px;
}
.progress {
  height: 6px;
  background: #eee;
  border-radius: 8px;
  margin-bottom: 10px;
}
.bar {
  height: 100%;
  border-radius: 8px;
  background: #00c896;
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
}

/* 힌트 */
.hint-box {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 13px;
  margin-top: 28px;
}
</style>
