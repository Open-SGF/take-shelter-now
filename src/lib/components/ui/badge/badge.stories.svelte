<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Badge } from './index';

	const { Story } = defineMeta({
		title: 'UI/Badge',
		component: Badge,
	});
</script>

<Story name="Default">
	<Badge>Default</Badge>
</Story>

<Story name="Secondary">
	<Badge variant="secondary">Secondary</Badge>
</Story>

<Story name="Destructive">
	<Badge variant="destructive">Destructive</Badge>
</Story>

<Story name="Outline">
	<Badge variant="outline">Outline</Badge>
</Story>
