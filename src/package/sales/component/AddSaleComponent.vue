<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import SelectItemAutoComplete from './SelectItemAutoComplete.vue';
import { Sale } from '../domain/Sale';
import CommandSaleController from '../infrastructure/command/CommandSaleController';
import type { Item } from "../domain/Item";

const visible = ref(false);
const emit = defineEmits(['sale:create'])
const commandSaleController = new CommandSaleController();

interface AddSaleForm {
    selectedItem?: null | Item
    price: number
    sellPrice: number
    sold: boolean
}
const state: AddSaleForm = reactive({
    selectedItem: null,
    price: 0,
    sellPrice: 0,
    sold: false
})
const rules = computed(() => (
    {
        selectedItem: { required },
        price: { required },
        sellPrice: { required },
    }
));
const v$ = useVuelidate<AddSaleForm>(rules, state)
const submitForm = () => {
    const result = v$.value.$validate();

    result.then((res) => {
        console.log(state);
        if (!res) {
            return
        }

        saveSale()
    }).catch((err) => {
        console.log(err);
    })

};

async function saveSale() {
    const sale = Sale.new(state.selectedItem as Item, state.price, state.sellPrice, state.sold);
    await commandSaleController.saveSale(sale);
    emit('sale:create')
    visible.value = false
}
</script>

<template>
    <Button label="Ajouter une vente" @click="visible = true" />

    <Dialog v-model:visible="visible" modal header="Ajouter une vente" style="width: 50%;">
        <form @submit.prevent="submitForm">
            <div class="grid mt-0.5">
                <InputGroup class="col-12">
                    <InputGroupAddon>
                        <i class="pi pi-shopping-cart"></i>
                    </InputGroupAddon>
                    <SelectItemAutoComplete v-model="state.selectedItem"
                        :invalid="v$.selectedItem.$errors.length > 0" />
                </InputGroup>

                <InputGroup class="col">
                    <InputGroupAddon>
                        <i class="pi pi-dollar"></i>
                    </InputGroupAddon>
                    <IftaLabel>
                        <InputNumber v-model="state.price" :invalid="v$.price.$errors.length > 0" />
                        <label for="price">Investissement</label>
                    </IftaLabel>

                </InputGroup>

                <InputGroup class="col">
                    <InputGroupAddon>
                        <i class="pi pi-dollar"></i>
                    </InputGroupAddon>
                    <IftaLabel>
                        <InputNumber v-model="state.sellPrice" :invalid="v$.sellPrice.$errors.length > 0" />
                        <label for="price">Prix de vente</label>
                    </IftaLabel>
                </InputGroup>

                <InputGroup class="col-12">
                    <div class="flex align-items-center gap-2">
                        <ToggleSwitch v-model="state.sold" />
                        <label for="sold">Vendu</label>
                    </div>
                </InputGroup>
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" severity="secondary" @click="visible = false">Annuler</Button>
                <Button type="submit">Enregistrer</Button>
            </div>
        </form>
    </Dialog>
</template>