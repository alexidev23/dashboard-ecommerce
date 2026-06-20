import { api } from '$lib/api/client';
import { getAccessToken } from '$lib/stores/auth';
import type { AppUser, UserFormData } from '../types/users.types';

function authHeaders() {
	return { Authorization: `Bearer ${getAccessToken()}` };
}

export const userService = {
	getAll: () => api.get<AppUser[]>('/users/', { headers: authHeaders() }),

	create: (data: UserFormData) => api.post<AppUser>('/users/', data, { headers: authHeaders() }),

	update: (id: number, data: { role?: string; is_active?: boolean }) =>
		api.patch<AppUser>(`/users/${id}/`, data, { headers: authHeaders() }),

	getById: (id: number) => api.get<AppUser>(`/users/${id}/`, { headers: authHeaders() })
};
