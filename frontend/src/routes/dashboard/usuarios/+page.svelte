<script lang="ts">
	import { onMount } from 'svelte';
	import { userService } from '$lib/modules/users/services/users.service';
	import { authStore } from '$lib/stores/auth';
	import type { AppUser } from '$lib/modules/users/types/users.types';

	let users = $state<AppUser[]>([]);
	let isLoading = $state(true);
	let error = $state('');

	const roleLabels: Record<string, string> = {
		superuser: 'Superuser',
		hr: 'Recursos Humanos',
		stock: 'Stock',
		marketing: 'Marketing',
		employee: 'Empleado'
	};

	async function loadUsers() {
		isLoading = true;
		try {
			users = await userService.getAll();
		} catch (e) {
			error = 'Error al cargar los usuarios';
		} finally {
			isLoading = false;
		}
	}

	async function toggleActive(user: AppUser) {
		try {
			await userService.update(user.id, { is_active: !user.is_active });
			await loadUsers();
		} catch (e) {
			error = 'Error al actualizar el usuario';
		}
	}

	onMount(loadUsers);
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-slate-900">Usuarios</h1>
		<a
			href="/dashboard/usuarios/nuevo"
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
		>
			+ Nuevo usuario
		</a>
	</div>

	{#if error}
		<p class="mb-4 text-sm text-red-600">{error}</p>
	{/if}

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if users.length === 0}
		<p class="text-slate-500">No hay usuarios.</p>
	{:else}
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-600">
					<th class="pb-2 pr-4">Usuario</th>
					<th class="pb-2 pr-4">Email</th>
					<th class="pb-2 pr-4">Rol</th>
					<th class="pb-2 pr-4">Estado</th>
					<th class="pb-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each users as user (user.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50">
						<td class="py-3 pr-4 font-medium text-slate-900">{user.username}</td>
						<td class="py-3 pr-4 text-slate-600">{user.email}</td>
						<td class="py-3 pr-4 text-slate-600">{roleLabels[user.role]}</td>
						<td class="py-3 pr-4">
							{#if user.is_active}
								<span
									class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
									>Activo</span
								>
							{:else}
								<span
									class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
									>Inactivo</span
								>
							{/if}
						</td>
						<td class="py-3 flex gap-2">
							{#if user.id !== $authStore.user?.id}
								<a
									href="/dashboard/usuarios/{user.id}/editar"
									class="text-sm text-blue-600 hover:underline"
								>
									Editar
								</a>
								<button
									onclick={() => toggleActive(user)}
									class="text-sm {user.is_active
										? 'text-red-600'
										: 'text-green-600'} hover:underline"
								>
									{user.is_active ? 'Desactivar' : 'Activar'}
								</button>
							{:else}
								<span class="text-xs text-slate-400">(vos)</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
