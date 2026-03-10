<script lang="ts">
	import '../app.css';
	import { AppShell } from '$lib/components/layout';
	import type { GeoPoint } from '$lib/geo';
	import type { Snippet } from 'svelte';
	import { Map, type MapMarker } from '$lib/components/ui/Map';
	import { createAppState } from '$lib/state/app-state.svelte';
	import { setAppStateContext } from '$lib/state/app-state-context';
	import type { Shelter } from '$lib/shelters/types';

	let { data, children }: { data: { shelters: Shelter[] }; children: Snippet } = $props();

	const appState = createAppState([]);
	setAppStateContext(appState);

	$effect(() => {
		appState.setShelters(data.shelters);
	});

	const defaultCenter: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	let markers: MapMarker[] = $derived(
		data.shelters.map((shelter) => ({
			id: shelter.slug,
			label: shelter.name,
			latitude: shelter.latitude,
			longitude: shelter.longitude,
		})),
	);
</script>

<AppShell>
	{#snippet map()}
		<Map
			class="h-full w-full"
			{markers}
			currentLocation={appState.location}
			{defaultCenter}
			defaultZoom={13}
		/>
	{/snippet}

	{@render children()}
</AppShell>
