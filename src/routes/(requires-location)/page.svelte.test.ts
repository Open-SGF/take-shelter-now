import { beforeEach, describe, expect, test } from 'vitest';
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

describe('/+page.svelte (requires-location)', () => {
	let locationState: LocationState;
	let shelterState: ShelterState;
	let userState: UserState;

	beforeEach(() => {
		locationState = createLocationState();
		userState = createUserState();
		shelterState = createShelterState(() => locationState.location);
	});

	test('renders shelter list', () => {
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
