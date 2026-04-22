import type { Shelter, ShelterCategory } from './types';
export type { ShelterCategory } from './types';

type ShelterAddress = Pick<Shelter, 'addressLine1' | 'addressLine2' | 'city' | 'state' | 'zip'>;

type ShelterAmenities = Pick<Shelter, 'petFriendly' | 'hasBackupPower' | 'accessibility'>;
export type ShelterAmenity = 'petsAllowed' | 'backupPower' | 'accessibility';

export const formatShelterAddress = ({
	addressLine1,
	addressLine2,
	city,
	state,
	zip,
}: ShelterAddress): string => {
	const parts: string[] = [];
	const streetAddress = [addressLine1, addressLine2].filter((part) => part !== '').join(', ');

	if (streetAddress !== '') {
		parts.push(streetAddress);
	}

	if (city !== '') {
		parts.push(city);
	}

	const stateZip = [state, zip].filter((part) => part !== '').join(' ');
	if (stateZip !== '') {
		parts.push(stateZip);
	}

	return parts.length > 0 ? parts.join(', ') : 'Address not listed';
};

export const normalizeShelterCategory = (category?: string): ShelterCategory => {
	const normalized = category?.toLowerCase();

	if (normalized === 'school') {
		return normalized;
	}

	if (normalized === 'church') {
		return normalized;
	}

	return 'other';
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

export const formatShelterDistance = (distanceMiles?: number | null): string | null => {
	if (distanceMiles === undefined || distanceMiles === null || Number.isNaN(distanceMiles)) {
		return null;
	}

	if (distanceMiles < 1) {
		return `${Math.round(distanceMiles * 5280)} ft`;
	}

	return `${distanceMiles.toFixed(1)} mi`;
};

export const formatShelterCategory = (category?: ShelterCategory): string => {
	const displayMap: Record<ShelterCategory, string> = {
		school: 'School',
		church: 'Church',
		other: 'Other',
	};
	const normalized = category ?? 'other';
	return displayMap[normalized];
};

export const formatShelterBoolean = (
	value: boolean | undefined,
	labels: { yes: string; no: string; unknown: string },
): string => {
	if (value === true) {
		return labels.yes;
	}

	if (value === false) {
		return labels.no;
	}

	return labels.unknown;
};

export const formatShelterCapacity = (capacity?: number): string => {
	if (capacity === undefined || Number.isNaN(capacity)) {
		return 'Capacity not listed';
	}

	return `${Math.round(capacity).toLocaleString()} people`;
};

export const formatShelterHours = (hasHours: boolean): string => {
	return hasHours ? 'Available hours listed' : 'Hours not listed';
};

export const formatVerificationStatus = (lastUpdated?: string): 'Open' | 'Unknown' => {
	return (lastUpdated ?? '') === '' ? 'Unknown' : 'Open';
};

export const formatLastVerifiedDate = (lastUpdated?: string): string => {
	const date = lastUpdated ?? '';
	return date === '' ? 'Unknown' : date;
};

export const formatSpecialInstructions = (instructions?: string): string => {
	const value = instructions ?? '';
	return value === '' ? 'No special instructions provided.' : value;
};
