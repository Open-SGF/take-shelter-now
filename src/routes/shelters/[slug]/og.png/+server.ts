import { error } from '@sveltejs/kit';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from './$types';
import OgImage from '$lib/components/social/OgImage.svelte';
import { loadSheltersAtBuildTime } from '$lib/shelters/source.server';
import type { Shelter } from '$lib/shelters/types';

let shelterCache: Shelter[] | null = null;

export const prerender = true;

export const entries = async () => {
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
		throw error(404, 'Shelter not found');
	}

	const subtitle = `${shelter.addressLine1}, ${shelter.city}, ${shelter.state}`;

	return new ImageResponse(
		OgImage,
		{
			width: 1200,
			height: 630,
		},
		{
			title: shelter.name,
			subtitle,
			label: 'Emergency Shelter',
		}
	);
};
