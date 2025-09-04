'use client';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor -> Access Token ekle
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh Token isteğini cache’lemek için değişken
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        } else {
            prom.reject(new Error('Token yenileme başarısız.'));
        }
    });
    failedQueue = [];
};

// Response interceptor -> 401 yakala
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: any = error.config;

        // Eğer 401 ve daha önce retry edilmediyse
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Refresh işlemi devam ederken diğer istekleri sıraya al
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refresh_token = localStorage.getItem('refresh_token');

                if (!refresh_token) {
                    throw new Error('Refresh token bulunamadı');
                }

                // Global axios kullanıyoruz -> interceptor tetiklenmesin
                const res = await axios.post(`${API_URL}/auth/refresh`, { refresh_token });

                // backend yanıtı: { success: true, data: { access_token, refresh_token } }
                const { access_token: newAccessToken, refresh_token: newRefreshToken } = res.data.data;

                localStorage.setItem('access_token', newAccessToken);
                localStorage.setItem('refresh_token', newRefreshToken);

                apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // Burada logout yönlendirmesi yapabilirsin (örn: window.location.href = '/login')
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
