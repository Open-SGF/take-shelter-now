<script lang="ts">
	import { Header } from '$lib/components/ui/Header';
	import { Sheet } from '$lib/components/ui/Sheet';
	import { Sidebar } from '$lib/components/ui/Sidebar';
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { WeatherAlerts } from '$lib/components/ui/WeatherAlerts';
	import { ToastContainer } from '$lib/components/ui/ToastContainer';
	import { hasLocation, userLocation, shelters, selectedShelter } from '$lib/stores/global';

	import L from 'leaflet';

	import { onMount, onDestroy } from 'svelte';

	const SIDEBAR_WIDTH = 400;

	let mapElement: HTMLDivElement | undefined;
	let map: L.Map;
	let userMarker: L.Marker | undefined;
	let shelterMarkers: L.Marker[] = [];
	let radarLayer: L.TileLayer | undefined;
	let radarRefreshInterval: ReturnType<typeof setInterval>;
	let isLocating = $state(true);
	let showRadar = $state(false);

	async function loadRadarOverlay() {
		try {
			const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
			const data = await response.json();
			const frames = data.radar.past;
			if (frames.length === 0) return;

			const latestFrame = frames[frames.length - 1];
			const tileUrl = data.host + latestFrame.path + '/256/{z}/{x}/{y}/2/1_1.png';

			if (radarLayer) {
				radarLayer.remove();
			}

			radarLayer = L.tileLayer(tileUrl, {
				tileSize: 256,
				opacity: 0.3,
				maxNativeZoom: 7,
				maxZoom: 30,
				zIndex: 10,
				attribution: '<a href="https://www.rainviewer.com" target="_blank">RainViewer</a>',
			}).addTo(map);
		} catch (error) {
			console.error('Error loading radar overlay:', error);
		}
	}

	function toggleRadar() {
		showRadar = !showRadar;
		if (showRadar) {
			loadRadarOverlay();
		} else if (radarLayer) {
			radarLayer.remove();
			radarLayer = undefined;
		}
	}

	onMount(() => {
map = L.map(mapElement!, {
			center: [37.208957, -93.292299],
			zoom: 13,
			preferCanvas: true,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 30,
			referrerPolicy: 'no-referrer',
			detectRetina: true,
			crossOrigin: false,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);

		// Radar overlay is off by default; refresh interval starts only when enabled
		radarRefreshInterval = setInterval(() => {
			if (showRadar) loadRadarOverlay();
		}, 5 * 60 * 1000);

		// Automatically request location on page load
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					userLocation.set({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
					hasLocation.set(true);
					isLocating = false;
				},
				(error) => {
					console.error('Error getting location:', error);
					isLocating = false;
				},
			);
		} else {
			isLocating = false;
		}
	});

	onDestroy(() => {
		clearInterval(radarRefreshInterval);
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

	// Subscribe to selected shelter and fly to it
	selectedShelter.subscribe((selected) => {
		if (map && selected) {
			map.flyTo([selected.lat, selected.lng], 17);

			// Open the popup for the matching shelter marker
			const marker = shelterMarkers.find((m) => {
				const pos = m.getLatLng();
				return pos.lat === selected.lat && pos.lng === selected.lng;
			});
			if (marker) {
				marker.openPopup();
			}

			// Reset so clicking the same shelter again still works
			selectedShelter.set(null);
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
				const lat = shelter.latitude;
				const lng = shelter.longitude;

				bounds.extend([lat, lng]);

				const isSPS = shelter.category === 'SPS Tornado Safe Room';

				const icon = L.divIcon({
					className: '',
					html: `<div style="
						width:14px;height:14px;border-radius:50%;
						background:${isSPS ? '#7c3aed' : '#0892d2'};
						border:2px solid ${isSPS ? '#5b21b6' : '#0670a8'};
						box-shadow:0 1px 4px rgba(0,0,0,0.35);
					"></div>`,
					iconSize: [14, 14],
					iconAnchor: [7, 7],
				});

				const marker = L.marker([lat, lng], { title: shelter.name, icon }).addTo(map);

				const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
				const doorNote = shelter.special_instructions
					? `<div style="margin-top:4px;font-size:11px;color:#555;">${shelter.special_instructions}</div>`
					: '';
				marker.bindPopup(`
					<strong>${shelter.name}</strong><br>
					${shelter.address_line1}<br>
					${doorNote}
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

<ToastContainer />

<div class="relative m-0 h-dvh bg-[#e2e0e1]">
	<div class="fixed top-0 z-[60] w-full">
		<Header />
	</div>

	<!-- Desktop Sidebar -->
	<Sidebar width={SIDEBAR_WIDTH}>
		<Sheet>
			<WeatherAlerts />
			{#if isLocating || !$hasLocation}
				<div class="mb-4">
					{#if isLocating}
						<div class="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3">
							<svg
								class="h-4 w-4 shrink-0 animate-spin text-[#0892d2]"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span class="text-sm text-[#0892d2]">Finding your location to sort by distance…</span>
						</div>
					{:else}
						<GetLocation />
					{/if}
				</div>
			{/if}
			<ShelterList />
		</Sheet>
	</Sidebar>

	<!-- Mobile Bottom Sheet -->
	<div class="fixed bottom-0 z-50 h-1/2 w-screen overflow-y-auto md:hidden">
		<Sheet>
			<WeatherAlerts />
			{#if isLocating || !$hasLocation}
				<div class="mb-4">
					{#if isLocating}
						<div class="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3">
							<svg
								class="h-4 w-4 shrink-0 animate-spin text-[#0892d2]"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span class="text-sm text-[#0892d2]">Finding your location to sort by distance…</span>
						</div>
					{:else}
						<GetLocation />
					{/if}
				</div>
			{/if}
			<ShelterList />
		</Sheet>
	</div>

	<!-- Radar toggle button -->
	<button
		onclick={toggleRadar}
		class="fixed bottom-[calc(50%+0.75rem)] left-2 z-[55] flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md transition-colors md:bottom-8 md:left-4
			{showRadar ? 'bg-[#0892d2] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}"
		title="{showRadar ? 'Hide' : 'Show'} radar overlay"
	>
		<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
		</svg>
		Radar
	</button>

	<!-- Map container: adjusts width on desktop to accommodate sidebar -->
	<div
		class="isolate z-0 h-dvh md:mr-[var(--sidebar-width)]"
		style="--sidebar-width: {SIDEBAR_WIDTH}px;"
		bind:this={mapElement}
	></div>
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

	/* Loading bar animation */
	.loading-bar {
		width: 30%;
		animation: loading 1.5s ease-in-out infinite;
	}

	@keyframes loading {
		0% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(250%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
</style>
