import { getContext, setContext } from 'svelte';
import type { GeoPoint } from '$lib/geo';

export type LocationMethod = 'geolocation' | 'address';

export type StoredLocation = GeoPoint & {
	address?: string;
};

export type LocationStatus =
	| { kind: 'idle' }
	| { kind: 'loading'; method: LocationMethod }
	| { kind: 'ready'; method: LocationMethod }
	| {
			kind: 'error';
			message: string;
			code?: 'permission_denied' | 'position_unavailable' | 'timeout';
	  };

export type PendingLocation = {
	location: GeoPoint;
	address?: string;
	method: LocationMethod;
};

export type LocationState = {
	readonly location: StoredLocation | null;
	readonly status: LocationStatus;
	readonly pendingLocation: PendingLocation | null;
	readonly hasLocation: boolean;
	setLocation: (location: StoredLocation | null) => void;
	setLoading: (method: LocationMethod) => void;
	setReady: (location: GeoPoint, method: LocationMethod, address?: string) => void;
	setError: (
		message: string,
		code?: 'permission_denied' | 'position_unavailable' | 'timeout',
	) => void;
	setIdle: () => void;
	setPendingLocation: (pending: PendingLocation | null) => void;
	confirmPendingLocation: () => void;
	clearLocation: () => void;
};

const LOCATION_STATE_CONTEXT_KEY = Symbol('location-state');

export const setLocationStateContext = (locationState: LocationState) => {
	setContext(LOCATION_STATE_CONTEXT_KEY, locationState);
};

export const getLocationStateContext = () => {
	return getContext<LocationState>(LOCATION_STATE_CONTEXT_KEY);
};

const LOCATION_STORAGE_KEY = 'take-shelter-location';

const readLocationFromStorage = (): StoredLocation | null => {
	if (typeof window === 'undefined') return null;
	try {
		const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved) as StoredLocation;
			if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
				return parsed;
			}
		}
	} catch {
		// localStorage not available or invalid JSON
	}
	return null;
};

const writeLocationToStorage = (location: StoredLocation | null): void => {
	if (typeof window === 'undefined') return;
	try {
		if (location === null) {
			localStorage.removeItem(LOCATION_STORAGE_KEY);
		} else {
			localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
		}
	} catch {
		// localStorage not available
	}
};

export const createLocationState = (): LocationState => {
	let location = $state<StoredLocation | null>(readLocationFromStorage());
	let status = $state<LocationStatus>({ kind: 'idle' });
	let pendingLocation = $state<PendingLocation | null>(null);

	const setLocation = (nextLocation: StoredLocation | null) => {
		location = nextLocation;
		writeLocationToStorage(nextLocation);
		if (nextLocation) {
			status = { kind: 'ready', method: 'geolocation' };
		}
	};

	const setLoading = (method: LocationMethod) => {
		status = { kind: 'loading', method };
	};

	const setReady = (loc: GeoPoint, method: LocationMethod, address?: string) => {
		const stored: StoredLocation = { ...loc, address };
		location = stored;
		writeLocationToStorage(stored);
		status = { kind: 'ready', method };
		pendingLocation = null;
	};

	const setError = (
		message: string,
		code?: 'permission_denied' | 'position_unavailable' | 'timeout',
	) => {
		status = { kind: 'error', message, code };
	};

	const setIdle = () => {
		status = { kind: 'idle' };
	};

	const setPendingLocation = (pending: PendingLocation | null) => {
		pendingLocation = pending;
	};

	const confirmPendingLocation = () => {
		if (pendingLocation) {
			const stored: StoredLocation = {
				...pendingLocation.location,
				address: pendingLocation.address,
			};
			location = stored;
			writeLocationToStorage(stored);
			status = { kind: 'ready', method: pendingLocation.method };
			pendingLocation = null;
		}
	};

	const clearLocation = () => {
		location = null;
		writeLocationToStorage(null);
		status = { kind: 'idle' };
		pendingLocation = null;
	};

	const hasLocation = $derived(location !== null);

	return {
		get location() {
			return location;
		},
		get status() {
			return status;
		},
		get pendingLocation() {
			return pendingLocation;
		},
		get hasLocation() {
			return hasLocation;
		},
		setLocation,
		setLoading,
		setReady,
		setError,
		setIdle,
		setPendingLocation,
		confirmPendingLocation,
		clearLocation,
	};
};
