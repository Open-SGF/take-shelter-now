import { beforeEach, describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import {
	createUserState,
	setUserStateContext,
	type UserState,
} from '#lib/state/user-state.svelte.js';
import Page from './+page.svelte';

const baseShelter = {
	name: 'Alpha Shelter',
	slug: 'alpha-shelter',
	addressLine1: '123 Main St',
	addressLine2: '',
	city: 'Springfield',
	state: 'MO',
	zip: '65806',
	latitude: 37.2,
	longitude: -93.29,
	photoUrls: [],
};

describe('/shelters/[slug]/+page.svelte', () => {
	let userState: UserState;

	beforeEach(() => {
		userState = createUserState();
	});

	test('renders page-level back button to list route', () => {
		const Wrapper = (...args: Parameters<typeof Page>) => {
			setUserStateContext(userState);
			return Page(...args);
		};

		render(Wrapper, {
			data: { shelter: baseShelter },
			params: { slug: baseShelter.slug },
			form: null,
		});

		const backButton = screen.getByRole('button', { name: 'Back to list' });
		expect(backButton).toBeInTheDocument();
	});

	test('renders ShelterDetail content from route data', () => {
		const Wrapper = (...args: Parameters<typeof Page>) => {
			setUserStateContext(userState);
			return Page(...args);
		};

		render(Wrapper, {
			data: { shelter: baseShelter },
			params: { slug: baseShelter.slug },
			form: null,
		});

		expect(screen.getByTestId('shelter-detail-card')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Alpha Shelter' })).toBeInTheDocument();
	});
});
