import type { Shelter } from './types';
import { parse } from 'csv-parse/sync';

type CsvRecord = Record<string, string>;

const SHEET_FIELDS = {
	verificationStatus: 'Verification Status',
	name: 'Name',
	addressLine1: 'Address Line 1',
	addressLine2: 'Address Line 2',
	city: 'City',
	state: 'State',
	zip: 'Zip',
	latitude: 'Latitude',
	longitude: 'Longitude',
} as const;

const normalize = (value: string | undefined) => (value ?? '').trim().toLowerCase();

const toText = (value: string | undefined) => (value ?? '').trim();

const toNumber = (value: string | undefined) => Number.parseFloat((value ?? '').trim());

export const buildGoogleSheetCsvUrl = (
	sheetId: string | undefined,
	gid: string | undefined,
): URL => {
	if (!sheetId) {
		throw new Error(
			'Missing GOOGLE_SHEET_ID. Set it in your environment before running the build.',
		);
	}

	const url = new URL(`https://docs.google.com/spreadsheets/d/e/${sheetId}/pub`);
	url.searchParams.set('output', 'csv');

	if (gid) {
		url.searchParams.set('gid', gid);
	}

	return url;
};

export const parseCsv = (csvText: string): CsvRecord[] => {
	return parse(csvText, {
		bom: true,
		columns: true,
		skip_empty_lines: true,
		trim: true,
	}) as CsvRecord[];
};

export const mapSheetRowToShelter = (row: CsvRecord): Shelter | null => {
	if (normalize(row[SHEET_FIELDS.verificationStatus]) !== 'open') {
		return null;
	}

	const latitude = toNumber(row[SHEET_FIELDS.latitude]);
	const longitude = toNumber(row[SHEET_FIELDS.longitude]);

	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
		return null;
	}

	return {
		name: toText(row[SHEET_FIELDS.name]),
		addressLine1: toText(row[SHEET_FIELDS.addressLine1]),
		addressLine2: toText(row[SHEET_FIELDS.addressLine2]),
		city: toText(row[SHEET_FIELDS.city]),
		state: toText(row[SHEET_FIELDS.state]),
		zip: toText(row[SHEET_FIELDS.zip]),
		latitude,
		longitude,
	};
};

export const getPublicSheltersFromCsv = (csvText: string): Shelter[] => {
	return parseCsv(csvText)
		.map(mapSheetRowToShelter)
		.filter((shelter): shelter is Shelter => shelter !== null);
};
