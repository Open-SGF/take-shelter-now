import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { GeocodeResponse, GeocodingGeoJSONFeature } from '@stadiamaps/api';

const mockAutocomplete = vi.fn();
const mockPlaceDetails = vi.fn();
const mockSearch = vi.fn();

vi.mock('@stadiamaps/api', () => {
	const mockApi = function () {
		return {
			autocomplete: mockAutocomplete,
			placeDetails: mockPlaceDetails,
			search: mockSearch,
		};
	};
	return {
		GeocodingApi: mockApi,
	};
});

const createMockFeature = (overrides: Record<string, unknown> = {}) =>
	({
		type: 'Feature',
		geometry: { type: 'Point', coordinates: [-93.292299, 37.208957] },
		properties: {
			label: '123 Main St, Springfield, MO',
			street: 'Main St',
			housenumber: '123',
			locality: 'Springfield',
			regionA: 'MO',
			postalcode: '65801',
			...overrides,
		},
	}) satisfies GeocodingGeoJSONFeature;

const createMockResponse = (
	features: ReturnType<typeof createMockFeature>[] = [],
): GeocodeResponse => ({
	geocoding: {},
	features,
});

const testApiError = async (
	mockFn: typeof mockAutocomplete,
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
		mockAutocomplete.mockReset();
		mockPlaceDetails.mockReset();
		mockSearch.mockReset();
		geocoding = await import('./geocoding');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('searchAddresses', () => {
		test('returns empty array when query is less than 3 characters', async () => {
			const result = await geocoding.searchAddresses('ab');
			expect(result).toEqual([]);
			expect(mockAutocomplete).not.toHaveBeenCalled();
		});

		test('calls autocomplete with correct parameters and returns formatted suggestions', async () => {
			mockAutocomplete.mockResolvedValue(
				createMockResponse([createMockFeature({ gid: 'test-gid-1' })]),
			);

			const result = await geocoding.searchAddresses('123 Main');

			expect(mockAutocomplete).toHaveBeenCalledWith({
				text: '123 Main',
				focusPointLat: 37.208957,
				focusPointLon: -93.292299,
				boundaryCountry: ['US'],
				layers: ['address', 'venue'],
				size: 5,
			});
			expect(result).toEqual([
				{
					gid: 'test-gid-1',
					label: '123 Main St, Springfield, MO',
					address: '123 Main St, Springfield, MO, 65801',
				},
			]);
		});

		test('returns empty array on API error', async () => {
			await testApiError(mockAutocomplete, () => geocoding.searchAddresses('123 Main'), []);
		});
	});

	describe('getPlaceDetails', () => {
		test('calls placeDetails with correct parameters and returns formatted result', async () => {
			mockPlaceDetails.mockResolvedValue(createMockResponse([createMockFeature()]));

			const result = await geocoding.getPlaceDetails('test-gid');

			expect(mockPlaceDetails).toHaveBeenCalledWith({ ids: ['test-gid'] });
			expect(result).toEqual({
				label: '123 Main St, Springfield, MO',
				address: '123 Main St, Springfield, MO, 65801',
				location: { longitude: -93.292299, latitude: 37.208957 },
			});
		});

		test('returns null when feature has no coordinates', async () => {
			mockPlaceDetails.mockResolvedValue(
				createMockResponse([
					{
						type: 'Feature',
						geometry: { type: 'Point', coordinates: undefined as unknown as number[] },
						properties: {
							label: 'Test',
							street: '',
							housenumber: '',
							locality: '',
							regionA: '',
							postalcode: '',
						},
					} satisfies GeocodingGeoJSONFeature,
				]),
			);

			const result = await geocoding.getPlaceDetails('test-gid');

			expect(result).toBeNull();
		});

		test('returns null when no features returned', async () => {
			mockPlaceDetails.mockResolvedValue(createMockResponse());

			const result = await geocoding.getPlaceDetails('test-gid');

			expect(result).toBeNull();
		});

		test('returns null on API error', async () => {
			await testApiError(mockPlaceDetails, () => geocoding.getPlaceDetails('test-gid'), null);
		});
	});

	describe('geocodeAddress', () => {
		test('calls search with correct parameters and returns formatted result', async () => {
			mockSearch.mockResolvedValue(createMockResponse([createMockFeature()]));

			const result = await geocoding.geocodeAddress('123 Main St, Springfield, MO');

			expect(mockSearch).toHaveBeenCalledWith({
				text: '123 Main St, Springfield, MO',
				focusPointLat: 37.208957,
				focusPointLon: -93.292299,
				boundaryCountry: ['US'],
				layers: ['address', 'venue'],
				size: 1,
			});
			expect(result).toEqual({
				label: '123 Main St, Springfield, MO',
				address: '123 Main St, Springfield, MO, 65801',
				location: { longitude: -93.292299, latitude: 37.208957 },
			});
		});

		test('returns null when no features returned', async () => {
			mockSearch.mockResolvedValue(createMockResponse());

			const result = await geocoding.geocodeAddress('nonexistent address');

			expect(result).toBeNull();
		});

		test('returns null on API error', async () => {
			await testApiError(mockSearch, () => geocoding.geocodeAddress('123 Main St'), null);
		});
	});
});
