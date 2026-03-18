import type * as Leaflet from 'leaflet';
import { isValidPoint, toLeafletPoint, type GeoPoint } from '$lib/geo';
import { buildMarkerSignature, buildPointSignature, filterValidMarkers } from './markers';
import { createRecenterPlan } from './viewport';
import { loadBasemapStyle, loadLeaflet } from './leaflet-loader';
import { BASE_FLY_TO_DURATION, DEFAULT_MAP_CENTER, SELECTED_MARKER_ZOOM } from './constants';
import type {
	MapMarker,
	MapViewportChangedDetail,
	ViewportConfig,
	ViewportCallbacks,
} from './types';

export class MapController {
	isReady = $state(false);
	radarEnabled = $state(false);
	prefersReducedMotion = $state(false);
	flyToDuration = $derived(this.prefersReducedMotion ? 0 : BASE_FLY_TO_DURATION);

	map = $state<Leaflet.Map | null>(null);
	leaflet = $state<typeof Leaflet | null>(null);

	#mapElement: HTMLDivElement | null = null;
	#basemapLayer: Leaflet.Layer | null = null;
	#markerLayer: Leaflet.LayerGroup | null = null;
	#radarLayer: Leaflet.TileLayer | null = null;
	#radarRefreshInterval: ReturnType<typeof setInterval> | null = null;
	#currentLocationMarker: Leaflet.Marker | null = null;
	#pendingViewportChangedHandler: (() => void) | null = null;
	#moveHandler: (() => void) | null = null;
	#lastMarkerSignature = '';
	#lastCurrentLocationSignature = '';
	#lastCenterPin = false;
	#lastFocusedMarkerId: string | null = null;
	#currentMarkers: MapMarker[] = [];
	#disposed = false;
	#mediaQuery: MediaQueryList | null = null;

