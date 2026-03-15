import { describe, expect, test } from 'vitest';
import type { Shelter } from '$lib/shelters/types';
import { createShelterState } from './shelter-state.svelte';

const buildShelter = (
	overrides: Partial<Shelter> & Pick<Shelter, 'name' | 'slug' | 'latitude' | 'longitude'>,
): Shelter => {
	return {
		name: overrides.name,
		slug: overrides.slug,
		addressLine1: overrides.addressLine1 ?? '123 Main St',
		addressLine2: overrides.addressLine2 ?? '',
		city: overrides.city ?? 'Springfield',
		state: overrides.state ?? 'MO',
		zip: overrides.zip ?? '65802',
		latitude: overrides.latitude,
		longitude: overrides.longitude,
		photoUrls: overrides.photoUrls ?? [],
	};
};

describe('createShelterState', () => {
	test('starts with loading state', () => {
		const shelterState = createShelterState(() => null);

		expect(shelterState.dataState.kind).toBe('loading');
	});

	test('returns shelters with zero distances when no location', () => {
		const shelterState = createShelterState(() => null);
		shelterState.setShelters([
			buildShelter({ name: 'One', slug: 'one', latitude: 37.2, longitude: -93.2 }),
		]);

		const result = shelterState.sheltersWithDistance;

		expect(result).toHaveLength(1);
		expect(result[0].distance).toBe(0);
		expect(result[0].slug).toBe('one');
	});

	test('sorts shelters by computed distance when location available', () => {
		const location = { latitude: 37.208957, longitude: -93.292299 };
		const shelterState = createShelterState(() => location);
		shelterState.setShelters([
			buildShelter({ name: 'Far', slug: 'far', latitude: 37.4, longitude: -93.5 }),
			buildShelter({ name: 'Near', slug: 'near', latitude: 37.21, longitude: -93.29 }),
		]);

		const result = shelterState.sheltersWithDistance;

		expect(result.map((s) => s.slug)).toEqual(['near', 'far']);
		expect(result[0].distance).toBeLessThan(result[1].distance);
	});

	test('setError sets error state', () => {
		const shelterState = createShelterState(() => null);

		shelterState.setError('Network error');

		expect(shelterState.dataState.kind).toBe('error');
		if (shelterState.dataState.kind === 'error') {
			expect(shelterState.dataState.message).toBe('Network error');
		}
	});

	test('setLoading resets to loading state', () => {
		const shelterState = createShelterState(() => null);
		shelterState.setShelters([
			buildShelter({ name: 'Test', slug: 'test', latitude: 37.2, longitude: -93.2 }),
		]);

		shelterState.setLoading();

		expect(shelterState.dataState.kind).toBe('loading');
	});

	test('setShelters with empty array sets empty state', () => {
		const shelterState = createShelterState(() => null);

		shelterState.setShelters([]);

		expect(shelterState.dataState.kind).toBe('empty');
	});
});
