<script lang="ts">
	import '../app.css';
	import { goto, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { AppShell } from '$lib/components/layout';
	import type { GeoPoint } from '$lib/geo';
	import type { Snippet } from 'svelte';
	import { Map, type MapMarker } from '$lib/components/layout';
	import { createAppState } from '$lib/state/app-state.svelte';
	import { setAppStateContext } from '$lib/state/app-state-context';
	import type { Shelter } from '$lib/shelters/types';

	let { children }: { children: Snippet } = $props();

	onNavigate(() => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(() => {
				resolve();
			});
		});
	});

	const appState = createAppState();
	setAppStateContext(appState);

	$effect(() => {
		const controller = new AbortController();

		appState.setShelterDataLoading();

		fetch('/shelters.json', { signal: controller.signal })
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to fetch shelters: ${response.status}`);
				}
				return response.json();
			})
			.then((shelters: Shelter[]) => {
				appState.setShelters(shelters);
			})
			.catch((error) => {
				if (error.name !== 'AbortError') {
					appState.setShelterDataError(error.message);
				}
			});

		return () => controller.abort();
	});

	const defaultCenter: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	let selectedShelterSlug = $derived(page.params.slug);

	let markers: MapMarker[] = $derived(
		appState.sheltersWithDistance.map((shelter) => ({
			id: shelter.slug,
			label: shelter.name,
			latitude: shelter.latitude,
			longitude: shelter.longitude,
			isSelected: shelter.slug === selectedShelterSlug,
		})),
	);

	function handleMarkerTap(marker: MapMarker) {
		goto(resolve('/shelters/[slug]', { slug: marker.id }));
	}
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- Version is a build-time constant, not user input -->
{@html `<!-- Version: ${__APP_VERSION__} -->`}

<AppShell>
	{#snippet map()}
		<Map
			class="h-full w-full"
			{markers}
			currentLocation={appState.location}
			{defaultCenter}
			defaultZoom={13}
			onMarkerTap={handleMarkerTap}
		/>
	{/snippet}

	{@render children()}
</AppShell>
