// 면접 진행 페이지 컴포넌트용 js 파일
import { ref, onUnmounted } from "vue";
import "remixicon/fonts/remixicon.css";
import router from "@/router";
import interviewApi from "@/apis/interviewApi";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

function useInterviewProgress(sessionId) {
  // ===== 상태 =====
  const mode = ref("audio");
  const previewRef = ref(null);
  const isRecording = ref(false);
  const recordTime = ref(0);
  let timer = null;

  const total = ref(0);
  const questionIds = ref([]);
  const questions = ref([]);
  const current = ref(1);

  const lastAnswered = ref(0);
  const submitted = ref({});
  const answerIds = ref({}); // 질문별 answerId 저장
  const errorMessage = ref("");
  const lastRecordedBlob = ref(null);

  const feedback = ref(null);
  const feedbackMap = ref({}); // 질문별 피드백 저장
  const aiLoading = ref(false);
  const saveLoading = ref(false); // 저장 로딩 상태

  let ffmpeg = null;

  // ====== 질문 로딩 ======
  const loadQuestions = async () => {
    try {
      const res = await interviewApi.getSessionDetail(sessionId);
      const list = res.data;

      questions.value = list.map((q) => q.questionText);
      questionIds.value = list.map((q) => q.questionId);
      total.value = list.length;
    } catch (err) {
      console.error("질문 로딩 실패:", err);
    }
  };

  // ====== MediaRecorder ======
  let stream = null;
  let mediaRecorder = null;
  let recordedChunks = [];

  const startRecording = async () => {
    errorMessage.value = "";
    lastRecordedBlob.value = null;
    recordedChunks = [];

    stream = await navigator.mediaDevices.getUserMedia(
      mode.value === "audio" ? { audio: true } : { audio: true, video: true }
    );

    if (mode.value === "video") {
      requestAnimationFrame(() => {
        if (previewRef.value) previewRef.value.srcObject = stream;
      });
    }

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.start();
    isRecording.value = true;

    recordTime.value = 0;
    timer = setInterval(() => {
      recordTime.value++;
      if (recordTime.value >= 60) stopRecording();
    }, 1000);
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (!mediaRecorder) return resolve(null);

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: mode.value === "audio" ? "audio/webm" : "video/webm",
        });
        lastRecordedBlob.value = blob;
        resolve(blob);
      };

      mediaRecorder.stop();
      clearInterval(timer);
      isRecording.value = false;

      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (previewRef.value) previewRef.value.srcObject = null;
    });
  };

  const toggleRecording = async () => {
    if (isRecording.value) await stopRecording();
    else await startRecording();
  };

  const setMode = async (newMode) => {
    if (isRecording.value) await stopRecording();
    mode.value = newMode;
  };

  // ====== 이전 질문 이동 ======
  const goPrevQuestion = async () => {
    if (current.value > 1) {
      if (isRecording.value) await stopRecording();
      current.value--;

      const qid = questionIds.value[current.value - 1];
      feedback.value = feedbackMap.value[qid] || null;
    }
  };

  // ====== 다음 질문 이동 ======
  const goNextQuestion = async () => {
    if (isRecording.value) await stopRecording();

    // 마지막 질문이면 종료
    if (current.value >= total.value) return;

    // "다음 질문"이 아니라 "현재 질문"에 피드백 있는지 체크
    const currentQuestionId = questionIds.value[current.value - 1];

    if (!feedbackMap.value[currentQuestionId]) {
      errorMessage.value = "다음 질문은 답변 제출 후 이동할 수 있습니다.";
      return;
    }

    // 통과하면 다음 질문으로 이동
    current.value++;

    // 이동한 질문에 피드백 있으면 바로 오른쪽 패널에 표시
    const nextId = questionIds.value[current.value - 1];
    feedback.value = feedbackMap.value[nextId] || null;

    // 에러 메시지 초기화
    errorMessage.value = "";
  };

  // ====== ffmpeg ======
  const getFFmpeg = async () => {
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      await ffmpeg.load();
    }
    return ffmpeg;
  };

  const extractAudio = async (video) => {
    const ffmpeg = await getFFmpeg();

    // 1) 브라우저 Blob -> ffmpeg 가상 파일로 write
    await ffmpeg.writeFile("input.webm", await fetchFile(video));

    // 2) ffmpeg 명령 실행
    await ffmpeg.exec([
      "-i",
      "input.webm",
      "-vn",
      "-acodec",
      "pcm_s16le",
      "-ar",
      "16000",
      "-ac",
      "1",
      "audio.wav",
    ]);

    // 3) 변환된 오디오 파일 읽어오기
    const data = await ffmpeg.readFile("audio.wav");
    await ffmpeg.deleteFile("input.webm");
    await ffmpeg.deleteFile("audio.wav");

    return new Blob([data.buffer], { type: "audio/wav" });
  };

  const extractFrames = async (video) => {
    const ffmpeg = await getFFmpeg();

    // 1) Blob 형태의 video를 ffmpeg 가상 파일로 write
    await ffmpeg.writeFile("input.webm", await fetchFile(video));

    // 2) ffmpeg 명령 실행
    await ffmpeg.exec(["-i", "input.webm", "-vf", "fps=1", "frame_%03d.png"]);

    const frames = [];
    let index = 1;

    // 3) 순서대로 읽어오기
    while (index >= 1) {
      const name = `frame_${String(index).padStart(3, "0")}.png`;
      try {
        const data = await ffmpeg.readFile(name);
        frames.push(new Blob([data.buffer], { type: "image/png" }));
        await ffmpeg.deleteFile(name);
        index++;
      } catch {
        break;
      }
    }

    await ffmpeg.deleteFile("input.webm");
    return frames;
  };

  // ====== 답변 제출 ======
  const handleSubmit = async () => {
    errorMessage.value = "";

    const questionId = questionIds.value[current.value - 1];
    let blob = lastRecordedBlob.value;

    if (!blob && !isRecording.value) {
      errorMessage.value = "녹화/녹음을 완료해야 답변을 제출할 수 있습니다.";
      return;
    }

    if (isRecording.value) blob = await stopRecording();
    if (!blob) {
      errorMessage.value = "녹화/녹음을 완료해야 답변을 제출할 수 있습니다.";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("questionId", questionId);
      if (mode.value === "audio") formData.append("audio", blob, "audio.webm");
      else formData.append("video", blob, "original_video.webm");

      let answerId;

      // 최초 제출 (insert)
      if (!answerIds.value[questionId]) {
        const submit = await interviewApi.submitAnswer(formData);
        answerId = Number(submit.data);
        answerIds.value[questionId] = answerId;
      }
      // 재제출 (update)
      else {
        answerId = answerIds.value[questionId];
        formData.append("answerId", answerId);
        await interviewApi.reSubmitAnswer(formData);
      }

      // ===== AI 피드백 요청 =====
      const feedbackForm = new FormData();
      feedbackForm.append("answerId", answerId);

      if (mode.value === "audio") {
        feedbackForm.append("audio", blob, "audio.webm");
      } else {
        const audioConverted = await extractAudio(blob);
        const frames = await extractFrames(blob);

        feedbackForm.append("videoAudio", audioConverted, "video_audio.webm");
        frames.forEach((f, i) =>
          feedbackForm.append("frames", f, `frame_${i}.png`)
        );
      }

      aiLoading.value = true;
      const res = await interviewApi.createFeedback(feedbackForm);
      aiLoading.value = false;

      // 저장
      feedbackMap.value[questionId] = res.data;
      feedback.value = res.data;

      submitted.value[questionId] = true;

      lastRecordedBlob.value = null;
    } catch (err) {
      console.error("답변 제출 오류:", err);
      errorMessage.value = "AI 피드백 생성 중 오류가 발생했습니다.";
    }
  };

  // 면접 종료 후 종합 피드백 생성해서 상세 페이지로 이동
  const finishInterview = async () => {
    try {
      saveLoading.value = true;

      await interviewApi.createInterviewFinalFeedback(sessionId);
      
      router.push(`/interview/report/detail?sessionId=${sessionId}`);
    
    } catch (err) {
      console.error("종합 피드백 생성 실패:", err);
    
    } finally {
      saveLoading.value = false;
    }
  };

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    return `${min}:${String(sec % 60).padStart(2, "0")}`;
  };

  onUnmounted(() => clearInterval(timer));

  return {
    mode,
    previewRef,
    isRecording,
    recordTime,
    current,
    total,
    questions,
    questionIds,
    lastAnswered,
    submitted,
    answerIds,
    lastRecordedBlob,
    errorMessage,
    feedback,
    feedbackMap,
    aiLoading,
    saveLoading,

    loadQuestions,
    toggleRecording,
    setMode,
    goPrevQuestion,
    goNextQuestion,
    handleSubmit,
    extractAudio,
    extractFrames,
    getFFmpeg,
    formatTime,
    finishInterview,
  };
}

export default { useInterviewProgress };
