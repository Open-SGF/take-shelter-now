import { describe, expect, test } from 'vitest';
import { isValidCoordinate, isValidPoint, toLatLngTuple } from './point';

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
		expect(toLatLngTuple({ latitude: 37.2, longitude: -93.2 })).toEqual([37.2, -93.2]);
	});
});
