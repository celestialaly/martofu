<script setup lang="ts">
import QuerySaleController from '../infrastructure/query/QuerySaleController'
import AddSaleComponent from './AddSaleComponent.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref } from 'vue';
import type { HydraCollectionResponse } from '@/package/common/api/HydraCollectionResponse';
import type { Sale } from '../domain/Sale';
import RefreshPricePopoverComponent from './RefreshPricePopoverComponent.vue';

const queryController = new QuerySaleController()
const sales = ref<HydraCollectionResponse<Sale>>()
const salePriceRefreshRef = ref<InstanceType<typeof RefreshPricePopoverComponent>>()

onMounted(() => {
  refreshSalesData()
})

async function refreshSalesData() {
  sales.value = await queryController.retrieveSales()
}
</script>

<template>
  <main>
    <div class="flex flex-row flex-wrap justify-content-end mb-2">
      <AddSaleComponent @sale:create="refreshSalesData()" />
    </div>

    <DataTable :value="sales?.data" tableStyle="min-width: 50rem">
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
      <Column header="Actions">
        <template #body="slotProps">
          <Button type="button" size="small" icon="pi pi-refresh" v-tooltip.top="'Mettre à jour le prix de vente'"
            @click="salePriceRefreshRef?.displayRefreshPricePopover($event, slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </main>

  <RefreshPricePopoverComponent ref="salePriceRefreshRef" @sales:refresh="refreshSalesData" />
</template>