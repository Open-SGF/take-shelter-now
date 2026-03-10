import { getContext, setContext } from 'svelte';
import type { SheltersStore } from './shelters';

const SHELTERS_STORE_CONTEXT_KEY = Symbol('shelters-store');

export const setSheltersStoreContext = (store: SheltersStore) => {
	setContext(SHELTERS_STORE_CONTEXT_KEY, store);
};

export const getSheltersStoreContext = () => {
	return getContext<SheltersStore>(SHELTERS_STORE_CONTEXT_KEY);
};
