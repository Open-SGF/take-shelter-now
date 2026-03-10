import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createAppState } from '$lib/state/app-state.svelte';
import Page from './+page.svelte';

let appState = createAppState([]);

vi.mock('$lib/state/app-state-context', () => ({
	getAppStateContext: () => appState,
}));

describe('/+page.svelte', () => {
	beforeEach(() => {
		appState = createAppState([]);
	});

	test('renders location call-to-action by default', () => {
		render(Page);
		expect(screen.getByRole('button', { name: 'Current Location' })).toBeInTheDocument();
	});
});
