<template>
  <div class="final-documents-page">
    <div class="content-wrapper">
      <!-- 왼쪽: 서류 섹션들 -->
      <div class="main-documents">
        <div class="container py-5">
          <h1 class="page-title mb-5">📚 최종 통합 문서</h1>

          <!-- ✅ 2열 래퍼 추가 -->
          <div class="two-col">
            <!-- 왼쪽: 서류들 -->
            <div class="left-col">
              <!-- ✅ 이력서 섹션 -->
              <section class="final-section resume-section">
                <h2 class="section-title">📄 이력서</h2>

                <div class="resume-template">
                  <div class="resume-header">
                    <div class="profile">
                      <div class="info">
                        <h3>김개발</h3>
                        <p>백엔드 개발자</p>
                        <p>📧 kimdev@email.com | 📞 010-1234-5678</p>
                      </div>
                    </div>
                  </div>

                  <div class="section">
                    <h4>기본 정보</h4>
                    <table class="info-table">
                      <tr>
                        <th>생년월일</th>
                        <td>1998.06.15</td>
                      </tr>
                      <tr>
                        <th>주소</th>
                        <td>서울특별시 강남구 역삼동</td>
                      </tr>
                      <tr>
                        <th>GitHub</th>
                        <td>github.com/kimdev</td>
                      </tr>
                    </table>
                  </div>

                  <div class="section">
                    <h4>학력</h4>
                    <table class="info-table">
                      <tr>
                        <th>학교명</th>
                        <th>전공</th>
                        <th>기간</th>
                        <th>졸업 여부</th>
                      </tr>
                      <tr>
                        <td>한국공학대학교</td>
                        <td>컴퓨터공학과</td>
                        <td>2017.03 ~ 2021.02</td>
                        <td>졸업</td>
                      </tr>
                    </table>
                  </div>

                  <div class="section">
                    <h4>경력</h4>
                    <table class="info-table">
                      <tr>
                        <th>회사명</th>
                        <th>직무</th>
                        <th>기간</th>
                        <th>주요 성과</th>
                      </tr>
                      <tr>
                        <td>(주)테크컴퍼니</td>
                        <td>백엔드 개발자</td>
                        <td>2021.03 ~ 2023.06</td>
                        <td>
                          Spring Boot 기반 전자상거래 플랫폼 개발 및 운영<br />
                          MSA 전환으로 응답속도 50% 개선<br />
                          Redis 캐싱 도입(DB 부하 40% 감소)
                        </td>
                      </tr>
                    </table>
                  </div>

                  <div class="section">
                    <h4>기술 스택</h4>
                    <ul class="tech-list">
                      <li>Java</li>
                      <li>Spring Boot</li>
                      <li>MySQL</li>
                      <li>Redis</li>
                      <li>Docker</li>
                      <li>AWS</li>
                      <li>Kubernetes</li>
                    </ul>
                  </div>

                  <div class="section">
                    <h4>자격증</h4>
                    <table class="info-table">
                      <tr>
                        <th>자격증명</th>
                        <th>발급기관</th>
                        <th>취득일</th>
                      </tr>
                      <tr>
                        <td>정보처리기사</td>
                        <td>한국산업인력공단</td>
                        <td>2021.06</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </section>

              <!-- ✅ 자기소개서 섹션 -->
              <section class="final-section cover-section">
                <h2 class="section-title">🖋️ 자기소개서</h2>

                <div class="cover-template">
                  <div class="cover-header">
                    <h3>자기소개서</h3>
                    <p class="sub">지원자: 김개발</p>
                  </div>

                  <div class="cover-body">
                    <div class="cover-item" v-for="(item, index) in coverItems" :key="index">
                      <h4>{{ item.title }}</h4>
                      <div class="cover-content">
                        <p v-html="item.content"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- ✅ 포트폴리오 섹션 -->
              <section class="final-section portfolio-section">
                <h2 class="section-title">🎨 포트폴리오</h2>

                <div class="resume-template">
                  <div class="section">
                    <h4>프로젝트명</h4>
                    <p>실시간 채팅 플랫폼</p>
                  </div>
                  <div class="section">
                    <h4>설명</h4>
                    <p>
                      Redis Pub/Sub 기반의 고성능 채팅 서비스로, 대규모 트래픽을 처리하는
                      백엔드 아키텍처를 설계했습니다.
                    </p>
                  </div>
                  <div class="section">
                    <h4>기술 스택</h4>
                    <ul class="tech-list">
                      <li>Node.js</li>
                      <li>Socket.io</li>
                      <li>Redis</li>
                      <li>MongoDB</li>
                      <li>AWS EC2</li>
                    </ul>
                  </div>
                </div>
              </section>
              <div class="text-center mt-5">
                <button class="btn btn-mint px-5 py-3">최종 피드백 받기</button>
              </div>
            </div>
            <!-- 오른쪽: AI 피드백 -->
            <aside class="ai-feedback-box">
              <h3>🤖 AI 통합 피드백</h3>
              <p class="desc">AI가 세 서류 간의 일관성과 기술 매칭을 분석했습니다.</p>
              <ul class="feedback-list">
                <li>✅ <strong>직무 일관성:</strong> 백엔드 중심의 서류 구성으로 높은 통일성.</li>
                <li>💡 <strong>표현 톤:</strong> 자소서와 이력서의 문체가 약간 다름.</li>
                <li>🧩 <strong>기술 매칭도:</strong> 포트폴리오 기술과 이력서 기술스택 90% 일치.</li>
                <li>✨ <strong>종합 평가:</strong> 전체적으로 완성도가 높고, 제출용으로 적합.</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const coverItems = [
  {
    title: "1. 지원 동기",
    content: `
      기술로 세상을 더 효율적으로 바꿀 수 있다는 믿음으로 개발자의 길을 선택했습니다.
      사람들의 문제를 직접 해결할 수 있는 <strong>AI 서비스</strong>에 흥미를 느껴 프로젝트를 지속했습니다.
      귀사의 기술 문화가 제 개발 철학과 일치해 지원했습니다.
    `,
  },
  {
    title: "2. 성장 과정",
    content: `
      대학 시절 팀 프로젝트를 통해 협업과 커뮤니케이션 능력을 길렀고,
      스타트업 인턴으로 서비스 운영의 문제 해결을 직접 경험했습니다.
    `,
  },
  {
    title: "3. 직무 역량",
    content: `
      Spring Boot 기반 백엔드 개발 경험으로 RESTful API, DB 모델링, CI/CD 구축을 경험했습니다.
      Redis, 비동기 처리, Jenkins 자동배포까지 실무 중심의 기술력을 갖추고 있습니다.
    `,
  },
  {
    title: "4. 입사 후 포부",
    content: `
      AI와 데이터를 활용한 효율적 시스템을 구축하고,
      기술 리더로 성장해 팀 생산성과 품질 향상에 기여하겠습니다.
    `,
  },
];
</script>

