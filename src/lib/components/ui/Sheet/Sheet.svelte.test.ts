import { beforeEach, describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import { createRawSnippet } from 'svelte';
import Sheet from './Sheet.svelte';

const setViewportHeight = (height: number) => {
	Object.defineProperty(window, 'innerHeight', {
		value: height,
		writable: true,
		configurable: true,
	});
	window.dispatchEvent(new Event('resize'));
};

describe('Sheet', () => {
	beforeEach(() => {
		setViewportHeight(1000);
	});

	test('renders handle and scrollable content area', () => {
		const children = createRawSnippet(() => ({
			render: () => '<div data-testid="sheet-slot">Slot content</div>',
		}));

		render(Sheet, {
			props: {
				snapPoints: [0.25, 0.75],
				collapsedHeight: 100,
				children,
			},
		});

		expect(screen.getByTestId('sheet-handle')).toBeInTheDocument();
		expect(screen.getByTestId('sheet-slot')).toBeInTheDocument();
		const content = screen.getByTestId('sheet-content');
		expect(content).toHaveClass('overflow-y-auto');
		expect(content).toHaveClass('overscroll-contain');
	});

	test('snaps to higher point when dragged upward', async () => {
		render(Sheet, {
			props: {
				snapPoints: [0.25, 0.75],
				collapsedHeight: 100,
				snapIndex: 0,
			},
		});

		const sheet = screen.getByTestId('sheet');
		const handle = screen.getByTestId('sheet-handle');
		expect(sheet).toHaveAttribute('data-snap-index', '0');

		await fireEvent.pointerDown(handle, { pointerId: 1, clientY: 900 });
		await fireEvent.pointerMove(window, { pointerId: 1, clientY: 200 });
		await fireEvent.pointerUp(window, { pointerId: 1, clientY: 200 });

		expect(sheet).toHaveAttribute('data-snap-index', '1');
	});

	test('snaps to lower point when dragged downward', async () => {
		render(Sheet, {
			props: {
				snapPoints: [0.25, 0.75],
				collapsedHeight: 100,
				snapIndex: 1,
			},
		});

		const sheet = screen.getByTestId('sheet');
		const handle = screen.getByTestId('sheet-handle');
		expect(sheet).toHaveAttribute('data-snap-index', '1');

		await fireEvent.pointerDown(handle, { pointerId: 1, clientY: 200 });
		await fireEvent.pointerMove(window, { pointerId: 1, clientY: 920 });
		await fireEvent.pointerUp(window, { pointerId: 1, clientY: 920 });

		expect(sheet).toHaveAttribute('data-snap-index', '0');
	});
});
