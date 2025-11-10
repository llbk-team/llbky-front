import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// remixicon 
// npm install remixicon로 추가해주세요!
import "remixicon/fonts/remixicon.css";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";


createApp(App).use(store).use(router).mount('#app')
