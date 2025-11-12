<template>
  <div class="container py-4">
    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="fw-bold fs-3 mb-1" style="color:#111111;">📘 학습 리포트</h1>
        <p class="text-muted mb-0">백엔드 취업 준비 · 총 4주 / 28일 학습 기록</p>
      </div>
      <router-link to="/learning/coach?tab=completed" class="btn btn-outline-green">← 돌아가기</router-link>
    </div>

    <div class="row g-4">
      <!-- 왼쪽: 주차 선택 -->
      <div class="col-md-3">
        <div class="card shadow-sm p-3 card-clean">
          <h5 class="fw-bold mb-3 text-dark">주차 선택</h5>
          <ul class="list-group">
            <li
              v-for="(week, index) in weeks"
              :key="index"
              class="list-group-item clickable"
              :class="{ active: selectedWeekIndex === index }"
              @click="selectWeek(index)"
            >
              <div class="fw-semibold">{{ week.label }}</div>
              <small class="text-muted">{{ week.topic }}</small>
            </li>
          </ul>
        </div>
      </div>

      <!-- ✅ 오른쪽: 해당 주차의 일차별 내용 -->
      <div class="col-md-9">
        <div class="card shadow-sm p-4 card-clean">
          <h5 class="fw-bold mb-3 text-dark">{{ currentWeek.label }} 상세 학습 기록</h5>
          <p class="text-muted mb-4">{{ currentWeek.topic }}</p>

          <ul class="list-group">
            <li
              v-for="(day, dIndex) in currentWeek.days"
              :key="dIndex"
              class="list-group-item clickable"
              @click="toggleDay(dIndex)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ day.label }}</strong> - {{ day.title }}
                </div>
                <span class="text-muted small">
                  {{ day.open ? "접기 ▲" : "펼치기 ▼" }}
                </span>
              </div>

              <transition name="slide">
                <div v-if="day.open" class="mt-2 p-3 rounded bg-light">
                  <p class="small text-muted mb-1">{{ day.date }}</p>
                  <p class="mb-0">{{ day.memo }}</p>
                </div>
              </transition>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedWeekIndex = ref(0);

const weeks = ref([
  {
    label: "1주차",
    topic: "Spring Boot 기본기 다지기",
    days: [
      { label: "1일차", title: "프로젝트 세팅", date: "2025-01-01", memo: "Spring Initializr로 기본 구조 생성", open: false },
      { label: "2일차", title: "Controller 학습", date: "2025-01-02", memo: "REST API 개념 정리", open: false },
      { label: "3일차", title: "Service 계층 구현", date: "2025-01-03", memo: "비즈니스 로직 구조 설계", open: false },
      { label: "4일차", title: "Repository 학습", date: "2025-01-04", memo: "JPA 기본 문법 복습", open: false },
      { label: "5일차", title: "DB 연동 테스트", date: "2025-01-05", memo: "CRUD 테스트 수행", open: false },
      { label: "6일차", title: "예외 처리", date: "2025-01-06", memo: "ControllerAdvice로 전역 예외 처리", open: false },
      { label: "7일차", title: "정리 및 복습", date: "2025-01-07", memo: "1주차 핵심 개념 요약", open: false },
    ],
  },
  {
    label: "2주차",
    topic: "Spring Security 심화",
    days: [
      { label: "1일차", title: "SecurityConfig", date: "2025-01-08", memo: "인증/인가 흐름 파악", open: false },
      { label: "2일차", title: "JWT 발급", date: "2025-01-09", memo: "JWT 구조 이해 및 발급 로직 구현", open: false },
      { label: "3일차", title: "필터 체인 분석", date: "2025-01-10", memo: "FilterChainProxy 구조 학습", open: false },
      { label: "4일차", title: "로그인 기능 구현", date: "2025-01-11", memo: "Custom AuthenticationProvider 적용", open: false },
      { label: "5일차", title: "회원가입", date: "2025-01-12", memo: "BCryptPasswordEncoder 적용", open: false },
      { label: "6일차", title: "리프레시 토큰", date: "2025-01-13", memo: "Access/Refresh Token 재발급 로직 추가", open: false },
      { label: "7일차", title: "2주차 복습", date: "2025-01-14", memo: "Security 전반 흐름 정리", open: false },
    ],
  },
  {
    label: "3주차",
    topic: "JPA와 QueryDSL로 데이터 다루기",
    days: [
      { label: "1일차", title: "JPA 기초 복습", date: "2025-01-15", memo: "EntityManager 동작 이해", open: false },
      { label: "2일차", title: "연관관계 매핑", date: "2025-01-16", memo: "1:N, N:M 관계 매핑 실습", open: false },
      { label: "3일차", title: "JPQL과 NativeQuery", date: "2025-01-17", memo: "쿼리 최적화 실습", open: false },
      { label: "4일차", title: "QueryDSL 설정", date: "2025-01-18", memo: "Q클래스 생성 및 빌더 문법 학습", open: false },
      { label: "5일차", title: "조건 검색", date: "2025-01-19", memo: "BooleanBuilder 활용", open: false },
      { label: "6일차", title: "페이징 처리", date: "2025-01-20", memo: "Pageable 사용법 익히기", open: false },
      { label: "7일차", title: "정리", date: "2025-01-21", memo: "JPA와 QueryDSL 차이 비교", open: false },
    ],
  },
  {
    label: "4주차",
    topic: "프로젝트 마무리 및 리팩토링",
    days: [
      { label: "1일차", title: "Controller 리팩토링", date: "2025-01-22", memo: "응답 DTO 구조 정리", open: false },
      { label: "2일차", title: "에러 코드 일원화", date: "2025-01-23", memo: "Custom Exception 개선", open: false },
      { label: "3일차", title: "테스트 코드 작성", date: "2025-01-24", memo: "JUnit5 / MockMVC 활용", open: false },
      { label: "4일차", title: "Swagger 문서화", date: "2025-01-25", memo: "API 문서 자동화 설정", open: false },
      { label: "5일차", title: "CI/CD 설정", date: "2025-01-26", memo: "GitHub Actions 배포 자동화", open: false },
      { label: "6일차", title: "서버 배포", date: "2025-01-27", memo: "AWS EC2 배포 테스트", open: false },
      { label: "7일차", title: "최종 회고", date: "2025-01-28", memo: "전체 학습 리뷰 및 개선점 정리", open: false },
    ],
  },
]);

const currentWeek = computed(() => weeks.value[selectedWeekIndex.value]);

function selectWeek(index) {
  selectedWeekIndex.value = index;
}

function toggleDay(index) {
  const day = currentWeek.value.days[index];
  day.open = !day.open;
}
</script>

<style scoped>
.card-clean {
  border-radius: 1rem;
  border: 1px solid #EAEBEC;
  background-color: #FFFFFF;
}
.list-group-item {
  background: #F8FAF9;
  border: 1px solid #EAEBEC;
  margin-bottom: 8px;
  border-radius: 8px;
  color: #111111;
  transition: 0.2s;
}
.list-group-item.active {
  background-color: #DDF3EB;
  border-color: #71EBBE;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  background-color: #F1F2F3;
}
.bg-light {
  background-color: #F8FAF9;
}

.btn-outline-green {
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 0.5rem;
}
.btn-outline-green:hover {
  background-color: #71EBBE;
  color: #111111;
}
</style>
