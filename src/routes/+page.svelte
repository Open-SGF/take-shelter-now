<script lang="ts">
	import { Header } from '$lib/components/ui/Header';
	import { Sheet } from '$lib/components/ui/Sheet';
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { hasLocation, userLocation } from '$lib/stores/global';

	import L from 'leaflet';

	import { onMount } from 'svelte';

	let mapElement: HTMLDivElement | undefined;
	let map: L.Map;
	let userMarker: L.Marker | undefined;

	onMount(() => {
		map = L.map(mapElement!, {
			center: [37.208957, -93.292299],
			zoom: 13,
			preferCanvas: true,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 30,
			minZoom: 13,
			referrerPolicy: 'no-referrer',
			detectRetina: true,
			crossOrigin: false,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);
	});

	// Subscribe to user location and add/update marker
	userLocation.subscribe((location) => {
		if (map && location) {
			// Remove old marker if it exists
			if (userMarker) {
				userMarker.remove();
			}

			// Create custom HTML marker with pulsing ring effect
			const markerHtml = `
				<div class="user-location-marker">
					<div class="ping-ring"></div>
					<div class="ping-ring" style="animation-delay: 1s;"></div>
					<div class="user-dot"></div>
				</div>
			`;

			const customIcon = L.divIcon({
				html: markerHtml,
				className: 'user-location-icon',
				iconSize: [60, 60],
				iconAnchor: [30, 30]
			});

			// Add marker with custom icon
			userMarker = L.marker([location.latitude, location.longitude], {
				icon: customIcon
			}).addTo(map);

			// Center map on user's location
			map.setView([location.latitude, location.longitude], 13);
		}
	});
</script>

<style>
	/* Remove default Leaflet marker styles */

	/* Container for the marker */
	:global(.user-location-marker) {
		position: relative;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* The center blue dot */
	:global(.user-dot) {
		position: absolute;
		width: 16px;
		height: 16px;
		background-color: #4285F4;
		border: 3px solid #ffffff;
		border-radius: 50%;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		z-index: 2;
	}

	/* The pulsing ring effect */
	:global(.ping-ring) {
		position: absolute;
		width: 16px;
		height: 16px;
		border: 3px solid #4285F4;
		border-radius: 50%;
		animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
		z-index: 1;
	}

	@keyframes ping {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		75%, 100% {
			transform: scale(3);
			opacity: 0;
		}
	}
</style>

<div class="relative m-0 h-dvh bg-[#e2e0e1]">
	<div class="fixed top-0 z-60"><Header /></div>
	<div
		class="fixed right-0 top-0 z-60 h-dvh w-[400px] overflow-y-auto max-md:bottom-0 max-md:top-auto max-md:h-1/2 max-md:w-screen md:right-0"
	>
		<Sheet>
			{#if !$hasLocation}
				<GetLocation />
			{:else}
				<ShelterList />
			{/if}
		</Sheet>
	</div>
	<div class="z-1 h-dvh" bind:this={mapElement}></div>
</div>
