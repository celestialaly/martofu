<script setup lang="ts">
import { computed, reactive } from 'vue';
import router from '@/router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import CommandUserController from '../infrastructure/command/CommandUserController';
import User from '../domain/User';
import { useToastStore } from '@/package/common/stores/toastStore';

interface RegisterForm {
    email: string,
    password: string,
    repeatedPassword: string,
}

const initialState: RegisterForm = {
    email: '',
    password: '',
    repeatedPassword: '',
}

const commandUserController = new CommandUserController()
const state = reactive({ ...initialState })
const rules = computed(() => (
    {
        email: { required, email },
        password: { required, minLength: minLength(8) },
        repeatedPassword: { required, sameAsRef: sameAs(state.password) },
    }
));

const v$ = useVuelidate<RegisterForm>(rules, state)
const submitForm = () => {
    const result = v$.value.$validate();

    result.then((res) => {
        if (!res) {
            return
        }

        registerUser()
    }).catch((err) => {
        console.log(err);
    })

};
const resetForm = () => {
    Object.assign(state, initialState);
    v$.value.$reset()
}

const registerUser = async () => {
    const user = User.new(state.email, state.password)
    await commandUserController.register(user)
    useToastStore().add({ severity: 'success', summary: `Compte créé`, detail: `Votre compte vient d'être créé, bienvenue ! Connectez-vous pour accéder aux fonctionnalités.`, life: 3000 });
    resetForm()
    router.push({path: '/auth'});
}
</script>

<template>
    <Suspense>
        <form @submit.prevent="submitForm">
            <Card class="m-auto mt-2 lg:w-9">
                <template #title>Créer mon compte</template>
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
                        <div v-if="v$.password.$errors.length > 0">
                            <Message v-for="error of v$.password.$errors" v-bind:key="error.$uid" size="small"
                                severity="error" variant="simple">{{ error.$message }}</Message>
                        </div>

                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-key"></i>
                            </InputGroupAddon>
                            <IftaLabel>
                                <Password :feedback="false" toggleMask v-model="state.repeatedPassword"
                                    :invalid="v$.repeatedPassword.$errors.length > 0" />
                                <label for="password">Mot de passe (confirmation)</label>
                            </IftaLabel>
                        </InputGroup>
                        <div v-if="v$.repeatedPassword.$errors.length > 0">
                            <Message v-for="error of v$.repeatedPassword.$errors" v-bind:key="error.$uid" size="small"
                                severity="error" variant="simple">{{ error.$message }}</Message>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex gap-4 mt-1">
                        <Button type="submit" label="Créer mon compte" class="w-full" />
                    </div>
                </template>
            </Card>
        </form>
    </Suspense>
</template>