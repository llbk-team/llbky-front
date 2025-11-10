<template>
  <div class="page-wrapper">

 

    <div class="main-layout">

      <!-- ✅ 좌측 Sidebar -->
      <SideBar/>

      <!-- ✅ 컨텐츠 영역 -->
      <section class="content">
        <div class="breadcrumb">my &gt; 서류관리 &gt; 이력서</div>
        <h1 class="page-title">서류 AI 코칭</h1>

        <div class="resume-layout">

          <!-- ✅ 왼쪽 : 이력서 상세 -->
          <div class="resume-card">
            <h2>📄 이력서 상세</h2>

            <div class="section">
              <h3>기본 정보</h3>
              <p><strong>이름:</strong> 김개발</p>
              <p><strong>이메일:</strong> kimdev@email.com</p>
              <p><strong>전화:</strong> 010-1234-5678</p>
            </div>

            <div class="section">
              <h3>경력 사항</h3>
              <p><strong>(주)테크컴퍼니 | 백엔드 개발자</strong><br>2021.03 - 2023.06 (2년 3개월)</p>
              <ul>
                <li>Spring Boot 기반 전자상거래 플랫폼 개발 및 운영</li>
                <li>MSA 아키텍처 전환 프로젝트 리드(응답속도 50% 개선)</li>
                <li>Redis 캐싱 도입(DB 부하 40% 감소)</li>
              </ul>
            </div>

            <div class="section">
              <h3>기술 스택</h3>
              Java, Spring Boot, MySQL, Redis, AWS, Docker, Kubernetes
            </div>
          </div>

          <!-- ✅ 오른쪽 : AI 코칭 결과 -->
          <div class="ai-card">
            <h2>🧠 AI 코칭 결과</h2>

            <div class="score-box">
              <span class="score">85</span>
              <span class="score-label">점</span>
            </div>

            <div class="score-details">
              <span><strong>경력 기술</strong> 92%</span>
              <span><strong>적합도</strong> 88%</span>
              <span><strong>완성도</strong> 87%</span>
            </div>

            <div class="feedback">
              <div class="good">
                ✅ <strong>강점</strong>
                <ul>
                  <li>정량적 성과 기술이 매우 구체적입니다</li>
                  <li>기술 스택이 공고의 조건과 잘 맞습니다</li>
                </ul>
              </div>
              <div class="bad">
                💡 <strong>개선 제안</strong>
                <ul>
                  <li>역할 및 기여도를 더 명확히 작성</li>
                  <li>비즈니스 임팩트 중심으로 서술</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ AI 첨삭 제안 -->
        <div class="edit-card">
          <h2>✏️ AI 첨삭 제안</h2>

          <p class="edit-label">경력사항 개선 제안</p>

          <div class="before">
            <strong>수정 전:</strong><br>
            Spring Boot 기반 전자상거래 플랫폼 개발 및 운영
          </div>

          <div class="after">
            <strong>수정 후:</strong><br>
            Spring Boot API 개발 및 운영, 5명 개발 리드 역할 수행
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import SideBar from "@/components/sidebar/SideBar.vue";
import { ref } from "vue";

const activeTab = ref("resume");

function switchTab(tab) {
  activeTab.value = tab;
}
</script>

<style scoped>
/* ---------------------- Global Layout ---------------------- */
.page-wrapper {
  background: #f7f7f7;
  min-height: 100vh;
}

/* Top Navigation */
.top-nav {
  display: flex;
  justify-content: space-between;
  padding: 1.2rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
}

.logo {
  font-size: 1.4rem;
  font-weight: 700;
}

.top-menu {
  display: flex;
  gap: 1.5rem;
}

.top-link {
  cursor: pointer;
  color: #777;
}
.top-link.active {
  font-weight: 700;
  color: #009688;
}

/* ---------------------- Sidebar ---------------------- */
.main-layout {
  display: flex;
  padding-top: 1rem;
}

.sidebar {
  width: 220px;
  padding: 1rem;
}

.sidebar ul li {
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
}

.sidebar ul li.selected {
  background: #d3f8e2;
  font-weight: 600;
  color: #009688;
}

/* ---------------------- Content ---------------------- */
.content {
  flex: 1;
  padding: 1rem 2rem;
}

.page-title {
  font-size: 1.8rem;
  margin: 12px 0 24px 0;
}

/* Resume + AI Result Cards */
.resume-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Resume Card */
.resume-card,
.ai-card,
.edit-card {
  background: white;
  padding: 2rem;
  border-radius: 14px;
  border: 1px solid #e5e5e5;
}

/* Score Circle */
.score-box {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: black;
  color: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score {
  font-size: 2.6rem;
  font-weight: bold;
}

.score-details {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

/* Feedback blocks */
.good, .bad {
  margin-top: 1.2rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.good {
  background: #eafff1;
}
.bad {
  background: #fff2f2;
}

/* Edit Box */
.before, .after {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.before {
  background: #fff3f3;
}
.after {
  background: #eafff1;
}
</style>
