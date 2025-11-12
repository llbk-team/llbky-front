<!-- ✅ src/components/WeekDetailModal.vue -->
<template>
  <div class="week-modal-overlay" @click.self="$emit('close')">
    <div class="week-modal-content shadow-lg">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">{{ week.label }} 상세 학습 내용</h5>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>

      <p class="text-muted mb-3">
        {{ week.topic }} 관련 세부 학습 항목입니다.
      </p>

      <ul class="list-group mb-4">
        <li
          v-for="(detail, i) in week.details"
          :key="i"
          class="list-group-item"
        >
          {{ detail }}
        </li>
      </ul>

      <div class="text-end">
        <button class="btn btn-dark" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  week: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.week-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.week-modal-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  color: #111111;
  animation: fadeIn 0.3s ease;
}

.list-group-item {
  background: #F1F2F3;
  border: 1px solid #EAEBEC;
  margin-bottom: 8px;
  border-radius: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
