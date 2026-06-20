export interface Banner {
	id: number;
	title: string;
	image: string;
	link_url: string;
	order: number;
	is_active: boolean;
	is_currently_active: boolean;
	start_date: string | null;
	end_date: string | null;
	created_at: string;
}

export interface BannerFormData {
	title: string;
	link_url: string;
	order: number;
	is_active: boolean;
	start_date?: string | null;
	end_date?: string | null;
}

export interface Coupon {
	id: number;
	code: string;
	description: string;
	discount_type: 'percentage' | 'fixed';
	discount_value: string;
	max_uses: number | null;
	times_used: number;
	is_active: boolean;
	is_currently_valid: boolean;
	start_date: string | null;
	end_date: string | null;
	created_at: string;
}

export interface CouponFormData {
	code: string;
	description: string;
	discount_type: 'percentage' | 'fixed';
	discount_value: string;
	max_uses?: number | null;
	is_active: boolean;
	start_date?: string | null;
	end_date?: string | null;
}
