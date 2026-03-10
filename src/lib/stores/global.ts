import { writable } from 'svelte/store';

export interface Shelter {
	id: number;
	name: string;
	address_line1: string;
	address_line2: string | null;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;
	capacity: number | null;
	category: string | null;
	shelter_type: string | null;
	accessibility: string | null;
	pet_friendly: string | null;
	has_backup_power: string | null;
	hours_as_shelter: string | null;
	special_instructions: string | null;
	verification_status: string | null;
	availability_status: 'Available' | 'Full' | null;
}

// Tracks whether user has allowed location access
export const hasLocation = writable(false);

// Stores user's current location
export const userLocation = writable<{ latitude: number; longitude: number } | null>(null);

// Stores all shelters with distance calculations (null when location is unknown)
export const shelters = writable<Array<Shelter & { distance: number | null }>>([]);

// Stores the selected shelter coordinates for map zoom
export const selectedShelter = writable<{ lat: number; lng: number } | null>(null);

// Stores active NWS weather alerts
export interface WeatherAlert {
	id: string;
	properties: {
		event: string;
		headline: string | null;
		description: string;
		severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
		areaDesc: string;
		effective: string;
		expires: string;
	};
}
