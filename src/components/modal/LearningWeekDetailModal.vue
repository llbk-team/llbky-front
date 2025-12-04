<template>
  <div class="modal-backdrop" v-if="week && week.days">
    <div class="modal-content p-4 rounded-4 shadow-lg">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">{{ week.label }} - {{ week.topic }}</h5>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>

      <!-- ✅ 내부 스크롤 영역 -->
      <div class="scroll-area">
        <ul class="list-group mb-3">
          <li
            v-for="(day, i) in week.days"
            :key="i"
            class="list-group-item clickable"
            @click="toggleDay(i)"
          >
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-semibold">{{ day.label }} - {{ day.title }}</span>
              <small class="text-muted">{{ day.open ? "접기 ▲" : "펼치기 ▼" }}</small>
            </div>

            <!-- ✅ 펼침 영역 -->
            <div v-show="day.open" class="fade-section mt-2">
              <p class="small text-muted mb-2">{{ day.desc }}</p>

              <div v-if="day.memo" class="note-box p-3 rounded-3 border bg-light">
                <h6 class="fw-semibold small mb-2">📝 정리 노트</h6>
                <p class="small mb-0" style="white-space: pre-line;">{{ day.memo }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";

const props = defineProps({
  week: {
    type: Object,
    required: true
  },
});

const week = computed(() => props.week);

function toggleDay(index) {
  week.value.days[index].open = !week.value.days[index].open;
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

/* ✅ 모달 크기 고정 */
.modal-content {
  background: #fff;
  width: 720px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
}

/* ✅ 내부 스크롤 */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
}

/* 리스트 스타일 */
.list-group-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
  border-radius: 8px;
}

.clickable {
  cursor: pointer;
  user-select: none;
}

.note-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  margin-top: 8px;
  white-space: pre-line;
}

/* 부드러운 오픈 효과 */
.fade-section {
  transition: opacity 0.25s ease;
}
.fade-section[style*="display: none"] {
  opacity: 0;
}
</style>
