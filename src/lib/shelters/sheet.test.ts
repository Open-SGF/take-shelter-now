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
				addressLine1: '123 Main St',
				addressLine2: 'Suite 100, Building A',
				city: 'Springfield',
				state: 'MO',
				zip: '65806',
				latitude: 37.208957,
				longitude: -93.292299,
			},
			{
				name: 'Delta Shelter',
				addressLine1: '910 Pine St',
				addressLine2: '',
				city: 'Springfield',
				state: 'MO',
				zip: '65803',
				latitude: 37.3,
				longitude: -93.28,
			},
		]);
	});
});

describe('buildGoogleSheetCsvUrl', () => {
	test('throws when sheet id is missing', () => {
		expect(() => buildGoogleSheetCsvUrl(undefined, undefined)).toThrow('Missing GOOGLE_SHEET_ID');
	});

	test('builds url with output=csv and optional gid', () => {
		expect(buildGoogleSheetCsvUrl('sheet-id', '42').toString()).toBe(
			'https://docs.google.com/spreadsheets/d/e/sheet-id/pub?output=csv&gid=42',
		);
		expect(buildGoogleSheetCsvUrl('sheet-id', undefined).toString()).toBe(
			'https://docs.google.com/spreadsheets/d/e/sheet-id/pub?output=csv',
		);
	});
});
