<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import type { DivIcon, LayerGroup, Map as LeafletMap, Marker } from 'leaflet';
	import { isValidPoint, toLatLngTuple, type GeoPoint } from '$lib/geo';
	import { buildMarkerSignature, buildPointSignature, filterValidMarkers } from './markers';
	import { createRecenterPlan } from './viewport';
	import type { MapMarker } from './types';

	const DEFAULT_MAP_CENTER: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	type MapProps = {
		markers?: MapMarker[];
		currentLocation?: GeoPoint | null;
		defaultCenter?: GeoPoint;
		defaultZoom?: number;
		minZoom?: number;
		maxZoom?: number;
		onMarkerTap?: (marker: MapMarker) => void;
		class?: string;
	};

	let {
		markers = [],
		currentLocation = null,
		defaultCenter = DEFAULT_MAP_CENTER,
		defaultZoom = 13,
		minZoom = 3,
		maxZoom = 19,
		onMarkerTap,
		class: className,
	}: MapProps = $props();

	let mapElement: HTMLDivElement | null = null;
	let leaflet: typeof import('leaflet') | null = null;
	let map: LeafletMap | null = null;
	let markerLayer: LayerGroup | null = null;
	let currentLocationMarker: Marker | null = null;
	let lastMarkerSignature = '';
	let lastCurrentLocationSignature = '';
	let isReady = $state(false);

	let validMarkers = $derived(filterValidMarkers(markers));
	let markerSignature = $derived(buildMarkerSignature(validMarkers));
	let currentLocationSignature = $derived(buildPointSignature(currentLocation));

	const createMarkerIcon = (L: typeof import('leaflet')): DivIcon =>
		L.divIcon({
			className: 'tsn-map-marker-icon flex items-center justify-center bg-transparent border-0',
			html: '<span class="pointer-events-none inline-block h-[14px] w-[14px] rounded-full border-2 border-white bg-red-700 shadow-[0_2px_6px_rgba(0,0,0,0.35)]" aria-hidden="true"></span>',
			iconSize: [26, 26],
			iconAnchor: [13, 13],
		});

	const createCurrentLocationIcon = (L: typeof import('leaflet')): DivIcon =>
		L.divIcon({
			className:
				'tsn-current-location-icon relative flex items-center justify-center bg-transparent border-0',
			html: '<span class="pointer-events-none absolute inline-block h-[26px] w-[26px] rounded-full border-2 border-sky-600/65 animate-ping" aria-hidden="true"></span><span class="pointer-events-none absolute inline-block h-[14px] w-[14px] rounded-full border-2 border-white bg-sky-500 shadow-[0_2px_6px_rgba(0,0,0,0.35)]" aria-hidden="true"></span>',
			iconSize: [42, 42],
			iconAnchor: [21, 21],
		});

	const recenterMapToMarkers = () => {
		if (!map) return;

		const fallbackCenter = isValidPoint(defaultCenter) ? defaultCenter : DEFAULT_MAP_CENTER;
		const plan = createRecenterPlan(validMarkers, fallbackCenter, defaultZoom);

		if (plan.mode === 'bounds') {
			map.fitBounds(
				plan.bounds.map((marker) => toLatLngTuple(marker)),
				plan.options,
			);
			return;
		}

		map.setView(toLatLngTuple(plan.center), plan.zoom);
	};

	const renderMarkers = () => {
		if (!leaflet || !markerLayer) return;

		markerLayer.clearLayers();

		for (const marker of validMarkers) {
			const markerInstance = leaflet
				.marker(toLatLngTuple(marker), {
					icon: createMarkerIcon(leaflet),
					title: marker.label ?? marker.id,
				})
				.addTo(markerLayer);

			markerInstance.on('click', () => {
				onMarkerTap?.(marker);
			});
		}
	};

	const updateCurrentLocationMarker = () => {
		if (!leaflet || !map) return;

		if (currentLocationMarker) {
			currentLocationMarker.remove();
			currentLocationMarker = null;
		}

		if (!isValidPoint(currentLocation)) return;

		currentLocationMarker = leaflet
			.marker(toLatLngTuple(currentLocation), {
				icon: createCurrentLocationIcon(leaflet),
				interactive: false,
			})
			.addTo(map);
	};

	$effect(() => {
		if (!isReady || !map || !leaflet || !markerLayer) return;
		if (markerSignature === lastMarkerSignature) return;

		renderMarkers();
		recenterMapToMarkers();
		lastMarkerSignature = markerSignature;
	});

	$effect(() => {
		if (!isReady || !map || !leaflet) return;
		if (currentLocationSignature === lastCurrentLocationSignature) return;

		updateCurrentLocationMarker();
		lastCurrentLocationSignature = currentLocationSignature;
	});

	onMount(() => {
		let disposed = false;

		const initializeMap = async () => {
			const L = await import('leaflet');
			if (disposed || !mapElement) return;

			leaflet = L;
			const center = isValidPoint(defaultCenter) ? defaultCenter : DEFAULT_MAP_CENTER;
			const nextMap = L.map(mapElement, {
				center: toLatLngTuple(center),
				zoom: defaultZoom,
				minZoom,
				maxZoom,
				preferCanvas: true,
			});

			map = nextMap;
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom,
				minZoom,
				detectRetina: true,
				referrerPolicy: 'no-referrer',
			}).addTo(nextMap);

			markerLayer = L.layerGroup().addTo(nextMap);
			isReady = true;
		};

		void initializeMap();

		return () => {
			disposed = true;

			if (currentLocationMarker) {
				currentLocationMarker.remove();
				currentLocationMarker = null;
			}

			if (markerLayer) {
				markerLayer.clearLayers();
				markerLayer = null;
			}

			if (map) {
				map.remove();
				map = null;
			}

			isReady = false;
		};
	});
</script>

<div data-testid="map" class={cn('h-full w-full', className)} bind:this={mapElement}></div>
