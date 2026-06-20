import { z } from 'zod';

export const bannerSchema = z.object({
	title: z.string().min(1, 'El título es requerido'),
	link_url: z.string().optional().default(''),
	order: z.coerce.number().int().min(0),
	is_active: z.boolean().default(true),
	start_date: z.string().nullable().optional(),
	end_date: z.string().nullable().optional()
});

export const couponSchema = z.object({
	code: z.string().min(3, 'El código debe tener al menos 3 caracteres').toUpperCase(),
	description: z.string().optional().default(''),
	discount_type: z.enum(['percentage', 'fixed']),
	discount_value: z.string().min(1, 'El valor del descuento es requerido'),
	max_uses: z.coerce.number().int().min(1).nullable().optional(),
	is_active: z.boolean().default(true),
	start_date: z.string().nullable().optional(),
	end_date: z.string().nullable().optional()
});
