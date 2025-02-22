import { defineStore } from 'pinia';
import router from '@/router';

export type AuthUser = {
    email: string,
    token: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: 'user' in localStorage ? JSON.parse(localStorage.getItem('user') as string) : null as AuthUser | null,
        returnUrl: null as string | null
    }),
    actions: {
        async login(email: string, token: string) {
            // update pinia state
            this.user = { email: email, token: token } as AuthUser;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(this.user));

            // redirect to previous url or default to home page
            router.push(this.returnUrl && this.returnUrl !== '/auth' ? this.returnUrl : '/sales');
        },
        logout() {
            console.log('logout')
            this.user = null;
            localStorage.removeItem('user');
            router.push('/auth');
        }
    }
});