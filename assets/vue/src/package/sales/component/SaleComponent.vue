<script setup lang="ts">
import QuerySaleController from '../infrastructure/query/QuerySaleController'
import AddSaleComponent from './AddSaleComponent.vue';
import DataTable, { type DataTablePageEvent, type DataTableSortEvent } from 'primevue/datatable';
import { FilterMatchMode } from '@primevue/core/api';
import Column from 'primevue/column';
import { computed, onMounted, ref } from 'vue';
import { HydraCollectionResponse } from '@/package/common/api/HydraCollectionResponse';
import type { Sale } from '../domain/Sale';
import RefreshPricePopoverComponent from './popover/RefreshPricePopoverComponent.vue';
import MarkAsSoldPopoverComponent from './popover/MarkAsSoldPopoverComponent.vue';
import UndoSaleConfirmComponent from './popover/UndoSaleConfirmComponent.vue';
import { ApiPaginator } from '@/package/common/api/ApiPaginator';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

const queryController = new QuerySaleController()
const salePriceRefreshRef = ref<InstanceType<typeof RefreshPricePopoverComponent>>()
const markAsSoldRef = ref<InstanceType<typeof MarkAsSoldPopoverComponent>>()

const sales = ref<HydraCollectionResponse<Sale>>()
const totalRecords = computed(() => sales.value?.total);

const page = ref(0);
const rowOptions = [5, 10, 25];
const limit = ref(rowOptions[1]);
const offset = computed(() => Number(limit.value * page.value));
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const paginator = new ApiPaginator()

// display columns on specific breakpoints
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual("sm");
const onlyLg = breakpoints.greaterOrEqual("lg");

onMounted(() => {
  refreshSalesData()
})

async function refreshSalesData() {
  paginator.setPage(page.value, limit.value)
  sales.value = await queryController.retrieveSales(paginator)
}

async function onPageChange(event: DataTablePageEvent) {
  page.value = event.page;
  refreshSalesData()
}

async function onSort(event: DataTableSortEvent) {
  paginator.setSort(event)
  refreshSalesData()
}

async function onFilter() {
  const globalFilter = filters.value['global'].value
  paginator.setFilter('item.title', globalFilter)
  refreshSalesData()
}

</script>

<template>
  <main>
    <div class="flex flex-row flex-wrap justify-content-end mb-2">
      <AddSaleComponent @sales:refresh="refreshSalesData" />
    </div>

    <DataTable lazy paginator removableSort :value="sales?.data" :totalRecords :first="offset" :rows="limit"
      :rowsPerPageOptions="rowOptions" @page="onPageChange" @sort="onSort" @update:rows="limit = $event"
      :globalFilterFields="['item.title']">
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Rechercher par objet" @input="onFilter" />
          </IconField>
        </div>
      </template>
      <template #empty>Aucune vente listée.</template>
      <template #loading>Récupération des données en cours...</template>

      <Column header="Objet" field="item.title" sortable>
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
      <Column header="Investissement" field="price" sortable  v-if="smAndLarger">
        <template #body="slotProps">
          {{ slotProps.data.price.toLocaleString() }}k
        </template>
      </Column>
      <Column header="Prix de vente" field="sellPrice" sortable  v-if="smAndLarger">
        <template #body="slotProps">
          {{ slotProps.data.sellPrice.toLocaleString() }}k
        </template>
      </Column>
      <Column header="Taxe HDV (cumulé)" field="taxPrice" sortable v-if="onlyLg">
        <template #body="slotProps">
          {{ slotProps.data.taxPrice.toLocaleString() }}k
        </template>
      </Column>
      <Column header="Vendu ?" field="sold" sortable v-if="onlyLg">
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