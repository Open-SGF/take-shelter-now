import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { buildGoogleSheetCsvUrl, getPublicSheltersFromCsv } from './sheet';
import type { Shelter } from './types';

export const loadSheltersAtBuildTime = async (fetchFn: typeof fetch): Promise<Shelter[]> => {
	const sheetUrl = buildGoogleSheetCsvUrl(env.GOOGLE_SHEET_ID, env.GOOGLE_SHEET_GID);

	if (!sheetUrl) {
		throw error(500, 'Shelter source is not configured.');
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
