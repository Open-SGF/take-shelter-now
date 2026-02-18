<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		/** Width of the sidebar in pixels (320-400px recommended) */
		width?: number;
		/** Additional classes to apply to the sidebar */
		class?: string;
		/** Content to render inside the sidebar */
		children?: import('svelte').Snippet;
	}

	let { width = 360, class: className, children }: Props = $props();

	const HEADER_HEIGHT = 72;
</script>

<aside
	class={cn(
		'bg-sidebar text-sidebar-foreground fixed right-0 z-50',
		'overflow-y-auto transition-all duration-300 ease-in-out',
		'hidden md:block',
		className,
	)}
	style="width: {width}px; top: {HEADER_HEIGHT}px; height: calc(100dvh - {HEADER_HEIGHT}px);"
>
	{#if children}
		{@render children()}
	{/if}
</aside>
