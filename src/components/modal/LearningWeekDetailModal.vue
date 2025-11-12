<template>
  <div class="modal-backdrop">
    <div class="modal-content p-4 rounded-4 shadow-lg">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">{{ week.label }} - {{ week.topic }}</h5>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>

      <!-- ✅ 내부 스크롤 영역 -->
      <div class="scroll-area">
        <ul class="list-group mb-3">
          <li
            v-for="(day, i) in week.days"
            :key="i"
            class="list-group-item clickable"
            @click="toggleDay(i)"
          >
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-semibold">{{ day.label }} - {{ day.title }}</span>
              <small class="text-muted">{{ day.open ? "접기 ▲" : "펼치기 ▼" }}</small>
            </div>

            <!-- ✅ 펼침 영역 -->
            <div v-show="day.open" class="fade-section mt-2">
              <p class="small text-muted mb-2">{{ day.desc }}</p>

              <div v-if="day.memo" class="note-box p-3 rounded-3 border bg-light">
                <h6 class="fw-semibold small mb-2">📝 정리 노트</h6>
                <p class="small mb-0" style="white-space: pre-line;">{{ day.memo }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  week: Object,
});

const week = ref({
  label: "1주차",
  topic: "Spring Boot 기본기 다지기",
  days: [
    {
      label: "1일차",
      title: "프로젝트 세팅",
      desc: "Spring Initializr로 프로젝트 생성 및 Gradle 환경 설정",
      memo: `Spring Initializr로 새 프로젝트를 생성했다.
Lombok, JPA, Spring Web 의존성을 추가하고 build.gradle을 정리했다.
JDK 17 설정 오류가 있었는데 toolchain으로 해결했다.`,
      open: false,
    },
    {
      label: "2일차",
      title: "Controller 학습",
      desc: "요청과 응답의 흐름, REST Controller 구조 이해",
      memo: `@RestController와 @Controller의 차이점을 정리했다.
@RequestMapping, @GetMapping, @PostMapping을 실습했고, ResponseEntity로 상태코드를 반환하는 연습을 했다.
또한 Postman으로 실제 응답 테스트를 진행했다.`,
      open: false,
    },
    {
      label: "3일차",
      title: "Service 계층 구현",
      desc: "비즈니스 로직 분리와 Service 계층 역할 이해",
      memo: `Controller에서는 요청 처리와 응답만 담당하고, 핵심 로직은 Service에서 수행하도록 설계했다.
@Service 어노테이션을 붙인 클래스에서 비즈니스 메서드를 작성하고, Controller에서 주입받아 호출했다.`,
      open: false,
    },
    {
      label: "4일차",
      title: "Repository 학습",
      desc: "JPA Repository와 Entity 관리",
      memo: `JpaRepository를 상속한 Repository를 만들고 CRUD 메서드를 실습했다.
findById, findAll, save, delete 등 기본 기능을 테스트했다.
Entity 설계 시 @Id, @GeneratedValue 전략의 차이도 함께 학습했다.`,
      open: false,
    },
    {
      label: "5일차",
      title: "DB 연동 테스트",
      desc: "H2 데이터베이스를 통한 CRUD 테스트",
      memo: `application.yml에 spring.datasource 설정을 추가하고 H2 콘솔을 활성화했다.
테이블이 자동 생성되는지 확인하고, 데이터 삽입과 조회 테스트를 수행했다.`,
      open: false,
    },
    {
      label: "6일차",
      title: "예외 처리 및 로깅",
      desc: "전역 예외 처리와 로깅 적용",
      memo: `@ControllerAdvice와 @ExceptionHandler를 활용하여 전역 예외 처리를 구성했다.
CustomException을 만들어 코드별 예외 응답을 테스트했다.
Slf4j 로거를 사용하여 예외 발생 시 로그를 남기도록 설정했다.`,
      open: false,
    },
    {
      label: "7일차",
      title: "정리 및 복습",
      desc: "한 주간 학습한 개념을 정리",
      memo: `1주차 핵심 개념을 모두 복습했다.
Spring Boot의 자동 설정 원리를 다시 살펴보고, @SpringBootApplication 내부 구조를 정리했다.
다음 주에는 Spring Security로 넘어가기 위한 사전 준비를 완료했다.`,
      open: false,
    },
  ],
});

function toggleDay(index) {
  week.value.days[index].open = !week.value.days[index].open;
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

/* ✅ 모달 크기 고정 */
.modal-content {
  background: #fff;
  width: 720px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
}

/* ✅ 내부 스크롤 */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
}

/* 리스트 스타일 */
.list-group-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
  border-radius: 8px;
}

.clickable {
  cursor: pointer;
  user-select: none;
}

.note-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  margin-top: 8px;
  white-space: pre-line;
}

/* 부드러운 오픈 효과 */
.fade-section {
  transition: opacity 0.25s ease;
}
.fade-section[style*="display: none"] {
  opacity: 0;
}
</style>
