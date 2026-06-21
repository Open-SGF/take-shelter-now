<script lang="ts">
	import { plausibleInitScript } from './plausible';

	interface Props {
		src: string;
		enabled?: boolean;
		init?: Parameters<typeof plausibleInitScript>[0];
	}

	let { src, enabled = true, init }: Props = $props();

	let initHtml = $derived(plausibleInitScript(init));
</script>

<svelte:head>
	{#if enabled}
		<script async {src}></script>
		<!-- eslint-disable-next-line svelte/no-at-html-tags Generated from typed props, no user input -->
		{@html initHtml}
	{/if}
</svelte:head>
