<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import CommandUserController from '../infrastructure/command/CommandUserController';
import { useToastStore } from '@/package/common/stores/toastStore';
import { useAuthStore } from '@/package/common/stores/authStore';

interface LoginForm {
    email: string,
    password: string
}

const initialState: LoginForm = {
    email: '',
    password: '',
}

const commandUserController = new CommandUserController()
const state = reactive({ ...initialState })
const rules = computed(() => (
    {
        email: { required, email },
        password: { required },
    }
));

const v$ = useVuelidate<LoginForm>(rules, state)
const submitForm = () => {
    const result = v$.value.$validate();

    result.then((res) => {
        if (!res) {
            return
        }

        loginUser()
    }).catch((err) => {
        console.log(err);
    })

};
const resetForm = () => {
    Object.assign(state, initialState);
    v$.value.$reset()
}

const loginUser = async () => {
    const authUser = await commandUserController.login(state.email, state.password)
    useAuthStore().login(state.email, authUser.token)
    useToastStore().add({ severity: 'success', summary: `Connecté·e`, detail: `Bienvenue dans le Krosmoz !`, life: 3000 });
    resetForm()
}
</script>

<template>
    <Suspense>
        <form @submit.prevent="submitForm">
            <Card style="width: 65rem; margin: auto; margin-top: 15px;">
                <template #title>Connexion</template>
                <template #content>
                    <div class="flex flex-column gap-2 mt-0.5">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-at"></i>
                            </InputGroupAddon>
                            <IftaLabel>
                                <InputText v-model="state.email" :invalid="v$.email.$errors.length > 0" />
                                <label for="email">Adresse email</label>
                            </IftaLabel>
                        </InputGroup>

                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-key"></i>
                            </InputGroupAddon>
                            <IftaLabel>
                                <Password :feedback="false" toggleMask v-model="state.password"
                                    :invalid="v$.password.$errors.length > 0" />
                                <label for="password">Mot de passe</label>
                            </IftaLabel>
                        </InputGroup>
                    </div>
                </template>
                <template #footer>
                    <div class="flex gap-4 mt-1">
                        <Button type="submit" label="Me connecter" class="w-full" />
                    </div>
                </template>
            </Card>
        </form>
    </Suspense>
</template>