export interface Category {
	id: number;
	name: string;
	description: string;
	created_at: string;
}

export interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	stock: number;
	low_stock_threshold: number;
	category: number | null;
	category_name: string | null;
	is_active: boolean;
	is_low_stock: boolean;
	created_at: string;
	updated_at: string;
}

export interface ProductFormData {
	name: string;
	description: string;
	price: string;
	stock: number;
	low_stock_threshold: number;
	category?: number | null;
	is_active: boolean;
}
