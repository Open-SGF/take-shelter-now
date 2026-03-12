import { describe, expect, test } from 'vitest';
import {
	formatLastVerifiedDate,
	formatShelterBoolean,
	formatShelterCapacity,
	formatShelterCategory,
	formatShelterAddress,
	formatShelterDistance,
	formatShelterHours,
	formatSpecialInstructions,
	formatVerificationStatus,
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
				addressLine1: '',
				addressLine2: '',
				city: '',
				state: '',
				zip: '',
			}),
		).toBe('Address not listed');
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

	test('formats detail values with clear fallbacks', () => {
		expect(formatShelterCategory(undefined)).toBe('Category not listed');
		expect(formatShelterCategory('Church')).toBe('Church');

		expect(
			formatShelterBoolean(undefined, {
				yes: 'Yes',
				no: 'No',
				unknown: 'Unknown',
			}),
		).toBe('Unknown');

		expect(formatShelterCapacity(undefined)).toBe('Capacity not listed');
		expect(formatShelterCapacity(1200)).toBe('1,200 people');
		expect(formatShelterHours(false)).toBe('Hours not listed');
		expect(formatShelterHours(true)).toBe('Available hours listed');

		expect(formatVerificationStatus(undefined)).toBe('Unknown');
		expect(formatVerificationStatus('11/04/2025')).toBe('Open');

		expect(formatLastVerifiedDate(undefined)).toBe('Unknown');
		expect(formatLastVerifiedDate('11/04/2025')).toBe('11/04/2025');

		expect(formatSpecialInstructions(undefined)).toBe('No special instructions provided.');
		expect(formatSpecialInstructions('Use side entrance')).toBe('Use side entrance');
	});
});
