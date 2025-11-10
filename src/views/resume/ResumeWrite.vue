<template>
  <div class="app-container">
    <!-- 사이드바 -->
   <SideBar/>

    <!-- 메인 컨테이너 -->
    <div class="main-container">

      <!-- 이력서 작성 폼 -->
      <div class="resume-form-container">
        <div class="form-header">
          <h1>이력서 작성하기</h1>
          <p>단순한 정보를 입력하여보면 자동으로 양식에 맞게 내용까지 추천받을 수 있습니다.<br>
          자세한 이력서를 경력의 빛을 낼 수 있도록 작성해보세요.</p>
        </div>

        <!-- 기본 정보 -->
        <div class="form-section" :class="{ 'expanded': sections.basic, 'active': sections.basic }">
          <div class="section-header" @click="toggleSection('basic')">
            <div class="section-info">
              <h3>기본 정보</h3>
              <span class="section-desc">개인정보, 연락처</span>
            </div>
            <button class="toggle-btn" :class="{ 'active': sections.basic }">
              {{ sections.basic ? '×' : '+' }}
            </button>
          </div>
          
          <div class="section-content" v-show="sections.basic">
            <div class="form-grid">
              <div class="form-group">
                <label>이름 *</label>
                <input 
                  type="text" 
                  v-model="resumeData.name" 
                  placeholder="이름을 입력하세요"
                  @input="onInputChange('name', $event.target.value)"
                />
              </div>
              <div class="form-group">
                <label>연락처 *</label>
                <input 
                  type="tel" 
                  v-model="resumeData.phone" 
                  placeholder="010-0000-0000"
                  @input="onInputChange('phone', $event.target.value)"
                />
              </div>
            </div>
            <div class="form-group">
              <label>이메일 *</label>
              <input 
                type="email" 
                v-model="resumeData.email" 
                placeholder="example@email.com"
                @input="onInputChange('email', $event.target.value)"
              />
            </div>
            <div class="form-group">
              <label>프로젝트 링크(깃허브)</label>
              <input 
                type="url" 
                v-model="resumeData.github" 
                placeholder="https://github.com/username"
                @input="onInputChange('github', $event.target.value)"
              />
            </div>
          </div>
        </div>

        <!-- 교육사항 -->
        <div class="form-section" :class="{ 'expanded': sections.education, 'active': sections.education }">
          <div class="section-header" @click="toggleSection('education')">
            <div class="section-info">
              <h3>교육사항</h3>
              <span class="section-desc">학교명, 전공명을 적어주세요</span>
            </div>
            <button class="toggle-btn" :class="{ 'active': sections.education }">
              {{ sections.education ? '×' : '+' }}
            </button>
          </div>
          
          <div class="section-content" v-show="sections.education">
            <div v-for="(education, index) in resumeData.educations" :key="index" class="education-item">
              <div class="form-grid">
                <div class="form-group">
                  <label>교육기관명</label>
                  <input 
                    type="text" 
                    v-model="education.school" 
                    placeholder="대학교/고등학교"
                    @input="onInputChange('education', resumeData.educations)"
                  />
                </div>
                <div class="form-group">
                  <label>전공/계열</label>
                  <input 
                    type="text" 
                    v-model="education.major" 
                    placeholder="컴퓨터공학과"
                    @input="onInputChange('education', resumeData.educations)"
                  />
                </div>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>입학년도</label>
                  <input type="month" v-model="education.startDate" />
                </div>
                <div class="form-group">
                  <label>졸업년도</label>
                  <input type="month" v-model="education.endDate" />
                </div>
              </div>
              <button type="button" class="remove-btn" @click="removeEducation(index)" v-if="resumeData.educations.length > 1">삭제</button>
            </div>
            <button type="button" class="add-btn" @click="addEducation">+ 교육사항 추가하기</button>
          </div>
        </div>

        <!-- 스킬 -->
        <div class="form-section" :class="{ 'expanded': sections.skills, 'active': sections.skills }">
          <div class="section-header" @click="toggleSection('skills')">
            <div class="section-info">
              <h3>스킬</h3>
              <span class="section-desc">기술 스택을 추가하세요</span>
            </div>
            <button class="toggle-btn" :class="{ 'active': sections.skills }">
              {{ sections.skills ? '×' : '+' }}
            </button>
          </div>
          
          <div class="section-content" v-show="sections.skills">
            <div class="skills-grid">
              <div v-for="(skill, index) in resumeData.skills" :key="index" class="skill-item">
                <input 
                  type="text" 
                  v-model="skill.name" 
                  placeholder="기술 스택 입력"
                  @input="onInputChange('skills', resumeData.skills)"
                />
                <button class="remove-skill-btn" @click="removeSkill(index)" v-if="resumeData.skills.length > 1">×</button>
              </div>
            </div>
            <button type="button" class="add-btn" @click="addSkill">+ 스킬 추가하기</button>
          </div>
        </div>

        <!-- 자격증 및 수상 -->
        <div class="form-section" :class="{ 'expanded': sections.certificates, 'active': sections.certificates }">
          <div class="section-header" @click="toggleSection('certificates')">
            <div class="section-info">
              <h3>자격증 및 수상</h3>
              <span class="section-desc">자격증명, 취득년도, 발급기관 등을 적어주세요</span>
            </div>
            <button class="toggle-btn" :class="{ 'active': sections.certificates }">
              {{ sections.certificates ? '×' : '+' }}
            </button>
          </div>
          
          <div class="section-content" v-show="sections.certificates">
            <div v-for="(cert, index) in resumeData.certificates" :key="index" class="cert-item">
              <div class="form-grid">
                <div class="form-group">
                  <label>자격증명</label>
                  <input 
                    type="text" 
                    v-model="cert.name" 
                    placeholder="정보처리기사"
                  />
                </div>
                <div class="form-group">
                  <label>취득년도</label>
                  <input type="month" v-model="cert.date" />
                </div>
              </div>
              <div class="form-group">
                <label>발급기관</label>
                <input 
                  type="text" 
                  v-model="cert.issuer" 
                  placeholder="한국산업인력공단"
                />
              </div>
              <button class="remove-btn" @click="removeCertificate(index)" v-if="resumeData.certificates.length > 1">삭제</button>
            </div>
            <button type="button" class="add-btn" @click="addCertificate">+ 자격증 추가하기</button>
          </div>
        </div>

        <!-- 자기 소개 -->
        <div class="form-section" :class="{ 'expanded': sections.introduction, 'active': sections.introduction }">
          <div class="section-header" @click="toggleSection('introduction')">
            <div class="section-info">
              <h3>자기 소개</h3>
              <span class="section-desc">경력, 경험, 역량을 보여 주세요</span>
            </div>
            <button class="toggle-btn" :class="{ 'active': sections.introduction }">
              {{ sections.introduction ? '×' : '+' }}
            </button>
          </div>
          
          <div class="section-content" v-show="sections.introduction">
            <div v-for="(intro, index) in resumeData.introductions" :key="index" class="intro-item">
              <div class="form-group">
                <label>제목</label>
                <input 
                  type="text" 
                  v-model="intro.title" 
                  placeholder="자기소개 제목"
                />
              </div>
              <div class="form-group">
                <label>내용</label>
                <textarea 
                  v-model="intro.content" 
                  placeholder="자기소개를 작성하세요"
                  rows="6"
                ></textarea>
              </div>
              <button class="remove-btn" @click="removeIntroduction(index)" v-if="resumeData.introductions.length > 1">삭제</button>
            </div>
            <button type="button" class="add-btn" @click="addIntroduction">+ 자기소개 추가하기</button>
          </div>
        </div>

        <!-- 버튼 그룹 -->
        <div class="action-buttons">
          <button class="preview-btn" @click="previewResume">미리보기</button>
          <button class="save-btn" @click="submitResume">작성 완료</button>
        </div>
      </div>
    </div>

    <!-- AI 코칭 패널 -->
    <div class="ai-coaching-panel" v-if="showAICoaching">
      <!-- AI 헤더 -->
      <div class="ai-header">
        <div class="ai-profile">
          <div class="ai-avatar">🤖</div>
          <div class="ai-info">
            <span class="ai-name">AI 코치</span>
            <span class="ai-desc">컴퓨터공학 프로젝트 출력고</span>
          </div>
        </div>
        <button class="close-btn" @click="toggleAICoaching">×</button>
      </div>

      <!-- AI 상태 -->
      <div class="ai-status">
        <div class="status-indicator">
          <div class="status-icon">🤖</div>
          <span class="status-text">AI 코치 활성화</span>
        </div>
      </div>

      <!-- 스크롤 콘텐츠 -->
      <div class="ai-content">
        <!-- 환영 메시지 -->
        <div class="welcome-section">
          <p>안녕하세요! 이력서 작성을 도와 드릴 AI 코치입니다.</p>
          <p>항상 더 나은 이력서를 만들 수 있도록 도와드리겠습니다.
          궁금한 점이 있으면 언제든지 물어보세요!</p>
        </div>

        <!-- 적성 팁 -->
        <div class="tips-section">
          <div class="section-title">
            <span class="icon">💡</span>
            <span>적성 팁</span>
          </div>
          <div class="tips-content">
            <h4>좋은 이력서를 위한 핵심 포인트</h4>
            <div class="checklist">
              <div class="check-item">
                <span class="check">✅</span>
                <span>구체적인 수치와 성과를 포함하세요.</span>
              </div>
              <div class="check-item">
                <span class="check">✅</span>
                <span>사용한 기술 스택을 명확히 기재하세요.</span>
              </div>
              <div class="check-item">
                <span class="check">✅</span>
                <span>프로젝트의 역할과 기여도를 작성하세요.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 실시간 피드백 -->
        <div class="feedback-section" v-if="aiFeedback.length > 0">
          <div class="section-title">
            <span class="icon">📝</span>
            <span>실시간 피드백</span>
          </div>
          <div class="feedback-list">
            <div v-for="(feedback, index) in aiFeedback" :key="index" class="feedback-item">
              <span class="feedback-icon">{{ getFeedbackIcon(feedback.type) }}</span>
              <span class="feedback-text">{{ feedback.message }}</span>
            </div>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="ai-actions">
          <button class="ai-action-btn" @click="askAI">
            💬 AI에게 질문하기
          </button>
          <button class="ai-action-btn" @click="getDetailedAnalysis">
            📋 상세한 분석받기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/sidebar/SideBar.vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// AI 코칭 패널 표시 상태
