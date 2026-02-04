import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	test('should render h1', () => {
		render(Page);
		// There are two h1s: one for desktop sidebar and one for mobile bottom sheet
		const headings = screen.getAllByRole('heading', { level: 1 });
		expect(headings.length).toBeGreaterThanOrEqual(1);
		expect(headings[0]).toBeInTheDocument();
	});
});
