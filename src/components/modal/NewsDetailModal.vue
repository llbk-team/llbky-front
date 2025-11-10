<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>뉴스 요약 분석</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div class="left">
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

          <div class="trust-box">
            <span class="trust-label">신뢰도</span>
            <div class="trust-bar">
              <div class="trust-fill" :style="{ width: news.trust + '%' }"></div>
            </div>
            <span class="trust-score">{{ news.trust }}%</span>
          </div>

          <!-- ✅ 긴 요약문 -->
          <div class="article">
            <h3>{{ news.title }}</h3>
            <div class="meta">
              <span>{{ news.source }}</span> · <span>{{ news.date }}</span>
            </div>
            <p>{{ news.summary_long || news.summary_short }}</p>

            <div class="keywords">
              <span v-for="(k, i) in news.keywords" :key="i">#{{ k }}</span>
            </div>
          </div>
        </div>

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
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  padding: 24px 28px;
  font-family: "Pretendard", sans-serif;
  animation: fadeIn 0.25s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #71ebbe;
  padding-bottom: 8px;
  margin-bottom: 16px;
}
.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
}
.close-btn {
  border: none;
  background: none;
  font-size: 22px;
  color: #666;
  cursor: pointer;
}
.close-btn:hover {
  color: #e85b5b;
}

.modal-body {
  display: flex;
  gap: 24px;
}
.left {
  flex: 2;
}
.right {
  flex: 1.2;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 감정 박스 */
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  line-height: 48px;
  margin: 0 auto 4px;
  color: #fff;
  font-weight: 700;
}
.positive .circle {
  background: #00c896;
}
.neutral .circle {
  background: #ccc;
}
.negative .circle {
  background: #e85b5b;
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
  background: #71ebbe;
  height: 100%;
  transition: width 0.3s;
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
  line-height: 1.6;
  margin-bottom: 12px;
}
.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.keywords span {
  background: #f3f3f3;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
}

/* 관련 뉴스 */
.right h4 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}
.right ul {
  padding: 0;
  margin: 0;
}
.right li {
  list-style: none;
  margin-bottom: 10px;
}
.right .title {
  font-size: 13px;
  font-weight: 600;
  color: #000;
}
.right .title:hover {
  color: #00c896;
}
.right .meta {
  font-size: 11px;
  color: #777;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
