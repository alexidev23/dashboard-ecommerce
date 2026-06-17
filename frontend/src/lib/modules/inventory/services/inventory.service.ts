import { api } from '$lib/api/client';
import { getAccessToken } from '$lib/stores/auth';
import type { Category, Product, ProductFormData } from '../types/inventory.types';

function authHeaders() {
	return { Authorization: `Bearer ${getAccessToken()}` };
}

export const categoryService = {
	getAll: () =>
		api.get<Category[]>('/inventory/categories/', {
			headers: authHeaders()
		}),

	create: (data: { name: string; description: string }) =>
		api.post<Category>('/inventory/categories/', data, {
			headers: authHeaders()
		}),

	update: (id: number, data: { name?: string; description?: string }) =>
		api.patch<Category>(`/inventory/categories/${id}/`, data, {
			headers: authHeaders()
		}),

	delete: (id: number) =>
		api.delete<void>(`/inventory/categories/${id}/`, {
			headers: authHeaders()
		})
};

export const productService = {
	getAll: (params?: { search?: string; category?: number; ordering?: string }) => {
		const query = new URLSearchParams();
		if (params?.search) query.set('search', params.search);
		if (params?.category) query.set('category', String(params.category));
		if (params?.ordering) query.set('ordering', params.ordering);
		const qs = query.toString();
		return api.get<Product[]>(`/inventory/products/${qs ? '?' + qs : ''}`, {
			headers: authHeaders()
		});
	},

	getLowStock: () =>
		api.get<Product[]>('/inventory/products/low_stock/', {
			headers: authHeaders()
		}),

	create: (data: ProductFormData) =>
		api.post<Product>('/inventory/products/', data, {
			headers: authHeaders()
		}),

	getById: (id: number) =>
		api.get<Product>(`/inventory/products/${id}/`, {
			headers: authHeaders()
		}),

	update: (id: number, data: Partial<ProductFormData>) =>
		api.patch<Product>(`/inventory/products/${id}/`, data, {
			headers: authHeaders()
		}),

	delete: (id: number) => productService.update(id, { is_active: false })
};
