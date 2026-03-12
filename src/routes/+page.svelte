<script lang="ts">
	import { GetLocation, ShelterList } from '$lib/components/shelters';
	import { getAppStateContext } from '$lib/state/app-state-context';

	const appState = getAppStateContext();
</script>

<div class="p-4 pt-6">
	{#if !appState.hasLocation}
		<GetLocation />
	{:else}
		<ShelterList />
	{/if}
</div>
