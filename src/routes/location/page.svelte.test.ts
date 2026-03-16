import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import {
	createLocationState,
	setLocationStateContext,
	type LocationState,
} from '$lib/state/location-state.svelte';
import {
	createShelterState,
	setShelterStateContext,
	type ShelterState,
} from '$lib/state/shelter-state.svelte';
import { createUserState, setUserStateContext, type UserState } from '$lib/state/user-state.svelte';
import { storage } from '$lib/storage';
import Page from './+page.svelte';

const mockGeolocation = () => {
	Object.defineProperty(window.navigator, 'geolocation', {
		value: {
			getCurrentPosition: vi.fn(),
		},
		configurable: true,
		writable: true,
	});
};

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
}));

vi.mock('$app/paths', () => ({
	resolve: (path: string) => path,
}));

describe('/location/+page.svelte', () => {
	let locationState: LocationState;
	let shelterState: ShelterState;
	let userState: UserState;

	beforeEach(() => {
		storage.clear();
		locationState = createLocationState();
		userState = createUserState();
		shelterState = createShelterState(() => locationState.location);
	});

	test('renders location call-to-action by default', () => {
		mockGeolocation();

		const Wrapper = (...args: Parameters<typeof Page>) => {
			setLocationStateContext(locationState);
			setShelterStateContext(shelterState);
			setUserStateContext(userState);
			return Page(...args);
		};

		render(Wrapper);
		expect(screen.getByRole('button', { name: /Use Current Location/i })).toBeInTheDocument();
	});

	test('renders address input by default', () => {
		const Wrapper = (...args: Parameters<typeof Page>) => {
			setLocationStateContext(locationState);
			setShelterStateContext(shelterState);
			setUserStateContext(userState);
			return Page(...args);
		};

		render(Wrapper);
		expect(screen.getByLabelText('Enter an address')).toBeInTheDocument();
	});

	test('shows back button when location is already set (edit mode)', () => {
		locationState.setReady(
			{ latitude: 37.208957, longitude: -93.292299 },
			'address',
			'123 Main St',
		);

		const Wrapper = (...args: Parameters<typeof Page>) => {
			setLocationStateContext(locationState);
			setShelterStateContext(shelterState);
			setUserStateContext(userState);
			return Page(...args);
		};

		render(Wrapper);
		expect(screen.getByTestId('location-back')).toBeInTheDocument();
	});

	test('hides back button when no location is set (initial setup)', () => {
		const Wrapper = (...args: Parameters<typeof Page>) => {
			setLocationStateContext(locationState);
			setShelterStateContext(shelterState);
			setUserStateContext(userState);
			return Page(...args);
		};

		render(Wrapper);
		expect(screen.queryByTestId('location-back')).not.toBeInTheDocument();
	});
});
