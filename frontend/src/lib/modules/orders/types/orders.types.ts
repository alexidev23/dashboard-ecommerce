export interface OrderItem {
	id?: number;
	product: number;
	product_name?: string;
	quantity: number;
	unit_price: string;
	subtotal?: string;
}

export interface Order {
	id: number;
	customer_name: string;
	customer_email: string;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	notes: string;
	items: OrderItem[];
	total: string;
	created_at: string;
	updated_at: string;
}

export interface OrderFormData {
	customer_name: string;
	customer_email: string;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	notes: string;
	items: { product: number; quantity: number }[];
}
