// 트렌드 페이지 컴포넌트 js

import { ref, onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";
import WordCloud from "wordcloud";
import trendApi from "@/apis/trendApi";

export function useTrendAnalysis(memberId = 1) {

  // ==============================
  //  상태 값
  // ==============================
  const summaryCards = ref([]);
  const keywordData = ref([]);
  const sentimentData = ref([]);
  const wordCloudData = ref([]);
  const marketInsight = ref([]);

  // 스피너
  const saveLoading = ref(false);


  // ==============================
  //  메인 초기 로딩
  // ==============================
  const loadTrend = async () => {

    const res = await trendApi.getTodayTrend(memberId);
    const { trendJson, insightJson } = res.data;

    /** Summary Card */
    const s = insightJson.summarycard;
    summaryCards.value = [
      { label: "주목 키워드", value: s.majorKeyword },
      { label: "전체 평균 관심도", value: s.avgInterest},
      { label: "분석 키워드 수", value: s.keywordCount + "개" }
    ];

    /** 키워드 트렌드 */
    keywordData.value = trendJson.keywords.map((k, i) => ({
      keyword: k,
      score: trendJson.counts[i],
    }));

    /** 산업 분위기 */
    sentimentData.value = insightJson.industrySentiment;

    /** 워드클라우드 */
    wordCloudData.value = insightJson.wordCloud.map(w => [w.keyword, w.score]);

    /** 시장 인사이트 */
    marketInsight.value = insightJson.marketInsight;

    await nextTick();
    renderCharts();
  };


  // ==============================
  //  차트 & 워드클라우드 렌더링
  // ==============================
  const renderCharts = () => {

    // --- 키워드 트렌드 ---
    const ctx1 = document.getElementById("trendChart");
    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: keywordData.value.map(d => d.keyword),
        datasets: [
          {
            label: "평균 관심도",
            data: keywordData.value.map(d => d.score),
            backgroundColor: "#71EBBE",
            borderRadius: 6,
            barPercentage: 0.8,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100 },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });



    // --- 산업 분위기 ---
    const ctx2 = document.getElementById("sentimentChart");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: sentimentData.value.map(s => s.industry),
        datasets: [
          { label: "긍정", data: sentimentData.value.map(s => s.positive), backgroundColor: "#71EBBE", borderRadius: 6 },
          { label: "중립", data: sentimentData.value.map(s => s.neutral), backgroundColor: "#A0A0A0", borderRadius: 6 },
          { label: "부정", data: sentimentData.value.map(s => s.negative), backgroundColor: "#FF9F9F", borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          x: { stacked: true, max: 100 },
          y: { stacked: true }
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 12 }
          }
        }
      }
    });

    // --- 워드클라우드 ---
    WordCloud(document.getElementById("wordCloud"), {
      list: wordCloudData.value,
      minFontSize: 14,
      maxFontSize: 36,
      gridSize: 8,
      rotateRatio: 0,
      shrinkToFit: true,
      color: (word, weight) => {
        if (weight > 85) return "#00C896";
        if (weight > 70) return "#3CC3D3";
        if (weight > 60) return "#5B8DEF";
        if (weight > 50) return "#B47EFF";
        if (weight > 40) return "#FFA07A";
        return "#CFFFE2";
      }
    });
  };


  // ==============================
  // 자동 실행 + 오늘 중복 분석 방지
  // ==============================
  onMounted(async () => {
    saveLoading.value = true;

    const today = new Date().toISOString().slice(0, 10);

    // 이미 오늘 로드했음 → AI 호출 없이 DB 조회만 수행
    if (localStorage.getItem("trendLoaded") === today) {
      await loadTrend();
      saveLoading.value = false;
      return;
    }

    // 오늘 첫 로드 → 백엔드에서 AI 분석 + DB 저장
    await loadTrend();

    // 오늘 분석 완료 기록 저장
    localStorage.setItem("trendLoaded", today);

    saveLoading.value = false;
  });


  return {
    summaryCards,
    keywordData,
    sentimentData,
    wordCloudData,
    marketInsight,
    loadTrend,
    saveLoading
  };
}