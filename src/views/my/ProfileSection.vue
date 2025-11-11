<template>
  <aside class="profile-card">
    <!-- 상단 프로필 영역 -->
    <div class="profile-header">
      <div class="profile-info">
        <div class="name-row">
          <h2>김병현</h2>
          <!-- <i class="ri-settings-3-line"></i> -->
           <i class="ri-settings-3-line" @click="$router.push('/my/edit')"></i>
        </div>
        <p class="email">wsee2307@gmail.com</p>
      </div>
    </div>

    <!-- 기본 정보 -->
    <div class="profile-body">
      <div class="profile-row" v-for="(item, i) in infoList" :key="i">
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ item.value }}</span>
      </div>

      <div class="divider"></div>

      <!-- 기술 스택 -->
      <section class="stack">
        <h3>관심 키워드</h3>
        <div class="tags">
          <span class="tag tag-border">Java</span>
          <span class="tag tag-fill">Spring</span>
          <span class="tag tag-border">MyBatis</span>
          <span class="tag tag-border">Vue3</span>
        </div>
      </section>

      <div class="divider"></div>

      <!-- AI 성격 분석 -->
      <section class="ai-personality">
        <h3>AI 성격 기반 분석</h3>
        <p class="desc">명확한 목표 설정과 체계적 사고를 바탕으로 빠르게 성장합니다. 감정 표현과 협업 커뮤니케이션을 함께 확장해보세요.</p>

        <!-- ✅ 최신 MBTI 컴포넌트 -->
        <MbtiTest />
      </section>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import MbtiTest from "./MbtiTest.vue";

const infoList = ref([
  { label: "경력", value: "신입" },
  { label: "직군", value: "개발" },
  { label: "직무", value: "백엔드 개발자" },
]);
</script>

<style scoped>
.profile-card {
  grid-area: profile;
  background-color: #111111;
  color: #ffffff;
  border-radius: 16px;
  padding: 28px 26px 32px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  width: 100%;
  max-width: 380px;
  box-sizing: border-box;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
}

/* 프로필 정보 전체 */
.profile-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 이름과 아이콘을 좌우로 정렬 */
.name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 이름 */
.name-row h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

/* 아이콘 */
.name-row i {
  font-size: 22px;
  color: #555;
  cursor: pointer;
  transition: color 0.2s;
}

.name-row i:hover {
  color: #71EBBE; /* color.txt에서 강조색 */
}

/* 이메일 */
.email {
  margin-top: 4px;
  font-size: 14px;
  color: #777;
  text-align: left;
}


/* 정보 행 */
.profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.label {
  font-size: 15px;
  color: #f1f2f3;
}

.value {
  font-size: 14px;
  color: #71ebbe;
  font-weight: 600;
}

/* 구분선 */
.divider {
  border-top: 1px solid #2a2a2a;
  margin: 22px 0;
}

/* 기술 스택 */
.stack h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #f1f2f3;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 24px;
  letter-spacing: 0.3px;
}

.tag-border {
  border: 1px solid #71ebbe;
  color: #71ebbe;
  background-color: transparent;
}

.tag-fill {
  background-color: rgba(113, 235, 190, 0.15);
  color: #71ebbe;
  border: 1px solid transparent;
}

/* AI 성격 분석 */
.ai-personality h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
}

.desc {
  font-size: 12.5px;
  color: #c7c7c7;
  line-height: 1.6;
  margin-bottom: 18px;
}
</style>
