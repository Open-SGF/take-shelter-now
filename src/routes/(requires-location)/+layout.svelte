<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const locationState = getLocationStateContext();

	$effect(() => {
		if (!locationState.hasLocation) {
			goto(resolve('/location/'), { replaceState: true });
		}
	});
</script>

{#if locationState.hasLocation}
	{@render children()}
{/if}
