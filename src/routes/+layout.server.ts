import { loadSheltersAtBuildTime } from '$lib/shelters/source.server';

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
	const shelters = await loadSheltersAtBuildTime(fetch);

	return {
		shelters,
	};
};
