<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { config } from '$lib/config';
	import { AppShell } from '$lib/components/layout';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { GeoPoint } from '$lib/geo';
	import type { Snippet } from 'svelte';
	import { Map, type MapMarker } from '$lib/components/layout';
	import { createUserState, setUserStateContext } from '$lib/state/user-state.svelte';
	import { createLocationState, setLocationStateContext } from '$lib/state/location-state.svelte';
	import { createShelterState, setShelterStateContext } from '$lib/state/shelter-state.svelte';
	import { navigateToShelterDetail } from '$lib/shelters/navigation';
	import { ModeWatcher, mode } from 'mode-watcher';
	import type { MapTheme } from '$lib/components/layout/Map/types';

	let { children }: { children: Snippet } = $props();

	onNavigate(() => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((resolve) => {
			document.startViewTransition(() => {
				resolve();
			});
		});
	});

	const userState = createUserState();
	const locationState = createLocationState();
	const shelterState = createShelterState(() => locationState.location);

	setUserStateContext(userState);
	setLocationStateContext(locationState);
	setShelterStateContext(shelterState);

	$effect(() => {
		shelterState.loadShelters();
	});

	const defaultCenter: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	let selectedShelterSlug = $derived(page.params.slug);
	let mapTheme = $derived<MapTheme>(mode.current === 'dark' ? 'dark' : 'light');

	let markers: MapMarker[] = $derived.by(() => {
		if (!locationState.hasLocation) {
			return [];
		}

		if (locationState.pendingLocation) {
			return [];
		}

		return shelterState.sheltersWithDistance.map((shelter) => ({
			id: shelter.slug,
			label: shelter.name,
			latitude: shelter.latitude,
			longitude: shelter.longitude,
			isSelected: shelter.slug === selectedShelterSlug,
		}));
	});

	let centerPinLocation = $state<GeoPoint | null>(null);
	let hadPendingLocation = $state(false);

	$effect(() => {
		const hasPendingLocation = !!locationState.pendingLocation;

		if (hasPendingLocation && !hadPendingLocation) {
			centerPinLocation = locationState.pendingLocation!.location;
		}

		hadPendingLocation = hasPendingLocation;
	});

	function handleMarkerTap(marker: MapMarker) {
		navigateToShelterDetail(marker.id, shelterState.filters);
	}

	function handleCenterChange(location: GeoPoint) {
		if (locationState.pendingLocation) {
			locationState.setPendingLocation({
				...locationState.pendingLocation,
				location,
			});
		}
	}

	const robotsContent = config.allowIndexing ? undefined : 'noindex, nofollow';
</script>

<svelte:head>
	{#if robotsContent}
		<meta name="robots" content={robotsContent} />
	{/if}
</svelte:head>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- Version is a build-time constant, not user input -->
{@html `<!-- Version: ${__APP_VERSION__} -->`}

<ModeWatcher />

<AppShell>
	{#snippet map()}
		<Map
			class="h-full w-full"
			viewport={{ defaultCenter, defaultZoom: 13 }}
			markers={{ items: markers, onTap: handleMarkerTap }}
			currentLocation={locationState.location}
			theme={mapTheme}
			centerPin={{
				enabled: !!locationState.pendingLocation,
				location: centerPinLocation ?? undefined,
				onCenterChange: handleCenterChange,
			}}
			radarEnabled={userState.radarEnabled}
		/>
	{/snippet}

	{@render children()}
</AppShell>

<Toaster position="bottom-left" />
