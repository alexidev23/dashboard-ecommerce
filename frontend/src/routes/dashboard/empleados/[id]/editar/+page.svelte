<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { employeeService, positionService } from '$lib/modules/hr/services/hr.service';
	import { employeeSchema } from '$lib/modules/hr/schemas/employee.schema';
	import type { Position } from '$lib/modules/hr/types/hr.types';

	let positions = $state<Position[]>([]);
	let error = $state('');
	let isSubmitting = $state(false);
	let isLoading = $state(true);

	let first_name = $state('');
	let last_name = $state('');
	let email = $state('');
	let phone = $state('');
	let document_number = $state('');
	let position = $state<number | null>(null);
	let hire_date = $state('');
	let status = $state<'active' | 'inactive' | 'on_leave'>('active');

	const employeeId = Number($page.params.id);

	onMount(async () => {
		try {
			const [employee, pos] = await Promise.all([
				employeeService.getById(employeeId),
				positionService.getAll()
			]);
			positions = pos;
			first_name = employee.first_name;
			last_name = employee.last_name;
			email = employee.email;
			phone = employee.phone;
			document_number = employee.document_number;
			position = employee.position;
			hire_date = employee.hire_date;
			status = employee.status;
		} catch (e) {
			error = 'Error al cargar el empleado';
		} finally {
			isLoading = false;
		}
	});

	async function handleSubmit() {
		error = '';

		const result = employeeSchema.safeParse({
			first_name,
			last_name,
			email,
			phone,
			document_number,
			position,
			hire_date,
			status
		});

		if (!result.success) {
			error = result.error.issues[0].message;
			return;
		}

		isSubmitting = true;
		try {
			await employeeService.update(employeeId, result.data);
			goto('/dashboard/empleados');
		} catch (e) {
			error = 'Error al actualizar el empleado';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="max-w-lg">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/empleados" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Editar empleado</h1>
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
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-slate-700">Nombre</label>
					<input
						type="text"
						bind:value={first_name}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-700">Apellido</label>
					<input
						type="text"
						bind:value={last_name}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-slate-700">Email</label>
				<input
					type="email"
					bind:value={email}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-slate-700">Teléfono</label>
					<input
						type="text"
						bind:value={phone}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-700">Documento</label>
					<input
						type="text"
						bind:value={document_number}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-slate-700">Puesto</label>
					<select
						bind:value={position}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>Sin puesto</option>
						{#each positions as pos}
							<option value={pos.id}>{pos.name} — {pos.department_name ?? '—'}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-700">Estado</label>
					<select
						bind:value={status}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="active">Activo</option>
						<option value="inactive">Inactivo</option>
						<option value="on_leave">De licencia</option>
					</select>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-slate-700">Fecha de ingreso</label>
				<input
					type="date"
					bind:value={hire_date}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
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
					href="/dashboard/empleados"
					class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					Cancelar
				</a>
			</div>
		</form>
	{/if}
</div>
