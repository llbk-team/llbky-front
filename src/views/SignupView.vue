<template>
  <div class="signup-page">
    <div class="signup-container">
      <h2>회원가입</h2>

      <form @submit.prevent="handleSignup">
        <!-- 기본 정보 -->
        <div class="form-section basic-info">
          <div class="input-group">
            <label>이름</label>
            <input v-model="name" type="text" placeholder="이름을 입력하세요" />
          </div>

          <div class="input-group">
            <label>아이디</label>
            <input v-model="username" type="text" placeholder="아이디를 입력하세요" />
          </div>

          <div class="input-group">
            <label>비밀번호</label>
            <div class="password-box">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="비밀번호를 입력하세요" />
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="toggle-icon"
                @click="showPassword = !showPassword"></i>
            </div>
          </div>

          <div class="input-group">
            <label>이메일</label>
            <input v-model="email" type="email" placeholder="이메일을 입력하세요" />
          </div>
        </div>

        <!-- 추가 정보 입력 -->
        <div class="form-section">
          <div class="info-header">
            <h3><i class="ri-check-line"></i> 추가 정보 입력</h3>
            <p>맞춤형 커리어 코칭을 위한 정보를 입력해주세요</p>
          </div>

          <!-- ✅ 진행 라인 -->
          <div class="progress-container">
            <div class="progress-steps">
              <div class="step" :class="{ active: progressStep >= 1 }">1</div>
              <span class="step-label">직군/직무</span>
              <div class="progress-bar">
                <div class="progress-fill" :class="{ active: progressStep > 0 }"
                  :style="{ width: progressStep === 1 ? '50%' : progressStep === 2 ? '100%' : '0%' }"></div>
              </div>
              <div class="step" :class="{ active: progressStep === 2 }">2</div>
              <span class="step-label">경력/스킬</span>
            </div>
          </div>

          <!-- 직군 -->
          <div class="section job-section">
            <h4>직군 선택</h4>
            <div class="grid-5">
              <button v-for="(job, idx) in jobFields" :key="idx"
                :class="['grid-item', { selected: selectedJob === job }]" @click.prevent="selectJob(job)">
                {{ job }}
              </button>
            </div>
          </div>

          <!-- 직무 (드롭다운) -->
          <div class="section role-section">
            <h4>직무</h4>
            <div class="dropdown" ref="dropdownRef">
              <button class="btn dropdown-toggle w-100 text-start"
                :class="{ 'btn-secondary': !selectedJob, 'btn-light': selectedJob }" type="button"
                :disabled="!selectedJob" @click="toggleDropdown">
                {{ jobRole || '직군을 먼저 선택해주세요' }}
              </button>
              <ul class="dropdown-menu w-100" :class="{ show: isDropdownOpen }">
                <li v-for="(role, idx) in roleOptions" :key="idx">
                  <a class="dropdown-item" href="#" @click.prevent="selectRole(role)">
                    {{ role }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 경력 -->
          <div class="section career-section">
            <h4>경력</h4>
            <div class="grid-5">
              <button v-for="(exp, idx) in experiences" :key="idx"
                :class="['grid-item', { selected: selectedExp === exp }]" @click.prevent="selectExp(exp)">
                {{ exp }}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="!isFormComplete">
          회원가입 완료
        </button>

        <router-link to="/login" class="btn-login-link">로그인</router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import memberApi from "@/apis/memberApi";   // ✅ 회원가입 API import

const router = useRouter();

const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const jobFields = [
  "개발",
  "디자인",
  "기획",
  "PM",
  "마케팅",
  "AI/데이터",
  "영업",
  "경영",
  "교육",
  "기타",
];
const experiences = ["신입", "1~3년차", "3~5년차", "5~10년차", "10년 이상"];

// 직군별 직무 데이터
const jobRolesData = {
    개발: [
    "프론트엔드 개발자",
    "백엔드 개발자",
    "풀스택 개발자",
    "모바일 앱 개발자(iOS/Android)",
    "Java/Spring 개발자",
    "Node.js 개발자",
    "데이터 엔지니어",
    "DevOps 엔지니어",
    "게임 클라이언트/서버 개발자",
    "QA/테스트 자동화 엔지니어"
  ],
  디자인: [
    "UI 디자이너",
    "UX 디자이너",
    "웹/앱 디자이너",
    "그래픽 디자이너",
    "모션 그래픽 디자이너",
    "브랜드 디자이너",
    "영상·콘텐츠 디자이너",
    "제품(Industrial/Product) 디자이너",
    "서비스 디자이너",
    "게임 UI/아트 디자이너"
  ],
  기획: [
    "서비스 기획자",
    "웹/앱 기획자",
    "제품 기획자(PO)",
    "운영 기획자",
    "정책/프로세스 기획자",
    "콘텐츠 기획자",
    "데이터 기반 기획자",
    "커머스 기획자",
    "게임 기획자",
    "결제/정산 기획자"
  ],
  PM: [
    "IT 프로젝트 매니저",
    "서비스 PM",
    "웹/앱 PM",
    "기술 PM",
    "제품 PM(Product Manager)",
    "운영 PM",
    "스크럼 마스터",
    "공공기관/SI PM",
    "데이터/플랫폼 PM",
    "QA PM"
  ],
  마케팅: [
    "디지털 마케터",
    "퍼포먼스 마케터",
    "콘텐츠 마케터",
    "SNS/인플루언서 마케터",
    "SEO 전문가",
    "브랜드 마케터",
    "이커머스 마케터",
    "CRM 마케터",
    "시장·데이터 분석 마케터",
    "PR/홍보 담당"
  ],
  "AI/데이터": [
    "데이터 분석가",
    "데이터 엔지니어",
    "머신러닝 엔지니어",
    "딥러닝 엔지니어",
    "NLP 엔지니어",
    "컴퓨터비전(CV) 엔지니어",
    "데이터 사이언티스트",
    "MLOps 엔지니어",
    "추천 시스템 엔지니어",
    "AI 제품/서비스 엔지니어"
  ],
  영업: [
    "B2B 영업",
    "B2C 영업",
    "IT/솔루션 영업",
    "SaaS 영업",
    "파트너 영업",
    "영업 전략/기획",
    "고객 성공 매니저(CSM)",
    "대리점/유통 영업",
    "제안·프리세일즈 담당",
    "글로벌 영업"
  ],
  경영: [
    "경영기획",
    "전략기획",
    "재무/회계",
    "HR/인사",
    "총무/관리",
    "법무/컴플라이언스",
    "사업개발(BD)",
    "운영 관리",
    "리스크·감사",
    "IR·투자자 커뮤니케이션"
  ],
  교육: [
    "교육 기획",
    "교육 운영",
    "교육 콘텐츠 기획",
    "온라인 교육 기획",
    "IT 교육 강사",
    "기업교육 강사",
    "HRD 매니저",
    "학습 데이터 분석가",
    "교수설계자(ID)",
    "교육 플랫폼 운영"
  ],
  기타: [
    "영상 편집자",
    "PD/작가",
    "콘텐츠 에디터",
    "번역/통역가",
    "고객경험(CX) 매니저",
    "CS 운영",
    "데이터 라벨러",
    "공공사업 기획",
    "문화 콘텐츠 기획",
    "고객 성공 매니저(CSM)"
  ]
};

const selectedJob = ref("");
const jobRole = ref("");
const selectedExp = ref("");
const progressStep = ref(0);
const isDropdownOpen = ref(false);

const roleOptions = computed(() => {
  return selectedJob.value ? jobRolesData[selectedJob.value] || [] : [];
});

const selectJob = (job) => {
  selectedJob.value = job;
  jobRole.value = "";
  isDropdownOpen.value = false;
  if (!progressStep.value) progressStep.value = 1;
  updateProgress();
};

const toggleDropdown = (event) => {
  event.stopPropagation();
  if (selectedJob.value) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const selectRole = (role) => {
  jobRole.value = role;
  isDropdownOpen.value = false;
  updateProgress();
};

const selectExp = (exp) => {
  selectedExp.value = exp;
  progressStep.value = 2;
};

const updateProgress = () => {
  if (selectedJob.value && jobRole.value) progressStep.value = 1;
  if (selectedExp.value) progressStep.value = 2;
};

// 경력 문자열 → 숫자 변환
const convertCareer = (exp) => {
  if (exp === "신입") return 0;
  if (exp.includes("년")) return parseInt(exp);
  return 0;
};

const isFormComplete = computed(
  () =>
    name.value &&
    username.value &&
    email.value &&
    password.value &&
    selectedJob.value &&
    jobRole.value &&
    selectedExp.value
);

// =========================
// 🚀 회원가입 API 호출
// =========================
const handleSignup = async () => {
  if (!isFormComplete.value) return;

  try {
    await memberApi.register({
      name: name.value,
      loginId: username.value,
      password: password.value,
      email: email.value,
      jobGroup: selectedJob.value,
      jobRole: jobRole.value,
      careerYears: convertCareer(selectedExp.value),
    });

    alert("회원가입이 완료되었습니다!");
    router.push("/login");

  } catch (err) {
    alert(err.response?.data || "회원가입 실패");
  }
};

// 드롭다운 외부 클릭 처리
const handleClickOutside = (event) => {
  const dropdownContainer = event.target.closest('.dropdown-container');
  if (!dropdownContainer && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-toggle {
  border: 1px solid #ddd;
  font-size: 14px;
  padding: 10px 12px;
}

.dropdown-toggle:disabled {
  background: #f1f2f3 !important;
  color: #999 !important;
  cursor: not-allowed;
  border-color: #e5e5e5;
}

.btn-light {
  background: #fff;
  border-color: #ddd;
  color: #222;
}

.btn-light:hover:not(:disabled) {
  border-color: #71ebbe;
  background: #fff;
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f1f2f3;
}




.signup-page {
  background: #fff;
  min-height: 100vh;
  padding: 60px 20px;
}

.signup-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
}

.basic-info {
  max-width: 400px;
  margin: 0 auto 60px auto;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  outline: none;
}

input:focus {
  border-color: #71ebbe;
}

.password-box {
  position: relative;
  width: 100%;
}

.password-box input {
  width: 100%;
  padding-right: 38px;
}

.toggle-icon {
  position: absolute;
  right: 12px;
  top: 10px;
  font-size: 18px;
  color: #777;
  cursor: pointer;
}

.info-header {
  text-align: center;
  margin-bottom: 30px;
}

.info-header h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-header p {
  color: #777;
  font-size: 14px;
}

.progress-container {
  width: 100%;
  margin: 30px 0 50px;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.step {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eaecec;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  z-index: 2;
  transition: 0.3s;
}

.step.active {
  background: #a2f1d6;
  color: #111;
}

.step-label {
  font-size: 13px;
  color: #aaa;
  margin: 0 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #eaecec;
  border-radius: 2px;
  position: relative;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: #71ebbe;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.section {
  margin-bottom: 40px;
}

.section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.grid-5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.grid-item {
  background: #f1f2f3;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.grid-item.selected {
  background: #71ebbe;
  color: #000;
  font-weight: 600;
}

/* 드롭다운 */
.dropdown-container {
  position: relative;
  width: 100%;
}

.dropdown-toggle {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.dropdown-toggle:disabled {
  background: #f1f2f3;
  color: #999;
  cursor: not-allowed;
}

.dropdown-toggle:not(:disabled):hover {
  border-color: #71ebbe;
}

.dropdown-toggle .arrow {
  font-size: 12px;
  color: #777;
  transition: transform 0.2s;
  display: inline-block;
}

.dropdown-toggle .arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 0;
  list-style: none;
  margin: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f1f2f3;
}

.btn-submit {
  width: 100%;
  background: #71ebbe;
  border: none;
  color: #000;
  font-weight: 600;
  border-radius: 4px;
  padding: 12px 0;
  cursor: pointer;
  transition: 0.2s;
}

.btn-submit:disabled {
  background: #f1f2f3;
  color: #999;
  cursor: not-allowed;
}

.btn-submit:hover:enabled {
  background: #a2f1d6;
}

.btn-login-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #111;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
}

.btn-login-link:hover {
  color: #71ebbe;
}
</style>