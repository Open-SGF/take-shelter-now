import type { GeoPoint } from '$lib/geo';

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
