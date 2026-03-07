<script lang="ts">
	import '../app.css';
	import { AppShell } from '$lib/components/layout';
	import type { GeoPoint } from '$lib/geo';
	import { Map, type MapMarker } from '$lib/components/ui/Map';
	import { userLocation } from '$lib/stores/global';

	let { children } = $props();

	const defaultCenter: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	const markers: MapMarker[] = [
		{
			id: 'springfield-center',
			label: 'Springfield, MO',
			latitude: 37.208957,
			longitude: -93.292299,
		},
	];
</script>

<AppShell>
	{#snippet map()}
		<Map
			class="h-full w-full"
			{markers}
			currentLocation={$userLocation}
			{defaultCenter}
			defaultZoom={13}
		/>
	{/snippet}

	{@render children()}
</AppShell>
