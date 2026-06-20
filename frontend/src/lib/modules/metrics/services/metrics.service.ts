import { api } from '$lib/api/client';
import { getAccessToken } from '$lib/stores/auth';
import type { Metrics } from '../types/metrics.types';

export const metricsService = {
	getAll: () =>
		api.get<Metrics>('/metrics/', {
			headers: { Authorization: `Bearer ${getAccessToken()}` }
		})
};
