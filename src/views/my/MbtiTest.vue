<template>
  <aside class="mbti-card">
    <div v-for="item in mbtiData" :key="item.key" class="mbti-row">
      <!-- 왼쪽 -->
      <div class="side left" :class="{ active: item.leftPercent > item.rightPercent }">
        <span class="letter">{{ item.left }}</span>
        <span class="label">{{ item.leftLabel }}</span>
      </div>

      <!-- 중앙 진행 라인 -->
      <div class="bar-area">
        <!-- 라인 위의 퍼센트 -->
        <div class="percent-line">
          <span class="percent">{{ item.leftPercent }}%</span>
          <span class="percent right">{{ item.rightPercent }}%</span>
        </div>

        <!-- 단일 진행 라인 -->
        <div class="progress-bar">
          <div class="progress-fill" :style="getBarStyle(item)"></div>
        </div>
      </div>

      <!-- 오른쪽 -->
      <div class="side right" :class="{ active: item.rightPercent > item.leftPercent }">
        <span class="letter">{{ item.right }}</span>
        <span class="label">{{ item.rightLabel }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

const mbtiData = ref([
  { key: "EI", left: "E", right: "I", leftLabel: "외향", rightLabel: "내향", leftPercent: 40, rightPercent: 60 },
  { key: "SN", left: "S", right: "N", leftLabel: "현실", rightLabel: "직관", leftPercent: 49, rightPercent: 51 },
  { key: "TF", left: "T", right: "F", leftLabel: "사고", rightLabel: "감정", leftPercent: 56, rightPercent: 44 },
  { key: "PJ", left: "P", right: "J", leftLabel: "인식", rightLabel: "직관", leftPercent: 55, rightPercent: 45 },
]);

const getBarStyle = (item) => {
  const mint = "#71EBBE";
  const gray = "#EAEBEC";

  const left = item.leftPercent;
  const right = item.rightPercent;

  if (left > right) {
    // 왼쪽 우세
    return {
      background: `linear-gradient(to right, ${mint} ${left}%, ${gray} ${left}%)`,
    };
  } else {
    // 오른쪽 우세
    return {
      background: `linear-gradient(to right, ${gray} ${left}%, ${mint} ${left}%)`,
    };
  }
};
</script>

<style scoped>
.mbti-card {
  padding: 10px 15px;
  border-radius: 12px;
  color: #ffffff;
  max-width: 720px;
  margin: 0 auto;
  font-family: Pretendard, sans-serif;
}

/* MBTI 행 */
.mbti-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* 좌우 영역 */
.side {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
  color: #eaebec;
  transition: color 0.3s ease;
}
.side.active {
  color: #71ebbe;
}
.letter {
  font-size: 40px;
  font-weight: 900;
  line-height: 1;
}
.label {
  font-size: 14px;
  font-weight: 700;
  margin-top: 5px;
}

/* 중앙 바 */
.bar-area {
  flex: 1;
  margin: 0 12px;
  position: relative;
}

/* 퍼센트 */
.percent-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.percent {
  font-size: 10px;
  color: #ffffff;
  font-weight: 600;
}
.percent.right {
  text-align: right;
}

/* 진행바 */
.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #eaebec;
  border-radius: 0;
  overflow: hidden;
}
.progress-fill {
  width: 100%;
  height: 100%;
  transition: background 0.4s ease;
  border-radius: 0;
}
</style>
