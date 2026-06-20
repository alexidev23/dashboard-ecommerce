<script lang="ts">
	import { goto } from '$app/navigation';
	import { bannerService } from '$lib/modules/marketing/services/marketing.service';
	import { bannerSchema } from '$lib/modules/marketing/schemas/marketing.schema';

	let title = $state('');
	let link_url = $state('');
	let order = $state(0);
	let is_active = $state(true);
	let start_date = $state('');
	let end_date = $state('');

	let imageFile = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);
	let error = $state('');
	let isSubmitting = $state(false);

	function handleImageChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		imageFile = file;
		imagePreview = file ? URL.createObjectURL(file) : null;
	}

	async function handleSubmit() {
		error = '';

		if (!imageFile) {
			error = 'La imagen es requerida';
			return;
		}

		const result = bannerSchema.safeParse({
			title,
			link_url,
			order,
			is_active,
			start_date: start_date || null,
			end_date: end_date || null
		});

		if (!result.success) {
			error = result.error.issues[0].message;
			return;
		}

		isSubmitting = true;
		try {
			await bannerService.create(result.data, imageFile);
			goto('/dashboard/publicidades');
		} catch (e) {
			error = 'Error al crear el banner';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="max-w-lg">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/publicidades" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Nuevo banner</h1>
	</div>

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
						class="h-20 w-32 rounded-md object-cover border border-slate-200"
					/>
				{:else}
					<div
						class="h-20 w-32 rounded-md border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400"
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
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700">Título</label>
			<input
				type="text"
				bind:value={title}
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700">Link de destino</label>
			<input
				type="text"
				bind:value={link_url}
				placeholder="https://..."
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-slate-700">Orden</label>
				<input
					type="number"
					bind:value={order}
					min="0"
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div class="flex items-end pb-2">
				<label class="flex items-center gap-2 text-sm text-slate-700">
					<input type="checkbox" bind:checked={is_active} class="rounded" />
					Activo
				</label>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-slate-700">Inicio de vigencia</label>
				<input
					type="date"
					bind:value={start_date}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-slate-700">Fin de vigencia</label>
				<input
					type="date"
					bind:value={end_date}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
		<p class="-mt-2 text-xs text-slate-500">Dejá vacío para que no tenga fecha límite.</p>

		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}

		<div class="flex gap-3">
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{isSubmitting ? 'Creando...' : 'Crear banner'}
			</button>
			<a
				href="/dashboard/publicidades"
				class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				Cancelar
			</a>
		</div>
	</form>
</div>
