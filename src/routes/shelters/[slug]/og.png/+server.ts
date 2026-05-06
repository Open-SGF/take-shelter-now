import { error } from '@sveltejs/kit';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from './$types';
import ShelterOgImage from '$lib/components/social/ShelterOgImage.svelte';
import { summarizeShelterHours } from '$lib/shelters/hours-presentation';
import { formatShelterCategory, getAvailableAmenities } from '$lib/shelters/presentation';
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

	const subtitle = shelter.addressLine1;
	const location = [shelter.city, shelter.state].filter((part) => part !== '').join(', ');
	const hoursSummary = summarizeShelterHours(shelter.hours);
	const amenityLabelMap = {
		petsAllowed: 'Pets allowed',
		backupPower: 'Backup power',
		accessibility: 'Accessible',
	} as const;
	const tags = [
		hoursSummary.statusLabel,
		formatShelterCategory(shelter.category),
		...getAvailableAmenities(shelter).map((amenity) => amenityLabelMap[amenity]),
	].slice(0, 4);

	return new ImageResponse(
		ShelterOgImage,
		{
			width: 1200,
			height: 630,
		},
		{
			title: shelter.name,
			subtitle,
			label: 'Emergency shelter',
			location,
			tags,
		}
	);
};