<style scoped>
.final-documents-page {
  background: #f6f8f7;
  min-height: 100vh;
  padding-top: 4rem;
}

/* Bootstrap container의 중앙제한 없애기 */
.container {
  max-width: none !important;
  padding: 0 !important;
}

/* 메인 2열 구조 */
.two-col {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1800px; /* 전체 폭 확장 */
  margin: 0 auto;
  padding-right: 380px; /* 오른쪽 고정 박스 공간 확보 */
  position: relative;
}

/* 왼쪽 서류 전체 확장 */
.left-col {
  flex: 1;
  width: 100%;
  max-width: none; /* 제한 해제 */
}

/* 왼쪽 70% */
.main-documents {
  flex: 7;
  max-width: 70%;
}

/* 오른쪽 피드백 박스 */
.ai-feedback-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #eee;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  /* ✅ 스크롤 내려도 고정 */
  position: fixed;
  right: 60px;     /* 화면 오른쪽 여백 */
  top: 140px;      /* 상단 여백 (헤더 높이 고려해서 조절) */
  width: 350px;    /* 고정일 땐 너비 명시 필요 */
  height: fit-content;

  /* 시각적으로 자연스럽게 */
  align-self: flex-start;
  min-width: 340px;
}

/* 중앙 레이아웃 */
.content-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 40px;
  margin-top: 2rem;
}
.ai-feedback-box h3 {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.ai-feedback-box .desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.feedback-list {
  list-style: none;
  padding: 0;
  line-height: 1.7;
}

.feedback-list li {
  margin-bottom: 0.8rem;
  color: #333;
  font-size: 0.95rem;
}

/* 이하 기존 스타일 그대로 유지 */
.page-title {
  text-align: center;
  font-weight: 700;
  color: #000;
}

.final-section {
  margin-bottom: 4rem;
}

.section-title {
  border-left: 6px solid #71EBBE;
  padding-left: 0.8rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1.5rem;
}

.resume-template {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  line-height: 1.7;
}

/* ====== 이력서 섹션 간격 조정 ====== */
.resume-template .section {
  margin-bottom: 2.5rem;
  /* 기존보다 살짝 여유 */
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
  /* 구분선 은은하게 */
}

.resume-template .section:last-child {
  border-bottom: none;
  /* 마지막 항목은 선 제거 */
  margin-bottom: 0;
  padding-bottom: 0;
}

/* 테이블 위쪽 간격 */
.resume-template .info-table {
  margin-top: 0.5rem;
}

/* 기술 스택 리스트도 여백 추가 */
.resume-template .tech-list {
  margin-top: 0.8rem;
}

.resume-header {
  border-bottom: 2px solid #e8e8e8;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.info h3 {
  margin: 0;
  font-weight: 700;
  font-size: 1.4rem;
}

.info p {
  margin: 4px 0;
  color: #555;
}

.section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #000;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.info-table th,
.info-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.info-table th {
  background: #f9f9f9;
  width: 25%;
  font-weight: 600;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  list-style: none;
  padding: 0;
}

.tech-list li {
  background: #e8faf3;
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  color: #0c6954;
}

.cover-template {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-left: 6px solid #A2D5C6;
  font-family: 'Noto Sans KR', sans-serif;
}

.cover-header {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.cover-header h3 {
  font-weight: 700;
  color: #000;
  margin-bottom: 0.3rem;
}

.cover-header .sub {
  color: #777;
  font-size: 0.9rem;
}

.cover-item {
  margin-bottom: 2rem;
}

.cover-item h4 {
  background: #f4fdfa;
  color: #006b54;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  border-left: 4px solid #71EBBE;
  margin-bottom: 1rem;
}

.cover-content {
  padding: 1rem 1.2rem;
  background: #fafafa;
  border-radius: 8px;
  line-height: 1.9;
  color: #333;
  border: 1px solid #eee;
  text-align: justify;
}

.btn-mint {
  background: linear-gradient(135deg, #71EBBE, #A2D5C6);
  color: #000;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-mint:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(113, 235, 190, 0.3);
}

/* 반응형 */
@media (max-width: 1200px) {
  .two-col {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 32px;
  }
}

@media (max-width: 992px) {
  .two-col {
    grid-template-columns: 1fr;
  }
  .ai-feedback-box {
    position: static;
    margin-top: 24px;
  }
}
</style>
