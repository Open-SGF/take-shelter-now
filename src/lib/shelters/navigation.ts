import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { session } from '$lib/storage';
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

	if (returnFilters) {
		const params = filtersToSearchParams(returnFilters);
		const search = params.toString();
		goto(resolve(`/?${search}`));
	} else {
		goto(resolve('/'));
	}
};
