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

	test('clamps snap index to allowed range', () => {
		render(Sheet, {
			props: {
				snapPoints: [0.25, 0.75],
				collapsedHeight: 100,
				snapIndex: 999,
			},
		});

		expect(screen.getByTestId('sheet')).toHaveAttribute('data-snap-index', '1');
	});

	test('exposes an accessible handle button label by default', () => {
		render(Sheet);

		expect(screen.getByRole('button', { name: 'Drag to resize' })).toBeInTheDocument();
	});

	test('supports a custom accessible handle button label', () => {
		render(Sheet, {
			props: {
				handleLabel: 'Resize shelter panel',
			},
		});

		expect(screen.getByRole('button', { name: 'Resize shelter panel' })).toBeInTheDocument();
	});

	test('snaps to higher point when dragged upward', async () => {
		render(Sheet, {
			props: {
				snapPoints: [0.25, 0.75],
				collapsedHeight: 100,
				snapIndex: -1,
			},
		});

		const sheet = screen.getByTestId('sheet');
		const handle = screen.getByTestId('sheet-handle');
		expect(sheet).toHaveAttribute('data-snap-index', '-1');

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

		expect(sheet).toHaveAttribute('data-snap-index', '-1');
	});

	test('expands to max snap point on content scroll', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<div style="height: 2000px">Long content</div>',
		}));

		render(Sheet, {
			props: {
				snapPoints: [0.25, 0.75],
				collapsedHeight: 100,
				snapIndex: -1,
				children,
			},
		});

		const sheet = screen.getByTestId('sheet');
		const content = screen.getByTestId('sheet-content');

		expect(sheet).toHaveAttribute('data-snap-index', '-1');
		await fireEvent.scroll(content, { target: { scrollTop: 16 } });
		expect(sheet).toHaveAttribute('data-snap-index', '1');
	});

	test('supports empty snap points by staying collapsed', async () => {
		render(Sheet, {
			props: {
				snapPoints: [],
				collapsedHeight: 120,
				snapIndex: 0,
			},
		});

		const sheet = screen.getByTestId('sheet');
		const handle = screen.getByTestId('sheet-handle');

		expect(sheet).toHaveAttribute('data-snap-index', '-1');

		await fireEvent.pointerDown(handle, { pointerId: 1, clientY: 500 });
		await fireEvent.pointerMove(window, { pointerId: 1, clientY: 100 });
		await fireEvent.pointerUp(window, { pointerId: 1, clientY: 100 });

		expect(sheet).toHaveAttribute('data-snap-index', '-1');
	});

	test('merges custom class names', () => {
		render(Sheet, {
			props: {
				class: 'sheet-test-class',
			},
		});

		expect(screen.getByTestId('sheet')).toHaveClass('sheet-test-class');
	});
});
