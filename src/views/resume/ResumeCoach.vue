<template>
  <div class="page-wrapper">
    <div class="main-layout">
      <section class="content">
        <h1 class="title">서류 AI 코칭</h1>

        <!-- 로딩/에러 -->
        <div v-if="loading" class="alert alert-secondary py-2 mb-3">
          이력서와 AI 분석 결과를 불러오는 중입니다...
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-3">
          {{ error }}
        </div>

        <div class="resume-layout" v-if="resume">
          
          <!-- 2단 레이아웃: 왼쪽(이력서+리포트) / 오른쪽(AI 제안) -->
          <div class="two-column-layout">

            <!-- ⬅ 왼쪽 컬럼: 이력서 상세 + AI 상세 리포트 -->
            <div class="left-column">
              
              <!-- 이력서 상세 카드 -->
              <div class="resume-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h2>📄 이력서 상세</h2>
                  <span class="badge bg-mint">{{ formatLabel }}</span>
                </div>

                <!-- 기본 정보 -->
                <div class="section mb-4">
                  <div class="section-header">
                    <h3>기본 정보</h3>
                  </div>
                  
                  <div v-if="!isEditMode">
                    <p><strong>제목:</strong> {{ resume.title || '제목 없음' }}</p>
                    <p><strong>회원 ID:</strong> {{ resume.memberId || '-' }}</p>
                  </div>
                  
                  <div v-else class="edit-form">
                    <div class="form-group">
                      <label>이력서 제목</label>
                      <input type="text" v-model="editData.title" class="form-control"/>
                    </div>
                  </div>
                </div>

                <!-- 🔥 경력 사항 - 데이터가 있거나 수정모드일 때 표시 -->
                <div class="section mb-4" v-if="hasCareer || isEditMode">
                  <div class="section-header">
                    <h3>경력 사항</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-for="(career, index) in careers" :key="index" class="career-item">
                      <p><strong>{{ career.company || '회사명 없음' }} | {{ career.position || '직무 없음' }}</strong></p>
                      <p class="text-muted">{{ formatPeriod(career.startDate, career.endDate, career.isCurrent) }}</p>
                      <p v-if="career.responsibilities">{{ career.responsibilities }}</p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span>경력 목록</span>
                      <button class="btn btn-sm btn-success" @click="addCareer">+ 경력 추가</button>
                    </div>
                    
                    <div v-for="(career, index) in editData.careers" :key="index" class="career-edit-item">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>경력 {{ index + 1 }}</h5>
                        <button v-if="editData.careers.length > 1" @click="removeCareer(index)" 
                                class="btn btn-sm btn-outline-danger">삭제</button>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <label>회사명</label>
                          <input type="text" v-model="career.company" class="form-control"/>
                        </div>
                        <div class="col-md-6">
                          <label>직무</label>
                          <input type="text" v-model="career.position" class="form-control"/>
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-md-6">
                          <label>시작일</label>
                          <input type="month" v-model="career.startDate" class="form-control"/>
                        </div>
                        <div class="col-md-6">
                          <label>종료일</label>
                          <input type="month" v-model="career.endDate" class="form-control" 
                                 :disabled="career.isCurrent"/>
                          <div class="form-check mt-1">
                            <input type="checkbox" v-model="career.isCurrent" class="form-check-input"/>
                            <label class="form-check-label">현재 재직중</label>
                          </div>
                        </div>
                      </div>
                      <div class="mt-2">
                        <label>담당업무</label>
                        <textarea v-model="career.responsibilities" class="form-control" rows="3"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 🔥 교육 사항 - 데이터가 있거나 수정모드일 때 표시 -->
                <div class="section mb-4" v-if="hasEducation || isEditMode">
                  <div class="section-header">
                    <h3>교육 사항</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-for="(edu, index) in educations" :key="index" class="education-item">
                      <p><strong>{{ edu.school || '학교명 없음' }}</strong></p>
                      <p>{{ edu.major || '전공 없음' }}</p>
                      <p class="text-muted">{{ formatPeriod(edu.startDate, edu.endDate) }}</p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span>교육 목록</span>
                      <button class="btn btn-sm btn-success" @click="addEducation">+ 교육 추가</button>
                    </div>
                    
                    <div v-for="(edu, index) in editData.educations" :key="index" class="education-edit-item">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>교육 {{ index + 1 }}</h5>
                        <button v-if="editData.educations.length > 1" @click="removeEducation(index)" 
                                class="btn btn-sm btn-outline-danger">삭제</button>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <label>학교명</label>
                          <input type="text" v-model="edu.school" class="form-control"/>
                        </div>
                        <div class="col-md-6">
                          <label>전공</label>
                          <input type="text" v-model="edu.major" class="form-control"/>
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-md-6">
                          <label>입학일</label>
                          <input type="month" v-model="edu.startDate" class="form-control"/>
                        </div>
                        <div class="col-md-6">
                          <label>졸업일</label>
                          <input type="month" v-model="edu.endDate" class="form-control"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 🔥 기술 스택 - 데이터가 있거나 수정모드일 때 표시 -->
                <div class="section mb-4" v-if="hasSkills || isEditMode">
                  <div class="section-header">
                    <h3>기술 스택</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <p>{{ skillsText || '기술 스택 없음' }}</p>
                  </div>

                  <div v-else class="edit-form">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span>기술 스택 목록</span>
                      <button class="btn btn-sm btn-success" @click="addSkill">+ 스킬 추가</button>
                    </div>
                    
                    <div class="skills-edit">
                      <div v-for="(skill, index) in editData.skills" :key="index" class="skill-edit-item">
                        <div class="input-group mb-2">
                          <input type="text" v-model="skill.name" class="form-control" placeholder="기술명"/>
                          <button v-if="editData.skills.length > 1" @click="removeSkill(index)" 
                                  class="btn btn-outline-danger btn-sm">×</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 🔥 활동 사항 - 데이터가 있거나 수정모드일 때 표시 -->
                <div class="section mb-4" v-if="hasActivities || isEditMode">
                  <div class="section-header">
                    <h3>활동 사항</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-for="(activity, index) in activities" :key="index" class="activity-item">
                      <p><strong>{{ activity.name || '활동명 없음' }}</strong></p>
                      <p>{{ activity.organization || '기관 없음' }}</p>
                      <p class="text-muted">{{ formatPeriod(activity.startDate, activity.endDate) }}</p>
                      <p v-if="activity.description">{{ activity.description }}</p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span>활동 목록</span>
                      <button class="btn btn-sm btn-success" @click="addActivity">+ 활동 추가</button>
                    </div>
                    
                    <div v-for="(activity, index) in editData.activities" :key="index" class="activity-edit-item">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>활동 {{ index + 1 }}</h5>
                        <button v-if="editData.activities.length > 1" @click="removeActivity(index)" 
                                class="btn btn-sm btn-outline-danger">삭제</button>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <label>활동명</label>
                          <input type="text" v-model="activity.name" class="form-control"/>
                        </div>
                        <div class="col-md-6">
                          <label>기관/단체</label>
                          <input type="text" v-model="activity.organization" class="form-control"/>
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-md-6">
                          <label>시작일</label>
                          <input type="month" v-model="activity.startDate" class="form-control"/>
                        </div>
                        <div class="col-md-6">
                          <label>종료일</label>
                          <input type="month" v-model="activity.endDate" class="form-control"/>
                        </div>
                      </div>
                      <div class="mt-2">
                        <label>활동 내용</label>
                        <textarea v-model="activity.description" class="form-control" rows="3"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 🔥 자격증 - 데이터가 있거나 수정모드일 때 표시 -->
                <div class="section mb-4" v-if="hasCertificates || isEditMode">
                  <div class="section-header">
                    <h3>자격증</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-for="(cert, index) in certificates" :key="index" class="cert-item">
                      <p><strong>{{ cert.name || '자격증명 없음' }}</strong></p>
                      <p>{{ cert.issuer || '발급기관 없음' }} | {{ cert.date || '취득일 없음' }}</p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span>자격증 목록</span>
                      <button class="btn btn-sm btn-success" @click="addCertificate">+ 자격증 추가</button>
                    </div>
                    
                    <div v-for="(cert, index) in editData.certificates" :key="index" class="cert-edit-item">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>자격증 {{ index + 1 }}</h5>
                        <button v-if="editData.certificates.length > 1" @click="removeCertificate(index)" 
                                class="btn btn-sm btn-outline-danger">삭제</button>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-4">
                          <label>자격증명</label>
                          <input type="text" v-model="cert.name" class="form-control"/>
                        </div>
                        <div class="col-md-4">
                          <label>발급기관</label>
                          <input type="text" v-model="cert.issuer" class="form-control"/>
                        </div>
                        <div class="col-md-4">
                          <label>취득일</label>
                          <input type="month" v-model="cert.date" class="form-control"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 🔥 섹션 추가 버튼 영역 (조회모드에서 데이터가 없는 섹션만 표시) -->
                <div v-if="!isEditMode && emptySections.length > 0" class="add-section-area">
                  <button 
                    v-if="!hasCareer"
                    @click="addSection('career')"
                    class="add-section-btn">
                    경력사항
                  </button>
                  <button 
                    v-if="!hasEducation"
                    @click="addSection('education')"
                    class="add-section-btn">
                    교육사항
                  </button>
                  <button 
                    v-if="!hasSkills"
                    @click="addSection('skills')"
                    class="add-section-btn">
                    기술스택
                  </button>
                  <button 
                    v-if="!hasActivities"
                    @click="addSection('activities')"
                    class="add-section-btn">
                    활동사항
                  </button>
                  <button 
                    v-if="!hasCertificates"
                    @click="addSection('certificates')"
                    class="add-section-btn">
                    자격증
                  </button>
                </div>

                <!-- ⭐ 하단 통합 수정하기 버튼 -->
                <div class="bottom-action-area">
                  <button 
                    @click="toggleEditMode" 
                    class="btn btn-edit-toggle"
                    :class="{ 'btn-save': isEditMode }">
                    {{ isEditMode ? '저장하기' : '수정하기' }}
                  </button>
                </div>

              </div>

              <!-- AI 상세 리포트 (왼쪽 컬럼 하단) -->
              <div class="ai-report-card">
                <div class="report-header">
                  <h2>🧠 AI 코칭 결과</h2>
                </div>

                <!-- 점수 표시 -->
                <div class="score-badges" v-if="score">
                  <span class="score-badge">
                    <strong>경력 기술</strong> {{ score.careerScore }}%
                  </span>
                  <span class="score-badge">
                    <strong>적합도</strong> {{ score.matchScore }}%
                  </span>
                  <span class="score-badge">
                    <strong>완성도</strong> {{ score.completionScore }}%
                  </span>
                </div>

                <!-- 강점 -->
                <div class="feedback-box strengths-box">
                  <h3>강점</h3>
                  <ul v-if="strengths.length">
                    <li v-for="(s, idx) in strengths" :key="idx">{{ s }}</li>
                  </ul>
                  <p v-else class="text-muted">강점 정보가 없습니다.</p>
                </div>

                <!-- 개선 사항 -->
                <div class="feedback-box improvements-box">
                  <h3>개선 사항</h3>
                  <ul v-if="weaknesses.length">
                    <li v-for="(w, idx) in weaknesses" :key="idx">{{ w }}</li>
                  </ul>
                  <p v-else class="text-muted">개선 사항이 없습니다.</p>
                </div>

                <!-- 이력서 형식 선택 -->
                <div class="format-selection-section">
                  <h3 class="format-title">이력서 형식 선택</h3>
                  <p class="format-subtitle">원하는 형식을 선택하면 화면에서 바로 확인할 수 있습니다.</p>

                  <div class="format-buttons">
                    <button 
                      class="format-btn"
                      :class="{ active: resumeFormat === 'default' }"
                      @click="setFormat('default')">
                      기본 형식
                    </button>

                    <button 
                      class="format-btn"
                      :class="{ active: resumeFormat === 'text' }"
                      @click="openModal('text')">
                      줄글 형식 이력서
                    </button>

                    <button 
                      class="format-btn"
                      :class="{ active: resumeFormat === 'standard' }"
                      @click="openModal('standard')">
                      표준 양식 이력서
                    </button>
                  </div>

                  <div class="report-action">
                    <button class="btn-report-list" @click="$router.push('/resume/list')">
                      리포트 목록으로
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- ➡ 오른쪽 컬럼: AI 제안 (Sticky) -->
            <div class="right-column">
              <div class="ai-card">
                <h2>✏️ AI 제안</h2>
                <p class="edit-label">자소서 · 포트폴리오 맞춤 제안</p>

                <div class="before">
                  <strong>자소서 강조 포인트</strong><br>
                  <span v-if="coverLetterMain">{{ coverLetterMain }}</span>
                  <span v-else class="text-muted">데이터 없음</span>
                </div>

                <div class="after">
                  <strong>포트폴리오 추가 제안</strong><br>
                  <span v-if="portfolioMain">{{ portfolioMain }}</span>
                  <span v-else class="text-muted">데이터 없음</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>
    </div>

    <!-- 모달들 -->
    <div class="modal fade" id="textFormatModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">📝 줄글 형식 이력서 샘플</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img src="/images/text-format-resume.png" class="img-fluid" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button class="btn btn-mint" @click="applyTextFormat">적용하기</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="standardFormatModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">📋 규격화된 이력서 샘플</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img src="/images/standard-format-resume.png" class="img-fluid" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button class="btn btn-mint" @click="applyStandardFormat">적용하기</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from 'bootstrap';
