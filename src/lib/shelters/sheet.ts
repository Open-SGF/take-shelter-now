import type { Shelter } from './types';
import { parse } from 'csv-parse/sync';
import { parseShelterHours } from './hours';

type CsvRecord = Record<string, string>;

const SHEET_FIELDS = {
	verificationStatus: 'Verification Status',
	name: 'Name',
	addressLine1: 'Address Line 1',
	addressLine2: 'Address Line 2',
	city: 'City',
	state: 'State',
	zip: 'Zip',
	buildingLatitude: 'Building Latitude',
	buildingLongitude: 'Building Longitude',
	latitude: 'Latitude',
	longitude: 'Longitude',
	capacity: 'Capacity',
	category: 'Category',
	petFriendly: 'Pet Friendly',
	accessibility: 'Accessibility',
	hasBackupPower: 'Has Backup Power',
	hoursAsShelter: 'Hours as a Shelter',
	specialInstructions: 'Special Instructions',
	shelterType: 'Shelter Type',
	photoUrls: 'Photo URLs',
	lastUpdated: 'Last Updated',
} as const;

const normalize = (value: string | undefined) => (value ?? '').trim().toLowerCase();

const toText = (value: string | undefined) => (value ?? '').trim();

const toOptionalText = (value: string | undefined): string | undefined => {
	const trimmed = toText(value);
	return trimmed === '' ? undefined : trimmed;
};

const toNumber = (value: string | undefined) => {
	const trimmed = (value ?? '').trim();
	if (trimmed === '') {
		return Number.NaN;
	}

	return Number.parseFloat(trimmed.replace(/,/g, ''));
};

const toOptionalNumber = (value: string | undefined): number | undefined => {
	const parsed = toNumber(value);
	return Number.isFinite(parsed) ? parsed : undefined;
};

const toOptionalBoolean = (value: string | undefined): boolean | undefined => {
	const normalizedValue = normalize(value);
	if (normalizedValue === 'yes') {
		return true;
	}

	if (normalizedValue === 'no') {
		return false;
	}

	return undefined;
};

const toStringArray = (value: string | undefined): string[] => {
	const trimmed = toText(value);
	if (trimmed === '') {
		return [];
	}

	return trimmed
		.split(/[\n,]/)
		.map((entry) => entry.trim())
		.filter((entry) => entry !== '');
};

const pickCoordinates = (row: CsvRecord): { latitude: number; longitude: number } | null => {
	const buildingLatitude = toNumber(row[SHEET_FIELDS.buildingLatitude]);
	const buildingLongitude = toNumber(row[SHEET_FIELDS.buildingLongitude]);

	if (Number.isFinite(buildingLatitude) && Number.isFinite(buildingLongitude)) {
		return { latitude: buildingLatitude, longitude: buildingLongitude };
	}

	const latitude = toNumber(row[SHEET_FIELDS.latitude]);
	const longitude = toNumber(row[SHEET_FIELDS.longitude]);

	if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
		return { latitude, longitude };
	}

	return null;
};

export const buildGoogleSheetCsvUrl = (
	sheetId: string | undefined,
	gid: string | undefined,
): URL | undefined => {
	if (!sheetId) {
		return undefined;
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

	const coordinates = pickCoordinates(row);

	if (!coordinates) {
		return null;
	}

	return {
		name: toText(row[SHEET_FIELDS.name]),
		addressLine1: toText(row[SHEET_FIELDS.addressLine1]),
		addressLine2: toText(row[SHEET_FIELDS.addressLine2]),
		city: toText(row[SHEET_FIELDS.city]),
		state: toText(row[SHEET_FIELDS.state]),
		zip: toText(row[SHEET_FIELDS.zip]),
		latitude: coordinates.latitude,
		longitude: coordinates.longitude,
		capacity: toOptionalNumber(row[SHEET_FIELDS.capacity]),
		category: toOptionalText(row[SHEET_FIELDS.category]),
		petFriendly: toOptionalBoolean(row[SHEET_FIELDS.petFriendly]),
		accessibility: toOptionalBoolean(row[SHEET_FIELDS.accessibility]),
		hasBackupPower: toOptionalBoolean(row[SHEET_FIELDS.hasBackupPower]),
		hours: parseShelterHours(row[SHEET_FIELDS.hoursAsShelter]),
		specialInstructions: toOptionalText(row[SHEET_FIELDS.specialInstructions]),
		shelterType: toOptionalText(row[SHEET_FIELDS.shelterType]),
		photoUrls: toStringArray(row[SHEET_FIELDS.photoUrls]),
		lastUpdated: toOptionalText(row[SHEET_FIELDS.lastUpdated]),
	};
};

export const getPublicSheltersFromCsv = (csvText: string): Shelter[] => {
	return parseCsv(csvText)
		.map(mapSheetRowToShelter)
		.filter((shelter): shelter is Shelter => shelter !== null);
};
