<script setup lang="ts">
import NavBar from './package/common/component/NavBar.vue'
import { useToastStore } from './package/common/stores/toastStore';

useToastStore()
</script>

<template>
  <NavBar />

  <div id="main" class="mt-2 m-auto" style="width: 80%;">
    <RouterView />
  </div>

  <div class="footer mt-auto mb-3">
    <div class="m-0 mt-4 p-0 border-top-1 border-100">&nbsp;</div>
    <div class="flex px-4">
      <div class="flex align-items-center gap-3">
        <div><strong>Autres outils</strong></div>
        <div><a href="https://dofusdb.fr/fr/" title="DofusDB"><img src="@/assets/favicons/dofusdb.png" style="width: 24px;"></a></div>
        <div><a href="https://www.dofuspourlesnoobs.com/" title="Dofus pour les noobs"><img src="@/assets/favicons/dofuspourlesnoobs.ico" style="width: 24px;"></a></div>
        <div><a href="https://www.dofusbook.net/fr/" title="Dofusbook"><img src="@/assets/favicons/dofusbook.ico" style="width: 22px;"></a></div>
        <div><a href="https://dofus.n1ark.com/" title="n1ark"><img src="@/assets/favicons/n1ark.png" style="width: 20px;"></a></div>
        <div><a href="https://dofus-portals.fr/" title="Dofus Portals"><img src="@/assets/favicons/dofusportals.ico" style="width: 20px;"></a></div>
      </div>
      <div class="ml-auto">Certaines données proviennent de l'API de <a href="https://dofusdb.fr">DofusDB</a>. </div>
    </div>
  </div>

  <Toast position="bottom-right" />
</template>