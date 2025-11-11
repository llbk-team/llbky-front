<template>
  <div class="learning-header mb-4">
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="fw-bold fs-3 mb-1" style="color:#111111;">AI 학습 설정</h1>
        <p class="text-muted fs-6 mb-0">
          목표 직무와 학습 목적을 선택하고 나만의 코칭을 시작해보세요!
        </p>
      </div>
    </div>

    <!-- ✅ 진행바 -->
    <div class="progress-container">
      <div class="progress-steps">
        <div class="step" :class="{ active: true }">1</div>
        <span class="step-label">AI 학습 설정</span>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: animatedWidth }"></div>
        </div>

        <div class="step" :class="{ active: currentStep >= 2 }">2</div>
        <span class="step-label">AI 학습 코치</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  currentStep: { type: Number, default: 1 },
});

const store = useStore();
const progress = computed(() => store.getters["learning/getProgress"]); // ✅ 모듈명 추가
const animatedWidth = ref("0%");

watchEffect(() => {
  animatedWidth.value = `${progress.value}%`;
  console.log("현재 진행률:", progress.value); // 디버깅용
});
</script>

<style scoped>
.learning-header {
  background-color: #fff;
}

.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 80%;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #eaecec;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: 0.3s;
}

.step.active {
  background-color: #71ebbe;
  color: #111;
}

.step-label {
  font-size: 14px;
  color: #777;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #eaecec;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #71ebbe, #a2f1d6);
  border-radius: 2px;
  transition: width 0.6s ease;
}
</style>
