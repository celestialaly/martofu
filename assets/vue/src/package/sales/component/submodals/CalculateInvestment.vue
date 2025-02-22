<script setup lang="ts">
import { ref } from "vue";
import { SalesEvent } from "../../domain/SalesEvent";

export interface SaveInvestmentPriceEvent {
    price: number
}

const emit = defineEmits<{
    (event: SalesEvent.SAVE_INVESTMENT_PRICE, price: number): void
}>()

const visible = ref(false);
const chatlog = ref('');
const craftInvestment = ref(0);
const runeInvestment = ref(0);
const totalInvestment = ref(0);

const calculateTotal = () => {
    const re = /\] \(([\d\s\xa0]+)/g;
    let price = 0;
    let lastMatch;

    while (lastMatch = re.exec(chatlog.value)) {
        if (lastMatch[1]) {
            price += parseInt(lastMatch[1].replace(/[\s\xa0]+/g, ''))
        }

        // Avoid infinite loop
        if(!re.global) break;
    }

    totalInvestment.value = price + runeInvestment.value + craftInvestment.value
}

const resetForm = () => {
    chatlog.value = ''
    runeInvestment.value = 0
    craftInvestment.value = 0
    totalInvestment.value = 0
    visible.value = false
}

const submitForm = () => {
    emit(SalesEvent.SAVE_INVESTMENT_PRICE, totalInvestment.value)
    resetForm()
};
</script>

<template>
    <Button icon="pi pi-calculator" severity="contrast" variant="text" @click="visible = true" />

    <Dialog v-model:visible="visible" modal header="Calcul de l'investissement" style="width: 60%;">
        <form @submit.prevent="submitForm">
            <div class="grid">
                <div class="col-6">
                    <IftaLabel>
                        <Textarea id="chatlog" v-model="chatlog" rows="14" class="w-full" @input="calculateTotal" />
                        <label for="chatlog">Données de votre chat</label>
                    </IftaLabel>
                </div>

                <div class="col-6">
                    <p class="mt-0">Vous pouvez copier/coller les achats faits à l'HDV pour calculer automatiquement la
                        somme dépensée :</p>
                    <img src="@/assets/images/investment_chatlog.png" alt="Chat Log" class=" border-1" />
                </div>

                <InputGroup class="col-12">
                    <InputGroupAddon>
                        <i class="pi pi-hammer"></i>
                    </InputGroupAddon>
                    <IftaLabel>
                        <InputNumber suffix="k" v-model="craftInvestment" @value-change="calculateTotal" />
                        <label for="runeInvestment">Coût craft</label>
                    </IftaLabel>
                </InputGroup>
                <InputGroup class="col-12">
                    <InputGroupAddon>
                        <i class="pi pi-sparkles"></i>
                    </InputGroupAddon>
                    <IftaLabel>
                        <InputNumber suffix="k" v-model="runeInvestment" @value-change="calculateTotal" />
                        <label for="runeInvestment">Investissement en runes</label>
                    </IftaLabel>
                </InputGroup>

                <InputGroup class="col-12">
                    <InputGroupAddon>
                        <i class="pi pi-dollar"></i>
                    </InputGroupAddon>
                    <IftaLabel>
                        <InputNumber suffix="k" v-model="totalInvestment" disabled />
                        <label for="totalInvestment">Investissement</label>
                    </IftaLabel>
                </InputGroup>
            </div>

            <div class="flex justify-content-end gap-2 mt-3">
                <Button type="button" severity="secondary" @click="visible = false">Annuler</Button>
                <Button type="submit">Valider le calcul</Button>
            </div>
        </form>
    </Dialog>
</template>