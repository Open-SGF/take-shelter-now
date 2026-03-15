<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from './input.svelte';

	const { Story } = defineMeta({
		title: 'UI/Input',
		component: Input,
		args: {
			type: 'text',
			placeholder: 'Enter text...',
		},
	});
</script>

<Story name="Default" />

<Story name="With Placeholder" args={{ placeholder: 'Type something...' }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Password" args={{ type: 'password', placeholder: 'Enter password...' }} />

<Story name="Email" args={{ type: 'email', placeholder: 'Enter email...' }} />

<Story name="Number" args={{ type: 'number', placeholder: '0' }} />
