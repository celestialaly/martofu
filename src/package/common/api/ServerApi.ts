import { type HydraCollectionResponseType } from './HydraCollectionResponse';

export class ServerApi {
    #baseUri = "http://127.0.0.1:8000/api";

    async get<T>(url: string): Promise<HydraCollectionResponseType<T>> {
        const response = await fetch(`${this.#baseUri}${url}`)

        return await response.json();
    }

    async post<T>(url: string, body: any): Promise<HydraCollectionResponseType<T>> {
        const response = await fetch(`${this.#baseUri}${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/ld+json",
            },
        });

        return await response.json();
    }
}