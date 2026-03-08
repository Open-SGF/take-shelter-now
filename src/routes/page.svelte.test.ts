import { beforeEach, describe, expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { hasLocation } from '$lib/stores/global';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	beforeEach(() => {
		hasLocation.set(false);
	});

	test('renders location call-to-action by default', () => {
		render(Page);
		expect(screen.getByRole('button', { name: 'Current Location' })).toBeInTheDocument();
	});
});
