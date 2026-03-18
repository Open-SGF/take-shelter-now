<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within, waitFor } from 'storybook/test';
	import { userEvent } from 'storybook/test';
	import Nav from './Nav.svelte';
	import { createLocationState, setLocationStateContext } from '$lib/state/location-state.svelte';
	import { createUserState, setUserStateContext } from '$lib/state/user-state.svelte';
	import { createShelterState, setShelterStateContext } from '$lib/state/shelter-state.svelte';
	import { storage } from '$lib/storage';

	const { Story } = defineMeta({
		title: 'Layout/Nav',
		component: Nav,
	});
</script>

{#snippet StoryShell()}
	<Nav />
{/snippet}

<Story
	name="No Location"
	template={StoryShell}
	decorators={[
		(Story) => {
			storage.clear();
			const locationState = createLocationState();
			const userState = createUserState();
			const shelterState = createShelterState(() => locationState.location);
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
			return Story();
		},
	]}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('nav-menu-trigger')).toBeInTheDocument();
	}}
/>

<Story
	name="With Location"
	template={StoryShell}
	decorators={[
		(Story) => {
			storage.clear();
			const locationState = createLocationState();
			const userState = createUserState();
			const shelterState = createShelterState(() => locationState.location);
			locationState.setReady(
				{ latitude: 37.208957, longitude: -93.292299 },
				'address',
				'123 Main St, Springfield, MO',
			);
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
			return Story();
		},
	]}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByTestId('nav-menu-trigger'));
		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('nav-menu-edit-location')).toBeInTheDocument();
			expect(bodyCanvas.queryByTestId('nav-menu-reset-directions')).not.toBeInTheDocument();
		});
	}}
/>

<Story
	name="With Directions App"
	template={StoryShell}
	decorators={[
		(Story) => {
			storage.clear();
			const locationState = createLocationState();
			const userState = createUserState();
			const shelterState = createShelterState(() => locationState.location);
			userState.setDirectionsApp('apple');
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
			return Story();
		},
	]}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByTestId('nav-menu-trigger'));
		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.queryByTestId('nav-menu-edit-location')).not.toBeInTheDocument();
			expect(bodyCanvas.getByTestId('nav-menu-reset-directions')).toBeInTheDocument();
		});
	}}
/>

<Story
	name="With Location And Directions App"
	template={StoryShell}
	decorators={[
		(Story) => {
			storage.clear();
			const locationState = createLocationState();
			const userState = createUserState();
			const shelterState = createShelterState(() => locationState.location);
			locationState.setReady(
				{ latitude: 37.208957, longitude: -93.292299 },
				'address',
				'123 Main St, Springfield, MO',
			);
			userState.setDirectionsApp('google');
			setLocationStateContext(locationState);
			setUserStateContext(userState);
			setShelterStateContext(shelterState);
			return Story();
		},
	]}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByTestId('nav-menu-trigger'));
		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('nav-menu-edit-location')).toBeInTheDocument();
			expect(bodyCanvas.getByTestId('nav-menu-reset-directions')).toBeInTheDocument();
		});
	}}
/>
