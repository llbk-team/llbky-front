<!-- 이력서 작성 페이지 컴포넌트-->
<template>
  <div class="app-container">
    <!-- 사이드바 -->
    <SideBar />

    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <!-- 이력서 작성 폼 -->
      <div class="resume-form-container">
        <div class="form-header">
          <h1>이력서 작성하기</h1>
          <p>
            단순한 정보를 입력하여보면 자동으로 양식에 맞게 내용까지 추천받을 수 있습니다.<br>
            자세한 이력서를 경력의 빛을 낼 수 있도록 작성해보세요.
          </p>
        </div>

        <!-- 이력서 제목 입력 -->
        <div class="title-input-box">
          <label for="resume-title">이력서 제목 *</label>
          <input id="resume-title" type="text" v-model="resumeData.title" placeholder="예: 백엔드 개발자 이력서"
            @input="onInputChange('title', $event.target.value)" />
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
                <input type="text" v-model="resumeData.name" placeholder="이름을 입력하세요"
                  @input="onInputChange('name', $event.target.value)" />
              </div>
              <div class="form-group">
                <label>연락처 *</label>
                <input type="tel" v-model="resumeData.phone" placeholder="010-0000-0000"
                  @input="onInputChange('phone', $event.target.value)" />
              </div>
            </div>
            <div class="form-group mb-4">
              <label>이메일 *</label>
              <input type="email" v-model="resumeData.email" placeholder="example@email.com"
                @input="onInputChange('email', $event.target.value)" />
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
                  <input type="text" v-model="education.school" placeholder="대학교/고등학교"
                    @input="onInputChange('education', resumeData.educations)" />
                </div>
                <div class="form-group">
                  <label>전공/계열</label>
                  <input type="text" v-model="education.major" placeholder="컴퓨터공학과"
                    @input="onInputChange('education', resumeData.educations)" />
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
              <button type="button" class="remove-btn" @click="removeEducation(index)"
                v-if="resumeData.educations.length > 1">
                삭제
              </button>
            </div>
            <button type="button" class="add-btn" @click="addEducation">
              + 교육사항 추가하기
            </button>
          </div>
        </div>

        <!-- 경력 -->
        <div class="form-section" :class="{ 'expanded': sections.career, 'active': sections.career }">
          <div class="section-header" @click="toggleSection('career')">
            <div class="section-info">
              <h3>경력</h3>
              <span class="section-desc">회사 정보, 담당업무</span>
            </div>
            <button class="toggle-btn" :class="{ 'active': sections.career }">
              {{ sections.career ? '×' : '+' }}
            </button>
          </div>

          <div class="section-content" v-show="sections.career">
            <!-- 경력 목록 -->
            <div v-for="(career, index) in resumeData.careers" :key="index" class="career-item">
              <div class="career-header">
                <h4>경력 {{ index + 1 }}</h4>

                <!-- 버튼 영역 -->
                <div class="career-actions">
                  <!-- 피드백 받기 버튼 -->
                  <button class="btn btn-outline-success btn-sm" @click="getSectionFeedback('career', index)">
                    피드백 받기
                  </button>
                  <button v-if="resumeData.careers.length > 1" @click="removeCareer(index)"
                    class="btn btn-danger btn-sm">
                    삭제
                  </button>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>회사명 *</label>
                  <input type="text" v-model="career.company" placeholder="회사명을 입력하세요"
                    @input="onCareerInputChange(index, 'company', $event.target.value)" />
                </div>
                <div class="form-group">
                  <label>직무 *</label>
                  <input type="text" v-model="career.position" placeholder="개발자, 기획자 등"
                    @input="onCareerInputChange(index, 'position', $event.target.value)" />
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>입사년월 *</label>
                  <input type="month" v-model="career.startDate"
                    @input="onCareerInputChange(index, 'startDate', $event.target.value)" />
                </div>
                <div class="form-group">
                  <label>퇴사년월</label>
                  <input type="month" v-model="career.endDate" :disabled="career.isCurrent"
                    @input="onCareerInputChange(index, 'endDate', $event.target.value)" />
                  <div class="form-check mt-2">
                    <input type="checkbox" :id="`current-${index}`" v-model="career.isCurrent"
                      @change="onCareerCurrentChange(index)" class="form-check-input" />
                    <label :for="`current-${index}`" class="form-check-label">
                      현재 재직중
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-group mb-4">
                <label>담당업무</label>
                <textarea v-model="career.responsibilities" placeholder="담당했던 주요 업무를 입력하세요" rows="4"
                  @input="onCareerInputChange(index, 'responsibilities', $event.target.value)"></textarea>
              </div>
            </div>

            <!-- 경력 추가 버튼 -->
            <div class="add-career-btn-container">
              <button @click="addCareer" class="btn btn-outline-primary">
                + 경력 추가
              </button>
            </div>
          </div>
        </div>

        <!-- 활동 -->
        <div class="form-section" :class="{ 'expanded': sections.activities, 'active': sections.activities }">
          <div class="section-header" @click="toggleSection('activities')">
            <div class="section-info">
              <h3>활동</h3>
              <span class="section-desc">대외활동, 동아리, 봉사활동 등을 추가하세요</span>
            </div>
            <button class="toggle-btn" :class="{ 'active': sections.activities }">
              {{ sections.activities ? '×' : '+' }}
            </button>
          </div>

          <div class="section-content" v-show="sections.activities">
            <div v-for="(activity, index) in resumeData.activities" :key="index" class="career-item">
              <!-- 경력과 동일한 HEADER 구조 -->
              <div class="career-header">
                <h4>활동 {{ index + 1 }}</h4>

                <div class="career-actions">
                  <button class="btn btn-outline-success btn-sm" @click="getSectionFeedback('activity', index)">
                    피드백 받기
                  </button>
                  <button v-if="resumeData.activities.length > 1" @click="removeActivity(index)"
                    class="btn btn-danger btn-sm">
                    삭제
                  </button>
                </div>
              </div>

              <!-- 2열 form-grid -->
              <div class="form-grid">
                <div class="form-group">
                  <label>활동명</label>
                  <input type="text" v-model="activity.name" placeholder="예: 대학생 IT 동아리"
                    @input="onInputChange('activities', resumeData.activities)" />
                </div>

                <div class="form-group">
                  <label>기관/단체</label>
                  <input type="text" v-model="activity.organization" placeholder="예: 학교명, 기관명"
                    @input="onInputChange('activities', resumeData.activities)" />
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>시작일</label>
                  <input type="month" v-model="activity.startDate" />
                </div>
                <div class="form-group">
                  <label>종료일</label>
                  <input type="month" v-model="activity.endDate" />
                </div>
              </div>

              <div class="form-group mb-4">
                <label>활동 내용</label>
                <textarea v-model="activity.description" placeholder="활동에서 수행한 주요 역할과 성과를 입력하세요" rows="4"
                  @input="onInputChange('activities', resumeData.activities)"></textarea>
              </div>
            </div>

            <!-- 활동 추가 -->
            <div class="add-career-btn-container">
              <button @click="addActivity" class="btn btn-outline-primary">
                + 활동 추가하기
              </button>
            </div>
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
                <input type="text" v-model="skill.name" placeholder="기술 스택 입력"
                  @input="onInputChange('skills', resumeData.skills)" />
                <button class="remove-skill-btn" @click="removeSkill(index)" v-if="resumeData.skills.length > 1">
                  ×
                </button>
              </div>
            </div>
            <button type="button" class="add-btn" @click="addSkill">
              + 스킬 추가하기
            </button>
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
                  <input type="text" v-model="cert.name" placeholder="정보처리기사" />
                </div>
                <div class="form-group">
                  <label>취득년도</label>
                  <input type="month" v-model="cert.date" />
                </div>
              </div>
              <div class="form-group">
                <label>발급기관</label>
                <input type="text" v-model="cert.issuer" placeholder="한국산업인력공단" />
              </div>
              <button class="remove-btn" @click="removeCertificate(index)" v-if="resumeData.certificates.length > 1">
                삭제
              </button>
            </div>
            <button type="button" class="add-btn" @click="addCertificate">
              + 자격증 추가하기
            </button>
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
    <!-- === AI 코칭 패널 (자소서 UI 그대로 복붙 적용) === -->
    <div class="ai-coaching-panel">

      <!-- 헤더 -->
      <div class="ai-header">
        <div class="ai-profile">
          <div class="ai-avatar">🤖</div>
          <div class="ai-info">
            <span class="ai-name">AI 코치</span>
          </div>
        </div>
      </div>

      <!-- 상태 -->
      <div class="ai-status">
        <div class="status-indicator">
          <div class="status-icon">🤖</div>
          <span class="status-text">AI 코치 활성화</span>
        </div>
      </div>

      <!-- 콘텐츠 -->
      <div class="ai-content">

        <!-- 환영 문구 -->
        <div class="welcome-section">
          <p>안녕하세요! 이력서 작성 코치를 맡고 있는 AI입니다.</p>
          <p>각 항목 입력 후 피드백을 받아 정확도를 높여보세요.</p>
        </div>

        <!-- 팁 -->
        <div class="tips-section">
          <div class="section-title">
            <span class="icon">💡</span>
            <span>좋은 이력서 작성 팁</span>
          </div>
          <div class="checklist">
            <div class="check-item">✅ 구체적 수치와 성과를 포함하세요.</div>
            <div class="check-item">✅ 역할과 기여도를 중심으로 작성하세요.</div>
            <div class="check-item">✅ 사용하는 기술 스택을 명확히 적으세요.</div>
          </div>
        </div>

        <!-- 로딩 -->
        <div class="spinner-container" v-if="aiLoading">
          <div class="spinner"></div>
          <span>AI가 분석 중입니다...</span>
        </div>

        <!-- 🔥 피드백 박스 (자소서 UI 동일) -->
        <div class="ai-feedback-box" v-for="item in aiFeedback" :key="item.timestamp">
          <h4>📝 {{ getSectionLabel(item.section) }} 항목 코칭</h4>

          <p><strong>요약:</strong> {{ item.summary }}</p>
          <p><strong>잘한 점:</strong> {{ item.strengths }}</p>
          <p><strong>개선점:</strong> {{ item.improvements }}</p>

          <div class="improved-box" v-if="item.improvedText">
            <h5>✨ AI 수정본</h5>
            <p>{{ item.improvedText }}</p>

            <button class="btn btn-outline-success btn-sm mt-3" @click="applyImprovedToResume(item)">
              수정본 적용하기
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>

  <!-- 작성 완료 로딩 오버레이 -->
  <div v-if="saveLoading" class="save-loading-overlay">
    <div class="save-loading-box">
      <div class="spinner"></div>
      <p>이력서를 저장하고 있습니다...</p>
      <p class="sub">AI 분석이 자동으로 실행돼요!</p>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/sidebar/SideBar.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import resumeApi from '@/apis/resume'

