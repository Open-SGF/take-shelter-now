import { error } from '@sveltejs/kit';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { EntryGenerator, RequestHandler } from './$types';
import ShelterOgImage from '#lib/components/social/ShelterOgImage.svelte';
import { formatShelterAddress } from '#lib/shelters/presentation.js';
import { loadSheltersAtBuildTime } from '#lib/shelters/source.server.js';
import type { Shelter } from '#lib/shelters/types.js';

let shelterCache: Shelter[] | null = null;

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const shelters = await loadSheltersAtBuildTime(fetch);
	return shelters.map((shelter) => ({
		slug: shelter.slug,
	}));
};

export const GET: RequestHandler = async ({ params, fetch }) => {
	if (!shelterCache) {
		shelterCache = await loadSheltersAtBuildTime(fetch);
	}

	const shelter = shelterCache.find((item) => item.slug === params.slug);

	if (!shelter) {
		error(404, 'Shelter not found');
	}

	const address = formatShelterAddress(shelter);

	return new ImageResponse(
		ShelterOgImage,
		{
			width: 1200,
			height: 630,
		},
		{
			title: shelter.name,
			address,
		},
	);
};
