import { api } from '$lib/api/client';
import { getAccessToken } from '$lib/stores/auth';
import type { Department, Position, Employee, EmployeeFormData } from '../types/hr.types';

function authHeaders() {
	return { Authorization: `Bearer ${getAccessToken()}` };
}

export const departmentService = {
	getAll: () => api.get<Department[]>('/hr/departments/', { headers: authHeaders() }),

	create: (data: { name: string; description: string }) =>
		api.post<Department>('/hr/departments/', data, { headers: authHeaders() }),

	update: (id: number, data: { name?: string; description?: string }) =>
		api.patch<Department>(`/hr/departments/${id}/`, data, { headers: authHeaders() }),

	delete: (id: number) => api.delete<void>(`/hr/departments/${id}/`, { headers: authHeaders() })
};

export const positionService = {
	getAll: () => api.get<Position[]>('/hr/positions/', { headers: authHeaders() }),

	create: (data: { name: string; department: number | null }) =>
		api.post<Position>('/hr/positions/', data, { headers: authHeaders() }),

	update: (id: number, data: { name?: string; department?: number | null }) =>
		api.patch<Position>(`/hr/positions/${id}/`, data, { headers: authHeaders() }),

	delete: (id: number) => api.delete<void>(`/hr/positions/${id}/`, { headers: authHeaders() })
};

export const employeeService = {
	getAll: (params?: { search?: string; status?: string; department?: number }) => {
		const query = new URLSearchParams();
		if (params?.search) query.set('search', params.search);
		if (params?.status) query.set('status', params.status);
		if (params?.department) query.set('department', String(params.department));
		const qs = query.toString();
		return api.get<Employee[]>(`/hr/employees/${qs ? '?' + qs : ''}`, {
			headers: authHeaders()
		});
	},

	getById: (id: number) => api.get<Employee>(`/hr/employees/${id}/`, { headers: authHeaders() }),

	create: (data: EmployeeFormData) =>
		api.post<Employee>('/hr/employees/', data, { headers: authHeaders() }),

	update: (id: number, data: Partial<EmployeeFormData>) =>
		api.patch<Employee>(`/hr/employees/${id}/`, data, { headers: authHeaders() }),

	delete: (id: number) => api.delete<void>(`/hr/employees/${id}/`, { headers: authHeaders() })
};
