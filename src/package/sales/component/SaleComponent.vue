<script setup lang="ts">
import QuerySaleController from '../infrastructure/query/QuerySaleController'
import AddSaleComponent from './AddSaleComponent.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref } from 'vue';
import type { HydraCollectionResponse } from '@/package/common/api/HydraCollectionResponse';
import type { Sale } from '../domain/Sale';
import RefreshPricePopoverComponent from './popover/RefreshPricePopoverComponent.vue';
import MarkAsSoldPopoverComponent from './popover/MarkAsSoldPopoverComponent.vue';
import UndoSaleConfirmComponent from './popover/UndoSaleConfirmComponent.vue';

const queryController = new QuerySaleController()
const sales = ref<HydraCollectionResponse<Sale>>()
const salePriceRefreshRef = ref<InstanceType<typeof RefreshPricePopoverComponent>>()
const markAsSoldRef = ref<InstanceType<typeof MarkAsSoldPopoverComponent>>()

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

    <DataTable :value="sales?.data">
      <Column header="Equipement">
        <template #body="slotProps">
          <div class="flex gap-2">
            <div class="table-indicator" :class="[slotProps.data.sold ? 'bg-green-600' : 'bg-red-600']">
            </div>
            <div>{{ slotProps.data.item.title }}</div>
          </div>
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
          <div class="flex gap-2" v-if="slotProps.data.sold">
            <UndoSaleConfirmComponent :sale="slotProps.data" />
          </div>
          <div class="flex gap-2" v-else>
            <Button severity="secondary" size="small" icon="pi pi-tag" v-tooltip.top="'Mettre à jour le prix de vente'"
              @click="salePriceRefreshRef?.displayPopover($event, slotProps.data)" />

            <Button size="small" icon="pi pi-check" v-tooltip.top="'Marquer comme vendu'"
              @click="markAsSoldRef?.displayPopover($event, slotProps.data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </main>

  <RefreshPricePopoverComponent ref="salePriceRefreshRef" @sales:refresh="refreshSalesData" />
  <MarkAsSoldPopoverComponent ref="markAsSoldRef" @sales:refresh="refreshSalesData" />
  <ConfirmPopup></ConfirmPopup>
</template>