import type { GeoPoint } from '$lib/geo';
import type { Shelter } from '$lib/shelters/types';
import { calculateDistance } from '$lib/utils';

type ShelterWithDistance = Shelter & { distance: number };
export type ShelterDataState =
	| { kind: 'loading' }
	| { kind: 'empty' }
	| { kind: 'ready'; shelters: Shelter[] }
	| { kind: 'error'; message: string };

export type MapProvider = 'apple' | 'google';

const MAP_PROVIDER_STORAGE_KEY = 'take-shelter-map-provider';

export type AppState = {
	readonly location: GeoPoint | null;
	readonly hasLocation: boolean;
	readonly sheltersWithDistance: ShelterWithDistance[];
	readonly shelterDataState: ShelterDataState;
	readonly preferredMapProvider: MapProvider | null;
	setLocation: (nextLocation: GeoPoint | null) => void;
	setShelters: (nextShelters: Shelter[]) => void;
	setShelterDataError: (errorMessage: string) => void;
	setShelterDataLoading: () => void;
	setPreferredMapProvider: (provider: MapProvider | null) => void;
};

const readMapProviderFromStorage = (): MapProvider | null => {
	if (typeof window === 'undefined') return null;
	try {
		const saved = localStorage.getItem(MAP_PROVIDER_STORAGE_KEY);
		if (saved === 'apple' || saved === 'google') {
			return saved;
		}
	} catch {
		// localStorage not available
	}
	return null;
};

const writeMapProviderToStorage = (provider: MapProvider | null): void => {
	if (typeof window === 'undefined') return;
	try {
		if (provider === null) {
			localStorage.removeItem(MAP_PROVIDER_STORAGE_KEY);
		} else {
			localStorage.setItem(MAP_PROVIDER_STORAGE_KEY, provider);
		}
	} catch {
		// localStorage not available
	}
};

export const createAppState = (initialShelters: Shelter[]): AppState => {
	let location = $state<GeoPoint | null>(null);
	let shelterDataState = $state<ShelterDataState>(
		initialShelters.length > 0 ? { kind: 'ready', shelters: initialShelters } : { kind: 'loading' },
	);
	let preferredMapProvider = $state<MapProvider | null>(readMapProviderFromStorage());

	const setLocation = (nextLocation: GeoPoint | null) => {
		location = nextLocation;
	};

	const setShelters = (nextShelters: Shelter[]) => {
		shelterDataState =
			nextShelters.length > 0 ? { kind: 'ready', shelters: nextShelters } : { kind: 'empty' };
	};

	const setShelterDataError = (errorMessage: string) => {
		shelterDataState = { kind: 'error', message: errorMessage };
	};

	const setShelterDataLoading = () => {
		shelterDataState = { kind: 'loading' };
	};

	const setPreferredMapProvider = (provider: MapProvider | null) => {
		preferredMapProvider = provider;
		writeMapProviderToStorage(provider);
	};

	const hasLocation = $derived(location !== null);
	const sheltersWithDistance = $derived.by<ShelterWithDistance[]>(() => {
		const shelters = shelterDataState.kind === 'ready' ? shelterDataState.shelters : [];

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
		get shelterDataState() {
			return shelterDataState;
		},
		get preferredMapProvider() {
			return preferredMapProvider;
		},
		setLocation,
		setShelters,
		setShelterDataError,
		setShelterDataLoading,
		setPreferredMapProvider,
	};
};
