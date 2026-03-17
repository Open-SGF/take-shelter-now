import { describe, expect, test } from 'vitest';
import {
	defaultFilters,
	filterShelters,
	filtersToSearchParams,
	hasActiveFilters,
	searchParamsToFilters,
	type ShelterFilters,
} from './filter';
import type { Shelter } from './types';

const createMockShelter = (overrides: Partial<Shelter> = {}): Shelter => ({
	slug: 'test-shelter',
	name: 'Test Shelter',
	addressLine1: '123 Main St',
	addressLine2: '',
	city: 'Springfield',
	state: 'MO',
	zip: '65802',
	latitude: 37.2,
	longitude: -93.3,
	photoUrls: [],
	petFriendly: false,
	accessibility: false,
	hasBackupPower: false,
	...overrides,
});

describe('hasActiveFilters', () => {
	test('returns false for default filters', () => {
		expect(hasActiveFilters(defaultFilters)).toBe(false);
	});

	test('returns true when petFriendly is set', () => {
		expect(hasActiveFilters({ ...defaultFilters, petFriendly: true })).toBe(true);
	});

	test('returns true when accessibility is set', () => {
		expect(hasActiveFilters({ ...defaultFilters, accessibility: true })).toBe(true);
	});

	test('returns true when hasBackupPower is set', () => {
		expect(hasActiveFilters({ ...defaultFilters, hasBackupPower: true })).toBe(true);
	});

	test('returns true when categories are set', () => {
		expect(hasActiveFilters({ ...defaultFilters, categories: ['school'] })).toBe(true);
	});
});

describe('filterShelters', () => {
	test('returns all shelters when no filters are active', () => {
		const shelters = [createMockShelter(), createMockShelter({ slug: 'shelter-2' })];
		expect(filterShelters(shelters, defaultFilters)).toEqual(shelters);
	});

	test('filters by petFriendly', () => {
		const shelters = [
			createMockShelter({ slug: 'pets-ok', petFriendly: true }),
			createMockShelter({ slug: 'no-pets', petFriendly: false }),
		];
		const filters: ShelterFilters = { ...defaultFilters, petFriendly: true };
		expect(filterShelters(shelters, filters)).toHaveLength(1);
		expect(filterShelters(shelters, filters)[0].slug).toBe('pets-ok');
	});

	test('filters by accessibility', () => {
		const shelters = [
			createMockShelter({ slug: 'accessible', accessibility: true }),
			createMockShelter({ slug: 'not-accessible', accessibility: false }),
		];
		const filters: ShelterFilters = { ...defaultFilters, accessibility: true };
		expect(filterShelters(shelters, filters)).toHaveLength(1);
		expect(filterShelters(shelters, filters)[0].slug).toBe('accessible');
	});

	test('filters by hasBackupPower', () => {
		const shelters = [
			createMockShelter({ slug: 'has-power', hasBackupPower: true }),
			createMockShelter({ slug: 'no-power', hasBackupPower: false }),
		];
		const filters: ShelterFilters = { ...defaultFilters, hasBackupPower: true };
		expect(filterShelters(shelters, filters)).toHaveLength(1);
		expect(filterShelters(shelters, filters)[0].slug).toBe('has-power');
	});

	test('filters by category', () => {
		const shelters = [
			createMockShelter({ slug: 'school-shelter', category: 'school' }),
			createMockShelter({ slug: 'church-shelter', category: 'church' }),
			createMockShelter({ slug: 'other-shelter', category: 'other' }),
		];
		const filters: ShelterFilters = { ...defaultFilters, categories: ['school', 'church'] };
		expect(filterShelters(shelters, filters)).toHaveLength(2);
	});

	test('treats undefined category as other', () => {
		const shelters = [
			createMockShelter({ slug: 'no-category', category: undefined }),
			createMockShelter({ slug: 'explicit-other', category: 'other' }),
		];
		const filters: ShelterFilters = { ...defaultFilters, categories: ['other'] };
		expect(filterShelters(shelters, filters)).toHaveLength(2);
	});

	test('combines multiple filters with AND logic', () => {
		const shelters = [
			createMockShelter({ slug: 'both', petFriendly: true, accessibility: true }),
			createMockShelter({ slug: 'pets-only', petFriendly: true, accessibility: false }),
			createMockShelter({ slug: 'access-only', petFriendly: false, accessibility: true }),
		];
		const filters: ShelterFilters = { ...defaultFilters, petFriendly: true, accessibility: true };
		expect(filterShelters(shelters, filters)).toHaveLength(1);
		expect(filterShelters(shelters, filters)[0].slug).toBe('both');
	});
});

