import { beforeEach, describe, expect, test } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import AppShell from './AppShell.svelte';

const mapSnippet = createRawSnippet(() => ({
	render: () => '<div data-testid="custom-map">Map canvas</div>',
}));

const panelSnippet = createRawSnippet(() => ({
	render: () => '<div>Panel content</div>',
}));

describe('AppShell', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			value: 390,
			writable: true,
			configurable: true,
		});
	});

	test('renders provided map and panel content snippets', () => {
		render(AppShell, {
			props: {
				map: mapSnippet,
				children: panelSnippet,
			},
		});

		expect(screen.getByTestId('custom-map')).toBeInTheDocument();
		expect(screen.getByText('Panel content')).toBeInTheDocument();
		expect(screen.getByTestId('nav')).toBeInTheDocument();
	});

	test('renders sidebar on desktop viewport', () => {
		Object.defineProperty(window, 'innerWidth', {
			value: 1280,
			writable: true,
			configurable: true,
		});

		render(AppShell, {
			props: {
				map: mapSnippet,
				children: panelSnippet,
			},
		});

		expect(screen.getByTestId('sidebar')).toBeInTheDocument();
		expect(screen.queryByTestId('sheet')).not.toBeInTheDocument();
	});

	test('renders sheet on mobile viewport', () => {
		render(AppShell, {
			props: {
				map: mapSnippet,
				children: panelSnippet,
			},
		});

		expect(screen.getByTestId('sheet')).toBeInTheDocument();
		expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
	});
});
