export interface Metrics {
	products: {
		total: number;
		low_stock: number;
	};
	employees: {
		total_active: number;
		by_status: Record<string, number>;
	};
	products_by_category: {
		category__name: string | null;
		count: number;
	}[];
}
