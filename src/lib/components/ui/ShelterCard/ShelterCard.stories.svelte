<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ShelterCard from './ShelterCard.svelte';

	const { Story } = defineMeta({
		title: 'Composite/ShelterCard',
		component: ShelterCard,
		args: {
			title: 'Central High School',
			address: '423 East Central, Springfield, MO 65802',
			distance: 0.4,
		},
	});
</script>

<Story name="Nearby" />

<Story
	name="Farther Away"
	args={{
		title: 'Tom Watkins Community Center',
		address: '1610 W Washington St, Springfield, MO 65802',
		distance: 2.6,
	}}
/>
