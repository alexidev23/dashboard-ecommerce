<script lang="ts">
	import { onMount } from 'svelte';
	import { positionService, departmentService } from '$lib/modules/hr/services/hr.service';
	import type { Position, Department } from '$lib/modules/hr/types/hr.types';

	let positions = $state<Position[]>([]);
	let departments = $state<Department[]>([]);
	let isLoading = $state(true);
	let error = $state('');
	let editingId = $state<number | null>(null);
	let name = $state('');
	let department = $state<number | null>(null);
	let isSubmitting = $state(false);

	async function loadPositions() {
		isLoading = true;
		try {
			positions = await positionService.getAll();
		} catch (e) {
			error = 'Error al cargar los puestos';
		} finally {
			isLoading = false;
		}
	}

	function startEdit(pos: Position) {
		editingId = pos.id;
		name = pos.name;
		department = pos.department;
	}

	function cancelEdit() {
		editingId = null;
		name = '';
		department = null;
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
				await positionService.update(editingId, { name, department });
			} else {
				await positionService.create({ name, department });
			}
			cancelEdit();
			await loadPositions();
		} catch (e) {
			error = 'Error al guardar el puesto';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('¿Eliminar este puesto?')) return;
		try {
			await positionService.delete(id);
			await loadPositions();
		} catch (e) {
			error = 'Error al eliminar el puesto';
		}
	}

	onMount(async () => {
		departments = await departmentService.getAll();
		await loadPositions();
	});
</script>

<div class="max-w-2xl">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/empleados" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Puestos</h1>
	</div>

	<div class="mb-8 rounded-lg border border-slate-200 p-4">
		<h2 class="mb-4 text-sm font-medium text-slate-700">
			{editingId ? 'Editar puesto' : 'Nuevo puesto'}
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
				<label class="block text-sm font-medium text-slate-700">Departamento</label>
				<select
					bind:value={department}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value={null}>Sin departamento</option>
					{#each departments as dept}
						<option value={dept.id}>{dept.name}</option>
					{/each}
				</select>
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
					{isSubmitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear puesto'}
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
	{:else if positions.length === 0}
		<p class="text-slate-500">No hay puestos creados.</p>
	{:else}
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-600">
					<th class="pb-2 pr-4">Nombre</th>
					<th class="pb-2 pr-4">Departamento</th>
					<th class="pb-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each positions as pos (pos.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50">
						<td class="py-3 pr-4 font-medium text-slate-900">{pos.name}</td>
						<td class="py-3 pr-4 text-slate-600">{pos.department_name ?? '—'}</td>
						<td class="py-3 flex gap-2">
							<button onclick={() => startEdit(pos)} class="text-blue-600 hover:underline">
								Editar
							</button>
							<button onclick={() => handleDelete(pos.id)} class="text-red-600 hover:underline">
								Eliminar
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
