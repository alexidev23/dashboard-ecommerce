<script lang="ts">
	import { onMount } from 'svelte';
	import { categoryService } from '$lib/modules/inventory/services/inventory.service';
	import type { Category } from '$lib/modules/inventory/types/inventory.types';

	let categories = $state<Category[]>([]);
	let isLoading = $state(true);
	let error = $state('');

	// Form state
	let editingId = $state<number | null>(null);
	let name = $state('');
	let description = $state('');
	let isSubmitting = $state(false);

	async function loadCategories() {
		isLoading = true;
		try {
			categories = await categoryService.getAll();
		} catch (e) {
			error = 'Error al cargar las categorías';
		} finally {
			isLoading = false;
		}
	}

	function startEdit(category: Category) {
		editingId = category.id;
		name = category.name;
		description = category.description;
	}

	function cancelEdit() {
		editingId = null;
		name = '';
		description = '';
	}

	async function handleSubmit() {
		if (!name.trim()) {
			error = 'El nombre es requerido';
			return;
		}

		error = '';
		isSubmitting = true;

		try {
			if (editingId) {
				await categoryService.update(editingId, { name, description });
			} else {
				await categoryService.create({ name, description });
			}
			cancelEdit();
			await loadCategories();
		} catch (e) {
			error = 'Error al guardar la categoría';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('¿Eliminar esta categoría?')) return;
		try {
			await categoryService.delete(id);
			await loadCategories();
		} catch (e) {
			error = 'Error al eliminar la categoría';
		}
	}

	onMount(loadCategories);
</script>

<div class="max-w-2xl">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/dashboard/stock" class="text-slate-500 hover:text-slate-700">← Volver</a>
			<h1 class="text-2xl font-semibold text-slate-900">Categorías</h1>
		</div>
	</div>

	<div class="mb-8 rounded-lg border border-slate-200 p-4">
		<h2 class="mb-4 text-sm font-medium text-slate-700">
			{editingId ? 'Editar categoría' : 'Nueva categoría'}
		</h2>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="flex flex-col gap-3"
		>
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
				<input
					type="text"
					bind:value={description}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{#if error}
				<p class="text-sm text-red-600">{error}</p>
			{/if}

			<div class="flex gap-2">
				<button
					type="submit"
					disabled={isSubmitting}
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{isSubmitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear categoría'}
				</button>
				{#if editingId}
					<button
						type="button"
						onclick={cancelEdit}
						class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						Cancelar
					</button>
				{/if}
			</div>
		</form>
	</div>

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if categories.length === 0}
		<p class="text-slate-500">No hay categorías creadas.</p>
	{:else}
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-600">
					<th class="pb-2 pr-4">Nombre</th>
					<th class="pb-2 pr-4">Descripción</th>
					<th class="pb-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each categories as category (category.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50">
						<td class="py-3 pr-4 font-medium text-slate-900">{category.name}</td>
						<td class="py-3 pr-4 text-slate-600">{category.description || '—'}</td>
						<td class="py-3 flex gap-2">
							<button onclick={() => startEdit(category)} class="text-blue-600 hover:underline">
								Editar
							</button>
							<button
								onclick={() => handleDelete(category.id)}
								class="text-red-600 hover:underline"
							>
								Eliminar
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
