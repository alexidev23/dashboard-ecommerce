<script lang="ts">
	import { onMount } from 'svelte';
	import { couponService } from '$lib/modules/marketing/services/marketing.service';
	import { couponSchema } from '$lib/modules/marketing/schemas/marketing.schema';
	import type { Coupon } from '$lib/modules/marketing/types/marketing.types';

	let coupons = $state<Coupon[]>([]);
	let isLoading = $state(true);
	let error = $state('');

	let editingId = $state<number | null>(null);
	let code = $state('');
	let description = $state('');
	let discount_type = $state<'percentage' | 'fixed'>('percentage');
	let discount_value = $state('');
	let max_uses = $state('');
	let is_active = $state(true);
	let start_date = $state('');
	let end_date = $state('');
	let isSubmitting = $state(false);

	async function loadCoupons() {
		isLoading = true;
		try {
			coupons = await couponService.getAll();
		} catch (e) {
			error = 'Error al cargar los cupones';
		} finally {
			isLoading = false;
		}
	}

	function startEdit(coupon: Coupon) {
		editingId = coupon.id;
		code = coupon.code;
		description = coupon.description;
		discount_type = coupon.discount_type;
		discount_value = coupon.discount_value;
		max_uses = coupon.max_uses ? String(coupon.max_uses) : '';
		is_active = coupon.is_active;
		start_date = coupon.start_date ?? '';
		end_date = coupon.end_date ?? '';
	}

	function cancelEdit() {
		editingId = null;
		code = '';
		description = '';
		discount_type = 'percentage';
		discount_value = '';
		max_uses = '';
		is_active = true;
		start_date = '';
		end_date = '';
	}

	async function handleSubmit() {
		error = '';

		const result = couponSchema.safeParse({
			code,
			description,
			discount_type,
			discount_value,
			max_uses: max_uses ? Number(max_uses) : null,
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
			if (editingId) {
				await couponService.update(editingId, result.data);
			} else {
				await couponService.create(result.data);
			}
			cancelEdit();
			await loadCoupons();
		} catch (e) {
			error = 'Error al guardar el cupón. Verificá que el código no esté repetido.';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('¿Eliminar este cupón?')) return;
		try {
			await couponService.delete(id);
			await loadCoupons();
		} catch (e) {
			error = 'Error al eliminar el cupón';
		}
	}

	onMount(loadCoupons);
</script>

<div class="max-w-3xl">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/publicidades" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Cupones</h1>
	</div>

	<div class="mb-8 rounded-lg border border-slate-200 p-4">
		<h2 class="mb-4 text-sm font-medium text-slate-700">
			{editingId ? 'Editar cupón' : 'Nuevo cupón'}
		</h2>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="flex flex-col gap-3"
		>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="block text-sm font-medium text-slate-700">Código</label>
					<input
						type="text"
						bind:value={code}
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
			</div>

			<div class="grid grid-cols-3 gap-3">
				<div>
					<label class="block text-sm font-medium text-slate-700">Tipo</label>
					<select
						bind:value={discount_type}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="percentage">Porcentaje</option>
						<option value="fixed">Monto fijo</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-700">Valor</label>
					<input
						type="text"
						bind:value={discount_value}
						placeholder={discount_type === 'percentage' ? '10' : '500.00'}
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-700">Usos máximos</label>
					<input
						type="number"
						bind:value={max_uses}
						min="1"
						placeholder="Sin límite"
						class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
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

			<label class="flex items-center gap-2 text-sm text-slate-700">
				<input type="checkbox" bind:checked={is_active} class="rounded" />
				Activo
			</label>

			{#if error}
				<p class="text-sm text-red-600">{error}</p>
			{/if}

			<div class="flex gap-2">
				<button
					type="submit"
					disabled={isSubmitting}
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{isSubmitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear cupón'}
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
	{:else if coupons.length === 0}
		<p class="text-slate-500">No hay cupones creados.</p>
	{:else}
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-600">
					<th class="pb-2 pr-4">Código</th>
					<th class="pb-2 pr-4">Descuento</th>
					<th class="pb-2 pr-4">Usos</th>
					<th class="pb-2 pr-4">Estado</th>
					<th class="pb-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each coupons as coupon (coupon.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50">
						<td class="py-3 pr-4 font-mono font-medium text-slate-900">{coupon.code}</td>
						<td class="py-3 pr-4 text-slate-600">
							{coupon.discount_type === 'percentage'
								? `${coupon.discount_value}%`
								: `$${coupon.discount_value}`}
						</td>
						<td class="py-3 pr-4 text-slate-600">
							{coupon.times_used} / {coupon.max_uses ?? '∞'}
						</td>
						<td class="py-3 pr-4">
							{#if coupon.is_currently_valid}
								<span
									class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
									>Vigente</span
								>
							{:else}
								<span
									class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
									>No vigente</span
								>
							{/if}
						</td>
						<td class="py-3 flex gap-2">
							<button onclick={() => startEdit(coupon)} class="text-blue-600 hover:underline"
								>Editar</button
							>
							<button onclick={() => handleDelete(coupon.id)} class="text-red-600 hover:underline"
								>Eliminar</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
