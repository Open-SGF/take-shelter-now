<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, waitFor, within } from 'storybook/test';
	import type { ComponentProps } from 'svelte';
	import type { Shelter } from '$lib/shelters/types';
	import { createUserState, setUserStateContext } from '$lib/state/user-state.svelte';
	import { storage } from '$lib/storage';
	import DirectionsAction from './DirectionsAction.svelte';

	type StoryArgs = ComponentProps<typeof DirectionsAction>;

	const fullShelter: Shelter = {
		name: 'Central High School',
		slug: 'central-high-school',
		addressLine1: '423 East Central',
		addressLine2: 'Door 1',
		city: 'Springfield',
		state: 'MO',
		zip: '65802',
		latitude: 37.208111,
		longitude: -93.291111,
		category: 'school',
		petFriendly: true,
		hasBackupPower: true,
		accessibility: true,
		hours: undefined,
		capacity: 1200,
		specialInstructions: 'Use the north entrance.',
		lastUpdated: '11/04/2025',
		photoUrls: [],
	};

	const noAddressShelter: Shelter = {
		name: 'Coordinates Only Shelter',
		slug: 'coordinates-only',
		addressLine1: '',
		addressLine2: '',
		city: '',
		state: '',
		zip: '',
		latitude: 37.3,
		longitude: -93.28,
		category: 'other',
		petFriendly: false,
		hasBackupPower: false,
		accessibility: false,
		hours: undefined,
		capacity: undefined,
		specialInstructions: undefined,
		lastUpdated: undefined,
		photoUrls: [],
	};

	const noDestinationShelter: Shelter = {
		name: 'No Location Shelter',
		slug: 'no-location',
		addressLine1: '',
		addressLine2: '',
		city: '',
		state: '',
		zip: '',
		latitude: Number.NaN,
		longitude: Number.NaN,
		category: 'other',
		petFriendly: false,
		hasBackupPower: false,
		accessibility: false,
		hours: undefined,
		capacity: undefined,
		specialInstructions: undefined,
		lastUpdated: undefined,
		photoUrls: [],
	};

	const { Story } = defineMeta({
		title: 'Shelters/DirectionsAction',
		tags: ['autodocs'],
		args: {
			shelter: fullShelter,
		},
		decorators: [
			(Story) => {
				storage.clear();
				setUserStateContext(createUserState());
				return Story();
			},
		],
	});
</script>

{#snippet Template(args: StoryArgs)}
	<div class="w-full bg-slate-100 p-4">
		<DirectionsAction {...args} />
	</div>
{/snippet}

<Story
	name="Default"
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const directionsButton = canvas.getByTestId('get-directions-button');
		await expect(directionsButton).toBeEnabled();
		await expect(directionsButton).toHaveTextContent('Get Directions');

		const copyButton = canvas.getByTestId('copy-address-button');
		await expect(copyButton).toBeEnabled();
		await expect(copyButton).toHaveTextContent('Copy Address');
	}}
/>

<Story
	name="Opens Dialog on Click"
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const directionsButton = canvas.getByTestId('get-directions-button');
		await userEvent.click(directionsButton);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('directions-dialog')).toBeInTheDocument();
		});

		await expect(bodyCanvas.getByTestId('apple-maps-option')).toBeInTheDocument();
		await expect(bodyCanvas.getByTestId('google-maps-option')).toBeInTheDocument();
		await expect(bodyCanvas.getByTestId('remember-choice-checkbox')).toBeInTheDocument();
	}}
/>

<Story
	name="Coordinates Only"
	args={{ shelter: noAddressShelter }}
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const directionsButton = canvas.getByTestId('get-directions-button');
		await expect(directionsButton).toBeEnabled();

		const copyButton = canvas.getByTestId('copy-address-button');
		await expect(copyButton).toBeDisabled();
	}}
/>

<Story
	name="No Valid Destination"
	args={{ shelter: noDestinationShelter }}
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const directionsButton = canvas.getByTestId('get-directions-button');
		await expect(directionsButton).toBeDisabled();

		const copyButton = canvas.getByTestId('copy-address-button');
		await expect(copyButton).toBeDisabled();
	}}
/>
