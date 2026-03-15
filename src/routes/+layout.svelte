<script lang="ts">
	import '../app.css';
	import { goto, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { AppShell } from '$lib/components/layout';
	import type { GeoPoint } from '$lib/geo';
	import type { Snippet } from 'svelte';
	import { Map, type MapMarker } from '$lib/components/layout';
	import { createUserState, setUserStateContext } from '$lib/state/user-state.svelte';
	import { createLocationState, setLocationStateContext } from '$lib/state/location-state.svelte';
	import { createShelterState, setShelterStateContext } from '$lib/state/shelter-state.svelte';
	import type { Shelter } from '$lib/shelters/types';

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
		const controller = new AbortController();

		shelterState.setLoading();

		fetch('/shelters.json', { signal: controller.signal })
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to fetch shelters: ${response.status}`);
				}
				return response.json();
			})
			.then((shelters: Shelter[]) => {
				shelterState.setShelters(shelters);
			})
			.catch((error) => {
				if (error.name !== 'AbortError') {
					shelterState.setError(error.message);
				}
			});

		return () => controller.abort();
	});

	const defaultCenter: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	let selectedShelterSlug = $derived(page.params.slug);

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
		goto(resolve('/shelters/[slug]', { slug: marker.id }));
	}

	function handleCenterChange(location: GeoPoint) {
		if (locationState.pendingLocation) {
			locationState.setPendingLocation({
				...locationState.pendingLocation,
				location,
			});
		}
	}
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- Version is a build-time constant, not user input -->
{@html `<!-- Version: ${__APP_VERSION__} -->`}

<AppShell>
	{#snippet map()}
		<Map
			class="h-full w-full"
			viewport={{ defaultCenter, defaultZoom: 13 }}
			markers={{ items: markers, onTap: handleMarkerTap }}
			currentLocation={locationState.location}
			centerPin={{
				enabled: !!locationState.pendingLocation,
				location: centerPinLocation ?? undefined,
				onCenterChange: handleCenterChange,
			}}
		/>
	{/snippet}

	{@render children()}
</AppShell>
