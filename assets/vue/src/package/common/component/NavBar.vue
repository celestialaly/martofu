<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from "vue";

import Menubar from 'primevue/menubar';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const router = useRouter();
const items = ref([
    {
        label: 'Accueil',
        icon: 'pi pi-home',
        command: () => {
            router.push('/');
        }
    }, {
        label: 'Ventes',
        icon: 'pi pi-shopping-cart',
        command: () => {
            router.push('/sales');
        }
    }, {
        label: 'About',
        icon: 'pi pi-star',
        command: () => {
            router.push('/about');
        }
    },
])
</script>

<template>
    <header>
        <Menubar :model="items">
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
                </a>
            </template>
            <template #end>
                <div class="flex items-center align-items-center gap-2" v-if="authStore.user">
                    <Button as="a" @click="authStore.logout()" label="Déconnexion" size="small" icon="pi pi-user" />
                    <Avatar icon="pi pi-user" class="mr-2" shape="circle" />
                </div>
                <div class="flex items-center align-items-center gap-2" v-else>
                    <RouterLink to="/auth">
                        <Button label="Connexion" size="small" icon="pi pi-user" />
                    </RouterLink>
                    <RouterLink to="/register">
                        <Button label="S'inscrire" size="small" icon="pi pi-user" />
                    </RouterLink>
                    <Avatar icon="pi pi-user" class="mr-2" shape="circle" />
                </div>
            </template>
        </Menubar>
    </header>
</template>