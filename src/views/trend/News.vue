<template>
  <div class="trend-news">
    <!-- Hero 영역 -->
    <section class="hero">
      <h2>AI가 분석해주는 채용 트렌드</h2>
      <div class="search-bar">
        <input
          type="text"
          placeholder="키워드를 입력하세요 (예: 인공지능, 백엔드, AI 개발자)"
          v-model="keyword"
        />
        <button @click="searchNews">검색</button>
      </div>
    </section>

    <!-- 필터바 -->
    <FilterBar @filter-change="applyFilter" />

    <!-- 뉴스 카드 리스트 -->
    <section class="news-section">
      <h3>AI 뉴스 요약</h3>
      <p class="desc">팩트체크·편향감지까지 적용된 신뢰할 수 있는 채용 시장 뉴스 인사이트</p>

      <div class="news-grid">
        <div
          v-for="(item, i) in filteredNews"
          :key="i"
          class="news-card"
          @click="openDetail(item)"
        >
          <div class="card-header">
            <span class="sentiment" :class="item.sentiment">
              {{ item.sentimentLabel }}
            </span>
            <span class="date">{{ item.date }}</span>
          </div>

          <h4 class="title">{{ item.title }}</h4>

          <div class="summary-box">
            <p>{{ item.summary }}</p>
          </div>

          <div class="keywords">
            <span v-for="(k, j) in item.keywords" :key="j">#{{ k }}</span>
          </div>

          <div class="divider" />

          <div class="bias">
            <span class="bias-label">편향 감지</span>
            <span
              class="bias-status"
              :class="{ biasYes: item.bias_detected, biasNo: !item.bias_detected }"
            >
              {{ item.bias_detected ? item.bias_type : "없음" }}
            </span>
          </div>

          <div class="card-footer">
            <div class="trust">
              <span class="label">신뢰도</span>
              <div class="bar">
                <div class="fill" :style="{ width: item.trust + '%' }"></div>
              </div>
              <span class="score">{{ item.trust }}%</span>
            </div>
            <div class="source">출처: {{ item.source }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 모달 -->
    <NewsDetailModal
      v-if="selectedNews"
      :news="selectedNews"
      @close="selectedNews = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import FilterBar from "@/components/bar/FilterBar.vue";
import NewsDetailModal from "@/components/modal/NewsDetailModal.vue";

const keyword = ref("");
const selectedNews = ref(null);

const filters = ref({
  period: "week",
  sentiment: "",
  biasOnly: false, // '편향 없는 뉴스만'
  trustMin: 70,
});

// 더미 뉴스 데이터 (백엔드 연동시 교체)
const newsList = ref([
  {
    title: "AI 개발자 채용 급증, 평균 연봉 30% 상승",
    summary:
      "AI 산업 성장으로 인해 관련 개발자 수요가 폭발적으로 증가하고 있다. 특히 백엔드·데이터 분야의 인력 확보 경쟁이 치열하며, 연봉 상승 폭도 30%에 달한다.",
    keywords: ["AI", "Backend", "데이터"],
    trust: 88,
    sentiment: "positive",
    sentimentLabel: "긍정적",
    date: "2025.11.10",
    source: "네이버 뉴스",
    bias_detected: false,
    bias_type: "",
  },
  {
    title: "기업들, AI 인력 확보 경쟁 과열... 개발자 '이직 전쟁'",
    summary:
      "대기업들이 AI 개발자 확보를 위해 연봉 인상 경쟁을 벌이고 있다. 일부 전문가는 과도한 인재 쏠림 현상으로 산업 균형이 무너질 수 있다고 지적했다.",
    keywords: ["AI", "이직", "대기업"],
    trust: 74,
    sentiment: "negative",
    sentimentLabel: "부정적",
    date: "2025.11.09",
    source: "한국경제",
    bias_detected: true,
    bias_type: "감정적 표현 있음",
  },
  {
    title: "클라우드 기술 인력 채용 확대, 스타트업 중심 활발",
    summary:
      "국내 스타트업 중심으로 클라우드 전문 인력 채용이 확대되고 있다. AWS·Azure 등 주요 기술 스택 수요가 증가하며, 중소기업에서도 적극적으로 채용에 나섰다.",
    keywords: ["Cloud", "AWS", "Azure"],
    trust: 83,
    sentiment: "neutral",
    sentimentLabel: "중립적",
    date: "2025.11.08",
    source: "ZDNet Korea",
    bias_detected: false,
    bias_type: "",
  },
  {
    title: "AI 면접 솔루션, 채용시장 표준으로 자리잡아",
    summary:
      "AI 기반 영상 면접 솔루션의 도입이 급속히 확산되며, 기업 채용 과정의 효율성이 크게 높아지고 있다. 다만 개인정보 보호와 윤리적 사용에 대한 논의도 이어진다.",
    keywords: ["AI면접", "채용", "HR테크"],
    trust: 80,
    sentiment: "neutral",
    sentimentLabel: "중립적",
    date: "2025.11.06",
    source: "머니투데이",
    bias_detected: true,
    bias_type: "기술 과도 홍보 경향",
  },
  {
    title: "자동차 산업, 전기차 전환 가속... 인력 재교육 시급",
    summary:
      "내연기관 중심 산업 구조가 빠르게 전기차 중심으로 재편되고 있다. 이에 따라 제조·정비 인력의 재교육과 전환 지원이 산업 전반의 핵심 과제로 떠오르고 있다.",
    keywords: ["전기차", "제조업", "인력전환"],
    trust: 89,
    sentiment: "positive",
    sentimentLabel: "긍정적",
    date: "2025.11.05",
    source: "매일경제",
    bias_detected: false,
    bias_type: "",
  },
  {
    title: "직장인 10명 중 7명, 'AI가 내 일자리를 대체할 것' 우려",
    summary:
      "한 조사에 따르면 72%의 직장인이 AI 기술로 인한 일자리 감소를 우려하고 있는 것으로 나타났다. 특히 단순 사무직과 고객 응대 직군에서 불안감이 가장 높았다.",
    keywords: ["AI", "일자리", "자동화"],
    trust: 77,
    sentiment: "negative",
    sentimentLabel: "부정적",
    date: "2025.11.03",
    source: "서울경제",
    bias_detected: true,
    bias_type: "감정적 불안 조장",
  },
]);

const filteredNews = computed(() =>
  newsList.value.filter((n) => {
    if (filters.value.sentiment && n.sentiment !== filters.value.sentiment)
      return false;
    if (filters.value.biasOnly && n.bias_detected) return false; // 편향 없는 뉴스만
    if (n.trust < filters.value.trustMin) return false;
    if (
      keyword.value &&
      !(
        n.title.includes(keyword.value) ||
        n.summary.includes(keyword.value) ||
        n.keywords.some((k) => k.includes(keyword.value))
      )
    )
      return false;
    return true;
  })
);

const applyFilter = (newFilters) => {
  filters.value = newFilters;
};

const searchNews = () => {
  // 백엔드 붙이면 여기서 API 호출
  // 지금은 UI 설계용
};

const openDetail = (item) => {
  selectedNews.value = item;
};
</script>

<style scoped>
.trend-news {
  background: #f1f2f3;
  color: #000;
  font-family: "Pretendard", sans-serif;
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
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 28px;
}
.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.search-bar input {
  width: 440px;
  padding: 12px 18px;
  border-radius: 25px;
  border: none;
  outline: none;
  font-size: 14px;
}
.search-bar button {
  background: #71ebbe;
  border: none;
  color: #000;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s;
}
.search-bar button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(113, 235, 190, 0.3);
}

/* 뉴스 섹션 */
.news-section {
  padding: 40px 80px 100px;
}
.news-section h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}
.desc {
  color: #666;
  font-size: 13px;
  margin-bottom: 28px;
}
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

/* 카드 */
.news-card {
  background: #fff;
  border-radius: 16px;
  padding: 22px 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}
.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.sentiment {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
}
.sentiment.positive {
  background: #eafff5;
  color: #00c896;
}
.sentiment.neutral {
  background: #f5f5f5;
  color: #555;
}
.sentiment.negative {
  background: #ffecec;
  color: #e85b5b;
}
.date {
  font-size: 11px;
  color: #999;
}
.title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
}
.summary-box {
  background: #f9fdfb;
  border: 1px solid #e4f7ee;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 14px;
}
.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.keywords span {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 12px;
  color: #444;
}
.divider {
  border-top: 1px solid #eee;
  margin: 10px 0;
}
.bias {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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
.card-footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}
.trust {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bar {
  width: 80px;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: #71ebbe;
}
.score {
  font-weight: 600;
}
.source {
  font-size: 11px;
  color: #999;
  text-align: right;
}
</style>
