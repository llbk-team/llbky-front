<template>
  <div class="edit-page">
    <div class="edit-container">
      <h2>내 정보 수정</h2>

      <form @submit.prevent="handleSave">
        <!-- 기본 정보 -->
        <div class="form-section basic-info">
          <div class="input-group">
            <label>이름</label>
            <input v-model="form.name" type="text" disabled />
          </div>

          <div class="input-group">
            <label>아이디</label>
            <input v-model="form.username" type="text" disabled />
          </div>

          <div class="input-group">
            <label>이메일</label>
            <input v-model="form.email" type="email" />
          </div>

          <div class="input-group">
            <label>비밀번호 변경 (선택)</label>
            <div class="password-box">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="새 비밀번호를 입력하세요" />
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="toggle-icon" @click="showPassword = !showPassword"></i>
            </div>
          </div>
        </div>

        <!-- 추가 정보 -->
        <div class="form-section">
          <div class="info-header">
            <h3><i class="ri-user-settings-line"></i> 경력 및 직무 정보</h3>
            <p>현재 상태에 맞게 정보를 수정하세요</p>
          </div>

          <!-- 직군 -->
          <div class="section job-section">
            <h4>직군</h4>
            <div class="grid-5">
              <button v-for="(job, idx) in jobFields" :key="idx" :class="['grid-item', { selected: selectedJob === job }]" @click.prevent="selectJob(job)">
                {{ job }}
              </button>
            </div>
          </div>

          <!-- 직무 드롭다운 -->
          <div class="section role-section">
            <h4>직무</h4>
            <div class="dropdown dropdown-container" ref="dropdownRef">
              <button class="btn dropdown-toggle w-100 text-start" :class="{ 'btn-secondary': !selectedJob, 'btn-light': selectedJob }" type="button" :disabled="!selectedJob" @click="toggleDropdown">
                {{ selectedRole || "직무를 선택하세요" }}
                <span class="arrow" :class="{ open: isDropdownOpen }"></span>
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
              <button v-for="(exp, idx) in experiences" :key="idx" :class="['grid-item', { selected: selectedExp === exp }]" @click.prevent="selectExp(exp)">
                {{ exp }}
              </button>
            </div>
          </div>
        </div>

        <!-- 저장 버튼 -->
        <button type="submit" class="btn-submit">정보 저장</button>
        <router-link to="/" class="btn-cancel">돌아가기</router-link>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import memberApi from "@/apis/memberApi";

const router = useRouter();
const store = useStore();

const showPassword = ref(false);

const form = ref({
  name: "",
  username: "",
  email: "",
  password: "",
});

// ----------------------
// 직군/직무/경력 데이터
// ----------------------
const jobFields = [
  "개발", "디자인", "기획", "PM", "마케팅",
  "AI/데이터", "영업", "경영", "교육", "기타",
];



const experiences = ["신입", "1~3년차", "3~5년차", "5~10년차", "10년 이상"];

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
    "제품 디자이너",
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
    "제품 PM",
    "운영 PM",
    "스크럼 마스터",
    "공공/SI PM",
    "데이터 PM",
    "QA PM"
  ],
  마케팅: [
    "디지털 마케터",
    "퍼포먼스 마케터",
    "콘텐츠 마케터",
    "SEO 전문가",
    "브랜드 마케터",
    "CRM 마케터",
    "데이터 분석 마케터",
    "PR/홍보 담당",
    "SNS/인플루언서 마케터"
  ],
  "AI/데이터": [
    "데이터 분석가",
    "머신러닝 엔지니어",
    "딥러닝 엔지니어",
    "데이터 엔지니어",
    "NLP 엔지니어",
    "MLOps 엔지니어",
    "컴퓨터비전 엔지니어",
    "추천 시스템 엔지니어",
    "AI 서비스 엔지니어"
  ],
  영업: [
    "B2B 영업",
    "B2C 영업",
    "IT 솔루션 영업",
    "SaaS 영업",
    "파트너 영업",
    "고객 성공 매니저(CSM)",
    "영업 전략/기획",
    "유통/대리점 영업",
    "글로벌 영업"
  ],
  경영: [
    "경영기획",
    "전략기획",
    "HR/인사",
    "재무/회계",
    "총무",
    "법무/컴플라이언스",
    "사업개발(BD)",
    "운영관리",
    "리스크/감사",
    "IR"
  ],
  교육: [
    "교육 기획",
    "교육 운영",
    "온라인 교육 기획",
    "기업교육 강사",
    "IT 교육 강사",
    "학습 데이터 분석가",
    "콘텐츠 기획",
    "교육 플랫폼 운영",
  ],
  기타: [
    "영상 편집자",
    "PD/작가",
    "콘텐츠 에디터",
    "CX 매니저",
    "CS 운영",
    "번역/통역가",
    "데이터 라벨러",
    "문화 콘텐츠 기획"
  ]
};

