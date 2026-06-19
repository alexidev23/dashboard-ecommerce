export interface Department {
	id: number;
	name: string;
	description: string;
	created_at: string;
}

export interface Position {
	id: number;
	name: string;
	department: number | null;
	department_name: string | null;
	created_at: string;
}

export interface Employee {
	id: number;
	first_name: string;
	last_name: string;
	full_name: string;
	email: string;
	phone: string;
	document_number: string;
	position: number | null;
	position_name: string | null;
	department_name: string | null;
	hire_date: string;
	status: 'active' | 'inactive' | 'on_leave';
	created_at: string;
	updated_at: string;
}

export interface EmployeeFormData {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	document_number: string;
	position?: number | null;
	hire_date: string;
	status: 'active' | 'inactive' | 'on_leave';
}
