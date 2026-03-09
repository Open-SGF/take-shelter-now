import { describe, expect, test, vi } from 'vitest';
import { loadSheltersFromSource, normalizeSheltersPayload } from './source';

describe('normalizeSheltersPayload', () => {
	test('returns empty array for malformed top-level payload', () => {
		expect(normalizeSheltersPayload({ shelters: [] })).toEqual([]);
	});

	test('returns array payload as-is', () => {
		const payload = [{ name: 'Valid Shelter', slug: 'valid-shelter', latitude: 1, longitude: 2 }];
		const result = normalizeSheltersPayload(payload);

		expect(result).toEqual(payload);
	});

	test('drops non-object array entries', () => {
		const payload = [
			{ name: 'Valid Shelter', slug: 'valid-shelter', latitude: 1, longitude: 2 },
			'bad-entry',
			null,
		];

		const result = normalizeSheltersPayload(payload);

		expect(result).toEqual([
			{ name: 'Valid Shelter', slug: 'valid-shelter', latitude: 1, longitude: 2 },
		]);
	});
});

describe('loadSheltersFromSource', () => {
	test('returns error state for non-array payloads', async () => {
		const fetchMock = vi.fn(
			async () =>
				new Response(JSON.stringify({ shelters: [] }), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
		);

		const result = await loadSheltersFromSource(fetchMock);

		expect(result.shelters).toEqual([]);
		expect(result.errorMessage).toBe('Shelter data is temporarily unavailable.');
	});
});
