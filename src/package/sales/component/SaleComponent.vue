<script setup lang="ts">
import QuerySaleController from '../infrastructure/query/QuerySaleController'
import CommandSaleController from '../infrastructure/command/CommandSaleController';
import AddSaleComponent from './AddSaleComponent.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref, nextTick } from 'vue';
import type { HydraCollectionResponse } from '@/package/common/api/HydraCollectionResponse';
import type { Sale } from '../domain/Sale';
import { useToastStore } from '@/package/common/toastStore';

const queryController = new QuerySaleController()
const commandController = new CommandSaleController()
const sales = ref<HydraCollectionResponse<Sale>>()
const refreshPricePopover = ref()
const selectedSale = ref();

const displayRefreshPricePopover = (event: Event, sale: Sale) => {
  refreshPricePopover.value.hide();

  if (selectedSale.value?.id === sale.saleId) {
    selectedSale.value = null;
  } else {
    selectedSale.value = sale.clone();

    nextTick(() => {
      refreshPricePopover.value.show(event);
    });
  }
}
const hideRefreshPricePopover = () => {
  refreshPricePopover.value.hide();
}
const refreshSalePrice = async () => {
  if (!selectedSale.value) return

  await commandController.refreshSellPrice(selectedSale.value)
  useToastStore().add({ severity: 'success', summary: `Prix mis à jour`, detail: `Le prix a bien été mis à jour.`, life: 3000 });
  await refreshSalesData()

}

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
            @click="displayRefreshPricePopover($event, slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </main>

  <Popover ref="refreshPricePopover">
    <div v-if="selectedSale" class="flex flex-column gap-2">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-dollar"></i>
        </InputGroupAddon>
        <IftaLabel>
          <InputNumber v-model="selectedSale.sellPrice" />
          <label for="price">Nouveau prix de vente</label>
        </IftaLabel>
      </InputGroup>

      <div class="flex gap-2">
        <Button type="submit" size="small" severity="success" @click="refreshSalePrice">Enregistrer</Button>
        <Button @click="hideRefreshPricePopover" size="small" severity="secondary">Annuler</Button>
      </div>
    </div>
  </Popover>
</template>