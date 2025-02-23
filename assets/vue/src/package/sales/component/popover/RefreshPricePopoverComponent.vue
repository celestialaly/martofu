<script setup lang="ts">
import { ref, nextTick } from 'vue';
import CommandSaleController from '../../infrastructure/command/CommandSaleController';
import { UPDATE_SALE_TAX_PRICE, type Sale } from '../../domain/Sale';
import { useToastStore } from '@/package/common/stores/toastStore';
import { SalesEvent } from '../../domain/SalesEvent';
import { type InputNumberInputEvent } from 'primevue';

const popover = ref()
const selectedSale = ref<Sale | null>();
const commandController = new CommandSaleController()
const newPrice = ref(0)
const saleTax = ref(0)

const emit = defineEmits<{
    (event: SalesEvent.REFRESH): void
}>()

const displayPopover = (event: Event, sale: Sale) => {
    hidePopover()

    if (selectedSale.value?.saleId === sale.saleId) {
        selectedSale.value = null;
        newPrice.value = 0;
    } else {
        selectedSale.value = sale.clone();
        newPrice.value = selectedSale.value.sellPrice

        nextTick(() => {
            popover.value.show(event);
        });
    }
}
const hidePopover = () => {
    popover.value.hide();
}

const updateSaleTax = (event: InputNumberInputEvent) => {
    saleTax.value = event.value as number * UPDATE_SALE_TAX_PRICE
}

const refreshSalePrice = async () => {
    if (!selectedSale.value) return

    if (newPrice.value !== selectedSale.value.sellPrice) {
        selectedSale.value.refreshTaxPrice();
        await commandController.update(selectedSale.value)
        useToastStore().add({ severity: 'success', summary: `Prix mis à jour`, detail: `Le prix a bien été mis à jour.`, life: 3000 });
        emit(SalesEvent.REFRESH)
    } else {
        useToastStore().add({
            severity: 'warn',
            summary: `Prix non modifié`,
            detail: `Le prix saisi est déjà celui défini pour cette vente (${newPrice.value.toLocaleString()}k).`,
            life: 6000
        });
    }


    hidePopover()
    newPrice.value = 0
    selectedSale.value = null
}

defineExpose({
    displayPopover
})
</script>

<template>
    <Popover ref="popover">
        <div v-if="selectedSale" class="flex flex-column gap-2">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-dollar"></i>
                </InputGroupAddon>
                <IftaLabel>
                    <InputNumber suffix="k" fluid v-model="selectedSale.sellPrice" @input="updateSaleTax" />
                    <label for="price">Nouveau prix de vente</label>
                </IftaLabel>
            </InputGroup>

            <Message size="small" severity="secondary" variant="simple">Taxe HDV (1%) : {{ saleTax.toLocaleString() }}k
            </Message>


            <div class="flex gap-2">
                <Button type="submit" size="small" severity="success" @click="refreshSalePrice">Enregistrer</Button>
                <Button @click="hidePopover" size="small" severity="secondary">Annuler</Button>
            </div>
        </div>
    </Popover>
</template>