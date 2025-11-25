import { writable } from 'svelte/store';

// Tracks whether user has allowed location access
export const hasLocation = writable(false);

// Stores user's current location
export const userLocation = writable<{ latitude: number; longitude: number } | null>(null);
