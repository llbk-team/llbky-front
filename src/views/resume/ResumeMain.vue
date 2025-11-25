<template>
  <div class="resume-main">
    <div class="main-container">
      <div class="main-content">
        <!-- 인사말 -->
        <div class="greeting">
          <h1>반갑습니다, {{ userName }} 님</h1>
        </div>

        <!-- 배너 섹션 -->
        <div class="banner-section">
          <div class="banner-card">
            <div class="banner-content">
              <div class="banner-icon">🎓</div>
              <div class="banner-text">
                <h2>커리어를 관리해보세요!</h2>
                <p class="subtitle">AI를 통한 이력서 분석부터 서류분석 빠르게 분석할 수 있어요!</p>
              </div>
              <button class="banner-button" @click="$router.push('/resume/write')">
                내 커리어 기록하러 가기
              </button>
            </div>
          </div>
        </div>


        <div class="resume-actions d-flex justify-content-end align-items-center mb-3">
          <button class="btn btn-primary select-btn me-3" @click="toggleSelectMode" :class="{ 'active': isSelecting }">
            {{ isSelecting ? '취소' : '선택하기' }}
          </button>

          <button v-if="isSelecting" class="btn btn-danger delete-btn" @click="confirmDelete" :disabled="!hasSelectedItems">
            삭제하기
          </button>
        </div>


        <!-- 내 이력서 리스트 -->
        <div class="resume-section">
          <div class="section-header d-flex justify-content-between align-items-center">
            <h2>내 이력서 리스트</h2>

            <div class="d-flex align-items-center">

              <span class="ai-suggestion">✨ AI 이력서 작성</span>
            </div>
          </div>
          <div class="resume-grid">
            <!-- 새 이력서 작성 -->
            <div class="resume-card add-card" @click="$router.push('/resume/write')">
              <div class="card-content">
                <div class="add-icon">+</div>
                <div class="add-text">새 이력서 작성</div>
              </div>
            </div>

            <!-- 기존 이력서 카드 -->
            <div v-for="resume in resumeList" :key="resume.id" class="resume-card" :class="{ selecting: isSelecting }">

              <!-- 체크박스 - position absolute 적용 -->
              <input v-if="isSelecting" type="checkbox" class="select-checkbox" :checked="selectedResumes === resume.id" @change="selectResume(resume.id)" />
              <div class="card-content" @click="goToResumeDetail(resume.id)">
                <div class="resume-icon">📄</div>
                <div class="resume-info">
                  <h3 class="resume-title">{{ resume.title }}</h3>
                  <div class="resume-meta">
                    <span class="update-date">📅 최종 수정: {{ resume.updatedAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 자기소개서 리스트 -->
        <div class="resume-section">
          <div class="section-header">
            <h2>내 자기소개서 리스트</h2>
            <div class="header-actions">
              <span class="ai-suggestion">✨ AI 자기소개서 작성</span>
            </div>
          </div>

          <div class="resume-grid">
            <!-- 새 자소서 카드 -->
            <div class="resume-card add-card" @click="$router.push('/resume/coverletter/write')">
              <div class="card-content">
                <div class="add-icon">+</div>
                <div class="add-text">새 자기소개서 작성</div>
              </div>
            </div>

            <div v-for="cover in coverLetterList" :key="cover.id" class="resume-card" :class="{ selecting: isSelecting }">
              <input v-if="isSelecting" type="checkbox" class="select-checkbox" :checked="selectedCovers === cover.id" @change="selectCover(cover.id)" />
              <div class="card-content" @click="goToCoverDetail(cover.id)">
                <div class="resume-icon">🖋️</div>
                <div class="resume-info">
                  <h3 class="resume-title">{{ cover.title }}</h3>
                  <div class="resume-meta">
                    <span class="update-date">📅 최종 수정: {{ cover.updatedAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 포트폴리오 리스트 -->
        <div class="resume-section">
          <div class="section-header">
            <h2>내 포트폴리오 리스트</h2>
            <div class="header-actions">
              <span class="ai-suggestion">✨ AI 포트폴리오 코칭</span>
            </div>
          </div>

          <div class="resume-grid">
            <div class="resume-card add-card" @click="$router.push('/resume/portfolio/write')">
              <div class="card-content">
                <div class="add-icon">+</div>
                <div class="add-text">새 포트폴리오 등록</div>
              </div>
            </div>

            <div v-for="portfolio in portfolioList" :key="portfolio.portfolioId" class="resume-card" :class="{ selecting: isSelecting }">
              <input v-if="isSelecting" type="checkbox" class="select-checkbox" :checked="selectedPortfolios.includes(portfolio.portfolioId)" @change="selectPortfolio(portfolio.portfolioId)" />
              <div class="card-content" @click="goToPortfolioDetail(portfolio.portfolioId)">
                <div class="resume-icon">🎨</div>
                <h3 class="resume-title">{{ portfolio.title }}</h3>
                <div class="resume-meta">
                  <span class="update-date">📅 분석 날짜: {{ portfolio.updatedAt }}</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useResumeMain } from "@/utils/resumeMain.js";

const {
  userName,
  resumeList,
  coverLetterList,
  portfolioList,

  isSelecting,
  selectedResumes,
  selectedCovers,
  selectedPortfolios,

  toggleSelectMode,
  selectResume,
  selectCover,
  selectPortfolio,
  hasSelectedItems,

  goToResumeDetail,
  goToCoverDetail,
  goToPortfolioDetail,

  confirmDelete,
} = useResumeMain();
</script>


<style src="@/assets/css/resumeMain.css"></style>