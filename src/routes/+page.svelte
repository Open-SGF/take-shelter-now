<script lang="ts">
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import WeatherAlerts from '$lib/components/ui/WeatherAlerts/WeatherAlerts.svelte';
	import { getAppStateContext } from '$lib/state/app-state-context';

	const appState = getAppStateContext();
</script>

<div class="p-4 pt-6">
	<WeatherAlerts />

	{#if !appState.hasLocation}
		<GetLocation />
	{:else}
		<ShelterList />
	{/if}
</div>
