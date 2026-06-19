import { z } from 'zod';

export const employeeSchema = z.object({
	first_name: z.string().min(1, 'El nombre es requerido'),
	last_name: z.string().min(1, 'El apellido es requerido'),
	email: z.string().email('Email inválido'),
	phone: z.string().optional().default(''),
	document_number: z.string().min(1, 'El documento es requerido'),
	position: z.coerce.number().nullable().optional(),
	hire_date: z.string().min(1, 'La fecha de ingreso es requerida'),
	status: z.enum(['active', 'inactive', 'on_leave'])
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
