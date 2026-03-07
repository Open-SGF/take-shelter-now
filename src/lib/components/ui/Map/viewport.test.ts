import { describe, expect, test } from 'vitest';
import { createRecenterPlan, getRecenterMode } from './viewport';
import type { MapMarker } from './types';

const defaultCenter = { latitude: 37.208957, longitude: -93.292299 };

describe('viewport', () => {
	test('getRecenterMode returns expected mode by marker count', () => {
		expect(getRecenterMode([])).toBe('default');
		expect(getRecenterMode([{ id: 'one', latitude: 37.2, longitude: -93.2 }])).toBe('single');
		expect(
			getRecenterMode([
				{ id: 'one', latitude: 37.2, longitude: -93.2 },
				{ id: 'two', latitude: 37.25, longitude: -93.3 },
			]),
		).toBe('bounds');
	});

	test('createRecenterPlan returns default-center plan with no markers', () => {
		expect(createRecenterPlan([], defaultCenter, 13)).toEqual({
			mode: 'default',
			center: defaultCenter,
			zoom: 13,
		});
	});

	test('createRecenterPlan returns single-marker plan', () => {
		const markers: MapMarker[] = [{ id: 'one', latitude: 37.2, longitude: -93.2 }];

		expect(createRecenterPlan(markers, defaultCenter, 11)).toEqual({
			mode: 'single',
			center: markers[0],
			zoom: 11,
		});
	});

	test('createRecenterPlan returns bounds plan for multiple markers', () => {
		const markers: MapMarker[] = [
			{ id: 'one', latitude: 37.2, longitude: -93.2 },
			{ id: 'two', latitude: 37.25, longitude: -93.3 },
		];

		expect(createRecenterPlan(markers, defaultCenter, 11)).toEqual({
			mode: 'bounds',
			bounds: markers,
			options: {
				padding: [32, 32],
				maxZoom: 15,
			},
		});
	});
});
