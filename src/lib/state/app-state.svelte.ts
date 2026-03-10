import type { GeoPoint } from '$lib/geo';
import type { Shelter } from '$lib/shelters/types';
import { calculateDistance } from '$lib/utils';

type ShelterWithDistance = Shelter & { distance: number };

export const createAppState = (initialShelters: Shelter[]) => {
	let location = $state<GeoPoint | null>(null);
	let shelters = $state(initialShelters);

	const setLocation = (nextLocation: GeoPoint | null) => {
		location = nextLocation;
	};

	const setShelters = (nextShelters: Shelter[]) => {
		shelters = nextShelters;
	};

	const hasLocation = $derived(location !== null);
	const sheltersWithDistance = $derived.by<ShelterWithDistance[]>(() => {
		if (location === null) {
			return shelters.map((shelter) => ({ ...shelter, distance: 0 }));
		}

		const currentLocation = location;

		return shelters
			.map((shelter) => ({
				...shelter,
				distance: calculateDistance(
					currentLocation.latitude,
					currentLocation.longitude,
					shelter.latitude,
					shelter.longitude,
				),
			}))
			.sort((a, b) => a.distance - b.distance);
	});

	return {
		get location() {
			return location;
		},
		get hasLocation() {
			return hasLocation;
		},
		get sheltersWithDistance() {
			return sheltersWithDistance;
		},
		setLocation,
		setShelters,
	};
};

export type AppState = ReturnType<typeof createAppState>;
