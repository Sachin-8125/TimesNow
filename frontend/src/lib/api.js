import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL,
    withCredentials: true,
});

let accessToken = null;

export function setAccessToken(token) {
    accessToken = token ?? null;
}

function getAuthHeader(token) {
    return { Authorization: `Bearer ${token}` };
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Endpoints that must never trigger the automatic refresh/retry flow.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/logout', '/auth/refresh'];

function isAuthEndpoint(url = '') {
    return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

let refreshPromise = null;

function requestNewAccessToken() {
    if (!refreshPromise) {
        refreshPromise = api
            .post('/auth/refresh')
            .then((response) => {
                const token = response.data?.accessToken ?? null;
                setAccessToken(token);
                return token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isAuthUrl = isAuthEndpoint(originalRequest?.url);

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthUrl
        ) {
            originalRequest._retry = true;
            try {
                const token = await requestNewAccessToken();
                if (!token) {
                    return Promise.reject(error);
                }
                if (typeof originalRequest.headers?.set === 'function') {
                    originalRequest.headers.set('Authorization', `Bearer ${token}`);
                } else {
                    originalRequest.headers = {
                        ...originalRequest.headers,
                        ...getAuthHeader(token),
                    };
                }
                return api(originalRequest);
            } catch {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export { api };
