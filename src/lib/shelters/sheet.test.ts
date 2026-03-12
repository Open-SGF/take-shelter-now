import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { buildGoogleSheetCsvUrl, getPublicSheltersFromCsv } from './sheet';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDirPath = path.dirname(thisFilePath);
const fixturePath = path.join(thisDirPath, 'fixtures', 'shelters.csv');
const readFixtureCsv = () => readFile(fixturePath, 'utf8');

describe('shelters mapping', () => {
	test('maps only open rows with valid coordinates to camelCase shelter objects', async () => {
		const csvText = await readFixtureCsv();
		const shelters = getPublicSheltersFromCsv(csvText);

		expect(shelters).toHaveLength(2);
		expect(shelters).toEqual([
			{
				name: 'Alpha Shelter',
				slug: 'alpha-shelter',
				addressLine1: '123 Main St',
				addressLine2: 'Suite 100, Building A',
				city: 'Springfield',
				state: 'MO',
				zip: '65806',
				latitude: 37.208111,
				longitude: -93.291111,
				capacity: 1527,
				category: 'school',
				petFriendly: true,
				accessibility: false,
				hasBackupPower: true,
				hours: {
					timeZone: 'America/Chicago',
					intervals: [
						{ startMinute: 0, endMinute: 510 },
						{ startMinute: 990, endMinute: 1950 },
						{ startMinute: 2430, endMinute: 3390 },
						{ startMinute: 3870, endMinute: 4830 },
						{ startMinute: 5310, endMinute: 6270 },
						{ startMinute: 6750, endMinute: 10080 },
					],
				},
				specialInstructions: 'Enter Door 1, blue light above door.',
				shelterType: 'Evac',
				photoUrls: ['https://example.org/alpha-1.jpg', 'https://example.org/alpha-2.jpg'],
				lastUpdated: '11/04/2025',
			},
			{
				name: 'Delta Shelter',
				slug: 'delta-shelter',
				addressLine1: '910 Pine St',
				addressLine2: '',
				city: 'Springfield',
				state: 'MO',
				zip: '65803',
				latitude: 37.3,
				longitude: -93.28,
				capacity: undefined,
				category: 'church',
				petFriendly: undefined,
				accessibility: undefined,
				hasBackupPower: undefined,
				hours: {
					timeZone: 'America/Chicago',
					intervals: [
						{ startMinute: 510, endMinute: 990 },
						{ startMinute: 1950, endMinute: 2430 },
						{ startMinute: 3390, endMinute: 3870 },
						{ startMinute: 4830, endMinute: 5310 },
						{ startMinute: 6270, endMinute: 6750 },
						{ startMinute: 7710, endMinute: 8190 },
						{ startMinute: 9150, endMinute: 9630 },
					],
				},
				specialInstructions: undefined,
				shelterType: 'Post Impact',
				photoUrls: [],
				lastUpdated: undefined,
			},
		]);
	});
});

describe('buildGoogleSheetCsvUrl', () => {
	test('returns undefined when sheet id is missing', () => {
		expect(buildGoogleSheetCsvUrl(undefined, undefined)).toBeUndefined();
	});

	test('builds url with output=csv and optional gid', () => {
		const withGid = buildGoogleSheetCsvUrl('sheet-id', '42');
		const withoutGid = buildGoogleSheetCsvUrl('sheet-id', undefined);

		expect(withGid).toBeDefined();
		expect(withoutGid).toBeDefined();

		expect(withGid?.toString()).toBe(
			'https://docs.google.com/spreadsheets/d/e/sheet-id/pub?output=csv&gid=42',
		);
		expect(withoutGid?.toString()).toBe(
			'https://docs.google.com/spreadsheets/d/e/sheet-id/pub?output=csv',
		);
	});
});
