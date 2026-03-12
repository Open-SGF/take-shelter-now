import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import Nav from './Nav.svelte';

describe('Nav', () => {
	test('uses header and navigation landmarks', () => {
		render(Nav);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
	});

	test('renders site logo', () => {
		render(Nav);

		expect(screen.getByAltText('Take Shelter Now Logo')).toBeInTheDocument();
	});

	test('merges custom class names', () => {
		render(Nav, {
			props: {
				class: 'nav-test-class',
			},
		});

		expect(screen.getByTestId('nav')).toHaveClass('nav-test-class');
	});
});
