import { api } from '$lib/api/client';
import { getAccessToken } from '$lib/stores/auth';
import type { Order, OrderFormData } from '../types/orders.types';

function authHeaders() {
	return { Authorization: `Bearer ${getAccessToken()}` };
}

export const orderService = {
	getAll: (params?: { status?: string; search?: string }) => {
		const query = new URLSearchParams();
		if (params?.status) query.set('status', params.status);
		if (params?.search) query.set('search', params.search);
		const qs = query.toString();
		return api.get<Order[]>(`/orders/orders/${qs ? '?' + qs : ''}`, {
			headers: authHeaders()
		});
	},

	getById: (id: number) => api.get<Order>(`/orders/orders/${id}/`, { headers: authHeaders() }),

	create: (data: OrderFormData) =>
		api.post<Order>('/orders/orders/', data, { headers: authHeaders() }),

	update: (id: number, data: Partial<OrderFormData>) =>
		api.patch<Order>(`/orders/orders/${id}/`, data, { headers: authHeaders() }),

	delete: (id: number) => api.delete<void>(`/orders/orders/${id}/`, { headers: authHeaders() })
};
