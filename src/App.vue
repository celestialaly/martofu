<script setup lang="ts">
import Navbar from './package/common/component/Navbar.vue'
import { useToastStore } from './package/common/toastStore';

useToastStore()
</script>

<template>
  <Navbar />

  <div class="mt-2 m-auto" style="width: 80%;">
    <RouterView />
  </div>

  <Toast position="bottom-right" />
</template>