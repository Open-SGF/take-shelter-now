import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { buildGoogleSheetCsvUrl, getPublicSheltersFromCsv } from './sheet';
import type { Shelter } from './types';

export const loadSheltersAtBuildTime = async (fetchFn: typeof fetch): Promise<Shelter[]> => {
	let shelters: Shelter[] = [];

	if (env.EXTERNAL_SHELTERS_JSON_URL) {
		shelters = await loadSheltersFromExternalUrl(fetchFn, env.EXTERNAL_SHELTERS_JSON_URL);
	} else if (env.GOOGLE_SHEET_ID) {
		shelters = await loadSheltersFromGoogleSheet(
			fetchFn,
			env.GOOGLE_SHEET_ID,
			env.GOOGLE_SHEET_GID,
		);
	} else {
		console.warn(
			'No shelter source configured. Please set up either an external URL or a Google Sheet as the shelter data source.\nReturning empty shelter list by default.',
		);
	}

	return shelters;
};

const loadSheltersFromGoogleSheet = async (
	fetchFn: typeof fetch,
	sheetId: string,
	sheetGid?: string,
): Promise<Shelter[]> => {
	const sheetUrl = buildGoogleSheetCsvUrl(sheetId, sheetGid);

	if (!sheetUrl) {
		return [];
	}

	const response = await fetchFn(sheetUrl);

	if (!response.ok) {
		throw error(502, `Failed to fetch Google Sheet CSV: ${response.status} ${response.statusText}`);
	}

	const csvText = await response.text();
	const shelters = getPublicSheltersFromCsv(csvText);

	if (shelters.length === 0) {
		throw error(502, 'Shelter data is temporarily unavailable.');
	}

	return shelters;
};

const loadSheltersFromExternalUrl = async (
	fetchFn: typeof fetch,
	url: string,
): Promise<Shelter[]> => {
	const response = await fetchFn(url);

	if (!response.ok) {
		throw error(
			502,
			`Failed to fetch shelters from external URL: ${response.status} ${response.statusText}`,
		);
	}

	return await response.json();
};
