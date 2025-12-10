<script lang="ts">
	import { Header } from '$lib/components/ui/Header';
	import { Sheet } from '$lib/components/ui/Sheet';
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { hasLocation, userLocation } from '$lib/stores/global';

	import L from 'leaflet';
	import 'leaflet-routing-machine';
	import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

	import { onMount } from 'svelte';

	interface Shelter {
		Name: string;
		'Address Line 1': string;
		'Address Line 2': string;
		City: string;
		State: string;
		Zip: string;
		Latitude: string;
		Longitude: string;
	}

	let mapElement: HTMLDivElement | undefined;
	let map: L.Map;
	let userMarker: L.Marker | undefined;
	let shelterMarkers: L.Marker[] = [];
	let routingControl: L.Routing.Control | undefined;

	onMount(async () => {
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

		// Load and display shelters
		await loadShelters();
	});

	function createRoute(destination: L.LatLng) {
		const currentLocation = $userLocation;

		if (!currentLocation) {
			console.error('User location not available');
			return;
		}

		// Remove existing route if any
		if (routingControl) {
			map.removeControl(routingControl);
		}

		// Create new route
		routingControl = L.Routing.control({
			waypoints: [
				L.latLng(currentLocation.latitude, currentLocation.longitude),
				destination
			],
			routeWhileDragging: false,
			addWaypoints: false,
			draggableWaypoints: false,
			fitSelectedRoutes: false, // Don't auto-zoom to fit route
			showAlternatives: false,
			lineOptions: {
				styles: [{ color: '#4285f4', opacity: 0.8, weight: 6 }],
				extendToWaypoints: true,
				missingRouteTolerance: 0
			},
			show: false, // Hide the instructions panel
			createMarker: () => null // Don't create default markers
		}).addTo(map);
	}

	async function loadShelters() {
		try {
			const response = await fetch('/shelters.json');
			const shelters: Shelter[] = await response.json();

			// Create shelter icon
			const shelterIcon = L.divIcon({
				html: '<div class="shelter-marker"></div>',
				className: 'shelter-icon',
				iconSize: [24, 24],
				iconAnchor: [12, 12],
			});

			// Add markers for each shelter
			shelters.forEach((shelter) => {
				const lat = parseFloat(shelter.Latitude);
				const lon = parseFloat(shelter.Longitude);

				if (!isNaN(lat) && !isNaN(lon)) {
					const marker = L.marker([lat, lon], {
						icon: shelterIcon,
					}).addTo(map);

					// Add popup with shelter info
					const address = `${shelter['Address Line 1']}${shelter['Address Line 2'] ? ', ' + shelter['Address Line 2'] : ''}, ${shelter.City}, ${shelter.State} ${shelter.Zip}`;
					marker.bindPopup(`<strong>${shelter.Name}</strong><br>${address}`);

					// Add click handler to create route
					marker.on('click', () => {
						createRoute(L.latLng(lat, lon));
					});

					shelterMarkers.push(marker);
				}
			});
		} catch (error) {
			console.error('Error loading shelters:', error);
		}
	}

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

			// Center map on user's location
			map.setView([location.latitude, location.longitude], 13);
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
	<div class="z-1 h-[calc(100dvh-72px)] md:mr-[400px] mt-[72px]" bind:this={mapElement}></div>
</div>

<style>
	/* Remove default Leaflet marker styles */

	/* Container for the user location marker */
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

	/* Shelter marker styling */
	:global(.shelter-marker) {
		width: 24px;
		height: 24px;
		background-color: #c91c1c;
		border: 3px solid #ffffff;
		border-radius: 50%;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
		cursor: pointer;
	}

	:global(.shelter-marker:hover) {
		transform: scale(1.2);
		transition: transform 0.2s ease;
	}

	/* Hide the routing instructions container */
	:global(.leaflet-routing-container) {
		display: none;
	}

	/* Customize routing line appearance */
	:global(.leaflet-routing-container-hide) {
		display: none;
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
</style>
