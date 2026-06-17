import { z } from 'zod';

export const productSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	description: z.string().optional().default(''),
	price: z.string().min(1, 'El precio es requerido'),
	stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
	low_stock_threshold: z.coerce.number().int().min(0, 'El umbral no puede ser negativo'),
	category: z.coerce.number().nullable().optional(),
	is_active: z.boolean().default(true)
});

export type ProductSchema = z.infer<typeof productSchema>;
