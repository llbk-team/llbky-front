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
            <i class="ri-loop-right-fill reset-icon" @click="resetSelection"></i>
            <button class="compare-btn" :disabled="selectedIds.length !== 2" @click="startCompare">
              선택된 리포트 비교하기
            </button>
          </div>
        </div>

        <!-- 리포트 카드 리스트 -->
        <ul class="report-list">
          <li v-for="report in reports" :key="report.id" :class="{
            'preview-active': previewId === report.id,
            'checked-active': selectedIds.includes(report.id),
          }">
            <div class="report-card" @click="selectPreview(report)">
              <div class="left-info">
                <h4>{{ report.title }}</h4>
                <p>{{ report.memo }}</p>
                <span class="date">{{ formatDate(report.date) }}</span>
              </div>

              <input type="checkbox" :checked="selectedIds.includes(report.id)"
                :disabled="!selectedIds.includes(report.id) && selectedIds.length >= 2"
                @click.stop="toggleCheckbox(report.id)" />
            </div>
          </li>
        </ul>
      </aside>

      <!-- CENTER PANEL -->
      <main class="center-panel">
        <div v-if="!previewId && !isComparing" class="center-empty">
          <p>리포트 목록에서 비교할 리포트를 선택해주세요.</p>
        </div>

        <ReportPreview v-else-if="previewId && !isComparing" :report="preview" />

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
  { id: 1, title: "카카오 면접 대비", memo: "이력서 작성 후 모의 면접 진행", date: "2025-11-15" },
  { id: 2, title: "구글 면접 대비", memo: "구글 코딩 테스트 대비 및 모의 면접 비교", date: "2025-11-15" },
  { id: 3, title: "redis 학습", memo: "이번 주는 redis에 대해 학습함", date: "2025-11-15" },
  { id: 4, title: "포트폴리오 코칭", memo: "모르겠어요", date: "2025-11-15" },
]);

const previewId = ref(null);
const selectedIds = ref([]);
const compareIds = ref([]);
const isComparing = ref(false);

const preview = computed(() =>
  reports.value.find((r) => r.id === previewId.value)
);

const compareReports = computed(() =>
  reports.value.filter((r) => compareIds.value.includes(r.id))
);

/* FUNCTIONS */
function selectPreview(report) {
  if (isComparing.value) {
    isComparing.value = false;
    compareIds.value = [];
  }
  previewId.value = report.id;
}

function toggleCheckbox(id) {
  if (isComparing.value) {
    isComparing.value = false;
    compareIds.value = [];
  }

  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((v) => v !== id);
  } else {
    if (selectedIds.value.length >= 2) return;
    selectedIds.value.push(id);
  }
}

function startCompare() {
  isComparing.value = true;
  previewId.value = null;
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
  padding: 1.25rem 3.75rem;
  /* 20px 60px */
  /* min-width 제거 → 반응형 동작 */
}

/* HEADER */
.page-header h2 {
  font-size: 1.75rem;
  /* 28px */
  font-weight: 700;
}

.page-header p {
  font-size: 0.95rem;
  /* 15px */
  color: #666;
}

/* GRID LAYOUT — ★ 완전 반응형 3단 핵심 */
.layout {
  margin-top: 1.25rem;
  display: grid;

  /* px 기반 → 비율 기반 + 최소 보장폭(minmax) */
  grid-template-columns:
    minmax(260px, 29.77%) minmax(360px, 44.38%) minmax(240px, 25.85%);

  gap: 15px;
}

/* header actions */
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
  padding: 1.6rem;
}

.left-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
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
  width: 100%;
  /* ★ 480px → 100% : 완전 반응형 핵심 */
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
  gap: 2px;
}

.left-info h4 {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
}

.left-info p {
  font-size: 0.88rem;
  color: #444;
  line-height: 1.4;
  margin: 0;
}

.left-info .date {
  font-size: 0.7rem;
  color: #888;
  margin-top: 8px;
}

/* CENTER PANEL */
.center-panel {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  font-size: 0.85rem;
}

.center-empty {
  margin-top: 250px;
  color: #777;
}

/* RIGHT PANEL */
.right-panel {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ------- 주요 성과 ------- */
.right-panel .box>h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #111;
}

.right-panel .result-card {
  background: #f7f7f7;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.result-card span {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111;
}

.result-card p {
  font-size: 0.85rem;
  color: #555;
  margin: 0;
}

/* 전체 통계 박스 */
.box.stats {
  background: #ffffff;
  padding: 1.6rem 1.8rem;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  width: 100%;

  display: flex;
  /* ⭐ 해결 핵심 */
  flex-direction: column;
  /* ⭐ 제목 아래 리스트 배치 */
  gap: 1rem;
  /* 리스트와 제목 간격 */
}

/* 제목 + 구분선 */
.box.stats h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e5e5;
  color: #111;
  text-align: left;
}

/* 리스트 */
.stats-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  /* ⭐ 세로 정렬 */
  gap: 18px;
}

/* 각 항목 */
.stats-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 왼쪽 라벨 */
.stats-list .label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #111;
}

/* 오른쪽 값 */
.stats-list .value {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111;
}

/* 클릭한 리포트 (테두리 강조) */
.preview-active .report-card {
  border: 2px solid #71ebbe;
  background: #fff;
}

/* 체크된 리포트 */
.checked-active .report-card {}

/* 비활성 체크박스 스타일 */
input[type="checkbox"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
