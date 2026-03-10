import { derived, writable } from 'svelte/store';
import type { GeoPoint } from '$lib/geo';

export const userLocation = writable<GeoPoint | null>(null);
export const hasLocation = derived(userLocation, ($userLocation) => $userLocation !== null);
