<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import ShelterList from './ShelterList.svelte';
	import {
		createShelterState,
		setShelterStateContext,
		type ShelterDataState,
		type ShelterState,
	} from '$lib/state/shelter-state.svelte';
	import type { Shelter } from '$lib/shelters/types';

	type ShelterDataStatus = ShelterDataState['kind'];

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
		const shelterState = createShelterState(() => null);

		if (status === 'error') {
			shelterState.setError(errorMessage ?? 'Unable to load shelter data.');
		} else if (status === 'loading') {
			shelterState.setLoading();
		} else {
			shelterState.setShelters(shelters);
		}

		return shelterState;
	};

	type StoryArgs = { state: ShelterState };

	const { Story } = defineMeta({
		title: 'Shelters/ShelterList',
		tags: ['autodocs'],
		render: (args: StoryArgs) => {
			setShelterStateContext(args.state);
			return {
				component: ShelterList,
			};
		},
	});
</script>

{#snippet StoryTemplate(args: StoryArgs)}
	{@const _ = setShelterStateContext(args.state)}
	<div class="h-dvh w-full max-w-md bg-slate-100">
		<ShelterList />
	</div>
{/snippet}

<Story
	name="Loading"
	template={StoryTemplate}
	args={{ state: createStoryState('loading', []) }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-loading')).toBeInTheDocument();
		await expect(canvas.queryByTestId('shelter-list-ready')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Empty"
	template={StoryTemplate}
	args={{ state: createStoryState('empty', []) }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-empty')).toBeInTheDocument();
		await expect(canvas.queryByTestId('shelter-list-loading')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Error"
	template={StoryTemplate}
	args={{ state: createStoryState('error', [], 'Shelter data could not be parsed for display.') }}
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
	template={StoryTemplate}
	args={{ state: createStoryState('ready', readyShelters) }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-ready')).toBeInTheDocument();
		await expect(canvas.getByText('Shelter 1')).toBeInTheDocument();
		await expect(canvas.getByText('Shelter 14')).toBeInTheDocument();
	}}
/>
