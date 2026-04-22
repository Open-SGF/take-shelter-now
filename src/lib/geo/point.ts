export type GeoPoint = {
	latitude: number;
	longitude: number;
};

export const isValidCoordinate = (value: number) => Number.isFinite(value);

export const isValidPoint = (point: GeoPoint | null | undefined): point is GeoPoint => {
	if (!point) {
		return false;
	}
	return isValidCoordinate(point.latitude) && isValidCoordinate(point.longitude);
};

export const toLeafletPoint = (point: GeoPoint): [number, number] => [
	point.latitude,
	point.longitude,
];

export const fromGeoJSONPoint = (coordinates: number[]): GeoPoint => ({
	longitude: coordinates[0],
	latitude: coordinates[1],
});

export function distanceBetween(a: GeoPoint, b: GeoPoint): number {
	const R = 3959;
	const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
	const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
	const aVal =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((a.latitude * Math.PI) / 180) *
			Math.cos((b.latitude * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
	return R * c;
}
