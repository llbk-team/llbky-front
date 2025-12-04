<template>
  <div class="container py-4">
    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <div class="title">학습 리포트</div>
        <div class="subtitle">{{ learningTitle }}</div>
      </div>
      <router-link to="/learning/coach?tab=completed" class="btn btn-outline-green">← 돌아가기</router-link>
    </div>

    <div class="row g-4">
      <!-- 주차 선택 -->
      <div class="col-md-3">
        <div class="card shadow-sm p-3 card-clean">
          <h5 class="fw-bold mb-3 text-dark">주차 선택</h5>
          <ul class="list-group">
            <li v-for="(week, index) in weeks" :key="index" class="list-group-item clickable" :class="{ active: selectedWeekIndex === index }" @click="selectWeek(index)">
              <div class="fw-semibold">{{ week.label }}</div>
              <small class="text-muted">{{ week.topic }}</small>
            </li>
          </ul>
        </div>
      </div>

      <!-- 해당 주차의 일차별 내용 -->
      <div class="col-md-9">
        <div class="card shadow-sm p-4 card-clean">
          <h5 class="fw-bold mb-3 text-dark">{{ currentWeek.label }} 상세 학습 기록</h5>
          <p class="text-muted mb-4">{{ currentWeek.topic }}</p>
          <ul class="list-group">
            <li v-for="(day, dIndex) in currentWeek.days" :key="dIndex" class="list-group-item clickable" @click="toggleDay(dIndex)">
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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import learningApi from "@/apis/learningApi";

const route = useRoute();
const learningId = route.query.learningId;

const learningTitle = ref("");
const weeks = ref([]);
const selectedWeekIndex = ref(0);

async function loadReport() {
  try {
    // 🌟 이제는 단 하나의 API로 전체 로드!
    const res = await learningApi.getLearningDetail(learningId);
    const data = res.data;

    learningTitle.value = data.title;

    // 프론트에서 쓰기 쉬운 구조로 변환
    weeks.value = data.weeks.map(week => ({
      label: `${week.weekNumber}주차`,
      topic: week.title,
      days: week.days.map(day => ({
        label: `${day.dayNumber}일차`,
        title: day.title,
        date: day.learningDate ?? "",   // DB 컬럼 이름에 따라 수정 가능
        memo: day.learningDaySummary,
        open: false
      }))
    }));

  } catch (err) {
    console.error("리포트 로딩 실패:", err);
  }
}

onMounted(loadReport);

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
</script>


<style scoped>
.card-clean {
  border-radius: 16px;
  border: 1px solid #EAEBEC;
  background-color: #FFFFFF;
}

.list-group-item {
  background-color: #F8FAF9;
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
  display: inline-flex;
  align-items: center;
  border: 1px solid #71EBBE;
  color: #111111;
  border-radius: 8px;
  height: 37px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
}

.btn-outline-green:hover {
  background-color: #71EBBE;
  color: #111111;
}

.title {
  font-weight: 700;
  font-size: 28px;
}

.subtitle {
  color: #6C757D;
  font-size: 16px;
  margin-bottom: 0px;
}

</style>
