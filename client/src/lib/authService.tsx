'use client';

import apiClient from './apiClient';

type LoginResponse = {
    success: boolean;
    data: {
        access_token: string;
        refresh_token: string;
    };
};

type RegisterResponse = {
    success: boolean;
    data: {
        username: string;
        email: string;
    };
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', { email, password });

    const { access_token, refresh_token } = res.data.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    return res.data;
};

export const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

// Yeni register fonksiyonu
export const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const res = await apiClient.post<RegisterResponse>('/auth/register', { username, email, password });
    return res.data;
};
