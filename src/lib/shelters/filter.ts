import type { Shelter, ShelterCategory } from './types';

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

export const hasActiveFilters = (filters: ShelterFilters): boolean => {
	if (filters.petFriendly) {
		return true;
	}
	if (filters.accessibility) {
		return true;
	}
	if (filters.hasBackupPower) {
		return true;
	}
	if (filters.categories.length > 0) {
		return true;
	}
	return false;
};

export const countActiveFilters = (filters: ShelterFilters): number => {
	let count = 0;
	if (filters.petFriendly) {
		count++;
	}
	if (filters.accessibility) {
		count++;
	}
	if (filters.hasBackupPower) {
		count++;
	}
	count += filters.categories.length;
	return count;
};

export const filterShelters = <T extends Shelter>(shelters: T[], filters: ShelterFilters): T[] => {
	if (!hasActiveFilters(filters)) {
		return shelters;
	}

	return shelters.filter((shelter) => {
		if (filters.petFriendly && !shelter.petFriendly) {
			return false;
		}

		if (filters.accessibility && !shelter.accessibility) {
			return false;
		}

		if (filters.hasBackupPower && !shelter.hasBackupPower) {
			return false;
		}

		if (filters.categories.length > 0) {
			const shelterCategory = shelter.category ?? 'other';
			if (!filters.categories.includes(shelterCategory)) {
				return false;
			}
		}

		return true;
	});
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
