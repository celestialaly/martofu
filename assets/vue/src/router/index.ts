import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/package/common/stores/authStore'

const Sale = () => import('@/views/SaleView.vue')
const Home = () => import('@/views/HomeView.vue')
const Register = () => import('@/views/security/RegisterView.vue')
const Login = () => import('@/views/security/LoginView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sale,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/auth',
      name: 'auth',
      component: Login,
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
