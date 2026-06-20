import { z } from 'zod';

export const userCreateSchema = z.object({
	username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
	email: z.string().email('Email inválido'),
	password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
	role: z.enum(['superuser', 'hr', 'stock', 'marketing', 'employee'])
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