describe('filtersToSearchParams', () => {
	test('returns empty params for default filters', () => {
		const params = filtersToSearchParams(defaultFilters);
		expect(params.toString()).toBe('');
	});

	test('sets pets param when petFriendly is true', () => {
		const params = filtersToSearchParams({ ...defaultFilters, petFriendly: true });
		expect(params.get('pets')).toBe('true');
	});

	test('sets accessible param when accessibility is true', () => {
		const params = filtersToSearchParams({ ...defaultFilters, accessibility: true });
		expect(params.get('accessible')).toBe('true');
	});

	test('sets power param when hasBackupPower is true', () => {
		const params = filtersToSearchParams({ ...defaultFilters, hasBackupPower: true });
		expect(params.get('power')).toBe('true');
	});

	test('sets categories param as comma-separated', () => {
		const params = filtersToSearchParams({
			...defaultFilters,
			categories: ['school', 'church'],
		});
		expect(params.get('categories')).toBe('school,church');
	});

	test('combines all params', () => {
		const params = filtersToSearchParams({
			petFriendly: true,
			accessibility: true,
			hasBackupPower: true,
			categories: ['school'],
		});
		expect(params.get('pets')).toBe('true');
		expect(params.get('accessible')).toBe('true');
		expect(params.get('power')).toBe('true');
		expect(params.get('categories')).toBe('school');
	});
});

describe('searchParamsToFilters', () => {
	test('returns default filters for empty params', () => {
		const params = new URLSearchParams();
		expect(searchParamsToFilters(params)).toEqual(defaultFilters);
	});

	test('parses pets param', () => {
		const params = new URLSearchParams('pets=true');
		expect(searchParamsToFilters(params).petFriendly).toBe(true);
	});

	test('parses accessible param', () => {
		const params = new URLSearchParams('accessible=true');
		expect(searchParamsToFilters(params).accessibility).toBe(true);
	});

	test('parses power param', () => {
		const params = new URLSearchParams('power=true');
		expect(searchParamsToFilters(params).hasBackupPower).toBe(true);
	});

	test('ignores invalid param values', () => {
		const params = new URLSearchParams('pets=yes');
		expect(searchParamsToFilters(params).petFriendly).toBe(false);
	});

	test('parses categories param', () => {
		const params = new URLSearchParams('categories=school,church');
		expect(searchParamsToFilters(params).categories).toEqual(['school', 'church']);
	});

	test('filters out invalid categories', () => {
		const params = new URLSearchParams('categories=school,invalid,church');
		expect(searchParamsToFilters(params).categories).toEqual(['school', 'church']);
	});

	test('handles empty categories param', () => {
		const params = new URLSearchParams('categories=');
		expect(searchParamsToFilters(params).categories).toEqual([]);
	});

	test('parses all params together', () => {
		const params = new URLSearchParams('pets=true&accessible=true&power=true&categories=other');
		const filters = searchParamsToFilters(params);
		expect(filters).toEqual({
			petFriendly: true,
			accessibility: true,
			hasBackupPower: true,
			categories: ['other'],
		});
	});
});

describe('filtersToSearchParams and searchParamsToFilters round-trip', () => {
	test('round-trips filters with all options', () => {
		const original: ShelterFilters = {
			petFriendly: true,
			accessibility: true,
			hasBackupPower: true,
			categories: ['school', 'church', 'other'],
		};
		const params = filtersToSearchParams(original);
		const result = searchParamsToFilters(params);
		expect(result).toEqual(original);
	});

	test('round-trips default filters', () => {
		const params = filtersToSearchParams(defaultFilters);
		const result = searchParamsToFilters(params);
		expect(result).toEqual(defaultFilters);
	});
});
