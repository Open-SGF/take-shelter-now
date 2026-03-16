import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import { setLocationStateContext, createLocationState } from '$lib/state/location-state.svelte';
import { setUserStateContext, createUserState } from '$lib/state/user-state.svelte';

vi.mock('$app/state', () => ({
	page: {
		url: new URL('http://localhost/'),
	},
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
}));

describe('Nav', () => {
	let Nav: typeof import('./Nav.svelte').default;

	beforeEach(async () => {
		Nav = (await import('./Nav.svelte')).default;
	});

	test('uses header and navigation landmarks', () => {
		const locationState = createLocationState();
		const userState = createUserState();

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			return Nav(...args);
		};

		render(Wrapper);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
	});

	test('renders site logo', () => {
		const locationState = createLocationState();
		const userState = createUserState();

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			return Nav(...args);
		};

		render(Wrapper);

		expect(screen.getByAltText('Take Shelter Now Logo')).toBeInTheDocument();
	});

	test('merges custom class names', () => {
		const locationState = createLocationState();
		const userState = createUserState();

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			return Nav(...args);
		};

		render(Wrapper, {
			props: {
				class: 'nav-test-class',
			},
		});

		expect(screen.getByTestId('nav')).toHaveClass('nav-test-class');
	});

	test('shows menu when location is set', () => {
		const locationState = createLocationState();
		const userState = createUserState();

		locationState.setReady(
			{ latitude: 37.208957, longitude: -93.292299 },
			'address',
			'123 Main St',
		);

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			return Nav(...args);
		};

		render(Wrapper);

		expect(screen.getByTestId('nav-menu-trigger')).toBeInTheDocument();
	});

	test('shows menu when directions app is set', () => {
		const locationState = createLocationState();
		const userState = createUserState();

		userState.setDirectionsApp('apple');

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			return Nav(...args);
		};

		render(Wrapper);

		expect(screen.getByTestId('nav-menu-trigger')).toBeInTheDocument();
	});
});
