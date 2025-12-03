// 학습 진행 페이지 컴포넌트용 js 파일

import { ref, computed } from "vue";
import learningApi from "@/apis/learningApi";
import WeekDetailModal from "@/components/modal/LearningWeekDetailModal.vue";

function useLearningStart() {

  /*-------------------------------------
    상태 정의
  -------------------------------------*/
  const weeklyHours = ref(25);
  const currentWeek = ref(2); 
  const overallProgress = ref(45);  // 진행률

  const weeklyProgress = ref([
    {
      label: "1주차",
      topic: "Java 기초",
      progress: 100,
      details: [
        "1일차: Java 개발 환경 설정 및 Hello World 출력",
        "2일차: 변수, 자료형, 연산자 실습",
        "3일차: 조건문과 반복문 학습",
        "4일차: 배열과 메서드 이해",
        "5일차: 클래스와 객체 개념 정리",
        "6일차: 간단한 콘솔 미니프로젝트 제작",
        "7일차: 주간 복습 및 퀴즈",
      ],
    },
    {
      label: "2주차",
      topic: "Spring Security",
      progress: 60,
      details: [
        "1일차: 스프링 시큐리티 구조와 필터 이해",
        "2일차: AuthenticationManager 학습",
        "3일차: JWT 발급 및 검증 로직 구현",
        "4일차: OAuth2 로그인 구조 실습",
        "5일차: AccessDeniedHandler 설정",
        "6일차: 커스텀 로그인 페이지 구현",
        "7일차: 예외 처리 및 테스트",
      ],
    },
    {
      label: "3주차",
      topic: "JPA & Database",
      progress: 0,
      details: [
        "1일차: JPA 환경 설정 및 기본 CRUD",
        "2일차: Entity 매핑 실습",
        "3일차: 연관관계 매핑 (1:N, N:M)",
        "4일차: JPQL 쿼리 작성",
        "5일차: 영속성 컨텍스트 이해",
        "6일차: 트랜잭션 및 롤백 실습",
        "7일차: 데이터베이스 최적화 복습",
      ],
    },
    {
      label: "4주차",
      topic: "REST API 설계",
      progress: 0,
      details: [
        "1일차: RESTful 설계 원칙 학습",
        "2일차: Controller 및 Service 설계",
        "3일차: 요청/응답 구조 정의",
        "4일차: 예외 처리(Exception Handling)",
        "5일차: Swagger API 문서화",
        "6일차: 배포 환경 테스트",
        "7일차: 프로젝트 리팩토링 및 점검",
      ],
    },
  ]); // 주차별 학습 진행

  // 현재 주차 - 일차 목록
  const weeklyItems = ref([
    { day: "1일차", title: "인증/인가 개념 이해", status: "완료" },
    { day: "2일차", title: "AuthenticationManager 학습", status: "완료" },
    { day: "3일차", title: "Security 필터 체인 구조", status: "진행 중" },
    { day: "4일차", title: "JWT 발급/검증 로직 구현", status: "진행 중" },
    { day: "5일차", title: "OAuth2 로그인 실습", status: "예정" },
    { day: "6일차", title: "AccessDeniedHandler 적용", status: "예정" },
    { day: "7일차", title: "테스트 및 마무리", status: "예정" },
  ]);

  const currentPage = ref(1); // 현재 페이지
  const itemsPerPage = 4; // 첫 페이지에 1~4일차, 두 번째 페이지에 5~7일차

  const totalPages = computed(() =>
    Math.ceil((weeklyItems.value?.length || 0) / itemsPerPage)
  );

  const paginatedItems = computed(() => {
    if (!weeklyItems.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage;
    return weeklyItems.value.slice(start, start + itemsPerPage);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
  }
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  }

  /*-------------------------------------------------------
    주차 상세 모달 관련 상태/기능
  -------------------------------------------------------*/
  const showWeekModal = ref(false);
  const selectedWeek = ref(null);
  
  const openWeekModal = (week) => {
    selectedWeek.value = week;
    showWeekModal.value = true;
  }
  
  const closeWeekModal = () => {
    showWeekModal.value = false;
  }
  
  
  /*-------------------------------------------------------
    일차 선택 + 학습 메모 입력
  -------------------------------------------------------*/
  const selectedItem = ref(null);
  const memoContent = ref("");

  const selectItem = (item) => {
    selectedItem.value = item;
    memoContent.value = "";
  }

  const cancelMemo = () => {
    selectedItem.value = null;
    memoContent.value = "";
  }

  /*-------------------------------------------------------
    일일 학습 메모 제출 (AI 메모 검증 -> 재정리)
  -------------------------------------------------------*/
  const submitMemo = async () => {
    if (!selectedItem.value || !memoContent.value.trim()) {
      memoContent.value = "✏️ 메모를 먼저 입력해주세요!";
      return;
    }

    try {
      const dayId = selectedItem.value.dayId; // 일일 학습 ID
      const learningDaySummary = memoContent.value; // 정리 내용

      // AI 검증 + 리라이팅 요청
      const { data } = await learningApi.submitLearningDaySummary(
        dayId,
        learningDaySummary
      );

      // 상태 업데이트
      selectedItem.value.status = data.status;

      // 입력창 초기화
      memoContent.value = "";

    } catch (err) {
      console.error("메모 검증 실패:", err);
    }
  };

  /*-------------------------------------------------------
    학습 타이머
  -------------------------------------------------------*/
  const timer = ref(0); // 총 시간(초)
  const timerRunning = ref(false);
  let timerInterval = null;

  const formattedTime = computed(() => {
    const h = String(Math.floor(timer.value / 3600)).padStart(2, "0");
    const m = String(Math.floor((timer.value % 3600) / 60)).padStart(2, "0");
    const s = String(timer.value % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  });

  const startTimer = () => {
    if (timerRunning.value) return;
    timerRunning.value = true;

    timerInterval = setInterval(() => {
      timer.value++;
    }, 1000);
  }

  const pauseTimer = () => {
    timerRunning.value = false;
    clearInterval(timerInterval);
  }

  return {
    // 기본 정보
    weeklyHours,
    currentWeek,
    overallProgress,

    // 진행률 & 내용
    weeklyProgress,
    weeklyItems,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,

    // 주차 상세 모달
    showWeekModal,
    openWeekModal,
    closeWeekModal,

    // 메모 작성
    selectedItem,
    memoContent,
    selectItem,
    cancelMemo,
    submitMemo,

    // 타이머
    timer,
    timerRunning,
    formattedTime,
    startTimer,
    pauseTimer,
  };
}

export default { useLearningStart };