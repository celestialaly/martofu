<script setup lang="ts">
import Navbar from './package/common/component/Navbar.vue'
</script>

<template>
  <Navbar />
  <div class="mt-2 m-auto" style="width: 80%;">
    <RouterView />
  </div>
</template>