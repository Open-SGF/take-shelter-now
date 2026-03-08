import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

const VERIFICATION_STATUS_FIELD = 'Verification Status';

const INTERNAL_FIELDS = new Set([
	'(Internal) Shelter Contact Phone',
	'(Internal) Shelter Contact Email',
	'(Internal) Shelter Contact Title',
	'(Internal) Assigned Volunteer',
	'Emailed',
	'Called',
	'Visited',
]);

type ShelterRecord = Record<string, string>;

const normalize = (value: string | undefined) => (value ?? '').trim().toLowerCase();

const buildSheetUrl = () => {
	if (!env.GOOGLE_SHEET_ID) {
		throw error(
			500,
			'Missing GOOGLE_SHEET_ID. Set it in your environment before running the build.',
		);
	}

	const url = new URL(`https://docs.google.com/spreadsheets/d/e/${env.GOOGLE_SHEET_ID}/pub`);
	url.searchParams.set('output', 'csv');

	if (env.GOOGLE_SHEET_GID) {
		url.searchParams.set('gid', env.GOOGLE_SHEET_GID);
	}

	return url;
};

const parseCsv = (csvText: string): ShelterRecord[] => {
	const rows: string[][] = [];
	let row: string[] = [];
	let value = '';
	let inQuotes = false;

	for (let i = 0; i < csvText.length; i += 1) {
		const char = csvText[i];

		if (char === '"') {
			if (inQuotes && csvText[i + 1] === '"') {
				value += '"';
				i += 1;
			} else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (char === ',' && !inQuotes) {
			row.push(value);
			value = '';
			continue;
		}

		if ((char === '\n' || char === '\r') && !inQuotes) {
			if (char === '\r' && csvText[i + 1] === '\n') {
				i += 1;
			}

			row.push(value);
			rows.push(row);
			row = [];
			value = '';
			continue;
		}

		value += char;
	}

	if (value.length > 0 || row.length > 0) {
		row.push(value);
		rows.push(row);
	}

	if (rows.length === 0) {
		return [];
	}

	const headers = rows[0].map((header, index) => {
		const cleaned = header.trim();
		return index === 0 ? cleaned.replace(/^\ufeff/, '') : cleaned;
	});

	const parsedRows: ShelterRecord[] = [];

	for (let i = 1; i < rows.length; i += 1) {
		const rowValues = rows[i];

		if (rowValues.every((entry) => entry.trim() === '')) {
			continue;
		}

		const record: ShelterRecord = {};
		headers.forEach((header, index) => {
			record[header] = (rowValues[index] ?? '').trim();
		});

		parsedRows.push(record);
	}

	return parsedRows;
};

const getPublicShelters = (rows: ShelterRecord[]): ShelterRecord[] => {
	return rows
		.filter((row) => normalize(row[VERIFICATION_STATUS_FIELD]) === 'open')
		.map((row) => {
			const publicRow = Object.fromEntries(
				Object.entries(row).filter(([field]) => !INTERNAL_FIELDS.has(field)),
			);

			return publicRow;
		});
};

export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch(buildSheetUrl());

	if (!response.ok) {
		throw error(502, `Failed to fetch Google Sheet CSV: ${response.status} ${response.statusText}`);
	}

	const csvText = await response.text();
	const records = parseCsv(csvText);
	const shelters = getPublicShelters(records);

	return json(shelters);
};
