import type { GeoPoint } from '$lib/geo';

export type MapTheme = 'light' | 'dark';

export type MapMarker = GeoPoint & {
	id: string;
	label?: string;
	isSelected?: boolean;
};

export type MapViewportChangedDetail = {
	trigger: 'markers';
	mode: 'default' | 'single' | 'bounds';
};

export type MapViewportWillChangeDetail = MapViewportChangedDetail;

export interface ViewportConfig {
	defaultCenter?: GeoPoint;
	defaultZoom?: number;
	minZoom?: number;
	maxZoom?: number;
}

export interface MarkerProps {
	items?: MapMarker[];
	onTap?: (marker: MapMarker) => void;
}

export interface CenterPinMode {
	enabled?: boolean;
	location?: GeoPoint;
	onCenterChange?: (location: GeoPoint) => void;
}

export interface ViewportCallbacks {
	onWillChange?: (detail: MapViewportWillChangeDetail) => void;
	onChanged?: (detail: MapViewportChangedDetail) => void;
}

export interface MapProps {
	viewport?: ViewportConfig;
	markers?: MarkerProps;
	centerPin?: CenterPinMode;
	currentLocation?: GeoPoint | null;
	onViewportChange?: ViewportCallbacks;
	theme?: MapTheme;
	class?: string;
}
