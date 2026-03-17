<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor, within } from 'storybook/test';
	import { userEvent } from 'storybook/test';
	import ShelterFilterPanel from './ShelterFilterPanel.svelte';
	import { createShelterState, setShelterStateContext } from '$lib/state/shelter-state.svelte';
	import { sheltersHandlers } from '../../../../../.storybook/mocks/shelters';
	import { storage } from '$lib/storage';

	const { Story } = defineMeta({
		title: 'Shelters/ShelterFilterPanel',
		component: ShelterFilterPanel,
		decorators: [
			(Story) => {
				storage.clear();
				const shelterState = createShelterState(() => null);
				setShelterStateContext(shelterState);
				shelterState.loadShelters();
				return Story();
			},
		],
	});
</script>

{#snippet StoryShell()}
	<div class="p-4">
		<ShelterFilterPanel />
	</div>
{/snippet}

<Story
	name="Default"
	template={StoryShell}
	parameters={{
		msw: {
			handlers: {
				shelters: sheltersHandlers.ready,
			},
		},
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() => {
			expect(canvas.getByTestId('filter-trigger')).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByTestId('filter-trigger'));

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('filter-popover')).toBeInTheDocument();
		});

		await waitFor(() => {
			expect(bodyCanvas.getByTestId('filter-match-count')).toHaveTextContent(
				'14 of 14 shelters match',
			);
		});

		expect(bodyCanvas.getByRole('heading', { name: 'Filters' })).toBeInTheDocument();
		expect(bodyCanvas.getByTestId('filter-pets-checkbox')).toBeInTheDocument();
		expect(bodyCanvas.getByTestId('filter-accessibility-checkbox')).toBeInTheDocument();
		expect(bodyCanvas.getByTestId('filter-backup-power-checkbox')).toBeInTheDocument();
		expect(bodyCanvas.getByTestId('filter-category-school-checkbox')).toBeInTheDocument();
		expect(bodyCanvas.getByTestId('filter-category-church-checkbox')).toBeInTheDocument();
		expect(bodyCanvas.getByTestId('filter-category-other-checkbox')).toBeInTheDocument();
	}}
/>

<Story
	name="Filtering"
	template={StoryShell}
	parameters={{
		msw: {
			handlers: {
				shelters: sheltersHandlers.ready,
			},
		},
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() => {
			expect(canvas.getByTestId('filter-trigger')).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByTestId('filter-trigger'));

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('filter-popover')).toBeInTheDocument();
		});

		await waitFor(() => {
			expect(bodyCanvas.getByTestId('filter-match-count')).toHaveTextContent(
				'14 of 14 shelters match',
			);
		});

		await userEvent.click(bodyCanvas.getByTestId('filter-pets-checkbox'));
		await waitFor(() => {
			expect(canvas.getByTestId('filter-count-badge')).toHaveTextContent('1');
		});
		expect(bodyCanvas.getByTestId('filter-match-count')).toHaveTextContent(
			'7 of 14 shelters match',
		);

		await userEvent.click(bodyCanvas.getByTestId('filter-category-school-checkbox'));
		await waitFor(() => {
			expect(canvas.getByTestId('filter-count-badge')).toHaveTextContent('2');
		});
		expect(bodyCanvas.getByTestId('filter-match-count')).toHaveTextContent(
			'3 of 14 shelters match',
		);

		await userEvent.click(bodyCanvas.getByTestId('filter-accessibility-checkbox'));
		await waitFor(() => {
			expect(canvas.getByTestId('filter-count-badge')).toHaveTextContent('3');
		});
		expect(bodyCanvas.getByTestId('filter-match-count')).toHaveTextContent(
			'3 of 14 shelters match',
		);
	}}
/>

<Story
	name="Clear Filters"
	template={StoryShell}
	parameters={{
		msw: {
			handlers: {
				shelters: sheltersHandlers.ready,
			},
		},
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() => {
			expect(canvas.getByTestId('filter-trigger')).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByTestId('filter-trigger'));

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('filter-popover')).toBeInTheDocument();
		});

		await waitFor(() => {
			expect(bodyCanvas.getByTestId('filter-match-count')).toHaveTextContent(
				'14 of 14 shelters match',
			);
		});

		await userEvent.click(bodyCanvas.getByTestId('filter-pets-checkbox'));
		await userEvent.click(bodyCanvas.getByTestId('filter-accessibility-checkbox'));

		await waitFor(() => {
			expect(canvas.getByTestId('filter-count-badge')).toHaveTextContent('2');
		});

		await userEvent.click(bodyCanvas.getByTestId('clear-filters-button'));

		await waitFor(() => {
			expect(canvas.queryByTestId('filter-count-badge')).not.toBeInTheDocument();
		});

		expect(bodyCanvas.getByTestId('filter-match-count')).toHaveTextContent(
			'14 of 14 shelters match',
		);
	}}
/>
