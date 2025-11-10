<template>
  <aside class="sidebar">
    <div class="sidebar-menu">
      <!-- 서류관리 -->
      <RouterLink 
        to="/resume/list" 
        class="menu-item" 
        active-class="active"
      >
        <div class="menu-icon">📋</div>
        <span class="menu-text">서류관리</span>
      </RouterLink>

      <!-- 이력서 -->
      <RouterLink 
        to="/resume/coach" 
        class="menu-item" 
        active-class="active"
      >
        <div class="menu-icon">📄</div>
        <span class="menu-text">이력서</span>
      </RouterLink>

      <!-- 자기소개서 -->
      <RouterLink 
        to="/resume/coverletter" 
        class="menu-item" 
        active-class="active"
      >
        <div class="menu-icon">✏️</div>
        <span class="menu-text">자기소개서</span>
      </RouterLink>

      <!-- 포트폴리오 (특별 스타일) -->
      <RouterLink 
        to="/resume/portfolio/coach" 
        class="menu-item" 
        active-class="active-portfolio"
      >
        <div class="menu-icon">💼</div>
        <span class="menu-text">포트폴리오</span>
      </RouterLink>

      <!-- 면접 -->
      <RouterLink 
        to="/interview/report" 
        class="menu-item" 
        active-class="active"
      >
        <div class="menu-icon">🎤</div>
        <span class="menu-text">면접</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #FFFFFF;
  border-right: 1px solid #E5E5E5;
  padding: 2rem 1rem;
  min-height: 100%;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-weight: 500;
  user-select: none;
  text-decoration: none; /* RouterLink 기본 스타일 제거 */
}

.menu-item:hover {
  background: #F8F9FA;
  color: #333;
  transform: translateX(3px);
}

/* Vue Router active-class="active" */
.menu-item.active {
  background: #E3F2FD;
  color: #1976D2;
  font-weight: 600;
  border-left: 4px solid #1976D2;
  padding-left: calc(1rem - 4px);
}

/* Vue Router active-class="active-portfolio" (포트폴리오 전용) */
.menu-item.active-portfolio {
  background: linear-gradient(135deg, #71EBBE, #A2F1D6);
  color: #000;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(113, 235, 190, 0.3);
  border-left: 4px solid #71EBBE;
  padding-left: calc(1rem - 4px);
}

.menu-item.active-portfolio:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 20px rgba(113, 235, 190, 0.4);
}

.menu-icon {
  font-size: 1.2rem;
  min-width: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  font-size: 1rem;
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    padding: 1rem;
    border-right: none;
    border-bottom: 1px solid #E5E5E5;
  }
  
  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.5rem;
  }
  
  .menu-item {
    min-width: 140px;
    justify-content: center;
    padding: 0.8rem 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .menu-text {
    font-size: 0.85rem;
    text-align: center;
  }
  
  .menu-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .sidebar {
    padding: 0.5rem;
  }
  
  .sidebar-menu {
    gap: 0.5rem;
  }
  
  .menu-item {
    min-width: 100px;
    padding: 0.6rem 0.8rem;
  }
  
  .menu-text {
    font-size: 0.8rem;
  }
  
  .menu-icon {
    font-size: 1.3rem;
  }
}
</style>