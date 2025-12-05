<!-- JobInsight 페이지 컴포넌트 -->
<template>
  <div class="insight-page">
    <!-- 헤더 -->
    <div class="insight-header">
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
          <strong>이력서 분석:</strong>
          {{ growth?.resume }}
        </li>

        <li>
          <strong>면접 분석:</strong>
          {{ growth?.interview }}
        </li>

        <li>
          <strong>학습 분석:</strong>
          {{ growth?.learning }}
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
          <h4 class="job-title">{{ job.title }}</h4>
          <p class="summary">{{ job.summary }}</p>

          <div class="trend-box">
            <h5>📊 트렌드 요약</h5>
            <p>{{ job.trendSummary }}</p>
          </div>

          <div class="keyword-box">
            <h5>💡 관련 키워드</h5>
            <div class="tags">
              <button v-for="tag in job.tags" :key="tag" class="tag-btn" :class="{ saved: isSaved(tag) }"
                @click="toggleKeyword(tag, job.title)">
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

  <!-- 작성 완료 로딩 오버레이 -->
  <div v-if="saveLoading" class="save-loading-overlay">
    <div class="save-loading-box">
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <p>직무 인사이트를 생성하고 있습니다</p>
      <p class="sub">AI 분석이 자동으로 실행돼요!</p>
    </div>
  </div>
</template>



<script setup>
import jobInsight from "@/utils/jobInsightAnalysis";

const memberId = 1;

const {
  loading,
  saveLoading,
  error,
  savedKeywords,
  savedCount,
  growth,
  jobs,
  isSaved,
  toggleKeyword
} = jobInsight.useJobInsight(memberId);
</script>


<style scoped src="@/assets/css/jobInsightAnalysis.css"></style>
