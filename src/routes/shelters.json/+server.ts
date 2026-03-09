import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { buildGoogleSheetCsvUrl, getPublicSheltersFromCsv } from '$lib/shelters/sheet';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch }) => {
	let sheetUrl: URL;

	try {
		sheetUrl = buildGoogleSheetCsvUrl(env.GOOGLE_SHEET_ID, env.GOOGLE_SHEET_GID);
	} catch (unknownError) {
		const message = unknownError instanceof Error ? unknownError.message : 'Invalid sheet config';
		throw error(500, message);
	}

	const response = await fetch(sheetUrl);

	if (!response.ok) {
		throw error(502, `Failed to fetch Google Sheet CSV: ${response.status} ${response.statusText}`);
	}

	const csvText = await response.text();
	const shelters = getPublicSheltersFromCsv(csvText);

	return json(shelters);
};
