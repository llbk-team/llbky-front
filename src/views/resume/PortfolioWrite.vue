<template>
  <div class="portfolio-coaching">

    <div class="main-container">
      <SideBar/>
     

      <!-- Main Content -->
      <main class="content">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <span>my > 서류작성 > 포트폴리오</span>
        </div>

        <!-- Page Title -->
        <h1 class="page-title">서류 AI 코칭</h1>

        <!-- Upload Section -->
        <div class="upload-section">
          <div class="upload-icon">📁</div>
          <h2 class="upload-title">포트폴리오 코칭</h2>
          <p class="upload-subtitle">포트폴리오나 링크나 파일을 업로드하면 AI가 전문적으로 리뷰해드립니다.</p>
          
          <div class="upload-types">
            <div class="type-btn" :class="{ active: selectedType === 'link' }" @click="selectType('link')">
              <div class="type-icon">🔗</div>
              <div class="type-label">포트폴리오 링크</div>
            </div>
            
            <div class="type-btn" :class="{ active: selectedType === 'project' }" @click="selectType('project')">
              <div class="type-icon">📊</div>
              <div class="type-label">문서PDF/img</div>
            </div>
          </div>

          <button class="upload-btn" @click="handleUpload">
            📤 포트폴리오 업로드하기
          </button>
        </div>

  

        <!-- Action Button -->
        <div class="action-section">
          <button class="action-btn" @click="startAnalysis">
            ✏️ 포트폴리오 첨삭받기
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/sidebar/SideBar.vue'


// Router 사용
const router = useRouter()

// 상태 선언 - data()를 ref()로 변환
const selectedType = ref('link')
const activeTab = ref('overall')

const tabs = ref([
  { id: 'overall', name: '전체 평가' },
  { id: 'technical', name: '기술 깊이' },
  { id: 'collaboration', name: '협업 역량' },
  { id: 'problem-solving', name: '문제해결' }
])

const reviewCards = ref([
  {
    id: 1,
    icon: '💻',
    title: '기술 깊이',
    description: '기술 스택의 이해도와 구현 수준을 평가합니다',
    stars: '★★★★★',
    score: 92
  },
  {
    id: 2,
    icon: '🤝',
    title: '협업 역량',
    description: '팀 프로젝트와 협업 능력을 평가합니다',
    stars: '★★★★☆',
    score: 78
  },
  {
    id: 3,
    icon: '🔧',
    title: '문제해결력',
    description: '복잡한 문제를 해결한 경험을 평가합니다',
    stars: '★★★★★',
    score: 88
  },
  {
    id: 4,
    icon: '📈',
    title: '성과 지표',
    description: '프로젝트의 임팩트와 성과를 평가합니다',
    stars: '★★★★☆',
    score: 85
  }
])

// 프로젝트 데이터 (기존 코드에서 가져온 것)
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

// 함수 선언 - methods를 일반 함수로 변환
function selectType(type) {
  selectedType.value = type
  console.log('선택된 타입:', type)
}

function setActiveTab(tabId) {
  activeTab.value = tabId
  console.log('활성 탭:', tabId)
}

function handleUpload() {
  // 파일 업로드 로직 구현
  console.log('파일 업로드 시작')
  console.log('선택된 타입:', selectedType.value)
  // 실제 파일 업로드 로직을 여기에 구현
  // 예: FormData 생성, API 호출 등
}

function selectCard(card) {
  // 카드 선택 로직 구현
  console.log('선택된 카드:', card.title)
  console.log('카드 점수:', card.score)
  
  // 카드 선택에 따른 상세 분석으로 이동 (예시)
  if (card.id === 1) {
    setActiveTab('technical')
  } else if (card.id === 2) {
    setActiveTab('collaboration')
  } else if (card.id === 3) {
    setActiveTab('problem-solving')
  }
}

function startAnalysis() {
  // 분석 시작 로직 구현
  console.log('포트폴리오 분석 시작')
  console.log('프로젝트 데이터:', projectData.value.name)
  
  // 분석 중 상태 표시 (예시)
  // loading.value = true
  
  // API 호출 예시
  // try {
  //   const result = await portfolioAnalysisAPI(projectData.value)
  //   analysisData.value = result
  //   router.push('/portfolio/analysis/result')
  // } catch (error) {
  //   console.error('분석 실패:', error)
  // } finally {
  //   loading.value = false
  // }
  
  alert('포트폴리오 분석을 시작합니다!')

  router.push('/resume/portfolio/coach')
}

