// 학습 진행 페이지 컴포넌트용 js 파일

import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import learningApi from "@/apis/learningApi";

function useLearningStart() {

  /*-------------------------------------
    공통 상태 정의
  -------------------------------------*/
  const route = useRoute();
  const router = useRouter();
  const learningId = route.query.learningId;

  const isLoading = ref(false); // AI 응답 로딩 스피너용
  const learningTitle = ref("");  // 학습 타이틀
  const loadLearningInfo = async () => {
    const { data } = await learningApi.getLearningDetail(learningId);
    learningTitle.value = data.title;
  }

  /*-------------------------------------------------------
    현재 주차 + 일차 목록
  -------------------------------------------------------*/
  const weeklyProgress = ref([]); // 주차별 학습 진행

  const loadWeeks = async () => {
    const { data } = await learningApi.getWeekListByLearningId(learningId);

    const results = [];

    for (const w of data) {
      const daysRes = await learningApi.getLearningDayByWeek(w.weekId);
      const days = daysRes.data;

      const total = days.length;
      const done = days.filter(d => d.status === "완료").length;
      const ongoing = days.filter(d => d.status === "진행 중").length;

      const progress = Math.round((done / total) * 100);

      results.push({
        weekId: w.weekId,
        weekNumber: w.weekNumber,
        label: `${w.weekNumber}주차`,
        topic: w.title,
        progress,
        status: w.status,
        summary: w.learningWeekSummary,
        days
      });
    }

    weeklyProgress.value = results;
  };

  const weeklyItems = ref([]);

  const loadWeeklyItems = async (weekId) => {
    const { data } = await learningApi.getLearningDayByWeek(weekId);
    weeklyItems.value = data;
  }

  /*-------------------------------------------------------
    진행률 계산
  -------------------------------------------------------*/
  const totalWeeks = computed(() => weeklyProgress.value.length); // 전체 주 수 계산

  // 완료된 주 수
  // const completedWeeks = computed(() => {
  //   return weeklyProgress.value.reduce((acc, w) => {
  //     if (w.status === "완료") return acc + 1;
  //     if (w.status === "진행 중") return acc + 0.5;
  //     return acc;
  //   }, 0);
  // });

  // 현재 진행 중인 주차
  const currentWeek = computed(() => {
    // 진행 중 상태
    const ongoing = weeklyProgress.value.find(w => w.status === "진행 중");
    if (ongoing) return ongoing.weekNumber;

    // 진행 중 없음 -> 다음 예정 주차 찾기
    const nextPlanned = weeklyProgress.value.find(w => w.status === "예정");
    if (nextPlanned) return nextPlanned.weekNumber;

    // 모두 완료 -> 마지막 주차 번호
    return (weeklyProgress.value.length > 0) ? (weeklyProgress.value[weeklyProgress.value.length - 1].weekNumber) : 1;
  });

  const overallProgress = computed(() => {
    // 전체 Day
    const allDays = weeklyProgress.value.flatMap(w => w.days || []);

    const total = allDays.length;
    if (total === 0) return 0;

    const done = allDays.filter(d => d.status === "완료").length;

    return Math.round((done / total) * 100);
  });


  /*-------------------------------------------------------
    페이징
  -------------------------------------------------------*/
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
  const selectedWeek = ref({
    label: "",
    topic: "",
    days: []
  });

  const openWeekModal = async (week) => {

    const { data: days } = await learningApi.getLearningDayByWeek(week.weekId);

    selectedWeek.value = {
      ...week,
      days: days.map(d => ({
        dayId: d.dayId,
        label: `${d.dayNumber}일차`,
        title: d.title,
        desc: d.content,
        memo: d.learningDaySummary,
        open: false
      }))
    };

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
  const fixedMemo = ref("");  // 최종 메모

  const selectItem = async (item) => {
    selectedItem.value = item;

    const { data } = await learningApi.getLearningDayByDayId(item.dayId);

    selectedItem.value = {
      ...item,
      desc: data.content
    };

    // DB에 summary가 있으면 읽기 모드
    if (data.learningDaySummary && !data.learningDaySummary.startsWith("[학습 기록 거부 안내]")) {
      fixedMemo.value = data.learningDaySummary;
      memoContent.value = "";

    } else {
      // 새 메모가 비어있거나 거부 안내문이면 다시 입력
      fixedMemo.value = "";
      memoContent.value = data.learningDaySummary || "";
    }
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
      isLoading.value = true;
      fixedMemo.value = "";

      const dayId = selectedItem.value.dayId; // 일일 학습 ID
      const learningDaySummary = memoContent.value; // 정리 내용

      // AI 검증 + 리라이팅 요청
      const { data } = await learningApi.submitLearningDaySummary(
        dayId,
        learningDaySummary
      );

      if (!data.learningDaySummary.startsWith("[학습 기록 거부 안내]")) {
        fixedMemo.value = data.learningDaySummary;
        selectedItem.value.status = data.status;  // 상태 업데이트
        memoContent.value = "";  // 입력창 초기화

        await loadWeeks();
        const cw = currentWeek.value;
        const currentWeekObj = weeklyProgress.value.find(w => w.weekNumber === cw);
        if (currentWeekObj) {
          await loadWeeklyItems(currentWeekObj.weekId);
        }

      } else {
        memoContent.value = data.learningDaySummary;
        await loadWeeks();

        const cw = currentWeek.value;
        const currentWeekObj = weeklyProgress.value.find(w => w.weekNumber === cw);
        if (currentWeekObj) {
          await loadWeeklyItems(currentWeekObj.weekId);
        }
        return;
      }


    } catch (err) {
      console.error("메모 검증 실패:", err);

    } finally {
      isLoading.value = false;
    }
  };

  // 새로 만들어진 학습 메모 마크다운언어로 파싱
  const parseMarkDown = (text) => {
    return text
      // 굵게 **text**
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // # 제목
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      // 번호 리스트
      .replace(/^\d+\.\s(.*$)/gm, "<li class='num'>$1</li>")
      // 불릿 리스트
      // .replace(/^- (.*$)/gm, "<li class='bullet'>$1</li>")
      // 인용문
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      // 줄바꿈
      .replace(/\n/g, "<br>");
  }

  // 파싱된 메모
  const parsedMemo = computed(() => parseMarkDown(fixedMemo.value));

  onMounted(async () => {

    // 전체 정보 불러오기
    await loadLearningInfo();

    // 주차 정보 불러오기
    await loadWeeks(learningId);

    // 계산
    const cw = currentWeek.value;

    // 현재 주차 찾기
    const currentWeekObj = weeklyProgress.value.find(w => w.weekNumber === cw);

    // 해당 주차의 일별 학습 정보 불러오기
    if (currentWeekObj) {
      await loadWeeklyItems(currentWeekObj.weekId);
    }

  });


  /*-------------------------------------------------------
     폭죽 효과 
 -------------------------------------------------------*/
  const showCongrats = ref(false);
  const fired = ref(false);
  let fireworkInterval = null;

  // 하나의 폭죽 생성
  function spawnFirework(x, y) {
    const fw = document.createElement("dotlottie-player");
    fw.classList.add("firework");

    fw.setAttribute(
      "src",
      "https://lottie.host/824cb754-a11a-4458-bba0-1f5129c3ed76/NuLW5jGi8g.lottie"
    );
    fw.setAttribute("background", "transparent");
    fw.setAttribute("speed", "1");
    fw.setAttribute("loop", "false");
    fw.setAttribute("autoplay", "true");

    const size = 300; // 폭죽 크기
    fw.style.width = size + "px";
    fw.style.height = size + "px";

    fw.style.position = "fixed";
    fw.style.pointerEvents = "none";
    fw.style.zIndex = "99999";

    // 중앙 기준으로 위치 조정 (폭죽 크기의 절반 빼주기)
    fw.style.top = `${y - size / 2}px`;
    fw.style.left = `${x - size / 2}px`;

    document.body.appendChild(fw);

    setTimeout(() => fw.remove(), 1800);
  }

  // 여러 폭죽을 한 번에 터뜨리기
  function burstFireworks() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const offX = Math.random() * screenWidth;
        const offY = Math.random() * screenHeight;
        spawnFirework(offX, offY);
      }, i * 200);
    }
  }


  // 학습코치로 이동 + 폭죽 중단
  function goToCoach() {
    if (fireworkInterval) clearInterval(fireworkInterval);
    router.push("/learning/coach");
  }

  // 전체 진행률 100% 달성 시 실행
  watch(
    () => overallProgress.value,
    (val) => {
      if (val === 100 && !fired.value) {
        fired.value = true;

        // 모달 표시
        showCongrats.value = true;

        // 폭죽 무한 반복 시작
        fireworkInterval = setInterval(() => {
          burstFireworks();
        }, 1500);
      }
    }
  );

  return {
    // 기본 정보
    isLoading,
    learningTitle,
    loadLearningInfo,
    totalWeeks,
    currentWeek,
    overallProgress,

    // 진행률 & 내용
    weeklyProgress,
    weeklyItems,
    loadWeeks,
    loadWeeklyItems,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,

    // 주차 상세 모달
    selectedWeek,
    showWeekModal,
    openWeekModal,
    closeWeekModal,

    // 메모 작성
    selectedItem,
    memoContent,
    fixedMemo,
    parseMarkDown,
    parsedMemo,
    selectItem,
    cancelMemo,
    submitMemo,

    showCongrats,
    goToCoach
  };
}

export default { useLearningStart };