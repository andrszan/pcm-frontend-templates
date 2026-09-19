import './index.css'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { queryClient } from './app/query-client'
import { router } from './app/router'

createApp(App).use(createPinia()).use(router).use(VueQueryPlugin, { queryClient }).mount('#app')
