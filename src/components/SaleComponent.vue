<script setup lang="ts">
import SaleController from '../package/sales/infrastructure/api/SaleController'
import { SaleModel } from '../package/sales/infrastructure/api/SaleModel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const controller = new SaleController()
const sales: SaleModel[] = await controller.retrieveSales()
</script>

<template>
  <main>
    <DataTable :value="sales" tableStyle="min-width: 50rem">
      <Column field="item.title" header="Equipement"></Column>
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
      <Column header="Taxe HDV">
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