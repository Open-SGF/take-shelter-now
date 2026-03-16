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

describe('/+page.svelte', () => {
	let locationState: LocationState;
	let shelterState: ShelterState;
	let userState: UserState;

	beforeEach(() => {
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

	test('shows shelter list when location is set', () => {
		locationState.setReady({ latitude: 37.2, longitude: -93.2 }, 'geolocation');

		const Wrapper = (...args: Parameters<typeof Page>) => {
			setLocationStateContext(locationState);
			setShelterStateContext(shelterState);
			setUserStateContext(userState);
			return Page(...args);
		};

		render(Wrapper);
		expect(screen.getByTestId('shelter-list')).toBeInTheDocument();
	});
});
