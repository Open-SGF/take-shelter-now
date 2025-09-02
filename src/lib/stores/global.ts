import { writable } from 'svelte/store';

// Example: tracks whether user has allowed location access
export const hasLocation = writable(false);
