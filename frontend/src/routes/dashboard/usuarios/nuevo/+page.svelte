<script lang="ts">
	import { goto } from '$app/navigation';
	import { userService } from '$lib/modules/users/services/users.service';
	import { userCreateSchema } from '$lib/modules/users/schemas/user.schema';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let role = $state<'superuser' | 'hr' | 'stock' | 'marketing' | 'employee'>('employee');
	let error = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit() {
		error = '';

		const result = userCreateSchema.safeParse({ username, email, password, role });
		if (!result.success) {
			error = result.error.issues[0].message;
			return;
		}

		isSubmitting = true;
		try {
			await userService.create(result.data);
			goto('/dashboard/usuarios');
		} catch (e) {
			error = 'Error al crear el usuario. Verificá que el usuario o email no estén en uso.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="max-w-md">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/usuarios" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Nuevo usuario</h1>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="flex flex-col gap-4"
	>
		<div>
			<label class="block text-sm font-medium text-slate-700">Usuario</label>
			<input
				type="text"
				bind:value={username}
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700">Email</label>
			<input
				type="email"
				bind:value={email}
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700">Contraseña temporal</label>
			<input
				type="password"
				bind:value={password}
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<p class="mt-1 text-xs text-slate-500">Comunicásela al empleado para su primer ingreso.</p>
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700">Rol</label>
			<select
				bind:value={role}
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="employee">Empleado</option>
				<option value="stock">Stock</option>
				<option value="hr">Recursos Humanos</option>
				<option value="marketing">Marketing</option>
				<option value="superuser">Superuser</option>
			</select>
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
				{isSubmitting ? 'Creando...' : 'Crear usuario'}
			</button>
			<a
				href="/dashboard/usuarios"
				class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				Cancelar
			</a>
		</div>
	</form>
</div>
