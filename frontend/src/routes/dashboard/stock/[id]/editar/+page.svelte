<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		productService,
		categoryService
	} from '$lib/modules/inventory/services/inventory.service';
	import { productSchema } from '$lib/modules/inventory/schemas/product.schema';
	import type { Category } from '$lib/modules/inventory/types/inventory.types';

	let categories = $state<Category[]>([]);
	let error = $state('');
	let isSubmitting = $state(false);
	let isLoading = $state(true);

	let name = $state('');
	let description = $state('');
	let price = $state('');
	let stock = $state(0);
	let low_stock_threshold = $state(5);
	let category = $state<number | null>(null);
	let is_active = $state(true);

	let existingImageUrl = $state<string | null>(null);
	let imageFile = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);

	const productId = Number($page.params.id);

	onMount(async () => {
		try {
			const [product, cats] = await Promise.all([
				productService.getById(productId),
				categoryService.getAll()
			]);
			categories = cats;
			name = product.name;
			description = product.description;
			price = product.price;
			stock = product.stock;
			low_stock_threshold = product.low_stock_threshold;
			category = product.category;
			is_active = product.is_active;
			existingImageUrl = product.image;
		} catch (e) {
			error = 'Error al cargar el producto';
		} finally {
			isLoading = false;
		}
	});

	function handleImageChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		imageFile = file;
		imagePreview = file ? URL.createObjectURL(file) : null;
	}

	async function handleSubmit() {
		error = '';
		const result = productSchema.safeParse({
			name,
			description,
			price,
			stock,
			low_stock_threshold,
			category,
			is_active
		});

		if (!result.success) {
			error = result.error.issues[0].message;
			return;
		}

		isSubmitting = true;
		try {
			await productService.update(productId, result.data, imageFile);
			goto('/dashboard/stock');
		} catch (e) {
			error = 'Error al actualizar el producto';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="max-w-lg">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/stock" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Editar producto</h1>
	</div>

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="flex flex-col gap-4"
		>
			<div>
				<label class="block text-sm font-medium text-slate-700">Imagen</label>
				<div class="mt-1 flex items-center gap-4">
					{#if imagePreview}
						<img
							src={imagePreview}
							alt="Preview"
							class="h-20 w-20 rounded-md object-cover border border-slate-200"
						/>
					{:else if existingImageUrl}
						<img
							src={existingImageUrl}
							alt={name}
							class="h-20 w-20 rounded-md object-cover border border-slate-200"
						/>
					{:else}
						<div
							class="h-20 w-20 rounded-md border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400"
						>
							Sin imagen
						</div>
					{/if}
					<input
						type="file"
						accept="image/*"
						onchange={handleImageChange}
						class="text-sm text-slate-600"
					/>
				</div>
				<p class="mt-1 text-xs text-slate-500">Dejá vacío para mantener la imagen actual.</p>
			</div>

			<div>
				<label class="block text-sm font-medium text-slate-700">Nombre</label>
				<input
					type="text"
					bind:value={name}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-slate-700">Descripción</label>
				<textarea
					bind:value={description}
					rows="3"
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				></textarea>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-slate-700">Precio</label>
					<input
						type="text"
						bind:value={price}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-700">Stock</label>
					<input
						type="number"
						bind:value={stock}
						min="0"
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-slate-700">Umbral stock bajo</label>
					<input
						type="number"
						bind:value={low_stock_threshold}
						min="0"
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-700">Categoría</label>
					<select
						bind:value={category}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>Sin categoría</option>
						{#each categories as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<input type="checkbox" id="is_active" bind:checked={is_active} class="rounded" />
				<label for="is_active" class="text-sm text-slate-700">Producto activo</label>
			</div>

			{#if error}
				<p class="text-sm text-red-600">{error}</p>
			{/if}

			<div class="flex gap-3">
				<button
					type="submit"
					disabled={isSubmitting}
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{isSubmitting ? 'Guardando...' : 'Guardar cambios'}
				</button>
				<a
					href="/dashboard/stock"
					class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					Cancelar
				</a>
			</div>
		</form>
	{/if}
</div>
