<script lang="ts">
	import LoginForm from '$lib/modules/auth/components/LoginForm.svelte';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			if (!state.isLoading && state.user) {
				goto('/dashboard');
			}
		});

		return unsubscribe;
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-50">
	<div class="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm">
		<h1 class="mb-6 text-xl font-semibold text-slate-900">Iniciar sesión</h1>
		<LoginForm />
	</div>
</div>