import resumeApi from '@/apis/resume';

//--------------------------------------
// URL에서 resumeId 가져오기
//--------------------------------------
const route = useRoute();
const resumeId = computed(() => route.query.id);

//--------------------------------------
// 상태 관리
//--------------------------------------
const resume = ref(null);
const report = ref(null);
const resumeFormat = ref('default');
const loading = ref(false);
const error = ref('');
const saving = ref(false);

// 통합 수정 모드
const isEditMode = ref(false);

// 수정 데이터
const editData = reactive({
  title: '',
  careers: [],
  educations: [],
  skills: [],
  activities: [],
  certificates: []
});

//--------------------------------------
// JSON Safe Parse
//--------------------------------------
const safeParse = (json, fallback) => {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch (err) {
    console.error('JSON 파싱 실패:', json);
    return fallback;
  }
};

//--------------------------------------
// 이력서 정보 파싱
//--------------------------------------
const careers = computed(() => safeParse(resume.value?.careerInfo, []));
const skillsRaw = computed(() => safeParse(resume.value?.skills, []));
const activities = computed(() => safeParse(resume.value?.activities, []));
const educations = computed(() => safeParse(resume.value?.educationInfo, []));
const certificates = computed(() => safeParse(resume.value?.certificates, []));

const skillsText = computed(() => {
  if (!skillsRaw.value?.length) return '';
  return typeof skillsRaw.value[0] === 'string'
    ? skillsRaw.value.join(', ')
    : skillsRaw.value.map((s) => s.name).join(', ');
});

