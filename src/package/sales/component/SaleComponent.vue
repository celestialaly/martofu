<script setup lang="ts">
import SaleController from '../infrastructure/query/QuerySaleController'
import { Sale } from '../domain/Sale';
import AddSaleComponent from './AddSaleComponent.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { HydraCollectionResponse } from '../../common/api/HydraCollectionResponse';
import { onMounted, ref } from 'vue';

const controller = new SaleController()
const sales = ref([])

onMounted(() => {
  refreshSales()
})

async function refreshSales() {
  sales.value = await controller.retrieveSales()
}
</script>

<template>
  <main>
    <div class="flex flex-row flex-wrap justify-content-end mb-2">
      <AddSaleComponent @sale:create="refreshSales()" />
    </div>

    <DataTable :value="sales.data" tableStyle="min-width: 50rem">
      <Column header="Equipement">
        <template #body="slotProps">
          {{ slotProps.data.item.title }}
        </template>
      </Column>
      <Column header="Profit estimé">
        <template #body="slotProps">
          {{ (slotProps.data.sellPrice - slotProps.data.price - slotProps.data.taxPrice).toLocaleString() }}k
        </template>
      </Column>
      <Column header="Investissement">
        <template #body="slotProps">
          {{ slotProps.data.price.toLocaleString() }}k
        </template>
      </Column>
      <Column header="Prix de vente">
        <template #body="slotProps">
          {{ slotProps.data.sellPrice.toLocaleString() }}k
        </template>
      </Column>
      <Column header="Taxe HDV (cumulé)">
        <template #body="slotProps">
          {{ slotProps.data.taxPrice.toLocaleString() }}k
        </template>
      </Column>
      <Column header="Vendu ?">
        <template #body="slotProps">
          {{ slotProps.data.sold ? 'Oui' : 'Non' }}
        </template>
      </Column>
    </DataTable>
  </main>
</template>