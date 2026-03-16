import { describe, expect, test, beforeEach } from 'vitest';
import { createUserState } from './user-state.svelte';
import { storage } from '$lib/storage';

describe('createUserState', () => {
	beforeEach(() => {
		storage.clear();
	});

	test('starts with null map provider when nothing in storage', () => {
		const userState = createUserState();

		expect(userState.mapProvider).toBe(null);
	});

	test('reads map provider from storage', () => {
		storage.set('map-provider', 'apple');

		const userState = createUserState();

		expect(userState.mapProvider).toBe('apple');
	});

	test('setMapProvider updates state and storage', () => {
		const userState = createUserState();

		userState.setMapProvider('google');

		expect(userState.mapProvider).toBe('google');
		expect(storage.get('map-provider')).toBe('google');
	});

	test('setMapProvider with null clears storage', () => {
		storage.set('map-provider', 'apple');
		const userState = createUserState();

		userState.setMapProvider(null);

		expect(userState.mapProvider).toBe(null);
		expect(storage.get('map-provider')).toBe(null);
	});
});
