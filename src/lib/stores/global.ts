import { writable } from 'svelte/store';
import type { GeoPoint } from '$lib/geo';

// Tracks whether user has allowed location access
export const hasLocation = writable(false);

// Stores user's current location
export const userLocation = writable<GeoPoint | null>(null);
