<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { ShelterCategoryBadge } from './index';

	const { Story } = defineMeta({
		title: 'UI/ShelterCategoryBadge',
		component: ShelterCategoryBadge,
		args: {
			category: 'school',
		},
	});
</script>

<Story name="School" args={{ category: 'school' }} />

<Story name="Church" args={{ category: 'church' }} />

<Story name="Other" args={{ category: 'other' }} />

<Story name="Undefined" args={{ category: undefined }} />
