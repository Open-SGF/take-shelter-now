import { describe, expect, test, beforeEach } from 'vitest';
import { createUserState } from './user-state.svelte';
import { storage } from '$lib/storage';

describe('createUserState', () => {
	beforeEach(() => {
		storage.clear();
	});

	test('starts with undefined directions app when nothing in storage', () => {
		const userState = createUserState();

		expect(userState.directionsApp).toBe(undefined);
	});

	test('reads directions app from storage', () => {
		storage.set('directions-app', 'apple');

		const userState = createUserState();

		expect(userState.directionsApp).toBe('apple');
	});

	test('setDirectionsApp updates state and storage', () => {
		const userState = createUserState();

		userState.setDirectionsApp('google');

		expect(userState.directionsApp).toBe('google');
		expect(storage.get('directions-app')).toBe('google');
	});

	test('setDirectionsApp with undefined clears storage', () => {
		storage.set('directions-app', 'apple');
		const userState = createUserState();

		userState.setDirectionsApp(undefined);

		expect(userState.directionsApp).toBe(undefined);
		expect(storage.get('directions-app')).toBe(null);
	});
});
