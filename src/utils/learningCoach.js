// utils/learningCoach.js

import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import learningApi from "@/apis/learningApi";

export function useLearningCoach() {

  const router = useRouter();
  const route = useRoute();
   const store = useStore();

  const user = store.getters["user/userInfo"];
  const memberId = user?.memberId;

  // ===============================
  //        학습 리스트 로드
  // ===============================
  const ongoingPlans = ref([]);
  const completedPlans = ref([]);

  async function loadLearningList() {
    try {
      const ongoingRes = await learningApi.getLearningList(memberId, "진행중");
      const completedRes = await learningApi.getLearningList(memberId, "완료");

      ongoingPlans.value = [];
      completedPlans.value = [];

      // 진행중 학습
      for (const item of ongoingRes.data) {
        const { data: weeks } = await learningApi.getWeekListByLearningId(item.learningId);
        const progress = calculateProgress(weeks);

        ongoingPlans.value.push({
          id: item.learningId,
          title: item.title,
          period: `${weeks.length}주 플랜`,
          progress
        });
      }

      // 완료된 학습
      for (const item of completedRes.data) {
        const { data: weeks } = await learningApi.getWeekListByLearningId(item.learningId);
        const progress = calculateProgress(weeks);

        completedPlans.value.push({
          id: item.learningId,
          title: item.title,
          period: `${weeks.length}주 플랜`,
          completedDate: item.updatedAt?.substring(0, 10) || "미확인",
          progress
        });
      }

    } catch (e) {
      console.error("학습 리스트 로드 실패:", e);
    }
  }

  function calculateProgress(weeks) {
    if (!weeks || weeks.length === 0) return 0;

    let completedWeeks = 0;

    weeks.forEach(w => {
      if (w.status === "완료") completedWeeks += 1;
      else if (w.status === "진행 중") completedWeeks += 0.5;
    });

    return Math.round((completedWeeks / weeks.length) * 100);
  }

  // ===============================
  //        탭
  // ===============================
  const currentTab = ref(route.query.tab || "ongoing");

  function setTab(tabName) {
    currentTab.value = tabName;
    router.replace({ query: { tab: tabName } });
  }

  // ===============================
  //        페이지네이션
  // ===============================
  const ongoingPage = ref(1);
  const completedPage = ref(1);
  const itemsPerPage = 3;

const totalOngoingPages = computed(() =>
  Math.max(1, Math.ceil(ongoingPlans.value.length / itemsPerPage))
);

const totalCompletedPages = computed(() =>
  Math.max(1, Math.ceil(completedPlans.value.length / itemsPerPage))
);


  const pagedOngoingPlans = computed(() => {
    const start = (ongoingPage.value - 1) * itemsPerPage;
    return ongoingPlans.value.slice(start, start + itemsPerPage);
  });

  const pagedCompletedPlans = computed(() => {
    const start = (completedPage.value - 1) * itemsPerPage;
    return completedPlans.value.slice(start, start + itemsPerPage);
  });

  function nextPage(type) {
    if (type === "ongoing" && ongoingPage.value < totalOngoingPages.value)
      ongoingPage.value++;
    if (type === "completed" && completedPage.value < totalCompletedPages.value)
      completedPage.value++;
  }

  function prevPage(type) {
    if (type === "ongoing" && ongoingPage.value > 1) ongoingPage.value--;
    if (type === "completed" && completedPage.value > 1) completedPage.value--;
  }

  // ===============================
  //        달력
  // ===============================
  const today = new Date();
  const year = ref(today.getFullYear());
  const month = ref(today.getMonth());
  const calendar = ref([]);

  function generateCalendar() {
    const firstDay = new Date(year.value, month.value, 1).getDay();
    const daysInMonth = new Date(year.value, month.value + 1, 0).getDate();

    let temp = [];
    let week = Array(7).fill(0);
    let day = 1;

    for (let i = firstDay; i < 7; i++) week[i] = day++;
    temp.push(week);

    while (day <= daysInMonth) {
      week = Array(7).fill(0);
      for (let i = 0; i < 7 && day <= daysInMonth; i++) week[i] = day++;
      temp.push(week);
    }

    calendar.value = temp;
  }

  function prevMonth() {
    if (month.value === 0) {
      month.value = 11;
      year.value--;
    } else {
      month.value--;
    }
    generateCalendar();
  }

  function nextMonth() {
    if (month.value === 11) {
      month.value = 0;
      year.value++;
    } else {
      month.value++;
    }
    generateCalendar();
  }

  function isToday(d) {
    return (
      d === today.getDate() &&
      month.value === today.getMonth() &&
      year.value === today.getFullYear()
    );
  }

  generateCalendar();

  // ===============================
  //      학습 개수 로드
  // ===============================
  const stats = ref({ ongoing: 0, completed: 0 });

  async function loadLearningCount() {
    try {
      const res = await learningApi.getLearningCount(memberId);
      stats.value.ongoing = res.data.ongoing;
      stats.value.completed = res.data.completed;
    } catch (e) {
      console.error("학습 개수 로드 실패:", e);
    }
  }

  // ===============================
  //        리포트 이동
  // ===============================
  function goToReport(plan) {
    router.push(`/learning/report?learningId=${plan.id}`);
  }

  onMounted(() => {
    loadLearningList();
    loadLearningCount();
  });

  return {
    ongoingPlans,
    completedPlans,
    pagedOngoingPlans,
    pagedCompletedPlans,

    // 페이지 번호 추가
    ongoingPage,
    completedPage,

    // 페이지네이션 관련
    nextPage,
    prevPage,
    totalOngoingPages,
    totalCompletedPages,

    // 탭
    currentTab,
    setTab,

    // 달력
    calendar,
    year,
    month,
    prevMonth,
    nextMonth,
    isToday,

    // 통계 & 이동
    stats,
    goToReport,
};

}
