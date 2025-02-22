<script setup lang="ts">
import { useAuthStore } from '../package/common/stores/authStore';

const authStore = useAuthStore();
</script>

<template>
  <div class="flex lg:flex-row flex-column">
    <div class="flex items-center justify-center h-full">
      <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
        <h1
          class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-4 !leading-tight">
          <span class="block">Gérer plus simplement</span>
          <span class="block text-primary">vos ventes Dofus</span>
        </h1>

        <p
          class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-4 max-w-xl lg:max-w-none">
        <ul class="list-none line-height-3 p-0">
          <li>Modification du prix avec recalcul automatique de la taxe HDV</li>
          <li>Statistiques de ventes (investissement, profit...)</li>
        </ul>
        </p>

        <div class="lg:mgb-0 mb-2" v-if="!authStore.user">
          <RouterLink to="/register">
            <Button label="S'inscrire" icon="pi pi-user" />
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="flex-1 w-full mt-2" style="min-width: 60%;">
      <img src="@/assets/images/sales.png" alt="Ventes" class="w-full object-cover border-2" />
    </div>
  </div>

  <hr class="mt-4 border-primary-500">

  <div class="flex lg:flex-row flex-column">
    <div class="w-full mt-2" style="min-width: 60%;">
      <img src="@/assets/images/sales_investment.png" alt="Ventes" class="w-full object-cover border-2" />
    </div>

    <div class="flex items-center justify-center h-full">
      <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
        <h1
          class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-4 !leading-tight">
          <span class="block">Calculer automatiquement</span>
          <span class="block text-primary">l'investissement des crafts</span>
        </h1>

        <p
          class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-4 max-w-xl lg:max-w-none">
        <ul class="list-none line-height-3 p-0">
          <li>Calcul auto des achats effectués en HDV via un simple copier/coller</li>
          <li>Prise en compte du paiement du coût du craft + dépenses en runes</li>
        </ul>
        </p>

        <div class="lg:mgb-0 mb-2" v-if="!authStore.user">
          <RouterLink to="/register">
            <Button label="S'inscrire" icon="pi pi-user" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>