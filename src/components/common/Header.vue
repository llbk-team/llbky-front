<template>
  <header class="header">
    <div class="top-container">
      <div class="logo-nav">
        <!-- 로고 클릭 시 홈 이동 + 메뉴 비활성화 -->
        <h1 class="logo" @click="goHome">Career Coach</h1>

        <nav class="main-nav" v-if="isLoggedIn">
          <span v-for="menu in mainMenus" :key="menu.name" class="nav-item" :class="{ active: activeMenu === menu.name }" @click="selectMenu(menu.name)">
            {{ menu.label }}
          </span>
        </nav>

      </div>

      <div class="login">
        <!-- 로그인 상태일 때 -->
        <template v-if="isLoggedIn">
          <span class="welcome">{{ userInfo?.member_name || userInfo?.loginId }}님
          </span>

          <button class="logout-btn" @click="logout">로그아웃</button>
        </template>

        <!-- 로그아웃 상태일 때 -->
        <template v-else>
          <router-link to="/login" :class="{ active: isActive('/login') }">로그인</router-link>
        </template>
      </div>

    </div>

    <div v-if="subMenus[activeMenu]" class="sub-menu">
      <router-link v-for="(sub, idx) in subMenus[activeMenu]" :key="idx" :to="sub.path" class="sub-item" :class="{ active: isActive(sub.path) }">
        {{ sub.label }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

/* -------------------------
  현재 라우트 기반 메뉴 감지
-------------------------- */
const getMenuFromPath = (path) => {
  if (path === "/") return ""; // 홈에서는 메뉴 비활성
  if (path.startsWith("/my")) return "my";
  if (path.startsWith("/resume")) return "resume";
  if (path.startsWith("/interview")) return "interview";
  if (path.startsWith("/learning")) return "learning";
  if (path.startsWith("/trend")) return "trend";
  return "";
};

const activeMenu = ref(getMenuFromPath(route.path));

/* -------------------------
  상단 메뉴 정의
-------------------------- */
const mainMenus = [
  { name: "my", label: "MY" },
  { name: "resume", label: "서류" },
  { name: "interview", label: "면접" },
  { name: "learning", label: "학습" },
  { name: "trend", label: "트렌드" },
];

/* -------------------------
  하위 메뉴
-------------------------- */
const subMenus = {
  // my: [
  //   { label: "마이 페이지", path: "/my/page" },
  //   { label: "내 정보수정", path: "/my/edit" },
  //   { label: "통합 리포트", path: "/my/report" },
  //   { label: "리포트 보관함", path: "/my/save" },
  // ],
  resume: [
    { label: "서류", path: "/resume/list" },
    { label: "서류작성", path: "/resume/write" },


  ],
  interview: [
    { label: "면접 리포트", path: "/interview/report" },
    { label: "모의 면접", path: "/interview/mock" },
  ],
  learning: [
    { label: "학습 코치", path: "/learning/coach" },
    { label: "로드맵", path: "/learning/goal" }
  ],
  trend: [
    { label: "뉴스 요약", path: "/trend/news" },
    { label: "트렌드 분석", path: "/trend/analysis" },
    { label: "직무 인사이트", path: "/trend/insight" },
  ],
};
/* -------------------------
  로그인
-------------------------- */
// 로그인 여부
const isLoggedIn = computed(() => store.getters["user/isLoggedIn"]);

// 유저 정보
const userInfo = computed(() => store.getters["user/userInfo"]);

// 로그아웃 실행
const logout = () => {
  store.dispatch("user/logout");
  router.push("/"); // 홈으로 이동
};


/* -------------------------
  메뉴 클릭 시 이동
-------------------------- */
const selectMenu = (menuName) => {
  activeMenu.value = menuName;

  const defaultPaths = {
    my: "/my/edit",
    resume: "/resume/list",
    interview: "/interview/report",
    learning: "/learning/coach",
    trend: "/trend/news",
  };

  if (defaultPaths[menuName]) {
    router.push(defaultPaths[menuName]);
  }
};

/* -------------------------
  로고 클릭 시 홈 이동 + 메뉴 초기화
-------------------------- */
const goHome = () => {
  activeMenu.value = ""; // 메뉴 비활성
  router.push("/");
};

/* -------------------------
  새로고침 시 메뉴 유지 (라우트 감시)
-------------------------- */
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = getMenuFromPath(newPath);
  },
  { immediate: true }
);

/* -------------------------
  하위 메뉴 활성 상태
-------------------------- */
const isActive = (path) => route.path.startsWith(path);
</script>

<style scoped>
.header {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;
}

/* 상단: 로고 + 메뉴 */
.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 36px 0 36px;
}

.logo-nav {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  cursor: pointer;
}

/* 상위 메뉴 */
.main-nav {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-item {
  cursor: pointer;
  color: #000;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-item.active {
  color: #71EBBE;
  font-weight: 600;
}

.nav-item:hover {
  color: #71EBBE;
}

/* 로그인 */
.login a {
  text-decoration: none;
  color: #000;
  font-size: 13px;
}

.login a.active {
  color: #71EBBE;
}

/* 하위 메뉴 */
.sub-menu {
  border-top: 1px solid #eaeaea;
  padding: 10px 36px;
  display: flex;
  gap: 24px;
  justify-content: flex-start;
  background: #fff;
}

.sub-item {
  text-decoration: none;
  color: #777;
  font-size: 13px;
  transition: color 0.2s;
}

.sub-item.active {
  color: #71EBBE;
  font-weight: 600;
}

.sub-item:hover {
  color: #71EBBE;
}

.logout-btn {
  background: none;
  border: none;
  color: #000;
  font-size: 13px;
  cursor: pointer;
  margin-left: 10px;
}

.logout-btn:hover {
  color: #71EBBE;
}

.welcome {
  font-size: 13px;
  margin-right: 8px;
  color: #555;
}
</style>
