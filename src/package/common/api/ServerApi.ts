import ApiException from './ApiException';
import { type HydraCollectionResponseType } from './HydraCollectionResponse';

export class ServerApi {
    // TODO: Set in env variable
    #baseUri = "http://127.0.0.1:8000/api";

    async get<T>(url: string, parameters: object): Promise<HydraCollectionResponseType<T>> {
        const urlWithParams = new URL(`${this.#baseUri}${url}`);

        for (const [key, value] of Object.entries(parameters)) {
            urlWithParams.searchParams.set(key, value);
        }

        const response = await fetch(urlWithParams.href)

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