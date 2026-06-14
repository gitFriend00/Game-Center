// MDI Font (must be imported before Vuetify)
import '@mdi/font/css/materialdesignicons.css'

// Vuetify styles
import 'vuetify/styles'

import { createApp } from 'vue'
import App from './App.vue'

// Plugins
import vuetify from './plugins/vuetify.js'

// Router
import router from './router'

// Pinia + Persist
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(pinia)

app.mount('#app')