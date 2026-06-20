<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { orderService } from '$lib/modules/orders/services/orders.service';
	import { productService } from '$lib/modules/inventory/services/inventory.service';
	import { orderSchema } from '$lib/modules/orders/schemas/order.schema';
	import type { Product } from '$lib/modules/inventory/types/inventory.types';

	let products = $state<Product[]>([]);
	let error = $state('');
	let isSubmitting = $state(false);

	let customer_name = $state('');
	let customer_email = $state('');
	let notes = $state('');
	let status = $state<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('pending');

	type LineItem = { product: number | null; quantity: number };
	let items = $state<LineItem[]>([{ product: null, quantity: 1 }]);

	const orderTotal = $derived(
		items.reduce((sum, item) => {
			const product = products.find((p) => p.id === item.product);
			if (!product) return sum;
			return sum + Number(product.price) * item.quantity;
		}, 0)
	);

	function addItem() {
		items = [...items, { product: null, quantity: 1 }];
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
	}

	onMount(async () => {
		products = await productService.getAll();
	});

	async function handleSubmit() {
		error = '';

		const result = orderSchema.safeParse({
			customer_name,
			customer_email,
			status,
			notes,
			items: items.filter((i) => i.product !== null)
		});

		if (!result.success) {
			error = result.error.issues[0].message;
			return;
		}

		isSubmitting = true;
		try {
			await orderService.create(result.data as any);
			goto('/dashboard/pedidos');
		} catch (e) {
			error = 'Error al crear el pedido. Verificá el stock disponible.';
		} finally {
			isSubmitting = false;
		}
	}

	function getProductStock(productId: number | null): number | null {
		if (productId === null) return null;
		const product = products.find((p) => p.id === productId);
		return product ? product.stock : null;
	}

	function isOverStock(item: LineItem): boolean {
		const stock = getProductStock(item.product);
		if (stock === null) return false;
		return item.quantity > stock;
	}

	const hasStockIssues = $derived(items.some(isOverStock));
</script>

<div class="max-w-2xl">
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/pedidos" class="text-slate-500 hover:text-slate-700">← Volver</a>
		<h1 class="text-2xl font-semibold text-slate-900">Nuevo pedido</h1>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="flex flex-col gap-4"
	>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-slate-700">Cliente</label>
				<input
					type="text"
					bind:value={customer_name}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-slate-700">Email</label>
				<input
					type="email"
					bind:value={customer_email}
					class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700">Estado</label>
			<select
				bind:value={status}
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="pending">Pendiente</option>
				<option value="processing">En proceso</option>
				<option value="shipped">Enviado</option>
				<option value="delivered">Entregado</option>
				<option value="cancelled">Cancelado</option>
			</select>
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700">Notas</label>
			<textarea
				bind:value={notes}
				rows="2"
				class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			></textarea>
		</div>

		<div class="rounded-lg border border-slate-200 p-4">
			<div class="mb-3 flex items-center justify-between">
				<h2 class="text-sm font-medium text-slate-700">Productos</h2>
				<button type="button" onclick={addItem} class="text-sm text-blue-600 hover:underline">
					+ Agregar producto
				</button>
			</div>

			<div class="flex flex-col gap-3">
				{#each items as item, index}
					<div>
						<div class="flex items-end gap-2">
							<div class="flex-1">
								<label class="block text-xs font-medium text-slate-600">Producto</label>
								<select
									bind:value={item.product}
									class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value={null}>Seleccionar...</option>
									{#each products as product}
										<option value={product.id}
											>{product.name} (stock: {product.stock}) - ${product.price}</option
										>
									{/each}
								</select>
							</div>
							<div class="w-24">
								<label class="block text-xs font-medium text-slate-600">Cantidad</label>
								<input
									type="number"
									min="1"
									bind:value={item.quantity}
									class="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 {isOverStock(
										item
									)
										? 'border-red-400 focus:ring-red-400'
										: 'border-slate-300 focus:ring-blue-500'}"
								/>
							</div>
							{#if items.length > 1}
								<button
									type="button"
									onclick={() => removeItem(index)}
									class="mb-0.5 rounded-md border border-slate-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
								>
									✕
								</button>
							{/if}
						</div>
						{#if isOverStock(item)}
							<p class="mt-1 text-xs text-red-600">
								Solo hay {getProductStock(item.product)} unidades disponibles
							</p>
						{/if}
					</div>
				{/each}
			</div>

			<div class="mt-4 border-t border-slate-200 pt-3 text-right">
				<p class="text-sm text-slate-500">Total estimado</p>
				<p class="text-xl font-semibold text-slate-900">${orderTotal.toFixed(2)}</p>
			</div>
		</div>

		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}

		<div class="flex gap-3">
			<button
				type="submit"
				disabled={isSubmitting || hasStockIssues}
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{isSubmitting ? 'Creando...' : 'Crear pedido'}
			</button>
			<a
				href="/dashboard/pedidos"
				class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				Cancelar
			</a>
		</div>
	</form>
</div>
