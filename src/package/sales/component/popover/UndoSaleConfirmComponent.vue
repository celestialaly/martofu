<script setup lang="ts">
import { useConfirm } from 'primevue';
import type { Sale } from '../../domain/Sale';
import { useToastStore } from '@/package/common/toastStore';
import CommandSaleController from '../../infrastructure/command/CommandSaleController';
import { SalesEvent } from '../../domain/SalesEvent';

defineProps<{
    sale: Sale
}>()
const emit = defineEmits<{
    (event: SalesEvent.REFRESH): void
}>()

const confirm = useConfirm();
const commandController = new CommandSaleController()

const undoSale = (event, sale: Sale) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Annuler la vente ?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Non',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Oui, annuler la vente'
        },
        accept: async () => {
            sale.undoSale()
            await commandController.update(sale)
            useToastStore().add({ severity: 'success', summary: `Vente annulée`, detail: `La vente a bien été annulée.`, life: 3000 });
            emit(SalesEvent.REFRESH)
        }
    });
}
</script>

<template>
    <Button severity="danger" size="small" icon="pi pi-undo" v-tooltip.top="'Annuler la vente'"
        @click="undoSale($event, sale)" />
</template>