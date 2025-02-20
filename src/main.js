
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Api from "@/api/axios";

import './styles/reset.scss' // 引入 reset.scss

const app = createApp(App)

app.use(createPinia())
app.config.globalProperties.$request = Api; //方法挂载到全局
app.use(router)

app.mount('#app')
