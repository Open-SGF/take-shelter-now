import { createContext } from 'svelte';
import { storage } from '$lib/storage';

export type DirectionsApp = 'apple' | 'google';

export type UserState = {
	readonly directionsApp?: DirectionsApp;
	readonly radarEnabled: boolean;
	setDirectionsApp: (app?: DirectionsApp) => void;
	setRadarEnabled: (enabled: boolean) => void;
};

export const [getUserStateContext, setUserStateContext] = createContext<UserState>();

const DIRECTIONS_APP_KEY = 'directions-app';
const RADAR_ENABLED_KEY = 'radar-enabled';

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
	let radarEnabled = $state<boolean>(storage.get<boolean>(RADAR_ENABLED_KEY) ?? false);

	const setDirectionsApp = (app?: DirectionsApp) => {
		directionsApp = app;
		writeDirectionsAppToStorage(app);
	};

	const setRadarEnabled = (enabled: boolean) => {
		radarEnabled = enabled;
		storage.set(RADAR_ENABLED_KEY, enabled);
	};

	return {
		get directionsApp() {
			return directionsApp;
		},
		get radarEnabled() {
			return radarEnabled;
		},
		setDirectionsApp,
		setRadarEnabled,
	};
};
