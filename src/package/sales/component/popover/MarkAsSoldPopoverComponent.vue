<script setup lang="ts">
import { ref, nextTick } from 'vue';
import CommandSaleController from '../../infrastructure/command/CommandSaleController';
import { SALE_TAX_PRICE, type Sale } from '../../domain/Sale';
import { useToastStore } from '@/package/common/stores/toastStore';
import { SalesEvent } from '../../domain/SalesEvent';

const popover = ref()
const selectedSale = ref<Sale | null>();
const commandController = new CommandSaleController()
const saleTax = ref(0)
const saleFinalPrice = ref(0)
const soldOutsideMarket = ref(false)

const emit = defineEmits<{
    (event: SalesEvent.REFRESH): void
}>()

const displayPopover = (event: Event, sale: Sale) => {
    hidePopover()

    if (selectedSale.value?.saleId === sale.saleId) {
        selectedSale.value = null;
    } else {
        selectedSale.value = sale.clone();
        saleFinalPrice.value = selectedSale.value.sellPrice
        saleTax.value = 0
        soldOutsideMarket.value = false

        nextTick(() => {
            popover.value.show(event);
        });
    }
}
const hidePopover = () => {
    popover.value.hide();
}

const updateSaleTax = () => {
    saleTax.value = (soldOutsideMarket.value || selectedSale.value?.sellPrice == saleFinalPrice.value)
        ? 0
        : saleFinalPrice.value * SALE_TAX_PRICE
}

const markAsSold = async () => {
    if (!selectedSale.value) return

    if (selectedSale.value.sellPrice != saleFinalPrice.value) {
        selectedSale.value.updateSellPrice(saleFinalPrice.value, !soldOutsideMarket.value)
    }
    selectedSale.value.markAsSold()

    await commandController.update(selectedSale.value)
    useToastStore().add({ severity: 'success', summary: `Prix mis à jour`, detail: `Le prix a bien été mis à jour.`, life: 3000 });
    hidePopover()
    emit(SalesEvent.REFRESH)
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
                    <InputNumber suffix="k" fluid v-model="saleFinalPrice" @input="updateSaleTax" />
                    <label for="price">Prix de vente final</label>
                </IftaLabel>
            </InputGroup>

            <Message size="small" severity="secondary" variant="simple" v-if="saleTax > 0">
                Taxe HDV additionnelle : {{ saleTax.toLocaleString() }}k
            </Message>

            <div class="flex items-center gap-2">
                <Checkbox v-model="soldOutsideMarket" inputId="soldOutsideMarket" name="soldOutsideMarket"
                    :binary="true" @change="updateSaleTax" />
                <label for="soldOutsideMarket">Vendu hors HDV</label>
            </div>

            <div class="flex gap-2">
                <Button type="submit" size="small" severity="success" @click="markAsSold">Enregistrer</Button>
                <Button @click="hidePopover" size="small" severity="secondary">Annuler</Button>
            </div>
        </div>
    </Popover>
</template>