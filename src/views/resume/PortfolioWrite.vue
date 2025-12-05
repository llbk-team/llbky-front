<template>
  <div class="app-container">

    <!-- 사이드바 -->
    <SideBar />

    <!-- 메인 컨테이너 -->
    <div class="main-container">

      <!-- 포트폴리오 업로드 박스 -->
      <div class="resume-form-container">

        <!-- 상단 설명 -->
        <div class="upload-section">
          <div class="upload-icon">📁</div>

          <div class="form-header">
            <h1>포트폴리오 코칭</h1>
            <p>포트폴리오나 PDF 파일을 업로드하면 AI가 전문적으로 리뷰해드립니다.</p>
          </div>

          <!-- 업로드 버튼 -->
          <div class="upload-types">
            <div class="type-btn" :class="{ active: true }" @click="triggerFileInput">
              <div class="type-label">📤 포트폴리오 올리기</div>
              <input type="file" id="fileInput" @change="handleUpload" accept="application/pdf" style="display:none;">
            </div>

            <div class="type-btn" @click="router.push('/resume/portfolio/stepbystep')">
              <div class="type-label">📊 포트폴리오 가이드</div>
            </div>
          </div>

          <!-- 파일 선택됨 → 제목 입력 -->
          <div v-if="uploadedFile" class="input-title-box">
            <input v-model="portfolioTitle" placeholder="포트폴리오 제목을 입력하세요" class="title-input" />
          </div>

          <!-- 파일 업로드 완료 표시 -->
          <div v-if="uploadedFile" class="upload-result">
            <span class="check-icon">📄</span>
            <span class="file-name">{{ uploadedFile.name }}</span>
          </div>

        </div>

        <!-- 피드백 받기 버튼 -->
        <div class="action-section">
          <button class="action-btn" @click="startAnalysis">
            ✏️ 포트폴리오 피드백 받기
          </button>
        </div>
        <div v-if="loadingUpload" class="upload-overlay">
          <div class="big-spinner"></div>
          <p style="margin-top: 10px; color: white;">업로드 중입니다...</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import SideBar from '@/components/sidebar/SideBar.vue'
import { useRouter } from "vue-router"
import { usePortfolioWrite } from "@/utils/portfolioWrite";

const router = useRouter();

const {
  uploadedFile,
  portfolioTitle,
  loadingUpload,
  triggerFileInput,
  handleUpload,
  startAnalysis
} = usePortfolioWrite();
</script>



<style scoped src="@/assets/css/portfolioWrite.css"></style>