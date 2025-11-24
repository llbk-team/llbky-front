<!-- 자소서 상세 페이지 컴포넌트 -->
<template>
  <div class="d-flex bg-light min-vh-100 overflow-auto">
    
    <!-- 메인 -->
    <section class="flex-grow-1 content-wrapper">

      <h2 class="fw-semibold mb-4 text-dark">{{ memberName }}님의 자기소개서</h2>

      <div class="row g-4">

        <!-- 왼쪽: 상세 / 수정 영역 -->
        <div class="col-lg-7 mb-4">

          <div v-for="(value, section) in introFields" :key="section" class="mb-4">
            <h5 class="fw-bold text-dark mb-2">📌 {{ section }}</h5>

            <div class="card border-0 shadow-sm">
              <div class="card-body">

                <!-- 수정 모드 -->
                <template v-if="isEditMode">
                  <textarea
                    v-model="introFields[section]"
                    class="form-control"
                    rows="5"
                  ></textarea>
                </template>

                <!-- 상세보기 모드 -->
                <template v-else>
                  <div class="small text-secondary"
                    style="white-space: pre-line; min-height: 120px;">
                    {{ value }}
                  </div>
                </template>

                <div class="text-end mt-2 d-flex justify-content-end gap-2">
                  <button
                    class="btn btn-outline-secondary btn-sm fw-medium"
                    @click="openStyleModal(section)"
                  >
                    ✏️ 문체 선택
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button
              class="btn btn-mint fw-medium btn-sm px-4"
              @click="isEditMode ? saveAllEdit() : editMode()"
            >
              {{ isEditMode ? "저장하기" : "수정하기" }}
            </button>
          </div>

        </div>

        <!-- 오른쪽: AI 코칭 결과 -->
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm">
            <div class="card-body">

              <h5 class="fw-bold mb-3">AI 코칭 결과</h5>

              <div class="p-3 border rounded mb-3">
                <h6 class="fw-bold mb-2">🧾 문장 분석</h6>
                <ul class="small text-muted mb-0 ps-3">
                  <li>문법: {{ feedback.grammarScore }}</li>
                  <li>가독성: {{ feedback.readabilityScore }}</li>
                  <li>논리 흐름: {{ feedback.logicFlowScore }}</li>
                </ul>
              </div>

              <div class="p-3 border rounded mb-3 bg-light-mint">
                <h6 class="fw-bold mb-2">💪 강점</h6>
                <ul class="small text-muted mb-0 ps-3">
                  <li v-for="(s, idx) in feedback.strength" :key="idx">{{ s }}</li>
                </ul>
              </div>

              <div class="p-3 border rounded bg-white">
                <h6 class="fw-bold mb-2">💡 개선 제안</h6>
                <ul class="small text-muted mb-0 ps-3">
                  <li v-for="(i, idx) in feedback.improvement" :key="idx">{{ i }}</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- 문체 버전 모달 -->
      <div class="modal fade" id="styleModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">

            <div class="modal-header">
              <h5 class="modal-title fw-semibold text-dark">
                {{ selectedSection }} 문체 버전
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body small text-secondary">
              <div v-for="version in versions" :key="version.id" class="mb-3">
                <h6 class="fw-bold">{{ version.name }}</h6>
                <p class="mb-0" style="white-space: pre-line;">{{ version.text }}</p>
                <div class="text-end mt-2">
                  <button
                    class="btn btn-mint fw-medium btn-sm mt-2"
                    data-bs-dismiss="modal"
                    @click="applyVersion(version.text)"
                  >
                    적용하기
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import coverletterDetail from "@/utils/coverletterDetail";

const {
  introFields,
  feedback,
  versions,
  selectedSection,
  openStyleModal,
  applyVersion,
  loadCoverLetter,
  memberName,
  isEditMode,
  editMode,
  saveAllEdit
} = coverletterDetail.useCoverletterDetail();

onMounted(() => {
  loadCoverLetter();
});
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
  padding: 3rem 6rem;
  max-width: 1440px;
  margin: 0 auto;
}

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

.content-wrapper > h2 {
  font-size: 1.75rem !important;
  font-weight: 700 !important;
  color: #111 !important;
  margin-bottom: 1.5rem !important;
}
</style>
