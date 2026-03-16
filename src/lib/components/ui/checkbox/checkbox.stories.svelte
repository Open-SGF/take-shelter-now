<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Checkbox } from './index';
	import type { ComponentProps } from 'svelte';

	type CheckboxStoryArgs = ComponentProps<typeof Checkbox>;

	const { Story } = defineMeta({
		title: 'UI/Checkbox',
		component: Checkbox,
	});
</script>

{#snippet StoryShell(args: CheckboxStoryArgs)}
	<div class="p-4">
		<label class="inline-flex items-center gap-2">
			<Checkbox {...args} />
			<span class="text-sm leading-none whitespace-nowrap" class:opacity-50={!!args.disabled}>
				Accept terms
			</span>
		</label>
	</div>
{/snippet}

<Story name="Unchecked" template={StoryShell} />

<Story name="Checked" template={StoryShell} args={{ checked: true }} />

<Story name="Disabled" template={StoryShell} args={{ disabled: true }} />

<Story name="Disabled Checked" template={StoryShell} args={{ disabled: true, checked: true }} />