function downloadReport() {
  console.log('리포트 다운로드')
  console.log('프로젝트명:', projectData.value.name)
  // 리포트 다운로드 로직
}

function editPortfolio() {
  console.log('포트폴리오 수정')
  router.push('/resume/portfolio/coach')
}

function saveResult() {
  console.log('분석 결과 저장')
  console.log('저장할 데이터:', {
    project: projectData.value.name,
    score: analysisData.value.score,
    selectedType: selectedType.value,
    activeTab: activeTab.value
  })
  alert('분석 결과가 저장되었습니다!')
}

// 추가 유틸리티 함수들
function resetAnalysis() {
  // 분석 초기화
  selectedType.value = 'link'
  activeTab.value = 'overall'
  console.log('분석이 초기화되었습니다.')
}

function getScoreColor(score) {
  // 점수에 따른 색상 반환
  if (score >= 90) return '#4CAF50'      // 초록색
  if (score >= 80) return '#71EBBE'      // 민트색
  if (score >= 70) return '#FF9800'      // 주황색
  return '#F44336'                       // 빨간색
}

// ref 변수 접근 시 .value 사용 예시 함수
function getCurrentTabName() {
  const currentTab = tabs.value.find(tab => tab.id === activeTab.value)
  return currentTab ? currentTab.name : '알 수 없음'
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.portfolio-coaching {
  
  background: #F5F5F5;
  min-height: 100vh;
}

/* Header */
.header {
  background: #FFFFFF;
  border-bottom: 1px solid #E5E5E5;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.menu-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: #333;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-item:hover {
  background: #F0F0F0;
}

/* Main Container */
.main-container {
  display: flex;
  margin-top: 0px;
  min-height: calc(100vh - 80px);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #FFFFFF;
  border-right: 1px solid #E5E5E5;
  padding: 2rem 1rem;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.menu-item:hover {
  background: #F8F9FA;
}

.menu-item.active {
  background: #E3F2FD;
  color: #1976D2;
}

.menu-item.active-portfolio {
  background: linear-gradient(135deg, #71EBBE, #A2F1D6);
  color: #000;
  font-weight: 600;
}

.menu-icon {
  font-size: 1.2rem;
}

/* Content */
.content {
  flex: 1;
  padding: 2rem 3rem;
}

.breadcrumb {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 2rem;
  text-align: center;
}

/* Upload Section */
.upload-section {
  background: #FFFFFF;
  border: 3px dashed #71EBBE;
  border-radius: 25px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #000;
}

.upload-subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.upload-types {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-btn {
  background: #F8F9FA;
  border: 2px solid #E5E5E5;
  padding: 1.5rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.type-btn:hover {
  border-color: #71EBBE;
  background: #F0FDF8;
}

.type-btn.active {
  background: linear-gradient(135deg, #71EBBE, #A2F1D6);
  border-color: #71EBBE;
  color: #000;
  font-weight: 600;
}

.type-icon {
  font-size: 1.5rem;
}

.type-label {
  font-size: 0.85rem;
  font-weight: 500;
}

.upload-btn {
  background: linear-gradient(135deg, #71EBBE, #A2F1D6);
  color: #000;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(113, 235, 190, 0.4);
}

/* Tab Navigation */
.tab-nav {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  background: #F8F9FA;
  border-radius: 12px;
  padding: 0.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tab-item {
  flex: 1;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
}

.tab-item:hover {
  color: #000;
}

.tab-item.active {
  background: #71EBBE;
  color: #000;
  font-weight: 600;
}

/* Review Grid */
.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.review-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.review-card:hover {
  transform: translateY(-5px);
  border-color: #71EBBE;
  box-shadow: 0 8px 30px rgba(113, 235, 190, 0.3);
}

.card-icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #F0FDF8, #A2F1D6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #000;
}

.card-description {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
}

.rating-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rating-stars {
  color: #71EBBE;
  font-size: 1.1rem;
}

.rating-text {
  font-size: 1rem;
  font-weight: 600;
  color: #000;
}

/* Action Section */
.action-section {
  text-align: center;
  margin-top: 3rem;
}

.action-btn {
  background: linear-gradient(135deg, #71EBBE, #A2F1D6);
  color: #000;
  padding: 1.2rem 3rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(113, 235, 190, 0.3);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(113, 235, 190, 0.5);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 1rem;
  }
  
  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .content {
    padding: 1.5rem;
  }
  
  .review-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .upload-types {
    flex-direction: column;
    align-items: center;
  }
  
  .tab-nav {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .review-grid {
    grid-template-columns: 1fr;
  }
}
</style>