// 선택 상태
const selectedJob = ref("");
const selectedRole = ref("");
const selectedExp = ref("");

// 드롭다운
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const roleOptions = computed(() =>
  selectedJob.value ? jobRolesData[selectedJob.value] : []
);

// -----------------------------
// ⭐ 초기값: store.userInfo로 세팅
// -----------------------------
onMounted(() => {
  const user = store.getters["user/userInfo"];

  form.value = {
    name: user.memberName,
    username: user.loginId,
    email: user.memberEmail,
    password: "",
  };

  selectedJob.value = user.jobGroup;
  selectedRole.value = user.jobRole;
  selectedExp.value = convertCareerToLabel(user.careerYears);
});

// ----------------------
// 직군, 직무, 경력 선택
// ----------------------
const selectJob = (job) => {
  selectedJob.value = job;
  selectedRole.value = "";
};

const toggleDropdown = (e) => {
  e.stopPropagation();
  if (selectedJob.value) isDropdownOpen.value = !isDropdownOpen.value;
};

const selectRole = (role) => {
  selectedRole.value = role;
  isDropdownOpen.value = false;
};

const selectExp = (exp) => {
  selectedExp.value = exp;
};

// ----------------------
// 경력 변환
// ----------------------
function convertCareerToLabel(years) {
  if (years === 0) return "신입";
  if (years <= 3) return "1~3년차";
  if (years <= 5) return "3~5년차";
  if (years < 10) return "5~10년차";
  return "10년 이상";
}

function convertCareerToNumber(label) {
  if (label === "신입") return 0;
  return parseInt(label);
}

// ----------------------
// 저장
// ----------------------
async function handleSave() {
  const user = store.getters["user/userInfo"];

  const payload = {
    loginId: user.loginId,
    memberEmail: form.value.email,
    jobGroup: selectedJob.value,
    jobRole: selectedRole.value,
    careerYears: convertCareerToNumber(selectedExp.value),
  };

  if (form.value.password.trim()) {
    payload.memberPassword = form.value.password;
  }

  await memberApi.updateMember(user.memberId, payload);

  // store 업데이트
  store.dispatch("user/login", {
    ...user,
    memberEmail: payload.memberEmail,
    jobGroup: payload.jobGroup,
    jobRole: payload.jobRole,
    careerYears: payload.careerYears,
  });

  alert("정보가 수정되었습니다!");
  router.push("/");
}

// ----------------------
// 드롭다운 외부 클릭 감지
// ----------------------
const closeDropdown = (e) => {
  if (!dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", closeDropdown));
onUnmounted(() => document.removeEventListener("click", closeDropdown));
</script>


<style scoped>
.edit-page {
  background: #fff;
  min-height: 100vh;
  padding: 60px 20px;
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

/* 제목 */
h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
}

/* 기본 정보 */
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

/* 추가 정보 */
.info-header {
  text-align: center;
  margin-bottom: 30px;
}

.info-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-header p {
  color: #777;
  font-size: 14px;
}

/* 섹션 공통 */
.section {
  margin-bottom: 40px;
}

.section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

/* 버튼 그리드 */
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
  text-align: center;
  transition: 0.2s;
}

.grid-item.selected {
  background: #71ebbe;
  color: #000;
  font-weight: 600;
}

/* 텍스트 입력 */
.text-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 버튼 */
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

.btn-submit:hover {
  background: #a2f1d6;
}

.btn-cancel {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #111;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
}

.btn-cancel:hover {
  color: #71ebbe;
}

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

</style>
