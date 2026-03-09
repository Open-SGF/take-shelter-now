import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import type { Shelter } from '$lib/shelters/types';
import { buildGoogleSheetCsvUrl, getPublicSheltersFromCsv } from '$lib/shelters/sheet';

export const prerender = true;

let sheltersCachePromise: Promise<Shelter[]> | undefined;

const getSheltersCached = (fetchFn: typeof fetch): Promise<Shelter[]> => {
	if (!sheltersCachePromise) {
		sheltersCachePromise = (async () => {
			const sheetUrl = buildGoogleSheetCsvUrl(env.GOOGLE_SHEET_ID, env.GOOGLE_SHEET_GID);

			if (!sheetUrl) {
				return [];
			}

			const response = await fetchFn(sheetUrl);

			if (!response.ok) {
				throw error(
					502,
					`Failed to fetch Google Sheet CSV: ${response.status} ${response.statusText}`,
				);
			}

			const csvText = await response.text();
			return getPublicSheltersFromCsv(csvText);
		})().catch((loadError) => {
			sheltersCachePromise = undefined;
			throw loadError;
		});
	}

	return sheltersCachePromise;
};

export const GET: RequestHandler = async ({ fetch }) => {
	const shelters = await getSheltersCached(fetch);
	return json(shelters);
};
