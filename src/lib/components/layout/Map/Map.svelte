<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import type * as Leaflet from 'leaflet';
	import type {} from '@maplibre/maplibre-gl-leaflet';
	import { isValidPoint, toLeafletPoint, type GeoPoint } from '$lib/geo';
	import { buildMarkerSignature, buildPointSignature, filterValidMarkers } from './markers';
	import { createRecenterPlan } from './viewport';
	import { loadBasemapStyle, loadLeaflet } from './leaflet-loader';
	import type { MapMarker, MapViewportChangedDetail, MapViewportWillChangeDetail } from './types';

	const DEFAULT_MAP_CENTER: GeoPoint = {
		latitude: 37.208957,
		longitude: -93.292299,
	};

	type MapProps = {
		markers?: MapMarker[];
		currentLocation?: GeoPoint | null;
		centerPin?: boolean;
		centerPinLocation?: GeoPoint;
		defaultCenter?: GeoPoint;
		defaultZoom?: number;
		minZoom?: number;
		maxZoom?: number;
		onMarkerTap?: (marker: MapMarker) => void;
		onCenterChange?: (location: GeoPoint) => void;
		onViewportWillChange?: (detail: MapViewportWillChangeDetail) => void;
		onViewportChanged?: (detail: MapViewportChangedDetail) => void;
		class?: string;
	};

	let {
		markers = [],
		currentLocation = null,
		centerPin = false,
		centerPinLocation,
		defaultCenter = DEFAULT_MAP_CENTER,
		defaultZoom = 13,
		minZoom = 3,
		maxZoom = 19,
		onMarkerTap,
		onCenterChange,
		onViewportWillChange,
		onViewportChanged,
		class: className,
	}: MapProps = $props();

	let mapElement: HTMLDivElement | null = null;
	let leaflet: typeof Leaflet | null = null;
	let map: Leaflet.Map | null = null;
	let basemapLayer: Leaflet.Layer | null = null;
	let markerLayer: Leaflet.LayerGroup | null = null;
	let currentLocationMarker: Leaflet.Marker | null = null;
	let pendingViewportChangedHandler: (() => void) | null = null;
	let lastMarkerSignature = '';
	let lastCurrentLocationSignature = '';
	let lastCenterPin = false;
	let isReady = $state(false);

	let validMarkers = $derived(filterValidMarkers(markers));
	let markerSignature = $derived(buildMarkerSignature(validMarkers));
	let currentLocationSignature = $derived(buildPointSignature(currentLocation));
	let selectedMarker = $derived(validMarkers.find((m) => m.isSelected === true));
	let lastFocusedMarkerId: string | null = null;
	let prefersReducedMotion = $state(false);

	const SELECTED_MARKER_ZOOM = 17;
	const BASE_FLY_TO_DURATION = 0.75;
	let flyToDuration = $derived(prefersReducedMotion ? 0 : BASE_FLY_TO_DURATION);

	const createMarkerIcon = (L: typeof Leaflet, isSelected = false): Leaflet.DivIcon => {
		const size = isSelected ? 48 : 36;
		const iconAnchor: [number, number] = isSelected ? [24, 44] : [18, 33];
		return L.divIcon({
			className: 'flex items-center justify-center bg-transparent border-0',
			html: `
				<img
					data-testid="map-marker"
					src="/icons/map-pin.svg"
					alt=""
					aria-hidden="true"
					class="pointer-events-none block h-[${size}px] w-[${size}px]"
				/>
			`,
			iconSize: [size, size],
			iconAnchor,
		});
	};

	const createCurrentLocationIcon = (L: typeof Leaflet, reducedMotion = false): Leaflet.DivIcon =>
		L.divIcon({
			className: 'relative bg-transparent border-0',
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
							border-sky-600/55 ${reducedMotion ? '' : 'animate-ping'}
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

	const createBasemapLayer = (
		L: typeof Leaflet,
		style: Leaflet.LeafletMaplibreGLOptions['style'],
	): Leaflet.Layer => {
		return L.maplibreGL({
			style,
			interactive: false,
		});
	};

	const clearPendingViewportChangedHandler = () => {
		if (!map || !pendingViewportChangedHandler) return;

		map.off('moveend', pendingViewportChangedHandler);
		pendingViewportChangedHandler = null;
	};

	const runViewportUpdate = (
		detail: MapViewportChangedDetail,
		applyViewport: (mapInstance: Leaflet.Map) => void,
	) => {
		if (!map) return;

		onViewportWillChange?.(detail);
		clearPendingViewportChangedHandler();

		const mapInstance = map;
		const handleViewportChanged = () => {
			if (pendingViewportChangedHandler !== handleViewportChanged) return;

			mapInstance.off('moveend', handleViewportChanged);
			pendingViewportChangedHandler = null;
			onViewportChanged?.(detail);
		};

		pendingViewportChangedHandler = handleViewportChanged;
		mapInstance.on('moveend', handleViewportChanged);
		applyViewport(mapInstance);
	};

	const recenterMapToMarkers = (animate = false) => {
		if (!map) return;

		const fallbackCenter = isValidPoint(defaultCenter) ? defaultCenter : DEFAULT_MAP_CENTER;
		const plan = createRecenterPlan(validMarkers, fallbackCenter, defaultZoom);

		if (plan.mode === 'bounds') {
			const detail: MapViewportChangedDetail = {
				trigger: 'markers',
				mode: plan.mode,
			};

			runViewportUpdate(detail, (mapInstance) => {
				if (animate) {
					mapInstance.flyToBounds(
						plan.bounds.map((marker) => toLeafletPoint(marker)),
						{ duration: flyToDuration, ...plan.options },
					);
				} else {
					mapInstance.fitBounds(
						plan.bounds.map((marker) => toLeafletPoint(marker)),
						plan.options,
					);
				}
			});
			return;
		}

		const detail: MapViewportChangedDetail = {
			trigger: 'markers',
			mode: plan.mode,
		};

		runViewportUpdate(detail, (mapInstance) => {
			if (animate) {
				mapInstance.flyTo(toLeafletPoint(plan.center), plan.zoom, {
					duration: flyToDuration,
				});
			} else {
				mapInstance.setView(toLeafletPoint(plan.center), plan.zoom);
			}
		});
	};

	const renderMarkers = () => {
		if (!leaflet || !markerLayer) return;

		markerLayer.clearLayers();

		for (const marker of validMarkers) {
			const markerInstance = leaflet
				.marker(toLeafletPoint(marker), {
					icon: createMarkerIcon(leaflet, marker.isSelected === true),
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
			.marker(toLeafletPoint(currentLocation), {
				icon: createCurrentLocationIcon(leaflet, prefersReducedMotion),
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

	$effect(() => {
		if (!isReady || !map) return;

		if (selectedMarker && selectedMarker.id !== lastFocusedMarkerId) {
			lastFocusedMarkerId = selectedMarker.id;
			map.flyTo(toLeafletPoint(selectedMarker), SELECTED_MARKER_ZOOM, {
				duration: flyToDuration,
			});
		} else if (!selectedMarker && lastFocusedMarkerId !== null) {
			lastFocusedMarkerId = null;
			recenterMapToMarkers(true);
		}
	});

	$effect(() => {
		if (!isReady || !map) return;

		const isEnteringCenterPinMode = centerPin && !lastCenterPin;
		lastCenterPin = centerPin;

		if (isEnteringCenterPinMode && isValidPoint(centerPinLocation)) {
			map.flyTo(toLeafletPoint(centerPinLocation), 16, {
				duration: flyToDuration,
			});
		}
	});

	onMount(() => {
		let disposed = false;
		let moveHandler: (() => void) | null = null;

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mediaQuery.matches;

		const handleMediaQueryChange = (e: MediaQueryListEvent) => {
			prefersReducedMotion = e.matches;
		};

		mediaQuery.addEventListener('change', handleMediaQueryChange);

		const initializeMap = async () => {
			const [L, basemapStyle] = await Promise.all([loadLeaflet(), loadBasemapStyle()]);
			if (disposed || !mapElement) return;

			leaflet = L;
			const center = isValidPoint(defaultCenter) ? defaultCenter : DEFAULT_MAP_CENTER;
			const nextMap = L.map(mapElement, {
				center: toLeafletPoint(center),
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

			basemapLayer = createBasemapLayer(L, basemapStyle).addTo(nextMap);

			markerLayer = L.layerGroup().addTo(nextMap);

			moveHandler = () => {
				if (centerPin) {
					const center = nextMap.getCenter();
					onCenterChange?.({
						latitude: center.lat,
						longitude: center.lng,
					});
				}
			};

			nextMap.on('move', moveHandler);

			isReady = true;
		};

		void initializeMap();

		return () => {
			disposed = true;
			mediaQuery.removeEventListener('change', handleMediaQueryChange);
			clearPendingViewportChangedHandler();

			if (moveHandler && map) {
				map.off('move', moveHandler);
				moveHandler = null;
			}

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
				map.stop();
				map.remove();
				map = null;
			}

			isReady = false;
		};
	});
</script>

<div class="relative h-full w-full">
	<div
		data-testid="map"
		class={cn('h-full w-full', className)}
		bind:this={mapElement}
		style:view-transition-name="none"
	></div>

	{#if centerPin}
		<div
			data-testid="center-pin"
			class="pointer-events-none absolute top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-full"
			aria-hidden="true"
		>
			<img src="/icons/map-pin.svg" alt="" class="block h-12 w-12 drop-shadow-lg" />
			<div
				class="absolute -bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 rounded-full bg-black/30 blur-sm"
			></div>
		</div>
	{/if}
</div>
