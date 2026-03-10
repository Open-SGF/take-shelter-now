import { loadSheltersAtBuildTime } from '$lib/shelters/source.server';

export const prerender = true;

export const entries = async () => {
	const shelters = await loadSheltersAtBuildTime(fetch);

	return shelters.map((shelter) => ({
		slug: shelter.slug,
	}));
};
