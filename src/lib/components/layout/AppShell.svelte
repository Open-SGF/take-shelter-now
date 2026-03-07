<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { Nav } from '$lib/components/ui/Nav';
	import { Sidebar } from '$lib/components/ui/Sidebar';
	import { Sheet } from '$lib/components/ui/Sheet';

	type AppShellProps = {
		map?: Snippet;
		children?: Snippet;
	};

	const DESKTOP_MIN_WIDTH = 1024;

	let { map, children }: AppShellProps = $props();
	let shellElement: HTMLDivElement | null = null;

	let isDesktop = $state(false);
	let sheetSnapIndex = $state(0);

	onMount(() => {
		const syncDesktopMode = () => {
			const shellWidth = shellElement?.clientWidth ?? 0;
			const viewportWidth = typeof window === 'undefined' ? 0 : window.innerWidth;
			const width = shellWidth || viewportWidth;
			isDesktop = width >= DESKTOP_MIN_WIDTH;
		};

		const resizeObserver =
			typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(syncDesktopMode);

		if (resizeObserver && shellElement) {
			resizeObserver.observe(shellElement);
		}
		window.addEventListener('resize', syncDesktopMode);

		syncDesktopMode();

		return () => {
			window.removeEventListener('resize', syncDesktopMode);
			resizeObserver?.disconnect();
		};
	});
</script>

<div
	data-testid="app-shell"
	class="flex h-screen w-full flex-col overflow-hidden bg-slate-100 supports-[height:100dvh]:h-dvh"
	bind:this={shellElement}
>
	<Nav class="shrink-0" />

	<div data-testid="app-shell-content" class="relative min-h-0 flex-1">
		{#if isDesktop}
			<div data-testid="app-shell-desktop" class="flex h-full w-full">
				<Sidebar class="static h-full shrink-0 shadow-lg">
					{@render children?.()}
				</Sidebar>

				<div data-testid="app-shell-map" class="min-w-0 flex-1">
					{@render map?.()}
				</div>
			</div>
		{:else}
			<div data-testid="app-shell-mobile" class="relative h-full w-full">
				<div data-testid="app-shell-map" class="h-full w-full">
					{@render map?.()}
				</div>

				<Sheet bind:snapIndex={sheetSnapIndex} class="z-[1200]">
					{@render children?.()}
				</Sheet>
			</div>
		{/if}
	</div>
</div>
