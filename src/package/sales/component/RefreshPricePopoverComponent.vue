<script setup lang="ts">
import { ref, nextTick } from 'vue';
import CommandSaleController from '../infrastructure/command/CommandSaleController';
import { SALE_TAX_PRICE, type Sale } from '../domain/Sale';
import { useToastStore } from '@/package/common/toastStore';
import { SalesEvent } from '../domain/SalesEvent';

const refreshPricePopover = ref()
const selectedSale = ref<Sale | null>();
const commandController = new CommandSaleController()
const saleTax = ref(0)

const emit = defineEmits<{
    (event: SalesEvent.REFRESH): void
}>()

const displayRefreshPricePopover = (event: Event, sale: Sale) => {
    hideRefreshPricePopover()

    if (selectedSale.value?.saleId === sale.saleId) {
        selectedSale.value = null;
    } else {
        selectedSale.value = sale.clone();
        saleTax.value = sale.sellPrice * SALE_TAX_PRICE

        nextTick(() => {
            refreshPricePopover.value.show(event);
        });
    }
}
const hideRefreshPricePopover = () => {
    refreshPricePopover.value.hide();
}

const updateSaleTax = (event) => {
    saleTax.value = event.value * SALE_TAX_PRICE
}

const refreshSalePrice = async () => {
    if (!selectedSale.value) return

    await commandController.refreshSellPrice(selectedSale.value)
    useToastStore().add({ severity: 'success', summary: `Prix mis à jour`, detail: `Le prix a bien été mis à jour.`, life: 3000 });
    emit(SalesEvent.REFRESH)
}

defineExpose({
    displayRefreshPricePopover
})
</script>

<template>
    <Popover ref="refreshPricePopover">
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

            <Message size="small" severity="secondary" variant="simple">Taxe HDV : {{ saleTax.toLocaleString() }}k
            </Message>


            <div class="flex gap-2">
                <Button type="submit" size="small" severity="success" @click="refreshSalePrice">Enregistrer</Button>
                <Button @click="hideRefreshPricePopover" size="small" severity="secondary">Annuler</Button>
            </div>
        </div>
    </Popover>
</template>