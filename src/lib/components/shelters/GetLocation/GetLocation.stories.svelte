<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import GetLocation from './GetLocation.svelte';
	import {
		createLocationState,
		setLocationStateContext,
		type LocationStatus,
	} from '$lib/state/location-state.svelte';

	const createStoryState = (status: LocationStatus) => {
		const state = createLocationState();

		if (status.kind === 'loading') {
			state.setLoading(status.method);
		} else if (status.kind === 'error') {
			state.setError(status.message, status.code);
		} else if (status.kind === 'ready') {
			state.setReady(
				{ latitude: 37.208957, longitude: -93.292299 },
				status.method,
				'123 Main St, Springfield, MO',
			);
		}

		return state;
	};

	const createPendingState = () => {
		const state = createLocationState();
		state.setPendingLocation({
			location: { latitude: 37.208957, longitude: -93.292299 },
			address: '123 Main St, Springfield, MO',
			method: 'address',
		});
		return state;
	};

	const { Story } = defineMeta({
		title: 'Shelters/GetLocation',
		decorators: [
			(Story, context) => {
				setLocationStateContext(context.args.state);
				return Story();
			},
		],
	});
</script>

{#snippet StoryShell()}
	<div class="w-full bg-white p-4">
		<GetLocation />
	</div>
{/snippet}

<Story
	name="Idle"
	template={StoryShell}
	args={{ state: createStoryState({ kind: 'idle' }) }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Use Current Location')).toBeInTheDocument();
		await expect(canvas.getByLabelText('Enter an address')).toBeInTheDocument();
	}}
/>

<Story
	name="Loading Geolocation"
	template={StoryShell}
	args={{ state: createStoryState({ kind: 'loading', method: 'geolocation' }) }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Getting your location...')).toBeInTheDocument();
	}}
/>

<Story
	name="Loading Address"
	template={StoryShell}
	args={{ state: createStoryState({ kind: 'loading', method: 'address' }) }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Looking up address...')).toBeInTheDocument();
	}}
/>

<Story
	name="Error Permission Denied"
	template={StoryShell}
	args={{
		state: createStoryState({
			kind: 'error',
			message: 'Location permission denied. Please enter your address manually.',
			code: 'permission_denied',
		}),
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.getByText('Location permission denied. Please enter your address manually.'),
		).toBeInTheDocument();
		await expect(canvas.getByText('Try Again')).toBeInTheDocument();
	}}
/>

<Story
	name="Error Position Unavailable"
	template={StoryShell}
	args={{
		state: createStoryState({
			kind: 'error',
			message: 'Unable to determine your location. Please enter your address.',
			code: 'position_unavailable',
		}),
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.getByText('Unable to determine your location. Please enter your address.'),
		).toBeInTheDocument();
	}}
/>

<Story
	name="Pending Location"
	template={StoryShell}
	args={{ state: createPendingState() }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('123 Main St, Springfield, MO')).toBeInTheDocument();
		await expect(canvas.getByText('Cancel')).toBeInTheDocument();
		await expect(canvas.getByText('Confirm Location')).toBeInTheDocument();
	}}
/>
