<!-- 자소서 작성 페이지 컴포넌트 -->
<template>
  <div class="app-container">
    <!-- 사이드바 -->
    <SideBar />

    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <div class="resume-form-container">
        <div class="form-header">
          <h1>자기소개서 작성하기</h1>
          <p>
            각 항목에 맞게 자기소개서를 작성한 후 AI 코칭을 받아보세요.<br />
            AI가 문장 분석, 강점 및 개선점을 함께 제안합니다.
          </p>
        </div>

        <!-- 자기소개서 제목 -->
        <div class="form-group">
          <label style="font-weight:600;">&nbsp;&nbsp;자기소개서 제목</label>
          <input type="text" v-model="coverTitle" class="form-control mb-4" placeholder="예: 백엔드 개발자 지원 자기소개서" />
        </div>

        <!-- 자기소개서 항목 -->
        <div v-for="(value, key) in introFields" :key="key" class="form-section"
          :class="{ expanded: sections[key], active: sections[key] }">
          <div class="section-header" @click="toggleSection(key)">
            <div class="section-info">
              <h3>{{ key }}</h3>
              <span class="section-desc">항목을 작성해보세요</span>
            </div>
            <button class="toggle-btn" :class="{ active: sections[key] }">
              {{ sections[key] ? '×' : '+' }}
            </button>
          </div>

          <div class="section-content" v-show="sections[key]">
            <div class="form-group">
              <label>{{ key }} 내용</label>
              <textarea v-model="introFields[key]" class="form-control" rows="5"
                placeholder="이 항목에 대한 자기소개 내용을 작성하세요."></textarea>
            </div>

            <div class="btn-wrapper">
              <button class="btn btn-outline-success btn-sm mt-4" @click="getSectionFeedback(key, introFields[key])">
                피드백 받기
              </button>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="action-buttons">
          <button class="save-btn" @click="saveCoverLetter">
            📄 작성 완료
          </button>
        </div>
      </div>
    </div>

    <!-- AI 코칭 패널 -->
    <div class="ai-coaching-panel">
      <!-- AI 헤더 -->
      <div class="ai-header">
        <div class="ai-profile">
          <div class="ai-avatar">🤖</div>
          <div class="ai-info">
            <span class="ai-name">AI 코치</span>
          </div>
        </div>
      </div>

      <!-- AI 상태 -->
      <div class="ai-status">
        <div class="status-indicator">
          <div class="status-icon">🤖</div>
          <span class="status-text">AI 코치 활성화</span>
        </div>
      </div>

      <!-- AI 콘텐츠 -->
      <div class="ai-content">
        <!-- 환영 메시지 -->
        <div class="welcome-section">
          <p>안녕하세요! 자기소개서 작성을 도와드릴 AI 코치입니다.</p>
          <p>각 항목을 입력하면 피드백을 받을 수 있습니다 💬</p>
        </div>

        <!-- 작성 팁 -->
        <div class="tips-section">
          <div class="section-title">
            <span class="icon">💡</span>
            <span>좋은 자기소개서의 핵심 포인트</span>
          </div>
          <div class="checklist">
            <div class="check-item">✅ 구체적인 경험과 수치를 포함하세요.</div>
            <div class="check-item">✅ 회사의 가치와 자신의 목표를 연결하세요.</div>
            <div class="check-item">✅ STAR 기법으로 이야기 흐름을 만드세요.</div>
          </div>
        </div>

        <!-- 실시간 피드백 -->
        <div class="ai-feedback-box" v-for="item in visibleFeedbackList" :key="item.key">
          <h4>📝 {{ reverseSectionMap[item.key] }} 항목 코칭</h4>
          <p><strong>요약:</strong> {{ item.box.summary }}</p>
          <p><strong>잘한 점:</strong> {{ item.box.strengths }}</p>
          <p><strong>개선점:</strong> {{ item.box.improvements }}</p>

          <div class="improved-box" v-if="item.box.improvedText">
            <h5>✨ AI 수정본</h5>
            <p>{{ item.box.improvedText }}</p>
            <div class="btn-wrapper">
              <button class="btn btn-outline-success btn-sm mt-4" @click="applyImprovedText(item.key)">
                수정본 적용하기
              </button>
            </div>
          </div>
        </div>


        <!-- AI 분석 중 스피너 -->
        <div v-if="aiLoading" class="spinner-container mt-3 mb-3">
          <div class="spinner"></div>
          <p class="text-muted mt-2">AI가 분석 중입니다...</p>
        </div>

        <!-- 저장된 키워드 -->
        <div class="keyword-box">
          <p class="keyword-title">저장된 키워드</p>

          <div v-if="savedKeywords && savedKeywords.length > 0">
            <div v-for="(k, i) in savedKeywords" :key="i" class="form-check mb-1">
              <input type="checkbox" class="form-check-input" :id="'kw' + i" v-model="selectedKeywords" :value="k" />
              <label class="form-check-label" :for="'kw' + i">{{ k }}</label>
            </div>
          </div>

          <p v-else class="text-muted small">저장된 키워드가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 작성 완료 로딩 오버레이 -->
  <div v-if="saveLoading" class="save-loading-overlay">
    <div class="save-loading-box">
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <p>자기소개서를 저장하고 있습니다...</p>
      <p class="sub">AI 분석이 자동으로 실행돼요!</p>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/sidebar/SideBar.vue';
import coverletterWrite from '@/utils/coverletterWrite';
import coverletterCoach from '@/utils/coverletterCoach';

const {
  coverTitle,
  introFields,
  sections,
  saveLoading,
  toggleSection,
  saveCoverLetter,
  savedKeywords,
  selectedKeywords
} = coverletterWrite.useCoverletterWrite();

const {
  feedbackBoxes,
  aiLoading,
  sectionMap,
  reverseSectionMap,
  currentSection,
  toggleAICoaching,
  getSectionFeedback,
  visibleFeedbackList,
  applyImprovedText,
} = coverletterCoach.useCoverLetterCoach(introFields, selectedKeywords);
</script>

<style src="@/assets/css/coverletterWrite.css"></style>
