<template>
  <div class="signup-page">
    <div class="signup-container">
      <h2>회원가입</h2>

      <form @submit.prevent="handleSignup">
        <!-- 기본 정보 -->
        <div class="form-section basic-info">
          <div class="input-group">
            <label>이름</label>
            <input v-model="name" type="text" placeholder="이름을 입력하세요" />
          </div>

          <div class="input-group">
            <label>아이디</label>
            <input v-model="username" type="text" placeholder="아이디를 입력하세요" />
          </div>

          <div class="input-group">
            <label>비밀번호</label>
            <div class="password-box">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="비밀번호를 입력하세요" />
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="toggle-icon"
                @click="showPassword = !showPassword"></i>
            </div>
          </div>

          <div class="input-group">
            <label>이메일</label>
            <input v-model="email" type="email" placeholder="이메일을 입력하세요" />
          </div>
        </div>

        <!-- 추가 정보 입력 -->
        <div class="form-section">
          <div class="info-header">
            <h3><i class="ri-check-line"></i> 추가 정보 입력</h3>
            <p>맞춤형 커리어 코칭을 위한 정보를 입력해주세요</p>
          </div>

          <!-- ✅ 진행 라인 -->
          <div class="progress-container">
            <div class="progress-steps">
              <div class="step" :class="{ active: progressStep >= 1 }">1</div>
              <span class="step-label">직군/직무</span>
              <div class="progress-bar">
                <div class="progress-fill" :class="{ active: progressStep > 0 }"
                  :style="{ width: progressStep === 1 ? '50%' : progressStep === 2 ? '100%' : '0%' }"></div>
              </div>
              <div class="step" :class="{ active: progressStep === 2 }">2</div>
              <span class="step-label">경력/스킬</span>
            </div>
          </div>

          <!-- 직군 -->
          <div class="section job-section">
            <h4>직군 선택</h4>
            <div class="grid-5">
              <button v-for="(job, idx) in jobFields" :key="idx"
                :class="['grid-item', { selected: selectedJob === job }]" @click.prevent="selectJob(job)">
                {{ job }}
              </button>
            </div>
          </div>

          <!-- 직무 (드롭다운) -->
          <div class="section role-section">
            <h4>직무</h4>
            <div class="dropdown" ref="dropdownRef">
              <button class="btn dropdown-toggle w-100 text-start"
                :class="{ 'btn-secondary': !selectedJob, 'btn-light': selectedJob }" type="button"
                :disabled="!selectedJob" @click="toggleDropdown">
                {{ jobRole || '직군을 먼저 선택해주세요' }}
              </button>
              <ul class="dropdown-menu w-100" :class="{ show: isDropdownOpen }">
                <li v-for="(role, idx) in roleOptions" :key="idx">
                  <a class="dropdown-item" href="#" @click.prevent="selectRole(role)">
                    {{ role }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 경력 -->
          <div class="section career-section">
            <h4>경력</h4>
            <div class="grid-5">
              <button v-for="(exp, idx) in experiences" :key="idx"
                :class="['grid-item', { selected: selectedExp === exp }]" @click.prevent="selectExp(exp)">
                {{ exp }}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="!isFormComplete">
          회원가입 완료
        </button>

        <router-link to="/login" class="btn-login-link">로그인</router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import memberApi from "@/apis/memberApi";   // ✅ 회원가입 API import

const router = useRouter();

const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const jobFields = [
  "개발",
  "디자인",
  "기획",
  "PM",
  "마케팅",
  "AI/데이터",
  "영업",
  "경영",
  "교육",
  "기타",
];
const experiences = ["신입", "1~3년차", "3~5년차", "5~10년차", "10년 이상"];

// 직군별 직무 데이터
const jobRolesData = {
  개발: [
    "백엔드 개발자", "프론트엔드 개발자", "풀스택 개발자", "웹 개발자", "서버 개발자",
    "API 개발자", "Spring 개발자", "Node.js 개발자", "Java 개발자", "Python 개발자",
    "C/C++ 개발자", ".NET 개발자", "Go 개발자", "Rust 개발자", "PHP 개발자",
    "iOS 개발자", "Android 개발자", "React Native 개발자", "Flutter 개발자", "모바일 앱 개발자",
    "DevOps 엔지니어", "SRE 엔지니어", "클라우드 엔지니어(AWS)", "클라우드 엔지니어(GCP)", "클라우드 엔지니어(Azure)",
    "인프라 엔지니어", "데이터 엔지니어", "ETL 엔지니어", "빅데이터 플랫폼 개발자", "Spark 개발자",
    "Kafka 엔지니어", "MLOps 엔지니어", "보안 엔지니어", "보안 취약점 분석가", "SI 개발자",
    "ERP 개발자", "SAP 개발자", "QA 엔지니어", "테스트 자동화 엔지니어", "품질 엔지니어",
    "게임 클라이언트 개발자", "게임 서버 개발자", "Unity 개발자", "Unreal Engine 개발자", "임베디드 개발자",
    "펌웨어 개발자", "IoT 개발자", "로보틱스 소프트웨어 엔지니어", "데이터베이스 관리자(DBA)", "기술 아키텍트(Software Architect)"
  ],
  디자인: [
    "UX 디자이너", "UI 디자이너", "UX 리서처", "프로덕트 디자이너", "서비스 디자이너",
    "인터랙션 디자이너", "그래픽 디자이너", "브랜드 디자이너(BX)", "비주얼 디자이너", "웹 디자이너",
    "앱 디자이너", "모션그래픽 디자이너", "3D 디자이너", "일러스트레이터", "아트 디렉터",
    "편집 디자이너", "영상 디자이너", "패키지 디자이너", "제품(산업) 디자이너", "캐릭터 디자이너",
    "UI 시스템 디자이너", "디자인 시스템 매니저", "타이포그래피 디자이너", "공간 디자이너", "인테리어 디자이너",
    "전시 디자이너", "패션 디자이너", "의상 디자이너", "템플릿 디자이너", "게임 UI/UX 디자이너",
    "게임 아트 디자이너", "게임 이펙트 아티스트(VFX)", "콘셉트 아티스트", "스토리보드 아티스트", "애니메이터",
    "UI 프로토타입 디자이너", "GUI 디자이너", "인포그래픽 디자이너", "CAD 디자이너", "포토그래퍼",
    "영상 촬영 디자이너", "웹퍼블리셔", "시각 커뮤니케이션 디자이너", "프레젠테이션 디자이너", "리테일 디자인",
    "공간 브랜딩 디자이너", "오디오비주얼 디자이너", "패턴 디자이너", "컬러리스트", "디자인 운영 매니저"
  ],
  기획: [
    "서비스 기획자", "웹 기획자", "앱 기획자", "UX 기획자", "전략 기획자",
    "사업 기획자", "신사업 기획", "데이터 기획", "기술 기획", "플랫폼 기획자",
    "프로덕트 기획자", "상품 기획(MD)", "콘텐츠 기획자", "마케팅 콘텐츠 기획자", "영상 콘텐츠 기획자",
    "커머스 기획", "교육 기획", "운영 기획", "프로세스 기획", "정책 기획",
    "요구사항 분석가(BA)", "IT 비즈니스 분석가", "디지털 전략 기획", "성장 전략 기획", "데이터 기반 기획(PDCA)",
    "게임 기획자", "시나리오 기획자", "레벨 디자이너(게임)", "경제 시스템 기획(게임)", "기능 기획",
    "플랫폼 정책 기획", "커뮤니티 운영 기획", "고객 경험 기획(CX)", "파트너 기획", "제휴 기획",
    "운영 자동화 기획", "업무표준화 기획", "백오피스 기획", "인프라 기획", "데이터 분석 기획",
    "이벤트 기획", "행사 기획", "홍보 기획", "조직문화 기획", "HRD 기획",
    "R&D 기획", "PMO 기획(프로젝트 감독)", "투자 전략 기획", "BM 기획", "수익모델 기획"
  ],
  PM: [
    "Product Manager", "Associate PM", "Senior PM", "Lead PM", "Head of Product",
    "Technical PM", "IT PM", "웹/앱 PM", "서비스 PM", "eCommerce PM",
    "게임 PM", "B2B SaaS PM", "데이터 PM", "AI PM", "플랫폼 PM",
    "Growth PM", "CRM PM", "콘텐츠 PM", "광고 PM", "마케팅 PM",
    "프로젝트 매니저", "SI PM", "ERP PM", "인프라 PM", "클라우드 PM",
    "QA PM", "PMO", "기술 프로젝트 매니저", "SM(Service Manager)", "유지보수 PM",
    "HW 제품 PM", "IoT PM", "로보틱스 PM", "의료기기 PM", "교육 서비스 PM",
    "게임 라이브 OPS PM", "서비스 운영 PM", "애자일 PM", "Scrum Master", "Agile Coach",
    "커머스 운영 PM", "브랜딩 PM", "운영 프로젝트 매니저", "전사 프로젝트 매니저", "데이터 플랫폼 PM",
    "UX PM", "SaaS 솔루션 PM", "기술 솔루션 PM", "고객경험 PM", "보안/인증 서비스 PM"
  ],
  마케팅: [
    "퍼포먼스 마케터", "디지털 마케터", "콘텐츠 마케터", "SNS 마케터", "이메일/CRM 마케터",
    "브랜드 마케터", "커뮤니케이션 마케터", "PR/홍보", "인플루언서 마케터", "바이럴 마케터",
    "검색광고 운영자(SEM)", "디스플레이 광고 운영자", "앱 마케팅", "성장 마케터(Growth)", "마케팅 전략",
    "데이터 마케터", "리서치 분석가", "매체 기획자", "퍼포먼스 애널리스트", "마케팅 기획자",
    "프로모션 기획", "캠페인 매니저", "마케팅 PM", "B2B 마케터", "글로벌 마케터",
    "콘텐츠 에디터", "카피라이터", "영상 콘텐츠 마케터", "커뮤니티 매니저", "브랜드 전략",
    "SNS 운영 매니저", "광고 크리에이티브 기획", "스폰서십 마케터", "팟캐스트/오디오 마케터", "SEO 전문가",
    "ASO 전문가", "마케팅 데이터 분석", "웹 분석가(웹 애널리스트)", "리드 생성 마케터", "고객 분석 마케터",
    "캠페인 오퍼레이터", "Shopper Marketing", "리테일 마케팅", "이벤트 마케터", "행사 마케팅",
    "CRM 운영자", "고객 인사이트 분석가", "언론 홍보 매니저", "광고 AE", "브랜드 커뮤니케이션 매니저"
  ],
  "AI/데이터": [
    "데이터 분석가", "데이터 사이언티스트", "머신러닝 엔지니어", "AI 엔지니어", "딥러닝 엔지니어",
    "자연어처리 엔지니어", "컴퓨터비전 엔지니어", "음성 인식 엔지니어", "추천 시스템 엔지니어", "ML Researcher",
    "모델링 엔지니어", "MLOps 엔지니어", "데이터 엔지니어", "데이터 플랫폼 엔지니어", "BI 분석가",
    "통계 분석가", "데이터 품질 엔지니어", "데이터 거버넌스 담당", "데이터 아키텍트", "빅데이터 엔지니어",
    "Spark 엔지니어", "Hadoop 엔지니어", "AI 제품 매니저", "AI 기획자", "알고리즘 엔지니어",
    "위험 분석 모델러", "금융 데이터 분석가", "의료 AI 엔지니어", "제조 AI 엔지니어", "로보틱스 AI 엔지니어",
    "AI 트레이너", "데이터 라벨러", "데이터 수집 엔지니어", "데이터 시각화 전문가", "분석 컨설턴트",
    "데이터 전략 기획", "딥러닝 리서처", "AI 교육 담당", "AutoML 엔지니어", "AI 윤리/리스크 담당",
    "LLM 엔지니어", "프롬프트 엔지니어", "Vector DB 엔지니어", "검색 알고리즘 엔지니어", "데이터 운영 매니저",
    "데이터 PM", "AI 모델 검증 담당", "데이터베이스 관리자(DBA)", "로그 분석 엔지니어", "anomaly detection 엔지니어"
  ],
  영업: [
    "B2B 영업", "B2C 영업", "솔루션 영업", "기술 영업", "IT 영업",
    "SaaS 영업", "HW 영업", "SI 영업", "금융 영업", "보험 영업",
    "제약·의료 영업", "제조 영업", "유통 영업", "광고 영업", "미디어 영업",
    "교육 영업", "프랜차이즈 영업", "채널 영업", "파트너 영업", "입점 영업",
    "가맹 영업", "BD(Business Development)", "신규 고객 발굴 영업", "Key Account Manager", "Account Executive",
    "Sales Manager", "영업 기획", "영업 지원", "Sales Ops", "인사이드 세일즈",
    "선임 영업", "텔레세일즈", "고객 관리(AM)", "BDM(사업개발 매니저)", "대리점 영업",
    "해외 영업", "수출 영업", "유관기관 협력 영업", "공공기관 영업", "CRM 담당",
    "CS 운영", "리셀러 영업", "기업 제휴 영업", "파트너 매니저", "리테일 관리",
    "매장 관리자", "세일즈 트레이너", "영업 전략", "견적/입찰 담당", "세일즈 컨설턴트"
  ],
  경영: [
    "경영 기획", "전략 기획", "재무 기획", "경영 분석가", "사업 전략",
    "투자 전략", "예산 담당", "재무 회계", "관리 회계", "세무 담당",
    "IR(투자자 관계)", "HR 매니저", "HRBP", "인사 기획", "인사 운영",
    "채용 담당자", "C&B 보상 담당", "조직문화 담당", "평가/승진 운영", "노무 담당자",
    "총무", "구매 담당", "계약 담당", "법무 담당", "컴플라이언스",
    "리스크 관리", "운영 매니저", "PMO", "사무국 운영", "행정 담당",
    "문서/정보 관리", "공급망(SCM) 담당", "물류 기획", "물류 운영", "생산 기획",
    "품질관리(QA)", "내부 감사", "공정 관리", "ISO 관리", "시설 관리",
    "안전/보건 관리", "ESG 담당", "지속가능경영", "규제 대응", "경영 지원",
    "글로벌 운영", "지사 운영 담당", "리더십 개발(HRD)", "혁신/디지털 전환 담당", "비서/오피스 매니저"
  ],
  교육: [
    "교육 기획", "교육 운영", "교육 콘텐츠 기획", "교재 개발자", "온라인 교육 기획",
    "러닝 디자이너", "기업교육 강사", "직무교육 강사", "코딩 강사", "IT 교육 강사",
    "UX 교육 강사", "마케팅 교육 강사", "데이터 분석 교육 강사", "AI 교육 강사", "디자인 교육 강사",
    "청소년 교육 강사", "학원 강사", "대학 강사", "e-Learning 트레이너", "학습 코치",
    "튜터/멘토", "교육 컨설턴트", "교육 평가 담당", "교육 연구원", "직무역량 진단 담당",
    "HRD 매니저", "러닝센터 운영자", "연수/세미나 운영", "행사 교육 운영", "학습관리(LMS) 담당",
    "평가/시험 기획", "교육 매뉴얼 작성자", "교육 콘텐츠 영상 제작자", "교육 플랫폼 운영", "교육 상품 운영",
    "학습 데이터 분석가", "교육 프로듀서", "프로그램 매니저", "교수설계자(ID)", "강사 관리 담당",
    "교육 커뮤니티 매니저", "상담 교사(비상담직 버전)", "교육 영업", "교육 브랜드 마케터", "대학교 행정 직원",
    "학사 운영 담당", "교육 정책 담당", "교육 지원 행정", "학원 운영 관리자", "교육 스타트업 운영 매니저"
  ],
  기타: [
    "영상 편집자", "촬영 감독", "PD", "작가", "콘텐츠 에디터",
    "블로거/크리에이터", "유튜버", "스트리머", "MC/사회자", "번역가",
    "통역가", "리서치 분석가", "데이터 라벨러", "고객경험(CX) 매니저", "CS 운영",
    "아나운서", "기자", "편집 기자", "출판 편집자", "인쇄 기술자",
    "감정평가사", "공인중개사", "세무사 보조", "행정사 보조", "법률 서포트",
    "비서", "오피스 매니저", "문서 담당", "정책 분석가", "공공사업 기획",
    "NGO 기획", "사회 연구원", "문화 콘텐츠 기획", "예술 행정", "공연 기획",
    "무대 기술자", "조명/음향 엔지니어", "스포츠 트레이너", "요가/필라테스 강사", "PT 트레이너",
    "상담 매니저(비임상)", "플랫폼 운영 매니저", "배달 운영 관리자", "물류센터 운영자", "고객 성공 매니저(CSM)",
    "데이터 모니터링 요원", "품질 관리원", "콜센터 운영자", "전시 기획자", "행사 운영 매니저"
  ]
};

const selectedJob = ref("");
const jobRole = ref("");
const selectedExp = ref("");
const progressStep = ref(0);
const isDropdownOpen = ref(false);

const roleOptions = computed(() => {
  return selectedJob.value ? jobRolesData[selectedJob.value] || [] : [];
});

const selectJob = (job) => {
  selectedJob.value = job;
  jobRole.value = "";
  isDropdownOpen.value = false;
  if (!progressStep.value) progressStep.value = 1;
  updateProgress();
};

const toggleDropdown = (event) => {
  event.stopPropagation();
  if (selectedJob.value) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const selectRole = (role) => {
  jobRole.value = role;
  isDropdownOpen.value = false;
  updateProgress();
};

const selectExp = (exp) => {
  selectedExp.value = exp;
  progressStep.value = 2;
};

const updateProgress = () => {
  if (selectedJob.value && jobRole.value) progressStep.value = 1;
  if (selectedExp.value) progressStep.value = 2;
};

// 경력 문자열 → 숫자 변환
const convertCareer = (exp) => {
  if (exp === "신입") return 0;
  if (exp.includes("년")) return parseInt(exp);
  return 0;
};

const isFormComplete = computed(
  () =>
    name.value &&
    username.value &&
    email.value &&
    password.value &&
    selectedJob.value &&
    jobRole.value &&
    selectedExp.value
);

// =========================
// 🚀 회원가입 API 호출
// =========================
const handleSignup = async () => {
  if (!isFormComplete.value) return;

  try {
    await memberApi.register({
      name: name.value,
      loginId: username.value,
      password: password.value,
      email: email.value,
      jobGroup: selectedJob.value,
      jobRole: jobRole.value,
      careerYears: convertCareer(selectedExp.value),
    });

    alert("회원가입이 완료되었습니다!");
    router.push("/login");

  } catch (err) {
    alert(err.response?.data || "회원가입 실패");
  }
};

// 드롭다운 외부 클릭 처리
const handleClickOutside = (event) => {
  const dropdownContainer = event.target.closest('.dropdown-container');
  if (!dropdownContainer && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-toggle {
  border: 1px solid #ddd;
  font-size: 14px;
  padding: 10px 12px;
}

.dropdown-toggle:disabled {
  background: #f1f2f3 !important;
  color: #999 !important;
  cursor: not-allowed;
  border-color: #e5e5e5;
}

.btn-light {
  background: #fff;
  border-color: #ddd;
  color: #222;
}

.btn-light:hover:not(:disabled) {
  border-color: #71ebbe;
  background: #fff;
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f1f2f3;
}




.signup-page {
  background: #fff;
  min-height: 100vh;
  padding: 60px 20px;
}

.signup-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
}

.basic-info {
  max-width: 400px;
  margin: 0 auto 60px auto;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  outline: none;
}

input:focus {
  border-color: #71ebbe;
}

.password-box {
  position: relative;
  width: 100%;
}

.password-box input {
  width: 100%;
  padding-right: 38px;
}

.toggle-icon {
  position: absolute;
  right: 12px;
  top: 10px;
  font-size: 18px;
  color: #777;
  cursor: pointer;
}

.info-header {
  text-align: center;
  margin-bottom: 30px;
}

.info-header h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-header p {
  color: #777;
  font-size: 14px;
}

.progress-container {
  width: 100%;
  margin: 30px 0 50px;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.step {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eaecec;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  z-index: 2;
  transition: 0.3s;
}

.step.active {
  background: #a2f1d6;
  color: #111;
}

.step-label {
  font-size: 13px;
  color: #aaa;
  margin: 0 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #eaecec;
  border-radius: 2px;
  position: relative;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: #71ebbe;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.section {
  margin-bottom: 40px;
}

.section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.grid-5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.grid-item {
  background: #f1f2f3;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.grid-item.selected {
  background: #71ebbe;
  color: #000;
  font-weight: 600;
}

/* 드롭다운 */
.dropdown-container {
  position: relative;
  width: 100%;
}

.dropdown-toggle {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.dropdown-toggle:disabled {
  background: #f1f2f3;
  color: #999;
  cursor: not-allowed;
}

.dropdown-toggle:not(:disabled):hover {
  border-color: #71ebbe;
}

.dropdown-toggle .arrow {
  font-size: 12px;
  color: #777;
  transition: transform 0.2s;
  display: inline-block;
}

.dropdown-toggle .arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 0;
  list-style: none;
  margin: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f1f2f3;
}

.btn-submit {
  width: 100%;
  background: #71ebbe;
  border: none;
  color: #000;
  font-weight: 600;
  border-radius: 4px;
  padding: 12px 0;
  cursor: pointer;
  transition: 0.2s;
}

.btn-submit:disabled {
  background: #f1f2f3;
  color: #999;
  cursor: not-allowed;
}

.btn-submit:hover:enabled {
  background: #a2f1d6;
}

.btn-login-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #111;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
}

.btn-login-link:hover {
  color: #71ebbe;
}
</style>