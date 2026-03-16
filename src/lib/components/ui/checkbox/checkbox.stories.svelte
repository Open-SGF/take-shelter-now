<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Checkbox } from './index';

	const { Story } = defineMeta({
		title: 'UI/Checkbox',
		component: Checkbox,
	});
</script>

<Story name="Unchecked">
	<label class="flex items-center gap-2">
		<Checkbox />
		<span class="text-sm">Accept terms</span>
	</label>
</Story>

<Story name="Checked">
	<label class="flex items-center gap-2">
		<Checkbox checked />
		<span class="text-sm">Accept terms</span>
	</label>
</Story>

<Story name="Disabled">
	<label class="flex items-center gap-2">
		<Checkbox disabled />
		<span class="text-sm opacity-50">Disabled checkbox</span>
	</label>
</Story>

<Story name="Disabled Checked">
	<label class="flex items-center gap-2">
		<Checkbox disabled checked />
		<span class="text-sm opacity-50">Disabled and checked</span>
	</label>
</Story>
