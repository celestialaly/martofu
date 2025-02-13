import { useToast } from "primevue"
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toasts', () => {
    const toast = useToast()

    return toast
})
