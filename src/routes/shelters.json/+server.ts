import type { RequestHandler } from './$types';
import { loadSheltersAtBuildTime } from '#lib/shelters/source.server.js';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch }) => {
	const shelters = await loadSheltersAtBuildTime(fetch);
	return Response.json(shelters);
};
