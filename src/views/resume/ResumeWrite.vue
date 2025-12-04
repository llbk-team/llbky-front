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

        <!-- 저장된 키워드 -->
        <div class="keyword-box">
          <p class="keyword-title">저장된 키워드 반영하기</p>

          <div v-if="savedKeywords && savedKeywords.length > 0">
            <div v-for="(k, i) in savedKeywords" :key="i" class="form-check mb-1">
              <input type="checkbox" class="form-check-input" :id="'kw' + i" v-model="selectedKeywords" :value="k" />
              <label class="form-check-label" :for="'kw' + i">{{ k }}</label>
            </div>
          </div>

          <p v-else class="text-muted small">저장된 키워드가 없습니다.</p>
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
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <p>이력서를 저장하고 있습니다...</p>
      <p class="sub">AI 분석이 자동으로 실행돼요!</p>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/sidebar/SideBar.vue'
import resumeWrite from '@/utils/resumeWrite'

const {
  sections,
  aiFeedback,
  aiLoading,
  saveLoading,
  resumeData,
  savedKeywords,
  selectedKeywords,
  loadSavedKeywords,

  toggleSection,
  onInputChange,
  onCareerInputChange,
  onCareerCurrentChange,

  addEducation,
  removeEducation,
  addCareer,
  removeCareer,
  addActivity,
  removeActivity,
  addSkill,
  removeSkill,
  addCertificate,
  removeCertificate,

  getSectionLabel,
  getSectionFeedback,
  applyImprovedToResume,
  submitResume
} = resumeWrite.useResumeWrite();
</script>

<style src="@/assets/css/resumeWrite.css"></style>