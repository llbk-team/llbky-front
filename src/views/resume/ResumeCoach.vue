<template>
  <div class="page-wrapper">
    <div class="main-layout">
      

      <!-- ✅ 컨텐츠 영역 -->
      <section class="content">
        <div class="breadcrumb">my &gt; 서류관리 &gt; 이력서</div>
        <h1 class="page-title">서류 AI 코칭</h1>

        <div class="resume-layout">

          <!-- ✅ 상단: 이력서 상세(2) + AI 첨삭 제안(1) - 2:1 비율 -->
          <div class="top-section">
            <!-- 왼쪽: 이력서 상세 (2/3) -->
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

            <!-- 오른쪽: AI 첨삭 제안 (1/3) -->
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
          </div>

          <!-- ✅ 하단: AI 코칭 결과 -->
          <div class="card border-0 shadow-sm mt-4">
            <div class="card-body">
              <h2 class="mb-4">🧠 AI 코칭 결과</h2>

              <div class="score-details mb-4">
                <span><strong>경력 기술</strong> 92%</span>
                <span><strong>적합도</strong> 88%</span>
                <span><strong>완성도</strong> 87%</span>
              </div>

              <div class="feedback mb-4">
                <div class="good mb-3">
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

              <!-- ✅ 이력서 형식 선택 버튼들 -->
              <h4 class="fw-semibold mb-3 text-dark">이력서 형식 선택</h4>
              <p class="text-muted small mb-4">
                원하는 이력서 형식을 선택하면 자동으로 변환됩니다
              </p>

              <div class="d-flex gap-4 mb-4 justify-content-center">
                <!-- 줄글 형식 이력서 버튼 -->
                <button class="btn btn-resume-format" data-bs-toggle="modal" data-bs-target="#textFormatModal">
                  <div class="format-icon">📝</div>
                  <div class="format-title">줄글 형식 이력서</div>
                  <div class="format-desc">자유로운 텍스트 형식</div>
                </button>

                <!-- 규격화된 이력서 버튼 -->
                <button class="btn btn-resume-format" data-bs-toggle="modal" data-bs-target="#standardFormatModal">
                  <div class="format-icon">📋</div>
                  <div class="format-title">규격화된 이력서</div>
                  <div class="format-desc">표준 양식 형식</div>
                </button>
              </div>

              <!-- 하단 버튼 -->
              <div class="d-flex gap-3 justify-content-center">
                <button class="btn btn-outline-secondary fw-medium btn-lg btn-fixed-width">
                  📄 리포트 다운로드
                </button>
                <button class="btn btn-mint fw-medium btn-lg btn-fixed-width">
                  ✏️ 서류 수정하기
                </button>
                <button class="btn btn-outline-secondary fw-medium btn-lg btn-fixed-width">
                  💾 저장하기
                </button>
              </div>
            </div>
          </div>

        </div>

      </section>
    </div>

    <!-- ✅ 줄글 형식 이력서 모달 -->
    <div class="modal fade" id="textFormatModal" tabindex="-1" aria-labelledby="textFormatModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="textFormatModalLabel">📝 줄글 형식 이력서 샘플</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- 줄글 형식 이력서 샘플 이미지 -->
            <div class="resume-sample-container">
              <img src="/images/text-format-resume.png" alt="줄글 형식 이력서" class="img-fluid">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" class="btn btn-mint" @click="applyTextFormat">적용하기</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 규격화된 이력서 모달 -->
    <div class="modal fade" id="standardFormatModal" tabindex="-1" aria-labelledby="standardFormatModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="standardFormatModalLabel">📋 규격화된 이력서 샘플</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- 규격화된 이력서 샘플 이미지 -->
            <div class="resume-sample-container">
              <img src="/images/standard-format-resume.png" alt="규격화된 이력서" class="img-fluid">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" class="btn btn-mint" @click="applyStandardFormat">적용하기</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import bootstrap
  from 'bootstrap';
