<template>
  <div class="resume-main">
    <div class="main-container">
      <div class="main-content">
        <!-- 인사말 -->
        <div class="greeting">
          <h1>반갑습니다, {{ userName }} 님</h1>
        </div>

        <!-- 배너 섹션 -->
        <div class="banner-section">
          <div class="banner-card">
            <div class="banner-content">
              <div class="banner-icon">🎓</div>
              <div class="banner-text">
                <h2>커리어를 관리해보세요!</h2>
                <p>AI를 통한 이력서 분석부터 서류분석 빠르게 분석할 수 있어요!</p>
              </div>
              <button class="banner-button" @click="$router.push('/resume/write')">
                내 커리어 기록하러 가기
              </button>
            </div>
          </div>
        </div>

        <!-- 내 이력서 리스트 -->
        <div class="resume-section">
          
          <div class="section-header">
            <h2>내 이력서 리스트</h2>
            <div style="margin-left: 650px;">
              <button class="select-toggle-btn" @click="toggleSelectMode">
              {{ isSelecting ? '선택 완료' : '선택하기' }}
              </button>
            </div>
            <div class="header-actions">
              <span class="ai-suggestion">✨ AI 이력서 작성</span>
            </div>
          </div>

          <div class="resume-grid">
            <!-- 새 이력서 작성 -->
            <div class="resume-card add-card" @click="$router.push('/resume/write')">
              <div class="card-content">
                <div class="add-icon">+</div>
                <div class="add-text">새 이력서 작성</div>
              </div>
            </div>

            <!-- 기존 이력서 카드 -->
            <div 
              v-for="resume in resumeList" 
              :key="resume.id" 
              class="resume-card"
              :class="{ selecting: isSelecting }">
              
              <!-- 체크박스 -->
              <input 
                v-if="isSelecting"
                type="checkbox" 
                class="select-checkbox"
                :checked="selectedResume === resume.id"
                @change="selectResume(resume.id)"
              />
              <div class="card-content" @click="goToResumeDetail(resume.id)">
                <div class="resume-icon">📄</div>
                <div class="resume-info">
                  <h3 class="resume-title">{{ resume.title }}</h3>
                  <p class="resume-description">{{ resume.description }}</p>
                  <div class="resume-meta">
                    <span class="update-date">📅 최종 수정: {{ resume.updatedAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 자기소개서 리스트 -->
        <div class="resume-section">
          <div class="section-header">
            <h2>내 자기소개서 리스트</h2>
            <div class="header-actions">
              <span class="ai-suggestion">✨ AI 자기소개서 작성</span>
            </div>
          </div>

          <div class="resume-grid">
            <!-- 새 자소서 카드 -->
            <div class="resume-card add-card" @click="$router.push('/resume/coverletter/write')">
              <div class="card-content">
                <div class="add-icon">+</div>
                <div class="add-text">새 자기소개서 작성</div>
              </div>
            </div>

            <div
              v-for="cover in coverLetterList"
              :key="cover.id"
              class="resume-card"
              :class="{ selecting: isSelecting }"
            >
               <input 
                  v-if="isSelecting"
                  type="checkbox" 
                  class="select-checkbox"
                  :checked="selectedCover === cover.id"
                  @change="selectCover(cover.id)"
                />
              <div class="card-content" @click="goToCoverDetail(cover.id)">
                <div class="resume-icon">🖋️</div>
                <div class="resume-info">
                  <h3 class="resume-title">{{ cover.title }}</h3>
                  <p class="resume-description">{{ cover.description }}</p>
                  <div class="resume-meta">
                    <span class="update-date">📅 최종 수정: {{ cover.updatedAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 포트폴리오 리스트 -->
        <div class="resume-section">
          <div class="section-header">
            <h2>내 포트폴리오 리스트</h2>
            <div class="header-actions">
              <span class="ai-suggestion">✨ AI 포트폴리오 코칭</span>
            </div>
          </div>

          <div class="resume-grid">
            <div class="resume-card add-card" @click="$router.push('/resume/portfolio/write')">
              <div class="card-content">
                <div class="add-icon">+</div>
                <div class="add-text">새 포트폴리오 등록</div>
              </div>
            </div>

            <div 
              v-for="portfolio in resumeList" 
              :key="portfolio.id" 
              class="resume-card"
              :class="{ selecting: isSelecting }"
            >
              <input 
                v-if="isSelecting"
                type="checkbox" 
                class="select-checkbox"
                :checked="selectedPortfolio === portfolio.id"
                @change="selectPortfolio(portfolio.id)"
              />
              <div class="card-content" @click="goToPortfolioDetail(portfolio.id)">
                <div class="resume-icon">🎨</div>
                <div class="resume-info">
                  <h3 class="resume-title">{{ portfolio.title }}</h3>
                  <p class="resume-description">{{ portfolio.description }}</p>
                  <div class="resume-meta">
                    <span class="update-date">📅 최종 수정: {{ portfolio.updatedAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 통합 문서 만들기 버튼 -->
        <div class="integrate-section">
          <button 
            class="integrate-button"
            
            @click="createIntegratedDocument"
          >
            📚 통합 문서 만들기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 선택 모드 on/off
const isSelecting = ref(false)
const toggleSelectMode = () => {
  isSelecting.value = !isSelecting.value
}

// 사용자 정보
const userName = ref('김병현')

// 이력서 리스트 데이터
const resumeList = ref([
  {
    id: 1,
    title: '엔전 이력서',
    description: '백엔드 엔지니어 지원용',
    updatedAt: '2024.03.15'
  },
  {
    id: 2, 
    title: '행정 2',
    description: '프론트엔드 개발자 지원용',
    updatedAt: '2024.03.10'
  },
  {
    id: 3,
    title: '행정들',
    description: '풀스택 개발자 지원용', 
    updatedAt: '2024.03.08'
  }
])

// 이력서 상세 페이지로 이동 (서류코칭 페이지)
const goToResumeDetail = (resumeId) => {
  router.push(`/resume/coach?id=${resumeId}`)
}

const goToPortfolioDetail = () => {
  router.push(`/resume/portfolio/coach`)
}

const selectedResume = ref(null)
const selectedCover = ref(null)
const selectedPortfolio = ref(null)

const selectResume = (id) => {
  selectedResume.value = selectedResume.value === id ? null : id
}

const selectCover = (id) => {
  selectedCover.value = selectedCover.value === id ? null : id
}

const selectPortfolio = (id) => {
  selectedPortfolio.value = selectedPortfolio.value === id ? null : id
}

const createIntegratedDocument = () => {
  if (!selectedResume.value || !selectedCover.value ) {
    alert('이력서, 자기소개서 중 최소 1개를 선택해주세요!')
    return
  }

  // 통합 문서 생성 로직 (API 호출 or 페이지 이동)
  console.log('통합 문서 생성:', {
    resumeId: selectedResume.value,
    coverId: selectedCover.value,
    portfolioId: selectedPortfolio.value
  })

  router.push({
    path: '/resume/integrated',
    query: {
      resumeId: selectedResume.value,
      coverId: selectedCover.value,
      portfolioId: selectedPortfolio.value
    }
  })
}


// API 호출로 이력서 리스트 조회
const fetchResumeList = async () => {
  try {
    // localhost:8081/api/resume 호출
    const response = await fetch('http://localhost:8081/api/resume', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.resumeList) {
        resumeList.value = data.resumeList
      }
    }
  } catch (error) {
    console.error('이력서 리스트 조회 실패:', error)
  }
}

// 자기소개서 리스트 (정적 데이터)
const coverLetterList = ref([
  {
    id: 1,
    title: '카카오 자기소개서',
    description: '백엔드 개발 직무 지원',
    updatedAt: '2024.03.12'
  },
  {
    id: 2,
    title: '네이버 자기소개서',
    description: 'AI 플랫폼 개발 지원',
    updatedAt: '2024.03.09'
  }
]);

// 자소서 상세로 이동
const goToCoverDetail = (coverId) => {
  router.push(`/resume/coverletter/detail?id=${coverId}`)
}

// 사용자 정보 조회
const fetchUserInfo = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/user/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.user) {
        userName.value = data.user.name || '사용자'
      }
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error)
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchResumeList()
})
</script>

<style scoped>
.resume-main {
  min-height: 100vh;
  background: #f8f9fa;
 
}

.main-container {
  display: flex;
  min-height: 100vh;
}

/* 사이드바 */
.sidebar {
  background: #f8f9fa; /* 기존 white에서 변경 */
  border-right: 1px solid #e9ecef;
}


.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  padding: 16px 24px; /* 기존 12px에서 16px로 증가 */
  font-size: 15px; /* 기존 14px에서 15px로 증가 */
  color: #495057; /* 더 진한 회색 */
}