//--------------------------------------
// 섹션 데이터 존재 여부 확인
//--------------------------------------
const hasCareer = computed(() => careers.value && careers.value.length > 0);
const hasEducation = computed(() => educations.value && educations.value.length > 0);
const hasSkills = computed(() => skillsRaw.value && skillsRaw.value.length > 0);
const hasActivities = computed(() => activities.value && activities.value.length > 0);
const hasCertificates = computed(() => certificates.value && certificates.value.length > 0);

// 데이터가 없는 섹션들
const emptySections = computed(() => {
  const empty = [];
  if (!hasCareer.value) empty.push('career');
  if (!hasEducation.value) empty.push('education');
  if (!hasSkills.value) empty.push('skills');
  if (!hasActivities.value) empty.push('activities');
  if (!hasCertificates.value) empty.push('certificates');
  return empty;
});

//--------------------------------------
// AI 분석 데이터
//--------------------------------------
const score = computed(() => report.value?.score || {
  careerScore: 85,
  matchScore: 78,
  completionScore: 92
});
const strengths = computed(() => report.value?.strengths || [
  '구체적인 기술 스택이 잘 명시되어 있습니다',
  '프로젝트 경험이 다양합니다'
]);
const weaknesses = computed(() => report.value?.weaknesses || [
  '성과 수치가 부족합니다',
  '리더십 경험을 더 강조해보세요'
]);
const portfolioMain = computed(() => report.value?.portfolioSuggestions?.[0] || '머신러닝 프로젝트 포트폴리오를 추가해보세요');
const coverLetterMain = computed(() => report.value?.coverLetterSuggestions?.[0] || 'AI 기술 관련 경험을 자소서에서 강조하세요');

