<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import { metricsService } from '$lib/modules/metrics/services/metrics.service';
	import type { Metrics } from '$lib/modules/metrics/types/metrics.types';

	let metrics = $state<Metrics | null>(null);
	let isLoading = $state(true);
	let error = $state('');

	const statusLabels: Record<string, string> = {
		active: 'Activos',
		inactive: 'Inactivos',
		on_leave: 'De licencia'
	};

	onMount(async () => {
		try {
			metrics = await metricsService.getAll();
		} catch (e) {
			error = 'Error al cargar las métricas';
		} finally {
			isLoading = false;
		}
	});
</script>

<div>
	<div class="mb-6">
		<h1 class="text-2xl font-semibold text-slate-900">Resumen general</h1>
		{#if $authStore.user}
			<p class="mt-1 text-sm text-slate-500">
				Bienvenido, {$authStore.user.username}
			</p>
		{/if}
	</div>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{:else if isLoading}
		<p class="text-slate-500">Cargando métricas...</p>
	{:else if metrics}
		<div class="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
			<div class="rounded-lg border border-slate-200 bg-white p-4">
				<p class="text-sm text-slate-500">Productos activos</p>
				<p class="mt-1 text-3xl font-semibold text-slate-900">{metrics.products.total}</p>
			</div>

			<div class="rounded-lg border border-slate-200 bg-white p-4">
				<p class="text-sm text-slate-500">Stock bajo</p>
				<p
					class="mt-1 text-3xl font-semibold {metrics.products.low_stock > 0
						? 'text-amber-600'
						: 'text-slate-900'}"
				>
					{metrics.products.low_stock}
				</p>
				{#if metrics.products.low_stock > 0}
					<a href="/dashboard/stock" class="text-xs text-amber-600 hover:underline"
						>Ver productos →</a
					>
				{/if}
			</div>

			<div class="rounded-lg border border-slate-200 bg-white p-4">
				<p class="text-sm text-slate-500">Empleados activos</p>
				<p class="mt-1 text-3xl font-semibold text-slate-900">{metrics.employees.total_active}</p>
			</div>

			<div class="rounded-lg border border-slate-200 bg-white p-4">
				<p class="text-sm text-slate-500">Total empleados</p>
				<p class="mt-1 text-3xl font-semibold text-slate-900">
					{Object.values(metrics.employees.by_status).reduce((a, b) => a + b, 0)}
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div class="rounded-lg border border-slate-200 bg-white p-4">
				<h2 class="mb-4 text-sm font-medium text-slate-700">Empleados por estado</h2>
				<div class="flex flex-col gap-2">
					{#each Object.entries(metrics.employees.by_status) as [status, count]}
						<div class="flex items-center justify-between text-sm">
							<span class="text-slate-600">{statusLabels[status] ?? status}</span>
							<span class="font-medium text-slate-900">{count}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-lg border border-slate-200 bg-white p-4">
				<h2 class="mb-4 text-sm font-medium text-slate-700">Productos por categoría</h2>
				<div class="flex flex-col gap-2">
					{#each metrics.products_by_category as item}
						<div class="flex items-center justify-between text-sm">
							<span class="text-slate-600">{item.category__name ?? 'Sin categoría'}</span>
							<span class="font-medium text-slate-900">{item.count}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
