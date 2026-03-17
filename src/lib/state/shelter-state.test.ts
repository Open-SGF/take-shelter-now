import { afterEach, describe, expect, test, vi } from 'vitest';
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

const mockShelters = [
	buildShelter({ name: 'One', slug: 'one', latitude: 37.2, longitude: -93.2 }),
	buildShelter({ name: 'Two', slug: 'two', latitude: 37.21, longitude: -93.29 }),
];

describe('createShelterState', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('starts with loading state', () => {
		const shelterState = createShelterState(() => null);

		expect(shelterState.dataState.kind).toBe('loading');
	});

	test('loadShelters fetches and sets shelters', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockShelters),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		if (shelterState.dataState.kind === 'ready') {
			expect(shelterState.dataState.shelters).toHaveLength(2);
		}
	});

	test('loadShelters sets error state on fetch failure', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('error');
		});

		if (shelterState.dataState.kind === 'error') {
			expect(shelterState.dataState.message).toBe('Failed to fetch shelters: 500');
		}
	});

	test('loadShelters sets empty state when no shelters', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('empty');
		});
	});

	test('returns shelters with zero distances when no location', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockShelters[0]]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		const result = shelterState.sheltersWithDistance;

		expect(result).toHaveLength(1);
		expect(result[0].distance).toBe(0);
		expect(result[0].slug).toBe('one');
	});

	test('sorts shelters by computed distance when location available', async () => {
		const location = { latitude: 37.208957, longitude: -93.292299 };
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({ name: 'Far', slug: 'far', latitude: 37.4, longitude: -93.5 }),
						buildShelter({ name: 'Near', slug: 'near', latitude: 37.21, longitude: -93.29 }),
					]),
			}),
		);

		const shelterState = createShelterState(() => location);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		const result = shelterState.sheltersWithDistance;

		expect(result.map((s) => s.slug)).toEqual(['near', 'far']);
		expect(result[0].distance).toBeLessThan(result[1].distance);
	});

	test('loadShelters aborts previous request', async () => {
		let abortCount = 0;
		const originalAbortController = globalThis.AbortController;

		class MockAbortController {
			signal = {} as AbortSignal;
			abort() {
				abortCount++;
			}
		}

		vi.stubGlobal('AbortController', MockAbortController);
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockShelters),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();
		shelterState.loadShelters();

		expect(abortCount).toBe(1);

		vi.stubGlobal('AbortController', originalAbortController);
	});
});
