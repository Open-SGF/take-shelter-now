<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { MapController } from './map-controller.svelte.js';
	import { DEFAULT_MAP_CENTER } from './constants.js';
	import type { MapMarker, MapProps } from './types';

	let {
		viewport = {},
		markers = {},
		centerPin = {},
		currentLocation = null,
		onViewportChange = {},
		class: className,
	}: MapProps = $props();

	let mapElement: HTMLDivElement | null = $state(null);
	let controller = new MapController();

	$effect(() => {
		if (mapElement) {
			void controller.initialize(mapElement, {
				defaultCenter: DEFAULT_MAP_CENTER,
				...viewport,
			});
		}
		return () => controller.dispose();
	});

	$effect(() => {
		if (controller.isReady && centerPin.enabled) {
			controller.setupMoveHandler(centerPin.onCenterChange);
		}
	});

	$effect(() => {
		if (controller.isReady) {
			controller.renderMarkers(markers.items ?? [], markers.onTap, onViewportChange);
		}
	});

	$effect(() => {
		if (controller.isReady) {
			controller.updateCurrentLocation(currentLocation);
		}
	});

	$effect(() => {
		if (controller.isReady && markers.items) {
			const selected = markers.items.find((m: MapMarker) => m.isSelected === true);
			controller.handleSelectionChange(selected, onViewportChange);
		}
	});

	$effect(() => {
		if (controller.isReady && centerPin.enabled && centerPin.location) {
			controller.enterCenterPinMode(centerPin.location);
		}
	});
</script>

<div class="relative h-full w-full">
	<div
		data-testid="map"
		class={cn('h-full w-full', className)}
		bind:this={mapElement}
		style:view-transition-name="none"
	></div>

	{#if centerPin.enabled}
		<div
			data-testid="center-pin"
			class="z-map pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
			aria-hidden="true"
		>
			<img src="/icons/map-pin.svg" alt="" class="block h-12 w-12 drop-shadow-lg" />
			<div
				class="absolute -bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 rounded-full bg-black/30 blur-sm"
			></div>
		</div>
	{/if}
</div>
