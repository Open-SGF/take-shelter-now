<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Badge } from './index';
	import type { ComponentProps } from 'svelte';

	type BadgeArgs = ComponentProps<typeof Badge>;

	const { Story } = defineMeta({
		title: 'UI/Badge',
		component: Badge,
	});
</script>

{#snippet StoryShell(args: BadgeArgs)}
	<div class="p-4">
		<Badge {...args}>Badge</Badge>
	</div>
{/snippet}

<Story name="Default" template={StoryShell} />

<Story name="Secondary" template={StoryShell} args={{ variant: 'secondary' }} />

<Story name="Destructive" template={StoryShell} args={{ variant: 'destructive' }} />

<Story name="Outline" template={StoryShell} args={{ variant: 'outline' }} />