//--------------------------------------
// UI 라벨
//--------------------------------------
const formatLabel = computed(() => {
  switch (resumeFormat.value) {
    case 'text': return '줄글 형식';
    case 'standard': return '규격화된 형식';
    default: return '기본 형식';
  }
});

//--------------------------------------
// 🔥 섹션 추가 (조회모드에서 버튼 클릭 시)
//--------------------------------------
const addSection = (sectionType) => {
  // 수정 모드로 전환
  isEditMode.value = true;
  initializeEditData();
  
  // 해당 섹션에 기본 데이터 추가
  switch(sectionType) {
    case 'career':
      if (editData.careers.length === 0) {
        editData.careers.push({
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          responsibilities: '',
          isCurrent: false
        });
      }
      break;
    case 'education':
      if (editData.educations.length === 0) {
        editData.educations.push({
          school: '',
          major: '',
          startDate: '',
          endDate: ''
        });
      }
      break;
    case 'skills':
      if (editData.skills.length === 0) {
        editData.skills.push({ name: '' });
      }
      break;
    case 'activities':
      if (editData.activities.length === 0) {
        editData.activities.push({
          name: '',
          organization: '',
          startDate: '',
          endDate: '',
          description: ''
        });
      }
      break;
    case 'certificates':
      if (editData.certificates.length === 0) {
        editData.certificates.push({
          name: '',
          issuer: '',
          date: ''
        });
      }
      break;
  }
};

