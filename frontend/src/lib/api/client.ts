const API_BASE_URL = 'http://localhost:8000/api';

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		throw new ApiError(response.status, errorBody?.message || 'Error en la aplicacion');
	}

	return response.json();
}

async function requestFormData<T>(
	path: string,
	formData: FormData,
	options: RequestInit & { method?: string } = {}
): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		method: options.method ?? 'POST',
		body: formData,
		headers: {
			...options.headers
			// NO seteamos Content-Type: el navegador lo arma solo con el boundary correcto
		}
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		throw new ApiError(response.status, errorBody?.detail || 'Error en la petición');
	}

	return response.json();
}

export const api = {
	get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'GET' }),

	post: <T>(path: string, body: unknown, options?: RequestInit) =>
		request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),

	patch: <T>(path: string, body: unknown, options?: RequestInit) =>
		request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

	delete: <T>(path: string, options?: RequestInit) =>
		request<T>(path, { ...options, method: 'DELETE' }),

	postFormData: <T>(path: string, formData: FormData, options?: RequestInit) =>
		requestFormData<T>(path, formData, { ...options, method: 'POST' }),

	patchFormData: <T>(path: string, formData: FormData, options?: RequestInit) =>
		requestFormData<T>(path, formData, { ...options, method: 'PATCH' })
};