const showAICoaching = ref(true)

// 섹션 확장 상태
const sections = reactive({
  basic: true,
  education: false,
  skills: false,
  certificates: false,
  introduction: false
})

// AI 피드백
const aiFeedback = ref([])

// 이력서 데이터
const resumeData = reactive({
  name: '',
  phone: '',
  email: '',
  github: '',
  educations: [
    {
      school: '',
      major: '',
      startDate: '',
      endDate: ''
    }
  ],
  skills: [
    { name: '' }
  ],
  certificates: [
    {
      name: '',
      date: '',
      issuer: ''
    }
  ],
  introductions: [
    {
      title: '',
      content: ''
    }
  ]
})

// 섹션 토글
const toggleSection = (section) => {
  sections[section] = !sections[section]
}

// 입력 변화 감지
const onInputChange = async (field, value) => {
  console.log(`${field} 변경됨:`, value)
  await requestRealtimeCoaching(field, value)
}

// 실시간 AI 코칭 요청
const requestRealtimeCoaching = async (field, value) => {
  try {
    const response = await fetch('http://localhost:8081/api/resume/coaching/realtime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        field: field,
        value: value,
        resumeData: resumeData
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('실시간 코칭 결과:', result)
      
      if (result.feedback) {
        aiFeedback.value.unshift({
          type: result.type || 'tip',
          message: result.feedback,
          timestamp: new Date()
        })
        
        if (aiFeedback.value.length > 5) {
          aiFeedback.value.pop()
        }
      }
    }
  } catch (error) {
    console.error('실시간 코칭 요청 실패:', error)
  }
}

