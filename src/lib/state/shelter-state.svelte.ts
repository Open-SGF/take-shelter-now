import { createContext } from 'svelte';
import type { Shelter } from '$lib/shelters/types';
import { calculateDistance } from '$lib/utils';

type ShelterWithDistance = Shelter & { distance: number };

export type ShelterDataState =
	| { kind: 'loading' }
	| { kind: 'empty' }
	| { kind: 'ready'; shelters: Shelter[] }
	| { kind: 'error'; message: string };

export type ShelterState = {
	readonly dataState: ShelterDataState;
	readonly sheltersWithDistance: ShelterWithDistance[];
	setShelters: (shelters: Shelter[]) => void;
	setLoading: () => void;
	setError: (message: string) => void;
};

export type LocationGetter = () => { latitude: number; longitude: number } | null;

export const [getShelterStateContext, setShelterStateContext] = createContext<ShelterState>();

export const createShelterState = (getLocation: LocationGetter): ShelterState => {
	let dataState = $state<ShelterDataState>({ kind: 'loading' });

	const setShelters = (shelters: Shelter[]) => {
		dataState = shelters.length > 0 ? { kind: 'ready', shelters } : { kind: 'empty' };
	};

	const setLoading = () => {
		dataState = { kind: 'loading' };
	};

	const setError = (message: string) => {
		dataState = { kind: 'error', message };
	};

	const sheltersWithDistance = $derived.by<ShelterWithDistance[]>(() => {
		const shelters = dataState.kind === 'ready' ? dataState.shelters : [];
		const location = getLocation();

		if (location === null) {
			return shelters.map((shelter) => ({ ...shelter, distance: 0 }));
		}

		return shelters
			.map((shelter) => ({
				...shelter,
				distance: calculateDistance(
					location.latitude,
					location.longitude,
					shelter.latitude,
					shelter.longitude,
				),
			}))
			.sort((a, b) => a.distance - b.distance);
	});

	return {
		get dataState() {
			return dataState;
		},
		get sheltersWithDistance() {
			return sheltersWithDistance;
		},
		setShelters,
		setLoading,
		setError,
	};
};
