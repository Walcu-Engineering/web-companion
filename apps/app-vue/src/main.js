import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import '../../../packages/sdk-ui/widget-sdk.js'

const app = createApp(App)
app.use(router)
app.mount('#app')
