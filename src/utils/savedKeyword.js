// 키워드 저장소 컴포넌트 js

import { ref, computed, onMounted } from "vue";
import jobInsightApi from "@/apis/jobInsightApi";

function userSavedKeyword(memberId) {

/* ============================
    상태
=============================*/
const keywords = ref([]);     // [{savedKeywordId, keyword, sourceLabel, createdAt}]
const newKeyword = ref("");
const saveLoading = ref(false);

/* ============================
    날짜 포맷
=============================*/
const formatDate = (dt) => dt?.split("T")[0] || "-";

const latestDate = computed(() => {
  if (keywords.value.length === 0) return "-";
  return formatDate(
    keywords.value.map(k => k.createdAt).sort().reverse()[0]
  );
});

/* ============================
    DB 저장 키워드 불러오기
=============================*/
const loadKeywords = async () => {
  const res = await jobInsightApi.getSavedKeywords(memberId);
  keywords.value = res.data;
};

/* ============================
    키워드 추가(DB 저장)
=============================*/
const addKeyword = async () => {
  const kw = newKeyword.value.trim();
  if (!kw) return alert("키워드를 입력해주세요.");

  // 중복 체크
  if (keywords.value.some(k => k.keyword === kw)) {
    return alert("이미 저장된 키워드입니다.");
  }

  saveLoading.value = true;

  await jobInsightApi.saveKeyword({
    memberId,
    keyword: kw,
    sourceLabel: "직접추가",
  });

  await loadKeywords();
  newKeyword.value = "";
  alert(`'${kw}' 키워드가 추가되었습니다!`);
  saveLoading.value = false;
};

/* ============================
    키워드 삭제(DB)
=============================*/
const deleteKeyword = async (savedKeywordId) => {
  if (!confirm("삭제하시겠습니까?")) return;

  saveLoading.value = true;
  await jobInsightApi.deleteKeyword(savedKeywordId);
  await loadKeywords();
  saveLoading.value = false;
};

/* ============================
    전체 삭제
=============================*/
const clearAll = async () => {
  if (!confirm("저장된 모든 키워드를 삭제하시겠습니까?")) return;

  for (const item of keywords.value) {
    await jobInsightApi.deleteKeyword(item.savedKeywordId);
  }
  await loadKeywords();
};

/* ============================
    카테고리 그룹(sourceLabel 기준)
=============================*/
const grouped = computed(() => {
  const groups = {};

  keywords.value.forEach(item => {
    const label = item.sourceLabel || "기타";

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
});

/* ============================
    그룹 정렬: 직접추가 → 나머지 알파벳순
=============================*/
const filteredGroups = computed(() => {
  const result = {};

  const direct = "직접추가";

  // 직접추가 최상단
  if (grouped.value[direct]) {
    result[direct] = grouped.value[direct];
  }

  // 나머지 카테고리 정렬
  Object.keys(grouped.value)
    .filter(label => label !== direct)
    .sort()
    .forEach(label => { result[label] = grouped.value[label] });

  return result;
});

/* ============================
    초기 로딩
=============================*/
onMounted(loadKeywords);

return {
  // 상태
  keywords,
  newKeyword,
  saveLoading,

  // 표시용
  latestDate,
  filteredGroups,
  formatDate,

  // 기능
  addKeyword,
  deleteKeyword,
  clearAll,
  loadKeywords
}
}

export default userSavedKeyword;