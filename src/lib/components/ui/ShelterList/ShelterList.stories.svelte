<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { ComponentProps } from 'svelte';
	import { expect, within } from 'storybook/test';
	import ShelterList from './ShelterList.svelte';
	import { createAppState } from '$lib/state/app-state.svelte';
	import type { Shelter } from '$lib/shelters/types';

	type StoryArgs = ComponentProps<typeof ShelterList>;
	type ShelterDataStatus = ReturnType<typeof createAppState>['shelterDataState']['kind'];

	const buildShelter = (index: number): Shelter => ({
		name: `Shelter ${index + 1}`,
		slug: `shelter-${index + 1}`,
		addressLine1: `${400 + index} Main St`,
		addressLine2: '',
		city: 'Springfield',
		state: 'MO',
		zip: '65802',
		latitude: 37.2 + index * 0.005,
		longitude: -93.29 - index * 0.005,
		photoUrls: [],
	});

	const readyShelters = Array.from({ length: 14 }, (_, index) => buildShelter(index));

	const createStoryState = (
		status: ShelterDataStatus,
		shelters: Shelter[],
		errorMessage: string | null = null,
	) => {
		const appState = createAppState([]);

		if (status === 'error') {
			appState.setShelterDataError(errorMessage ?? 'Unable to load shelter data.');
		} else if (status === 'loading') {
			appState.setShelterDataLoading();
		} else {
			appState.setShelters(shelters);
		}

		return appState;
	};

	const { Story } = defineMeta({
		title: 'Composite/ShelterList',
		component: ShelterList,
		args: {
			appState: createStoryState('ready', readyShelters),
		},
	});
</script>

{#snippet Template(args: StoryArgs)}
	<div class="h-dvh w-full max-w-md bg-slate-100">
		<ShelterList {...args} />
	</div>
{/snippet}

<Story
	name="Loading"
	args={{ appState: createStoryState('loading', []) }}
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-loading')).toBeInTheDocument();
		await expect(canvas.queryByTestId('shelter-list-ready')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Empty"
	args={{ appState: createStoryState('empty', []) }}
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-empty')).toBeInTheDocument();
		await expect(canvas.queryByTestId('shelter-list-loading')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Error"
	args={{
		appState: createStoryState('error', [], 'Shelter data could not be parsed for display.'),
	}}
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-error')).toBeInTheDocument();
		await expect(
			canvas.getByText('Shelter data could not be parsed for display.'),
		).toBeInTheDocument();
	}}
/>

<Story
	name="Ready"
	args={{ appState: createStoryState('ready', readyShelters) }}
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-ready')).toBeInTheDocument();
		await expect(canvas.getByText('Shelter 1')).toBeInTheDocument();
		await expect(canvas.getByText('Shelter 14')).toBeInTheDocument();
	}}
/>
