import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import Nav from './Nav.svelte';
import { setLocationStateContext, createLocationState } from '$lib/state/location-state.svelte';
import { setUserStateContext, createUserState } from '$lib/state/user-state.svelte';

describe('Nav', () => {
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
});
