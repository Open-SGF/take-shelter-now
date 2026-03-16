import { describe, expect, test, beforeEach } from 'vitest';
import { createLocationState } from './location-state.svelte';
import { storage } from '$lib/storage';

describe('createLocationState', () => {
	beforeEach(() => {
		storage.clear();
	});

	test('starts with idle status and no location', () => {
		const locationState = createLocationState();

		expect(locationState.status.kind).toBe('idle');
		expect(locationState.hasLocation).toBe(false);
		expect(locationState.location).toBe(null);
	});

	test('reads location from storage', () => {
		const stored = { latitude: 37.2, longitude: -93.2, address: '123 Main St' };
		storage.set('location', stored);

		const locationState = createLocationState();

		expect(locationState.hasLocation).toBe(true);
		expect(locationState.location).toEqual(stored);
	});

	test('setLoading sets loading status', () => {
		const locationState = createLocationState();

		locationState.setLoading('geolocation');

		expect(locationState.status.kind).toBe('loading');
		if (locationState.status.kind === 'loading') {
			expect(locationState.status.method).toBe('geolocation');
		}
	});

	test('setReady sets location and status', () => {
		const locationState = createLocationState();
		const location = { latitude: 37.2, longitude: -93.2 };

		locationState.setReady(location, 'address', '123 Main St');

		expect(locationState.status.kind).toBe('ready');
		expect(locationState.hasLocation).toBe(true);
		expect(locationState.location?.latitude).toBe(37.2);
		expect(locationState.location?.address).toBe('123 Main St');
	});

	test('setError sets error status', () => {
		const locationState = createLocationState();

		locationState.setError('Permission denied', 'permission_denied');

		expect(locationState.status.kind).toBe('error');
		if (locationState.status.kind === 'error') {
			expect(locationState.status.message).toBe('Permission denied');
			expect(locationState.status.code).toBe('permission_denied');
		}
	});

	test('setIdle resets to idle status', () => {
		const locationState = createLocationState();
		locationState.setLoading('geolocation');

		locationState.setIdle();

		expect(locationState.status.kind).toBe('idle');
	});

	test('setPendingLocation stores pending location', () => {
		const locationState = createLocationState();
		const pending = {
			location: { latitude: 37.2, longitude: -93.2 },
			address: '123 Main St',
			method: 'address' as const,
		};

		locationState.setPendingLocation(pending);

		expect(locationState.pendingLocation).toEqual(pending);
		expect(locationState.hasLocation).toBe(false);
	});

	test('confirmPendingLocation moves pending to confirmed', () => {
		const locationState = createLocationState();
		const pending = {
			location: { latitude: 37.2, longitude: -93.2 },
			address: '123 Main St',
			method: 'address' as const,
		};

		locationState.setPendingLocation(pending);
		locationState.confirmPendingLocation();

		expect(locationState.pendingLocation).toBe(null);
		expect(locationState.hasLocation).toBe(true);
		expect(locationState.location?.latitude).toBe(37.2);
		expect(locationState.location?.address).toBe('123 Main St');
		expect(locationState.status.kind).toBe('ready');
	});

	test('clearLocation resets everything', () => {
		const locationState = createLocationState();
		locationState.setReady({ latitude: 37.2, longitude: -93.2 }, 'geolocation');

		locationState.clearLocation();

		expect(locationState.location).toBe(null);
		expect(locationState.hasLocation).toBe(false);
		expect(locationState.status.kind).toBe('idle');
	});
});
