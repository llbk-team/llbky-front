<template>
  <div class="portfolio-analysis-page d-flex">
    <!-- 사이드바 (고정 너비) -->
    <div class="sidebar-container">
      <SideBar />
    </div>
    
    <!-- 메인 콘텐츠 (나머지 너비) -->
    <div class="analysis-container d-flex flex-fill">
      <!-- Portfolio Details (50%) -->
      <div class="portfolio-details">
        <div class="details-header">
          <h2 class="section-title">
            <span class="icon">📁</span>
            포트폴리오 상세
          </h2>
        </div>

        <div class="project-info">
          <div class="info-row">
            <span class="label">프로젝트명:</span>
            <span class="value">{{ projectData.name }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">설명:</span>
            <span class="value">{{ projectData.description }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">기간:</span>
            <span class="value">{{ projectData.period }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">역할:</span>
            <span class="value">{{ projectData.role }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">팀 구성:</span>
            <span class="value">{{ projectData.teamSize }}</span>
          </div>
        </div>

        <div class="tech-stack">
          <h3 class="subsection-title">기술 스택</h3>
          <div class="tech-list">
            <div 
              v-for="tech in projectData.techStack" 
              :key="tech"
              class="tech-item"
            >
              {{ tech }}
            </div>
          </div>
        </div>

        <div class="features-section">
          <h3 class="subsection-title">주요 기능</h3>
          <ul class="features-list">
            <li v-for="feature in projectData.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>

        <div class="description-section">
          <h3 class="subsection-title">프로젝트 설명</h3>
          <p class="project-description">
            {{ projectData.longDescription }}
          </p>
        </div>
      </div>

      <!-- AI Coaching Result (50%) -->
      <div class="coaching-result">
        <div class="result-header">
          <h2 class="section-title">
            <span class="icon">🤖</span>
            AI 코칭 결과
          </h2>
        </div>

        <!-- Score Circle -->
        <div class="score-section">
          <div class="score-circle">
            <div class="score-value">{{ analysisData.score }}</div>
            <div class="score-label">점</div>
          </div>
        </div>

        <!-- Feedback Sections -->
        <div class="feedback-sections">
          <!-- Good Points -->
          <div class="feedback-card good">
            <h3 class="feedback-title">
              <span class="feedback-icon">👍</span>
              잘한 부분
            </h3>
            <ul class="feedback-list">
              <li v-for="point in analysisData.goodPoints" :key="point">
                {{ point }}
              </li>
            </ul>
          </div>

          <!-- Improvement Points -->
          <div class="feedback-card improve">
            <h3 class="feedback-title">
              <span class="feedback-icon">💡</span>
              개선할 부분 (권장)
            </h3>
            <ul class="feedback-list">
              <li v-for="point in analysisData.improvementPoints" :key="point">
                {{ point }}
              </li>
            </ul>
          </div>

          <!-- Additional Feedback -->
          <div class="feedback-card additional">
            <h3 class="feedback-title">
              <span class="feedback-icon">📝</span>
              종합 평가
            </h3>
            <p class="overall-feedback">
              {{ analysisData.overallFeedback }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons d-flex justify-content-center">
      <button class="btn btn-secondary me-3" @click="downloadReport">
        <span class="btn-icon">📊</span>
        리포트 다운로드
      </button>
      <button class="btn btn-primary me-3" @click="editPortfolio">
        <span class="btn-icon">✏️</span>
        포트폴리오 수정하기
      </button>
      <button class="btn btn-tertiary" @click="saveResult">
        <span class="btn-icon">💾</span>
        저장하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/sidebar/SideBar.vue'

// Router 사용
const router = useRouter()

// 상태 선언 - ref로 반응형 데이터 생성
const projectData = ref({
  name: '프로젝트명 제목',
  description: '실시간 채팅 플랫폼',
  period: '2023.01 - 2023.06',
  role: '백엔드 개발 및 팀 리더',
  teamSize: '5명 (FE 2명, BE 2명, 디자이너 1명)',
  techStack: [
    'Node.js', 'Socket.io', 'Redis', 'MongoDB', 'AWS EC2', 'Docker'
  ],
  features: [
    '실시간(1:1) 그룹 채팅',
    '파일 첨부 및 이미지 공유',
    '읽음 표시 및 알림 기능',
    '검색 및 채팅방 관리'
  ],
  longDescription: '실시간 소통이 필요한 업무 환경을 위해 개발한 Redis Pub/Sub 패턴을 도입하여 수평적 확장이 가능한 아키텍처로 구현했습니다. 메시지 서비스의 실시간 처리성능을 50ms 이하로 최적화했습니다.'
})

const analysisData = ref({
  score: 85,
  goodPoints: [
    '기술 스택이 트렌드에 맞고 최신 기술을 잘 활용했습니다',
    '실제 문제를 해결하는 프로젝트로 실무 적용 가능성이 높습니다',
    '성능 최적화에 대한 구체적인 수치와 방법이 제시되어 있습니다',
    '팀워크와 리더십 역할을 명확히 보여줍니다'
  ],
  improvementPoints: [
    '프로젝트의 결과와 임팩트를 더 구체적으로 제시',
    '사용자 피드백이나 실제 사용 현황 데이터 추가',
    '코드 품질이나 테스트 커버리지 같은 기술적 완성도 언급',
    '향후 확장 계획이나 개선 방향 제시'
  ],
  overallFeedback: '기술적 역량과 팀워크가 잘 드러나는 우수한 프로젝트입니다. 성과를 수치화하여 제시한 점이 인상적이며, 실무에서 바로 활용할 수 있는 기술 스택을 사용한 점이 긍정적입니다.'
})

// 함수 선언
function downloadReport() {
  console.log('리포트 다운로드')
  console.log('프로젝트명:', projectData.value.name)
}

function editPortfolio() {
  console.log('포트폴리오 수정')
  router.push('/resume/portfolio/coach')
}

function saveResult() {
  console.log('분석 결과 저장')
  alert('분석 결과가 저장되었습니다!')
}
</script>

<style scoped>
.portfolio-analysis-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #F5F5F5;
  min-height: 100vh;
  /* display: flex; → d-flex 클래스로 대체됨 */
}

/* Sidebar Container - 고정 너비 250px */
.sidebar-container {
  width: 250px;
  background: #FFFFFF;
  border-right: 1px solid #E5E5E5;
  min-height: 100vh;
  flex-shrink: 0; /* 사이드바 크기 고정 */
}

/* Analysis Container - 나머지 공간 차지 */
.analysis-container {
  /* flex: 1; → flex-fill 클래스로 대체됨 */
  /* display: flex; → d-flex 클래스로 대체됨 */
  gap: 2rem;
  padding: 2rem;
  min-height: 100vh;
}

/* Portfolio Details - 메인 영역의 50% */
.portfolio-details {
  width: 50%;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow-y: auto;
  max-height: calc(100vh - 4rem);
}

/* Coaching Result - 메인 영역의 50% */
.coaching-result {
  width: 50%;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow-y: auto;
  max-height: calc(100vh - 4rem);
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #F1F2F3;
  padding-bottom: 1rem;
}

.icon {
  font-size: 1.2rem;
}

/* Project Info */
.project-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.8rem;
  line-height: 1.6;
}

.label {
  color: #666;
  font-weight: 500;
  min-width: 100px;
  margin-right: 1rem;
}

.value {
  color: #000;
  flex: 1;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

/* Tech Stack */
.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-item {
  background: #F0F8FF;
  color: #1976D2;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Features */
.features-list {
  list-style: none;
  margin-bottom: 1.5rem;
}

.features-list li {
  position: relative;
  padding-left: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
  line-height: 1.5;
}

.features-list li:before {
  content: "•";
  color: #71EBBE;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.project-description {
  color: #444;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Score Section */
.score-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.score-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #333, #000);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
}

.score-value {
  font-size: 2rem;
  font-weight: bold;
}

.score-label {
  font-size: 0.8rem;
  margin-top: -0.2rem;
}

/* Feedback Sections */
.feedback-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feedback-card {
  background: #F8F9FA;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #71EBBE;
}

.feedback-card.good {
  border-left-color: #4CAF50;
}

.feedback-card.improve {
  border-left-color: #FF9800;
}

.feedback-card.additional {
  border-left-color: #2196F3;
}

.feedback-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
}

.feedback-icon {
  font-size: 1.1rem;
}

.feedback-list {
  list-style: none;
}

.feedback-list li {
  position: relative;
  padding-left: 1.2rem;
  margin-bottom: 0.8rem;
  color: #333;
  line-height: 1.6;
  font-size: 0.9rem;
}

.feedback-list li:before {
  content: "→";
  color: #71EBBE;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.overall-feedback {
  color: #444;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Action Buttons - 하단 고정 */
.action-buttons {
  /* display: flex; → d-flex 클래스로 대체됨 */
  gap: 1rem;
  padding: 2rem;
  background: #F5F5F5;
  border-top: 1px solid #E5E5E5;
  position: fixed;
  bottom: 0;
  left: 250px; /* 사이드바 너비만큼 오른쪽으로 이동 */
  right: 0;
  z-index: 10;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: all 0.3s;
  min-width: 180px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #71EBBE, #A2F1D6);
  color: #000;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(113, 235, 190, 0.4);
}

.btn-secondary {
  background: #FFFFFF;
  border: 2px solid #E5E5E5;
  color: #333;
}

.btn-secondary:hover {
  border-color: #71EBBE;
  background: #F0FDF8;
}

.btn-tertiary {
  background: #6C757D;
  color: #FFFFFF;
}

.btn-tertiary:hover {
  background: #5A6268;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .portfolio-analysis-page {
    flex-direction: column !important; /* d-flex에 대한 override */
  }
  
  .sidebar-container {
    width: 100%;
    min-height: auto;
  }
  
  .analysis-container {
    flex-direction: column !important; /* d-flex에 대한 override */
  }
  
  .portfolio-details,
  .coaching-result {
    width: 100%;
  }
  
  .action-buttons {
    position: relative;
    left: 0;
  }
}
</style>