import { derived, writable, type Readable } from 'svelte/store';
import type { GeoPoint } from '$lib/geo';
import type { Shelter } from '$lib/shelters/types';
import { calculateDistance } from '$lib/utils';

type SheltersState = {
	items: Shelter[];
};

export const createSheltersStore = (initialShelters: Shelter[]) => {
	const state = writable<SheltersState>({ items: initialShelters });

	const setShelters = (items: Shelter[]) => {
		state.set({ items });
	};

	const withDistance = (location: Readable<GeoPoint | null>) =>
		derived([state, location], ([$state, $location]) => {
			if ($location === null) {
				return $state.items.map((shelter) => ({ ...shelter, distance: 0 }));
			}

			return $state.items
				.map((shelter) => ({
					...shelter,
					distance: calculateDistance(
						$location.latitude,
						$location.longitude,
						shelter.latitude,
						shelter.longitude,
					),
				}))
				.sort((a, b) => a.distance - b.distance);
		});

	return {
		subscribe: state.subscribe,
		setShelters,
		withDistance,
	};
};

export type SheltersStore = ReturnType<typeof createSheltersStore>;
