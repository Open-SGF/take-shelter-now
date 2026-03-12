<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import type { ComponentProps } from 'svelte';
	import type { Shelter } from '$lib/shelters/types';
	import ShelterDetail from './ShelterDetail.svelte';

	type StoryArgs = ComponentProps<typeof ShelterDetail>;

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
		hours: {
			timeZone: 'America/Chicago',
			intervals: [{ startMinute: 0, endMinute: 10080 }],
		},
		capacity: 1200,
		specialInstructions: 'Use the north entrance.',
		lastUpdated: '11/04/2025',
		photoUrls: [],
	};

	const sparseShelter: Shelter = {
		name: 'Southside Community Shelter',
		slug: 'southside-community-shelter',
		addressLine1: '',
		addressLine2: '',
		city: '',
		state: '',
		zip: '',
		latitude: 37.3,
		longitude: -93.28,
		category: undefined,
		petFriendly: undefined,
		hasBackupPower: undefined,
		accessibility: undefined,
		hours: undefined,
		capacity: undefined,
		specialInstructions: undefined,
		lastUpdated: undefined,
		shelterType: 'Gymnasium',
		photoUrls: [],
	};

	const { Story } = defineMeta({
		title: 'Composite/ShelterDetail',
		component: ShelterDetail,
		args: {
			shelter: fullDetailsShelter,
		},
	});
</script>

{#snippet Template(args: StoryArgs)}
	<div class="w-full bg-slate-100 p-4">
		<ShelterDetail {...args} />
	</div>
{/snippet}

<Story
	name="Full Details"
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-detail-name')).toHaveTextContent(
			'Central High School',
		);
		await expect(canvas.getByTestId('shelter-detail-address')).toHaveTextContent(
			'423 East Central, Door 1, Springfield, MO 65802',
		);
		await expect(canvas.getByText('School')).toBeInTheDocument();
		await expect(canvas.getByText('Open now')).toBeInTheDocument();
		await expect(canvas.getByTestId('shelter-detail-hours-lines')).toBeInTheDocument();
		await expect(canvas.getByText('1,200 people')).toBeInTheDocument();
		await expect(canvas.getByText('Use the north entrance.')).toBeInTheDocument();
		await expect(canvas.getByText('Last updated: 11/04/2025')).toBeInTheDocument();
	}}
/>

<Story
	name="Missing Optional Fields"
	args={{ shelter: sparseShelter }}
	template={Template}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('shelter-detail-address')).toHaveTextContent(
			'Address not listed',
		);
		await expect(canvas.getByText('Category not listed')).toBeInTheDocument();
		await expect(canvas.queryByTestId('shelter-detail-hours-lines')).not.toBeInTheDocument();
		await expect(canvas.getByText('No special instructions provided.')).toBeInTheDocument();
		await expect(canvas.getByText('Last updated: Unknown')).toBeInTheDocument();
		await expect(canvas.queryByText(/verification status/i)).not.toBeInTheDocument();
		await expect(canvas.queryByText(/shelter type/i)).not.toBeInTheDocument();
		await expect(canvas.queryByText('Gymnasium')).not.toBeInTheDocument();
	}}
/>
