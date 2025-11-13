<template>
  <section class="save-wrapper">
    <!-- HEADER -->
    <header class="page-header">
      <h2>저장된 리포트</h2>
      <p>저장된 리포트를 선택하여 성장 추이를 비교하세요</p>
    </header>

    <div class="layout">
      <!-- LEFT PANEL -->
      <aside class="left-panel">
        <div class="left-header">
          <h3>리포트 목록</h3>

          <div class="header-actions">
            <!-- 🔄 초기화 아이콘 -->
            <i class="ri-loop-right-fill reset-icon" @click="resetSelection"></i>

            <!-- 비교 버튼 -->
            <button class="compare-btn" :disabled="selectedIds.length !== 2" @click="startCompare">선택된 리포트 비교하기</button>
          </div>
        </div>

        <!-- 리포트 카드 리스트 -->
        <ul class="report-list">
          <li
            v-for="report in reports"
            :key="report.id"
            :class="{
              'preview-active': previewId === report.id,
              'checked-active': selectedIds.includes(report.id),
            }"
          >
            <div class="report-card" @click="selectPreview(report)">
              <div class="left-info">
                <h4>{{ report.title }}</h4>
                <p>{{ report.memo }}</p>
                <span class="date">{{ formatDate(report.date) }}</span>
              </div>

              <input type="checkbox" :checked="selectedIds.includes(report.id)" :disabled="!selectedIds.includes(report.id) && selectedIds.length >= 2" @click.stop="toggleCheckbox(report.id)" />
            </div>
          </li>
        </ul>
      </aside>

      <!-- CENTER PANEL -->
      <main class="center-panel">
        <!-- 아무 선택 없음 -->
        <div v-if="!previewId && !isComparing" class="center-empty">
          <p>리포트 목록에서 비교할 리포트를 선택해주세요.</p>
        </div>

        <!-- 미리보기 -->
        <ReportPreview v-else-if="previewId && !isComparing" :report="preview" />

        <!-- 비교 화면 -->
        <ReportCompare v-else-if="isComparing" :reports="compareReports" />
      </main>

      <!-- RIGHT PANEL -->
      <aside class="right-panel">
        <div class="box">
          <h4>주요 성과</h4>

          <div class="result-card">
            <span>✔ 지속적인 성장</span>
            <p>최근 3개월 평균 5% 상승</p>
          </div>

          <div class="result-card">
            <span>✔ 이력서 완성도</span>
            <p>문장 구조 흐름 개선</p>
          </div>
        </div>

        <div class="box stats">
          <h4>전체 통계</h4>

          <ul class="stats-list">
            <li>
              <span class="label">저장된 리포트</span>
              <span class="value">{{ reports.length }}개</span>
            </li>

            <li>
              <span class="label">평균 성장률</span>
              <span class="value">+5.5%</span>
            </li>

            <li>
              <span class="label">최고 점수</span>
              <span class="value">90</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import ReportPreview from "./report/ReportPreview.vue";
import ReportCompare from "./report/ReportCompare.vue";

const reports = ref([
  { id: 1, title: "카카오 면접 대비", memo: "이력서 작성 후 모의 면접 진행", date: "2025-11-15", chartData: {} },
  { id: 2, title: "구글 면접 대비", memo: "구글 코딩 테스트 대비 및 모의 면접 비교", date: "2025-11-15", chartData: {} },
  { id: 3, title: "redis 학습", memo: "이번 주는 redis에 대해 학습함", date: "2025-11-15", chartData: {} },
  { id: 4, title: "포트폴리오 코칭", memo: "모르겠어요", date: "2025-11-15", chartData: {} },
]);

/* 상태 */
const previewId = ref(null); // 클릭해서 보고 있는 리포트
const selectedIds = ref([]); // 체크된 리포트 (항상 0~2개)
const compareIds = ref([]); // 실제 비교에 사용 중인 리포트 2개
const isComparing = ref(false); // 중앙 패널이 비교 모드인지 여부

/* 현재 미리보기 리포트 */
const preview = computed(() => reports.value.find((r) => r.id === previewId.value));

/* 현재 비교에 사용 중인 리포트들 */
const compareReports = computed(() => reports.value.filter((r) => compareIds.value.includes(r.id)));

/* ----------------- FUNCTIONS ----------------- */

/** 카드 클릭 → 항상 미리보기. 비교 중이면 비교 모드 종료. */
function selectPreview(report) {
  if (isComparing.value) {
    isComparing.value = false;
    compareIds.value = [];
  }
  previewId.value = report.id;
}

