import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { session } from '#lib/storage/index.js';
import type { ShelterFilters } from './filter';
import { filtersToSearchParams } from './filter';

const RETURN_FILTERS_KEY = 'return-filters';

export const navigateToShelterDetail = (slug: string, currentFilters: ShelterFilters) => {
	session.set(RETURN_FILTERS_KEY, currentFilters);
	goto(resolve('/shelters/[slug]', { slug }));
};

export const navigateToShelterList = () => {
	const returnFilters = session.get<ShelterFilters>(RETURN_FILTERS_KEY);
	session.remove(RETURN_FILTERS_KEY);

	const destination = resolve('/(requires-location)');
	const search = returnFilters ? filtersToSearchParams(returnFilters).toString() : '';
	goto(search ? `${destination}?${search}` : destination);
};
