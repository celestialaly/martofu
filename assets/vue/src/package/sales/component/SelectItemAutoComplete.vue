<script setup lang="ts">
import { ref } from "vue";
import QuerySellController from '../infrastructure/query/QuerySaleController';
import { type AutoCompleteCompleteEvent } from "primevue";

const selectedItem = defineModel();
defineProps<{
    invalid?: boolean
}>()

const saleController = new QuerySellController();
const filteredItems = ref();

const search = (event: AutoCompleteCompleteEvent) => {
    setTimeout(async () => {
        if (!event.query.trim().length) {
            filteredItems.value = [];
        } else {
            filteredItems.value = await saleController.retrieveItems(event.query.trim().toLowerCase()).then((data) => data.data);
        }
    }, 250);
}
</script>

<template>
    <IftaLabel>
        <AutoComplete v-model="selectedItem" optionLabel="title" :suggestions="filteredItems" @complete="search"
            :invalid="invalid" />
        <label>Equipement</label>
    </IftaLabel>
</template>