// 피드백 아이콘 반환
const getFeedbackIcon = (type) => {
  switch (type) {
    case 'positive': return '👍'
    case 'warning': return '⚠️'
    default: return '💡'
  }
}

// 교육사항 관련
const addEducation = () => {
  resumeData.educations.push({
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  })
}

const removeEducation = (index) => {
  if (resumeData.educations.length > 1) {
    resumeData.educations.splice(index, 1)
  }
}

// 스킬 관련
const addSkill = () => {
  resumeData.skills.push({ name: '' })
}

const removeSkill = (index) => {
  if (resumeData.skills.length > 1) {
    resumeData.skills.splice(index, 1)
  }
}

// 자격증 관련
const addCertificate = () => {
  resumeData.certificates.push({
    name: '',
    date: '',
    issuer: ''
  })
}

const removeCertificate = (index) => {
  if (resumeData.certificates.length > 1) {
    resumeData.certificates.splice(index, 1)
  }
}

// 자기소개 관련
const addIntroduction = () => {
  resumeData.introductions.push({
    title: '',
    content: ''
  })
}

const removeIntroduction = (index) => {
  if (resumeData.introductions.length > 1) {
    resumeData.introductions.splice(index, 1)
  }
}

// AI 코칭 패널 토글
const toggleAICoaching = () => {
  showAICoaching.value = !showAICoaching.value
}

