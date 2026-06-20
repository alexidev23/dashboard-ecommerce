<script lang="ts">
	import { onMount } from 'svelte';
	import { bannerService } from '$lib/modules/marketing/services/marketing.service';
	import type { Banner } from '$lib/modules/marketing/types/marketing.types';

	let banners = $state<Banner[]>([]);
	let isLoading = $state(true);
	let error = $state('');

	async function loadBanners() {
		isLoading = true;
		try {
			banners = await bannerService.getAll();
		} catch (e) {
			error = 'Error al cargar los banners';
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('¿Eliminar este banner?')) return;
		try {
			await bannerService.delete(id);
			await loadBanners();
		} catch (e) {
			error = 'Error al eliminar el banner';
		}
	}

	onMount(loadBanners);
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-slate-900">Publicidades</h1>
		<div class="flex gap-2">
			<a
				href="/dashboard/publicidades/cupones"
				class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				Cupones
			</a>
			<a
				href="/dashboard/publicidades/nuevo"
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				+ Nuevo banner
			</a>
		</div>
	</div>

	{#if error}
		<p class="mb-4 text-sm text-red-600">{error}</p>
	{/if}

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if banners.length === 0}
		<p class="text-slate-500">No hay banners creados.</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each banners as banner (banner.id)}
				<div class="overflow-hidden rounded-lg border border-slate-200">
					<img src={banner.image} alt={banner.title} class="h-32 w-full object-cover" />
					<div class="p-3">
						<div class="mb-2 flex items-start justify-between">
							<p class="font-medium text-slate-900">{banner.title}</p>
							{#if banner.is_currently_active}
								<span
									class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
									>Vigente</span
								>
							{:else}
								<span
									class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
									>No vigente</span
								>
							{/if}
						</div>
						<p class="mb-3 text-xs text-slate-500">Orden: {banner.order}</p>
						<div class="flex gap-2">
							<a
								href="/dashboard/publicidades/{banner.id}/editar"
								class="text-sm text-blue-600 hover:underline"
							>
								Editar
							</a>
							<button
								onclick={() => handleDelete(banner.id)}
								class="text-sm text-red-600 hover:underline"
							>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
