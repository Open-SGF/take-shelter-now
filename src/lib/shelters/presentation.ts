import type { Shelter } from './types';

type ShelterAddress = Pick<Shelter, 'addressLine1' | 'addressLine2' | 'city' | 'state' | 'zip'>;

type ShelterAmenities = Pick<Shelter, 'petFriendly' | 'hasBackupPower' | 'accessibility'>;

export type ShelterCategory = 'School' | 'Church' | 'Other';
export type ShelterAmenity = 'petsAllowed' | 'backupPower' | 'accessibility';

export const formatShelterAddress = ({
	addressLine1,
	addressLine2,
	city,
	state,
	zip,
}: ShelterAddress): string => {
	const streetAddress = addressLine2 ? `${addressLine1}, ${addressLine2}` : addressLine1;
	return `${streetAddress}, ${city}, ${state} ${zip}`;
};

export const normalizeShelterCategory = (category: Shelter['category']): ShelterCategory => {
	const normalized = category?.trim().toLowerCase();

	if (normalized === 'school') {
		return 'School';
	}

	if (normalized === 'church') {
		return 'Church';
	}

	return 'Other';
};

export const getAvailableAmenities = ({
	petFriendly,
	hasBackupPower,
	accessibility,
}: ShelterAmenities): ShelterAmenity[] => {
	const amenities: ShelterAmenity[] = [];

	if (petFriendly) {
		amenities.push('petsAllowed');
	}

	if (hasBackupPower) {
		amenities.push('backupPower');
	}

	if (accessibility) {
		amenities.push('accessibility');
	}

	return amenities;
};

export const formatShelterDistance = (distanceMiles: number | null | undefined): string | null => {
	if (distanceMiles === undefined || distanceMiles === null || Number.isNaN(distanceMiles)) {
		return null;
	}

	if (distanceMiles < 1) {
		return `${Math.round(distanceMiles * 5280)} ft`;
	}

	return `${distanceMiles.toFixed(1)} mi`;
};
