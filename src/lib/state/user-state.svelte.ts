import { createContext } from 'svelte';
import { storage } from '$lib/storage';

export type DirectionsApp = 'apple' | 'google';

export type UserState = {
	readonly directionsApp?: DirectionsApp;
	setDirectionsApp: (app?: DirectionsApp) => void;
};

export const [getUserStateContext, setUserStateContext] = createContext<UserState>();

const DIRECTIONS_APP_KEY = 'directions-app';

const readDirectionsAppFromStorage = (): DirectionsApp | undefined => {
	const saved = storage.get<string>(DIRECTIONS_APP_KEY);
	if (saved === 'apple' || saved === 'google') {
		return saved;
	}
	return undefined;
};

const writeDirectionsAppToStorage = (app?: DirectionsApp): void => {
	if (app === undefined) {
		storage.remove(DIRECTIONS_APP_KEY);
	} else {
		storage.set(DIRECTIONS_APP_KEY, app);
	}
};

export const createUserState = (): UserState => {
	let directionsApp = $state<DirectionsApp | undefined>(readDirectionsAppFromStorage());

	const setDirectionsApp = (app?: DirectionsApp) => {
		directionsApp = app;
		writeDirectionsAppToStorage(app);
	};

	return {
		get directionsApp() {
			return directionsApp;
		},
		setDirectionsApp,
	};
};
