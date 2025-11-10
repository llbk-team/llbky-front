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
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호를 입력하세요"
              />
              <i
                :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                class="toggle-icon"
                @click="showPassword = !showPassword"
              ></i>
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
                <div
                  class="progress-fill"
                  :class="{ active: progressStep > 0 }"
                  :style="{ width: progressStep === 1 ? '50%' : progressStep === 2 ? '100%' : '0%' }"
                ></div>
              </div>
              <div class="step" :class="{ active: progressStep === 2 }">2</div>
              <span class="step-label">경력/스킬</span>
            </div>
          </div>

          <!-- 직군 -->
          <div class="section job-section">
            <h4>직군 선택</h4>
            <div class="grid-5">
              <button
                v-for="(job, idx) in jobFields"
                :key="idx"
                :class="['grid-item', { selected: selectedJob === job }]"
                @click.prevent="selectJob(job)"
              >
                {{ job }}
              </button>
            </div>
          </div>

          <!-- 직무 -->
          <div class="section role-section">
            <h4>직무</h4>
            <input
              v-model="jobRole"
              class="text-input"
              type="text"
              placeholder="예: 백엔드, UX 디자이너, 콘텐츠 마케터 등"
              @input="updateProgress"
            />
          </div>

          <!-- 경력 -->
          <div class="section career-section">
            <h4>경력</h4>
            <div class="grid-5">
              <button
                v-for="(exp, idx) in experiences"
                :key="idx"
                :class="['grid-item', { selected: selectedExp === exp }]"
                @click.prevent="selectExp(exp)"
              >
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

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

const selectedJob = ref("");
const jobRole = ref("");
const selectedExp = ref("");
const progressStep = ref(0);

const selectJob = (job) => {
  selectedJob.value = job;
  // ✅ 직군 선택 즉시 1단계 활성화
  if (!progressStep.value) progressStep.value = 1;
  updateProgress();
};

const selectExp = (exp) => {
  selectedExp.value = exp;
  progressStep.value = 2; // 경력 선택 시 2단계 활성화
};

const updateProgress = () => {
  if (selectedJob.value && jobRole.value) progressStep.value = 1;
  if (selectedExp.value) progressStep.value = 2;
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

const handleSignup = () => {
  if (isFormComplete.value) {
    alert("회원가입이 완료되었습니다!");
    router.push("/login");
  }
};
</script>

<style scoped>
.signup-page {
  font-family: "Pretendard", sans-serif;
  background: #fff;
  min-height: 100vh;
  padding: 60px 20px;
}

.signup-container {
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
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-header p {
  color: #777;
  font-size: 14px;
}

/* 진행 라인 */
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

/* ✅ 섹션 간 여백 통일 */
.section {
  margin-bottom: 40px;
}

/* 섹션 제목 */
.section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
}

/* 5칸 grid */
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

/* 직무 입력 */
.text-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 완료 버튼 */
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
