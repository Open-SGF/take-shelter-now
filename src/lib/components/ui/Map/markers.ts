import { isValidPoint, type GeoPoint } from '$lib/geo';
import type { MapMarker } from './types';

const formatPoint = (point: GeoPoint) =>
	`${point.latitude.toFixed(6)},${point.longitude.toFixed(6)}`;

export const filterValidMarkers = (markers: MapMarker[]) =>
	markers.filter((marker) => isValidPoint(marker));

export const buildMarkerSignature = (markers: MapMarker[]) =>
	markers.map((marker) => `${marker.id}:${formatPoint(marker)}`).join('|');

export const buildPointSignature = (point: GeoPoint | null | undefined) =>
	isValidPoint(point) ? formatPoint(point) : 'none';
