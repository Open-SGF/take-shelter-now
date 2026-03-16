<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Separator } from './index';

	const { Story } = defineMeta({
		title: 'UI/Separator',
		component: Separator,
	});
</script>

<Story name="Horizontal">
	<div class="w-64 space-y-4">
		<p class="text-sm">Content above</p>
		<Separator />
		<p class="text-sm">Content below</p>
	</div>
</Story>

<Story name="Vertical">
	<div class="flex h-24 items-center gap-4">
		<span class="text-sm">Left</span>
		<Separator orientation="vertical" />
		<span class="text-sm">Right</span>
	</div>
</Story>
