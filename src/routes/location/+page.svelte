<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { GetLocation } from '$lib/components/shelters';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';

	const locationState = getLocationStateContext();

	$effect(() => {
		if (locationState.hasLocation) {
			goto(resolve('/'), { replaceState: true });
		}
	});
</script>

<div class="p-4 pt-6">
	<GetLocation />
</div>
