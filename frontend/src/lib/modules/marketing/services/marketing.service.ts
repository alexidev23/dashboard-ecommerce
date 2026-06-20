import { api } from '$lib/api/client';
import { getAccessToken } from '$lib/stores/auth';
import type { Banner, BannerFormData, Coupon, CouponFormData } from '../types/marketing.types';

function authHeaders() {
	return { Authorization: `Bearer ${getAccessToken()}` };
}

function buildBannerFormData(data: BannerFormData, imageFile?: File | null): FormData {
	const formData = new FormData();
	formData.append('title', data.title);
	formData.append('link_url', data.link_url);
	formData.append('order', String(data.order));
	formData.append('is_active', String(data.is_active));
	if (data.start_date) formData.append('start_date', data.start_date);
	if (data.end_date) formData.append('end_date', data.end_date);
	if (imageFile) formData.append('image', imageFile);
	return formData;
}

export const bannerService = {
	getAll: () => api.get<Banner[]>('/marketing/banners/', { headers: authHeaders() }),

	create: (data: BannerFormData, imageFile: File) => {
		const formData = buildBannerFormData(data, imageFile);
		return api.postFormData<Banner>('/marketing/banners/', formData, { headers: authHeaders() });
	},

	update: (id: number, data: BannerFormData, imageFile?: File | null) => {
		const formData = buildBannerFormData(data, imageFile);
		return api.patchFormData<Banner>(`/marketing/banners/${id}/`, formData, {
			headers: authHeaders()
		});
	},

	delete: (id: number) => api.delete<void>(`/marketing/banners/${id}/`, { headers: authHeaders() })
};

export const couponService = {
	getAll: () => api.get<Coupon[]>('/marketing/coupons/', { headers: authHeaders() }),

	create: (data: CouponFormData) =>
		api.post<Coupon>('/marketing/coupons/', data, { headers: authHeaders() }),

	update: (id: number, data: Partial<CouponFormData>) =>
		api.patch<Coupon>(`/marketing/coupons/${id}/`, data, { headers: authHeaders() }),

	delete: (id: number) => api.delete<void>(`/marketing/coupons/${id}/`, { headers: authHeaders() })
};
