import { afterEach, describe, expect, test, vi } from 'vitest';
import type { Shelter, ShelterHours } from '$lib/shelters/types';
import { createShelterState } from './shelter-state.svelte';

const HOURS_24_7: ShelterHours = {
	timeZone: 'America/Chicago',
	intervals: [{ startMinute: 0, endMinute: 10080 }],
};

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
		petFriendly: overrides.petFriendly ?? false,
		accessibility: overrides.accessibility ?? false,
		hasBackupPower: overrides.hasBackupPower ?? false,
		category: overrides.category,
		hours: overrides.hours,
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

	test('sorts open shelters before closed shelters', async () => {
		const location = { latitude: 37.208957, longitude: -93.292299 };
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Closed Near',
							slug: 'closed-near',
							latitude: 37.21,
							longitude: -93.29,
							hours: undefined,
						}),
						buildShelter({
							name: 'Open Far',
							slug: 'open-far',
							latitude: 37.4,
							longitude: -93.5,
							hours: HOURS_24_7,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => location);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		const result = shelterState.sheltersWithDistance;

		expect(result.map((s) => s.slug)).toEqual(['open-far', 'closed-near']);
		expect(result[0].isOpen).toBe(true);
		expect(result[1].isOpen).toBe(false);
	});

	test('sorts open shelters by distance among themselves', async () => {
		const location = { latitude: 37.208957, longitude: -93.292299 };
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Open Far',
							slug: 'open-far',
							latitude: 37.4,
							longitude: -93.5,
							hours: HOURS_24_7,
						}),
						buildShelter({
							name: 'Open Near',
							slug: 'open-near',
							latitude: 37.21,
							longitude: -93.29,
							hours: HOURS_24_7,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => location);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		const result = shelterState.sheltersWithDistance;

		expect(result.map((s) => s.slug)).toEqual(['open-near', 'open-far']);
		expect(result[0].distance).toBeLessThan(result[1].distance);
	});

	test('sorts closed shelters by distance among themselves', async () => {
		const location = { latitude: 37.208957, longitude: -93.292299 };
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Closed Far',
							slug: 'closed-far',
							latitude: 37.4,
							longitude: -93.5,
							hours: undefined,
						}),
						buildShelter({
							name: 'Closed Near',
							slug: 'closed-near',
							latitude: 37.21,
							longitude: -93.29,
							hours: undefined,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => location);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		const result = shelterState.sheltersWithDistance;

		expect(result.map((s) => s.slug)).toEqual(['closed-near', 'closed-far']);
		expect(result[0].distance).toBeLessThan(result[1].distance);
	});

	test('sorts open then closed shelters each by distance', async () => {
		const location = { latitude: 37.208957, longitude: -93.292299 };
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Closed Near',
							slug: 'closed-near',
							latitude: 37.21,
							longitude: -93.29,
							hours: undefined,
						}),
						buildShelter({
							name: 'Open Far',
							slug: 'open-far',
							latitude: 37.4,
							longitude: -93.5,
							hours: HOURS_24_7,
						}),
						buildShelter({
							name: 'Closed Far',
							slug: 'closed-far',
							latitude: 37.5,
							longitude: -93.6,
							hours: undefined,
						}),
						buildShelter({
							name: 'Open Near',
							slug: 'open-near',
							latitude: 37.22,
							longitude: -93.3,
							hours: HOURS_24_7,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => location);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		const result = shelterState.sheltersWithDistance;

		expect(result.map((s) => s.slug)).toEqual([
			'open-near',
			'open-far',
			'closed-near',
			'closed-far',
		]);
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

describe('filtering', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('returns all shelters when no filters are active', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({ name: 'One', slug: 'one', latitude: 37.2, longitude: -93.2 }),
						buildShelter({ name: 'Two', slug: 'two', latitude: 37.21, longitude: -93.29 }),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		expect(shelterState.filteredShelters).toHaveLength(2);
		expect(shelterState.hasActiveFilters).toBe(false);
		expect(shelterState.activeFilterCount).toBe(0);
	});

	test('filters by petFriendly', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Pets OK',
							slug: 'pets-ok',
							latitude: 37.2,
							longitude: -93.2,
							petFriendly: true,
						}),
						buildShelter({
							name: 'No Pets',
							slug: 'no-pets',
							latitude: 37.21,
							longitude: -93.29,
							petFriendly: false,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		shelterState.setFilter('petFriendly', true);

		expect(shelterState.filteredShelters).toHaveLength(1);
		expect(shelterState.filteredShelters[0].slug).toBe('pets-ok');
		expect(shelterState.hasActiveFilters).toBe(true);
		expect(shelterState.activeFilterCount).toBe(1);
	});

	test('filters by accessibility', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Accessible',
							slug: 'accessible',
							latitude: 37.2,
							longitude: -93.2,
							accessibility: true,
						}),
						buildShelter({
							name: 'Not Accessible',
							slug: 'not-accessible',
							latitude: 37.21,
							longitude: -93.29,
							accessibility: false,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		shelterState.setFilter('accessibility', true);

		expect(shelterState.filteredShelters).toHaveLength(1);
		expect(shelterState.filteredShelters[0].slug).toBe('accessible');
	});

	test('filters by hasBackupPower', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Has Power',
							slug: 'has-power',
							latitude: 37.2,
							longitude: -93.2,
							hasBackupPower: true,
						}),
						buildShelter({
							name: 'No Power',
							slug: 'no-power',
							latitude: 37.21,
							longitude: -93.29,
							hasBackupPower: false,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		shelterState.setFilter('hasBackupPower', true);

		expect(shelterState.filteredShelters).toHaveLength(1);
		expect(shelterState.filteredShelters[0].slug).toBe('has-power');
	});

	test('filters by category', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'School',
							slug: 'school-shelter',
							latitude: 37.2,
							longitude: -93.2,
							category: 'school',
						}),
						buildShelter({
							name: 'Church',
							slug: 'church-shelter',
							latitude: 37.21,
							longitude: -93.29,
							category: 'church',
						}),
						buildShelter({
							name: 'Other',
							slug: 'other-shelter',
							latitude: 37.22,
							longitude: -93.3,
							category: 'other',
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		shelterState.setFilter('categories', ['school', 'church']);

		expect(shelterState.filteredShelters).toHaveLength(2);
		expect(shelterState.activeFilterCount).toBe(2);
	});

	test('treats undefined category as other', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'No Category',
							slug: 'no-category',
							latitude: 37.2,
							longitude: -93.2,
							category: undefined,
						}),
						buildShelter({
							name: 'Explicit Other',
							slug: 'explicit-other',
							latitude: 37.21,
							longitude: -93.29,
							category: 'other',
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		shelterState.setFilter('categories', ['other']);

		expect(shelterState.filteredShelters).toHaveLength(2);
	});

	test('combines multiple filters with AND logic', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Both',
							slug: 'both',
							latitude: 37.2,
							longitude: -93.2,
							petFriendly: true,
							accessibility: true,
						}),
						buildShelter({
							name: 'Pets Only',
							slug: 'pets-only',
							latitude: 37.21,
							longitude: -93.29,
							petFriendly: true,
							accessibility: false,
						}),
						buildShelter({
							name: 'Access Only',
							slug: 'access-only',
							latitude: 37.22,
							longitude: -93.3,
							petFriendly: false,
							accessibility: true,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		shelterState.setFilter('petFriendly', true);
		shelterState.setFilter('accessibility', true);

		expect(shelterState.filteredShelters).toHaveLength(1);
		expect(shelterState.filteredShelters[0].slug).toBe('both');
		expect(shelterState.activeFilterCount).toBe(2);
	});

	test('clearFilters resets all filters', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						buildShelter({
							name: 'Pets OK',
							slug: 'pets-ok',
							latitude: 37.2,
							longitude: -93.2,
							petFriendly: true,
						}),
						buildShelter({
							name: 'No Pets',
							slug: 'no-pets',
							latitude: 37.21,
							longitude: -93.29,
							petFriendly: false,
						}),
					]),
			}),
		);

		const shelterState = createShelterState(() => null);
		shelterState.loadShelters();

		await vi.waitFor(() => {
			expect(shelterState.dataState.kind).toBe('ready');
		});

		shelterState.setFilter('petFriendly', true);
		expect(shelterState.filteredShelters).toHaveLength(1);

		shelterState.clearFilters();

		expect(shelterState.filteredShelters).toHaveLength(2);
		expect(shelterState.hasActiveFilters).toBe(false);
	});
});
