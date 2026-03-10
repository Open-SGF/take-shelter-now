import { describe, expect, test } from 'vitest';
import {
	formatShelterAddress,
	formatShelterDistance,
	getAvailableAmenities,
	normalizeShelterCategory,
} from './presentation';

describe('shelter presentation', () => {
	test('formats shelter address with optional line 2', () => {
		expect(
			formatShelterAddress({
				addressLine1: '423 East Central',
				addressLine2: 'Suite 100',
				city: 'Springfield',
				state: 'MO',
				zip: '65802',
			}),
		).toBe('423 East Central, Suite 100, Springfield, MO 65802');

		expect(
			formatShelterAddress({
				addressLine1: '423 East Central',
				addressLine2: '',
				city: 'Springfield',
				state: 'MO',
				zip: '65802',
			}),
		).toBe('423 East Central, Springfield, MO 65802');
	});

	test('normalizes shelter category to known values', () => {
		expect(normalizeShelterCategory('school')).toBe('School');
		expect(normalizeShelterCategory('Church')).toBe('Church');
		expect(normalizeShelterCategory(' Community Center ')).toBe('Other');
		expect(normalizeShelterCategory(undefined)).toBe('Other');
	});

	test('returns only available amenity flags', () => {
		expect(
			getAvailableAmenities({
				petFriendly: true,
				hasBackupPower: false,
				accessibility: true,
			}),
		).toEqual(['petsAllowed', 'accessibility']);

		expect(
			getAvailableAmenities({
				petFriendly: undefined,
				hasBackupPower: undefined,
				accessibility: undefined,
			}),
		).toEqual([]);
	});

	test('formats distance using feet or miles', () => {
		expect(formatShelterDistance(0.4)).toBe('2112 ft');
		expect(formatShelterDistance(0.999)).toBe('5275 ft');
		expect(formatShelterDistance(1)).toBe('1.0 mi');
		expect(formatShelterDistance(2.63)).toBe('2.6 mi');
		expect(formatShelterDistance(Number.NaN)).toBeNull();
		expect(formatShelterDistance(undefined)).toBeNull();
		expect(formatShelterDistance(null)).toBeNull();
	});
});
