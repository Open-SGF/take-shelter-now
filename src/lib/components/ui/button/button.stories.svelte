<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './button.svelte';

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		args: {
			variant: 'default',
			size: 'default',
		},
	});
</script>

<Story name="Default" args={{ variant: 'default' }}>Button</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Secondary</Story>

<Story name="Outline" args={{ variant: 'outline' }}>Outline</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>Ghost</Story>
