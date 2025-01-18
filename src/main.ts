import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice';

// Add the necessary CSS
// import 'bootstrap/dist/css/bootstrap.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app')
