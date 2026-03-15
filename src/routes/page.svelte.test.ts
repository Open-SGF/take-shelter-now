import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import type { LocationState } from '$lib/state/location-state.svelte';
import type { ShelterState } from '$lib/state/shelter-state.svelte';
import type { UserState } from '$lib/state/user-state.svelte';
import Page from './+page.svelte';

const state = {
	location: null as LocationState | null,
	shelter: null as ShelterState | null,
	user: null as UserState | null,
};

vi.mock('$lib/state/location-state.svelte', async (importOriginal) => {
	const actual = (await importOriginal()) as typeof import('$lib/state/location-state.svelte');
	return {
		...actual,
		getLocationStateContext: () => state.location,
	};
});

vi.mock('$lib/state/shelter-state.svelte', async (importOriginal) => {
	const actual = (await importOriginal()) as typeof import('$lib/state/shelter-state.svelte');
	return {
		...actual,
		getShelterStateContext: () => state.shelter,
	};
});

vi.mock('$lib/state/user-state.svelte', async (importOriginal) => {
	const actual = (await importOriginal()) as typeof import('$lib/state/user-state.svelte');
	return {
		...actual,
		getUserStateContext: () => state.user,
	};
});

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
	beforeEach(async () => {
		const { createLocationState } = await import('$lib/state/location-state.svelte');
		const { createShelterState } = await import('$lib/state/shelter-state.svelte');
		const { createUserState } = await import('$lib/state/user-state.svelte');

		state.location = createLocationState();
		state.shelter = createShelterState(() => state.location!.location);
		state.user = createUserState();
		vi.clearAllMocks();
	});

	test('renders location call-to-action by default', () => {
		mockGeolocation();
		render(Page);
		expect(screen.getByRole('button', { name: /Use Current Location/i })).toBeInTheDocument();
	});

	test('renders address input by default', () => {
		render(Page);
		expect(screen.getByPlaceholderText('Enter your address')).toBeInTheDocument();
	});

	test('shows shelter list when location is set', () => {
		state.location!.setReady({ latitude: 37.2, longitude: -93.2 }, 'geolocation');
		render(Page);
		expect(screen.getByTestId('shelter-list')).toBeInTheDocument();
	});
});
