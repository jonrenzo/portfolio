import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

inject()
injectSpeedInsights()

createApp(App).use(router).mount('#app')


