<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- 공통 헤더 -->
    <Header />

    <!-- 메인 -->
    <div class="flex-grow-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import Header from "./components/common/Header.vue";
</script>

<style></style>