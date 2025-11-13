<template>
  <div class="saved-page">
    <!-- 상단 -->
    <div class="header">
      <router-link to="/trend/insight" class="back">← 돌아가기</router-link>
      <h2>내 키워드 저장소</h2>
      <p class="subtitle">AI 인사이트에서 저장한 키워드 또는 직접 추가한 키워드를 확인하세요.</p>
    </div>

    <!-- 🔹 키워드 수동 추가 입력창 -->
    <div class="add-keyword-box">
      <input v-model="newKeyword" @keyup.enter="addKeyword" type="text" class="add-input" placeholder="새 키워드를 입력하세요 (예: PyTorch, LangChain 등)" />
      <button class="add-btn" @click="addKeyword">추가</button>
    </div>

    <!-- 키워드 리스트 -->
    <div v-if="Object.keys(filteredKeywords).length > 0" class="keyword-container">
      <div class="category" v-for="(group, category) in filteredKeywords" :key="category">
        <div class="category-header">
          <h3>{{ category }}</h3>
          <span>{{ group.length }}개</span>
        </div>
        <div class="keyword-list">
          <div class="keyword-card" v-for="(k, i) in group" :key="i">
            <div class="top">
              <span class="word">{{ k }}</span>
              <button class="delete-btn" @click="deleteKeyword(k)">
                <i class="ri-close-circle-fill close-icon"></i>
              </button>
            </div>
            <small>{{ today }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- 비어있을 때 -->
    <div v-else class="empty">
      <p>저장된 키워드가 없습니다 😢</p>
      <p class="empty-hint">AI 인사이트 페이지에서 관심 키워드를 추가해보세요!</p>
    </div>

    <!-- 통계 -->
    <div class="stats-box" v-if="keywords.length > 0">
      <div class="stat">
        <p>총 저장 키워드</p>
        <h3>{{ keywords.length }}개</h3>
      </div>
      <div class="stat">
        <p>카테고리 수</p>
        <h3>{{ Object.keys(filteredKeywords).length }}개</h3>
      </div>
      <div class="stat">
        <p>최근 저장</p>
        <h3>{{ today }}</h3>
      </div>
    </div>

    <!-- 전체 삭제 버튼 -->
    <div class="actions" v-if="keywords.length > 0">
      <button class="clear-all-btn" @click="clearAll">전체 삭제</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const keywords = ref([]);
const newKeyword = ref("");
const today = new Date().toISOString().split("T")[0];

onMounted(() => {
  keywords.value = JSON.parse(localStorage.getItem("user_keywords") || "[]");
});

// ✅ 키워드 추가
const addKeyword = () => {
  const kw = newKeyword.value.trim();
  if (!kw) return alert("키워드를 입력해주세요.");
  if (keywords.value.includes(kw)) return alert("이미 추가된 키워드입니다.");
  keywords.value.push(kw);
  localStorage.setItem("user_keywords", JSON.stringify(keywords.value));
  newKeyword.value = "";
  alert(`'${kw}' 키워드가 추가되었습니다 ✅`);
};

// ✅ 기본 카테고리별 분류
const groupedKeywords = computed(() => {
  const groups = {
    "AI 엔지니어": [],
    "클라우드 엔지니어": [],
    "데이터 사이언티스트": [],
    "보안 전문가": [],
    "내가 추가한 키워드": [],
  };
  keywords.value.forEach((k) => {
    if (["Python", "TensorFlow", "LLM", "MLOps"].includes(k))
      groups["AI 엔지니어"].push(k);
    else if (["AWS", "Kubernetes", "Docker", "DevOps"].includes(k))
      groups["클라우드 엔지니어"].push(k);
    else if (["Pandas", "SQL", "Machine Learning", "Visualization"].includes(k))
      groups["데이터 사이언티스트"].push(k);
    else if (["Security", "Encryption", "Firewall"].includes(k))
      groups["보안 전문가"].push(k);
    else groups["내가 추가한 키워드"].push(k);
  });
  return groups;
});

// ✅ 내가 추가한 키워드 맨 위
const filteredKeywords = computed(() => {
  const filtered = {};
  const order = [
    "내가 추가한 키워드",
    "AI 엔지니어",
    "클라우드 엔지니어",
    "데이터 사이언티스트",
    "보안 전문가",
  ];
  order.forEach((cat) => {
    if (groupedKeywords.value[cat]?.length > 0)
      filtered[cat] = groupedKeywords.value[cat];
  });
  return filtered;
});

// ✅ 키워드 삭제
const deleteKeyword = (word) => {
  if (confirm(`'${word}' 키워드를 삭제하시겠습니까?`)) {
    const updated = keywords.value.filter((k) => k !== word);
    localStorage.setItem("user_keywords", JSON.stringify(updated));
    keywords.value = updated;
  }
};

// ✅ 전체 삭제
const clearAll = () => {
  if (confirm("저장된 모든 키워드를 삭제하시겠습니까?")) {
    localStorage.removeItem("user_keywords");
    keywords.value = [];
  }
};
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
  margin-top: -50px;
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
