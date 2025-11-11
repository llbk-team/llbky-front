<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- 헤더 -->
      <div class="modal-header">
        <h2>뉴스 요약 분석</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <!-- 왼쪽 분석 영역 -->
        <div class="left">
          <!-- 감정 비율 -->
          <div class="sentiment-box">
            <div class="sentiment-item positive">
              <div class="circle">49%</div>
              <span>긍정</span>
            </div>
            <div class="sentiment-item neutral">
              <div class="circle">37%</div>
              <span>중립</span>
            </div>
            <div class="sentiment-item negative">
              <div class="circle">14%</div>
              <span>부정</span>
            </div>
          </div>

          <!-- 신뢰도 -->
          <div class="trust-box">
            <span class="trust-label">신뢰도</span>
            <div class="trust-bar">
              <div class="trust-fill" :style="{ width: news.trust + '%' }"></div>
            </div>
            <span class="trust-score">{{ news.trust }}%</span>
          </div>

          <!-- 기사 내용 -->
          <div class="article">
            <h3>{{ news.title }}</h3>
            <div class="meta">
              <span>{{ news.source }}</span> · <span>{{ news.date }}</span>
            </div>
            <p>{{ news.summary_long || news.summary_short }}</p>

            <div class="keywords">
              <span v-for="(k, i) in news.keywords" :key="i">#{{ k }}</span>
            </div>

            <!-- ✅ 원문 보기 버튼 -->
            <div class="source-btn-box" v-if="news.source_url">
              <button class="source-btn" @click="openSource(news.source_url)">
                <i class="ri-news-line"></i> 원문 보기
              </button>
            </div>
          </div>
        </div>

        <!-- 오른쪽 관련 뉴스 -->
        <div class="right">
          <h4>관련 뉴스</h4>
          <ul>
            <li v-for="(item, i) in relatedNews" :key="i">
              <p class="title">{{ item.title }}</p>
              <p class="meta">{{ item.source }} · {{ item.date }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  news: { type: Object, required: true },
});

const relatedNews = [
  { title: "AI 인재 확보에 나선 글로벌 기업 동향", source: "브릿지경제", date: "2025-11-04" },
  { title: "클라우드·데이터 인프라 인력 수요 확대", source: "매일경제", date: "2025-11-03" },
  { title: "HR테크와 AI 면접 솔루션 도입 가속화", source: "머니투데이", date: "2025-11-02" },
];

// ✅ 원문 보기 함수
const openSource = (url) => {
  if (!url) return;
  window.open(url, "_blank");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 920px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  padding: 26px 30px;
  /* font-family: "Pretendard", sans-serif; */
  animation: scaleIn 0.25s ease;
}

/* 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #71ebbe;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #111;
}
.close-btn {
  border: none;
  background: none;
  font-size: 22px;
  color: #666;
  cursor: pointer;
  transition: 0.2s;
}
.close-btn:hover {
  color: #e85b5b;
  transform: scale(1.1);
}

/* 본문 */
.modal-body {
  display: flex;
  gap: 24px;
}
.left {
  flex: 2;
}
.right {
  flex: 1.2;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 감정 */
.sentiment-box {
  display: flex;
  justify-content: space-between;
  background: #f9fffb;
  border: 1px solid #e4f8ee;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 18px;
}
.sentiment-item {
  text-align: center;
  flex: 1;
}
.sentiment-item .circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  line-height: 52px;
  margin: 0 auto 6px;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  animation: popIn 0.4s ease;
}
.positive .circle {
  background: linear-gradient(135deg, #71ebbe, #00c896);
}
.neutral .circle {
  background: #c5c5c5;
}
.negative .circle {
  background: linear-gradient(135deg, #ff8a8a, #e85b5b);
}
.sentiment-item span {
  font-size: 12px;
  color: #555;
}

/* 신뢰도 */
.trust-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
.trust-label {
  font-size: 12px;
  color: #555;
}
.trust-bar {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.trust-fill {
  background: linear-gradient(90deg, #a2f1d6 0%, #71ebbe 100%);
  height: 100%;
  transition: width 0.4s ease;
}
.trust-score {
  font-weight: 700;
  color: #000;
  font-size: 13px;
}

/* 기사 */
.article h3 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}
.article .meta {
  font-size: 12px;
  color: #777;
  margin-bottom: 10px;
}
.article p {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  margin-bottom: 14px;
}

/* ✅ 원문 버튼 */
.source-btn-box {
  margin-top: 16px;
  text-align: right;
}
.source-btn {
  background: linear-gradient(90deg, #a2f1d6, #71ebbe);
  border: none;
  border-radius: 8px;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.25s;
}
.source-btn:hover {
  background: linear-gradient(90deg, #71ebbe, #00c896);
  transform: translateY(-2px);
}

/* 키워드 */
.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.keywords span {
  background: #eafff5;
  color: #00a877;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
}

/* 관련 뉴스 */
.right h4 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111;
}
.right li {
  list-style: none;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
}
.right .title {
  font-size: 13.5px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  transition: 0.2s;
}
.right .title:hover {
  color: #00c896;
  transform: translateX(2px);
}
.right .meta {
  font-size: 11px;
  color: #777;
  margin-top: 2px;
}

/* 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes popIn {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
