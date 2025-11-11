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
            <!-- 왼쪽: 이력서 상세 (2/3) - 형식에 따라 다르게 표시 -->
            <div class="resume-card">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2>📄 이력서 상세</h2>
                <span class="badge bg-mint">{{ formatLabel }}</span>
              </div>

              <!-- ✅ 기본 형식 (default) -->
              <div v-if="resumeFormat === 'default'">
                <div class="section">
                  <h3>기본 정보</h3>
                  <p><strong>이름:</strong> {{ resumeData.name }}</p>
                  <p><strong>이메일:</strong> {{ resumeData.email }}</p>
                  <p><strong>전화:</strong> {{ resumeData.phone }}</p>
                </div>

                <div class="section">
                  <h3>경력 사항</h3>
                  <p><strong>{{ resumeData.career.company }} | {{ resumeData.career.position }}</strong><br>
                    {{ resumeData.career.period }}</p>
                  <ul>
                    <li v-for="(achievement, index) in resumeData.career.achievements" :key="index">
                      {{ achievement }}
                    </li>
                  </ul>
                </div>

                <div class="section">
                  <h3>기술 스택</h3>
                  {{ resumeData.skills }}
                </div>
              </div>

              <!-- ✅ 줄글 형식 (text) -->
              <div v-else-if="resumeFormat === 'text'" class="text-format">
                <div class="section">
                  <h3>기본 정보</h3>
                  <p class="text-paragraph">
                    저는 <strong>{{ resumeData.name }}</strong>이며, 
                    <strong>{{ resumeData.email }}</strong>으로 연락 가능합니다. 
                    전화번호는 <strong>{{ resumeData.phone }}</strong>입니다.
                  </p>
                </div>

                <div class="section">
                  <h3>경력 및 성과</h3>
                  <p class="text-paragraph">
                    <strong>{{ resumeData.career.company }}</strong>에서 
                    <strong>{{ resumeData.career.position }}</strong>으로 
                    {{ resumeData.career.period }} 근무하였습니다.
                  </p>
                  <p class="text-paragraph">
                    주요 업무로는 Spring Boot 기반 전자상거래 플랫폼을 개발하고 운영하였으며, 
                    MSA 아키텍처 전환 프로젝트를 리드하여 응답속도를 50% 개선하는 성과를 달성했습니다. 
                    또한 Redis 캐싱을 도입하여 DB 부하를 40% 감소시켰습니다.
                  </p>
                </div>

                <div class="section">
                  <h3>보유 기술</h3>
                  <p class="text-paragraph">
                    {{ resumeData.skills }}에 대한 실무 경험을 보유하고 있으며, 
                    이를 활용하여 다양한 프로젝트를 성공적으로 수행하였습니다.
                  </p>
                </div>
              </div>

              <!-- ✅ 규격화된 형식 (standard) -->
              <div v-else-if="resumeFormat === 'standard'" class="standard-format">
                <table class="table table-bordered resume-table">
                  <tbody>
                    <tr>
                      <th class="table-header" width="20%">성명</th>
                      <td width="30%">{{ resumeData.name }}</td>
                      <th class="table-header" width="20%">생년월일</th>
                      <td width="30%">1990.01.01</td>
                    </tr>
                    <tr>
                      <th class="table-header">연락처</th>
                      <td>{{ resumeData.phone }}</td>
                      <th class="table-header">이메일</th>
                      <td>{{ resumeData.email }}</td>
                    </tr>
                    <tr>
                      <th class="table-header">주소</th>
                      <td colspan="3">서울특별시 강남구</td>
                    </tr>
                  </tbody>
                </table>

                <h3 class="mt-4 mb-3">경력사항</h3>
                <table class="table table-bordered resume-table">
                  <thead>
                    <tr>
                      <th class="table-header">회사명</th>
                      <th class="table-header">직위</th>
                      <th class="table-header">근무기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ resumeData.career.company }}</td>
                      <td>{{ resumeData.career.position }}</td>
                      <td>{{ resumeData.career.period }}</td>
                    </tr>
                  </tbody>
                </table>

                <h4 class="mt-3 mb-2">주요 업무 및 성과</h4>
                <ul class="standard-list">
                  <li v-for="(achievement, index) in resumeData.career.achievements" :key="index">
                    {{ achievement }}
                  </li>
                </ul>

                <h3 class="mt-4 mb-3">보유 기술</h3>
                <table class="table table-bordered resume-table">
                  <tbody>
                    <tr>
                      <th class="table-header" width="20%">기술 스택</th>
                      <td>{{ resumeData.skills }}</td>
                    </tr>
                  </tbody>
                </table>
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
                <button 
                  class="btn btn-resume-format" 
                  :class="{ active: resumeFormat === 'text' }"
                  data-bs-toggle="modal" 
                  data-bs-target="#textFormatModal">
                  <div class="format-icon">📝</div>
                  <div class="format-title">줄글 형식 이력서</div>
                  <div class="format-desc">자유로운 텍스트 형식</div>
                </button>

                <!-- 규격화된 이력서 버튼 -->
                <button 
                  class="btn btn-resume-format" 
                  :class="{ active: resumeFormat === 'standard' }"
                  data-bs-toggle="modal" 
                  data-bs-target="#standardFormatModal">
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
import { ref, computed } from 'vue';

import { Modal } from 'bootstrap';

// ✅ 이력서 형식 상태 관리
const resumeFormat = ref('default'); // default, text, standard

