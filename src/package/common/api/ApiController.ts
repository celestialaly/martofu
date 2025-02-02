import { useToastStore } from "../toastStore";
import ApiException from "./ApiException";
import type { HydraCollectionResponseType } from "./HydraCollectionResponse";
import { ServerApi } from "./ServerApi";

export default class ApiController {
    api: ServerApi = new ServerApi()

    async get<T>(url: string, parameters: object = {}): Promise<HydraCollectionResponseType<T>> {
        try {
            return await this.api.get(url, parameters);
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }

    async getPaginated<T>(url: string, page: number = 1, limit: number = 25): Promise<HydraCollectionResponseType<T>> {
        try {
            return await this.api.get(url, { page: page, limit: limit });
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }

    async post<T>(url: string, body: object): Promise<HydraCollectionResponseType<T>> {
        try {
            return await this.api.post(url, body);
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }

    async put<T>(url: string, body: object): Promise<HydraCollectionResponseType<T>> {
        try {
            return await this.api.put(url, body);
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }
}