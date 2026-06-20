import { api } from '$lib/api/client';
import { getAccessToken } from '$lib/stores/auth';
import type { Category, Product, ProductFormData } from '../types/inventory.types';

function authHeaders() {
	return { Authorization: `Bearer ${getAccessToken()}` };
}

function buildProductFormData(data: ProductFormData, imageFile?: File | null): FormData {
	const formData = new FormData();
	formData.append('name', data.name);
	formData.append('description', data.description);
	formData.append('price', data.price);
	formData.append('stock', String(data.stock));
	formData.append('low_stock_threshold', String(data.low_stock_threshold));
	formData.append('is_active', String(data.is_active));
	if (data.category !== null && data.category !== undefined) {
		formData.append('category', String(data.category));
	}
	if (imageFile) {
		formData.append('image', imageFile);
	}
	return formData;
}

export const categoryService = {
	getAll: () => api.get<Category[]>('/inventory/categories/', { headers: authHeaders() }),
	create: (data: { name: string; description: string }) =>
		api.post<Category>('/inventory/categories/', data, { headers: authHeaders() }),
	update: (id: number, data: { name?: string; description?: string }) =>
		api.patch<Category>(`/inventory/categories/${id}/`, data, { headers: authHeaders() }),
	delete: (id: number) =>
		api.delete<void>(`/inventory/categories/${id}/`, { headers: authHeaders() })
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

	getById: (id: number) =>
		api.get<Product>(`/inventory/products/${id}/`, { headers: authHeaders() }),

	getLowStock: () =>
		api.get<Product[]>('/inventory/products/low_stock/', { headers: authHeaders() }),

	create: (data: ProductFormData, imageFile?: File | null) => {
		const formData = buildProductFormData(data, imageFile);
		return api.postFormData<Product>('/inventory/products/', formData, {
			headers: authHeaders()
		});
	},

	update: (id: number, data: ProductFormData, imageFile?: File | null) => {
		const formData = buildProductFormData(data, imageFile);
		return api.patchFormData<Product>(`/inventory/products/${id}/`, formData, {
			headers: authHeaders()
		});
	},

	delete: (id: number) =>
		api.patch<Product>(
			`/inventory/products/${id}/`,
			{ is_active: false },
			{
				headers: authHeaders()
			}
		)
};
