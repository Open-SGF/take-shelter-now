import { writable } from 'svelte/store';

export interface Shelter {
	Name: string;
	'Address Line 1': string;
	'Address Line 2': string;
	City: string;
	State: string;
	Zip: string;
	Latitude: string;
	Longitude: string;
}

// Tracks whether user has allowed location access
export const hasLocation = writable(false);

// Stores user's current location
export const userLocation = writable<{ latitude: number; longitude: number } | null>(null);

// Stores all shelters with distance calculations
export const shelters = writable<Array<Shelter & { distance: number }>>([]);
