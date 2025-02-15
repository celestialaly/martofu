import { useToastStore } from "../stores/toastStore";
import ApiException from "./ApiException";
import type { ApiPaginator } from "./ApiPaginator";
import type { HydraCollectionResponseType } from "./HydraCollectionResponse";
import { ServerApi } from "./ServerApi";

export default class ApiController {
    api: ServerApi = new ServerApi()

    async get<T>(url: string, parameters: object = {}): Promise<T> {
        try {
            return await this.api.get(url, parameters);
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }

    async getPaginated<T>(url: string, paginator: ApiPaginator): Promise<HydraCollectionResponseType<T>> {
        try {
            return await this.api.get(url, paginator.getSearchParameters());
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }

    async post<T>(url: string, body: unknown): Promise<T> {
        try {
            return await this.api.post(url, body as Record<string, unknown>);
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }

    async put<T>(url: string, body: unknown): Promise<T> {
        try {
            return await this.api.put(url, body as Record<string, unknown>);
        } catch (error) {
            if (error instanceof ApiException) {
                useToastStore().add({ severity: 'error', summary: `[${error.status}] Erreur`, detail: error.message, life: 3000 });
            }

            throw error
        }
    }
}