const router = useRouter()

// 섹션 확장 상태
const sections = reactive({
  basic: true,
  education: false,
  career: false,
  skills: false,
  activities: false,
  certificates: false
})

const aiFeedback = ref([]);

// 로딩 상태
const aiLoading = ref(false)
const saveLoading = ref(false)

// 이력서 데이터
const resumeData = reactive({
  title: '',
  name: '',
  phone: '',
  email: '',
  github: '',
  educations: [{ school: '', major: '', startDate: '', endDate: '' }],
  careers: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      department: '',
      rank: '',
      responsibilities: '',
      isCurrent: false
    }
  ],
  skills: [{ name: '' }],
  activities: [
    {
      name: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ],
  certificates: [{ name: '', date: '', issuer: '' }]
})

// 자소서 스타일의 피드백 리스트
const feedbackList = ref([])

// 섹션 토글
const toggleSection = (section) => {
  sections[section] = !sections[section]
}

// 입력 변경
const onInputChange = (field, value) => {
  resumeData[field] = value
}

const onCareerInputChange = (index, field, value) => {
  resumeData.careers[index][field] = value
}

const onCareerCurrentChange = (index) => {
  if (resumeData.careers[index].isCurrent) {
    resumeData.careers[index].endDate = ''
  }
}

// 경력 추가/삭제
const addCareer = () => {
  resumeData.careers.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    department: '',
    rank: '',
    responsibilities: '',
    isCurrent: false
  })
}

