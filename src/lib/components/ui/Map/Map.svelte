<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import type * as Leaflet from 'leaflet';
	import type {} from '@maplibre/maplibre-gl-leaflet';
	import { isValidPoint, toLatLngTuple, type GeoPoint } from '$lib/geo';
	import { buildMarkerSignature, buildPointSignature, filterValidMarkers } from './markers';
	import { createRecenterPlan } from './viewport';
	import { loadLeaflet } from './leaflet-loader';
	import type { MapMarker, MapViewportChangedDetail } from './types';

	const DEFAULT_MAP_CENTER: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	const BASEMAP_STYLE_URL = 'https://tiles.stadiamaps.com/styles/alidade_smooth.json';

	type MapProps = {
		markers?: MapMarker[];
		currentLocation?: GeoPoint | null;
		defaultCenter?: GeoPoint;
		defaultZoom?: number;
		minZoom?: number;
		maxZoom?: number;
		onMarkerTap?: (marker: MapMarker) => void;
		onViewportChanged?: (detail: MapViewportChangedDetail) => void;
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
		onViewportChanged,
		class: className,
	}: MapProps = $props();

	let mapElement: HTMLDivElement | null = null;
	let leaflet: typeof Leaflet | null = null;
	let map: Leaflet.Map | null = null;
	let basemapLayer: Leaflet.Layer | null = null;
	let markerLayer: Leaflet.LayerGroup | null = null;
	let currentLocationMarker: Leaflet.Marker | null = null;
	let lastMarkerSignature = '';
	let lastCurrentLocationSignature = '';
	let isReady = $state(false);

	let validMarkers = $derived(filterValidMarkers(markers));
	let markerSignature = $derived(buildMarkerSignature(validMarkers));
	let currentLocationSignature = $derived(buildPointSignature(currentLocation));

	const createMarkerIcon = (L: typeof Leaflet): Leaflet.DivIcon =>
		L.divIcon({
			className: 'tsn-map-marker-icon flex items-center justify-center bg-transparent border-0',
			html: `
				<img
					data-testid="map-marker"
					src="/icons/map-pin.svg"
					alt=""
					aria-hidden="true"
					class="pointer-events-none block h-[36px] w-[36px]"
				/>
			`,
			iconSize: [36, 36],
			iconAnchor: [18, 33],
		});

	const createCurrentLocationIcon = (L: typeof Leaflet): Leaflet.DivIcon =>
		L.divIcon({
			className: 'tsn-current-location-icon relative bg-transparent border-0',
			html: `
				<span
					data-testid="map-current-location"
					class="pointer-events-none relative block h-[42px] w-[42px]"
					aria-hidden="true"
				>
					<span
						class="
							absolute left-1/2 top-1/2 block h-[28px] w-[28px]
							-translate-x-1/2 -translate-y-1/2 rounded-full border-2
							border-sky-600/55 animate-ping
						"
					></span>
					<span
						class="
							absolute left-1/2 top-1/2 block h-[14px] w-[14px]
							-translate-x-1/2 -translate-y-1/2 rounded-full border-2
							border-white bg-sky-500 shadow-[0_2px_6px_rgba(0,0,0,0.35)]
						"
					></span>
				</span>
			`,
			iconSize: [42, 42],
			iconAnchor: [21, 21],
		});

	const createBasemapLayer = (L: typeof Leaflet): Leaflet.Layer => {
		return L.maplibreGL({
			style: BASEMAP_STYLE_URL,
			interactive: false,
		});
	};

	const recenterMapToMarkers = () => {
		if (!map) return;

		const fallbackCenter = isValidPoint(defaultCenter) ? defaultCenter : DEFAULT_MAP_CENTER;
		const plan = createRecenterPlan(validMarkers, fallbackCenter, defaultZoom);

		if (plan.mode === 'bounds') {
			const detail: MapViewportChangedDetail = {
				trigger: 'markers',
				mode: plan.mode,
			};

			map.fitBounds(
				plan.bounds.map((marker) => toLatLngTuple(marker)),
				plan.options,
			);
			onViewportChanged?.(detail);
			return;
		}

		const detail: MapViewportChangedDetail = {
			trigger: 'markers',
			mode: plan.mode,
		};

		map.setView(toLatLngTuple(plan.center), plan.zoom);
		onViewportChanged?.(detail);
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
			const L = await loadLeaflet();
			if (disposed || !mapElement) return;

			leaflet = L;
			const center = isValidPoint(defaultCenter) ? defaultCenter : DEFAULT_MAP_CENTER;
			const nextMap = L.map(mapElement, {
				center: toLatLngTuple(center),
				zoom: defaultZoom,
				minZoom,
				maxZoom,
				zoomControl: false,
				preferCanvas: true,
			});

			map = nextMap;
			L.control
				.zoom({
					position: 'bottomright',
				})
				.addTo(nextMap);

			basemapLayer = createBasemapLayer(L).addTo(nextMap);

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

			if (basemapLayer) {
				basemapLayer.remove();
				basemapLayer = null;
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
