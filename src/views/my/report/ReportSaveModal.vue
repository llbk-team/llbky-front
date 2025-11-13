<template>
  <!-- 리포트 저장 Modal -->
  <div class="modal" id="reportSaveModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">

        <!-- Header -->
        <div class="modal-header border-0 modal-header-tight">
          <h5 class="modal-title fw-bold">리포트 저장</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <!-- Body -->
        <div class="modal-body modal-body-tight">
          <p class="modal-desc">저장할 리포트의 제목과 메모를 입력해주세요.</p>
          <hr class="modal-divider" />

          <div v-for="(r, i) in reportForms" :key="i" class="report-input-block">
            <label class="block-label">리포트 제목</label>
            <input type="text" v-model="r.title" placeholder="예: 이력서 분석 리포트" class="input-title mb-3" />

            <label class="block-label">메모</label>
            <textarea v-model="r.memo" placeholder="리포트에 대한 간단한 설명을 입력하세요" class="input-memo" rows="3"></textarea>

            <hr class="sub-divider" v-if="i !== reportForms.length - 1" />
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-0">
          <button class="btn-cancel" data-bs-dismiss="modal">취소</button>
          <button class="btn-save" @click="saveSelectedReports">
            리포트 생성 <i class="ri-download-2-line"></i>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const reportForms = ref([{ title: "", memo: "" }]);

const saveSelectedReports = () => {
  const filled = reportForms.value.filter(r => r.title.trim() !== "");
  if (filled.length === 0) {
    alert("최소 1개 이상의 리포트 제목을 입력해주세요.");
    return;
  }
  console.log("저장된 리포트:", filled);
};
</script>

<style scoped>
/* 모달 박스 */
.custom-modal {
  width: 380px;
  padding: 10px;
  border-radius: 12px;
  background: #fff;
}

/* ✨ 제목-내용 간격 축소 */
.modal-header-tight {
  margin-bottom: -22px !important;
}

.modal-body-tight {
  padding-top: 6px !important;
}

/* 설명문 */
.modal-desc {
  font-size: 12px;
  color: #888;
  margin: 0 0 8px;
  /* 간격 축소 */
}

/* 구분선 */
.modal-divider {
  border: 0;
  height: 1px;
  background: #e5e5e5;
  margin: 8px 0 14px;
  /* 간격 축소 */
}

/* 리포트 입력 블록 */
.report-input-block {
  margin-bottom: 16px;
}

.block-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.input-title,
.input-memo {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
}

.input-title:focus,
.input-memo:focus {
  outline: none;
  border-color: #71ebbe;
  box-shadow: 0 0 0 2px rgba(113, 235, 190, 0.25);
}

.input-memo {
  resize: none;
}

.sub-divider {
  height: 1px;
  background: #efefef;
  border: 0;
  margin: 14px 0;
}

/* 버튼 */
.btn-cancel {
  width: 75px;
  height: 33px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  background: #f1f2f3;
  color: #333;
}

.btn-save {
  width: 120px;
  height: 33px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  background: #71ebbe;
  font-weight: 600;
  color: #000;
}
</style>
