import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import { createRawSnippet } from 'svelte';
import Sidebar from './Sidebar.svelte';

describe('Sidebar', () => {
	test('renders content from children snippet', () => {
		const children = createRawSnippet(() => ({
			render: () => '<div>Emergency shelter details</div>',
		}));

		render(Sidebar, { props: { children } });

		expect(screen.getByText('Emergency shelter details')).toBeInTheDocument();
	});

	test('uses aside landmark semantics', () => {
		render(Sidebar);

		expect(screen.getByRole('complementary')).toBeInTheDocument();
	});

	test('merges custom class names', () => {
		render(Sidebar, {
			props: {
				class: 'sidebar-test-class',
			},
		});

		expect(screen.getByTestId('sidebar')).toHaveClass('sidebar-test-class');
	});
});
