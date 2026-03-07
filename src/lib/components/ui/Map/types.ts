import type { GeoPoint } from '$lib/geo';

export type MapMarker = GeoPoint & {
	id: string;
	label?: string;
};
