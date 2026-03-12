import { describe, expect, test } from 'vitest';
import { buildMarkerSignature, buildPointSignature, filterValidMarkers } from './markers';
import type { MapMarker } from './types';

describe('markers', () => {
	test('filterValidMarkers removes invalid points and preserves order', () => {
		const markers = [
			{ id: 'north', latitude: 37.2, longitude: -93.3 },
			{ id: 'bad-lat', latitude: Number.NaN, longitude: -93.3 },
			{ id: 'center', latitude: 37.25, longitude: -93.25 },
			{ id: 'bad-lng', latitude: 37.1, longitude: Number.POSITIVE_INFINITY },
		] as MapMarker[];

		expect(filterValidMarkers(markers)).toEqual([
			{ id: 'north', latitude: 37.2, longitude: -93.3 },
			{ id: 'center', latitude: 37.25, longitude: -93.25 },
		]);
	});

	test('buildMarkerSignature is deterministic and rounded to 6 decimals', () => {
		const markers: MapMarker[] = [
			{ id: 'one', latitude: 37.12345649, longitude: -93.98765451 },
			{ id: 'two', latitude: 37.5, longitude: -93.2 },
		];

		expect(buildMarkerSignature(markers)).toBe('one:37.123456,-93.987655|two:37.500000,-93.200000');
	});

	test('buildPointSignature handles valid and missing points', () => {
		expect(buildPointSignature({ latitude: 37.2, longitude: -93.3 })).toBe('37.200000,-93.300000');
		expect(buildPointSignature({ latitude: Number.NaN, longitude: -93.3 })).toBe('none');
		expect(buildPointSignature(null)).toBe('none');
	});
});
