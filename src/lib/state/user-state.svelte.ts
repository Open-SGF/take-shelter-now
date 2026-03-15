import { createContext } from 'svelte';

export type MapProvider = 'apple' | 'google';

export type UserState = {
	readonly mapProvider: MapProvider | null;
	setMapProvider: (provider: MapProvider | null) => void;
};

export const [getUserStateContext, setUserStateContext] = createContext<UserState>();

const MAP_PROVIDER_STORAGE_KEY = 'take-shelter-map-provider';

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

export const createUserState = (): UserState => {
	let mapProvider = $state<MapProvider | null>(readMapProviderFromStorage());

	const setMapProvider = (provider: MapProvider | null) => {
		mapProvider = provider;
		writeMapProviderToStorage(provider);
	};

	return {
		get mapProvider() {
			return mapProvider;
		},
		setMapProvider,
	};
};
