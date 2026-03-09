import { error } from '@sveltejs/kit';
import { normalizeSheltersPayload } from '$lib/shelters/source';
import { GET as sheltersJsonGet } from '../../shelters.json/+server';

export const prerender = true;

const fetchShelters = async (fetchFn: typeof fetch = fetch) => {
	const response = await sheltersJsonGet({ fetch: fetchFn } as Parameters<
		typeof sheltersJsonGet
	>[0]);

	if (!response.ok) {
		throw error(502, `Unable to load shelters (${response.status}).`);
	}

	const payload: unknown = await response.json();
	const shelters = normalizeSheltersPayload(payload);

	if (shelters.length === 0) {
		throw error(502, 'Shelter data is temporarily unavailable.');
	}

	return shelters;
};

export const entries = async () => {
	const shelters = await fetchShelters();

	return shelters.map((shelter) => ({
		slug: shelter.slug,
	}));
};

export const load = async ({
	params,
	fetch,
}: {
	params: { slug: string };
	fetch: typeof globalThis.fetch;
}) => {
	const shelters = await fetchShelters(fetch);
	const shelter = shelters.find((entry) => entry.slug === params.slug);

	if (!shelter) {
		throw error(404, 'Shelter not found');
	}

	return { shelter };
};
