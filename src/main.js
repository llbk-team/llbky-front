import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// remixicon
// npm install remixicon로 추가해주세요!
import "remixicon/fonts/remixicon.css";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "./assets/main.css";

createApp(App).use(store).use(router).mount("#app");