/** 체크박스 토글 → 최대 2개까지만 허용 */
function toggleCheckbox(id) {
  // 비교 모드였다면 비교 종료 후 새 선택 시작
  if (isComparing.value) {
    isComparing.value = false;
    compareIds.value = [];
  }

  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((v) => v !== id);
  } else {
    if (selectedIds.value.length >= 2) return; // 2개 초과는 무시
    selectedIds.value.push(id);
  }
}

/** 선택 리포트 비교하기 버튼 클릭 */
// function startCompare() {
//   if (selectedIds.value.length !== 2) return;

//   // 지금 선택된 두 개를 비교 대상으로 고정
//   compareIds.value = [...selectedIds.value];

//   // 비교 모드로 전환
//   isComparing.value = true;
//   previewId.value = null;

//   // 체크박스 초기화 (요구사항 3번)
//   selectedIds.value = [];
// }

function startCompare() {
  isComparing.value = true;
  previewId.value = null;
  // selectedIds 초기화 안 함!
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("ko-KR");
}

function resetSelection() {
  selectedIds.value = [];
  compareIds.value = [];
  previewId.value = null;
  isComparing.value = false;
}

</script>

<style scoped>
/* 전체 */
.save-wrapper {
  padding: 20px 60px;
}

/* HEADER */
.page-header h2 {
  font-size: 28px;
  font-weight: 700;
}

.page-header p {
  font-size: 15px;
  color: #666;
}

/* GRID LAYOUT */
.layout {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 530px 790px 460px;
  gap: 15px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reset-icon {
  font-size: 20px;
  cursor: pointer;
  color: #555;
}

.reset-icon:hover {
  color: #71ebbe;
}

/* LEFT PANEL */
.left-panel {
  background: #fafafa;
  border-radius: 10px;
  padding: 25px;
}

.left-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-header h3 {
  font-size: 18px;
  font-weight: 700;
  margin-top: 10px;
}

.compare-btn {
  width: 160px;
  height: 37px;
  background: #000;
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  border: none;
}

.compare-btn:disabled {
  background: #ccc;
}

/* 활성화된 경우에만 hover */
.compare-btn:not(:disabled):hover {
  background: #71ebbe;
  color: #fff;
  transition: 0.2s;
}

/* Report List */
.report-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.report-list li {
  margin-bottom: 10px;
}

.report-card {
  width: 480px;
  height: 95px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.left-info {
  display: flex;
  flex-direction: column;
  gap: 1px; /* 최소 간격 */
}

.left-info h4 {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2; /* 글자간 간격 압축 */
  margin: 0;
}

.left-info p {
  font-size: 14px;
  color: #444;
  line-height: 1.5; /* 줄 간격 최소화 */
  margin: 0;
}

.left-info .date {
  font-size: 11px;
  color: #888;
  margin-top: 10px; /* 날짜는 살짝 띄우기 */
  line-height: 1;
}

/* CENTER PANEL */
.center-panel {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  font-size: 13px;
}

.center-empty {
  margin-top: 250px;
  color: #777;
}

/* 패널 전체 */
.right-panel {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 28px; /* 주요성과 ↔ 전체통계 사이 간격 */
}

/* ------- 주요 성과 ------- */
.right-panel .box > h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #111;
}

.right-panel .result-card {
  background: #f7f7f7;
  border-radius: 10px;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px; /* 카드 사이 간격 */
}

.result-card span {
  font-size: 15px;
  font-weight: 700;
  color: #111;
}

.result-card p {
  font-size: 13px;
  color: #555;
  margin: 0;
}

/* 전체 통계 박스 */
.box.stats {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  display: block;
}

/* 제목 */
.box.stats h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e5e5; /* 이미지처럼 아래 라인 */
  padding-bottom: 10px;
  text-align: left;
}

/* 리스트 */
.stats-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  row-gap: 14px;
}

/* 각 줄 */
.stats-list li {
  display: grid;
  grid-template-columns: 1fr auto; /* 왼쪽 텍스트 / 오른쪽 숫자 */
  align-items: center;
  width: 100%;
}

/* 왼쪽 텍스트 */
.stats-list .label {
  font-size: 14px;
  color: #111;
  font-weight: 400;
  text-align: left;
}

/* 오른쪽 값 */
.stats-list .value {
  font-size: 16px;
  font-weight: 700;
  color: #111;
  text-align: right;
}

/* 클릭한 리포트 (테두리 강조) */
.preview-active .report-card {
  border: 2px solid #71ebbe;
  background: #fff;
}

/* 체크된 리포트 (스타일은 그대로, 체크박스만 색 표시) */
.checked-active .report-card {
  /* 카드 스타일은 기본값 유지 */
}

input[type="checkbox"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
