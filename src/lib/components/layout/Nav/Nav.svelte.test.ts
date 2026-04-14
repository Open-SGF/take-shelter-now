import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import { setLocationStateContext, createLocationState } from '$lib/state/location-state.svelte';
import { setUserStateContext, createUserState } from '$lib/state/user-state.svelte';
import { setShelterStateContext, createShelterState } from '$lib/state/shelter-state.svelte';

const { modeStore, setModeMock } = vi.hoisted(() => ({
	modeStore: { current: 'light' as 'light' | 'dark' },
	setModeMock: vi.fn(),
}));

vi.mock('$app/state', () => ({
	page: {
		url: new URL('http://localhost/'),
	},
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
}));

vi.mock('mode-watcher', () => ({
	mode: modeStore,
	setMode: setModeMock,
}));

describe('Nav', () => {
	let Nav: typeof import('./Nav.svelte').default;

	beforeEach(async () => {
		Nav = (await import('./Nav.svelte')).default;
		modeStore.current = 'light';
		setModeMock.mockReset();
	});

	const renderNav = () => {
		const locationState = createLocationState();
		const userState = createUserState();
		const shelterState = createShelterState(() => locationState.location);

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
			return Nav(...args);
		};

		render(Wrapper);
	};

	test('uses header and navigation landmarks', () => {
		renderNav();

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
	});

	test('renders site logo', () => {
		renderNav();

		expect(screen.getByAltText('Take Shelter Now Logo')).toBeInTheDocument();
	});

	test('merges custom class names', () => {
		const locationState = createLocationState();
		const userState = createUserState();
		const shelterState = createShelterState(() => locationState.location);

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
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
		const shelterState = createShelterState(() => locationState.location);

		locationState.setReady(
			{ latitude: 37.208957, longitude: -93.292299 },
			'address',
			'123 Main St',
		);

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
			return Nav(...args);
		};

		render(Wrapper);

		expect(screen.getByTestId('nav-menu-trigger')).toBeInTheDocument();
	});

	test('shows menu when directions app is set', () => {
		const locationState = createLocationState();
		const userState = createUserState();
		const shelterState = createShelterState(() => locationState.location);

		userState.setDirectionsApp('apple');

		const Wrapper = (...args: Parameters<typeof Nav>) => {
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
			return Nav(...args);
		};

		render(Wrapper);

		expect(screen.getByTestId('nav-menu-trigger')).toBeInTheDocument();
	});

	test('toggles dark mode from nav menu', async () => {
		renderNav();

		await fireEvent.click(screen.getByTestId('nav-menu-trigger'));
		await fireEvent.click(screen.getByRole('switch', { name: 'Dark mode' }));

		expect(setModeMock).toHaveBeenCalledWith('dark');
	});
});
