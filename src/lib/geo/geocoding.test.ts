import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { GeocodeResponseEnvelopePropertiesV2, FeaturePropertiesV2 } from '@stadiamaps/api';

const mockAutocompleteV2 = vi.fn();
const mockPlaceDetailsV2 = vi.fn();
const mockSearchV2 = vi.fn();

vi.mock('@stadiamaps/api', () => {
	const mockApi = function () {
		return {
			autocompleteV2: mockAutocompleteV2,
			placeDetailsV2: mockPlaceDetailsV2,
			searchV2: mockSearchV2,
		};
	};
	return {
		GeocodingApi: mockApi,
	};
});

const createMockFeature = (overrides: Partial<FeaturePropertiesV2> = {}) =>
	({
		type: 'Feature',
		geometry: { type: 'Point', coordinates: [-93.292299, 37.208957] },
		properties: {
			gid: 'test-gid',
			name: '123 Main St',
			coarseLocation: 'Springfield, MO, USA',
			formattedAddressLine: '123 Main St, Springfield, MO 65801',
			layer: 'address',
			precision: 'point',
			...overrides.properties,
		},
		...overrides,
	}) satisfies FeaturePropertiesV2;

const createMockResponse = (
	features: FeaturePropertiesV2[] = [],
): GeocodeResponseEnvelopePropertiesV2 => ({
	geocoding: { attribution: 'https://stadiamaps.com/attribution/' },
	features,
	type: 'FeatureCollection',
});

const testApiError = async (
	mockFn: typeof mockAutocompleteV2,
	testFn: () => Promise<unknown>,
	expected: unknown,
) => {
	const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	mockFn.mockRejectedValue(new Error('Network error'));
	const result = await testFn();
	expect(result).toEqual(expected);
	consoleSpy.mockRestore();
};

describe('geocoding', () => {
	let geocoding: typeof import('./geocoding');

	beforeEach(async () => {
		vi.resetModules();
		mockAutocompleteV2.mockReset();
		mockPlaceDetailsV2.mockReset();
		mockSearchV2.mockReset();
		geocoding = await import('./geocoding');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('searchAddresses', () => {
		test('returns empty array when query is less than 3 characters', async () => {
			const result = await geocoding.searchAddresses('ab');
			expect(result).toEqual([]);
			expect(mockAutocompleteV2).not.toHaveBeenCalled();
		});

		test('calls autocompleteV2 with correct parameters and returns formatted suggestions', async () => {
			mockAutocompleteV2.mockResolvedValue(
				createMockResponse([
					createMockFeature({
						properties: {
							gid: 'test-gid-1',
							name: '123 Main St',
							coarseLocation: 'Springfield, MO, USA',
							formattedAddressLine: '123 Main St, Springfield, MO 65801',
							layer: 'address',
							precision: 'point',
						},
					}),
				]),
			);

			const result = await geocoding.searchAddresses('123 Main');

			expect(mockAutocompleteV2).toHaveBeenCalledWith({
				text: '123 Main',
				focusPointLat: 37.208957,
				focusPointLon: -93.292299,
				boundaryCountry: ['US'],
				layers: ['address', 'poi'],
				size: 5,
			});
			expect(result).toEqual([
				{
					gid: 'test-gid-1',
					label: '123 Main St, Springfield, MO, USA',
					address: '123 Main St, Springfield, MO 65801',
				},
			]);
		});

		test('returns empty array on API error', async () => {
			await testApiError(mockAutocompleteV2, () => geocoding.searchAddresses('123 Main'), []);
		});
	});

	describe('getPlaceDetails', () => {
		test('calls placeDetailsV2 with correct parameters and returns formatted result', async () => {
			mockPlaceDetailsV2.mockResolvedValue(createMockResponse([createMockFeature()]));

			const result = await geocoding.getPlaceDetails('test-gid');

			expect(mockPlaceDetailsV2).toHaveBeenCalledWith({ ids: ['test-gid'] });
			expect(result).toEqual({
				label: '123 Main St, Springfield, MO, USA',
				address: '123 Main St, Springfield, MO 65801',
				location: { longitude: -93.292299, latitude: 37.208957 },
			});
		});

		test('returns null when feature has no coordinates', async () => {
			mockPlaceDetailsV2.mockResolvedValue(
				createMockResponse([
					{
						type: 'Feature',
						geometry: null,
						properties: {
							gid: 'test-gid',
							name: 'Test',
							coarseLocation: undefined,
							formattedAddressLine: undefined,
							layer: 'address',
							precision: 'point',
						},
					} satisfies FeaturePropertiesV2,
				]),
			);

			const result = await geocoding.getPlaceDetails('test-gid');

			expect(result).toBeNull();
		});

		test('returns null when no features returned', async () => {
			mockPlaceDetailsV2.mockResolvedValue(createMockResponse());

			const result = await geocoding.getPlaceDetails('test-gid');

			expect(result).toBeNull();
		});

		test('returns null on API error', async () => {
			await testApiError(mockPlaceDetailsV2, () => geocoding.getPlaceDetails('test-gid'), null);
		});
	});

	describe('geocodeAddress', () => {
		test('calls searchV2 with correct parameters and returns formatted result', async () => {
			mockSearchV2.mockResolvedValue(createMockResponse([createMockFeature()]));

			const result = await geocoding.geocodeAddress('123 Main St, Springfield, MO');

			expect(mockSearchV2).toHaveBeenCalledWith({
				text: '123 Main St, Springfield, MO',
				focusPointLat: 37.208957,
				focusPointLon: -93.292299,
				boundaryCountry: ['US'],
				layers: ['address', 'poi'],
				size: 1,
			});
			expect(result).toEqual({
				label: '123 Main St, Springfield, MO, USA',
				address: '123 Main St, Springfield, MO 65801',
				location: { longitude: -93.292299, latitude: 37.208957 },
			});
		});

		test('returns null when no features returned', async () => {
			mockSearchV2.mockResolvedValue(createMockResponse());

			const result = await geocoding.geocodeAddress('nonexistent address');

			expect(result).toBeNull();
		});

		test('returns null on API error', async () => {
			await testApiError(mockSearchV2, () => geocoding.geocodeAddress('123 Main St'), null);
		});
	});
});
