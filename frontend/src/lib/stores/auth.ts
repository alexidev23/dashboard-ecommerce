import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { api } from '$lib/api/client';
import type { User, LoginCredentials, TokenResponse } from '$lib/modules/auth/types/auth.types';

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isLoading: true
};

export const authStore = writable<AuthState>(initialState);

function persistTokens(access: string, refresh: string) {
	if (!browser) return;
	localStorage.setItem('accessToken', access);
	localStorage.setItem('refreshToken', refresh);
}

function clearPersistedTokens() {
	if (!browser) return;
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
}

export async function login(credentials: LoginCredentials): Promise<void> {
	authStore.update((state) => ({ ...state, isLoading: true }));

	try {
		const tokens = await api.post<TokenResponse>('/token/', credentials);
		persistTokens(tokens.access, tokens.refresh);

		authStore.update((state) => ({
			...state,
			accessToken: tokens.access,
			refreshToken: tokens.refresh
		}));

		const user = await api.get<User>('/me/', {
			headers: { Authorization: `Bearer ${tokens.access}` }
		});

		authStore.update((state) => ({ ...state, user, isLoading: false }));
	} catch (error) {
		clearPersistedTokens();
		authStore.update(() => ({ ...initialState }));
		throw error;
	}
}

export function logout(): void {
	clearPersistedTokens();
	authStore.set(initialState);
}

export function getAccessToken(): string | null {
	return get(authStore).accessToken;
}

export async function restoreSession(): Promise<void> {
	if (!browser) return;

	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	if (!accessToken || !refreshToken) {
		authStore.update((state) => ({ ...state, isLoading: false }));
		return;
	}

	authStore.update((state) => ({ ...state, isLoading: true, accessToken, refreshToken }));

	try {
		const user = await api.get<User>('/me/', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		authStore.update((state) => ({ ...state, user, isLoading: false }));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		clearPersistedTokens();
		authStore.update(() => ({ ...initialState, isLoading: false }));
	}
}