const removeCareer = (index) => {
  if (resumeData.careers.length > 1) {
    resumeData.careers.splice(index, 1)
  }
}

// 활동 추가/삭제
const addActivity = () => {
  resumeData.activities.push({
    name: '',
    organization: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

const removeActivity = (index) => {
  if (resumeData.activities.length > 1) {
    resumeData.activities.splice(index, 1)
  }
}

// 스킬
const addSkill = () => {
  resumeData.skills.push({ name: '' })
}
const removeSkill = (index) => {
  if (resumeData.skills.length > 1) {
    resumeData.skills.splice(index, 1)
  }
}

// 교육
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

// 자격증
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

/* 🔥 섹션 이름 한글 라벨 */
const getSectionLabel = (section) => {
  switch (section) {
    case "career": return "경력";
    case "activity": return "활동";
    case "education": return "교육";
    case "skill": return "스킬";
    default: return "기타";
  }
};

// 특정 섹션 피드백 요청 (자소서 스타일)
const getSectionFeedback = async (section, index) => {
  try {
    let content = ''

    if (section === 'career') {
      content = resumeData.careers[index].responsibilities || ''
    } else if (section === 'activity') {
      content = resumeData.activities[index].description || ''
    }

    if (!content.trim()) {
      alert('내용을 입력해야 AI 피드백을 받을 수 있습니다.')
      return
    }

    aiLoading.value = true

    const payload = {
      memberId: 1,
      section,
      content
    }

    const { data } = await resumeApi.coach(payload)

    aiFeedback.value.unshift({
      section,
      index,
      summary: data.summary,
      strengths: data.strengths,
      improvements: data.improvements,
      improvedText: data.improvedText,
      timestamp: new Date()
    })


    if (feedbackList.value.length > 10) {
      feedbackList.value.pop()
    }
  } catch (err) {
    console.error('AI 코칭 오류:', err)
    alert('AI 피드백을 가져오지 못했습니다.')
  } finally {
    aiLoading.value = false
  }
}

/* 🔥 AI 결과 이력서에 반영 */
const applyImprovedToResume = (item) => {
  if (item.section === "career") {
    resumeData.careers[item.index].responsibilities = item.improvedText;
  }
  if (item.section === "activity") {
    resumeData.activities[item.index].description = item.improvedText;
  }
  alert("AI 수정본을 내용에 적용했습니다!");
};


// 더미 상세 분석
const getDetailedAnalysis = () => {
  alert('키워드 기반 상세 이력서 분석 기능은 준비 중입니다.')
}

// 미리보기
const previewResume = () => {
  console.log('이력서 미리보기:', resumeData)
}

// 저장
const submitResume = async () => {
  try {
    saveLoading.value = true
    const memberId = 1

    const payload = {
      memberId,
      title: resumeData.title,
      careerInfo: JSON.stringify(resumeData.careers),
      educationInfo: JSON.stringify(resumeData.educations),
      skills: JSON.stringify(resumeData.skills),
      certificates: JSON.stringify(resumeData.certificates),
      awards: '[]',
      activities: JSON.stringify(resumeData.activities)
    }

    console.log('📌 전송 payload:', payload)

    const { data: resumeId } = await resumeApi.create(payload)

    alert('이력서가 저장되었습니다!')
    router.push(`/resume/coach?id=${resumeId}`)
  } catch (err) {
    console.error('이력서 저장 실패', err)
    alert('이력서 저장 중 오류가 발생했습니다.')
  } finally {
    saveLoading.value = false
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

}

.career-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
}

.career-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.career-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.career-header h4 {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
}

.add-career-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.form-check {
  display: flex;
  align-items: center;
}

.form-check-input {
  margin-right: 8px;
}

.form-check-label {
  margin: 0;
  cursor: pointer;
  font-size: 0.9rem;
}

textarea {
  resize: vertical;
  min-height: 100px;
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
  padding: 40px;
  max-width: calc(100vw - 200px - 400px);
  /* 사이드바와 AI패널 제외 */
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
  padding: 20px;
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
  border: 1px solid #f0f0f0;
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
.cert-item {
  position: relative;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
}

.cert-item .remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
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

.breadcrumb {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
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

.title-input-box {
  margin: 20px 0 40px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-input-box label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.title-input-box input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.title-input-box input:focus {
  outline: none;
  border-color: #71EBBE;
  box-shadow: 0 0 0 3px rgba(113, 235, 190, 0.1);
}

/* ===== AI 로딩 스피너 스타일 ===== */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 4px solid #e0e0e0;
  border-top-color: #71EBBE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== 작성 완료 로딩 오버레이 ===== */
.save-loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;
}

.save-loading-box {
  background: white;
  padding: 28px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.save-loading-box p {
  margin-top: 12px;
  font-size: 15px;
  font-weight: 600;
}

.save-loading-box .sub {
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}

/* 스피너 */
.spinner {
  width: 40px;
  height: 40px;
  border: 5px solid #e0e0e0;
  border-top-color: #71EBBE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ai-feedback-box / improved-box는 자소서 컴포넌트에서 쓰던 것 복붙 */
.ai-feedback-box {
  background: #f7f7f7;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.ai-feedback-box h4 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

.improved-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 16px 18px;
  border-radius: 8px;
  margin-top: 16px;
}

.improved-box h5 {
  font-size: 14px;
  font-weight: 700;
  color: #166534;
  margin-bottom: 8px;
}

/* ===== 오른쪽 패널 메인 ===== */
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
  font-size: 13px;
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

.ai-avatar {
  font-size: 18px;
}

.ai-name {
  font-weight: 600;
  font-size: 14px;
}

/* 상태 */
.ai-status {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.status-indicator {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 콘텐츠 */
.ai-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 환영 문구 */
.welcome-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* 팁 */
.tips-section {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

/* 피드백 박스 */
.ai-feedback-box {
  background: #f7f7f7;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

/* AI 수정본 */
.improved-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

</style>