<script lang="ts">
	import NavigationIcon from '@lucide/svelte/icons/navigation';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '$lib/components/ui/button';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { getUserStateContext } from '$lib/state/user-state.svelte';
	import type { DirectionsApp } from '$lib/state/user-state.svelte';
	import { formatShelterAddress } from '$lib/shelters/presentation';
	import { isValidPoint } from '$lib/geo';
	import type { Shelter } from '$lib/shelters/types';
	import { toast } from 'svelte-sonner';

	type DirectionsActionProps = {
		shelter: Shelter;
	};

	const LONG_PRESS_DURATION = 500;

	let { shelter }: DirectionsActionProps = $props();
	const userState = getUserStateContext();

	let dialogOpen = $state(false);
	let rememberChoice = $state(true);
	let copiedAddress = $state(false);
	let longPressTimer = $state<number | null>(null);
	let isLongPress = $state(false);

	const fullAddress = $derived(formatShelterAddress(shelter));
	const hasAddress = $derived(
		shelter.addressLine1 !== '' ||
			shelter.city !== '' ||
			shelter.state !== '' ||
			shelter.zip !== '',
	);
	const hasCoordinates = $derived(
		isValidPoint({ latitude: shelter.latitude, longitude: shelter.longitude }),
	);
	const hasValidDestination = $derived(hasAddress || hasCoordinates);

	function getAppleMapsUrl(): string | null {
		if (hasCoordinates) {
			return `https://maps.apple.com/?daddr=${shelter.latitude},${shelter.longitude}&dirflg=d`;
		}
		if (hasAddress) {
			return `https://maps.apple.com/?daddr=${encodeURIComponent(fullAddress)}&dirflg=d`;
		}
		return null;
	}

	function getGoogleMapsUrl(): string | null {
		if (hasCoordinates) {
			return `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`;
		}
		if (hasAddress) {
			return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
		}
		return null;
	}

	function launchApp(app: DirectionsApp): void {
		const url = app === 'apple' ? getAppleMapsUrl() : getGoogleMapsUrl();
		if (url) {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	}

	function handleProviderSelect(app: DirectionsApp): void {
		if (rememberChoice) {
			userState.setDirectionsApp(app);
		} else {
			userState.setDirectionsApp(undefined);
		}
		launchApp(app);
		dialogOpen = false;
	}

	function handleDirectionsClick(): void {
		if (isLongPress) {
			isLongPress = false;
			return;
		}

		const saved = userState.directionsApp;
		if (saved) {
			launchApp(saved);
		} else {
			dialogOpen = true;
		}
	}

	function handlePointerDown(): void {
		isLongPress = false;
		longPressTimer = window.setTimeout(() => {
			isLongPress = true;
			dialogOpen = true;
		}, LONG_PRESS_DURATION);
	}

	function handlePointerUp(): void {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	function handlePointerLeave(): void {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	async function handleCopyAddress(): Promise<void> {
		if (!hasAddress) {
			return;
		}

		try {
			await navigator.clipboard.writeText(fullAddress);
			copiedAddress = true;
			toast.success('Address copied to clipboard');
			setTimeout(() => {
				copiedAddress = false;
			}, 2000);
		} catch {
			// Clipboard not available
		}
	}

	$effect(() => {
		return () => {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
			}
		};
	});
</script>

<div class="mt-4 flex flex-wrap gap-2" data-testid="shelter-detail-actions">
	<Button
		variant="default"
		size="sm"
		class="gap-2 bg-rose-600 hover:bg-rose-700"
		disabled={!hasValidDestination}
		onclick={handleDirectionsClick}
		onpointerdown={handlePointerDown}
		onpointerup={handlePointerUp}
		onpointerleave={handlePointerLeave}
		data-testid="get-directions-button"
	>
		<NavigationIcon class="size-4" aria-hidden="true" />
		Get Directions
	</Button>

	<Button
		variant="outline"
		size="sm"
		class="gap-2"
		disabled={!hasAddress}
		onclick={handleCopyAddress}
		data-testid="copy-address-button"
	>
		{#if copiedAddress}
			<CheckIcon class="size-4 text-emerald-600" aria-hidden="true" />
		{:else}
			<CopyIcon class="size-4" aria-hidden="true" />
		{/if}
		Copy Address
	</Button>
</div>

<Dialog bind:open={dialogOpen}>
	<DialogContent class="sm:max-w-sm" data-testid="directions-dialog">
		<div class="space-y-4">
			<div>
				<h2 class="text-lg font-semibold">Get Directions</h2>
				<p class="text-muted-foreground text-sm">Choose your preferred map provider</p>
			</div>

			<div class="space-y-2">
				<button
					type="button"
					class="border-border hover:bg-muted flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
					onclick={() => handleProviderSelect('apple')}
					data-testid="apple-maps-option"
				>
					<img src="/icons/apple-maps.svg" alt="" class="size-10" />
					<div>
						<p class="font-medium">Apple Maps</p>
						<p class="text-muted-foreground text-xs">Open in Apple Maps</p>
					</div>
				</button>

				<button
					type="button"
					class="border-border hover:bg-muted flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
					onclick={() => handleProviderSelect('google')}
					data-testid="google-maps-option"
				>
					<img src="/icons/google-maps.svg" alt="" class="size-10" />
					<div>
						<p class="font-medium">Google Maps</p>
						<p class="text-muted-foreground text-xs">Open in Google Maps</p>
					</div>
				</button>
			</div>

			<label class="flex items-center gap-2 text-sm">
				<Checkbox bind:checked={rememberChoice} data-testid="remember-choice-checkbox" />
				<span>Remember my choice</span>
			</label>

			{#if userState.directionsApp}
				<p class="text-muted-foreground text-xs">
					Long-press "Get Directions" to change your saved preference.
				</p>
			{/if}
		</div>
	</DialogContent>
</Dialog>
