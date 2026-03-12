import { getContext, setContext } from 'svelte';
import type { AppState, MapProvider } from './app-state.svelte';

export type { MapProvider };

const APP_STATE_CONTEXT_KEY = Symbol('app-state');

export const setAppStateContext = (appState: AppState) => {
	setContext(APP_STATE_CONTEXT_KEY, appState);
};

export const getAppStateContext = () => {
	return getContext<AppState>(APP_STATE_CONTEXT_KEY);
};