//--------------------------------------
// 통합 수정 모드 토글
//--------------------------------------
const toggleEditMode = async () => {
  if (isEditMode.value) {
    // 저장 모드
    await saveChanges();
  } else {
    // 수정 모드 진입
    isEditMode.value = true;
    initializeEditData();
  }
};

//--------------------------------------
// 데이터 로드
//--------------------------------------
const loadData = async () => {
  if (!resumeId.value) {
    error.value = '이력서 ID가 없습니다.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    console.log('🔍 이력서 ID:', resumeId.value);
    
    const { data: resumeData } = await resumeApi.find(resumeId.value);
    resume.value = resumeData;
    console.log('✅ 이력서 데이터:', resumeData);

    try {
      const { data: reportData } = await resumeApi.analyze(1, resumeId.value);
      report.value = reportData;
      console.log('✅ 리포트 데이터:', reportData);
    } catch (e) {
      console.warn('⚠️ AI 리포트 없음:', e);
      report.value = null;
    }

    initializeEditData();

  } catch (err) {
    error.value = '이력서를 불러오는 중 오류가 발생했습니다.';
    console.error('❌ 이력서 로드 실패:', err);
  } finally {
    loading.value = false;
  }
};

//--------------------------------------
// 수정 데이터 초기화
//--------------------------------------
const initializeEditData = () => {
  if (!resume.value) return;

  editData.title = resume.value.title || '';
  
  // 기존 데이터가 있으면 복사, 없으면 빈 배열
  editData.careers = careers.value.length > 0 
    ? JSON.parse(JSON.stringify(careers.value))
    : [];
      
  editData.educations = educations.value.length > 0
    ? JSON.parse(JSON.stringify(educations.value))
    : [];
      
  editData.skills = skillsRaw.value.length > 0
    ? JSON.parse(JSON.stringify(skillsRaw.value))
    : [];
    
  editData.activities = activities.value.length > 0
    ? JSON.parse(JSON.stringify(activities.value))
    : [];
      
  editData.certificates = certificates.value.length > 0
    ? JSON.parse(JSON.stringify(certificates.value))
    : [];

  console.log('🔄 Edit data 초기화:', editData);
};

