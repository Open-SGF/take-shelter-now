import { error } from '@sveltejs/kit';
import type { Shelter } from '$lib/shelters/types';

export const load = async ({
	params,
	parent,
}: {
	params: { slug: string };
	parent: () => Promise<{ shelters: Shelter[] }>;
}) => {
	const { shelters } = await parent();
	const shelter = shelters.find((entry) => entry.slug === params.slug);

	if (!shelter) {
		throw error(404, 'Shelter not found');
	}

	return { shelter };
};
