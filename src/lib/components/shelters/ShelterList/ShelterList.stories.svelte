<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor, within } from 'storybook/test';
	import ShelterList from './ShelterList.svelte';
	import { createShelterState, setShelterStateContext } from '$lib/state/shelter-state.svelte';
	import { sheltersHandlers } from '../../../../../.storybook/mocks/shelters';

	const { Story } = defineMeta({
		title: 'Shelters/ShelterList',
		decorators: [
			(Story) => {
				const shelterState = createShelterState(() => null);
				setShelterStateContext(shelterState);
				shelterState.loadShelters();
				return Story();
			},
		],
	});
</script>

{#snippet StoryTemplate()}
	<div class="h-dvh w-full bg-slate-100">
		<ShelterList />
	</div>
{/snippet}

<Story
	name="Loading"
	template={StoryTemplate}
	parameters={{
		msw: {
			handlers: {
				shelters: sheltersHandlers.loading,
			},
		},
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-loading')).toBeInTheDocument();
		await expect(canvas.queryByTestId('shelter-list-ready')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Empty"
	template={StoryTemplate}
	parameters={{
		msw: {
			handlers: {
				shelters: sheltersHandlers.empty,
			},
		},
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvas.getByTestId('shelter-list-empty')).toBeInTheDocument();
		});
		await expect(canvas.queryByTestId('shelter-list-loading')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Error"
	template={StoryTemplate}
	parameters={{
		msw: {
			handlers: {
				shelters: sheltersHandlers.error,
			},
		},
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvas.getByTestId('shelter-list-error')).toBeInTheDocument();
		});
		await expect(canvas.getByText('Failed to fetch shelters: 500')).toBeInTheDocument();
	}}
/>

<Story
	name="Ready"
	template={StoryTemplate}
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
			expect(canvas.getByTestId('shelter-list-ready')).toBeInTheDocument();
		});
		await expect(canvas.getByText('Shelter 1')).toBeInTheDocument();
		await expect(canvas.getByText('Shelter 14')).toBeInTheDocument();
	}}
/>
