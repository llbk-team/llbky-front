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
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="새 비밀번호를 입력하세요"
              />
              <i
                :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                class="toggle-icon"
                @click="showPassword = !showPassword"
              ></i>
            </div>
          </div>
        </div>

        <!-- 추가 정보 -->
        <div class="form-section">
          <div class="info-header">
            <h3><i class="ri-user-settings-line"></i> 경력 및 직무 정보</h3>
            <p>현재 상태에 맞게 정보를 수정하세요</p>
          </div>

          <div class="section job-section">
            <h4>직군</h4>
            <div class="grid-5">
              <button
                v-for="(job, idx) in jobFields"
                :key="idx"
                :class="['grid-item', { selected: form.jobField === job }]"
                @click.prevent="form.jobField = job"
              >
                {{ job }}
              </button>
            </div>
          </div>

          <div class="section role-section">
            <h4>직무</h4>
            <input
              v-model="form.jobRole"
              class="text-input"
              type="text"
              placeholder="예: 백엔드, UX 디자이너 등"
            />
          </div>

          <div class="section career-section">
            <h4>경력</h4>
            <div class="grid-5">
              <button
                v-for="(exp, idx) in experiences"
                :key="idx"
                :class="['grid-item', { selected: form.careerLevel === exp }]"
                @click.prevent="form.careerLevel = exp"
              >
                {{ exp }}
              </button>
            </div>
          </div>
        </div>

        <!-- 저장 버튼 -->
        <button type="submit" class="btn-submit">정보 저장</button>
        <router-link to="/my/page" class="btn-cancel">돌아가기</router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showPassword = ref(false);

// 서버에서 받아올 사용자 정보 (임시)
const form = ref({
  name: "",
  username: "",
  email: "",
  password: "",
  jobField: "",
  jobRole: "",
  careerLevel: "",
});

// 샘플 데이터 (mounted 시 로드)
onMounted(() => {
  // 실제 구현 시 → API로 내 정보 불러오기
  form.value = {
    name: "김병현",
    username: "wsee2307",
    email: "wsee2307@gmail.com",
    password: "",
    jobField: "개발",
    jobRole: "백엔드 개발자",
    careerLevel: "신입",
  };
});

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

const handleSave = () => {
  alert("정보가 수정되었습니다.");
  router.push("/my/page");
};
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
</style>
