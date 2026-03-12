<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import type { ComponentProps } from 'svelte';
	import type { Shelter } from '$lib/shelters/types';
	import ShelterListItem from './ShelterListItem.svelte';

	type StoryArgs = ComponentProps<typeof ShelterListItem>;

	const fullDetailsShelter: Shelter = {
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
		photoUrls: [],
	};

	const missingOptionalShelter: Shelter = {
		name: 'Southside Community Shelter',
		slug: 'southside-community-shelter',
		addressLine1: '910 Pine St',
		addressLine2: '',
		city: 'Springfield',
		state: 'MO',
		zip: '65803',
		latitude: 37.3,
		longitude: -93.28,
		category: undefined,
		petFriendly: undefined,
		hasBackupPower: undefined,
		accessibility: undefined,
		photoUrls: [],
	};

	const { Story } = defineMeta({
		title: 'Shelters/ShelterListItem',
		component: ShelterListItem,
		args: {
			shelter: fullDetailsShelter,
			distanceMiles: 0.4,
		},
	});
</script>

{#snippet DesktopTemplate(args: StoryArgs)}
	<div class="w-full bg-slate-100 p-4">
		<ShelterListItem {...args} />
	</div>
{/snippet}

<Story
	name="Full Details"
	template={DesktopTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-item-name')).toHaveTextContent(
			'Central High School',
		);
		await expect(canvas.getByTestId('shelter-list-item-address')).toHaveTextContent(
			'423 East Central, Door 1, Springfield, MO 65802',
		);
		await expect(canvas.getByTestId('shelter-list-item-category')).toHaveTextContent('School');
		await expect(canvas.getByText('Pets allowed')).toBeInTheDocument();
		await expect(canvas.getByText('Backup power')).toBeInTheDocument();
		await expect(canvas.getByText('Accessible')).toBeInTheDocument();
		await expect(canvas.getByTestId('shelter-list-item-distance')).toHaveTextContent('2112 ft');
	}}
/>

<Story
	name="Missing Optional Fields"
	args={{ shelter: missingOptionalShelter, distanceMiles: null }}
	template={DesktopTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-list-item-name')).toHaveTextContent(
			'Southside Community Shelter',
		);
		await expect(canvas.getByTestId('shelter-list-item-category')).toHaveTextContent('Other');
		await expect(canvas.queryByTestId('shelter-list-item-distance')).not.toBeInTheDocument();
		await expect(canvas.queryByTestId('shelter-list-item-amenities')).not.toBeInTheDocument();
	}}
/>
