<template>
  <div class="saved-page">

    <!-- 헤더 -->
    <div class="header">
      <router-link to="/trend/insight" class="back">← 돌아가기</router-link>
      <h2>내 키워드 저장소</h2>
      <p class="subtitle">AI 인사이트에서 저장한 키워드 목록입니다.</p>
    </div>

    <!-- 키워드 추가 -->
    <div class="add-keyword-box">
      <input 
        v-model="newKeyword"
        @keyup.enter="addKeyword"
        type="text"
        class="add-input"
        placeholder="새 키워드를 입력하세요"
      />
      <button class="add-btn" @click="addKeyword">추가</button>
    </div>

    <!-- 카테고리 -->
    <div 
      v-if="Object.keys(filteredGroups).length > 0"
      class="keyword-container"
    >
      <div 
        class="category"
        v-for="(list, label) in filteredGroups"
        :key="label"
      >

        <div class="category-header">
          <h3>{{ label }}</h3>
          <span>{{ list.length }}개</span>
        </div>

        <div class="keyword-list">
          <div 
            class="keyword-card"
            v-for="item in list"
            :key="item.savedKeywordId"
          >
            <div class="top">
              <span class="word">{{ item.keyword }}</span>

              <!-- 삭제 -->
              <button class="delete-btn" @click="deleteKeyword(item.savedKeywordId)">
                ❌
              </button>
            </div>
            <small>{{ formatDate(item.createdAt) }}</small>
          </div>
        </div>

      </div>
    </div>

    <!-- 저장 없음 -->
    <div v-else class="empty">
      <p>저장된 키워드가 없습니다 😢</p>
      <p class="empty-hint">AI 인사이트 페이지에서 키워드를 추가하세요!</p>
    </div>

    <!-- 통계 -->
    <div class="stats-box" v-if="keywords.length > 0">
      <div class="stat">
        <p>총 저장 키워드</p>
        <h3>{{ keywords.length }}개</h3>
      </div>

      <div class="stat">
        <p>카테고리 수</p>
        <h3>{{ Object.keys(filteredGroups).length }}개</h3>
      </div>

      <div class="stat">
        <p>최근 저장</p>
        <h3>{{ latestDate }}</h3>
      </div>
    </div>

    <!-- 전체 삭제 -->
    <div class="actions" v-if="keywords.length > 0">
      <button class="clear-all-btn" @click="clearAll">전체 삭제</button>
    </div>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import jobInsightApi from "@/apis/jobInsightApi";

const memberId = 1;

/* ============================
    상태
=============================*/
const keywords = ref([]);     // [{savedKeywordId, keyword, sourceLabel, createdAt}]
const newKeyword = ref("");

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

  await jobInsightApi.saveKeyword({
    memberId,
    keyword: kw,
    sourceLabel: "직접추가",
  });

  await loadKeywords();
  newKeyword.value = "";
  alert(`'${kw}' 키워드가 추가되었습니다!`);
};

/* ============================
    키워드 삭제(DB)
=============================*/
const deleteKeyword = async (savedKeywordId) => {
  if (!confirm("삭제하시겠습니까?")) return;

  await jobInsightApi.deleteKeyword(savedKeywordId);
  await loadKeywords();
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
</script>

<style scoped>
.saved-page {
  background: #f9faf9;
  padding: 40px 80px;
  color: #111;
  font-family: "NexonLv1Gothic", sans-serif;
}

/* Header */
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 8px;
}

.back {
  color: #00c896;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.header h2 {
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  color: #6c757d;
  font-size: 16px;
}

/* Add Keyword */
.add-keyword-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: -40px;
  margin-bottom: 24px;
}

.add-input {
  width: 500px;
  height: 37px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
}

.add-btn {
  background: #00c896;
  color: #fff;
  border: none;
  height: 37px;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.add-btn:hover {
  background: #00b487;
}

/* Keyword Cards */
.keyword-container {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-header h3 {
  font-size: 15px;
  font-weight: 700;
}

.category-header span {
  font-size: 12px;
  color: #666;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-card {
  background: #fff;
  border: 1px solid #a2f1d6;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  font-size: 13px;
  transition: 0.2s;
}

.keyword-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.keyword-card .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.word {
  font-weight: 600;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
}

.delete-btn:hover {
  opacity: 1;
  color: #ff5b5b;
}

/* Stats */
.stats-box {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border: 1px solid #a2f1d6;
  border-radius: 12px;
  padding: 20px;
  margin-top: 36px;
}

.stat p {
  font-size: 13px;
  color: #555;
}

.stat h3 {
  font-size: 17px;
  font-weight: 700;
  color: #00c896;
}

/* Actions */
.actions {
  text-align: right;
  margin-top: 18px;
}

.clear-all-btn {
  background: #ff5b5b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.clear-all-btn:hover {
  background: #e64e4e;
}

/* Empty */
.empty {
  text-align: center;
  margin-top: 40px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.empty-hint {
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}

/* Delete Icon */
.close-icon {
  font-size: 22px;
  color: #ff4d4f;
  cursor: pointer;
  transition: 0.2s;
}

.close-icon:hover {
  color: #ff7875;
}
</style>
