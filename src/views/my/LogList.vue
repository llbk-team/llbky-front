<template>
  <div class="activity-log-section">
    <h4 class="section-title">최근 활동 내역</h4>

    <!-- 연도별 그룹 -->
    <div v-for="(yearData, yIndex) in visibleYears" :key="yIndex" class="year-block">
      <div class="year-header">
        <span class="year">{{ yearData.year }}</span>
      </div>

      <!-- 월별 그룹 -->
      <div
        v-for="(monthData, mIndex) in yearData.months"
        :key="mIndex"
        class="month-block"
      >
        <div class="month-header">
          <h5>{{ monthData.month }} {{ yearData.year }}</h5>
          <div class="divider"></div>
        </div>

        <ul class="activity-list">
          <li
            v-for="(log, lIndex) in monthData.activities"
            :key="lIndex"
            class="activity-item"
          >
            <span class="date">{{ formatDate(log.date) }}</span>
            <span class="title">{{ log.title }}</span>
            <span class="desc">{{ log.desc }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 더보기 버튼 -->
    <div v-if="!showAll" class="show-more">
      <button @click="showAll = true">Show more activity</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogList",
  data() {
    return {
      showAll: false,
      logsByYear: [
        {
          year: 2025,
          months: [
            {
              month: "November",
              activities: [
                { date: "2025-11-10T15:30:00", title: "이력서 분석", desc: "AI 분석 리포트 생성" },
                { date: "2025-11-09T11:20:00", title: "면접 피드백", desc: "면접 AI 피드백 완료" },
                { date: "2025-11-08T19:45:00", title: "학습 계획", desc: "주간 학습 리포트 작성" },
                { date: "2025-11-07T09:10:00", title: "트렌드 분석", desc: "산업 트렌드 데이터 업데이트" },
              ],
            },
            {
              month: "October",
              activities: [
                { date: "2025-10-21T12:10:00", title: "Spring AI 학습", desc: "Spring AI 프로젝트 실습 완료" },
                { date: "2025-10-19T09:40:00", title: "2nd-proj-test 생성", desc: "새 프로젝트 초기 세팅" },
              ],
            },
          ],
        },
      ],
    };
  },
  computed: {
    visibleYears() {
      if (this.showAll) return this.logsByYear;
      // 최근 1개월만 보이기
      return this.logsByYear.map((y) => ({
        ...y,
        months: [y.months[0]], // 첫 번째 달만 표시
      }));
    },
  },
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr);
      const month = d.toLocaleString("en-US", { month: "short" });
      const day = String(d.getDate()).padStart(2, "0");
      return `${month} ${day}`;
    },
  },
};
</script>

<style scoped>
.activity-log-section {
  background: transparent;
  text-align: left;
  padding-left: 10px;
  color: #111;
}

/* 제목 */
.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
}

/* 연도 헤더 */
.year-header {
  margin-top: 10px;
  margin-bottom: 10px;
}
.year {
  font-size: 15px;
  font-weight: 600;
  color: #71ebbe;
  border-left: 5px solid #71ebbe;
  padding-left: 6px;
}

/* 월 섹션 */
.month-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.month-header h5 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #222;
}
.divider {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

/* 활동 리스트 */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 6px 0 10px 0;
}
.activity-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 5px 0;
  border-bottom: 1px solid #f1f2f3;
}
.activity-item .date {
  width: 70px;
  color: #777;
}
.activity-item .title {
  font-weight: 600;
  color: #111;
  width: 140px;
}
.activity-item .desc {
  color: #555;
  flex: 1;
}

/* 더보기 버튼 */
.show-more {
  text-align: center;
  margin-top: 15px;
}
.show-more button {
  background: none;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.show-more button:hover {
  background: #f1f2f3;
}
</style>
