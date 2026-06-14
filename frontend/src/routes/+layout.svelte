<script lang="ts">
	import { onMount } from 'svelte';
	import { restoreSession } from '$lib/stores/auth';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		restoreSession();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
