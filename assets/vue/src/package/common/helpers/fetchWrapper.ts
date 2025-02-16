import ApiException from "../api/ApiException";
import { useAuthStore } from "../stores/authStore";

const createQuery =
    (baseURL: RequestInfo | URL = '', baseInit?: RequestInit) =>
        <T = unknown>(url: RequestInfo | URL, init?: RequestInit) => {
            const parameters = { ...baseInit, ...init }
            parameters.headers = { ...parameters.headers, ...authHeader(url) }

            return fetch(`${baseURL}${url}`, parameters).then((res) => {
                if (!res.ok) {
                    const { user, logout } = useAuthStore();
                    if ([401, 403].includes(res.status) && user) {
                        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                        logout();
                    }

                    throw new ApiException(res.status, res.statusText);
                }

                return res.json() as Promise<T>
            })

        }

const query = createQuery(
    '',
    {
        headers: {
            'Content-Type': 'application/ld+json'
        },
    })

const makeRequest = (method: RequestInit['method']) =>
    <TResponse = unknown, TBody = Record<string, unknown>>(url: RequestInfo | URL, body: TBody) =>
        query<TResponse>(url, {
            method,
            body: JSON.stringify(body),
        })

// helper functions
function authHeader(url: RequestInfo | URL): object {
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    const isApiUrl = url.toString().startsWith(import.meta.env.VITE_API_URL);

    return isLoggedIn && isApiUrl ? { Authorization: `Bearer ${user.token}` } : {};
}

export const fetchWrapper = {
    get: query,
    post: makeRequest('POST'),
    delete: makeRequest('DELETE'),
    put: makeRequest('PUT'),
    patch: makeRequest('PATCH'),
}