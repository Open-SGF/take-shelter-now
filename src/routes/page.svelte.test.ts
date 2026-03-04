import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	test('should render site logo', () => {
		render(Page);
		expect(screen.getByAltText('Take Shelter Now Logo')).toBeInTheDocument();
	});
});
