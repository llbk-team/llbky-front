<template>
  <div class="saved-page">
    <!-- 상단 -->
    <div class="header">
      <router-link to="/trend/insight" class="back">← 돌아가기</router-link>
      <h2>저장한 키워드</h2>
    </div>

    <!-- 검색 -->
    <div class="search-area">
      <input v-model="searchQuery" placeholder="키워드 검색..." class="search-input" />
      <button class="filter-btn" @click="resetFilter">전체</button>
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
              <button class="delete-btn" @click="deleteKeyword(k)"><i class="ri-close-circle-fill close-icon"></i></button>
            </div>
            <small>{{ today }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- 비어있을 때 -->
    <div v-else class="empty">
      <p>저장된 키워드가 없습니다 😢</p>
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

    <!-- 추천 -->
    <div class="recommend-box" v-if="keywords.length > 0">
      <h3>💡 저장한 키워드 기반 추천</h3>
      <div class="recommend-grid">
        <div class="recommend-card">
          <h4>🎓 학습 추천</h4>
          <p>저장된 키워드를 기반으로 학습 경로를 제안합니다.</p>
        </div>
        <div class="recommend-card">
          <h4>📈 트렌드 알림</h4>
          <p>관심 키워드의 최신 뉴스와 채용 동향을 제공합니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const keywords = ref([]);
const searchQuery = ref("");
const today = new Date().toISOString().split("T")[0];

onMounted(() => {
  keywords.value = JSON.parse(localStorage.getItem("user_keywords") || "[]");
});

// 1️⃣ 기본 카테고리별 분류
const groupedKeywords = computed(() => {
  const groups = {
    "AI 엔지니어": [],
    "클라우드 엔지니어": [],
    "데이터 사이언티스트": [],
    "보안 전문가": [],
  };
  keywords.value.forEach((k) => {
    if (["Python", "TensorFlow", "LLM", "MLOps"].includes(k))
      groups["AI 엔지니어"].push(k);
    else if (["AWS", "Kubernetes", "Docker", "DevOps"].includes(k))
      groups["클라우드 엔지니어"].push(k);
    else if (["Pandas", "SQL", "Machine Learning"].includes(k))
      groups["데이터 사이언티스트"].push(k);
    else groups["보안 전문가"].push(k);
  });
  return groups;
});

// 2️⃣ 빈 카테고리 제외 & 검색 필터 반영
const filteredKeywords = computed(() => {
  const filtered = {};
  for (const [category, group] of Object.entries(groupedKeywords.value)) {
    const filteredGroup = group.filter((k) =>
      k.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    if (filteredGroup.length > 0) filtered[category] = filteredGroup;
  }
  return filtered;
});

const deleteKeyword = (word) => {
  if (confirm(`'${word}' 키워드를 삭제하시겠습니까?`)) {
    const saved = JSON.parse(localStorage.getItem("user_keywords") || "[]");
    const updated = saved.filter((k) => k !== word);
    localStorage.setItem("user_keywords", JSON.stringify(updated));
    keywords.value = updated;
  }
};

const clearAll = () => {
  if (confirm("저장된 모든 키워드를 삭제하시겠습니까?")) {
    localStorage.removeItem("user_keywords");
    keywords.value = [];
  }
};

const resetFilter = () => {
  searchQuery.value = "";
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
  gap: 4px;
  margin-bottom: 16px;
}
.back {
  color: #00c896;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}
.header h2 {
  font-size: 22px;
  font-weight: 700;
}

/* Search */
.search-area {
  display: flex;
  gap: 8px;
  margin: 24px 0;
}
.search-input {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
}
.filter-btn {
  background: #00c896;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
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

/* Recommend */
.recommend-box {
  background: #e9f8f2;
  border: 1px solid #a2f1d6;
  border-radius: 12px;
  padding: 24px;
  margin-top: 40px;
}
.recommend-box h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
}
.recommend-grid {
  display: flex;
  gap: 20px;
}
.recommend-card {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  padding: 18px;
  border: 1px solid #dff7ed;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.recommend-card h4 {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin-bottom: 6px;
}
.recommend-card p {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
}

/* Empty */
.empty {
  text-align: center;
  margin-top: 40px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
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
