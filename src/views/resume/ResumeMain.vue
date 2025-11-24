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
                <p class="subtitle">AI를 통한 이력서 분석부터 서류분석 빠르게 분석할 수 있어요!</p>
              </div>
              <button class="banner-button" @click="$router.push('/resume/write')">
                내 커리어 기록하러 가기
              </button>
            </div>
          </div>
        </div>


        <!-- 내 이력서 리스트 -->
        <div class="resume-section">
          <div class="section-header d-flex justify-content-between align-items-center">
            <h2>내 이력서 리스트</h2>

            <div class="d-flex align-items-center">
              <button class="btn btn-primary select-btn me-3" @click="toggleSelectMode" :class="{ 'active': isSelecting }">
                {{ isSelecting ? '취소' : '선택하기' }}
              </button>

              <button v-if="isSelecting" class="btn btn-danger delete-btn" @click="confirmDelete" :disabled="!hasSelectedItems">
                삭제하기
              </button>

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
            <div v-for="resume in resumeList" :key="resume.id" class="resume-card" :class="{ selecting: isSelecting }">

              <!-- 체크박스 - position absolute 적용 -->
              <input v-if="isSelecting" type="checkbox" class="select-checkbox" :checked="selectedResumes === resume.id" @change="selectResume(resume.id)" />
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

            <div v-for="cover in coverLetterList" :key="cover.id" class="resume-card" :class="{ selecting: isSelecting }">
              <input v-if="isSelecting" type="checkbox" class="select-checkbox" :checked="selectedCovers === cover.id" @change="selectCover(cover.id)" />
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

            <div v-for="portfolio in portfolioList" :key="portfolio.portfolioId" class="resume-card">
              <div class="card-content" @click="goToPortfolioDetail(portfolio.portfolioId)">
                <div class="resume-icon">🎨</div>
                <h3 class="resume-title">{{ portfolio.title }}</h3>
                <div class="resume-meta">
                  <span class="update-date">📅 {{ portfolio.updatedAt }}</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import portfolioLogic  from "../../utils/resumeMain"

const { portfolioList } = portfolioLogic.usePortfolioList();



const router = useRouter()

// 선택 모드 on/off
const isSelecting = ref(false)
const toggleSelectMode = () => {
  isSelecting.value = !isSelecting.value
  // 선택 모드를 종료할 때 선택된 항목들 초기화
  if (!isSelecting.value) {
    selectedResumes.value = []
    selectedCovers.value = []
    selectedPortfolios.value = []
  }
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

// 다중 선택을 위한 배열 선언
const selectedResumes = ref([])
const selectedCovers = ref([])
const selectedPortfolios = ref([])

// 선택 항목이 있는지 확인하는 computed 속성
const hasSelectedItems = computed(() => {
  return selectedResumes.value.length > 0 ||
    selectedCovers.value.length > 0 ||
    selectedPortfolios.value.length > 0
})

// 선택 토글 함수 예시 (이력서)
const selectResume = (id) => {
  const index = selectedResumes.value.indexOf(id)
  if (index === -1) {
    // 없으면 추가
    selectedResumes.value.push(id)
  } else {
    // 있으면 제거
    selectedResumes.value.splice(index, 1)
  }
}
const selectCover = (id) => {
  const index = selectedCovers.value.indexOf(id)
  if (index === -1) {
    selectedCovers.value.push(id)
  } else {
    selectedCovers.value.splice(index, 1)
  }

}





// 삭제 확인 함수
const confirmDelete = () => {
  // 선택된 항목이 없으면 실행하지 않음
  if (!hasSelectedItems.value) return

  if (confirm('정말로 선택한 항목을 삭제하시겠습니까?')) {
    deleteSelectedItems()
  }
}

// 선택된 항목 삭제 함수
const deleteSelectedItems = () => {
  // 이력서 삭제
  if (selectedResumes.value.length > 0) {
    resumeList.value = resumeList.value.filter(item => !selectedResumes.value.includes(item.id))
    console.log(`이력서 ID:${selectedResumes.value.join(', ')} 삭제됨`)
    selectedResumes.value = []
  }

  // 자기소개서 삭제
  if (selectedCovers.value.length > 0) {
    coverLetterList.value = coverLetterList.value.filter(item => !selectedCovers.value.includes(item.id))
    console.log(`자기소개서 ID:${selectedCovers.value.join(', ')} 삭제됨`)
    selectedCovers.value = []
  }

  // 포트폴리오 삭제
  if (selectedPortfolios.value.length > 0) {
    // 포트폴리오 삭제 로직
    console.log(`포트폴리오 ID:${selectedPortfolios.value.join(', ')} 삭제됨`)
    selectedPortfolios.value = []
  }
}

// const createIntegratedDocument = () => {
//   if (!selectedResume.value || !selectedCover.value ) {
//     alert('이력서, 자기소개서 중 최소 1개를 선택해주세요!')
//     return
//   }

//   // 통합 문서 생성 로직 (API 호출 or 페이지 이동)
//   console.log('통합 문서 생성:', {
//     resumeId: selectedResume.value,
//     coverId: selectedCover.value,
//     portfolioId: selectedPortfolio.value
//   })

//   router.push({
//     path: '/resume/final',
//     query: {
//       resumeId: selectedResume.value,
//       coverId: selectedCover.value,
//       portfolioId: selectedPortfolio.value
//     }
//   })
// }


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

<style src="@/assets/css/resumeMain.css"></style>