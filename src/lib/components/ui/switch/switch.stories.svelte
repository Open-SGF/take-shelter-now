<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Switch } from './index';
	import type { ComponentProps } from 'svelte';

	type SwitchStoryArgs = ComponentProps<typeof Switch>;

	const { Story } = defineMeta({
		title: 'UI/Switch',
		component: Switch,
	});
</script>

{#snippet StoryShell(args: SwitchStoryArgs)}
	<div class="p-4">
		<label class="inline-flex items-center gap-2">
			<Switch {...args} />
			<span class="text-sm leading-none whitespace-nowrap" class:opacity-50={!!args.disabled}>
				Radar enabled
			</span>
		</label>
	</div>
{/snippet}

<Story name="Unchecked" template={StoryShell} />

<Story name="Checked" template={StoryShell} args={{ checked: true }} />

<Story name="Disabled" template={StoryShell} args={{ disabled: true }} />

<Story name="Disabled Checked" template={StoryShell} args={{ disabled: true, checked: true }} />
