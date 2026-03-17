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
