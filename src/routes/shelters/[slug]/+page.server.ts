import { error } from '@sveltejs/kit';
import { loadSheltersAtBuildTime } from '$lib/shelters/source.server';
import type { Shelter } from '$lib/shelters/types';

let shelterCache: Shelter[] | null = null;

export const entries = async () => {
	const shelters = await loadSheltersAtBuildTime(fetch);
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
	if (!shelterCache) {
		shelterCache = await loadSheltersAtBuildTime(fetch);
	}

	const shelter = shelterCache.find((s) => s.slug === params.slug);

	if (!shelter) {
		throw error(404, 'Shelter not found');
	}

	return { shelter };
};
