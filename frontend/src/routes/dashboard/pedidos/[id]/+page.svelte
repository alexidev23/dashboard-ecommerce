<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { orderService } from '$lib/modules/orders/services/orders.service';
	import type { Order } from '$lib/modules/orders/types/orders.types';

	let order = $state<Order | null>(null);
	let isLoading = $state(true);
	let error = $state('');
	let isSaving = $state(false);
	let saved = $state(false);

	let selectedStatus = $state<Order['status']>('pending');

	const orderId = Number($page.params.id);

	const statusLabels: Record<string, string> = {
		pending: 'Pendiente',
		processing: 'En proceso',
		shipped: 'Enviado',
		delivered: 'Entregado',
		cancelled: 'Cancelado'
	};

	async function loadOrder() {
		isLoading = true;
		try {
			order = await orderService.getById(orderId);
			selectedStatus = order.status;
		} catch (e) {
			error = 'Error al cargar el pedido';
		} finally {
			isLoading = false;
		}
	}

	const hasChanges = $derived(order !== null && selectedStatus !== order.status);

	async function handleSave() {
		if (!order) return;
		error = '';
		saved = false;
		isSaving = true;
		try {
			order = await orderService.update(orderId, { status: selectedStatus });
			saved = true;
		} catch (e) {
			error = 'Error al actualizar el estado';
		} finally {
			isSaving = false;
		}
	}

	onMount(loadOrder);
</script>

<div class="max-w-2xl">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/pedidos" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">
			Pedido {order ? `#${order.id}` : ''}
		</h1>
	</div>

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if error}
		<p class="text-sm text-red-600">{error}</p>
	{:else if order}
		<div class="rounded-lg border border-slate-200 p-5">
			<div class="mb-4 grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Cliente</p>
					<p class="font-medium text-slate-900">{order.customer_name}</p>
				</div>
				<div>
					<p class="text-sm text-slate-500">Email</p>
					<p class="font-medium text-slate-900">{order.customer_email}</p>
				</div>
			</div>

			<div class="mb-4">
				<p class="mb-1 text-sm text-slate-500">Estado</p>
				<div class="flex items-center gap-3">
					<select
						bind:value={selectedStatus}
						class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{#each Object.entries(statusLabels) as [value, label]}
							<option {value}>{label}</option>
						{/each}
					</select>

					{#if hasChanges}
						<button
							onclick={handleSave}
							disabled={isSaving}
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
						>
							{isSaving ? 'Guardando...' : 'Guardar cambios'}
						</button>
					{/if}

					{#if saved && !hasChanges}
						<span class="text-sm text-green-600">✓ Guardado</span>
					{/if}
				</div>
			</div>

			{#if order.notes}
				<div class="mb-4">
					<p class="text-sm text-slate-500">Notas</p>
					<p class="text-slate-700">{order.notes}</p>
				</div>
			{/if}

			<div class="border-t border-slate-200 pt-4">
				<h2 class="mb-3 text-sm font-medium text-slate-700">Productos</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="text-left text-slate-500">
							<th class="pb-2">Producto</th>
							<th class="pb-2 text-right">Cantidad</th>
							<th class="pb-2 text-right">Precio unit.</th>
							<th class="pb-2 text-right">Subtotal</th>
						</tr>
					</thead>
					<tbody>
						{#each order.items as item}
							<tr class="border-t border-slate-100">
								<td class="py-2">{item.product_name}</td>
								<td class="py-2 text-right">{item.quantity}</td>
								<td class="py-2 text-right">${item.unit_price}</td>
								<td class="py-2 text-right">${item.subtotal}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="mt-4 flex justify-end border-t border-slate-200 pt-3">
					<div class="text-right">
						<p class="text-sm text-slate-500">Total</p>
						<p class="text-xl font-semibold text-slate-900">${order.total}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
