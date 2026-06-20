<script lang="ts">
	import { onMount } from 'svelte';
	import {
		productService,
		categoryService
	} from '$lib/modules/inventory/services/inventory.service';
	import type { Product, Category } from '$lib/modules/inventory/types/inventory.types';

	let products = $state<Product[]>([]);
	let categories = $state<Category[]>([]);
	let isLoading = $state(true);
	let search = $state('');
	let selectedCategory = $state<number | null>(null);
	let error = $state('');

	async function loadProducts() {
		isLoading = true;
		error = '';
		try {
			products = await productService.getAll({
				search: search || undefined,
				category: selectedCategory || undefined
			});
		} catch (e) {
			error = 'Error al cargar los productos';
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('¿Desactivar este producto?')) return;
		try {
			await productService.delete(id);
			await loadProducts();
		} catch (e) {
			error = 'Error al desactivar el producto';
		}
	}

	onMount(async () => {
		categories = await categoryService.getAll();
		await loadProducts();
	});
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-slate-900">Productos</h1>
		<div class="flex gap-2">
			<a
				href="/dashboard/stock/categorias"
				class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				Categorías
			</a>
			<a
				href="/dashboard/stock/nuevo"
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				+ Nuevo producto
			</a>
		</div>
	</div>

	<div class="mb-4 flex gap-3">
		<input
			type="text"
			placeholder="Buscar producto..."
			bind:value={search}
			oninput={loadProducts}
			class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<select
			bind:value={selectedCategory}
			onchange={loadProducts}
			class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value={null}>Todas las categorías</option>
			{#each categories as category}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>
	</div>

	{#if error}
		<p class="mb-4 text-sm text-red-600">{error}</p>
	{/if}

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if products.length === 0}
		<p class="text-slate-500">No se encontraron productos.</p>
	{:else}
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-600">
					<th class="pb-2 pr-4"></th>
					<th class="pb-2 pr-4">Nombre</th>
					<th class="pb-2 pr-4">Categoría</th>
					<th class="pb-2 pr-4">Precio</th>
					<th class="pb-2 pr-4">Stock</th>
					<th class="pb-2 pr-4">Estado</th>
					<th class="pb-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each products as product (product.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50">
						<td class="py-3 pr-4">
							{#if product.image}
								<img
									src={product.image}
									alt={product.name}
									class="h-10 w-10 rounded-md object-cover"
								/>
							{:else}
								<div class="h-10 w-10 rounded-md bg-slate-100"></div>
							{/if}
						</td>
						<td class="py-3 pr-4 font-medium text-slate-900">{product.name}</td>
						<!-- el resto de las columnas queda igual -->
						<td class="py-3 pr-4 text-slate-600">{product.category_name ?? '—'}</td>
						<td class="py-3 pr-4 text-slate-600">${product.price}</td>
						<td class="py-3 pr-4">
							{#if product.is_low_stock}
								<span
									class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
								>
									{product.stock} ⚠
								</span>
							{:else}
								<span class="text-slate-600">{product.stock}</span>
							{/if}
						</td>
						<td class="py-3 pr-4">
							<span
								class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
							>
								Activo
							</span>
						</td>
						<td class="py-3 flex gap-2">
							<a href="/dashboard/stock/{product.id}/editar" class="text-blue-600 hover:underline">
								Editar
							</a>
							<button onclick={() => handleDelete(product.id)} class="text-red-600 hover:underline">
								Desactivar
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
