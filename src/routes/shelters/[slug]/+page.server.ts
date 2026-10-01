import { error } from '@sveltejs/kit';
import { loadSheltersAtBuildTime } from '#lib/shelters/source.server.js';
import type { Shelter } from '#lib/shelters/types.js';
import type { EntryGenerator, PageServerLoad } from './$types';

let shelterCache: Shelter[] | null = null;

export const entries: EntryGenerator = async () => {
	const shelters = await loadSheltersAtBuildTime(fetch);
	return shelters.map((shelter) => ({
		slug: shelter.slug,
	}));
};

export const load: PageServerLoad = async ({ params, fetch }) => {
	if (!shelterCache) {
		shelterCache = await loadSheltersAtBuildTime(fetch);
	}

	const shelter = shelterCache.find((s) => s.slug === params.slug);

	if (!shelter) {
		error(404, 'Shelter not found');
	}

	return { shelter };
};
