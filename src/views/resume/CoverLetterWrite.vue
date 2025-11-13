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

        <!-- 자기소개서 항목 -->
        <div
          v-for="(value, key) in introFields"
          :key="key"
          class="form-section"
          :class="{ expanded: sections[key], active: sections[key] }"
        >
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
              <textarea
                v-model="introFields[key]"
                class="form-control"
                rows="5"
                placeholder="이 항목에 대한 자기소개 내용을 작성하세요."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="action-buttons">
          <button class="save-btn" @click="router.push('/resume/list')">
            📄 작성 완료
          </button>
        </div>
      </div>
    </div>

    <!-- AI 코칭 패널 -->
    <div class="ai-coaching-panel">
      <div class="ai-header">
        <div class="ai-profile">
          <div class="ai-avatar">🤖</div>
          <div class="ai-info">
            <span class="ai-name">AI 코치</span>
            <span class="ai-desc">컴퓨터공학 프로젝트 출력고</span>
          </div>
        </div>
        <button class="close-btn">×</button>
      </div>

      <div class="ai-status">
        <div class="status-indicator">
          <div class="status-icon">🤖</div>
          <span class="status-text">AI 코치 활성화</span>
        </div>
      </div>

      <div class="ai-content">
        <div class="welcome-section">
          <p>안녕하세요! 자기소개서 작성을 도와드릴 AI 코치입니다.</p>
          <p>각 항목을 입력하면 피드백을 받을 수 있습니다 💬</p>
        </div>

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

        <div class="feedback-section">
          <div class="section-title">
            <span class="icon">📝</span>
            <span>실시간 피드백 예시</span>
          </div>
          <ul class="list-unstyled small mb-0 ps-2">
            <li>💡 문장이 약간 길어요. 핵심만 간결히 써보세요.</li>
            <li>👍 구체적인 수치 예시가 좋습니다.</li>
            <li>⚠️ 회사 비전과 연관성을 추가해보세요.</li>
          </ul>
        </div>

        <div class="ai-actions">
          <button class="ai-action-btn">💬 AI에게 질문하기</button>
          <button class="ai-action-btn">📋 상세한 분석받기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/sidebar/SideBar.vue'
import router from '@/router'
import { reactive } from 'vue'

const introFields = reactive({
  '지원 동기': '',
  '성장 경험': '',
  '직무 역량': '',
  '입사 후 포부': ''
})

const sections = reactive({
  '지원 동기': true,
  '성장 경험': false,
  '직무 역량': false,
  '입사 후 포부': false
})

const toggleSection = (key) => (sections[key] = !sections[key])
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #eff0f1;
}

.main-container {
  flex: 1;
  padding: 40px;
  max-width: calc(100vw - 200px - 400px);
}

.resume-form-container {
  background: #eaebec;
  border-radius: 12px;
  padding: 30px;
}

/* 헤더 */
.form-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}
.form-header p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

/* 섹션 */
/* 폼 섹션 */
.form-section {
  background: #fff;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.form-section.active {
  border-color: #71EBBE;
  box-shadow: 0 0 0 1px rgba(113, 235, 190, 0.2);
}

/* 접혔을 때(기본) 완전 흰색 */
.form-section .section-header {
  background: #ffffff !important;
}

/* 열렸을 때만 민트색 */
.form-section.active .section-header {
  background: #f6fffa !important;
}

.section-header {
  padding: 20px 24px;
  background: #f6fffa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-content {
  padding: 28px 28px 32px;
  background: #fff;
}
.section-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.section-desc {
  font-size: 13px;
  color: #777;
}
.toggle-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #71ebbe;
  border-radius: 50%;
  background: #fff;
  color: #71ebbe;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}
.toggle-btn.active {
  background: #71ebbe;
  color: #fff;
}

/* 입력 필드 */
.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}
.form-control {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 16px 18px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  transition: all 0.2s ease;
}
.form-control:focus {
  border-color: #71ebbe;
  box-shadow: 0 0 0 3px rgba(113, 235, 190, 0.15);
  outline: none;
}

/* 버튼 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #f0f0f0;
}
.preview-btn,
.save-btn {
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.preview-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}
.save-btn {
  background: #71ebbe;
  color: #fff;
  border: none;
}
.preview-btn:hover {
  background: #f0f0f0;
}
.save-btn:hover {
  background: #5dd4a3;
  transform: translateY(-1px);
}

/* ─────────────────────────────── */
/*      AI 코칭 패널 (오른쪽 패널)   */
/* ─────────────────────────────── */

.ai-coaching-panel {
  width: 380px;
  background: #fff;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  border-left: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  font-family: 'Pretendard', sans-serif;
  font-size: 13px;        /* 기본 폰트 */
  color: #333;
}

/* 헤더 */
.ai-header {
  background: #000;
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  font-size: 18px;
}

.ai-name {
  font-weight: 600;
  font-size: 14px;
  display: block;
}

.ai-desc {
  font-size: 11px;
  color: #ccc;
  display: block;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* AI 활성 상태 표시 */
.ai-status {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 8px 12px;
}

.status-icon {
  font-size: 14px;
}

.status-text {
  font-size: 12px;
  color: #666;
}

/* 콘텐츠 스크롤 영역 */
.ai-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 환영 섹션 */
.welcome-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.welcome-section p {
  margin: 0 0 12px 0;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
}

.welcome-section p:last-child {
  margin-bottom: 0;
}

/* ─────────────── */
/*   TIPS SECTION   */
/* ─────────────── */

.tips-section {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

/* 제목 아이콘 + 제목 */
.tips-section .section-title {
  font-size: 14px;       /* ✔ 더 크게 */
  font-weight: 600;
  color: #166534;
  margin-bottom: 12px;
}

/* 소제목 */
.tips-section h4 {
  font-size: 14px;       /* ✔ 기존보다 업 */
  font-weight: 600;
  color: #166534;
  margin-bottom: 12px;
}

/* 체크 리스트 항목 */
.tips-section .check-item {
  font-size: 13.5px;     /* ✔ 본문 통일 */
  line-height: 1.5;
  color: #166534;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

/* 피드백 섹션 */
.feedback-section {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

/* 버튼 */
.ai-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-action-btn {
  background: #f8f9fa;
  border: 1px solid #e5e5e5;
  color: #333;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
  margin-bottom: 8px;
}

.ai-action-btn:hover {
  background: #f0f0f0;
  border-color: #ddd;
}

/* 반응형 */
@media (max-width: 1200px) {
  .ai-coaching-panel {
    display: none;
  }
}

</style>
