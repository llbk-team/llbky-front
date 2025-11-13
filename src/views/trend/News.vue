<template>
  <div class="trend-news">
    <!-- Hero -->
    <section class="hero">
      <h2>AI가 분석해주는 채용 트렌드</h2>

      <!-- 검색창 -->
      <div class="search-bar">
        <input type="text" placeholder="키워드를 입력하세요 (예: 인공지능, 백엔드, AI 개발자)" v-model="keyword" @keyup.enter="searchNews" />
        <button @click="searchNews">검색</button>
      </div>

      <!-- 🔹 최근 검색어 표시 -->
      <div class="recent-keywords" v-if="recentKeywords.length">
        <div class="recent-header">
          <span class="label">최근 검색:</span>
          <button class="clear-all" @click="clearAll">전체삭제</button>
        </div>

        <div class="tags">
          <div v-for="(k, i) in recentKeywords" :key="i" class="tag" @click="clickKeyword(k)">
            <span>#{{ k }}</span>
            <span class="delete-icon" @click.stop="deleteKeyword(k)" title="삭제">❌</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ 필터바 -->
    <FilterBar @filter-change="applyFilter" />

    <!-- 뉴스 카드 리스트 -->
    <section class="news-section">
      <h3>AI 뉴스 요약</h3>
      <p class="desc">
        AI가 사용자의 직무와 관심 키워드를 기반으로,
        관련성이 높은 채용·기술 뉴스를 자동 추천합니다.<br />
        각 뉴스는 신뢰도·감정·편향 여부까지 함께 분석되어
        객관적인 시장 인사이트를 제공합니다.
      </p>


      <div class="news-grid">
        <div v-for="(item, i) in visibleNews" :key="i" class="news-card" @click="openDetail(item)">
          <!-- 상단 태그 -->
          <div class="tag-row">
            <span class="tag category">채용 시장</span>
            <span class="tag" :class="item.sentiment">{{
              item.sentimentLabel
            }}</span>
          </div>

          <!-- 제목 -->
          <h4 class="title">{{ item.title }}</h4>

          <!-- 요약 -->
          <div class="summary-box" v-html="formatSummary(item.summary_short)"></div>

          <!-- 키워드 -->
          <div class="keywords">
            <span v-for="(k, j) in item.keywords" :key="j">#{{ k }}</span>
          </div>

          <!-- 편향 감지 -->
          <div class="bias">
            <span class="bias-label">편향 감지</span>
            <span class="bias-status" :class="{ biasYes: item.bias_detected, biasNo: !item.bias_detected }">
              {{ item.bias_detected ? item.bias_type : "없음" }}
            </span>
          </div>

          <!-- 신뢰도 + 출처 -->
          <div class="card-footer">
            <div class="trust">
              <span class="label">신뢰도</span>
              <div class="bar">
                <div class="fill" :style="{ width: item.trust + '%' }"></div>
              </div>
              <span class="score">{{ item.trust }}%</span>
            </div>
            <div class="source">
              출처: {{ item.source }} · {{ item.date }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 상세보기 -->
    <NewsDetailModal v-if="selectedNews" :news="selectedNews" @close="selectedNews = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import FilterBar from "@/components/bar/FilterBar.vue";
import NewsDetailModal from "@/components/modal/NewsDetailModal.vue";

const keyword = ref("");
const recentKeywords = ref([]);
const selectedNews = ref(null);
const filters = ref({
  period: "week",
  sentiment: "",
  biasOnly: false,
  trustMin: 70,
});

/* ------------------------------
   뉴스 데이터 (6개 고정)
------------------------------ */
const newsList = ref([
  {
    title: "AI 인재 확보 경쟁 심화, 스타트업도 대규모 채용",
    summary_short: `
AI/머신러닝 관련 채용은 전년 대비 45% 증가했습니다.
LLM, RAG, MLOps 등 신기술 직군 수요가 꾸준히 확대 중입니다.
스타트업에서도 연구 인력 채용이 활발히 이루어지고 있습니다.
`,
    keywords: ["AI", "LLM", "MLOps", "RAG", "데이터"],
    trust: 87,
    sentiment: "positive",
    sentimentLabel: "긍정적",
    bias_detected: true,
    bias_type: "기술 과도 홍보 경향",
    date: "2025.11.09",
    source: "ZDNet Korea",
    source_url: "https://biz.chosun.com/it-science/2025/11/07/ai-data-analyst-hiring/"
  },
  {
    title: "백엔드 개발자 채용 시장 안정세, 경력직 선호",
    summary_short: `
백엔드 개발자 채용은 전년 대비 소폭 증가세를 보이고 있습니다.
신입보다 3년 이상 경력직 선호 현상이 지속되고 있습니다.
MSA·쿠버네티스 등 인프라 지식 보유자 우대 경향이 나타납니다.
`,
    keywords: ["백엔드", "Spring", "Node.js", "MSA", "Kubernetes"],
    trust: 90,
    sentiment: "neutral",
    sentimentLabel: "중립적",
    bias_detected: false,
    bias_type: "",
    date: "2025.11.01",
    source: "커리어 인사이트",
    source_url: "https://biz.chosun.com/it-science/2025/11/07/ai-data-analyst-hiring/"
  },
  {
    title: "클라우드 및 DevOps 직군 채용 32% 증가",
    summary_short: `
클라우드 아키텍처 및 DevOps 인력 수요가 전년 대비 32% 증가했습니다.
스타트업 중심으로 인프라 엔지니어 채용이 활발히 진행 중입니다.
AWS, Azure 등 주요 스택 경험 보유자가 우대받고 있습니다.
`,
    keywords: ["클라우드", "DevOps", "AWS", "Azure"],
    trust: 84,
    sentiment: "positive",
    sentimentLabel: "긍정적",
    bias_detected: false,
    bias_type: "",
    date: "2025.11.08",
    source: "매일경제",
    source_url: "https://www.mk.co.kr/news/it/11464618"
  },
  {
    title: "보안·블록체인 채용 수요 15% 감소, 시장 조정기 진입",
    summary_short: `
보안 및 블록체인 분야 채용은 전년 대비 15% 감소했습니다.
시장 불확실성과 투자 위축으로 인한 인력 수요 하락이 원인입니다.
전문가는 내년 중반 이후 회복세를 전망하고 있습니다.
`,
    keywords: ["보안", "블록체인", "정보보호", "암호화"],
    trust: 79,
    sentiment: "negative",
    sentimentLabel: "부정적",
    bias_detected: true,
    bias_type: "감정적 표현 있음",
    date: "2025.11.06",
    source: "디지털데일리",
    source_url: "https://www.ddaily.co.kr/page/view/2025111113513379096"
  },
  {
    title: "데이터 분석가 채용 수요 급증",
    summary_short: `
데이터 기반 의사결정 확산으로 데이터 분석 직군의 수요가 급증했습니다.
Python, SQL, Tableau 등 기술 스택 활용도가 높습니다.
AI·BI 툴 활용 능력이 채용 평가의 핵심 지표가 되고 있습니다.
`,
    keywords: ["데이터", "SQL", "Tableau", "AI"],
    trust: 85,
    sentiment: "positive",
    sentimentLabel: "긍정적",
    bias_detected: false,
    bias_type: "",
    date: "2025.11.07",
    source: "조선비즈",
  },
  {
    title: "프론트엔드 시장 안정, 리액트 중심 지속",
    summary_short: `
프론트엔드 채용 수요가 전년 대비 비슷한 수준을 유지하고 있습니다.
React, Vue.js 중심 기술 선호도가 여전히 높습니다.
UI/UX 복합 역량 보유자의 수요가 증가하고 있습니다.
`,
    keywords: ["프론트엔드", "React", "Vue.js", "UI/UX"],
    trust: 82,
    sentiment: "neutral",
    sentimentLabel: "중립적",
    bias_detected: false,
    bias_type: "",
    date: "2025.11.05",
    source: "IT조선",
  },
]);

/* ------------------------------
   필터 및 검색
------------------------------ */
const filteredNews = computed(() =>
  newsList.value.filter((n) => {
    if (filters.value.sentiment && n.sentiment !== filters.value.sentiment)
      return false;
    if (filters.value.biasOnly && n.bias_detected) return false;
    if (n.trust < filters.value.trustMin) return false;
    if (
      keyword.value &&
      !(
        n.title.includes(keyword.value) ||
        n.summary_short.includes(keyword.value) ||
        n.keywords.some((k) => k.includes(keyword.value))
      )
    )
      return false;
    return true;
  })
);

const visibleNews = computed(() => filteredNews.value.slice(0, 6));

/* ------------------------------
   검색 및 키워드 관련
------------------------------ */
const searchNews = () => {
  if (!keyword.value.trim()) return;
  const term = keyword.value.trim();
  const saved = JSON.parse(localStorage.getItem("search_keywords") || "[]");
  const updated = [term, ...saved.filter((k) => k !== term)].slice(0, 5);
  localStorage.setItem("search_keywords", JSON.stringify(updated));
  recentKeywords.value = updated;
};

const clickKeyword = (k) => {
  keyword.value = k;
  searchNews();
};

const deleteKeyword = (k) => {
  const updated = recentKeywords.value.filter((item) => item !== k);
  recentKeywords.value = updated;
  localStorage.setItem("search_keywords", JSON.stringify(updated));
};

const clearAll = () => {
  recentKeywords.value = [];
  localStorage.removeItem("search_keywords");
};

onMounted(() => {
  recentKeywords.value = JSON.parse(localStorage.getItem("search_keywords") || "[]");
});

const formatSummary = (summary) => {
  if (!summary) return "";
  return (
    "<ul>" +
    summary
      .trim()
      .split("\n")
      .map((line) => `<li>${line.trim()}</li>`)
      .join("") +
    "</ul>"
  );
};

const applyFilter = (newFilters) => (filters.value = newFilters);
const openDetail = (item) => (selectedNews.value = item);
</script>

<style scoped>
.trend-news {
  background: #fff;
  color: #111;
  font-family: "NexonLv1Gothic", sans-serif;
}

/* Hero */
.hero {
  background: #000;
  color: #fff;
  text-align: center;
  padding: 70px 20px;
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

.hero h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 28px;
  letter-spacing: -0.3px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.search-bar input {
  width: 440px;
  padding: 12px 18px;
  height: 37px;
  border-radius: 30px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-bar button {
  background: #71ebbe;
  border: none;
  color: #000;
  height: 37px;
  font-weight: 600;
  font-size: 13.5px;
  padding: 10px 22px;
  border-radius: 30px;
  cursor: pointer;
}

/* 최근 검색어 */
.recent-keywords {
  margin-top: 18px;
  text-align: center;
}

.recent-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.clear-all {
  background: none;
  border: none;
  color: #ccc;
  font-size: 12px;
  cursor: pointer;
}

.clear-all:hover {
  color: #fff;
}

.recent-keywords .tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.recent-keywords .tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f3f3f3;
  border-radius: 30px;
  padding: 4px 10px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: 0.2s;
}

.recent-keywords .tag:hover {
  background: #ddf3eb;
  color: #00c896;
}

.recent-keywords .tag i {
  font-size: 14px;
  color: #aaa;
  cursor: pointer;
}

.recent-keywords .tag i:hover {
  color: #ff6666;
}

/* 뉴스 섹션 */
.news-section {
  padding: 40px 80px 100px;
}

.news-section h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
}

.news-section .desc {
  font-size: 16px;
  color: #6c757d;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.news-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: 0.2s;
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border-color: #d0d0d0;
}

/* 카드 내부 */
.tag-row {
  display: flex;
  gap: 6px;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  padding: 3px 8px;
}

.tag.category {
  background: #eafff5;
  color: #00a877;
}

.tag.positive {
  background: #eafff5;
  color: #00c896;
}

.tag.neutral {
  background: #f5f5f5;
  color: #555;
}

.tag.negative {
  background: #ffecec;
  color: #e85b5b;
}

.title {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin: 8px 0 12px;
}

.summary-box {
  background: #f9fdfb;
  border: 1px solid #e4f7ee;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
}

.summary-box ul {
  margin: 0;
  padding-left: 18px;
}

.summary-box li {
  list-style-type: disc;
  margin-bottom: 4px;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.keywords span {
  background: #f3f3f3;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 12px;
  color: #444;
}

.bias {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.bias-label {
  font-size: 12px;
  color: #666;
}

.bias-status {
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  padding: 3px 8px;
}

.biasYes {
  background: #ffecec;
  color: #e85b5b;
}

.biasNo {
  background: #f3f3f3;
  color: #555;
}

.trust {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trust .label {
  font-size: 12px;
  color: #777;
}

.trust .bar {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.trust .fill {
  height: 100%;
  background: #71ebbe;
}

.trust .score {
  font-weight: 700;
  font-size: 12px;
}

.source {
  font-size: 11.5px;
  color: #888;
  text-align: right;
}

.delete-icon {
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
}

.delete-icon:hover {
  opacity: 1;
  color: #ff5b5b;
}

</style>
