<script lang="ts">
	import { login } from '$lib/stores/auth';
	import { loginSchema } from '$lib/modules/auth/schemas/login.schema';
	import { ApiError } from '$lib/api/client';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit() {
		errorMessage = '';

		const result = loginSchema.safeParse({ username, password });
		if (!result.success) {
			errorMessage = result.error.issues[0].message;
			return;
		}

		isSubmitting = true;
		try {
			await login(result.data);
			goto('/dashboard');
		} catch (error) {
			if (error instanceof ApiError) {
				errorMessage = 'Usuario o contraseña incorrectos';
			} else {
				errorMessage = 'Ocurrió un error inesperado';
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="flex flex-col gap-4 w-full max-w-sm"
>
	<div>
		<label for="username" class="block text-sm font-medium text-slate-700">Usuario</label>
		<input
			id="username"
			type="text"
			bind:value={username}
			class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div>
		<label for="password" class="block text-sm font-medium text-slate-700">Contraseña</label>
		<input
			id="password"
			type="password"
			bind:value={password}
			class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	{#if errorMessage}
		<p class="text-sm text-red-600">{errorMessage}</p>
	{/if}

	<button
		type="submit"
		disabled={isSubmitting}
		class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
	>
		{isSubmitting ? 'Ingresando...' : 'Ingresar'}
	</button>
</form>
