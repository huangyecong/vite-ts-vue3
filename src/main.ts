import { createApp } from 'vue'
import { createPinia } from 'pinia'
import createPiniaPlugin from './stores/createPiniaPlugin'
import App from './App.vue'

const pinia = createPinia().use(createPiniaPlugin)// 创建Pinia实例并应用自定义插件
const app = createApp(App)

app.use(pinia)
app.mount('#app')