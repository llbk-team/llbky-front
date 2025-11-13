<template>
  <div class="d-flex bg-light min-vh-100 overflow-auto">
    <!-- 메인 -->
    <section class="flex-grow-1 content-wrapper">
      <h2 class="fw-semibold mb-4 text-dark">자기소개서 작성하기</h2>

      <div class="row g-4">
        <!-- 왼쪽: 작성 / 코칭 영역 -->
        <div class="col-lg-7">

          <!-- 작성 모드 -->
          <div v-if="!isCoachingStarted">
            <p class="text-muted small mb-4">
              각 항목에 맞게 자기소개서를 입력한 후 “AI 코칭 받기” 버튼을 눌러보세요.
            </p>

            <div v-for="(value, section) in introFields" :key="section" class="mb-4">
              <h6 class="fw-bold text-dark mb-2">{{ section }}</h6>
              <textarea
                v-model="introFields[section]"
                class="form-control border rounded small text-secondary"
                rows="4"
                placeholder="이 항목에 대한 내용을 입력하세요..."
              ></textarea>
            </div>

            <div class="d-flex justify-content-end">
              <button class="btn btn-mint fw-medium btn-sm px-4" @click="startCoaching">
                🚀 AI 코칭 받기
              </button>
            </div>
          </div>

          <!-- 코칭 결과 모드 -->
          <div v-else>
            <!-- 문체 버전 선택 -->
            <div class="card border-0 shadow-sm mb-4" style="max-width: 95%;">
              <div class="card-body">
                <h5 class="fw-semibold mb-1 text-dark">문체 버전 선택</h5>
                <p class="text-muted small mb-4">
                  원하는 문체 스타일을 선택하면 자동으로 변환됩니다
                </p>

                <div class="d-flex flex-wrap gap-2 mb-2">
                  <button
                    v-for="version in versions"
                    :key="version.id"
                    class="btn btn-outline-secondary w-auto px-3 py-2 fw-medium btn-sm"
                    data-bs-toggle="modal"
                    :data-bs-target="'#modal-' + version.id"
                  >
                    {{ version.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 작성 내용 카드 -->
            <div v-for="(content, section) in tabContent" :key="section" class="mb-4">
              <h5 class="fw-bold text-dark mb-2">📌 {{ section }}</h5>
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <div
                    class="small text-secondary"
                    :class="{ 'border rounded p-3': isEditing && editingSection === section }"
                    @input="handleFullEdit($event, section)"
                    :contenteditable="isEditing && editingSection === section"
                    style="white-space: pre-line; outline: none; min-height: 120px;"
                  >
                    {{ content.join('\n') }}
                  </div>

                  <div class="text-end mt-2 d-flex justify-content-end gap-2">
                    <template v-if="isEditing && editingSection === section">
                      <button class="btn btn-mint btn-sm fw-medium" @click="saveEdit(section)">💾 저장</button>
                      <button class="btn btn-outline-secondary btn-sm fw-medium" @click="cancelEdit">❌ 취소</button>
                    </template>
                    <template v-else>
                      <button class="btn btn-outline-secondary btn-sm fw-medium" @click="enableEdit(section)">✏️ 수정</button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: AI 코칭 결과 -->
        <div class="col-lg-5" v-if="isCoachingStarted">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="fw-bold mb-3">AI 코칭 결과</h5>

              <div class="p-3 border rounded mb-3">
                <h6 class="fw-bold mb-2">🧾 문장 분석</h6>
                <ul class="small text-muted mb-0 ps-3">
                  <li>문법: 95점 — 우수</li>
                  <li>가독성: 88점 — 양호</li>
                  <li>논리 흐름: 90점 — 우수</li>
                  <li>STAR 기법: 부분 적용</li>
                </ul>
              </div>

              <div class="p-3 border rounded mb-3 bg-light-mint">
                <h6 class="fw-bold mb-2">💪 강점</h6>
                <ul class="small text-muted mb-0 ps-3">
                  <li>회사에 대한 이해도가 높습니다.</li>
                  <li>구체적인 경험을 중심으로 서술했습니다.</li>
                  <li>입사 후 개인 방향이 명확합니다.</li>
                </ul>
              </div>

              <div class="p-3 border rounded bg-white">
                <h6 class="fw-bold mb-2">💡 개선 제안</h6>
                <ul class="small text-muted mb-0 ps-3">
                  <li>수치를 더 구체적으로 제시하세요.</li>
                  <li>STAR 기법을 완전히 적용하면 더 명확해집니다.</li>
                  <li>회사 비전과 본인의 목표를 연결하세요.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 문체 버전 모달 -->
      <div
        v-for="version in versions"
        :key="'modal-' + version.id"
        class="modal fade"
        :id="'modal-' + version.id"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header">
              <h5 class="modal-title fw-semibold text-dark">{{ version.name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body small text-secondary">
              <p class="mb-0" style="white-space: pre-line;">{{ version.text }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary flex-fill fw-medium btn-sm" @click="copyVersion(version.text)">
                📋 복사하기
              </button>
              <button class="btn btn-mint flex-fill fw-medium btn-sm" data-bs-dismiss="modal" @click="applyVersion(version.text)">
                ✅ 이 버전 선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 작성용 초기 데이터
const introFields = reactive({
  "지원 동기": "",
  "성장 경험": "",
  "직무 역량": "",
  "입사 후 포부": "",
});

const isCoachingStarted = ref(false);

// 기존 자소서일 경우 자동 로드
onMounted(() => {
  const id = route.query.id;
  if (id) {
    // 정적 데이터 기반
    loadCoverLetterData(Number(id));
  }
});

// 더미 데이터
const dummyCoverLetters = [
  {
    id: 1,
    "지원 동기": "카카오의 기술 문화와 서비스 철학에 매력을 느껴 지원했습니다.",
    "성장 경험": "AI 해커톤에 참여해 백엔드 개발과 팀 리딩을 맡았습니다.",
    "직무 역량": "Spring Boot, MyBatis, PostgreSQL 활용 경험이 있습니다.",
    "입사 후 포부": "카카오 클라우드 서비스 확장에 기여하고 싶습니다.",
  },
];

// 정적 데이터 로드
const loadCoverLetterData = (id) => {
  const found = dummyCoverLetters.find((item) => item.id === id);
  if (found) {
    Object.keys(introFields).forEach((key) => {
      introFields[key] = found[key];
    });
    isCoachingStarted.value = true;
  }
};

// AI 결과용 (시작 후 표시될 기본 데이터)
const tabContent = reactive({
  "지원 동기": [],
  "성장 경험": [],
  "직무 역량": [],
  "입사 후 포부": [],
});

// 작성 완료 후 코칭 시작
const startCoaching = () => {
  Object.keys(tabContent).forEach((key) => {
    tabContent[key] = introFields[key]
      ? introFields[key].split("\n")
      : ["내용이 없습니다."];
  });
  isCoachingStarted.value = true;
};

// 문체 버전들
const versions = [
  {
    id: 1,
    name: "간결한 버전",
    text: `3년간 백엔드 개발 경험을 쌓았습니다.
Spring Boot와 MSA 구조를 활용하여 안정적인 서버를 구축했습니다.
귀사의 기술 발전에 기여하고 싶습니다.`,
  },
  {
    id: 2,
    name: "사례 중심 버전",
    text: `팀 프로젝트 중 서버 장애를 해결하며 문제 해결력과 협업 능력을 길렀습니다.
이 경험을 기반으로 안정적인 백엔드 시스템을 설계하고 있습니다.`,
  },
  {
    id: 3,
    name: "비전 제시형 버전",
    text: `클라우드 인프라와 백엔드 기술을 결합해
확장 가능한 서비스를 구축하는 엔지니어로 성장하고 싶습니다.`,
  },
];

// 복사 / 적용 기능
const copyVersion = async (text) => {
  await navigator.clipboard.writeText(text);
};

const applyVersion = (text) => {
  const lines = text.split("\n");
  Object.keys(tabContent).forEach((key) => (tabContent[key] = lines));
};

// 수정 기능
const isEditing = ref(false);
const editingSection = ref(null);
const editedText = ref("");

const enableEdit = (section) => {
  isEditing.value = true;
  editingSection.value = section;
  editedText.value = tabContent[section].join("\n\n");
};

const saveEdit = (section) => {
  tabContent[section] = editedText.value.split("\n\n");
  isEditing.value = false;
  editingSection.value = null;
};

const cancelEdit = () => {
  isEditing.value = false;
  editingSection.value = null;
  editedText.value = "";
};

const handleFullEdit = (e, section) => {
  if (isEditing.value && editingSection.value === section) {
    tabContent[section] = e.target.innerText.split("\n").filter((l) => l.trim());
  }
};
</script>

<style scoped>
.btn-mint {
  background-color: #71ebbe !important;
  color: #000 !important;
  border: none !important;
}
.bg-light-mint {
  background-color: #eafff5 !important;
}
.content-wrapper {
  padding: 3rem 6rem; /* ✅ 상하 3rem, 좌우 6rem (기존보다 훨씬 여유) */
  max-width: 1440px;
  margin: 0 auto; /* ✅ 중앙 정렬 */
}

/* 좁은 화면에서는 자동으로 줄여줌 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 2rem 3rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem 1.5rem;
  }
}

/* 페이지 제목 통일 스타일 */
.content-wrapper > h2 {
  font-size: 1.75rem !important;
  font-weight: 700 !important;
  color: #111 !important;
  margin-bottom: 1.5rem !important;
}

</style>
