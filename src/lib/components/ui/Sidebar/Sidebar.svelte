<script lang="ts">
	import { cn } from '$lib/utils';
	import { hasActiveAlerts, alertBannerExpanded } from '$lib/stores/weather';

	interface Props {
		/** Width of the sidebar in pixels (320-400px recommended) */
		width?: number;
		/** Additional classes to apply to the sidebar */
		class?: string;
		/** Content to render inside the sidebar */
		children?: import('svelte').Snippet;
	}

	let { width = 360, class: className, children }: Props = $props();

	// Header height (72px) + alert banner height (~40px collapsed, ~120px expanded)
	const HEADER_HEIGHT = 72;
	const ALERT_HEIGHT_COLLAPSED = 40;
	const ALERT_HEIGHT_EXPANDED = 140;

	let topOffset = $derived(
		$hasActiveAlerts
			? HEADER_HEIGHT + ($alertBannerExpanded ? ALERT_HEIGHT_EXPANDED : ALERT_HEIGHT_COLLAPSED)
			: HEADER_HEIGHT
	);
</script>

<aside
	class={cn(
		'bg-sidebar text-sidebar-foreground fixed right-0 z-50',
		'overflow-y-auto transition-all duration-300 ease-in-out',
		'hidden md:block',
		className,
	)}
	style="width: {width}px; top: {topOffset}px; height: calc(100dvh - {topOffset}px);"
>
	{#if children}
		{@render children()}
	{/if}
</aside>
