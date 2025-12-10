// src/views/learning/learningReport.js
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import learningApi from "@/apis/learningApi";
import { marked } from "marked";

function learningReport() {
  const route = useRoute();
  const learningId = route.query.learningId;

  const learningTitle = ref("");
  const weeks = ref([]);
  const selectedWeekIndex = ref(0);

  // 데이터 로드
  async function loadReport() {
    try {
      const res = await learningApi.getLearningDetail(learningId);
      const data = res.data;

      learningTitle.value = data.title;

      weeks.value = data.weeks.map((week) => ({
        label: `${week.weekNumber}주차`,
        topic: week.title,
        days: week.days.map((day) => ({
          label: `${day.dayNumber}일차`,
          title: day.title,
          date: day.learningDate ?? "",
          memo: marked(day.learningDaySummary || ""),
          open: false
        }))
      }));
    } catch (err) {
      console.error("리포트 로딩 실패:", err);
    }
  }

  // 현재 주차
  const currentWeek = computed(() =>
    weeks.value[selectedWeekIndex.value] || { days: [] }
  );

  function selectWeek(index) {
    selectedWeekIndex.value = index;
  }

  function toggleDay(index) {
    currentWeek.value.days[index].open =
      !currentWeek.value.days[index].open;
  }

  onMounted(loadReport);

  return {
    learningTitle,
    weeks,
    selectedWeekIndex,
    currentWeek,
    selectWeek,
    toggleDay
  };
}

export default learningReport;
