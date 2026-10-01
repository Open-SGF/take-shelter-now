import { beforeEach, describe, expect, test, vi } from 'vitest';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { session } from '#lib/storage/index.js';
import { defaultFilters } from './filter';
import { navigateToShelterDetail, navigateToShelterList } from './navigation';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/paths', () => ({
	resolve: vi.fn((route: string, params?: { slug: string }) =>
		route === '/(requires-location)' ? '/' : `/shelters/${params?.slug}`,
	),
}));

describe('shelter navigation', () => {
	beforeEach(() => session.clear());

	test('resolves the detail route and saves filters for the return trip', () => {
		const filters = { ...defaultFilters, petFriendly: true };
		navigateToShelterDetail('alpha-shelter', filters);

		expect(resolve).toHaveBeenCalledWith('/shelters/[slug]', { slug: 'alpha-shelter' });
		expect(goto).toHaveBeenCalledWith('/shelters/alpha-shelter');
		expect(session.get('return-filters')).toEqual(filters);
	});

	test('returns to the list route with saved filters, not a query on the detail route', () => {
		session.set('return-filters', { ...defaultFilters, petFriendly: true, accessibility: true });
		navigateToShelterList();

		expect(resolve).toHaveBeenCalledWith('/(requires-location)');
		expect(goto).toHaveBeenCalledWith('/?pets=true&accessible=true');
		expect(session.get('return-filters')).toBeNull();
	});

	test('returns to the list without a query when saved filters are empty', () => {
		session.set('return-filters', defaultFilters);
		navigateToShelterList();
		expect(goto).toHaveBeenCalledWith('/');
	});

	test('returns to the list when no filters are saved', () => {
		navigateToShelterList();
		expect(goto).toHaveBeenCalledWith('/');
	});
});
