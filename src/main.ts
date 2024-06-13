import { createApp } from 'vue'
import { createPinia } from 'pinia'
import createPiniaPlugin from './stores/createPiniaPlugin'//自定义pinia插件
import createPersistedState from 'pinia-plugin-persistedstate'
import App from './App.vue'

const pinia = createPinia()
pinia.use(createPiniaPlugin)
pinia.use(createPersistedState)// 创建Pinia实例并应用自定义插件
const app = createApp(App)

app.use(pinia)
app.mount('#app')