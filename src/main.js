import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// BOOTSTRAP
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// GLOBAL CSS
import './assets/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')