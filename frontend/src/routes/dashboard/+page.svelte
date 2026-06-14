<script lang="ts">
	import { authStore } from '$lib/stores/auth';
</script>

<div>
	<h1 class="text-2xl font-semibold text-slate-900">Resumen general</h1>

	{#if $authStore.user}
		<p class="mt-2 text-slate-600">
			Bienvenido, {$authStore.user.username} (rol: {$authStore.user.role})
		</p>
	{/if}
</div>
