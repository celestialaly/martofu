<script setup lang="ts">
import NavBar from './package/common/component/NavBar.vue'
import { useToastStore } from './package/common/toastStore';

useToastStore()
</script>

<template>
  <NavBar />

  <div class="mt-2 m-auto" style="width: 80%;">
    <RouterView />
  </div>

  <Toast position="bottom-right" />
</template>