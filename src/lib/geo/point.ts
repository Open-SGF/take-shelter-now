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
