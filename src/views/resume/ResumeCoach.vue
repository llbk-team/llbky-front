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

          <div class="two-column-layout">

            <!-- LEFT COLUMN -->
            <div class="left-column">

              <!-- ⭐ 기본 UI -->
              <template v-if="resumeFormat === 'default'">
                <div class="resume-card">

                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>📄 이력서 상세</h2>
                    <span class="badge bg-mint">{{ formatLabel }}</span>
                  </div>

                  <!-- 🔥 섹션 선택 -->
                  <div class="section-tab-area">
                    <button @click="toggleSectionVisible('career')" :class="{ active: showCareer }">경력</button>
                    <button @click="toggleSectionVisible('education')" :class="{ active: showEducation }">교육</button>
                    <button @click="toggleSectionVisible('skills')" :class="{ active: showSkills }">기술스택</button>
                    <button @click="toggleSectionVisible('activities')" :class="{ active: showActivities }">활동</button>
                    <button @click="toggleSectionVisible('certificates')" :class="{ active: showCertificates }">자격증</button>
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
                        <input type="text" v-model="editData.title" class="form-control" />
                      </div>
                    </div>
                  </div>

                  <!-- 경력 -->
                  <div class="section mb-4" v-if="showCareer">
                    <div class="section-header">
                      <h3>경력 사항</h3>
                    </div>

                    <div v-if="!isEditMode">
                      <div v-for="(career, index) in careers" :key="index" class="career-item">
                        <p><strong>{{ career.company }} | {{ career.position }}</strong></p>
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
                            <input type="text" v-model="career.company" class="form-control" />
                          </div>
                          <div class="col-md-6">
                            <label>직무</label>
                            <input type="text" v-model="career.position" class="form-control" />
                          </div>
                        </div>

                        <div class="row mt-2">
                          <div class="col-md-6">
                            <label>시작일</label>
                            <input type="month" v-model="career.startDate" class="form-control" />
                          </div>
                          <div class="col-md-6">
                            <label>종료일</label>
                            <input type="month" v-model="career.endDate" class="form-control"
                                   :disabled="career.isCurrent" />
                            <div class="form-check mt-1">
                              <input type="checkbox" v-model="career.isCurrent" class="form-check-input" />
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

                  <!-- 교육 -->
                  <div class="section mb-4" v-if="showEducation">
                    <div class="section-header">
                      <h3>교육 사항</h3>
                    </div>

                    <div v-if="!isEditMode">
                      <div v-for="(edu, index) in educations" :key="index" class="education-item">
                        <p><strong>{{ edu.school }}</strong></p>
                        <p>{{ edu.major }}</p>
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
                          <button v-if="editData.educations.length > 1"
                                  @click="removeEducation(index)"
                                  class="btn btn-sm btn-outline-danger">삭제</button>
                        </div>

                        <div class="row">
                          <div class="col-md-6">
                            <label>학교명</label>
                            <input type="text" v-model="edu.school" class="form-control" />
                          </div>
                          <div class="col-md-6">
                            <label>전공</label>
                            <input type="text" v-model="edu.major" class="form-control" />
                          </div>
                        </div>

                        <div class="row mt-2">
                          <div class="col-md-6">
                            <label>입학일</label>
                            <input type="month" v-model="edu.startDate" class="form-control" />
                          </div>
                          <div class="col-md-6">
                            <label>졸업일</label>
                            <input type="month" v-model="edu.endDate" class="form-control" />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <!-- 기술 -->
                  <div class="section mb-4" v-if="showSkills">
                    <div class="section-header">
                      <h3>기술 스택</h3>
                    </div>

                    <div v-if="!isEditMode">
                      <p>{{ skillsText }}</p>
                    </div>

                    <div v-else class="edit-form">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <span>기술 스택 목록</span>
                        <button class="btn btn-sm btn-success" @click="addSkill">+ 스킬 추가</button>
                      </div>

                      <div class="skills-edit">
                        <div v-for="(skill, index) in editData.skills" :key="index" class="skill-edit-item">
                          <div class="input-group mb-2">
                            <input type="text" v-model="skill.name" class="form-control" placeholder="기술명" />
                            <button v-if="editData.skills.length > 1"
                                    @click="removeSkill(index)"
                                    class="btn btn-outline-danger btn-sm">×</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 활동 -->
                  <div class="section mb-4" v-if="showActivities">
                    <div class="section-header">
                      <h3>활동 사항</h3>
                    </div>

                    <div v-if="!isEditMode">
                      <div v-for="(activity, index) in activities" :key="index" class="activity-item">
                        <p><strong>{{ activity.name }}</strong></p>
                        <p>{{ activity.organization }}</p>
                        <p class="text-muted">{{ formatPeriod(activity.startDate, activity.endDate) }}</p>
                        <p>{{ activity.description }}</p>
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
                          <button v-if="editData.activities.length > 1"
                                  @click="removeActivity(index)"
                                  class="btn btn-sm btn-outline-danger">삭제</button>
                        </div>

                        <div class="row">
                          <div class="col-md-6">
                            <label>활동명</label>
                            <input type="text" v-model="activity.name" class="form-control" />
                          </div>
                          <div class="col-md-6">
                            <label>기관/단체</label>
                            <input type="text" v-model="activity.organization" class="form-control" />
                          </div>
                        </div>

                        <div class="row mt-2">
                          <div class="col-md-6">
                            <label>시작일</label>
                            <input type="month" v-model="activity.startDate" class="form-control" />
                          </div>
                          <div class="col-md-6">
                            <label>종료일</label>
                            <input type="month" v-model="activity.endDate" class="form-control" />
                          </div>
                        </div>

                        <div class="mt-2">
                          <label>활동 내용</label>
                          <textarea v-model="activity.description" class="form-control" rows="3"></textarea>
                        </div>

                      </div>
                    </div>
                  </div>

                  <!-- 자격증 -->
                  <div class="section mb-4" v-if="showCertificates">
                    <div class="section-header">
                      <h3>자격증</h3>
                    </div>

                    <div v-if="!isEditMode">
                      <div v-for="(cert, index) in certificates" :key="index" class="cert-item">
                        <p><strong>{{ cert.name }}</strong></p>
                        <p>{{ cert.issuer }} | {{ cert.date }}</p>
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
                          <button v-if="editData.certificates.length > 1"
                                  @click="removeCertificate(index)"
                                  class="btn btn-sm btn-outline-danger">삭제</button>
                        </div>

                        <div class="row">
                          <div class="col-md-4">
                            <label>자격증명</label>
                            <input type="text" v-model="cert.name" class="form-control" />
                          </div>
                          <div class="col-md-4">
                            <label>발급기관</label>
                            <input type="text" v-model="cert.issuer" class="form-control" />
                          </div>
                          <div class="col-md-4">
                            <label>취득일</label>
                            <input type="month" v-model="cert.date" class="form-control" />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <!-- 섹션 추가 -->
                  <div v-if="!isEditMode && emptySections.length > 0" class="add-section-area">
                    <button v-if="!hasCareer" @click="addSection('career')" class="add-section-btn">경력사항</button>
                    <button v-if="!hasEducation" @click="addSection('education')" class="add-section-btn">교육사항</button>
                    <button v-if="!hasSkills" @click="addSection('skills')" class="add-section-btn">기술스택</button>
                    <button v-if="!hasActivities" @click="addSection('activities')" class="add-section-btn">활동사항</button>
                    <button v-if="!hasCertificates" @click="addSection('certificates')" class="add-section-btn">자격증</button>
                  </div>

                  <!-- 수정 -->
                  <div class="bottom-action-area">
                    <button @click="toggleEditMode" class="btn btn-edit-toggle" :class="{ 'btn-save': isEditMode }">
                      {{ isEditMode ? '저장하기' : '수정하기' }}
                    </button>
                  </div>

                </div>
              </template>

              <!-- ⭐ 줄글 형식 -->
              <template v-if="resumeFormat === 'text'">
                <div class="c-text-resume">
                  <h2 class="heading">{{ resume.title }}</h2>

                  <div class="block">
                    <h4>■ 경력사항</h4>
                    <div v-for="(c, i) in careers" :key="i" class="text-item">
                      <p class="company">{{ c.company }} | {{ c.position }}</p>
                      <p class="period">{{ formatPeriod(c.startDate, c.endDate, c.isCurrent) }}</p>
                      <p v-if="c.responsibilities">{{ c.responsibilities }}</p>
                    </div>
                  </div>

                  <div class="block">
                    <h4>■ 학력</h4>
                    <div v-for="(e, i) in educations" :key="i" class="text-item">
                      <p class="company">{{ e.school }} ({{ e.major }})</p>
                      <p class="period">{{ e.startDate }} ~ {{ e.endDate }}</p>
                    </div>
                  </div>

                  <div class="block" v-if="skillsText">
                    <h4>■ 보유기술</h4>
                    <p>{{ skillsText }}</p>
                  </div>

                  <div class="block">
                    <h4>■ 활동</h4>
                    <div v-for="(a, i) in activities" :key="i" class="text-item">
                      <p class="company">{{ a.name }}</p>
                      <p class="period">{{ a.startDate }} ~ {{ a.endDate }}</p>
                      <p>{{ a.organization }}</p>
                      <p>{{ a.description }}</p>
                    </div>
                  </div>

                  <div class="block">
                    <h4>■ 자격증</h4>
                    <div v-for="(cert, i) in certificates" :key="i" class="text-item">
                      <p class="company">{{ cert.name }} - {{ cert.issuer }}</p>
                      <p class="period">{{ cert.date }}</p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ⭐ 표준 양식 -->
              <template v-if="resumeFormat === 'standard'">
                <div class="c-standard-resume">
                  <h2 class="section-title">📋 표준 양식 이력서</h2>

                  <table class="resume-table">
                    <tr>
                      <th>이력서 제목</th>
                      <td>{{ resume.title }}</td>
                    </tr>

                    <tr>
                      <th>경력사항</th>
                      <td>
                        <ul>
                          <li v-for="(c, i) in careers" :key="i">
                            <strong>{{ c.company }}</strong> / {{ c.position }}
                            ({{ formatPeriod(c.startDate, c.endDate, c.isCurrent) }})
                            <div v-if="c.responsibilities" class="sub">{{ c.responsibilities }}</div>
                          </li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <th>학력</th>
                      <td>
                        <ul>
                          <li v-for="(e, i) in educations" :key="i">
                            <strong>{{ e.school }}</strong> ({{ e.major }})
                            ({{ e.startDate }} ~ {{ e.endDate }})
                          </li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <th>보유기술</th>
                      <td>{{ skillsText }}</td>
                    </tr>

                    <tr>
                      <th>활동</th>
                      <td>
                        <ul>
                          <li v-for="(a, i) in activities" :key="i">
                            <strong>{{ a.name }}</strong>
                            ({{ a.startDate }} ~ {{ a.endDate }})
                            <div class="sub">{{ a.organization }}</div>
                            <div class="sub">{{ a.description }}</div>
                          </li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <th>자격증</th>
                      <td>
                        <ul>
                          <li v-for="(c, i) in certificates" :key="i">
                            <strong>{{ c.name }}</strong> - {{ c.issuer }}
                            ({{ c.date }})
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                </div>
              </template>

              <!-- ⭐ AI 코칭 (항상 표시) -->
              <div class="ai-report-card">

                <div class="report-header">
                  <h2>🧠 AI 코칭 결과</h2>
                </div>

                <div class="score-badges" v-if="score">
                  <span class="score-badge"><strong>경력 기술</strong> {{ score.careerScore }}%</span>
                  <span class="score-badge"><strong>적합도</strong> {{ score.matchScore }}%</span>
                  <span class="score-badge"><strong>완성도</strong> {{ score.completionScore }}%</span>
                </div>

                <div class="feedback-box strengths-box">
                  <h3>강점</h3>
                  <ul v-if="strengths && strengths.length">
                    <li v-for="(s, idx) in strengths" :key="idx">{{ s }}</li>
                  </ul>
                  <p v-else class="text-muted">강점 정보가 없습니다.</p>
                </div>

                <div class="feedback-box improvements-box">
                  <h3>개선 사항</h3>
                  <ul v-if="weaknesses && weaknesses.length">
                    <li v-for="(w, idx) in weaknesses" :key="idx">{{ w }}</li>
                  </ul>
                  <p v-else class="text-muted">개선 사항이 없습니다.</p>
                </div>

                <div class="format-selection-section">
                  <h3 class="format-title">이력서 형식 선택</h3>
                  <p class="format-subtitle">원하는 형식을 선택하면 화면에서 바로 확인할 수 있습니다.</p>

                  <div class="format-buttons">
                    <button class="format-btn" :class="{ active: resumeFormat === 'default' }"
                            @click="setFormat('default')">기본 형식</button>

                    <button class="format-btn" :class="{ active: resumeFormat === 'text' }"
                            @click="setFormat('text')">줄글 형식</button>

                    <button class="format-btn" :class="{ active: resumeFormat === 'standard' }"
                            @click="setFormat('standard')">표준 양식</button>
                  </div>

                  <div class="report-action">
                    <button class="btn-report-list" @click="$router.push('/resume/list')">리포트 목록으로</button>
                  </div>
                </div>

              </div>

            </div> <!-- END LEFT COLUMN -->

            <!-- RIGHT COLUMN -->
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

          </div> <!-- END TWO COLUMN -->

        </div>

      </section>
    </div>
  </div>
