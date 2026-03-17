<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import type { Snippet } from 'svelte';
	import { Nav, Sidebar, Sheet } from '$lib/components/layout';

	type AppShellProps = {
		map?: Snippet;
		children?: Snippet;
	};

	let { map, children }: AppShellProps = $props();
	const isDesktopQuery = new MediaQuery('min-width: 1024px', false);

	let isDesktop = $derived(isDesktopQuery.current);
	let sheetSnapIndex = $state(0);
</script>

<div
	data-testid="app-shell"
	class="bg-muted flex h-screen w-full flex-col overflow-hidden supports-[height:100dvh]:h-dvh"
>
	<Nav class="shrink-0" />

	<div data-testid="app-shell-content" class="relative min-h-0 flex-1">
		<div class={isDesktop ? 'flex h-full w-full' : 'h-full w-full'}>
			{#if isDesktop}
				<Sidebar class="static h-full shrink-0 shadow-lg">
					{@render children?.()}
				</Sidebar>
			{/if}

			<div data-testid="app-shell-map" class="h-full w-full min-w-0 flex-1">
				{@render map?.()}
			</div>
		</div>

		{#if !isDesktop}
			<div data-testid="app-shell-mobile" class="pointer-events-none absolute inset-0">
				<Sheet bind:snapIndex={sheetSnapIndex} class="pointer-events-auto z-[1200]">
					{@render children?.()}
				</Sheet>
			</div>
		{/if}
	</div>
</div>
