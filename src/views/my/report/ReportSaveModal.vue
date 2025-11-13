<template>
  <!-- 리포트 저장 Modal -->
  <div class="modal fade" id="reportSaveModal" tabindex="-1" aria-labelledby="reportSaveModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">
        <!-- Header -->
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold" id="reportSaveModalLabel">리포트 저장</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <p class="modal-desc">저장할 리포트를 선택해주세요.</p>

          <hr class="modal-divider" />

          <!-- 체크박스 리스트 -->
          <div v-for="r in reportOptions" :key="r.value" class="checkbox-row" @click="toggleSelect(r.value)">
            <input type="checkbox" :value="r.value" v-model="selectedReports" @change="handleSelect(r.value)" />
            <label>{{ r.label }}</label>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-0">
          <button type="button" class="btn-cancel" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn-save" @click="saveSelectedReports">리포트 생성 <i class="ri-download-2-line"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedReports = ref([]);

const reportOptions = [
  { value: "all", label: "전체 선택" },
  { value: "resume", label: "이력서 분석" },
  { value: "interview", label: "면접 분석" },
  { value: "learning", label: "학습 분석" },
];

const handleSelect = (value) => {
  if (value === "all") {
    if (selectedReports.value.includes("all")) {
      selectedReports.value = reportOptions.map((r) => r.value);
    } else {
      selectedReports.value = [];
    }
  } else {
    const others = reportOptions.filter((r) => r.value !== "all").map((r) => r.value);
    const allSelected = others.every((v) => selectedReports.value.includes(v));

    if (allSelected && !selectedReports.value.includes("all")) {
      selectedReports.value.push("all");
    } else if (!allSelected && selectedReports.value.includes("all")) {
      selectedReports.value = selectedReports.value.filter((v) => v !== "all");
    }
  }
};

const toggleSelect = (value) => {
  if (selectedReports.value.includes(value)) {
    selectedReports.value = selectedReports.value.filter((v) => v !== value);
  } else {
    selectedReports.value.push(value);
    handleSelect(value);
  }
};

const saveSelectedReports = () => {
  if (selectedReports.value.length === 0) {
    alert("저장할 리포트를 선택해주세요.");
    return;
  }
  alert(`선택된 리포트: ${selectedReports.value.join(", ")}`);
};
</script>
<style scoped>
/* 모달 박스 */
.custom-modal {
  width: 380px;
  padding: 20px 25px;
  border-radius: 12px;
  background: #fff;
}

/* 설명문 */
.modal-desc {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

/* 구분선 */
.modal-divider {
  border: none;
  height: 1px;
  background: #e5e5e5;
  margin: 12px 0 15px;
}

/* 체크박스 줄 */
.checkbox-row {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 12px;
  gap: 8px;
}

.checkbox-row label {
  font-size: 14px;
  color: #111;
  cursor: pointer;
}

/* 체크박스 커스텀 */
.checkbox-row input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border: 2px solid #393939;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: 0.15s;
}

/* Hover 시 mint border */
.checkbox-row input[type="checkbox"]:hover {
  border-color: #71ebbe;
}

/* 체크됨 — 배경 mint + 체크기호 */
.checkbox-row input[type="checkbox"]:checked {
  background-color: #71ebbe;
  border-color: #71ebbe;
}

.checkbox-row input[type="checkbox"]:checked::after {
  content: "✔";
  font-size: 12px;
  color: #fff;
  position: absolute;
  top: -1px;
  left: 2px;
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
  cursor: pointer;
}

.btn-save {
  width: 120px;
  height: 33px;
  background: #71ebbe;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
}
</style>