//--------------------------------------
// 저장
//--------------------------------------
const saveChanges = async () => {
  try {
    saving.value = true;
    
    const updatedResume = {
      ...resume.value,
      title: editData.title,
      careerInfo: JSON.stringify(editData.careers),
      educationInfo: JSON.stringify(editData.educations),
      skills: JSON.stringify(editData.skills),
      activities: JSON.stringify(editData.activities),
      certificates: JSON.stringify(editData.certificates)
    };

    console.log('💾 업데이트할 데이터:', updatedResume);

    // TODO: API 호출
    // await resumeApi.update(resumeId.value, updatedResume);
    
    resume.value = updatedResume;
    isEditMode.value = false;
    
    alert('변경사항이 저장되었습니다!');
    
  } catch (err) {
    console.error('❌ 저장 실패:', err);
    alert('저장 중 오류가 발생했습니다.');
  } finally {
    saving.value = false;
  }
};

//--------------------------------------
// 배열 조작
//--------------------------------------
const addCareer = () => {
  editData.careers.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    isCurrent: false
  });
};

const removeCareer = (index) => {
  if (editData.careers.length > 1) {
    editData.careers.splice(index, 1);
  }
};

const addEducation = () => {
  editData.educations.push({
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  });
};

const removeEducation = (index) => {
  if (editData.educations.length > 1) {
    editData.educations.splice(index, 1);
  }
};

const addSkill = () => {
  editData.skills.push({ name: '' });
};

const removeSkill = (index) => {
  if (editData.skills.length > 1) {
    editData.skills.splice(index, 1);
  }
};

const addActivity = () => {
  editData.activities.push({
    name: '',
    organization: '',
    startDate: '',
    endDate: '',
    description: ''
  });
};

const removeActivity = (index) => {
  if (editData.activities.length > 1) {
    editData.activities.splice(index, 1);
  }
};

const addCertificate = () => {
  editData.certificates.push({
    name: '',
    issuer: '',
    date: ''
  });
};

const removeCertificate = (index) => {
  if (editData.certificates.length > 1) {
    editData.certificates.splice(index, 1);
  }
};

//--------------------------------------
// 유틸리티
//--------------------------------------
const formatPeriod = (startDate, endDate, isCurrent = false) => {
  if (!startDate) return '';
  
  if (isCurrent) {
    return `${startDate} ~ 현재`;
  }
  
  if (!endDate) return startDate;
  
  return `${startDate} ~ ${endDate}`;
};

//--------------------------------------
// 이력서 형식
//--------------------------------------
const setFormat = (format) => {
  resumeFormat.value = format;
};

//--------------------------------------
// 모달
//--------------------------------------
let textModal = null;
let standardModal = null;

const openModal = (type) => {
  if (type === 'text') {
    const el = document.getElementById('textFormatModal');
    textModal = Modal.getOrCreateInstance(el);
    textModal.show();
  } else {
    const el = document.getElementById('standardFormatModal');
    standardModal = Modal.getOrCreateInstance(el);
    standardModal.show();
  }
};

const applyTextFormat = () => {
  resumeFormat.value = 'text';
  if (textModal) textModal.hide();
};

const applyStandardFormat = () => {
  resumeFormat.value = 'standard';
  if (standardModal) standardModal.hide();
};

//--------------------------------------
// 마운트
//--------------------------------------
onMounted(() => {
  console.log('🚀 ResumeCoach 마운트');
  loadData();
});
</script>

