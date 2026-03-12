import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
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
	test('renders page-level back link to list route', () => {
		render(Page, {
			props: {
				data: {
					shelters: [],
					shelter: baseShelter,
				},
			},
		});

		const backLink = screen.getByRole('link', { name: 'Back to list' });
		expect(backLink).toBeInTheDocument();
		expect(backLink).toHaveAttribute('href', '/');
	});

	test('renders ShelterDetail content from route data', () => {
		render(Page, {
			props: {
				data: {
					shelters: [],
					shelter: baseShelter,
				},
			},
		});

		expect(screen.getByTestId('shelter-detail-card')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Alpha Shelter' })).toBeInTheDocument();
	});
});
