import type { GeoPoint } from '$lib/geo';
import type { MapMarker } from './types';

type BoundsOptions = {
	padding: [number, number];
	maxZoom: number;
};

export type RecenterMode = 'default' | 'single' | 'bounds';

export type RecenterPlan =
	| {
			mode: 'default' | 'single';
			center: GeoPoint;
			zoom: number;
	  }
	| {
			mode: 'bounds';
			bounds: MapMarker[];
			options: BoundsOptions;
	  };

const DEFAULT_BOUNDS_OPTIONS: BoundsOptions = {
	padding: [32, 32],
	maxZoom: 15,
};

export const getRecenterMode = (markers: MapMarker[]): RecenterMode => {
	if (markers.length === 0) return 'default';
	if (markers.length === 1) return 'single';
	return 'bounds';
};

export const createRecenterPlan = (
	markers: MapMarker[],
	defaultCenter: GeoPoint,
	defaultZoom: number,
): RecenterPlan => {
	const mode = getRecenterMode(markers);

	if (mode === 'default') {
		return {
			mode,
			center: defaultCenter,
			zoom: defaultZoom,
		};
	}

	if (mode === 'single') {
		return {
			mode,
			center: markers[0],
			zoom: defaultZoom,
		};
	}

	return {
		mode,
		bounds: markers,
		options: DEFAULT_BOUNDS_OPTIONS,
	};
};
