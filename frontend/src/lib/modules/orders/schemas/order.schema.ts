import { z } from 'zod';

const orderItemSchema = z.object({
	product: z.number({ message: 'Seleccioná un producto' }),
	quantity: z.coerce.number().int().min(1, 'La cantidad debe ser mayor a 0')
});

export const orderSchema = z.object({
	customer_name: z.string().min(1, 'El nombre del cliente es requerido'),
	customer_email: z.string().email('Email inválido'),
	status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
	notes: z.string().optional().default(''),
	items: z.array(orderItemSchema).min(1, 'Agregá al menos un producto')
});

export type OrderSchema = z.infer<typeof orderSchema>;
