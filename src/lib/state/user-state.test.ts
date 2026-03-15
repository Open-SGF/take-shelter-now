import { describe, expect, test, beforeEach } from 'vitest';
import { createUserState } from './user-state.svelte';

describe('createUserState', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('starts with null map provider when nothing in storage', () => {
		const userState = createUserState();

		expect(userState.mapProvider).toBe(null);
	});

	test('reads map provider from localStorage', () => {
		localStorage.setItem('take-shelter-map-provider', 'apple');

		const userState = createUserState();

		expect(userState.mapProvider).toBe('apple');
	});

	test('setMapProvider updates state and storage', () => {
		const userState = createUserState();

		userState.setMapProvider('google');

		expect(userState.mapProvider).toBe('google');
		expect(localStorage.getItem('take-shelter-map-provider')).toBe('google');
	});

	test('setMapProvider with null clears storage', () => {
		localStorage.setItem('take-shelter-map-provider', 'apple');
		const userState = createUserState();

		userState.setMapProvider(null);

		expect(userState.mapProvider).toBe(null);
		expect(localStorage.getItem('take-shelter-map-provider')).toBe(null);
	});
});
