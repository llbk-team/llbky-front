import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// bootstrap (필수 css + js only)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// bootstrap-vue-3 (css만 유지, js 없음)
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

// remixicon
// npm install remixicon로 추가해주세요!
import "remixicon/fonts/remixicon.css";

import "./assets/fonts.css";
import "./assets/main.css";

createApp(App).use(store).use(router).mount("#app");
