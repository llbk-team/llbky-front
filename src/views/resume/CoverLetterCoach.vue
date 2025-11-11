<template>
  <div class="d-flex bg-light min-vh-100 overflow-auto">
    <SideBar />

    <!-- 메인 -->
    <section class="flex-grow-1 p-4">
      <div class="text-muted small mb-2">my &gt; 서류관리 &gt; 자기소개서</div>
      <h2 class="fw-semibold mb-4 text-dark">AI 자기소개서 코칭</h2>

      <div class="row g-4">
        <!-- 왼쪽: 작성 영역 -->
        <div class="col-lg-7">

          <!-- 자기소개서 입력 -->
          <div v-if="!isCoachingStarted">
            <h5 class="fw-bold text-dark mb-3">✏️ 자기소개서 작성</h5>
            <p class="text-muted small mb-4">
              각 항목에 맞게 자기소개서를 입력한 후 “AI 코칭 받기” 버튼을 눌러보세요.
            </p>

            <!-- 항목별 작성칸 -->
            <div
              v-for="(content, section) in introFields"
              :key="section"
              class="mb-4"
            >
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

          <!-- AI 코칭 결과 & 문체 버전 (AI 시작 후 표시) -->
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
            <div
              v-for="(content, section) in tabContent"
              :key="section"
              class="mb-4"
            >
              <h5 class="fw-bold text-dark mb-2">📌 {{ section }}</h5>
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <!-- 통으로 수정 가능한 영역 -->
                  <div
                    ref="editableRefs"
                    class="small text-secondary"
                    :class="{ 'border rounded p-3': isEditing && editingSection === section }"
                    :data-section="section"
                    @input="handleFullEdit($event, section)"
                    :contenteditable="isEditing && editingSection === section"
                    style="white-space: pre-line; outline: none; min-height: 120px;"
                  >
                    {{ content.join('\n') }}
                  </div>

                  <!-- 버튼 영역 -->
                  <div class="text-end mt-2 d-flex justify-content-end gap-2">
                    <template v-if="isEditing && editingSection === section">
                      <button class="btn btn-mint btn-sm fw-medium" @click="saveEdit(section)">
                        💾 저장
                      </button>
                      <button class="btn btn-outline-secondary btn-sm fw-medium" @click="cancelEdit">
                        ❌ 취소
                      </button>
                    </template>
                    <template v-else>
                      <button
                        class="btn btn-outline-secondary btn-sm fw-medium"
                        @click="enableEdit(section)"
                      >
                        ✏️ 수정
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- 리포트 생성 버튼 (전체 카드 하단, 오른쪽 정렬) -->
            <div class="text-end mt-4">
              <button class="btn btn-outline-secondary fw-medium btn-sm px-4 py-2">
                📄 리포트 생성하기
              </button>
            </div>

          </div>
        </div>

        <!-- 오른쪽: 코칭 결과 -->
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
              <button
                type="button"
                class="btn btn-outline-secondary flex-fill fw-medium btn-sm"
                @click="copyVersion(version.text)"
              >
                📋 복사하기
              </button>
              <button
                class="btn btn-mint flex-fill fw-medium btn-sm"
                data-bs-dismiss="modal"
                @click="applyVersion(version.text)"
              >
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
import { ref, reactive } from "vue";
import SideBar from "@/components/sidebar/SideBar.vue";

// 입력
const introFields = reactive({
  "지원 동기": "",
  "성장 경험": "",
  "직무 역량": "",
  "입사 후 포부": "",
});

// AI 결과
const tabContent = reactive({
  "지원 동기": [
    "귀사의 클라우드 플랫폼 서비스가 글로벌 시장에서 인정받는 것을 보며 큰 감명을 받았습니다.",
    "특히 최근 출시한 서버리스 컴퓨팅 서비스는 개발자 경험을 혁신적으로 개선했다고 평가받고 있습니다.",
    "귀사에 입사하여 클라우드 네이티브 기술을 활용한 혁신적인 서비스 개발에 기여하고 싶습니다.",
  ],
  "성장 경험": [
    "저는 어려서부터 문제 해결에 몰입하는 습관이 있었습니다.",
    "대학교 시절, 팀 프로젝트 중 발생한 서버 다운 문제를 해결하며 백엔드 개발에 흥미를 느꼈습니다.",
  ],
  "직무 역량": [
    "3년간 백엔드 개발자로 일하며 MSA 기반의 안정적인 서버 구조를 설계했습니다.",
    "Java, Spring Boot, PostgreSQL을 활용한 프로젝트 경험이 풍부합니다.",
  ],
  "입사 후 포부": [
    "입사 후 빠르게 팀에 적응하고 클라우드 서비스의 효율을 개선하겠습니다.",
    "장기적으로는 서비스 아키텍처 고도화를 주도하는 엔지니어로 성장하겠습니다.",
  ],
});

const isCoachingStarted = ref(false);

const startCoaching = () => {
  // 실제 AI 분석 API 호출 자리
  isCoachingStarted.value = true;
};

// 문체 버전
const versions = [
  {
    id: 1,
    name: "간결한 버전",
    text: `IT 업계에서 3년간 백엔드 개발 경험을 쌓았습니다.
Spring Boot와 MSA 아키텍처를 활용한 대규모 시스템 구축 경험이 있으며,
귀사의 클라우드 플랫폼 서비스 개선에 기여하고 싶습니다.`,
  },
  {
    id: 2,
    name: "사례 중심 버전",
    text: `대학교 시절, 팀 프로젝트 중 발생한 서버 다운 문제를 해결하며
시스템 설계와 성능 최적화의 중요성을 배웠습니다.
이 경험을 바탕으로 현재 안정적이고 효율적인 백엔드 구조를 설계하고 있습니다.`,
  },
  {
    id: 3,
    name: "비전 제시형 버전",
    text: `저는 클라우드 인프라와 백엔드 기술을 결합하여
확장 가능한 서비스를 구축하는 것을 목표로 합니다.
귀사의 혁신적인 기술 환경 속에서 성장하고 싶습니다.`,
  },
];

const copyVersion = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("복사되었습니다 ✅");
  } catch {
    alert("복사 중 오류가 발생했습니다 ❌");
  }
};

// ✅ 전체 항목에 문체 버전 적용
const applyVersion = (text) => {
  const lines = text.split("\n");
  Object.keys(tabContent).forEach((key) => {
    tabContent[key] = lines;
  });
  alert("선택한 문체 버전이 전체 항목에 적용되었습니다 ✨");
};

// 수정 관련 상태
const isEditing = ref(false);
const editingSection = ref(null);
const editedText = ref("");

// ✏️ 수정 시작
const enableEdit = (section) => {
  isEditing.value = true;
  editingSection.value = section;
  editedText.value = tabContent[section].join("\n\n");
};

// 💾 저장
const saveEdit = (section) => {
  if (!editedText.value.trim()) return;
  tabContent[section] = editedText.value.split("\n\n");
  isEditing.value = false;
  editingSection.value = null;
  alert(`"${section}" 수정이 저장되었습니다 ✅`);
};

// ❌ 취소
const cancelEdit = () => {
  isEditing.value = false;
  editingSection.value = null;
  editedText.value = "";
};

// 실시간 수정 (문장 단위 → 전체 박스 통합)
const handleFullEdit = (e, section) => {
  if (isEditing.value && editingSection.value === section) {
    // 줄바꿈 포함해서 그대로 반영
    const updated = e.target.innerText.split('\n').filter(line => line.trim() !== '');
    tabContent[section] = updated;
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
</style>
