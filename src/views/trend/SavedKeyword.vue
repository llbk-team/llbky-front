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
      <input v-model="newKeyword" @keyup.enter="addKeyword" type="text" class="add-input" placeholder="새 키워드를 입력하세요" />
      <button class="add-btn" @click="addKeyword">추가</button>
    </div>

    <!-- 카테고리 -->
    <div v-if="Object.keys(filteredGroups).length > 0" class="keyword-container">
      <div class="category" v-for="(list, label) in filteredGroups" :key="label">

        <div class="category-header">
          <h3>{{ label }}</h3>
          <span>{{ list.length }}개</span>
        </div>

        <div class="keyword-list">
          <div class="keyword-card" v-for="item in list" :key="item.savedKeywordId">
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

  <!-- 작성 완료 로딩 오버레이 -->
  <div v-if="saveLoading" class="save-loading-overlay">
    <div class="save-loading-box">
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <p>직무 인사이트를 생성하고 있습니다</p>
      <p class="sub">AI 분석이 자동으로 실행돼요!</p>
    </div>
  </div>
</template>


<script setup>
import userSavedKeyword from '@/utils/savedKeyword';

const memberId = 1;

const {
   keywords,
  newKeyword,
  saveLoading,

  latestDate,
  filteredGroups,
  formatDate,

  addKeyword,
  deleteKeyword,
  clearAll,
  loadKeywords
} = userSavedKeyword(memberId);

</script>

<style scoped src="@/assets/css/savedKeyword.css"></style>
