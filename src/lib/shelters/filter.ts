import type { ShelterCategory } from './types';

export type ShelterFilters = {
	petFriendly: boolean;
	accessibility: boolean;
	hasBackupPower: boolean;
	categories: ShelterCategory[];
};

export const defaultFilters: ShelterFilters = {
	petFriendly: false,
	accessibility: false,
	hasBackupPower: false,
	categories: [],
};

export const filtersToSearchParams = (filters: ShelterFilters): URLSearchParams => {
	const params = new URLSearchParams();

	if (filters.petFriendly) {
		params.set('pets', 'true');
	}
	if (filters.accessibility) {
		params.set('accessible', 'true');
	}
	if (filters.hasBackupPower) {
		params.set('power', 'true');
	}
	if (filters.categories.length > 0) {
		params.set('categories', filters.categories.join(','));
	}

	return params;
};

export const searchParamsToFilters = (params: URLSearchParams): ShelterFilters => {
	return {
		petFriendly: params.get('pets') === 'true',
		accessibility: params.get('accessible') === 'true',
		hasBackupPower: params.get('power') === 'true',
		categories: parseCategoriesParam(params.get('categories')),
	};
};

const parseCategoriesParam = (value: string | null): ShelterCategory[] => {
	if (!value) {
		return [];
	}

	const validCategories: Set<ShelterCategory> = new Set(['school', 'church', 'other']);
	const categories = value.split(',').map((c) => c.trim() as ShelterCategory);

	return categories.filter((c) => validCategories.has(c));
};
