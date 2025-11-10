<template>
  <div class="page-wrapper">

    <!-- Sidebar -->
    <aside class="sidebar">
      <ul>
        <li @click="navigateTo('/resume')" :class="{ selected: currentRoute === '/resume' }">
          📄 이력서
        </li>
        <li @click="navigateTo('/resume/coverletter')" :class="{ selected: currentRoute === '/resume/coverletter' }">
          📝 자기소개서
        </li>
        <li @click="navigateTo('/resume/portfolio')" :class="{ selected: currentRoute === '/resume/portfolio' }">
          💼 포트폴리오
        </li>
      </ul>
    </aside>

    <!-- Content -->
    <section class="content-area">
      <!-- 기존 content 내용 그대로... -->
      <div class="breadcrumb">my &gt; 서류관리 &gt; 이력서</div>
      <h1 class="title">서류 AI 코칭</h1>

      <!-- 상단 영역 -->
      <div class="container">

        <!-- 좌측: 입력 영역 -->
        <div class="editor-area">

          <!-- 탭 -->
          <div class="tabs">
            <button class="tab active">지원 동기</button>
            <button class="tab">성장 경험</button>
            <button class="tab">직무 역량</button>
            <button class="tab">입사 후 포부</button>
          </div>

          <!-- 버튼 그룹 -->
          <div class="action-buttons">
            <button class="btn yellow">✏️ 첨삭</button>
            <button class="btn green">📊 분석</button>
            <button class="btn blue">💾 저장</button>
          </div>

          <!-- 입력 textarea -->
          <h3 class="section-title">📝 작성 내용</h3>
          <textarea class="textarea">
귀사의 클라우드 플랫폼 서비스가 국내를 넘어 글로벌 시장에서 인정받는 모습을 보며 큰 감명을 받았습니다. 특히 최근 오픈한 AI 서비스 플랫폼 랜딩한 서비스는 개발자 경험을 혁신적으로 개선하였다는 평가를 받고 있습니다.

저는 지난 3년간 대기업 계열사 전자상거래 플랫폼 운영과 MSA 전환 프로젝트를 성공적으로 이끌었습니다. 이후 현재 시스템의 성능과 안정성을 크게 향상시켰습니다.

귀사에 입사하여 실무와 트렌드의 기술을 활용한 혁신적인 서비스 개발에 기여하고 싶습니다.
          </textarea>
        </div>

        <!-- 우측: AI 코칭 결과 -->
        <div class="ai-result">

          <h3 class="section-title">🤖 AI 코칭 결과</h3>

          <div class="result-card">
            <strong>🔍 문장 분석</strong>
            <p>공백 포함 642자 (공고 권장 600~700자)</p>
          </div>

          <div class="result-card success">
            <strong>✅ 강점</strong>
            <ul>
              <li>지원 동기와 회사 비전이 명확하게 연결됨</li>
              <li>경험 기반으로 설득력 있는 내용 구성</li>
              <li>구체적인 수치 기반 성과 제시</li>
            </ul>
          </div>

          <div class="result-card warning">
            <strong>💡 개선 제안</strong>
            <ul>
              <li>문장 간 논리적 연결을 조금 더 명확히 하기</li>
              <li>실제 기여한 역할 중심으로 강조</li>
              <li>중복 표현이 일부 있어 간결하게 수정 필요</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 하단 영역: 문체 선택 -->
      <div class="bottom-container">
        <h3 class="section-title">✏️ 문체 버전 선택</h3>

        <div class="style-buttons">
          <button class="style-btn">간결한 버전</button>
          <button class="style-btn">사례 중심 버전</button>
          <button class="style-btn">비전 제시형 버전</button>
        </div>

        <div class="footer-buttons">
          <button class="footer-btn gray">📄 리포트 다운로드</button>
          <button class="footer-btn green">✏️ 서류 수정하기</button>
          <button class="footer-btn navy">💾 저장하기</button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 현재 라우트 경로
const currentRoute = computed(() => route.path)

// 네비게이션 함수
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.page-wrapper {
  display: flex;
  background: #f5f5f5;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 220px;
  padding: 1.5rem;
  background: white;
  border-right: 1px solid #ddd;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 14px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 15px;
  transition: background-color 0.2s ease; /* 부드러운 전환 효과 추가 */
}
.sidebar li:hover {
  background: #f0f0f0; /* 호버 효과 추가 */
}
.sidebar li.selected {
  background: #d3f8e2;
  font-weight: bold;
}

/* 나머지 스타일은 기존과 동일... */
.content-area {
  flex: 1;
  padding: 1.8rem;
  overflow-y: auto;
}

.breadcrumb {
  font-size: 0.9rem;
  color: #888;
}
.title {
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.editor-area {
  background: white;
  padding: 1.6rem;
  border-radius: 14px;
  border: 1px solid #ddd;
}

.tabs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
}
.tab {
  padding: 8px 16px;
  border-radius: 7px;
  background: #ececec;
  border: none;
  cursor: pointer;
}
.tab.active {
  background: black;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.btn {
  border: none;
  padding: 10px 16px;
  border-radius: 7px;
  font-size: 14px;
  cursor: pointer;
  color: white;
}
.btn.yellow { background: #ffc107; }
.btn.green { background: #00b37a; }
.btn.blue { background: #4cb5ff; }

.textarea {
  width: 100%;
  height: 260px;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 1rem;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.ai-result {
  background: white;
  padding: 1.6rem;
  border-radius: 14px;
  border: 1px solid #ddd;
}

.result-card {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
}
.result-card.success { background: #eafff1; }
.result-card.warning { background: #fff3f3; }

.bottom-container {
  background: white;
  padding: 1.8rem;
  border-radius: 14px;
  border: 1px solid #ddd;
  margin-top: 1.5rem;
}

.style-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.style-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: #e8fff6;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
}

.footer-buttons {
  display: flex;
  gap: 1rem;
}
.footer-btn {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
}
.footer-btn.gray { background: #e6e6e6; }
.footer-btn.green { background: #00b37a; color: white; }
.footer-btn.navy { background: #003c70; color: white; }
</style>