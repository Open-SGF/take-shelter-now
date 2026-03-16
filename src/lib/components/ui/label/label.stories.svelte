<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Label } from './index';
	import { Input } from '$lib/components/ui/input';

	const { Story } = defineMeta({
		title: 'UI/Label',
		component: Label,
	});
</script>

<Story name="Default">
	<Label>Username</Label>
</Story>

<Story name="With Input">
	<div class="space-y-2">
		<Label for="username">Username</Label>
		<Input id="username" type="text" placeholder="Enter username" />
	</div>
</Story>

<Story name="With Custom Class">
	<Label class="text-lg text-slate-600">Large Label</Label>
</Story>