// ✅ 이력서 데이터 (실제로는 API에서 가져옴)
const resumeData = ref({
  name: '김개발',
  email: 'kimdev@email.com',
  phone: '010-1234-5678',
  career: {
    company: '(주)테크컴퍼니',
    position: '백엔드 개발자',
    period: '2021.03 - 2023.06 (2년 3개월)',
    achievements: [
      'Spring Boot 기반 전자상거래 플랫폼 개발 및 운영',
      'MSA 아키텍처 전환 프로젝트 리드(응답속도 50% 개선)',
      'Redis 캐싱 도입(DB 부하 40% 감소)'
    ]
  },
  skills: 'Java, Spring Boot, MySQL, Redis, AWS, Docker, Kubernetes'
});

// ✅ 형식 라벨 표시
const formatLabel = computed(() => {
  switch (resumeFormat.value) {
    case 'text':
      return '줄글 형식';
    case 'standard':
      return '규격화된 형식';
    default:
      return '기본 형식';
  }
});

// ✅ 줄글 형식 적용
const applyTextFormat = () => {
  console.log('줄글 형식 이력서 적용');
  
  // TODO: API 호출하여 줄글 형식으로 변환
  // const response = await fetch('http://localhost:8081/ai/resume/convert-format', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     resumeId: 1,
  //     targetFormat: 'text'
  //   })
  // });
  
  // 형식 변경
  resumeFormat.value = 'text';
  
  // Bootstrap 모달 닫기 (개선된 방법)
  const modalElement = document.getElementById('textFormatModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement);
    if (modal) {
      // hidden.bs.modal 이벤트 리스너 추가
      modalElement.addEventListener('hidden.bs.modal', function handler() {
        // 모달이 완전히 닫힌 후 백드롭 및 modal-open 클래스 제거
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
        
        // 이벤트 리스너 제거 (메모리 누수 방지)
        modalElement.removeEventListener('hidden.bs.modal', handler);
      }, { once: true });
      
      modal.hide();
    }
  }

  alert('줄글 형식 이력서가 적용되었습니다.');
};

// ✅ 규격화된 형식 적용
const applyStandardFormat = () => {
  console.log('규격화된 이력서 적용');
  
  // TODO: API 호출하여 규격화된 형식으로 변환
  // const response = await fetch('http://localhost:8081/ai/resume/convert-format', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     resumeId: 1,
  //     targetFormat: 'standard'
  //   })
  // });
  
  // 형식 변경
  resumeFormat.value = 'standard';
  
  // Bootstrap 모달 닫기 (개선된 방법)
  const modalElement = document.getElementById('standardFormatModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement);
    if (modal) {
      // hidden.bs.modal 이벤트 리스너 추가
      modalElement.addEventListener('hidden.bs.modal', function handler() {
        // 모달이 완전히 닫힌 후 백드롭 및 modal-open 클래스 제거
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
        
        // 이벤트 리스너 제거 (메모리 누수 방지)
        modalElement.removeEventListener('hidden.bs.modal', handler);
      }, { once: true });
      
      modal.hide();
    }
  }


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

.badge.bg-mint {
  background-color: #A2D5C6 !important;
  color: #000;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
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

/* ✅ 줄글 형식 스타일 */
.text-format .text-paragraph {
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
}

/* ✅ 규격화된 형식 스타일 */
.standard-format h3, 
.standard-format h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.resume-table {
  margin-bottom: 1rem;
}

.resume-table th.table-header {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  text-align: center;
  vertical-align: middle;
}

.resume-table td {
  padding: 0.75rem;
  vertical-align: middle;
}

.standard-list {
  margin-left: 1.5rem;
  color: #555;
}

.standard-list li {
  margin-bottom: 0.5rem;
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

.btn-resume-format.active {
  background: #A2D5C6;
  border-color: #8bc4b0;
  box-shadow: 0 4px 15px rgba(162, 213, 198, 0.5);
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.sample-preview {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
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
```

//-----
// ✅ 주요 변경 사항:
//
// 1. **상태 관리**
//    - resumeFormat ref로 현재 선택된 형식 관리 ('default', 'text', 'standard')
//    - resumeData ref로 이력서 데이터 관리
//
// 2. **조건부 렌더링**
//    - v-if, v-else-if로 형식에 따라 다른 레이아웃 표시
//    - 기본 형식: 기존 섹션 기반 레이아웃
//    - 줄글 형식: 문단 중심의 자유로운 텍스트
//    - 규격화된 형식: 테이블 기반 표준 양식
//
// 3. **형식 전환 함수**
//    - applyTextFormat(): 줄글 형식으로 변경
//    - applyStandardFormat(): 규격화된 형식으로 변경
//    - TODO 주석으로 API 연동 부분 표시
//
// 4. **UI 개선**
//    - 선택된 형식에 대한 배지 표시 (formatLabel computed)
//    - 활성화된 버튼에 .active 클래스 적용
//    - 모달에 샘플 미리보기 추가
//
// 5. **API 연동 준비** (TODO)
//    - POST http://localhost:8081/ai/resume/convert-format
//    - Content-Type: application/json
//    - Body: { resumeId: number, targetFormat: 'text' | 'standard' }
//-----

## 📝 Postman 테스트 설정 (추후 백엔드 구현 시)

**엔드포인트**: `POST http://localhost:8081/ai/resume/convert-format`

**Headers**:
```
Content-Type: application/json