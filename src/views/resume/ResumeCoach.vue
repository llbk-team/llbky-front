<!-- 이력서 1개 조회 및 AI 종합 피드백 컴포넌트 -->
<template>
  <div class="page-wrapper">
    <div class="main-layout">
      <section class="content">
        <h1 class="title">서류 AI 코칭</h1>

        <!-- 로딩 / 에러 -->
        <div v-if="loading" class="alert alert-secondary py-2 mb-3">
          이력서와 AI 분석 결과를 불러오는 중입니다...
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-3">
          {{ error }}
        </div>

        <div v-if="resume" class="two-column-layout">
          <!-- ================= LEFT COLUMN ================= -->
          <div class="left-column">
            <!-- ================= 기본 / 줄글 / 표준 형식 ================= -->
            <div class="resume-card">
              <!-- 헤더 -->
              <div class="resume-header">
                <div class="resume-header-left">
                  <h2>📄 이력서 상세</h2>
                  <p class="resume-title">{{ resume.title || "제목 없음" }}</p>
                </div>
                <span class="badge bg-mint">{{ formatLabel }}</span>
              </div>

              <!-- 섹션 토글 버튼 -->
              <div class="section-tab-area" v-if="resumeFormat === 'default'">
                <button @click="toggleSectionVisible('career')" :class="{ active: showCareer }">
                  경력
                </button>
                <button @click="toggleSectionVisible('education')" :class="{ active: showEducation }">
                  교육
                </button>
                <button @click="toggleSectionVisible('skills')" :class="{ active: showSkills }">
                  기술스택
                </button>
                <button @click="toggleSectionVisible('activities')" :class="{ active: showActivities }">
                  활동
                </button>
                <button @click="toggleSectionVisible('certificates')" :class="{ active: showCertificates }">
                  자격증
                </button>
              </div>

              <!-- ================= 기본 형식 ================= -->
              <template v-if="resumeFormat === 'default'">
                <!-- 기본 정보 -->
                <div class="section">
                  <div class="section-header">
                    <h3>기본 정보</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <p><strong>제목:</strong> {{ resume.title || "제목 없음" }}</p>
                  </div>

                  <div v-else class="edit-form">
                    <div class="form-group">
                      <label>이력서 제목</label>
                      <input type="text" v-model="editData.title" class="form-control" />
                    </div>
                  </div>
                </div>

                <!-- 경력 -->
                <div class="section" v-if="showCareer">
                  <div class="section-header">
                    <h3>경력 사항</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-if="careers.length === 0" class="empty-field">&nbsp;</div>

                    <div v-else v-for="(career, index) in careers" :key="index" class="career-item">
                      <p><strong>{{ career.company }} | {{ career.position }}</strong></p>
                      <p class="text-muted">
                        {{ formatPeriod(career.startDate, career.endDate, career.isCurrent) }}
                      </p>
                      <p v-if="career.responsibilities">{{ career.responsibilities }}</p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="section-edit-header">
                      <span>경력 목록</span>
                      <button class="btn-secondary" type="button" @click="addCareer">
                        + 경력 추가
                      </button>
                    </div>

                    <div v-for="(career, index) in editData.careers" :key="index" class="career-edit-item">
                      <div class="edit-item-header">
                        <h5>경력 {{ index + 1 }}</h5>
                        <button v-if="editData.careers.length > 1" type="button" class="btn-ghost-danger"
                          @click="removeCareer(index)">
                          삭제
                        </button>
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
                <div class="section" v-if="showEducation">
                  <div class="section-header">
                    <h3>교육 사항</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-if="educations.length === 0" class="empty-field">&nbsp;</div>

                    <div v-else v-for="(edu, index) in educations" :key="index" class="education-item">
                      <p><strong>{{ edu.school }}</strong></p>
                      <p>{{ edu.major }}</p>
                      <p class="text-muted">
                        {{ formatPeriod(edu.startDate, edu.endDate) }}
                      </p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="section-edit-header">
                      <span>교육 목록</span>
                      <button class="btn-secondary" type="button" @click="addEducation">
                        + 교육 추가
                      </button>
                    </div>

                    <div v-for="(edu, index) in editData.educations" :key="index" class="education-edit-item">
                      <div class="edit-item-header">
                        <h5>교육 {{ index + 1 }}</h5>
                        <button v-if="editData.educations.length > 1" type="button" class="btn-ghost-danger"
                          @click="removeEducation(index)">
                          삭제
                        </button>
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
                <div class="section" v-if="showSkills">
                  <div class="section-header">
                    <h3>기술 스택</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-if="skillsArray.length === 0" class="empty-field">&nbsp;</div>
                    <p v-else>{{ skillsText }}</p>
                  </div>

                  <div v-else class="edit-form">
                    <div class="section-edit-header">
                      <span>기술 스택 목록</span>
                      <button class="btn-secondary" type="button" @click="addSkill">
                        + 스킬 추가
                      </button>
                    </div>

                    <div class="skills-edit">
                      <div v-for="(skill, index) in editData.skills" :key="index" class="skill-edit-item">
                        <div class="skill-row">
                          <input type="text" v-model="skill.name" class="form-control skill-input" placeholder="기술명" />
                          <button v-if="editData.skills.length > 1" type="button"
                            class="btn-ghost-danger skill-remove-btn" @click="removeSkill(index)">
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 활동 -->
                <div class="section" v-if="showActivities">
                  <div class="section-header">
                    <h3>활동 사항</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-if="activities.length === 0" class="empty-field">&nbsp;</div>

                    <div v-else v-for="(activity, index) in activities" :key="index" class="activity-item">
                      <p><strong>{{ activity.name }}</strong></p>
                      <p>{{ activity.organization }}</p>
                      <p class="text-muted">
                        {{ formatPeriod(activity.startDate, activity.endDate) }}
                      </p>
                      <p>{{ activity.description }}</p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="section-edit-header">
                      <span>활동 목록</span>
                      <button class="btn-secondary" type="button" @click="addActivity">
                        + 활동 추가
                      </button>
                    </div>

                    <div v-for="(activity, index) in editData.activities" :key="index" class="activity-edit-item">
                      <div class="edit-item-header">
                        <h5>활동 {{ index + 1 }}</h5>
                        <button v-if="editData.activities.length > 1" type="button" class="btn-ghost-danger"
                          @click="removeActivity(index)">
                          삭제
                        </button>
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
                <div class="section" v-if="showCertificates">
                  <div class="section-header">
                    <h3>자격증</h3>
                  </div>

                  <div v-if="!isEditMode">
                    <div v-if="certificates.length === 0" class="empty-field">&nbsp;</div>

                    <div v-else v-for="(cert, index) in certificates" :key="index" class="cert-item">
                      <p><strong>{{ cert.name }}</strong></p>
                      <p>{{ cert.issuer }} | {{ cert.date }}</p>
                    </div>
                  </div>

                  <div v-else class="edit-form">
                    <div class="section-edit-header">
                      <span>자격증 목록</span>
                      <button class="btn-secondary" type="button" @click="addCertificate">
                        + 자격증 추가
                      </button>
                    </div>

                    <div v-for="(cert, index) in editData.certificates" :key="index" class="cert-edit-item">
                      <div class="edit-item-header">
                        <h5>자격증 {{ index + 1 }}</h5>
                        <button v-if="editData.certificates.length > 1" type="button" class="btn-ghost-danger"
                          @click="removeCertificate(index)">
                          삭제
                        </button>
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

                <!-- 하단 버튼 -->
                <div class="bottom-action-area">
                  <button v-if="isEditMode" type="button" class="btn-outline" @click="cancelEdit">
                    취소하기
                  </button>
                  <button type="button" class="btn-primary" :class="{ 'btn-primary-save': isEditMode }"
                    :disabled="saving" @click="toggleEditMode">
                    {{ isEditMode ? "저장하기" : "수정하기" }}
                  </button>
                </div>
              </template>

              <!-- ================= 줄글 형식 ================= -->
              <template v-if="resumeFormat === 'text'">
                <div class="c-text-resume">
                  <h2 class="heading">{{ resume.title }}</h2>

                  <div class="block">
                    <h5>■ 경력사항</h5>
                    <div v-if="careers.length === 0" class="empty-text">&nbsp;</div>

                    <div v-else v-for="(c, i) in careers" :key="i" class="text-item">
                      <p class="company">{{ c.company }} | {{ c.position }}</p>
                      <p class="period">
                        {{ formatPeriod(c.startDate, c.endDate, c.isCurrent) }}
                      </p>
                      <p v-if="c.responsibilities">{{ c.responsibilities }}</p>
                    </div>
                  </div>

                  <div class="block">
                    <h5>■ 학력</h5>
                    <div v-if="educations.length === 0" class="empty-text">&nbsp;</div>

                    <div v-else v-for="(e, i) in educations" :key="i" class="text-item">
                      <p class="company">{{ e.school }} ({{ e.major }})</p>
                      <p class="period">{{ e.startDate }} ~ {{ e.endDate }}</p>
                    </div>
                  </div>

                  <div class="block">
                    <h5>■ 보유기술</h5>
                    <div v-if="skillsArray.length === 0" class="empty-text">&nbsp;</div>
                    <p v-else>{{ skillsText }}</p>
                  </div>

                  <div class="block">
                    <h5>■ 활동</h5>
                    <div v-if="activities.length === 0" class="empty-text">&nbsp;</div>

                    <div v-else v-for="(a, i) in activities" :key="i" class="text-item">
                      <p class="company">{{ a.name }}</p>
                      <p class="period">{{ a.startDate }} ~ {{ a.endDate }}</p>
                      <p>{{ a.organization }}</p>
                      <p>{{ a.description }}</p>
                    </div>
                  </div>

                  <div class="block">
                    <h5>■ 자격증</h5>
                    <div v-if="certificates.length === 0" class="empty-text">&nbsp;</div>

                    <div v-else v-for="(cert, i) in certificates" :key="i" class="text-item">
                      <p class="company">{{ cert.name }} - {{ cert.issuer }}</p>
                      <p class="period">{{ cert.date }}</p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ================= 표준 양식 ================= -->
              <template v-if="resumeFormat === 'standard'">
                <div class="c-standard-resume">
                  <h2 class="section-title">📋 표준 양식 이력서</h2>

                  <table class="resume-table">
                    <tbody>
                      <tr>
                        <th>이력서 제목</th>
                        <td>{{ resume.title }}</td>
                      </tr>

                      <tr>
                        <th>경력사항</th>
                        <td>
                          <div v-if="careers.length === 0">&nbsp;</div>
                          <ul v-else>
                            <li v-for="(c, i) in careers" :key="i">
                              <strong>{{ c.company }}</strong> / {{ c.position }}
                              ({{ formatPeriod(c.startDate, c.endDate, c.isCurrent) }})
                              <div v-if="c.responsibilities" class="sub">
                                {{ c.responsibilities }}
                              </div>
                            </li>
                          </ul>
                        </td>
                      </tr>

                      <tr>
                        <th>학력</th>
                        <td>
                          <div v-if="educations.length === 0">&nbsp;</div>
                          <ul v-else>
                            <li v-for="(e, i) in educations" :key="i">
                              <strong>{{ e.school }}</strong> ({{ e.major }})
                              ({{ e.startDate }} ~ {{ e.endDate }})
                            </li>
                          </ul>
                        </td>
                      </tr>

                      <tr>
                        <th>보유기술</th>
                        <td>
                          <div v-if="skillsArray.length === 0">&nbsp;</div>
                          <span v-else>{{ skillsText }}</span>
                        </td>
                      </tr>

                      <tr>
                        <th>활동</th>
                        <td>
                          <div v-if="activities.length === 0">&nbsp;</div>
                          <ul v-else>
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
                          <div v-if="certificates.length === 0">&nbsp;</div>
                          <ul v-else>
                            <li v-for="(c, i) in certificates" :key="i">
                              <strong>{{ c.name }}</strong> - {{ c.issuer }} ({{ c.date }})
                            </li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </template>
            </div>

            <!-- ================= AI 코칭 결과 카드 ================= -->
            <div class="ai-report-card">
              <div class="report-header">
                <h2>🧠 AI 코칭 결과</h2>
              </div>

              <div class="score-badges" v-if="score">
                <span class="score-badge"><strong>경력 기술</strong> {{ score.careerScore }}%</span>
                <span class="score-badge"><strong>적합도</strong> {{ score.matchScore }}%</span>
                <span class="score-badge">
                  <strong>완성도</strong> {{ score.completionScore }}%
                </span>
              </div>

              <div class="feedback-box strengths-box">
                <strong>강점</strong>
                <ul v-if="strengths && strengths.length">
                  <li v-for="(s, idx) in strengths" :key="idx">{{ s }}</li>
                </ul>
                <p v-else class="text-muted small">강점 정보가 없습니다.</p>
              </div>

              <div class="feedback-box improvements-box">
                <strong>개선 사항</strong>
                <ul v-if="weaknesses && weaknesses.length">
                  <li v-for="(w, idx) in weaknesses" :key="idx">{{ w }}</li>
                </ul>
                <p v-else class="text-muted small">개선 사항이 없습니다.</p>
              </div>

              <div class="format-selection-section">
                <h3 class="format-title">이력서 형식 선택</h3>
                <p class="format-subtitle">
                  원하는 형식을 선택하면 화면에서 바로 확인할 수 있습니다.
                </p>

                <div class="format-buttons">
                  <button class="format-btn" :class="{ active: resumeFormat === 'default' }" type="button"
                    @click="setFormat('default')">
                    기본 형식
                  </button>

                  <button class="format-btn" :class="{ active: resumeFormat === 'text' }" type="button"
                    @click="setFormat('text')">
                    줄글 형식 이력서
                  </button>

                  <button class="format-btn" :class="{ active: resumeFormat === 'standard' }" type="button"
                    @click="setFormat('standard')">
                    표준 양식 이력서
                  </button>
                </div>

                <div class="report-action">
                  <button type="button" class="btn-report-list" @click="$router.push('/resume/list')">
                    리포트 목록으로
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ================= RIGHT COLUMN ================= -->
          <div class="right-column">
            <div class="ai-card">
              <h2>✏️ AI 제안</h2>
              <p class="edit-label">자소서 · 포트폴리오 맞춤 제안</p>

              <div class="before">
                <strong>자소서 강조 포인트</strong><br />
                <span v-if="coverLetterMain">{{ coverLetterMain }}</span>
                <span v-else class="text-muted">데이터 없음</span>
              </div>

              <div class="after">
                <strong>포트폴리오 추가 제안</strong><br />
                <span v-if="portfolioMain">{{ portfolioMain }}</span>
                <span v-else class="text-muted">데이터 없음</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import resumeCoach from "@/utils/resumeCoach";

const {
  resume,
  report,
  resumeFormat,
  loading,
  error,
  saving,

  careers,
  educations,
  skillsArray,
  skillsText,
  activities,
  certificates,

  score,
  strengths,
  weaknesses,
  coverLetterMain,
  portfolioMain,

  formatLabel,
  toggleSectionVisible,
  showCareer,
  showEducation,
  showSkills,
  showActivities,
  showCertificates,

  isEditMode,
  editData,
  toggleEditMode,
  cancelEdit,

  formatPeriod,

  addCareer,
  removeCareer,
  addEducation,
  removeEducation,
  addSkill,
  removeSkill,
  addActivity,
  removeActivity,
  addCertificate,
  removeCertificate,

  setFormat,
  loadData
} = resumeCoach.useResumeCoach();

onMounted(() => {
  loadData();
});

</script>

<style src="@/assets/css/resumeCoach.css"></style>
