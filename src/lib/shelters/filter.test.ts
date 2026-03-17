import { describe, expect, test } from 'vitest';
import {
	defaultFilters,
	filtersToSearchParams,
	searchParamsToFilters,
	type ShelterFilters,
} from './filter';

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

	test('sets open param when openNow is true', () => {
		const params = filtersToSearchParams({ ...defaultFilters, openNow: true });
		expect(params.get('open')).toBe('true');
	});

	test('combines all params', () => {
		const params = filtersToSearchParams({
			openNow: true,
			petFriendly: true,
			accessibility: true,
			hasBackupPower: true,
			categories: ['school'],
		});
		expect(params.get('open')).toBe('true');
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

	test('parses open param', () => {
		const params = new URLSearchParams('open=true');
		expect(searchParamsToFilters(params).openNow).toBe(true);
	});

	test('parses all params together', () => {
		const params = new URLSearchParams(
			'open=true&pets=true&accessible=true&power=true&categories=other',
		);
		const filters = searchParamsToFilters(params);
		expect(filters).toEqual({
			openNow: true,
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
			openNow: true,
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