// AI에게 질문하기
const askAI = async () => {
  const question = prompt('AI 코치에게 질문하세요:')
  if (question) {
    try {
      const response = await fetch('http://localhost:8081/api/resume/coaching/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question,
          resumeData: resumeData
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        alert(`AI 코치 답변: ${result.answer}`)
      }
    } catch (error) {
      console.error('AI 질문 요청 실패:', error)
    }
  }
}

// 상세한 분석받기
const getDetailedAnalysis = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/resume/coaching/detailed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resumeData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('상세 분석 결과:', result)
    }
  } catch (error) {
    console.error('상세 분석 요청 실패:', error)
  }
}

// 이력서 미리보기
const previewResume = () => {
  console.log('이력서 미리보기:', resumeData)
}

// 이력서 저장
const submitResume = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resumeData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('이력서 저장 성공:', result)
      alert('이력서가 성공적으로 저장되었습니다!')
      router.push('/resume')
    } else {
      alert('이력서 저장에 실패했습니다.')
    }
  } catch (error) {
    console.error('이력서 저장 실패:', error)
    alert('이력서 저장 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  console.log('ResumeWrite 컴포넌트가 마운트되었습니다.')
})
</script>

<style scoped>
/* 전체 앱 컨테이너 */
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #EFF0F1;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 사이드바 */
.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  padding: 20px 0;
}

.sidebar-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.sidebar-menu {
  padding-top: 20px;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #f8f9fa;
  color: #333;
}

.menu-item.active {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

/* 메인 컨테이너 */
.main-container {
  flex: 1;
  padding: 0 20px 0 40px;
  max-width: calc(100vw - 200px - 400px); /* 사이드바와 AI패널 제외 */
}



/* 폼 컨테이너 */
.resume-form-container {
  background: #EAEBEC;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  border-color: #a8a6a6;
}

.form-header h1 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.form-header p {
  margin: 0 0 40px 0;
  color: #666;
  line-height: 1.6;
}

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

.section-header {
  padding: 20px 24px;
  background: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.form-section.active .section-header {
  background: #f0fdf4;
}

.section-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-desc {
  font-size: 13px;
  color: #999;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background: #fff;
  color: #666;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: #71EBBE;
  border-color: #71EBBE;
  color: white;
}

.section-content {
  padding: 24px;
  background: #fff;
}

.form-section.active .section-content {
  background: #fefffe;
}

/* 폼 그리드 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #71EBBE;
  box-shadow: 0 0 0 3px rgba(113, 235, 190, 0.1);
}

/* 스킬 그리드 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-item input {
  flex: 1;
  padding: 10px 12px;
}

.remove-skill-btn {
  width: 24px;
  height: 24px;
  background: #ff6b6b;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 개별 아이템 */
.education-item,
.cert-item,
.intro-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.add-btn {
  background: #f8f9fa;
  border: 1px dashed #ddd;
  color: #666;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #71EBBE;
  color: white;
  border-color: #71EBBE;
}

/* 액션 버튼 */
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
  border: none;
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
  background: #71EBBE;
  color: white;
}

.preview-btn:hover {
  background: #f0f0f0;
}

.save-btn:hover {
  background: #5dd4a3;
  transform: translateY(-1px);
}

/* AI 코칭 패널 */
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
}

/* AI 헤더 */
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

/* AI 상태 */
.ai-status {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.status-icon {
  font-size: 14px;
}

.status-text {
  font-size: 12px;
  color: #666;
}

/* AI 콘텐츠 */
.ai-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.welcome-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
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

/* 팁 섹션 */
.tips-section {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 13px;
  color: #166534;
}

.icon {
  font-size: 14px;
}

.tips-content h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #166534;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  line-height: 1.4;
  color: #166534;
}

.check {
  font-size: 12px;
  margin-top: 1px;
}

/* 피드백 섹션 */
.feedback-section {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feedback-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.feedback-icon {
  font-size: 14px;
  margin-top: 1px;
}

.feedback-text {
  font-size: 12px;
  line-height: 1.4;
  color: #333;
}

/* AI 액션 버튼 */
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
  
  .main-container {
    max-width: calc(100vw - 200px);
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .main-container {
    max-width: 100%;
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>