<script setup lang="ts">
import { ref } from "vue";
import SelectItemAutoComplete from './SelectItemAutoComplete.vue';
import { Sale } from '../domain/Sale';
import CommandSaleController from '../infrastructure/command/CommandSaleController';

const emit = defineEmits(['sale:create'])
const commandSaleController = new CommandSaleController();
const visible = ref(false);
const selectedItem = ref();
const price = ref(0);
const sellPrice = ref(0);
const sold = ref(false);

async function saveSale() {
    const sale = Sale.new(selectedItem.value, price.value, sellPrice.value, sold.value);
    await commandSaleController.saveSale(sale);
    emit('sale:create')
    visible.value = false
}
</script>

<template>
    <Button label="Ajouter une vente" @click="visible = true" />

    <Dialog v-model:visible="visible" modal header="Ajouter une vente" style="width: 50%;">
        <div class="grid mt-0.5">
            <InputGroup class="col-12">
                <InputGroupAddon>
                    <i class="pi pi-shopping-cart"></i>
                </InputGroupAddon>
                <SelectItemAutoComplete v-model="selectedItem" required />
            </InputGroup>

            <InputGroup class="col">
                <InputGroupAddon>
                    <i class="pi pi-dollar"></i>
                </InputGroupAddon>
                <IftaLabel>
                    <InputNumber v-model="price" />
                    <label for="price">Investissement</label>
                </IftaLabel>
            </InputGroup>

            <InputGroup class="col">
                <InputGroupAddon>
                    <i class="pi pi-dollar"></i>
                </InputGroupAddon>
                <IftaLabel>
                    <InputNumber v-model="sellPrice" />
                    <label for="price">Prix de vente</label>
                </IftaLabel>
            </InputGroup>

            <InputGroup class="col-12">
                <div class="flex align-items-center gap-2">
                    <ToggleSwitch v-model="sold" />
                    <label for="sold">Vendu</label>
                </div>
            </InputGroup>
        </div>

        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Annuler" severity="secondary" @click="visible = false"></Button>
            <Button label="Enregistrer" @click="saveSale()" />
        </div>
    </Dialog>
</template>