// 줄글 형식 적용
const applyTextFormat = () => {
  console.log('줄글 형식 이력서 적용');
  // TODO: API 호출하여 줄글 형식으로 변환
  // Bootstrap 모달 닫기
  const modalElement = document.getElementById('textFormatModal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();

  alert('줄글 형식 이력서가 적용되었습니다.');
};

// 규격화된 형식 적용
const applyStandardFormat = () => {
  console.log('규격화된 이력서 적용');
  // TODO: API 호출하여 규격화된 형식으로 변환
  // Bootstrap 모달 닫기
  const modalElement = document.getElementById('standardFormatModal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();

  alert('규격화된 이력서가 적용되었습니다.');
};
</script>

<style scoped>
/* 페이지 전체 레이아웃 */
.page-wrapper {
  background-color: #F6F6F6;
  min-height: 100vh;
}

.main-layout {
  display: flex;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumb {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 2rem;
}

/* 레이아웃 */
.resume-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ✅ 상단 섹션: 2:1 비율로 분할 */
.top-section {
  display: flex;
  gap: 1.5rem;
}

/* 이력서 카드 - 2/3 너비 */
.resume-card {
  flex: 2;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.resume-card h2 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #000;
}

.section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.section:last-child {
  border-bottom: none;
}

.section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #333;
}

.section p {
  margin-bottom: 0.5rem;
  color: #555;
  line-height: 1.6;
}

.section ul {
  margin-left: 1.5rem;
  color: #555;
}

.section li {
  margin-bottom: 0.4rem;
  line-height: 1.6;
}

/* AI 첨삭 제안 카드 - 1/3 너비 */
.edit-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-card h2 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #000;
}

.edit-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.before,
.after {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.before {
  background: #f8f9fa;
  border-left: 3px solid #dc3545;
}

.after {
  background: #CFFFE2;
  border-left: 3px solid #A2D5C6;
}

/* AI 코칭 결과 카드 */
.score-details {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.score-details span {
  font-size: 0.95rem;
  color: #555;
}

.feedback {
  display: flex;
  flex-direction: column;
}

.good,
.bad {
  padding: 1rem;
  border-radius: 8px;
}

.good {
  background: #CFFFE2;
  border-left: 4px solid #A2D5C6;
}

.bad {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}

.good ul,
.bad ul {
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding-left: 1.5rem;
}

.good li,
.bad li {
  margin-bottom: 0.3rem;
  line-height: 1.5;
}

/* 이력서 형식 선택 버튼 */
.btn-resume-format {
  width: 400px;
  height: 200px;
  background: white;
  border: 2px solid #A2D5C6;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-resume-format:hover {
  background: #CFFFE2;
  border-color: #A2D5C6;
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(162, 213, 198, 0.3);
}

.format-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.format-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
}

.format-desc {
  font-size: 0.95rem;
  color: #666;
}

/* 하단 버튼들 */
.btn-mint {
  background: #A2D5C6;
  color: #000;
  border: none;
  font-weight: 600;
}

.btn-mint:hover {
  background: #8bc4b0;
  color: #000;
}

/* 모달 스타일 */
.resume-sample-container {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.resume-sample-container img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background: #A2D5C6;
  color: #000;
}

.modal-footer .btn-mint {
  padding: 0.5rem 2rem;
}

/* 반응형 */
@media (max-width: 1024px) {
  .top-section {
    flex-direction: column;
  }

  .resume-card,
  .edit-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  .btn-resume-format {
    width: 100%;
    height: 150px;
  }

  .d-flex.gap-4 {
    flex-direction: column;
  }
}
</style>

//-----
// ✅ 수정 내용:
// 1. .top-section { display: flex; gap: 1.5rem; } - 상단을 flex로 가로 배치
// 2. .resume-card { flex: 2; } - 이력서 상세 2/3 너비
// 3. .edit-card { flex: 1; } - AI 첨삭 제안 1/3 너비
// 4. 반응형 추가: 1024px 이하에서 세로 배치로 전환
//-----