.menu-item:hover {
  background: #f8f9fa;
  color: #71EBBE;
}

.menu-item.active {
  background: #ffffff;
  color: #212529;
  border-right: none; /* 기존 녹색 보더 제거 */
  font-weight: 600;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  padding: 40px;
}

.select-toggle-btn {
  background: #71EBBE; /* 동일한 녹색 */
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  /* 위치 조정 */
  margin-left: 200px; /* 왼쪽으로 이동 */
}





/* 인사말 */
.greeting {
  margin-bottom: 30px;
}

.greeting h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

/* 배너 섹션 */
.banner-section {
  margin-bottom: 40px;
}

.banner-card {
  background: linear-gradient(135deg, #71EBBE 0%, #5BC7A7 100%);
  border-radius: 16px;
  padding: 30px;
  color: white;
  box-shadow: 0 8px 32px rgba(113, 235, 190, 0.3);
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.banner-icon {
  font-size: 48px;
}

.banner-text {
  flex: 1;
}

.banner-text h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
}

.banner-text p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.banner-button {
  background: white;
  color: #71EBBE;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* 이력서 섹션 */
.resume-section {
  background: white;
  margin-top: 15px;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-suggestion {
  color: #71EBBE;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 이력서 그리드 */
.resume-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 20px;
}

.resume-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.resume-card.selecting {
  border-color: #71EBBE;
  box-shadow: 0 0 0 2px rgba(113, 235, 190, 0.3);
}

.resume-card:hover {
  border-color: #71EBBE;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(113, 235, 190, 0.15);
}

/* 새 이력서 추가 카드 */
.resume-card.add-card {
  border-style: dashed;
  border-color: #71EBBE;
  background: linear-gradient(135deg, rgba(113, 235, 190, 0.05) 0%, rgba(91, 199, 167, 0.05) 100%);
}

.add-card .card-content {
  text-align: center;
  color: #71EBBE;
}

.add-icon {
  font-size: 48px;
  margin-bottom: 12px;
  font-weight: 300;
}

.add-text {
  font-weight: 600;
  font-size: 16px;
}

/* 기존 이력서 카드 */
.resume-card:not(.add-card) .card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.resume-icon {
  font-size: 32px;
  margin-bottom: 16px;
  color: #71EBBE;
}

.resume-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resume-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.resume-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  flex: 1;
}

.resume-meta {
  margin-top: auto;
}

.update-date {
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.select-checkbox {
  
  position: relative;
  top: 2px;
  left: 220px;
  width: 35px;
  height: 35px;
  cursor: pointer;
  accent-color: #71EBBE;
}

.integrate-section {
  display: flex;
  justify-content: center;
  margin-top: 30px; /* 기존 40px에서 30px로 수정 */

}

.integrate-button {
  background: #71EBBE; /* background-color에서 background로 변경 */
  color: white;
  border: none;
  padding: 14px 24px; /* banner-button과 동일한 패딩 */
  border-radius: 8px;  /* banner-button과 동일한 radius */
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;     /* banner-button과 동일한 크기 */
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1); /* banner-button과 동일한 그림자 */

}

.integrate-button:hover {
   transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);

}

.integrate-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}



/* 반응형 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 16px 0;
  }
  
  .sidebar-menu {
    display: flex;
    overflow-x: auto;
    padding: 0 16px;
    gap: 8px;
  }
  
  .menu-item {
    white-space: nowrap;
    padding: 8px 16px;
    border-radius: 20px;
  }
  
  .menu-item.active {
    background: #71EBBE;
    color: white;
    border-right: none;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .greeting h1 {
    font-size: 24px;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-text h2 {
    font-size: 20px;
  }
  
  .resume-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 16px;
  }
  
  .banner-card {
    padding: 20px;
  }
  
  .banner-text h2 {
    font-size: 18px;
  }
  
  .resume-section {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }




}
</style>