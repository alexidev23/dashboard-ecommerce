<script lang="ts">
	import { onMount } from 'svelte';
	import { employeeService, departmentService } from '$lib/modules/hr/services/hr.service';
	import type { Employee, Department } from '$lib/modules/hr/types/hr.types';

	let employees = $state<Employee[]>([]);
	let departments = $state<Department[]>([]);
	let isLoading = $state(true);
	let search = $state('');
	let selectedStatus = $state('');
	let selectedDepartment = $state<number | null>(null);
	let error = $state('');

	const statusLabels: Record<string, string> = {
		active: 'Activo',
		inactive: 'Inactivo',
		on_leave: 'De licencia'
	};

	const statusColors: Record<string, string> = {
		active: 'bg-green-100 text-green-700',
		inactive: 'bg-slate-100 text-slate-600',
		on_leave: 'bg-amber-100 text-amber-700'
	};

	async function loadEmployees() {
		isLoading = true;
		error = '';
		try {
			employees = await employeeService.getAll({
				search: search || undefined,
				status: selectedStatus || undefined,
				department: selectedDepartment || undefined
			});
		} catch (e) {
			error = 'Error al cargar los empleados';
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('¿Eliminar este empleado?')) return;
		try {
			await employeeService.delete(id);
			await loadEmployees();
		} catch (e) {
			error = 'Error al eliminar el empleado';
		}
	}

	onMount(async () => {
		departments = await departmentService.getAll();
		await loadEmployees();
	});
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-slate-900">Empleados</h1>
		<div class="flex gap-2">
			<a
				href="/dashboard/empleados/departamentos"
				class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				Departamentos
			</a>
			<a
				href="/dashboard/empleados/puestos"
				class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				Puestos
			</a>
			<a
				href="/dashboard/empleados/nuevo"
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				+ Nuevo empleado
			</a>
		</div>
	</div>

	<div class="mb-4 flex gap-3">
		<input
			type="text"
			placeholder="Buscar empleado..."
			bind:value={search}
			oninput={loadEmployees}
			class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<select
			bind:value={selectedStatus}
			onchange={loadEmployees}
			class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value="">Todos los estados</option>
			<option value="active">Activo</option>
			<option value="inactive">Inactivo</option>
			<option value="on_leave">De licencia</option>
		</select>
		<select
			bind:value={selectedDepartment}
			onchange={loadEmployees}
			class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value={null}>Todos los departamentos</option>
			{#each departments as dept}
				<option value={dept.id}>{dept.name}</option>
			{/each}
		</select>
	</div>

	{#if error}
		<p class="mb-4 text-sm text-red-600">{error}</p>
	{/if}

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if employees.length === 0}
		<p class="text-slate-500">No se encontraron empleados.</p>
	{:else}
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-600">
					<th class="pb-2 pr-4">Nombre</th>
					<th class="pb-2 pr-4">Email</th>
					<th class="pb-2 pr-4">Puesto</th>
					<th class="pb-2 pr-4">Departamento</th>
					<th class="pb-2 pr-4">Ingreso</th>
					<th class="pb-2 pr-4">Estado</th>
					<th class="pb-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each employees as employee (employee.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50">
						<td class="py-3 pr-4 font-medium text-slate-900">{employee.full_name}</td>
						<td class="py-3 pr-4 text-slate-600">{employee.email}</td>
						<td class="py-3 pr-4 text-slate-600">{employee.position_name ?? '—'}</td>
						<td class="py-3 pr-4 text-slate-600">{employee.department_name ?? '—'}</td>
						<td class="py-3 pr-4 text-slate-600">{employee.hire_date}</td>
						<td class="py-3 pr-4">
							<span
								class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[employee.status]}"
							>
								{statusLabels[employee.status]}
							</span>
						</td>
						<td class="py-3 flex gap-2">
							<a
								href="/dashboard/empleados/{employee.id}/editar"
								class="text-blue-600 hover:underline"
							>
								Editar
							</a>
							<button
								onclick={() => handleDelete(employee.id)}
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
