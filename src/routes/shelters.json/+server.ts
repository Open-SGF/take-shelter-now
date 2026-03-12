import { json } from '@sveltejs/kit';
import { loadSheltersAtBuildTime } from '$lib/shelters/source.server';

export const prerender = true;

export const GET = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
	const shelters = await loadSheltersAtBuildTime(fetch);
	return json(shelters);
};