	#createMarkerIcon(L: typeof Leaflet, isSelected = false): Leaflet.DivIcon {
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
	}

	#createCurrentLocationIcon(L: typeof Leaflet, reducedMotion = false): Leaflet.DivIcon {
		return L.divIcon({
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
	}

	#createBasemapLayer(
		L: typeof Leaflet,
		style: Leaflet.LeafletMaplibreGLOptions['style'],
	): Leaflet.Layer {
		return L.maplibreGL({
			style,
			interactive: false,
		});
	}

	#clearPendingViewportChangedHandler() {
		if (!this.map || !this.#pendingViewportChangedHandler) {
			return;
		}

		this.map.off('moveend', this.#pendingViewportChangedHandler);
		this.#pendingViewportChangedHandler = null;
	}

	#runViewportUpdate(
		detail: MapViewportChangedDetail,
		applyViewport: (mapInstance: Leaflet.Map) => void,
		callbacks?: ViewportCallbacks,
	) {
		if (!this.map) {
			return;
		}

		callbacks?.onWillChange?.(detail);
		this.#clearPendingViewportChangedHandler();

		const mapInstance = this.map;
		const handleViewportChanged = () => {
			if (this.#pendingViewportChangedHandler !== handleViewportChanged) {
				return;
			}

			mapInstance.off('moveend', handleViewportChanged);
			this.#pendingViewportChangedHandler = null;
			callbacks?.onChanged?.(detail);
		};

		this.#pendingViewportChangedHandler = handleViewportChanged;
		mapInstance.on('moveend', handleViewportChanged);
		applyViewport(mapInstance);
	}

	async initialize(element: HTMLDivElement, config: ViewportConfig): Promise<void> {
		this.#mapElement = element;
		this.#disposed = false;

		this.#mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.prefersReducedMotion = this.#mediaQuery.matches;
		this.#mediaQuery.addEventListener('change', this.#handleMediaQueryChange);

		const [L, basemapStyle] = await Promise.all([loadLeaflet(), loadBasemapStyle()]);
		if (this.#disposed || !this.#mapElement) {
			return;
		}

		this.leaflet = L;
		const center = isValidPoint(config.defaultCenter) ? config.defaultCenter : DEFAULT_MAP_CENTER;
		const nextMap = L.map(this.#mapElement, {
			center: toLeafletPoint(center),
			zoom: config.defaultZoom ?? 13,
			minZoom: config.minZoom ?? 3,
			maxZoom: config.maxZoom ?? 19,
			zoomControl: false,
			preferCanvas: true,
		});

		this.map = nextMap;
		L.control
			.zoom({
				position: 'bottomright',
			})
			.addTo(nextMap);

		this.#basemapLayer = this.#createBasemapLayer(L, basemapStyle).addTo(nextMap);
		this.#markerLayer = L.layerGroup().addTo(nextMap);

		this.isReady = true;
	}

	setRadarEnabled(enabled: boolean) {
		this.radarEnabled = enabled;

		if (this.#disposed || !this.leaflet || !this.map) {
			return;
		}

		if (enabled) {
			void this.#loadRadarOverlay(this.leaflet, this.map);
			this.#radarRefreshInterval = setInterval(
				() => void this.#loadRadarOverlay(this.leaflet!, this.map!),
				5 * 60 * 1000,
			);
		} else {
			if (this.#radarRefreshInterval) {
				clearInterval(this.#radarRefreshInterval);
				this.#radarRefreshInterval = null;
			}
			if (this.#radarLayer) {
				this.#radarLayer.remove();
				this.#radarLayer = null;
			}
		}
	}

	async #loadRadarOverlay(L: typeof Leaflet, mapInstance: Leaflet.Map): Promise<void> {
		try {
			const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
			if (this.#disposed) {
				return;
			}
			const data = (await response.json()) as {
				host: string;
				radar: { past: Array<{ path: string }> };
			};
			const frames = data.radar.past;
			if (frames.length === 0) {
				return;
			}

			const latestFrame = frames[frames.length - 1];
			const tileUrl = data.host + latestFrame.path + '/256/{z}/{x}/{y}/2/1_1.png';

			if (this.#radarLayer) {
				this.#radarLayer.remove();
			}

			this.#radarLayer = L.tileLayer(tileUrl, {
				tileSize: 256,
				opacity: 0.5,
				maxNativeZoom: 7,
				maxZoom: 30,
				zIndex: 10,
				attribution: '<a href="https://www.rainviewer.com" target="_blank">RainViewer</a>',
			}).addTo(mapInstance);
		} catch {
			// Radar is non-critical — silently ignore failures
		}
	}

	#handleMediaQueryChange = (e: MediaQueryListEvent) => {
		this.prefersReducedMotion = e.matches;
	};

	setupMoveHandler(onCenterChange?: (location: GeoPoint) => void) {
		if (!this.map || !onCenterChange) {
			return;
		}

		this.#moveHandler = () => {
			const center = this.map!.getCenter();
			onCenterChange({
				latitude: center.lat,
				longitude: center.lng,
			});
		};

		this.map.on('move', this.#moveHandler);
	}

	dispose() {
		this.#disposed = true;

		if (this.#radarRefreshInterval) {
			clearInterval(this.#radarRefreshInterval);
			this.#radarRefreshInterval = null;
		}

		if (this.#mediaQuery) {
			this.#mediaQuery.removeEventListener('change', this.#handleMediaQueryChange);
			this.#mediaQuery = null;
		}

		this.#clearPendingViewportChangedHandler();

		if (this.#moveHandler && this.map) {
			this.map.off('move', this.#moveHandler);
			this.#moveHandler = null;
		}

		if (this.#currentLocationMarker) {
			this.#currentLocationMarker.remove();
			this.#currentLocationMarker = null;
		}

		if (this.#radarLayer) {
			this.#radarLayer.remove();
			this.#radarLayer = null;
		}

		if (this.#markerLayer) {
			this.#markerLayer.clearLayers();
			this.#markerLayer = null;
		}

		if (this.#basemapLayer && this.map) {
			this.#basemapLayer.remove();
			this.#basemapLayer = null;
		}

		if (this.map) {
			this.map.stop();
			this.map.remove();
			this.map = null;
		}

		this.leaflet = null;
		this.isReady = false;
	}

	renderMarkers(
		markers: MapMarker[],
		onTap?: (marker: MapMarker) => void,
		callbacks?: ViewportCallbacks,
	) {
		if (!this.leaflet || !this.#markerLayer) {
			return;
		}

		const validMarkers = filterValidMarkers(markers);
		const signature = buildMarkerSignature(validMarkers);

		if (signature === this.#lastMarkerSignature) {
			return;
		}
		this.#lastMarkerSignature = signature;
		this.#currentMarkers = validMarkers;

		this.#markerLayer.clearLayers();

		for (const marker of validMarkers) {
			const markerInstance = this.leaflet
				.marker(toLeafletPoint(marker), {
					icon: this.#createMarkerIcon(this.leaflet, marker.isSelected === true),
					title: marker.label ?? marker.id,
				})
				.addTo(this.#markerLayer);

			markerInstance.on('click', () => {
				onTap?.(marker);
			});
		}

		this.#recenterToMarkers(validMarkers, false, callbacks);
	}

	updateCurrentLocation(location: GeoPoint | null | undefined) {
		if (!this.leaflet || !this.map) {
			return;
		}

		const signature = buildPointSignature(location);
		if (signature === this.#lastCurrentLocationSignature) {
			return;
		}
		this.#lastCurrentLocationSignature = signature;

		if (this.#currentLocationMarker) {
			this.#currentLocationMarker.remove();
			this.#currentLocationMarker = null;
		}

		if (!isValidPoint(location)) {
			return;
		}

		this.#currentLocationMarker = this.leaflet
			.marker(toLeafletPoint(location), {
				icon: this.#createCurrentLocationIcon(this.leaflet, this.prefersReducedMotion),
				interactive: false,
			})
			.addTo(this.map);
	}

	handleSelectionChange(selectedMarker: MapMarker | undefined, callbacks?: ViewportCallbacks) {
		if (!this.isReady || !this.map) {
			return;
		}

		if (selectedMarker && selectedMarker.id !== this.#lastFocusedMarkerId) {
			this.#lastFocusedMarkerId = selectedMarker.id;
			this.map.flyTo(toLeafletPoint(selectedMarker), SELECTED_MARKER_ZOOM, {
				duration: this.flyToDuration,
			});
		} else if (!selectedMarker && this.#lastFocusedMarkerId !== null) {
			this.#lastFocusedMarkerId = null;
			this.#recenterToMarkers(this.#currentMarkers, true, callbacks);
		}
	}

	enterCenterPinMode(location: GeoPoint | undefined) {
		if (!this.isReady || !this.map) {
			return;
		}

		const isEnteringCenterPinMode = location && !this.#lastCenterPin;
		this.#lastCenterPin = !!location;

		if (isEnteringCenterPinMode && isValidPoint(location)) {
			this.map.flyTo(toLeafletPoint(location), 16, {
				duration: this.flyToDuration,
			});
		}
	}

	#recenterToMarkers(markers?: MapMarker[], animate = false, callbacks?: ViewportCallbacks) {
		if (!this.map) {
			return;
		}

		const validMarkers = markers ?? [];
		const fallbackCenter = DEFAULT_MAP_CENTER;
		const plan = createRecenterPlan(validMarkers, fallbackCenter, 13);

		if (plan.mode === 'bounds') {
			const detail: MapViewportChangedDetail = {
				trigger: 'markers',
				mode: plan.mode,
			};

			this.#runViewportUpdate(
				detail,
				(mapInstance) => {
					if (animate) {
						mapInstance.flyToBounds(
							plan.bounds.map((marker) => toLeafletPoint(marker)),
							{ duration: this.flyToDuration, ...plan.options },
						);
					} else {
						mapInstance.fitBounds(
							plan.bounds.map((marker) => toLeafletPoint(marker)),
							plan.options,
						);
					}
				},
				callbacks,
			);
			return;
		}

		const detail: MapViewportChangedDetail = {
			trigger: 'markers',
			mode: plan.mode,
		};

		this.#runViewportUpdate(
			detail,
			(mapInstance) => {
				if (animate) {
					mapInstance.flyTo(toLeafletPoint(plan.center), plan.zoom, {
						duration: this.flyToDuration,
					});
				} else {
					mapInstance.setView(toLeafletPoint(plan.center), plan.zoom);
				}
			},
			callbacks,
		);
	}
}
