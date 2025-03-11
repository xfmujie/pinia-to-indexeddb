import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')


// =========================app挂载后========================

import { useUserStore } from '@/stores/userStore'
import PiniaToDB from '@/PiniaToDB'

new PiniaToDB(useUserStore(), 'SavePiniaDataToIndexedDB', 'User').subscribe();