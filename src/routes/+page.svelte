<script lang="ts">
	import { Header } from '$lib/components/ui/Header';
	import { Sheet } from '$lib/components/ui/Sheet';
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { hasLocation, userLocation, shelters } from '$lib/stores/global';

	import L from 'leaflet';

	import { onMount } from 'svelte';

	let mapElement: HTMLDivElement | undefined;
	let map: L.Map;
	let userMarker: L.Marker | undefined;
	let shelterMarkers: L.Marker[] = [];

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
				iconAnchor: [30, 30],
			});

			// Add marker with custom icon
			userMarker = L.marker([location.latitude, location.longitude], {
				icon: customIcon,
			}).addTo(map);

			// Fit bounds will be handled by shelters subscription
		}
	});

	// Subscribe to shelters and add markers, then fit map bounds
	shelters.subscribe((shelterList) => {
		if (map && shelterList.length > 0) {
			// Remove old shelter markers
			shelterMarkers.forEach((marker) => marker.remove());
			shelterMarkers = [];

			// Create a bounds object
			const bounds = L.latLngBounds([]);

			// Add user location to bounds if available
			const location = $userLocation;
			if (location) {
				bounds.extend([location.latitude, location.longitude]);
			}

			// Add markers for each shelter and extend bounds
			shelterList.forEach((shelter) => {
				const lat = parseFloat(shelter.Latitude);
				const lng = parseFloat(shelter.Longitude);

				// Add to bounds
				bounds.extend([lat, lng]);

				// Create marker
				const marker = L.marker([lat, lng], {
					title: shelter.Name,
				}).addTo(map);

				// Add popup with shelter info and Google Maps link
				const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
				marker.bindPopup(`
					<strong>${shelter.Name}</strong><br>
					${shelter['Address Line 1']}<br>
					<a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="google-maps-link">
						Open in Google Maps
					</a>
				`);

				shelterMarkers.push(marker);
			});

			// Fit map to show all shelters (and user location if available)
			if (bounds.isValid()) {
				map.fitBounds(bounds, {
					padding: [50, 50], // Add some padding around the bounds
					maxZoom: 15, // Don't zoom in too close
				});
			}
		}
	});
</script>

<div class="relative m-0 h-dvh bg-[#e2e0e1]">
	<div class="fixed top-0 z-60"><Header /></div>
	<div
		class="fixed top-0 right-0 z-60 h-dvh w-[400px] overflow-y-auto max-md:top-auto max-md:bottom-0 max-md:h-1/2 max-md:w-screen md:right-0"
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
		background-color: #4285f4;
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
		border: 3px solid #4285f4;
		border-radius: 50%;
		animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
		z-index: 1;
	}

	@keyframes ping {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		75%,
		100% {
			transform: scale(3);
			opacity: 0;
		}
	}

	/* Google Maps link in popups */
	:global(.google-maps-link) {
		display: inline-block;
		margin-top: 8px;
		padding: 6px 12px;
		background-color: #4285f4;
		color: white !important;
		text-decoration: none;
		border-radius: 4px;
		font-size: 13px;
		font-weight: 500;
	}

	:global(.google-maps-link:hover) {
		background-color: #3367d6;
	}
</style>
