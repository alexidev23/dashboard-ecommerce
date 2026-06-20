export interface AppUser {
	id: number;
	username: string;
	email: string;
	role: 'superuser' | 'hr' | 'stock' | 'marketing' | 'employee';
	is_active: boolean;
}

export interface UserFormData {
	username: string;
	email: string;
	password: string;
	role: 'superuser' | 'hr' | 'stock' | 'marketing' | 'employee';
}