</template>



<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import resumeApi from "@/apis/resume";

// Resume ID
const route = useRoute();
const resumeId = computed(() => route.query.id);

// 상태 관리
const resume = ref(null);
const report = ref(null);
const resumeFormat = ref("default");
const loading = ref(false);
const error = ref("");
const saving = ref(false);

// 수정 모드
const isEditMode = ref(false);
const editData = reactive({
  title: "",
  careers: [],
  educations: [],
  skills: [],
  activities: [],
  certificates: []
});

// JSON parse helper
const safeParse = (json, fallback) => {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

// Parsed data
const careers = computed(() => safeParse(resume.value?.careerInfo, []));
const educations = computed(() => safeParse(resume.value?.educationInfo, []));
const skillsRaw = computed(() => safeParse(resume.value?.skills, []));
const activities = computed(() => safeParse(resume.value?.activities, []));
const certificates = computed(() => safeParse(resume.value?.certificates, []));

// Skills text
const skillsText = computed(() => {
  if (!Array.isArray(skillsRaw.value) || skillsRaw.value.length === 0) {
    return "";
  }
  return skillsRaw.value
    .map((s) => (s && s.name ? s.name : s))
    .join(", ");
});

// 섹션 데이터 존재 여부
const hasCareer = computed(
  () => Array.isArray(careers.value) && careers.value.length > 0
);
const hasEducation = computed(
  () => Array.isArray(educations.value) && educations.value.length > 0
);
const hasSkills = computed(
  () => Array.isArray(skillsRaw.value) && skillsRaw.value.length > 0
);
const hasActivities = computed(
  () => Array.isArray(activities.value) && activities.value.length > 0
);
const hasCertificates = computed(
  () => Array.isArray(certificates.value) && certificates.value.length > 0
);

// 비어있는 섹션 목록
const emptySections = computed(() => {
  const arr = [];
  if (!hasCareer.value) arr.push("career");
  if (!hasEducation.value) arr.push("education");
  if (!hasSkills.value) arr.push("skills");
  if (!hasActivities.value) arr.push("activities");
  if (!hasCertificates.value) arr.push("certificates");
  return arr;
});


// Section 활성화
const activeSections = ref(
  new Set(["career", "education", "skills", "activities", "certificates"])
);
const toggleSectionVisible = (section) => {
  activeSections.value.has(section)
    ? activeSections.value.delete(section)
    : activeSections.value.add(section);
};

const showCareer = computed(() => activeSections.value.has("career"));
const showEducation = computed(() => activeSections.value.has("education"));
const showSkills = computed(() => activeSections.value.has("skills"));
const showActivities = computed(() => activeSections.value.has("activities"));
const showCertificates = computed(() =>
  activeSections.value.has("certificates")
);

// 데이터 로드
const loadData = async () => {
  if (!resumeId.value) {
    error.value = "이력서 ID가 없습니다.";
    return;
  }
  loading.value = true;

  try {
    const { data: resumeData } = await resumeApi.find(resumeId.value);
    resume.value = resumeData;

    try {
      const { data: reportData } = await resumeApi.analyze(
        1,
        resumeId.value
      );
      report.value = reportData;
    } catch {
      report.value = null;
    }

    initializeEditData();
  } catch {
    error.value = "이력서를 불러오는 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

// 편집 데이터 초기화
const initializeEditData = () => {
  editData.title = resume.value.title || "";
  editData.careers = JSON.parse(JSON.stringify(careers.value));
  editData.educations = JSON.parse(JSON.stringify(educations.value));
  editData.skills = JSON.parse(JSON.stringify(skillsRaw.value));
  editData.activities = JSON.parse(JSON.stringify(activities.value));
  editData.certificates = JSON.parse(JSON.stringify(certificates.value));
};

// 저장
const saveChanges = async () => {
  try {
    saving.value = true;

    const updated = {
      resumeId: resume.value.resumeId,
      title: editData.title,
      careerInfo: JSON.stringify(editData.careers),
      educationInfo: JSON.stringify(editData.educations),
      skills: JSON.stringify(editData.skills),
      activities: JSON.stringify(editData.activities),
      certificates: JSON.stringify(editData.certificates)
    };

    await resumeApi.update(updated);
    resume.value = { ...resume.value, ...updated };

    isEditMode.value = false;
    alert("변경사항이 저장되었습니다!");
  } catch {
    alert("저장 중 오류 발생");
  } finally {
    saving.value = false;
  }
};

// 편집 모드 토글
const toggleEditMode = async () => {
  if (isEditMode.value) {
    await saveChanges();
  } else {
    isEditMode.value = true;
  }
};

// 이력서 형식 변경
const setFormat = (format) => {
  resumeFormat.value = format;
};

// 기간 포맷
const formatPeriod = (s, e, cur = false) => {
  if (!s) return "";
  if (cur) return `${s} ~ 현재`;
  return `${s} ~ ${e || ""}`;
};

// AI 분석 데이터
const score = computed(() => report.value?.score);
const strengths = computed(() => report.value?.strengths || []);
const weaknesses = computed(() => report.value?.weaknesses || []);
const coverLetterMain = computed(
  () => report.value?.coverLetterSuggestions?.[0]
);
const portfolioMain = computed(
  () => report.value?.portfolioSuggestions?.[0]
);

onMounted(loadData);
</script>


<style scoped>
/* 전체 페이지 */
.page-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
}

.main-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

/* 레이아웃 */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1200px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-column {
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.right-column::-webkit-scrollbar {
  width: 6px;
}

.right-column::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* 기본 카드 */
.resume-card,
.ai-card,
.ai-report-card,
.c-text-resume,
.c-standard-resume {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 탭 버튼 */
.section-tab-area {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.section-tab-area button {
  border: 1px solid #ddd;
  background: #f8f8f8;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
}

.section-tab-area button.active {
  background: #71EBBE;
  color: white;
  border-color: #71EBBE;
}

/* 섹션 */
.section {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.section:last-child {
  border-bottom: none;
}

/* 제목 */
.section-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

/* 수정 폼 */
.edit-form {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.form-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #555;
}

/* 항목 카드 */
.career-item,
.education-item,
.activity-item,
.cert-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* 수정 항목 카드 */
.career-edit-item,
.education-edit-item,
.activity-edit-item,
.cert-edit-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  margin-bottom: 1rem;
}

/* 스킬 리스트 */
.skills-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 버튼 */
.add-section-area {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.add-section-btn {
  background: #71EBBE;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}

/* 수정 버튼 */
.bottom-action-area {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn-edit-toggle {
  background: #B8F4DD;
  color: #166534;
  border: none;
  padding: 1rem 4rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(113, 235, 190, 0.3);
}

.btn-edit-toggle.btn-save {
  background: #71EBBE;
  color: white;
}

/* AI 리포트 */
.ai-report-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

.score-badges {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 2rem;
  flex-wrap: wrap;
}

.score-badge {
  background: white;
  border: 1px solid #e9ecef;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

/* 강점/개선 */
.feedback-box {
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.strengths-box {
  background: #E8F9F3;
  border: 1px solid #C1F2E0;
}

.improvements-box {
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
}

/* 형식 선택 */
.format-title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
}

.format-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.format-btn {
  background: #A8E6CF;
  color: #2D6A4F;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.format-btn.active {
  background: #52B788;
  color: white;
}

/* 줄글 형식 (사람인 스타일) */
.c-text-resume {
  font-size: 14px;
  line-height: 1.6;
}

.c-text-resume .heading {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 25px;
}

.c-text-resume .block {
  margin-bottom: 25px;
}

.c-text-resume .text-item .company {
  font-weight: 600;
}

.c-text-resume .text-item .period {
  font-size: 13px;
  color: #888;
}

/* 표준 양식 */
.c-standard-resume {
  margin-top: 20px;
}

.resume-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.resume-table th {
  background: #f1f5f9;
  width: 180px;
  padding: 12px;
  font-weight: 700;
  border-bottom: 1px solid #ddd;
}

.resume-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.resume-table ul {
  padding-left: 20px;
}

.resume-table .sub {
  font-size: 13px;
  color: #666;
}
</style>
