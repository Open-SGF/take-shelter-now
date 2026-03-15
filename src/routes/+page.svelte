<script lang="ts">
	import { GetLocation, ShelterList } from '$lib/components/shelters';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';

	const locationState = getLocationStateContext();
</script>

<div class="p-4 pt-6">
	{#if !locationState.hasLocation}
		<GetLocation />
	{:else}
		<ShelterList />
	{/if}
</div>
