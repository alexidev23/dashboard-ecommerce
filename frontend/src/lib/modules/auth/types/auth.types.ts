export interface User {
	id: number;
	username: string;
	email: string;
	role: 'superuser' | 'hr' | 'stock' | 'marketing' | 'employee';
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface TokenResponse {
	access: string;
	refresh: string;
}
