export type ShelterHoursInterval = {
	startMinute: number;
	endMinute: number;
};

export type ShelterHours = {
	timeZone: string;
	intervals: ShelterHoursInterval[];
};

export type Shelter = {
	name: string;
	slug: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;
	capacity?: number;
	category?: string;
	petFriendly?: boolean;
	accessibility?: boolean;
	hasBackupPower?: boolean;
	hours?: ShelterHours;
	specialInstructions?: string;
	shelterType?: string;
	photoUrls: string[];
	lastUpdated?: string;
};
