<script lang="ts">
	import { authStore, logout } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	function handleLogout() {
		logout();
		goto('/login');
	}

	let checked = $state(false);

	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			if (!state.isLoading) {
				checked = true;
				if (!state.user) {
					goto('/login');
				}
			}
		});

		return unsubscribe;
	});
</script>

{#if checked && $authStore.user}
	<div class="flex min-h-screen">
		<aside class="w-56 border-r border-slate-200 bg-slate-50 p-4 flex flex-col">
			<h2 class="mb-6 text-lg font-semibold text-slate-900">PanelCorp</h2>

			<nav class="flex flex-col gap-1 text-sm text-slate-700">
				<a href="/dashboard" class="rounded px-2 py-1.5 hover:bg-slate-200">Home</a>

				{#if ['superuser', 'stock'].includes($authStore.user?.role ?? '')}
					<a href="/dashboard/stock" class="rounded px-2 py-1.5 hover:bg-slate-200">Productos</a>
				{/if}

				{#if ['superuser', 'hr'].includes($authStore.user?.role ?? '')}
					<a href="/dashboard/empleados" class="rounded px-2 py-1.5 hover:bg-slate-200">Empleados</a
					>
				{/if}

				{#if ['superuser', 'marketing'].includes($authStore.user?.role ?? '')}
					<a href="/dashboard/publicidades" class="rounded px-2 py-1.5 hover:bg-slate-200"
						>Publicidades</a
					>
				{/if}

				{#if $authStore.user?.role === 'superuser'}
					<a href="/dashboard/usuarios" class="rounded px-2 py-1.5 hover:bg-slate-200">Usuarios</a>
				{/if}

				{#if ['superuser', 'stock'].includes($authStore.user?.role ?? '')}
					<a href="/dashboard/pedidos" class="rounded px-2 py-1.5 hover:bg-slate-200">Pedidos</a>
				{/if}
			</nav>

			<div class="mt-auto border-t border-slate-200 pt-4 text-sm">
				<p class="font-medium text-slate-900">{$authStore.user.username}</p>
				<p class="text-slate-500">{$authStore.user.role}</p>
				<button onclick={handleLogout} class="mt-2 text-sm text-red-600 hover:underline">
					Cerrar sesión
				</button>
			</div>
		</aside>

		<main class="flex-1 p-6">
			{@render children()}
		</main>
	</div>
{:else if !checked}
	<div class="flex min-h-screen items-center justify-center text-slate-500">Cargando...</div>
{/if}
