import { fetchWrapper } from '../helpers/fetchWrapper';

const baseUrl = import.meta.env.VITE_API_URL;

export class ServerApi {
    async get<T>(url: string, parameters: object): Promise<T> {
        const urlWithParams = new URL(`${baseUrl}${url}`);

        for (const [key, value] of Object.entries(parameters)) {
            if (typeof value === "object") {
                for (const [subKey, subValue] of Object.entries(value)) {
                    urlWithParams.searchParams.set(`${key}[${subKey}]`, subValue as string);
                }
            } else {
                urlWithParams.searchParams.set(key, value);
            }
        }

        return await fetchWrapper.get<T>(urlWithParams.href)
    }

    async post<T>(url: string, body: Record<string, unknown>): Promise<T> {
        return await fetchWrapper.post<T>(`${baseUrl}${url}`, body);
    }

    async put<T>(url: string, body: Record<string, unknown>): Promise<T> {
        return await fetchWrapper.put<T>(`${baseUrl}${url}`, body);
    }
}