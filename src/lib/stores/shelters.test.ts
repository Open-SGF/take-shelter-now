import { describe, expect, test } from 'vitest';
import { get, writable } from 'svelte/store';
import type { Shelter } from '$lib/shelters/types';
import { createSheltersStore } from './shelters';

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

describe('createSheltersStore', () => {
	test('returns shelters with zero distances when no location is available', () => {
		const store = createSheltersStore([
			buildShelter({ name: 'One', slug: 'one', latitude: 37.2, longitude: -93.2 }),
		]);
		const location = writable<null>(null);

		const result = get(store.withDistance(location));

		expect(result).toHaveLength(1);
		expect(result[0].distance).toBe(0);
		expect(result[0].slug).toBe('one');
	});

	test('sorts shelters by computed distance when location is available', () => {
		const store = createSheltersStore([
			buildShelter({ name: 'Far', slug: 'far', latitude: 37.4, longitude: -93.5 }),
			buildShelter({ name: 'Near', slug: 'near', latitude: 37.21, longitude: -93.29 }),
		]);
		const location = writable({ latitude: 37.208957, longitude: -93.292299 });

		const result = get(store.withDistance(location));

		expect(result.map((shelter) => shelter.slug)).toEqual(['near', 'far']);
		expect(result[0].distance).toBeLessThan(result[1].distance);
	});
});
