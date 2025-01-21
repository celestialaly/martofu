import ApiException from './ApiException';
import { type HydraCollectionResponseType } from './HydraCollectionResponse';

export class ServerApi {
    #baseUri = "http://127.0.0.1:8000/api";

    async get<T>(url: string): Promise<HydraCollectionResponseType<T>> {
        const response = await fetch(`${this.#baseUri}${url}`)

        return await this.#handleResponse<T>(response);
    }

    async post<T>(url: string, body: object): Promise<HydraCollectionResponseType<T>> {
        const response = await fetch(`${this.#baseUri}${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/ld+json",
            },
        });

        return await this.#handleResponse<T>(response);
    }

    async put<T>(url: string, body: object): Promise<HydraCollectionResponseType<T>> {
        const response = await fetch(`${this.#baseUri}${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/ld+json",
            },
        });

        return await this.#handleResponse<T>(response);
    }

    async #handleResponse<T>(response: Response): Promise<HydraCollectionResponseType<T>> {
        if (response.ok) {
            return await response.json();
        }

        throw new ApiException(response.status, response.statusText);
    }
}