<style scoped>
/* 기존 스타일 유지 */
.page-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
}

.main-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.content {
  width: 100%;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

.resume-layout {
  width: 100%;
}

.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.right-column {
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.resume-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.resume-card h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

/* 🔥 섹션 추가 버튼 영역 */
.add-section-area {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.add-section-btn {
  background: #71EBBE;
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.add-section-btn:hover {
  background: #5dd4a3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(113, 235, 190, 0.4);
}

/* AI 제안 카드 */
.ai-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.ai-card h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
}

.edit-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}

.before, .after {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.4;
}

.badge.bg-mint {
  background-color: #71EBBE !important;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.section {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.edit-form {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.875rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-control:focus {
  outline: none;
  border-color: #71EBBE;
  box-shadow: 0 0 0 2px rgba(113, 235, 190, 0.2);
}

.career-item, .education-item, .activity-item, .cert-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.career-edit-item, .education-edit-item, .activity-edit-item, .cert-edit-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
}

.skills-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-edit-item .input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 하단 통합 수정 버튼 */
.bottom-action-area {
  display: flex;
  justify-content: center;
  padding: 2rem 0 1rem 0;
  margin-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn-edit-toggle {
  background: #B8F4DD;
  border: none;
  color: #166534;
  padding: 1rem 4rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(113, 235, 190, 0.3);
}

.btn-edit-toggle:hover {
  background: #71EBBE;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(113, 235, 190, 0.4);
}

.btn-edit-toggle.btn-save {
  background: #71EBBE;
  color: white;
}

.btn-edit-toggle.btn-save:hover {
  background: #5dd4a3;
}

/* AI 리포트 카드 */
.ai-report-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 2rem;
}

.report-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

.score-badges {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.score-badge {
  background: white;
  border: 1px solid #e9ecef;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #555;
  white-space: nowrap;
}

.score-badge strong {
  color: #333;
  margin-right: 0.5rem;
}

.feedback-box {
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.feedback-box h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.feedback-box ul {
  margin: 0;
  padding-left: 1.5rem;
}

.feedback-box li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #555;
}

.strengths-box {
  background: #E8F9F3;
  border: 1px solid #C1F2E0;
}

.improvements-box {
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
}

.format-selection-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.format-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
}

.format-subtitle {
  font-size: 0.875rem;
  color: #999;
  text-align: center;
  margin-bottom: 2rem;
}

.format-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.format-btn {
  background: #A8E6CF;
  border: none;
  color: #2D6A4F;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
}

.format-btn:hover {
  background: #8FD9B6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 230, 207, 0.4);
}

.format-btn.active {
  background: #52B788;
  color: white;
  box-shadow: 0 4px 12px rgba(82, 183, 136, 0.4);
}

.report-action {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-report-list {
  background: white;
  border: 2px solid #e9ecef;
  color: #666;
  padding: 0.75rem 2.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-report-list:hover {
  border-color: #71EBBE;
  background: #f0fdf4;
  color: #2D6A4F;
}

.btn-mint {
  background: #71EBBE;
  border-color: #71EBBE;
  color: white;
}

.btn-mint:hover {
  background: #5dd4a3;
  border-color: #5dd4a3;
}

.right-column::-webkit-scrollbar {
  width: 6px;
}

.right-column::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.right-column::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.right-column::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 1200px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
  
  /* 🔥 sticky 유지하려면 아래 주석 처리 */
  /* .right-column {
    position: static;
    max-height: none;
  } */
}

@media (max-width: 768px) {
  .main-layout {
    padding: 1rem;
  }
  
  .resume-card {
    padding: 1rem;
  }
  
  .score-badges {
    flex-direction: column;
  }
  
  .format-buttons {
    flex-direction: column;
  }
  
  .format-btn {
    width: 100%;
  }
  
  .btn-edit-toggle {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }

  .add-section-area {
    flex-direction: column;
  }

  .add-section-btn {
    width: 100%;
  }
}
</style>