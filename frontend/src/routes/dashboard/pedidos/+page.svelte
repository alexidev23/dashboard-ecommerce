<script lang="ts">
	import { onMount } from 'svelte';
	import { orderService } from '$lib/modules/orders/services/orders.service';
	import type { Order } from '$lib/modules/orders/types/orders.types';

	let orders = $state<Order[]>([]);
	let isLoading = $state(true);
	let selectedStatus = $state('');
	let error = $state('');

	const statusLabels: Record<string, string> = {
		pending: 'Pendiente',
		processing: 'En proceso',
		shipped: 'Enviado',
		delivered: 'Entregado',
		cancelled: 'Cancelado'
	};

	const statusColors: Record<string, string> = {
		pending: 'bg-amber-100 text-amber-700',
		processing: 'bg-blue-100 text-blue-700',
		shipped: 'bg-indigo-100 text-indigo-700',
		delivered: 'bg-green-100 text-green-700',
		cancelled: 'bg-red-100 text-red-700'
	};

	async function loadOrders() {
		isLoading = true;
		error = '';
		try {
			orders = await orderService.getAll({ status: selectedStatus || undefined });
		} catch (e) {
			error = 'Error al cargar los pedidos';
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('¿Eliminar este pedido?')) return;
		try {
			await orderService.delete(id);
			await loadOrders();
		} catch (e) {
			error = 'Error al eliminar el pedido';
		}
	}

	onMount(loadOrders);
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-slate-900">Pedidos</h1>
		<a
			href="/dashboard/pedidos/nuevo"
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
		>
			+ Nuevo pedido
		</a>
	</div>

	<div class="mb-4">
		<select
			bind:value={selectedStatus}
			onchange={loadOrders}
			class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value="">Todos los estados</option>
			{#each Object.entries(statusLabels) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>

	{#if error}
		<p class="mb-4 text-sm text-red-600">{error}</p>
	{/if}

	{#if isLoading}
		<p class="text-slate-500">Cargando...</p>
	{:else if orders.length === 0}
		<p class="text-slate-500">No se encontraron pedidos.</p>
	{:else}
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-200 text-left text-slate-600">
					<th class="pb-2 pr-4">#</th>
					<th class="pb-2 pr-4">Cliente</th>
					<th class="pb-2 pr-4">Productos</th>
					<th class="pb-2 pr-4">Total</th>
					<th class="pb-2 pr-4">Estado</th>
					<th class="pb-2 pr-4">Fecha</th>
					<th class="pb-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each orders as order (order.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50">
						<td class="py-3 pr-4 text-slate-500">#{order.id}</td>
						<td class="py-3 pr-4">
							<p class="font-medium text-slate-900">{order.customer_name}</p>
							<p class="text-xs text-slate-500">{order.customer_email}</p>
						</td>
						<td class="py-3 pr-4 text-slate-600">{order.items.length} producto(s)</td>
						<td class="py-3 pr-4 font-medium text-slate-900">${order.total}</td>
						<td class="py-3 pr-4">
							<span
								class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[order.status]}"
							>
								{statusLabels[order.status]}
							</span>
						</td>
						<td class="py-3 pr-4 text-slate-500">
							{new Date(order.created_at).toLocaleDateString()}
						</td>
						<td class="py-3 flex gap-2">
							<a href="/dashboard/pedidos/{order.id}" class="text-blue-600 hover:underline">
								Editar
							</a>
							<button onclick={() => handleDelete(order.id)} class="text-red-600 hover:underline">
								Eliminar
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
