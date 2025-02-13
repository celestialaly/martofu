import { createRouter, createWebHistory } from 'vue-router'
import SaleView from '@/views/SaleView.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/security/RegisterView.vue'
import LoginView from '@/views/security/LoginView.vue'
import { useAuthStore } from '@/package/common/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sales',
      name: 'sales',
      component: SaleView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: LoginView,
    },
  ],
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/', '/auth', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return '/auth';
  }
});

export default router
