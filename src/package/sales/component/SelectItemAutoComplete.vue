<script setup lang="ts">
import { ref, onMounted } from "vue";
import QuerySellController from '../infrastructure/query/QuerySaleController';
import { type Item } from '../domain/Item';

const selectedItem = defineModel();

const saleController = new QuerySellController();
const items = ref();
const filteredItems = ref();

const search = (event) => {
    setTimeout(async () => {
        if (!event.query.trim().length) {
            filteredItems.value = [];
        } else {
            filteredItems.value = await saleController.retrieveItems(event.query.trim()).then((data) => data.data);
        }
    }, 250);
}
</script>

<template>
    <IftaLabel>
        <AutoComplete v-model="selectedItem" optionLabel="title" :suggestions="filteredItems" @complete="search" />
        <label>Equipement</label>
    </IftaLabel>
</template>