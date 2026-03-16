import { createContext } from 'svelte';
import { storage } from '$lib/storage';

export type MapProvider = 'apple' | 'google';

export type UserState = {
	readonly mapProvider: MapProvider | null;
	setMapProvider: (provider: MapProvider | null) => void;
};

export const [getUserStateContext, setUserStateContext] = createContext<UserState>();

const MAP_PROVIDER_KEY = 'map-provider';

const readMapProviderFromStorage = (): MapProvider | null => {
	const saved = storage.get<string>(MAP_PROVIDER_KEY);
	if (saved === 'apple' || saved === 'google') {
		return saved;
	}
	return null;
};

const writeMapProviderToStorage = (provider: MapProvider | null): void => {
	if (provider === null) {
		storage.remove(MAP_PROVIDER_KEY);
	} else {
		storage.set(MAP_PROVIDER_KEY, provider);
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
