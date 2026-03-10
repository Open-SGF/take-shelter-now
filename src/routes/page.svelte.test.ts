import { beforeEach, describe, expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { userLocation } from '$lib/stores/location';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	beforeEach(() => {
		userLocation.set(null);
	});

	test('renders location call-to-action by default', () => {
		render(Page);
		expect(screen.getByRole('button', { name: 'Current Location' })).toBeInTheDocument();
	});
});
