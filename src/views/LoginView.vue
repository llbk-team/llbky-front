<template>
  <div class="login-page">
    <div class="login-container">
      <h2>로그인</h2>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">아이디</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div class="input-group">
          <label for="password">비밀번호</label>
          <div class="password-box">
            <input
              id="password"
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

        <button type="submit" class="btn-login" :disabled="!username || !password">
          로그인
        </button>

        <div class="divider">
          <span>또는</span>
        </div>

        <button type="button" class="btn-signup" @click="goSignup">회원가입</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const showPassword = ref(false);

const handleLogin = () => {
  alert(`로그인 시도: ${username.value}`);
};

const goSignup = () => {
  router.push("/signup");
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  background: #fff;
}

.login-container {
  width: 350px;
  text-align: left;
}

h2 {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
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
  box-sizing: border-box;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  outline: none;
}

input:focus {
  border-color: #71ebbe;
}

/* ✅ 비밀번호 박스 정렬 */
.password-box {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.password-box input {
  width: 100%;
  padding-right: 38px; /* 아이콘 공간 확보 */
}

.toggle-icon {
  position: absolute;
  right: 12px;
  font-size: 18px;
  color: #777;
  cursor: pointer;
}

.btn-login {
  width: 100%;
  background: #f1f2f3;
  color: #999;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  padding: 12px 0;
  margin-top: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-login:enabled {
  background: #71ebbe;
  color: #000;
}

.btn-login:enabled:hover {
  background: #a2f1d6;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  font-size: 13px;
  color: #aaa;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
  margin: 0 10px;
}

.btn-signup {
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  color: #111;
  font-size: 15px;
  font-weight: 600;
  border-radius: 4px;
  padding: 12px 0;
  cursor: pointer;
  transition: 0.2s;
}

.btn-signup:hover {
  background: #f9f9f9;
}
</style>
