<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { AddressInput } from '$lib/components/shelters/AddressInput';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';
	import type { GeoPoint } from '$lib/geo';

	type GetLocationProps = {
		onLocationConfirmed?: () => void;
	};

	let { onLocationConfirmed }: GetLocationProps = $props();
	const locationState = getLocationStateContext();

	function handleGeolocationClick() {
		locationState.requestGeolocation(onLocationConfirmed);
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
		onLocationConfirmed?.();
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
				class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
			></div>
			<p class="text-text-tertiary mt-4 text-sm">
				{locationState.status.method === 'geolocation'
					? 'Getting your location...'
					: 'Looking up address...'}
			</p>
		</div>
	{:else if locationState.status.kind === 'error'}
		<div class="border-destructive/50 bg-destructive/10 rounded-lg border p-4">
			<p class="text-destructive text-sm font-medium">{locationState.status.message}</p>
			<div class="mt-3 flex gap-2">
				<Button variant="outline" size="sm" onclick={handleRetry}>Try Again</Button>
			</div>
		</div>
	{:else if locationState.pendingLocation}
		<div class="space-y-4">
			<div class="bg-surface-muted rounded-lg p-3">
				<p class="text-foreground text-sm font-medium">
					{locationState.pendingLocation.address ?? 'Selected location'}
				</p>
				<p class="text-muted-foreground mt-1 text-xs">
					{locationState.pendingLocation.location.latitude.toFixed(6)}, {locationState.pendingLocation.location.longitude.toFixed(
						6,
					)}
				</p>
			</div>

			<p class="text-text-tertiary text-sm">
				Drag the map to position the pin at your location, then confirm.
			</p>

			<div class="flex gap-3">
				<Button variant="outline" class="flex-1" onclick={handleCancel}>Cancel</Button>
				<Button class="flex-1" onclick={handleConfirmLocation}>Confirm Location</Button>
			</div>
		</div>
	{:else}
		<div class="space-y-4">
			{#if locationState.isGeolocationSupported}
				<Button onclick={handleGeolocationClick} size="lg" class="w-full">
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
					<div class="border-border w-full border-t"></div>
				</div>
				<div class="relative flex justify-center">
					<span class="bg-surface text-muted-foreground px-2 text-sm">or</span>
				</div>
			</div>

			<div class="border-border bg-surface-muted rounded-lg border p-4">
				<AddressInput onLocationSelect={handleAddressSelect} />
			</div>
		</div>
	{/if}
</div>
