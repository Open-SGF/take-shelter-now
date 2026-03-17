import { describe, expect, test } from 'vitest';
import {
	distanceBetween,
	fromGeoJSONPoint,
	isValidCoordinate,
	isValidPoint,
	toLeafletPoint,
} from './point';

describe('point', () => {
	test('validates finite coordinate values', () => {
		expect(isValidCoordinate(37.2)).toBe(true);
		expect(isValidCoordinate(Number.NaN)).toBe(false);
		expect(isValidCoordinate(Number.POSITIVE_INFINITY)).toBe(false);
	});

	test('validates geo points', () => {
		expect(isValidPoint({ latitude: 37.2, longitude: -93.2 })).toBe(true);
		expect(isValidPoint(null)).toBe(false);
		expect(isValidPoint({ latitude: Number.NaN, longitude: -93.2 })).toBe(false);
	});

	test('converts geo points to leaflet tuple order', () => {
		expect(toLeafletPoint({ latitude: 37.2, longitude: -93.2 })).toEqual([37.2, -93.2]);
	});

	test('converts GeoJSON coordinates to GeoPoint', () => {
		expect(fromGeoJSONPoint([-93.2, 37.2])).toEqual({ longitude: -93.2, latitude: 37.2 });
	});
});

describe('distanceBetween', () => {
	test('returns 0 for same coordinates', () => {
		expect(
			distanceBetween({ latitude: 37.2, longitude: -93.2 }, { latitude: 37.2, longitude: -93.2 }),
		).toBe(0);
	});

	test('calculates distance between two points', () => {
		const distance = distanceBetween(
			{ latitude: 40.7128, longitude: -74.006 },
			{ latitude: 34.0522, longitude: -118.2437 },
		);
		expect(distance).toBeCloseTo(2445, -2);
	});

	test('calculates short distance', () => {
		const distance = distanceBetween(
			{ latitude: 37.208957, longitude: -93.292299 },
			{ latitude: 37.21, longitude: -93.29 },
		);
		expect(distance).toBeCloseTo(0.13, 1);
	});
});
