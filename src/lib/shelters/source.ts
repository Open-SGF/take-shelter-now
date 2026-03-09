import type { Shelter } from './types';

export const SHELTERS_ENDPOINT = '/shelters.json';

export type SheltersLoadResult = {
	shelters: Shelter[];
	errorMessage?: string;
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null;
};

export const normalizeSheltersPayload = (payload: unknown) => {
	if (!Array.isArray(payload)) {
		return [];
	}

	return payload.filter((entry): entry is Shelter => isObjectRecord(entry));
};

export const loadSheltersFromSource = async (
	fetchFn: typeof fetch,
	endpoint = SHELTERS_ENDPOINT,
): Promise<SheltersLoadResult> => {
	try {
		const response = await fetchFn(endpoint);

		if (!response.ok) {
			return {
				shelters: [],
				errorMessage: `Unable to load shelters (${response.status}).`,
			};
		}

		const payload: unknown = await response.json();
		const shelters = normalizeSheltersPayload(payload);

		if (shelters.length === 0) {
			return {
				shelters,
				errorMessage: 'Shelter data is temporarily unavailable.',
			};
		}

		return { shelters };
	} catch {
		return {
			shelters: [],
			errorMessage: 'Shelter data is temporarily unavailable.',
		};
	}
};
