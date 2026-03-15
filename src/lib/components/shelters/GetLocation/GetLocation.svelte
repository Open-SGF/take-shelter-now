<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { AddressInput } from '$lib/components/shelters/AddressInput';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';
	import type { GeoPoint } from '$lib/geo';

	const locationState = getLocationStateContext();

	let isGeolocationSupported = $state(false);

	onMount(() => {
		isGeolocationSupported = 'geolocation' in navigator;
	});

	function handleGeolocationClick() {
		if (!navigator.geolocation) {
			locationState.setError('Geolocation is not supported by your browser.');
			return;
		}

		locationState.setLoading('geolocation');

		navigator.geolocation.getCurrentPosition(
			(position) => {
				locationState.setReady(
					{
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					},
					'geolocation',
				);
			},
			(error) => {
				const messages: Record<number, string> = {
					[GeolocationPositionError.PERMISSION_DENIED]:
						'Location permission denied. Please enter your address manually.',
					[GeolocationPositionError.POSITION_UNAVAILABLE]:
						'Unable to determine your location. Please enter your address.',
					[GeolocationPositionError.TIMEOUT]:
						'Location request timed out. Please try again or enter your address.',
				};

				const code =
					error.code === GeolocationPositionError.PERMISSION_DENIED
						? 'permission_denied'
						: error.code === GeolocationPositionError.POSITION_UNAVAILABLE
							? 'position_unavailable'
							: 'timeout';

				locationState.setError(messages[error.code] ?? 'Unable to get location.', code);
			},
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	}

	function handleAddressSelect(location: GeoPoint, address: string) {
		locationState.setPendingLocation({
			location,
			address,
			method: 'address',
		});
	}

	function handleConfirmLocation() {
		locationState.confirmPendingLocation();
	}

	function handleCancel() {
		locationState.setPendingLocation(null);
		locationState.setIdle();
	}

	function handleRetry() {
		locationState.setIdle();
	}
</script>

<div class="space-y-4">
	{#if locationState.status.kind === 'loading'}
		<div class="flex flex-col items-center justify-center py-8">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"
			></div>
			<p class="mt-4 text-sm text-slate-600">
				{locationState.status.method === 'geolocation'
					? 'Getting your location...'
					: 'Looking up address...'}
			</p>
		</div>
	{:else if locationState.status.kind === 'error'}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4">
			<p class="text-sm font-medium text-red-800">{locationState.status.message}</p>
			<div class="mt-3 flex gap-2">
				<Button variant="outline" size="sm" onclick={handleRetry}>Try Again</Button>
			</div>
		</div>
	{:else if locationState.pendingLocation}
		<div class="space-y-4">
			<div class="rounded-lg bg-slate-50 p-3">
				<p class="text-sm font-medium text-slate-800">
					{locationState.pendingLocation.address ?? 'Selected location'}
				</p>
				<p class="mt-1 text-xs text-slate-500">
					{locationState.pendingLocation.location.latitude.toFixed(6)}, {locationState.pendingLocation.location.longitude.toFixed(
						6,
					)}
				</p>
			</div>

			<p class="text-sm text-slate-600">
				Drag the map to position the pin at your location, then confirm.
			</p>

			<div class="flex gap-3">
				<Button variant="outline" class="flex-1" onclick={handleCancel}>Cancel</Button>
				<Button class="flex-1 bg-[#0892d2] hover:bg-[#0892d2]/90" onclick={handleConfirmLocation}>
					Confirm Location
				</Button>
			</div>
		</div>
	{:else}
		<div class="space-y-4">
			{#if isGeolocationSupported}
				<Button
					onclick={handleGeolocationClick}
					class="flex h-[58px] w-full items-center justify-center rounded-lg bg-[#0892d2] text-white"
				>
					<img
						src="https://res.cloudinary.com/du9tnv8ss/image/upload/v1756782708/navigation_bgtfde.png"
						alt=""
						class="mr-2 h-6 w-6"
					/>
					Use Current Location
				</Button>
			{/if}

			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-slate-200"></div>
				</div>
				<div class="relative flex justify-center">
					<span class="bg-white px-2 text-sm text-slate-500">or</span>
				</div>
			</div>

			<AddressInput onLocationSelect={handleAddressSelect} />
		</div>
	{/if}
</div>
