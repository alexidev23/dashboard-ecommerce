<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userService } from '$lib/modules/users/services/users.service';
	import { authStore } from '$lib/stores/auth';
	import type { AppUser } from '$lib/modules/users/types/users.types';

	const userId = Number($page.params.id);

	let user = $state<AppUser | null>(null);
	let role = $state<AppUser['role']>('employee');
	let is_active = $state(true);
	let isLoading = $state(true);
	let isSubmitting = $state(false);
	let error = $state('');

	const isSelf = $derived(user?.id === $authStore.user?.id);

	onMount(async () => {
		try {
			user = await userService.getById(userId);
			role = user.role;
			is_active = user.is_active;
		} catch (e) {
			error = 'Error al cargar el usuario';
		} finally {
			isLoading = false;
		}
	});

	async function handleSubmit() {
		error = '';
		isSubmitting = true;
		try {
			await userService.update(userId, { role, is_active });
			goto('/dashboard/usuarios');
		} catch (e) {
			error = 'Error al guardar los cambios';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="max-w-md">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/usuarios" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Editar usuario</h1>
	</div>

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if !user}
		<p class="text-sm text-red-600">{error}</p>
	{:else}
		<div class="mb-4 rounded-md bg-slate-50 p-3 text-sm">
			<p class="font-medium text-slate-900">{user.username}</p>
			<p class="text-slate-500">{user.email}</p>
		</div>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="flex flex-col gap-4"
		>
			<div>
				<label class="block text-sm font-medium text-slate-700">Rol</label>
				<select
					bind:value={role}
					disabled={isSelf}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
				>
					<option value="employee">Empleado</option>
					<option value="stock">Stock</option>
					<option value="hr">Recursos Humanos</option>
					<option value="marketing">Marketing</option>
					<option value="superuser">Superuser</option>
				</select>
				{#if isSelf}
					<p class="mt-1 text-xs text-slate-500">No podés cambiar tu propio rol.</p>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="is_active"
					bind:checked={is_active}
					disabled={isSelf}
					class="rounded"
				/>
				<label for="is_active" class="text-sm text-slate-700">Cuenta activa</label>
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
					href="/dashboard/usuarios"
					class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					Cancelar
				</a>
			</div>
		</form>
	{/if}
</div>
