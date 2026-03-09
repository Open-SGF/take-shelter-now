import { writable } from 'svelte/store';
import type { GeoPoint } from '$lib/geo';
import type { Shelter } from '$lib/shelters/types';
import { loadSheltersFromSource } from '$lib/shelters/source';

// Tracks whether user has allowed location access
export const hasLocation = writable(false);

// Stores user's current location
export const userLocation = writable<GeoPoint | null>(null);

export type SheltersLoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export const shelters = writable<Shelter[]>([]);
export const sheltersLoadStatus = writable<SheltersLoadStatus>('idle');
export const sheltersLoadError = writable<string | undefined>(undefined);

let loadSheltersRequest: Promise<void> | null = null;

export const ensureSheltersLoaded = (fetchFn: typeof fetch = fetch): Promise<void> => {
	if (loadSheltersRequest) {
		return loadSheltersRequest;
	}

	sheltersLoadStatus.set('loading');
	sheltersLoadError.set(undefined);

	loadSheltersRequest = loadSheltersFromSource(fetchFn)
		.then((result) => {
			shelters.set(result.shelters);

			if (result.errorMessage) {
				sheltersLoadError.set(result.errorMessage);
				sheltersLoadStatus.set('error');
				return;
			}

			sheltersLoadStatus.set('ready');
		})
		.catch(() => {
			shelters.set([]);
			sheltersLoadError.set('Shelter data is temporarily unavailable.');
			sheltersLoadStatus.set('error');
		})
		.finally(() => {
			loadSheltersRequest = null;
		});

	return loadSheltersRequest;
};
