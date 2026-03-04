<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Header from './Header.svelte';

	const { Story } = defineMeta({
		title: 'UI/Header',
		component: Header,
	});
</script>

<Story name="Default" />
