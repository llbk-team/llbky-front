<template>
  <aside class="profile-card">
    <div class="profile-header">
      <div class="avatar"></div>
      <div class="profile-info">
        <h2>김병현</h2>
        <p class="email">wsee2307@gmail.com</p>
      </div>
    </div>

    <div class="profile-body">
      <div class="profile-row" v-for="(item, i) in infoList" :key="i">
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ item.value }}</span>
      </div>

      <div class="divider"></div>

      <section class="stack">
        <h3>보유 기술 스택</h3>
        <div class="tags">
          <span class="tag tag-border">Java</span>
          <span class="tag tag-fill">Spring</span>
        </div>
      </section>

      <div class="divider"></div>

      <section class="ai-personality">
        <h3>AI 성격 기반 분석</h3>
        <p class="desc">
          당신은 명확한 목표가 있을 때 가장 빠르게 성장합니다.<br />
          기술 깊이를 유지하면서 감정·공감 표현력을 조금만 확장해보세요.
        </p>

        <div v-for="item in mbtiData" :key="item.key" class="mbti-row">
          <div class="mbti-labels">
            <span :class="{ active: item.leftActive }">{{ item.left }}</span>
            <span :class="{ active: item.rightActive }">{{ item.right }}</span>
          </div>
          <div class="mbti-bar">
            <div class="bar-left" :style="{ width: item.leftPercent + '%' }"></div>
            <div class="bar-right" :style="{ width: item.rightPercent + '%' }"></div>
          </div>
          <div class="mbti-percent">
            <span>{{ item.leftPercent }}%</span>
            <span>{{ item.rightPercent }}%</span>
          </div>
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

const infoList = ref([
  { label: "경력", value: "신입" },
  { label: "직군", value: "개발" },
  { label: "직무", value: "백엔드 개발자" },
]);

const mbtiData = ref([
  { key: "EI", left: "E", right: "I", leftPercent: 56, rightPercent: 44, leftActive: true, rightActive: false },
  { key: "SN", left: "S", right: "N", leftPercent: 51, rightPercent: 49, leftActive: true, rightActive: false },
  { key: "TF", left: "T", right: "F", leftPercent: 56, rightPercent: 44, leftActive: true, rightActive: false },
  { key: "PJ", left: "P", right: "J", leftPercent: 45, rightPercent: 55, leftActive: false, rightActive: true },
]);
</script>

<style scoped>
.profile-card {
  grid-area: profile;
  background-color: #111111;
  color: #ffffff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background-color: #91efcd;
  margin-right: 15px;
}
.profile-info h2 {
  font-size: 25px;
  font-weight: 800;
}
.email {
  font-size: 13px;
  color: #949494;
}
.profile-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.label {
  font-size: 16px;
}
.value {
  font-size: 14px;
  color: #a2f1d6;
}
.divider {
  border-top: 1px solid #757575;
  margin: 20px 0;
}
.stack h3 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 10px;
}
.tags {
  display: flex;
  gap: 8px;
}
.tag {
  font-size: 15px;
  padding: 4px 14px;
  border-radius: 30px;
}
.tag-border {
  border: 1px solid #91efcd;
  color: #91efcd;
}
.tag-fill {
  background-color: #374e46;
  color: #91efcd;
}
.ai-personality h3 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
}
.desc {
  font-size: 13px;
  color: #c2c2c2;
  margin-bottom: 14px;
}
.mbti-row {
  margin-bottom: 10px;
}
.mbti-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 900;
}
.mbti-labels span {
  color: #eaebec;
}
.mbti-labels span.active {
  color: #71ebbe;
}
.mbti-bar {
  display: flex;
  height: 11px;
  margin-top: 4px;
}
.bar-left {
  background-color: #71ebbe;
}
.bar-right {
  background-color: #eaebec;
}
.mbti-percent {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  margin-top: 2px;
}
</style>
