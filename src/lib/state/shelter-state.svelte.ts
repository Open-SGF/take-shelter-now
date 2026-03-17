import { createContext } from 'svelte';
import type { Shelter, ShelterCategory } from '$lib/shelters/types';
import { calculateDistance } from '$lib/utils';
import { type ShelterFilters, defaultFilters } from '$lib/shelters/filter';

type ShelterWithDistance = Shelter & { distance: number };

export type ShelterDataState =
	| { kind: 'loading' }
	| { kind: 'empty' }
	| { kind: 'ready'; shelters: Shelter[] }
	| { kind: 'error'; message: string };

export type ShelterState = {
	readonly dataState: ShelterDataState;
	readonly sheltersWithDistance: ShelterWithDistance[];
	readonly filteredShelters: ShelterWithDistance[];
	readonly filters: ShelterFilters;
	readonly hasActiveFilters: boolean;
	readonly activeFilterCount: number;
	loadShelters: () => void;
	setFilters: (filters: ShelterFilters) => void;
	setFilter: (key: keyof ShelterFilters, value: boolean | ShelterCategory[]) => void;
	clearFilters: () => void;
};

export type LocationGetter = () => { latitude: number; longitude: number } | null;

export const [getShelterStateContext, setShelterStateContext] = createContext<ShelterState>();

export const createShelterState = (getLocation: LocationGetter): ShelterState => {
	let dataState = $state<ShelterDataState>({ kind: 'loading' });
	let filters = $state<ShelterFilters>({ ...defaultFilters });
	let abortController: AbortController | null = null;

	const setShelters = (shelters: Shelter[]) => {
		dataState = shelters.length > 0 ? { kind: 'ready', shelters } : { kind: 'empty' };
	};

	const setLoading = () => {
		dataState = { kind: 'loading' };
	};

	const setError = (message: string) => {
		dataState = { kind: 'error', message };
	};

	const loadShelters = () => {
		abortController?.abort();
		abortController = new AbortController();

		setLoading();

		fetch('/shelters.json', { signal: abortController.signal })
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to fetch shelters: ${response.status}`);
				}
				return response.json();
			})
			.then((shelters: Shelter[]) => {
				setShelters(shelters);
			})
			.catch((error) => {
				if (error.name !== 'AbortError') {
					setError(error.message);
				}
			});
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

	const activeFilterCount = $derived(
		(filters.petFriendly ? 1 : 0) +
			(filters.accessibility ? 1 : 0) +
			(filters.hasBackupPower ? 1 : 0) +
			filters.categories.length,
	);

	const activeFilters = $derived(activeFilterCount > 0);

	const filteredShelters = $derived.by(() => {
		if (!activeFilters) {
			return sheltersWithDistance;
		}

		return sheltersWithDistance.filter((shelter) => {
			if (filters.petFriendly && !shelter.petFriendly) {
				return false;
			}
			if (filters.accessibility && !shelter.accessibility) {
				return false;
			}
			if (filters.hasBackupPower && !shelter.hasBackupPower) {
				return false;
			}
			if (filters.categories.length > 0) {
				const shelterCategory = shelter.category ?? 'other';
				if (!filters.categories.includes(shelterCategory)) {
					return false;
				}
			}
			return true;
		});
	});

	const setFilters = (newFilters: ShelterFilters) => {
		filters = { ...newFilters };
	};

	const setFilter = (key: keyof ShelterFilters, value: boolean | ShelterCategory[]) => {
		filters = { ...filters, [key]: value };
	};

	const clearFilters = () => {
		filters = { ...defaultFilters };
	};

	return {
		get dataState() {
			return dataState;
		},
		get sheltersWithDistance() {
			return sheltersWithDistance;
		},
		get filteredShelters() {
			return filteredShelters;
		},
		get filters() {
			return filters;
		},
		get hasActiveFilters() {
			return activeFilters;
		},
		get activeFilterCount() {
			return activeFilterCount;
		},
		loadShelters,
		setFilters,
		setFilter,
		clearFilters,
	};
};
