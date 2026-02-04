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
</script>

<aside
	class={cn(
		'bg-sidebar text-sidebar-foreground fixed top-0 right-0 z-50 h-dvh',
		'overflow-y-auto',
		'hidden md:block',
		className,
	)}
	style="width: {width}px;"
>
	{#if children}
		{@render children()}
	{/if}
</aside>
