<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from "vue";

import Menubar from 'primevue/menubar';

const router = useRouter();
const items = ref([
    {
        label: 'Ventes',
        icon: 'pi pi-shopping-cart',
        command: () => {
            router.push('/');
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
        </Menubar>
    </header>
</template>