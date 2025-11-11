<template>
    <section class="report-wrapper">
        <header class="report-header">
            <div class="report-title">
                <h2>통합 리포트</h2>
                <p>기능별 상세 분석 및 통계를 확인하세요</p>
            </div>
            <button class="save-btn" data-bs-toggle="modal" data-bs-target="#reportSaveModal">
                리포트 생성 <i class="ri-download-2-line"></i>
            </button>
        </header>

        <div class="report-body">
            <ActivityReport />
            <ResumeReport />
            <InterviewReport />
            <LearningReport />
        </div>

        <!-- ✅ 모달 -->
        <div class="modal fade" id="reportSaveModal" tabindex="-1" aria-labelledby="reportSaveModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content custom-modal">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold" id="reportSaveModalLabel">
                            리포트 생성
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
                    </div>

                    <div class="modal-body">
                        <p class="modal-desc">저장할 리포트 섹션을 선택하세요</p>

                        <!-- 체크박스 목록 -->
                        <div v-for="item in reportOptions" :key="item.value" class="select-item"
                            @click="toggleSelect(item.value)">
                            <div class="form-check d-flex align-items-center">
                                <input class="form-check-input" type="checkbox" :id="item.value" :value="item.value"
                                    v-model="selectedReports" @change="handleSelect(item.value)" />
                                <label class="form-check-label ms-2 d-flex align-items-center" :for="item.value">
                                    <i :class="item.icon" class="me-2 text-success"></i>
                                    {{ item.label }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-outline-secondary rounded-pill px-4"
                            data-bs-dismiss="modal">
                            취소
                        </button>
                        <button type="button" class="btn btn-save rounded-pill px-4" data-bs-dismiss="modal"
                            @click="saveSelectedReports">
                            <i class="ri-download-2-line me-2"></i> 리포트 생성
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from "vue";
import ResumeReport from "../report/ResumeReport.vue";
import InterviewReport from "../report/InterviewReport.vue";
import LearningReport from "../report/LearningReport.vue";
import ActivityReport from "../report/ActivityReport.vue";

const selectedReports = ref([]);

const reportOptions = [
    { value: "all", label: "전체 선택" }, //, icon: "ri-checkbox-line"
    { value: "activity", label: "활동 및 참여도 분석" },
    { value: "resume", label: "이력서 분석" },
    { value: "interview", label: "면접 분석" },
    { value: "learning", label: "학습 분석" },
];

// ✅ 전체 선택/해제 로직
const handleSelect = (value) => {
    if (value === "all") {
        if (selectedReports.value.includes("all")) {
            selectedReports.value = reportOptions.map((r) => r.value);
        } else {
            selectedReports.value = [];
        }
    } else {
        const others = reportOptions
            .filter((r) => r.value !== "all")
            .map((r) => r.value);
        const allSelected = others.every((v) =>
            selectedReports.value.includes(v)
        );
        if (allSelected && !selectedReports.value.includes("all")) {
            selectedReports.value.push("all");
        } else if (!allSelected && selectedReports.value.includes("all")) {
            selectedReports.value = selectedReports.value.filter((v) => v !== "all");
        }
    }
};

// ✅ 선택 영역 클릭 시도 동일 작동
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
    console.log("선택된 리포트:", selectedReports.value);
    alert(`선택된 리포트: ${selectedReports.value.join(", ")}`);
};
</script>

<style scoped>
/* -----------------------
   전체 레이아웃
------------------------ */
.report-wrapper {
    padding: 40px 60px;
    background-color: #ffffff;
    color: #111111;
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #f1f2f3;
    padding-bottom: 10px;
    margin-bottom: 30px;
}

.report-title h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.report-title p {
  font-size: 13px;
  color: #666;
}

.save-btn {
    background-color: #71ebbe;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    color: #000000;
    transition: all 0.2s;
}

.save-btn:hover {
    background-color: #a2f1d6;
}

.report-body {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

/* -----------------------
   모달 스타일
------------------------ */
.custom-modal {
    border-radius: 14px;
    border: 1px solid #eaebec;
    background-color: #ffffff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.modal-title {
    font-weight: 700;
    color: #111111;
}

.modal-desc {
    font-size: 14px;
    color: #555;
    text-align: center;
    margin-bottom: 16px;
}

/* -----------------------
   체크 아이템
------------------------ */
.select-item {
    border-radius: 10px;
    padding: 8px 10px;
    margin-bottom: 6px;
    transition: background 0.2s;
}

.select-item:hover {
    background-color: #f1f2f3;
}

.form-check-input {
    cursor: pointer;
    border: 2px solid #a2f1d6;
    width: 1.1em;
    height: 1.1em;
}

.form-check-input:checked {
    background-color: #71ebbe;
    border-color: #71ebbe;
}

.form-check-label {
    cursor: pointer;
    color: #111111;
    display: flex;
    align-items: center;
}

.form-check-label i {
    color: #71ebbe;
}

/* -----------------------
   버튼
------------------------ */
.btn-save {
    background-color: #71ebbe;
    color: #000;
    border: none;
    font-weight: 600;
    transition: 0.2s;
}

.btn-save:hover {
    background-color: #a2f1d6;
}

.btn-outline-secondary {
    border: 1px solid #eaebec;
    color: #111111;
}

.btn-outline-secondary:hover {
    background-color: #f1f2f3;
}
</style>
